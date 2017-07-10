gpio.write(STATUS_LED_PIN, gpio.LOW)
wifi.setmode(wifi.SOFTAP)
cfg={}
cfg.ssid='BLOCKY'..node.chipid()
wifi.ap.config(cfg)

print('Opening setup mode portal')
dofile ('dns-liar.lua')

--[[
Modified by Andy Reischle

Based on 
XChip's NodeMCU IDE
]]--

function parse_config_info(vars)
    if vars == nil or vars == '' then
        return false
    end

    local _, _, wifi_ssid = string.find(vars, 'wifi_ssid\=([^&]+)')
    local _, _, wifi_password = string.find(vars, 'wifi_password\=([^&]+)')
    local _, _, auth_key = string.find(vars, 'auth_key\=([^&]+)')

    if wifi_ssid == nil or wifi_ssid == '' or wifi_password == nil or auth_key == nil or auth_key == '' then
        return false
    end

    pwd_len = string.len(wifi_password)
    if pwd_len ~= 0 and (pwd_len < 8 or pwd_len > 64) then
        print('Password length should be between 8 and 64 characters')
        return false
    end

    print('New WiFi credentials received')
    print('-----------------------------')
    print('wifi_ssid     : ' .. wifi_ssid)
    print('wifi_password : ' .. wifi_password)
    print('auth_key : ' .. auth_key)

    file.open(FILE_CONFIG, 'w+')
    file.writeline(wifi_ssid)
    file.writeline(wifi_password)
    file.writeline(auth_key)
    file.flush()
    file.close()
    return true
end

srv=net.createServer(net.TCP) 
srv:listen(80, function(conn) 
   local responseBytes = 0
   local method=''
   local url=''
   local vars=''

   conn:on('receive',function(conn, payload)
  
    --print ('Pay load size: ' .. string.len(payload))
    --print (payload)
    if string.len(payload) > 600 then
        print('payload is too big')
        conn:send('HTTP/1.1 404 file not found')
        responseBytes = -1
        return
    end
    _, _, method, url, vars = string.find(payload, '([A-Z]+) /([^?]*)%??(.*) HTTP')  
    
    -- print('Heap   : ' .. node.heap())
    -- print('Payload: ' .. payload)
    -- print('Method : ' .. method)
    -- print('URL    : ' .. url)
    -- print('Vars   : ' .. vars  .. '\n\n\n')


    -- Check if wifi-credentials have been supplied
    if vars~=nil and parse_config_info(vars) then
        print('Saved config. Now restart.')
        node.restart()
    end

    if url == 'favicon.ico' then
        conn:send('HTTP/1.1 404 file not found')
        responseBytes = -1
        return
    end    

    -- Only support one sending one file
    url='index.html'
    responseBytes = 0
	
    conn:send('HTTP/1.1 200 OK\r\n\r\n')
	
  end)
  
  conn:on('sent',function(conn) 
    if responseBytes>=0 and method=='GET' then
        if file.open(url, 'r') then            
            file.seek('set', responseBytes)
            local line=file.read(512)
            file.close()
            if line then
                conn:send(line)
                responseBytes = responseBytes + 512    

                if (string.len(line)==512) then
                    return
                end
            end
        end        
    end

    conn:close() 
  end)
end)
print('HTTP Server: Started')
print(collectgarbage("count").." kB used")


