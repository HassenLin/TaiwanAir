import * as messaging from "messaging";
import {LOCATIONS} from "../common/globals.js";
import { settingsStorage } from "settings";
import { me } from "companion";

import { TWAirAPI } from "./twair.js"


console.log("Companion starting! LaunchReasons: " + JSON.stringify(me.launchReasons));
/*
settingsStorage.onchange = function(evt) {
  console.log("Settings have changed! " + JSON.stringify(evt));
  sendTWAirSchedule();
}
*/
var location = "淡水"
var date = new Date();
var lastupdate = 0;

// Helpful to check whether we are connected or not.
/*
setInterval(function() {
  console.log("TWAir App (" + me.buildId + ") running - Connectivity status=" + messaging.peerSocket.readyState + 
              " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
}, 3000);
*/

import { geolocation } from "geolocation";
var watchID = geolocation.watchPosition(locationSuccess, locationError);
function setGPS(lat, lon) {
   var min_i = -1,min_d=1000.0;
     for (let i = 0; i < LOCATIONS.length; i++) {
      var lat2=LOCATIONS[i].lat-lat;
      lat2=lat2*lat2;
      var lon2=LOCATIONS[i].lon-lon;
      lon2=lon2*lon2;
      let d=Math.sqrt(lat2+lon2)
      if(d<min_d)
      {
        min_d = d;
        min_i = i;
      }	 	
    }
    if(min_i!=-1)
    {
      if(location != LOCATIONS[min_i].loc)
      {      
        location = LOCATIONS[min_i].loc;
        sendTWAirSchedule();   
      }   
    }      
}

function locationSuccess(position) {
    console.log("Latitude: " + position.coords.latitude,
                "Longitude: " + position.coords.longitude);
    
    if(date.getTime() >= lastupdate+20000)
      setGPS(position.coords.latitude, position.coords.longitude);
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendTWAirSchedule();
  setInterval(sendTWAirSchedule, 180000);
  
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(JSON.stringify(evt.data));
  if(location != evt.data)
  {
      location = evt.data;
      sendTWAirSchedule();      
  }
  lastupdate = date.getTime();
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

function sendTWAirSchedule() {

  var twairApi = new TWAirAPI();
  twairApi.getData().then(function(infos) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      var info=infos[0];
      for(let i=0;i<infos.length;i++)
      {
        if(infos[i].SiteName==location)
        {
          info = infos[i];
          break;
        }
      }
      console.log("Sending info: " + JSON.stringify(info));
      messaging.peerSocket.send(info);
    }
  }).catch(function (e) {
    console.log("error"); console.log(e)
  });
}
