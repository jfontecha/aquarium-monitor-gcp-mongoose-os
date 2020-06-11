/*
 * Aquarium Monitor by Jesus Fontecha
 */

// Load Mongoose OS APIs
//load('api_dash.js');
//load('api_events.js');
//load('api_shadow.js');

load('api_timer.js');

// Load IoT Google Cloud and MQTT libraries
load('api_config.js');
load('api_mqtt.js');
load('api_net.js');
load('api_sys.js');

//load my manager libraries
load('display_manager.js');
load('tds_manager.js');
load('temperature_manager.js');

// values to measure
let temperature = 0;
let tds = 0;
let ph =0;

let timestring = "";

// topic name
let deviceName = Cfg.get('device.id');
let topic = '/devices/' + deviceName + '/events';
print('Topic: ', topic);
let isConnected = false;

let getInfo = function() {
  return JSON.stringify({
    temp: temperature,
    tds: tds,
    ph: 6.5
    /*temp: dht.getTemp(),
    hum: dht.getHumidity()*/
  });
};

/* SDD1306 Display update */
let setDisplay = function() {

  clearDisplay();

  /* SHOW TITLE */
  updateMessageDisplay(1, 0, 0, "Aquarium Monitor v.1");
  /* SHOW TDS */
  drawRoundRectangle(0, 16, 53, 23, 3);
  updateMessageDisplay(1, 6, 19, "TDS");
  updateMessageDisplay(1, 6, 29, JSON.stringify(tds));
  updateMessageDisplay(1, 32, 29, "ppm");
  /* SHOW PH */
  drawRoundRectangle(0, 41, 53, 13, 3);
  updateMessageDisplay(1, 6, 44, "PH " + JSON.stringify(6));
  /* SHOW TIME */
  updateMessageDisplay(1, 3, 57, timestring);
   /* SHOW TEMPERATURE */
  updateMessageDisplay(1, 60, 16, "Water Temp.");
  updateMessageDisplay(3, 80, 29, JSON.stringify(temperature));
  drawCircle(120, 32, 3);

  updateDisplay();
};

/* Publication of data through MQTT every 60 seconds (60*1000) */
Timer.set(60*1000, true, function() {
  if (isConnected) {
    //calculate average of measures! (ej tds)
    publishData();
  }
},null);

/* Display update every 5 seconds */
Timer.set(5000, Timer.REPEAT, function() {
  //Get temperature value in C degrees
  temperature = getTempValue();
  //Get TDS value with temperature compensation
  tds = getTDSValue(temperature);

  let now = Timer.now();
  timestring = Timer.fmt("%d/%m/%Y %H:%M %p", now);

  setDisplay();

  print('Info: ', getInfo());
},null);

/* Get timestamp every second */
//Timer.set(1000 /* milliseconds */, Timer.REPEAT, function() {
//  let now = Timer.now();
//  timestring = Timer.fmt("%d/%m/%Y %H:%M:%p", now);

//  setDisplay();
//}, null);

/* MQTT event handler to publish data if connected */
MQTT.setEventHandler(function(conn, ev) {
  if (ev === MQTT.EV_CONNACK) {
    print('CONNECTED');
    isConnected = true;
    publishData();
  }
}, null);

/* Data publication in the topic via MQTT */
function publishData() {
  let ok = MQTT.pub(topic, getInfo());
  if (ok) {
    print('Published');
  } else {
    print('Error publishing');
  }
}

// Monitor network connectivity.
/*Net.setStatusEventHandler(function(ev, arg) {
  let evs = '???';
  if (ev === Net.STATUS_DISCONNECTED) {
    evs = 'DISCONNECTED';
  } else if (ev === Net.STATUS_CONNECTING) {
    evs = 'CONNECTING';
  } else if (ev === Net.STATUS_CONNECTED) {
    evs = 'CONNECTED';
  } else if (ev === Net.STATUS_GOT_IP) {
    evs = 'GOT_IP';
  }
  print('== Net event:', ev, evs);
}, null);*/

/* Get PH Value */
//Timer.set(2000 /* milliseconds */, Timer.REPEAT, function() {
  
//  tds = getTDSValue(WATER_TEMP);
 
//  print ("Valor de TDS: ",tds);
 
//  setDisplay();

  //let phVoltage = ADC.read(PH_PIN) * 5.0/1024/6;
  //phValue=3.5*phVoltage;
  //phVal = 7 - (2.5 - Po) * m;

  //phValue = phVoltage;

  //let phVoltage = analogRead(adcPin) * 5.0 / 1024;
  //let m = -5.436;
  //phValue = 7 - (2.5 - phVoltage) * m;
  
  //let phVoltage = ADC.read(PH_PIN)*5.0/1024/6;
  //print('Raw Po voltage: ', phVoltage);
  
//}, null);


/*
Event.on(Event.CLOUD_CONNECTED, function() {
  online = true;
  Shadow.update(0, {ram_total: Sys.total_ram()});
}, null);

Event.on(Event.CLOUD_DISCONNECTED, function() {
  online = false;
}, null);
*/
