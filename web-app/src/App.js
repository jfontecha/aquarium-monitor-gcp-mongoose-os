import React from 'react';
//import logo from './logo.svg';
import './App.css';

import firebase from './utils/firebaseConfig.js';

/*
const db = firebase.database();
  
    // Create listeners
    const devicesRef = db.ref('/devices');
    */

class App extends React.Component{
  state = {
    someData: {}
  };

  componentDidMount() {
    // Updating the `someData` local state attribute when the Firebase Realtime Database data
    // under the '/someData' path changes.
    this.firebaseRef = firebase.database().ref('/devices');
    this.firebaseCallback = this.firebaseRef.on('value', (snap) => {      
      this.setState({ someData: snap.val() });
    });
  }
  
  componentWillUnmount() {
    // Un-register the listener on '/someData'.
    this.firebaseRef.off('value', this.firebaseCallback);
  }
  
  render(){
    return (
      <div>Num dispositivos: { this.state.someData.length }</div>
    );
  }
}

export default App;
