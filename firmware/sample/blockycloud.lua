-- Easytech Cloud Library
-- Written 2017 by Minh Ha (vanminh0910@gmail.com)
-- Licensed unter MIT

local moduleName = ... 
local M = {}
_G[moduleName] = M

local event = {}
event.register = 'register'
event.ota = 'ota'
event.firmware_upgrade = 'firmware_upgrade'
event.reboot = 'reboot'
--local host = 'drive.google.com'
local host = '192.168.1.110'
local port = 8080
local mqtt_broker = 'mqtt.easytech.vn'
local mqtt_port = 1883
local auth_key
local status = 0 -- 0: not connected   1: connected  2: offline
local message_handlers = {}


function M.connect(auth_key_input, callback)
    auth_key = auth_key_input
	-- initiate the mqtt client and set keepalive timer to 120sec
    mqtt = mqtt.Client(auth_key .. 'aaaa' .. node.chipid(), 120, 'seagull', 'seagull')

    mqtt:on('connect', function(con) 
        print ('MQTT connected') 
    end)

    mqtt:on('offline', function(con) 
        print ('MQTT offline') 
        status = 2
    end)

    -- on receive message
    mqtt:on('message', function(conn, topic, data)
        print(topic .. ':' )
        if data ~= nil then
            print(data)
        end
        if topic == M.get_topic(event.ota) then
            -- process ota event
            print('Received ota request')
            print('File ota: ' .. data)
            file.open(FILE_OTA_LINK, 'w')
            file.writeline(data)
            file.flush()
            print('File ota saved and will reboot now')
            node.restart()
        elseif topic == M.get_topic(event.reboot) then
            print('Received reboot request')
            node.restart()
        else
            --for key,value in pairs(message_handlers) do print(key,value) end
            message_handlers[topic](topic, data)
        end
        
    end)

    mqtt:connect(mqtt_broker, mqtt_port, 0, function(conn) 
        print('Server connected. Now send discover message')
        local register_topic = auth_key ..  '/' .. event.register
        local register_payload = '{"chipId": "' .. node.chipid() .. '"}'
        mqtt:publish(register_topic, register_payload, 0, 0, function(conn) 
            print('Discover message sent') 
            mqtt:subscribe(M.get_topic(event.firmware_upgrade), 0, function()
                print('Subscribed to firmware upgrade event')                        
            end)
            mqtt:subscribe(M.get_topic(event.reboot), 0, function()
                print('Subscribed to reboot event')                
            end)
            mqtt:subscribe(M.get_topic(event.ota), 0, function()
                print('Subscribed to ota event')
                status = 1
            end)
            callback()
        end)
    end)
end

function M.get_topic(topic)
    return auth_key .. '/' .. node.chipid() .. '/' .. topic
end

function M.get_status()
    return status
end

function M.subscribe(topic, handler)
    mqtt:subscribe(auth_key .. '/' .. topic, 0, nil)
    if handler ~= nil then
        message_handlers[auth_key .. '/' .. topic] = handler
        --for key,value in pairs(message_handlers) do print(key,value) end
    end
end

function M.sendMessage(topic, message)
    print('topic to publish: ' .. auth_key .. '/' .. topic)
    mqtt:publish(auth_key .. '/' .. topic, message, 0, 0, function(conn)
        print('Message sent')
    end);
end

function M.download(ota_info, path, callback)
    --ota_file = '/open?id=0BwTP4yjGOx_4NHd3R21xX3VMNFE'
    --ota_file = 'static/test.txt'
    print('ota info is ' .. ota_info)
    local downLoadInfo = sjson.decode(ota_info)
    local fileTemp = 'ota_temp.lua'
	file.remove(fileTemp)
	file.open(fileTemp, "w+")
    
    payloadFound = false
    conn = net.createConnection(net.TCP, 0) -- tls.createConnection() 
   
    conn:on("receive", function(conn, payload)
        print("Received data")
        print(payload)
        print(string.sub(payload,0, string.find(payload,"\r\n\r\n") + 14))
        if (payloadFound == true) then
            --print(payload)
            file.write(payload)
            file.flush()
        else
            if (string.find(payload,"\r\n\r\n") ~= nil) then
                file.write(string.sub(payload,string.find(payload,"\r\n\r\n") + 4))
                print(string.sub(payload,string.find(payload,"\r\n\r\n") + 4))
                file.flush()
                payloadFound = true
            end
        end
    
        payload = nil
        collectgarbage()
    end)
    conn:on("disconnection", function(conn) 
        print("Disconnected")
        conn = nil
        file.close()
        -- copy temp file to be main user code file
        file.remove(path)
	    file.rename(fileTemp, path)
        callback("ok")
    end)
    conn:on("connection", function(conn)
        print("Connected")
        conn:send("GET /".. downLoadInfo.path .." HTTP/1.1\r\n"..
              "Host: "..host.."\r\n"..
              "Connection: close\r\n"..
              "Accept-Charset: utf-8\r\n"..
              "Accept-Encoding: \r\n"..
              "User-Agent: Mozilla/4.0 (compatible; esp8266 Lua; Windows NT 5.1)\r\n".. 
              "Accept: */*\r\n\r\n")
    end)

	conn:connect(downLoadInfo.port, downLoadInfo.host)
end

return M
