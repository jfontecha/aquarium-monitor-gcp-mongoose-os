export { getOnlyCompleteHour, getWaterLimits };

/* Water paremeters: default values */
const MIN_WATER_TEMP = 23;
const MAX_WATER_TEMP = 27;
const MAX_TDS = 350; 
const MIN_TDS = 150;  //Shrimps live better with low TDS values
const RECOMMENDED_PH = 6.5;

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

function getOnlyCompleteHour(timestamp){

  var d = new Date(new Date(timestamp).toLocaleString());
  var h = addZero(d.getHours());
  var m = addZero(d.getMinutes());
  var s = addZero(d.getSeconds());
  return (h + ":" + m + ":" + s);
}

function getWaterLimits(){

    var limits = {max_water_temp: MAX_WATER_TEMP, 
                min_water_temp: MIN_WATER_TEMP,
                max_tds: MAX_TDS,
                min_tds: MIN_TDS,
                recommended_ph: RECOMMENDED_PH};
    return limits;
}