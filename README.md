# Build an Aquarium Monitor using Google Cloud IoT Core, Firebase tools and Mongoose OS

WebApp: https://iot-aquarium-monitor.firebaseapp.com/  
This project is originally based on https://github.com/alvarowolfx/weather-station-gcp-mongoose-os

### Setup Google cloud tools and project

* Install gcloud components:
    * `gcloud components install`
* Authenticate with Google Cloud:
    * `gcloud auth login`
* Create cloud project — choose your unique project name:
    * `gcloud projects create YOUR_PROJECT_NAME`
* Set current project
    * `gcloud config set project YOUR_PROJECT_NAME`

### Create IoT Core resources

* Add permissions for IoT Core
    * `gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME --member=serviceAccount:cloud-iot@system.gserviceaccount.com --role=roles/pubsub.publisher`
* Create PubSub topic for device data:
    * `gcloud pubsub topics create telemetry-topic`
* Create PubSub subscription for device data:
    * `gcloud pubsub subscriptions create --topic telemetry-topic telemetry-subscription`
* Create device registry:
    * `gcloud iot registries create YOUR_REGISTRY_ID --project=YOUR_PROJECT_ID --region=us-central1 --event-notification-config=topic=projects/YOUR_PROJECT_ID/topics/telemetry-topic`

Access https://console.cloud.google.com/ to check the new configuration.

### Upload firmware with Mongoose OS Tools

To use it we need to download and install it from the official website. Follow the installation instructions on https://mongoose-os.com/docs/quickstart/setup.html.

* `mos build` or `mos build --arch esp32`
* `mos flash`

### Provision and config

* `mos wifi YOUR_SSID YOUR_PASS`
* `mos gcp-iot-setup --gcp-project YOUR_PROJECT --gcp-region europe-west1 --gcp-registry YOUR_REGISTRY`


### Setup BigQuery Dataset and Table

Here we will use it to store all of ours collected sensor data to run some queries and to build reports later using Data Studio. To start let’s create a Dataset and a Table store our data. To do this, open the BigQuery Web UI, and follow the instructions:

* Access BigQuery (https://console.cloud.google.com/bigquery)
* In the bottom window click on “Create new dataset”.
* Name you Dataset e.g. “aquarium_monitor_dataset”.
* Create a Table e.g. “raw_data” with the following fields and types:

|Field name | Type | Mode
|--- | --- | ---
|deviceId | String | Required
|timestamp | TimeStamp | Required
|temp | Fload | Required
|ph | Float | Required
|tds | Float | Required

### Setup Firebase, deploy functions and webapp
These tools are installed by using npm package manager. You need to have node.js installed in your computer.

* `npm install -g firebase-tools` or `yarn global add firebase-tools`
* `firebase init` (You have to choose the tools to be configured! e.g. database, functions and hosting)
* `firebase functions:config:set bigquery.datasetname="weather_station_iot" bigquery.tablename="raw_data"` (only in case you have the dataset and the table as environment vars)
* `firebase deploy`

Access https://console.firebase.google.com/ to check the new configuration.
