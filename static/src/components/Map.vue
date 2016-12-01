<template>
    <div id="mosquitomap" class="mosquitomap"></div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
export default {
    mounted(){
        console.log("map ready")
        // create the tile layer with correct attribution
        var map = L.map( 'mosquitomap', {
            center: [20.0, 5.0],
            minZoom: 2,
            zoom: 2,
            zoomControl: false
        })


        L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( map );

    },
    watch: {
        'mosquitoes': function(val, oldVal) {
            console.log("New mosquitoes to draw")
        }
    }
}
</script>
<style>
.mosquitomap{
    width: 100%;
    height: 740px;
}

.controls {
  margin-top: 17px;
  margin-left: 20px;
  border: 1px solid transparent;
  border-radius: 2px 0 0 2px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  height: 32px;
  outline: none;
  /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);*/
}

#pac-input {
  background-color: #fff;
  font-size: 15px;
  font-weight: 300;
  margin-left: 20px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 300px;
}

#pac-input {
  width: 300px;
  height: 45px;
  border-radius: 1px;
  background-color: #ffffff;
  border: solid 1px #777777;
}

#pac-input:focus {
  border-color: #4d90fe;
}

.pac-container {
  font-family: Roboto;
}

#type-selector {
  color: #fff;
  background-color: #4d90fe;
  padding: 5px 11px 0px 11px;
}

#type-selector label {
  font-size: 13px;
  font-weight: 300;
}
#target {
  width: 345px;
}

.videomap-container {
    height: 900px;
}
</style>
