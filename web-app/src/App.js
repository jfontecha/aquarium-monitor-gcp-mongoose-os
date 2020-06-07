import React from 'react';
import './App.css';

import RealTime from './components/RealTime';

/*
const db = firebase.database();
  
    // Create listeners
    const devicesRef = db.ref('/devices');
    */

class App extends React.Component{
  
  componentDidMount() {
    
  }
  
  componentWillUnmount() {
    // Un-register the listener on '/someData'.
    //deviceRef.off('value', this.firebaseCallback);
  }
  
  render(){
    return (
      <div>
        <RealTime />
      </div>
    );
  }
}

export default App;
