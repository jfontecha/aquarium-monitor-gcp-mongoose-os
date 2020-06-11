const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

admin.initializeApp(functions.config().firebase);

const db = admin.database();

/**
 * Receive data from pubsub, then 
 * Write telemetry raw data to bigquery
 * Maintain last data on firebase realtime database
 */
exports.receiveTelemetry = functions.pubsub
  .topic('telemetry-topic')
  .onPublish((message, context) => {
    const attributes = message.attributes;
    const payload = message.json;

    const deviceId = attributes['deviceId'];

    const data = {
      tds: payload.tds,
      ph: payload.ph,
      temp: payload.temp,
      deviceId: deviceId,
      timestamp: context.timestamp
    };

    if (
      payload.temp > 100 ||
      payload.temp < -50
    ) {
      // Validate and do nothing
      return 0;
    }

    return Promise.all([
      insertIntoBigquery(data),
      updateCurrentDataFirebase(data)
    ]);
  });

/** 
 * Save last status in firebase
*/
function updateCurrentDataFirebase(data) {
  return db.ref(`/devices/${data.deviceId}`).set({
    temp: data.temp,
    tds: data.tds,
    ph: data.ph,
    timestamp: data.timestamp
  });
}

/**
 * Store all the raw data in bigquery
 */
function insertIntoBigquery(data) {
  // TODO: Make sure you set the `bigquery.datasetname` Google Cloud environment variable.
//  const dataset = bigquery.dataset(functions.config().bigquery.datasetname);
  // TODO: Make sure you set the `bigquery.tablename` Google Cloud environment variable.
//  const table = dataset.table(functions.config().bigquery.tablename);

    //New
    const dataset = bigquery.dataset('aquarium_monitor_dataset');
    const table = dataset.table('raw_data');
    //End new

  return table.insert(data);
}

/**
 * Query bigquery with the last 7 days of data
 * HTTPS endpoint to be used by the webapp
 */
exports.getReportData = functions.https.onRequest((req, res) => {
  const projectId = process.env.GCLOUD_PROJECT;
// const datasetName = functions.config().bigquery.datasetname;
// const tableName = functions.config().bigquery.tablename;

//New
const datasetName = 'aquarium_monitor_dataset';
const tableName = 'raw_data';
//End new

  const table = `${projectId}.${datasetName}.${tableName}`;

  const query = `
    SELECT 
      TIMESTAMP_TRUNC(data.timestamp, HOUR, 'Europe/Madrid') data_hora,
      avg(data.temp) as avg_temp,
      avg(data.tds) as avg_tds,
      avg(data.ph) as avg_ph,
      min(data.temp) as min_temp,
      max(data.temp) as max_temp,
      min(data.tds) as min_tds,
      max(data.tds) as max_tds,
      min(data.ph) as min_ph,
      max(data.ph) as max_ph,
      count(*) as data_points      
    FROM \`${table}\` data
    WHERE data.timestamp between timestamp_sub(current_timestamp, INTERVAL 7 DAY) and current_timestamp()
    group by data_hora
    order by data_hora
  `;

  return bigquery
    .query({
      query: query,
      useLegacySql: false
    })
    .then(result => {
      const rows = result[0];

      cors(req, res, () => {
        res.json(rows);
      });
    });
});