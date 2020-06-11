import React from 'react';
import './styles.css';

import RealTime from './components/RealTime';
import Header from './components/Header';
import ProfileCard from './components/ProfileCard';

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
        <Header/>
        <RealTime/>
      </div>
    );
  }
}

export default App;
