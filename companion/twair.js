export function TWAirAPI() {

};

TWAirAPI.prototype.getData = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var url = "https://ssl-proxy.my-addr.org/myaddrproxy.php/http/opendata2.epa.gov.tw/AQI.json";
    fetch(url).then(function(response) {
      console.log("Got response from server:", response);
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));

      resolve(json);
    }).catch(function (error) {
      console.log("Fetching " + url + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });
}
