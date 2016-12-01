import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searching: false,
    collapse: false,
    results: null,
    endpoint: 'http://mosquitoalert.pybossa.com',
    query: null,
    map: null
  },
  mutations: {
    getResults(state) {
        console.log("HOLA")
    },
    toggleSearchbox(state) {
        state.collapse = !state.collapse
    },
    updateQuery(state, query) {
        state.query = query
    },
    updateResults(state, data) {
        state.results = data.results
    },
    addMap(state) {
        console.log("map ready")
        var map = L.map( 'mosquitomap', {
            center: [20.0, 5.0],
            minZoom: 2,
            zoom: 2,
            zoomControl: false
        })

        L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a','b','c']
        }).addTo( map )
        state.map = map
    },
    addMarkers(state) {
        var myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        }
        for (var result of state.results) {
            // Add icon
            var icon = L.Icon.Default
            icon.imagePath = 'https://unpkg.com/leaflet@1.0.2/dist/images/'
            L.marker([result.info.lat, result.info.lon]).addTo(state.map)
            // Add area
            L.geoJSON(result.info.geojson, {
                style: myStyle
            }).addTo(state.map);
        }
    }
  },
    actions: {
        getResults(context, payload) {
            console.log("axios!")
            var url = payload.endpoint +  '/api/result?info=display_name::' + payload.query + '&all=1&fulltextsearch=1'
            axios.get(url)
              .then(function (response) {
                console.log(response);
                context.commit('updateResults', {results: response.data})

              })
              .catch(function (error) {
                console.log(error);
              })
        }
    }
})

