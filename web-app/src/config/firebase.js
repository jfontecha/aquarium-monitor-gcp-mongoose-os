//import firebase from 'firebase/app';
//import 'firebase/auth';
//import 'firebase/database';
//import 'firebase/datastore';

import firebase from 'firebase';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
}

firebase.initializeApp(config);

//export const devicesRef = firebase.database.ref('devices/esp32_5B3BD8');

export default firebase;

export const REF_DATABASE = 'devices/esp32_5B3BD8';

//export const devicesRef = firebase.database.ref('devices/esp32_5B3BD8');