function reboot_to_setup()
    file.open(FILE_BOOT_SETUP, 'w')
    file.writeline('')
    file.flush()   
    file.close()
    node.restart()
end

function run_setup()
    dofile('setup.lua')
end

function run_user_code()
    dofile(FILE_USER_CODE)
end

function read_config_file()
    local wifi_ssid
    local wifi_password
    local auth_key

    if file.open(FILE_CONFIG, 'r') then
        wifi_ssid = file.read('\n')
        wifi_ssid = string.format('%s', wifi_ssid:match( '^%s*(.-)%s*$' ))
        wifi_password = file.read('\n')
        wifi_password = string.format('%s', wifi_password:match( '^%s*(.-)%s*$' ))
        auth_key = file.read('\n')
        auth_key = string.format('%s', auth_key:match( '^%s*(.-)%s*$' ))
        file.close()
    end

    if wifi_ssid ~= nil and wifi_ssid ~= '' and wifi_password ~= nil and auth_key ~= nil and auth_key ~= '' then
        return wifi_ssid, wifi_password, auth_key
    end
    return nil, nil, nil
end

function check_ota(callback)
    print('Checking OTA link')
    if file.open(FILE_OTA_LINK, 'r') then
        print('OTA link exists. Start downloading')
        local ota_file_url = file.readline()
        blockycloud.download(ota_file_url, FILE_USER_CODE, function (result)
            if result == 'ok' then
                print('Finished downloading')
                file.remove(FILE_OTA_LINK)
            end
            callback()
        end)
    else
        callback()
    end
end

function connect_server(auth_key)
    print('Now connecting to blocky cloud server')
    local connect_attempt = 0
    blockycloud.connect(auth_key, function() print('OK') end)
    tmr.alarm(0, 500, 1, function()
        connect_attempt = connect_attempt + 1
        if connect_attempt > 55 then
            tmr.stop(0)
            print('Failed to connect to blocky cloud')
            run_setup()
        end
        if blockycloud.get_status() == 0 then
            print('.')
        elseif blockycloud.get_status() == 1 then
            tmr.stop(0)
            print('Connected to blocky cloud')
            run_user_code()
        end
    end)
end

function try_connecting(wifi_ssid, wifi_password, auth_key)
    wifi.setmode(wifi.STATION)
    local station_cfg = {}
    station_cfg.ssid = wifi_ssid
    station_cfg.pwd = wifi_password
    wifi.sta.config(station_cfg)
    wifi.sta.autoconnect (1)
    local connect_attempt = 0
    
    print('Connecting to wifi network...')

    tmr.alarm(0, 500, 1, function()
        connect_attempt = connect_attempt + 1
        if connect_attempt > 20 then
            tmr.stop(0)
            print('Failed to connect to \'' .. wifi_ssid .. '\'')
            run_setup()
        end

        if wifi.sta.getip()==nil then
            print('...')
        else
            tmr.stop(0)
            print('Connected as: ' .. wifi.sta.getip())
            -- load cloud module
            blockycloud = require("blockycloud")
            -- check ota link
            check_ota(function() connect_server(auth_key) end)           
        end
    end)
end


-------------------------------- main code starts here -----------------------

STATUS_LED_PIN = 4
CONFIG_PIN = 3
FILE_CONFIG = 'config'
FILE_USER_CODE = 'user_code.lua'
FILE_OTA_LINK = 'ota_link'
FILE_BOOT_SETUP = 'boot_setup'

-- turn off status led
ws2812.init()
ws2812.write(string.char(0, 0, 0, 255))

gpio.mode(STATUS_LED_PIN, gpio.OUTPUT)
gpio.write(STATUS_LED_PIN, gpio.HIGH)

gpio.mode(CONFIG_PIN, gpio.INT)
gpio.trig(CONFIG_PIN, 'down', function(level)
    gpio.trig(CONFIG_PIN, 'none', function() end)
    print('Config mode triggered. Reboot to config mode now')
    reboot_to_setup()
end)

-- check if boot to setup mode is triggered
if file.exists(FILE_BOOT_SETUP) then
    file.remove(FILE_BOOT_SETUP)
    run_setup()
else
    -- load config to get wifi info and authentication key
    wifi_ssid, wifi_password, auth_key = read_config_file()

    if wifi_ssid ~= nil and wifi_password ~= nil and auth_key ~= nil then
        print('')
        print('Retrieved stored WiFi credentials')
        print('---------------------------------')
        print('wifi_ssid     : ' .. wifi_ssid)
        print('wifi_password : ' .. wifi_password)
        print('auth_key : ' .. auth_key)
        print('')
        try_connecting(wifi_ssid, wifi_password, auth_key)
    else
        run_setup()
    end
end


