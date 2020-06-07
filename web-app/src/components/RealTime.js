import React from 'react';

import firebase from '../config/firebase.js';

const LIMIT_CHART_VALUES = 50;

/*
const db = firebase.database();
  
    // Create listeners
    const devicesRef = db.ref('/devices');
    */

class RealTime extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      devices: [] 
    };

    
    this.newState = [];
  }

  componentDidMount() {
    // Updating the `someData` local state attribute when the Firebase Realtime Database data
    // under the '/someData' path changes.
    const deviceRef = firebase.database().ref('devices');
    deviceRef.on('value', (snap) => {   
      let devices = snap.val();
      //let newState = [];
      for (let device in devices){
        if (this.newState.length === LIMIT_CHART_VALUES){
          this.newState.shift();
        }
        this.newState.push({
          id: device,
          temp: devices[device].temp,
          tds: devices[device].tds,
          ph: devices[device].ph,
          timeStamp: devices[device].lastTimestamp

        });
      }
      this.setState({ devices: this.newState });
    });
  }
  
  componentWillUnmount() {
    // Un-register the listener on '/someData'.
    //deviceRef.off('value', this.firebaseCallback);
  }
  
  render(){
    return (
      <div>
        <section id="normal">
          <div>
            <h1>Devices</h1>
            {this.state.devices.map((device)=>{
              return(
                <div>
                  <p>ID: {device.id}</p>
                  <p>Temperature: {device.temp}</p>
                  <p>TDS: {device.tds}</p>
                  <p>PH: {device.ph}</p>
                  <p>Last timestamp: {device.timeStamp}</p>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    );
  }
}

export default RealTime;
