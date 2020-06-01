load('api_adc.js');

let TDS_PIN = 36;
let VREF = 3.3; //Voltage reference value

let ecCalibration = 1; // coefficient for calibration
let ec = 0; // coefficient for temperature compensation
let tdsValue = 0;

let enabled = ADC.enable(TDS_PIN);

/**
 * Get an integer value from TDS sensors with voltage and temperature compensation
 * @param {number} waterTemp - Reference temperature value for temperature compensation
 */
let getTDSValue = function(waterTemp) {

    let rawEc = ADC.read(TDS_PIN) * VREF / 1024.0; // read the analog value more stable by the median filtering algorithm, and convert to voltage value
    let temperatureCoefficient = 1.0 + 0.02 * (waterTemp - 25.0); // temperature compensation formula: fFinalResult(25^C) = fFinalResult(current)/(1.0+0.02*(fTP-25.0));
    ec = (rawEc / temperatureCoefficient) * ecCalibration; // temperature and calibration compensation
    tdsValue = (133.42 * ec * ec * ec - 255.86 * ec * ec + 857.39 * ec) * 0.5; //convert voltage value to tds value
  
    return Math.round(tdsValue); //return the tds value with the nearest integer
}

