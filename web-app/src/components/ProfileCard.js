import React from "react";
import ReactDOM from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

import { Card, CardMedia, CardHeader, CardContent, Container, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/Inbox';


import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const monitor = '../images/ssd1306_spi_monitor.jpg';

const face = 'https://avatars1.githubusercontent.com/u/2611792?s=460&v=4';


const styles3={
    center: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
 }
}
const styles = muiBaseTheme => ({
  card: {
    maxWidth: 300,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  media: {
    paddingTop: "56.25%"
  },
  content: {
    textAlign: "left",
    padding: muiBaseTheme.spacing.unit * 3
  },
  divider: {
    margin: `${muiBaseTheme.spacing.unit * 3}px 0`
  },
  heading: {
    fontWeight: "bold"
  },
  subheading: {
    lineHeight: 1.8
  },
  avatar: {
    display: "inline-block",
    border: "2px solid white",
    "&:not(:first-of-type)": {
      marginLeft: -muiBaseTheme.spacing.unit
    }
  }
});

class ProfileCard extends React.Component{
    constructor(props) {
      super(props);
    }
    render(){
        const style = {
            container: {
                display: 'flex',
                alignItems: 'center',
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
      <Card style={style.container}>
        <CardMedia image={monitor} title="Aquarium monitor"/>
        <CardContent>
            
          <List>
            <ListItem>
              <InboxIcon /><ListItemText primary="Last measurement"/>
            </ListItem>
          </List>
          

          <Typography variant="subtitle2" gutterBottom>
          Last measurement
          </Typography>
         
          <List>
              <ListItem>
            <ListItemIcon>
                <InboxIcon /> <ListItemText primary={'Water Temperature: '+ this.props.current.temp + ' ºC'}/>
                <InboxIcon /> <ListItemText primary={'TDS level: '+ this.props.current.tds + ' ppm'}/>
                <InboxIcon /> <ListItemText primary={'PH level: '+ this.props.current.ph}/>
            </ListItemIcon>
            </ListItem>
          </List>
       
          <Typography variant="body2" style={style.typography}>Local time: {this.props.current.timestamp}</Typography>
          <Divider light />
            <Container style={style.container}>
                <Avatar key={face} src={face}/>
            </Container>
            <Typography> </Typography>
        
        </CardContent>
      </Card>
    </div>
  );
}
}

//const Wrapped = withStyles(styles)(ProfileCard);
export default withStyles(styles)(ProfileCard);

//const WrappedApp = withStyles(styles)(ProfileCard);