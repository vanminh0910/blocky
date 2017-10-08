Blockly.Blocks['io_pin_mode'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("set pin")
        .appendField(new Blockly.FieldNumber(5), "pin");
    this.appendDummyInput()
        .appendField("mode")
        .appendField(new Blockly.FieldDropdown([["input","INPUT"], ["output","OUTPUT"], ["input pullup","INPUT_PULLUP"], ["interrupt","INT"]]), "mode");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_digital_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("digital read pin")
        .appendField(new Blockly.FieldNumber(5, 0), "pin");
    this.setOutput(true, null);
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_digital_write'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("digital write pin")
        .appendField(new Blockly.FieldNumber(0, 0), "pin")
        .appendField("to")
        .appendField(new Blockly.FieldDropdown([["high","HIGH"], ["low","LOW"]]), "value");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_read_analog'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("read analog");
    this.setOutput(true, "Number");
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_analog_write'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("analog write pin")
        .appendField(new Blockly.FieldNumber(0, 0, 1023), "value");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_pin_event'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("when pin")
        .appendField(new Blockly.FieldNumber(0, 0), "pin")
        .appendField("pulsed")
        .appendField(new Blockly.FieldDropdown([["low","down"], ["high","up"]]), "value");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(270);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['timer_delay'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("wait for")
        .appendField(new Blockly.FieldNumber(100, 0, 200000), "value")
        .appendField(new Blockly.FieldDropdown([["seconds","SECONDS"], ["millisecond","MILLIS"], ["microsecond","MICROS"]]), "TIME_UNIT")
        .appendField("(not recommend)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['timer_now'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("get current time (microseconds)");
    this.setOutput(true, "Number");
    this.setColour(20);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['timer_event'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["every","tmr.ALARM_AUTO"], ["after","tmr.ALARM_SINGLE"]]), "when")
        .appendField(new Blockly.FieldNumber(1, 0), "time")
        .appendField(new Blockly.FieldDropdown([["seconds","SECONDS"], ["milliseconds","MILLIS"], ["microseconds","MICROS"]]), "TIME_UNIT");
    this.appendDummyInput()
        .appendField("Blocky will");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['blockycloud_send_message'] = {
  init: function() {
    this.appendValueInput("message")
        .setCheck(null)
        .appendField("send to topic")
        .appendField(new Blockly.FieldTextInput("topic"), "topic")
        .appendField("message");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(165);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['blockycloud_on_message_received'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("when receive topic")
        .appendField(new Blockly.FieldTextInput("topic"), "topic")
        .appendField(", save message to")
        .appendField(new Blockly.FieldVariable("message"), "message")
        .appendField("as")
        .appendField(new Blockly.FieldDropdown([["string","STRING"], ["number","NUMBER"]]), "type");
    this.appendDummyInput()
        .appendField("do");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(165);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pwm_setup'] = {
  init: function() {
    this.appendValueInput("duty")
        .setCheck("Number")
        .appendField("Setup pwm for pin")
        .appendField(new Blockly.FieldNumber(0, 0), "pin")
        .appendField("frequency")
        .appendField(new Blockly.FieldNumber(1000, 1, 1000), "frequency")
        .appendField("duty cyle");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pwm_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Start pwm for pin")
        .appendField(new Blockly.FieldNumber(0, 0), "pin");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pwm_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Stop pwm for pin")
        .appendField(new Blockly.FieldNumber(0, 0), "pin");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['pwm_set_duty'] = {
  init: function() {
    this.appendValueInput("duty")
        .setCheck("Number")
        .appendField("Change pwm cycle of pin")
        .appendField(new Blockly.FieldNumber(0, 0), "pin")
        .appendField("to value");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(45);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['blockycloud_send_log'] = {
  init: function() {
    this.appendValueInput("message")
        .setCheck(null)
        .appendField("send log message");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(165);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['i2c_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Initialize i2c, set pin")
        .appendField(new Blockly.FieldNumber(1), "SCL")
        .appendField("as scl, set pin")
        .appendField(new Blockly.FieldNumber(2), "SDA")
        .appendField("as sda");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Initialize the I²C module");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['i2c_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Start i2c");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Send an I²C start condition");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['i2c_address'] = {
  init: function() {
    this.appendValueInput("ADDR")
        .setCheck(null)
        .appendField("Setup i2c address");
    this.appendDummyInput()
        .appendField("direction")
        .appendField(new Blockly.FieldDropdown([["read","READ"], ["write","WRITE"]]), "DIR");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Setup I²C address and read/write mode for the next transfer");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['i2c_read'] = {
  init: function() {
    this.appendValueInput("LEN")
        .setCheck("Number")
        .appendField("i2c read");
    this.appendDummyInput()
        .appendField(" byte(s)");
    this.setOutput(true, "String");
    this.setColour(120);
 this.setTooltip("Read data for variable number of bytes");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['i2c_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Stop i2c");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Send an I²C stop condition");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['i2c_write'] = {
  init: function() {
    this.appendValueInput("DATA")
        .setCheck(null)
        .appendField("i2c write data");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
 this.setTooltip("Write data to I²C bus");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['neopixel_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup neopixel");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Setup neopixel before it can run");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['neopixel_set_brightness'] = {
  init: function() {
    this.appendValueInput("BRIGHT")
        .setCheck("Number")
        .appendField("Set all leds brightness to");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Set brightness of led matrix, from 0 to 255");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['neopixel_set_color_all'] = {
  init: function() {
    this.appendValueInput("COLOR")
        .setCheck(null)
        .appendField("Set color for all leds to ");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Set color of led matrix for single led");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['neopixel_set_color'] = {
  init: function() {
    this.appendValueInput("POS")
        .setCheck("Number")
        .appendField("Set color at");
    this.appendValueInput("COLOR")
        .setCheck(null)
        .appendField("to color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Set brightness of led matrix, from 0 to 255");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup MP3 player");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Setup MP3 player before it can run");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_reset'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Reset MP3 player");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_play'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("Play song");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Stop MP3 player");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_next'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move to next song");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_previous'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move to previous song");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_set_volume'] = {
  init: function() {
    this.appendValueInput("VOLUME")
        .setCheck("Number")
        .appendField("Set volume to");
    this.appendDummyInput()
        .appendField("(0-30)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("volume from 0-30");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_volume_up'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn volume up");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_volume_down'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn volume down");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_loop'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("Play loop song");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mp3player_set_eq'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Set EQ mode to")
        .appendField(new Blockly.FieldDropdown([["Normal","NORMAL"], ["Pop","POP"], ["Rock","ROCK"], ["Jazz","JAZZ"], ["Classic","CLASSIC"], ["Base","BASE"]]), "MODE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['motor_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup motor");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Setup motor module before it can be used");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['motor_set_speed'] = {
  init: function() {
    this.appendValueInput("CHANNEL")
        .setCheck("Number")
        .appendField("Set motor channel (1-4)");
    this.appendValueInput("DIR")
        .setCheck("Number")
        .appendField("to turn (0-360 degree)");
    this.appendValueInput("SPEED")
        .setCheck("Number")
        .appendField("with speed (0-255)");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_expander_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup IO expander module");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_expander_set_mode'] = {
  init: function() {
    this.appendValueInput("CHANNEL")
        .setCheck("Number")
        .appendField("Set IO expander channel");
    this.appendDummyInput()
        .appendField("to mode")
        .appendField(new Blockly.FieldDropdown([["Analog Input","ADC"], ["Analog Input Pullup","ADC_PULLUP"], ["Digital Input","IO_INPUT"], ["Digital Input Pullup","IO_INPUT_PULLUP"], ["Digital Output","IO_OUTPUT"], ["PWM Output","PWM"]]), "MODE");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_expander_set_data'] = {
  init: function() {
    this.appendValueInput("CHANNEL")
        .setCheck("Number")
        .appendField("Set data of channel (1-6)");
    this.appendValueInput("DATA")
        .setCheck("Number")
        .appendField("to value");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("PWM mode accepts value 0-255, Digital Output 0-1, Servo 700-3000 ");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['io_expander_get_data'] = {
  init: function() {
    this.appendValueInput("CHANNEL")
        .setCheck("Number")
        .appendField("Get data of channel (1-6)");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ir_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup IR module");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ir_learn'] = {
  init: function() {
    this.appendValueInput("ID")
        .setCheck("Number")
        .appendField("Enter learn mode for command");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['ir_send'] = {
  init: function() {
    this.appendValueInput("ID")
        .setCheck("Number")
        .appendField("Send IR command");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['button'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When button at pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN")
        .appendField("is pressed");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['button_released'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When button at pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN")
        .appendField("is released");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['light_ldr'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Photocell light level");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['light_bh1750_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup BH1750 light sensor");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['temp_dht_read_temp'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("DHT temperature (°C) on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['temp_dht_read_humid'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("DHT humidity (%) on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['temp_am2320_setup'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Setup AM2320 temperature sensor");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['temp_am2320_read_temp'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("AM2320 temperature (°C)");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['temp_am2320_read_humid'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("AM2320 humidity (%)");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['moisture_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Soil moisture level");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['motion_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When motion detected on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['gas_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("gas level");
    this.setOutput(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['touch_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When touch sensor on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN")
        .appendField("detects touch");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['touch_released'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When touch sensor on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN")
        .appendField("detects touch released");
    this.appendStatementInput("handler")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['current_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("current level");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['buzzer_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn on buzzer on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['buzzer_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn off buzzer on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['relay_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn off relay on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mosfet_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn on mosfet on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['mosfet_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn off mosfet on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['led_off'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn off LED on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['led_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn on LED on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['light_bh1750_read'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("BH1750 light level");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['relay_on'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn on relay on pin")
        .appendField(new Blockly.FieldNumber(5, 0), "PIN");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
