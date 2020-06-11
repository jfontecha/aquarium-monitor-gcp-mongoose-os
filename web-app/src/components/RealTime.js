import React from 'react';
import { Container, Card, CardHeader, CardMedia, CardContent, Typography, Grid, Divider, Avatar, List, ListItem } from '@material-ui/core';
//import { LineChart, Line, XAxis, YAxis, ReferenceLine, CartesianGrid, Tooltip, Legend } from 'recharts';
//import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Label, LineChart, BarChart, Line, Bar, Brush, CartesianGrid, ReferenceLine,
  XAxis, YAxis, Tooltip, Highlight, Legend } from 'recharts';

  import ExpansionPanel from '@material-ui/core/ExpansionPanel';
  import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
  import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
  import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

  import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
  import FavoriteIcon from '@material-ui/icons/Favorite';

import { getOnlyCompleteHour, getWaterLimits } from '../utils/utils.js';

import firebase from '../config/firebase.js';
import { REF_DATABASE } from '../config/firebase.js';
import ProfileCard from './ProfileCard.js';

const monitor = require('../images/ssd1306_spi_monitor.jpg');
//const monitor = '../images/logo192.png';
const face = 'https://avatars1.githubusercontent.com/u/2611792?s=460&v=4';

const data = [{}];
const initialState = {
  data,
  currentMeasure: {},
  left : 0,
  right : 0
};

class RealTime extends React.Component{
  constructor(props) {
    super(props);
    this.state = initialState;

  }

