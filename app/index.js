/*
 * Entry point for the watch app
 */

import * as messaging from "messaging";
import { TaiwanAirUI } from "./ui.js";
import { geolocation } from "geolocation";
console.log("TW Air App Started");
var ui = new TaiwanAirUI();

ui.updateUI("disconnected");



var watchID = geolocation.watchPosition(locationSuccess, locationError);

function locationSuccess(position) {
    console.log("Latitude: " + position.coords.latitude,
                "Longitude: " + position.coords.longitude);
    ui.setGPS(position.coords.latitude, position.coords.longitude);
}

function locationError(error) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

// Helpful to check whether we are connected or not.
/*
setInterval(function() {
  console.log("TWAir App running - Connectivity status=" + messaging.peerSocket.readyState +
              " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
}, 3000);
*/

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  ui.updateUI("loading");
  console.log("Socket opened");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("Received message!");
  ui.updateUI("loaded", evt.data);
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
  ui.updateUI("error");
}
