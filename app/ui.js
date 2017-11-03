import {LOCATIONS} from "../common/globals.js";
import { geolocation } from "geolocation";
import { display } from "display";

let document = require("document");

export function TaiwanAirUI() {
  this.statusText = document.getElementById("Status"); 
  this.loc = "";
}

TaiwanAirUI.prototype.updateUI = function(state, info) {
  console.log("updateUI(" + state + ", ["
              + (typeof(info)==="object" ? info.length : "undef")
              + "])");
  display.poke();
  if (state === "loaded") {
    this.statusText.innerText = "";

    this.updateInfo(info);
  }
  else {

    if (state === "loading") {
      this.statusText.innerText = "正在連線到網站...";
    }
    else if (state === "disconnected") {
      this.statusText.innerText = "檢查手機的連線"
    }
    else if (state === "error") {
      this.statusText.innerText = "嚴重錯誤";
    }
  }
}

TaiwanAirUI.prototype.setGPS = function(lat, lon) {
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
        if(this.loc!=LOCATIONS[min_i].loc)
          {
            this.loc=LOCATIONS[min_i].loc;
            messaging.peerSocket.send(this.loc);
          }
      }      
}

TaiwanAirUI.prototype.updateInfo = function(info) {
  document.getElementById("location").innerText = info.County+" "+info.SiteName;
  document.getElementById("CO").innerText = "一氧化碳: "+info.CO+"  臭氧: "+info.O3;
  document.getElementById("NO").innerText = "一氧化氮: "+info.NO+"  二氧化氮: "+info.NO2;
  document.getElementById("PM10").innerText = "PM10: "+info.PM10;
  document.getElementById("PM2_5").innerText = "PM2.5: "+info["PM2.5"];
  document.getElementById("Status").innerText = info.Status;
 
  if(info.Status=="良好")
  {
  	document.getElementById("Light").href = "green.png";
    document.getElementById("Suggest").innerText = "盡情出門跑步吧";
  }
  if(info.Status=="普通")
  {
  	document.getElementById("Light").href = "yellow.png";
    document.getElementById("Suggest").innerText = "出門活動吧";
  }
  if(info.Status=="對敏感族群不健康")
  {
  	document.getElementById("Light").href = "oringe.png";
    document.getElementById("Suggest").innerText = "吃飽散步也不錯";
  }
  if(info.Status=="對所有族群不健康")
  {    
  	document.getElementById("Light").href = "red.png";
    document.getElementById("Suggest").innerText = "出門別太久，記得戴口罩";
  }
  if(info.Status=="非常不健康")
  {
    document.getElementById("Light").href = "purple.png";
    document.getElementById("Suggest").innerText = "停止戶外活動";
  }
  if(info.Status=="危害")
  {
  	document.getElementById("Light").href = "brown.png";
    document.getElementById("Suggest").innerText = "室內也要戴口罩";
  }

}