  handleChangeData(){
		// shift
    this.setState( ( { data : cdata, left = 0 } ) => {
    	return { 
        data: cdata.concat( { hours: getOnlyCompleteHour(this.state.currentMeasure.timestamp),
                              timestamp : this.state.currentMeasure.timestamp, 
                              temp : this.state.currentMeasure.temp,
                              tds : this.state.currentMeasure.tds,
                              ph : this.state.currentMeasure.ph } ),
        animation : true, 
        left : left
        
        };
    } );

    // insert
    setTimeout( () => {
    	this.setState( ( { data : cdata } ) => {
        cdata[ cdata.length - 1 ].hours = getOnlyCompleteHour(this.state.currentMeasure.timestamp);
        cdata[ cdata.length - 1 ].timestamp = this.state.currentMeasure.timestamp;
        cdata[ cdata.length - 1 ].temp = this.state.currentMeasure.temp;
        cdata[ cdata.length - 1 ].tds = this.state.currentMeasure.tds;
        cdata[ cdata.length - 1 ].ph = this.state.currentMeasure.ph;
        
        return { data : cdata.slice(), animation : true }
      } ); 
    }, 1000 );
  };
  

componentDidMount(){
  const deviceRef = firebase.database().ref(REF_DATABASE);
  deviceRef.on('value', (snap) => {   
    let measure = snap.val();

    let current = {timestamp: measure.timestamp,
                   hours: getOnlyCompleteHour(measure.timestamp), 
                   temp: measure.temp, 
                   ph: measure.ph, 
                   tds: measure.tds};
 
    this.setState({currentMeasure: current});
    this.handleChangeData(this); 
   });
}

  
  render(){
    const { currentMeasure, data, barIndex,animation, left, right } = this.state;

    const style = {
      container: {
          display: 'flex',
          flexDirection: 'column',
          margin: '10px'
      },
      typography: {
          width: '100%',
          align: 'center',
          maxWidth: 500
        }
   }

    return (  
      <div>
        < Grid container spacing={1}>
          <Grid item xs={4}>
            <Card style={style.container}>
            <CardHeader avatar={<Avatar key={face} src={face}/>} title="Author: Jesus Fontecha" subheader="Made with love for a smarter world"/>
              <CardMedia component="img" alt="ESP32 Monitor Board" height="225" image={monitor} title="ESP32 Monitor Board"/>
              <CardContent>
                <Typography gutterBottom variant="subtitle1" component="h2">Last Water Params</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                Datetime of the last measure: {new Date(currentMeasure.timestamp).toLocaleString()}
                  <List>
                    <ListItem>
                      <ArrowForwardIosIcon/>Temperature: {currentMeasure.temp}ºC
                    </ListItem>
                    <ListItem>
                    <ArrowForwardIosIcon/>Total Dissolved Soils: {currentMeasure.tds} mg/L
                    </ListItem>
                    <ListItem>
                    <ArrowForwardIosIcon/>PH Value: {currentMeasure.ph}
                    </ListItem>
                  </List>
                </Typography>
                <Divider/>
                <Typography variant="caption">Measurements should be updated every 60 seconds.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        < Grid container spacing={1}>
          <Grid item xs= {4}>          
            <ExpansionPanel style={style.container}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                <Typography variant="body1">Show Real Time Charts</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails> 
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>The charts below include recommended intervals and values for each parameter. Parameters are gathered every 60 seconds, be patient!</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart width={450} height={250} data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0}}>                                         
                      <CartesianGrid stroke='#f5f5f5'/>
                      <XAxis label={{ value: 'Local time', position: 'bottom' }} dataKey="hours" padding={{left: 30, right: 30}} tick={true} domain={['auto', 'auto']}/>
                      <YAxis label={{ value: 'Degrees', angle: -90, position: 'insideLeft' }} dataKey="temp" domain={[getWaterLimits().min_water_temp - 2, getWaterLimits().max_water_temp + 2]}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36}/>
                      <ReferenceLine y={getWaterLimits().max_water_temp} stroke="#DE95A4" strokeDasharray="3 3"/>
                      <ReferenceLine y={getWaterLimits().min_water_temp} stroke="#76C6E5" strokeDasharray="3 3"/>
                      <Line name='Water Temperature (ºC)' type='natural' dataKey="temp" activeDot={{ r: 4 }} stroke='#2771CB' isAnimationActive={animation} animationEasing={'linear'} animationDuration={1000}/>
                    </LineChart> 
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart width={450} height={250} data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0}}>
                      <CartesianGrid stroke='#f5f5f5'/>
                      <XAxis label={{ value: 'Local time', position: 'bottom' }} dataKey="hours" padding={{left: 30, right: 30}} tick={true} domain={['auto', 'auto']}/>
                      <YAxis label={{ value: 'mg/L', angle: -90, position: 'insideLeft' }} dataKey="tds" domain={[getWaterLimits().min_tds - 60, getWaterLimits().max_tds + 60]}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36}/>
                      <ReferenceLine y={getWaterLimits().max_tds} stroke="#DE95A4" strokeDasharray="3 3"/>
                      <ReferenceLine y={getWaterLimits().min_tds} stroke="#DE95A4" strokeDasharray="3 3"/>
                      <Line name='Total Dissolved Soils - TDS (mg/L)' type='natural' dataKey="tds" activeDot={{ r: 4 }} stroke='#7A409D' isAnimationActive={animation} animationEasing={'linear'} animationDuration={1000}/>
                    </LineChart> 
                  </Grid>
                  <Grid item xs={12}>
                    <LineChart width={450} height={250} data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0}}>
                      <CartesianGrid stroke='#f5f5f5'/>
                      <XAxis label={{ value: 'Local time', position: 'bottom' }} dataKey="hours" padding={{left: 30, right: 30}} tick={true} domain={['auto', 'auto']}/>
                      <YAxis label={{ value: 'PH level', angle: -90, position: 'insideLeft' }} dataKey="ph" domain={['auto', 'auto']}/>
                      <Tooltip/>
                      <Legend verticalAlign="top" height={36}/>
                      <ReferenceLine y={getWaterLimits().recommended_ph} stroke="#88F0C3" strokeDasharray="3 3"/>
                      <Line name='PH Level' type='natural' dataKey="ph" activeDot={{ r: 4 }} stroke='#ff7300' isAnimationActive={animation} animationEasing={'linear'} animationDuration={1000}/>
                    </LineChart> 
                  </Grid>
                  <Grid item xs={12}>
                    <Divider light />
                      <Typography variant="caption" gutterBottom>Displayed measurements: {data.length-1}</Typography>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </ Grid>
      </div>
    );
  }
}

export default RealTime;
