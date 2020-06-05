load('api_arduino_onewire.js');
load('api_arduino_dallas_temp.js');

let TEMP_PIN = 21;
let DEFAULT_WATER_TEMP = 25; // Default temperature (reference value used for temperature compensation)

// Initialize 1-Wire bus
let ow = OneWire.create(TEMP_PIN);
// Initialize DallasTemperature library
let dt = DallasTemperature.create(ow);
// Start up the library
dt.begin();

/**
 * Get an integer value of temperature from ds18b20 sensor in degrees C
 */
let getTempValue = function(){
    let addr = Sys._sbuf(8);
    let val = DEFAULT_WATER_TEMP;
  
    if (dt.getAddress(addr, 0) === 1) {
        dt.toHexStr(addr)
        dt.requestTemperatures();
        val = dt.getTempC(addr);
    } 
    return Math.round(val);   
};

/**
 * Get the number of sensors found on the 1-Wire bus
 */
let getNumTempSensors = function(){
    return dt.getDeviceCount();
};