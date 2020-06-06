import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
//import 'firebase/datastore';

const config = {
    apiKey: "AIzaSyArWiktUY_i_uw97Hvb6PDkAq-I9qxqd4Y",
    authDomain: "iot-aquarium-monitor.firebaseapp.com",
    databaseURL: "https://iot-aquarium-monitor.firebaseio.com",
    projectId: "iot-aquarium-monitor",
    storageBucket: "iot-aquarium-monitor.appspot.com",
    messagingSenderId: "288243902252",
    appId: "1:288243902252:web:51fed41847c29a73fd6e89",
    measurementId: "G-NB2LX1W8FP"
}

export default firebase.initializeApp(config);