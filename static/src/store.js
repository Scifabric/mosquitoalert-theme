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
    results: [],
    result: null,
    endpoint: 'http://mosquitoalert.pybossa.com',
    query: null,
    map: null,
    markers: [],
    polygons: [],
    infoAll: false,
    limit: 5,
    offset:0,
    chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    chartOptions: {
        distributeSeries: true,
        axisY: {onlyInteger: true}
    }
  },
  mutations: {
    getResults(state) {
        console.log("HOLA")
    },
    toggleSearchbox(state) {
        state.collapse = !state.collapse
    },
    toggleResultAll(state, payload) {
        var index = state.results.indexOf(payload.result)
        if (state.infoAll == false) {
            state.result = state.results[index]
            //state.result.info.mosquito_url = 'http://i.imgur.com/V1Xzzu6.jpg'
            state.infoAll = true
        }
        else {
            state.result = null
            state.infoAll = false
        }
    },
    updateQuery(state, query) {
        state.query = query
    },
    updateResults(state, data) {
        state.chartData.series = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (var result of data.results) {
            result.all = false
            var idx = result.info.month - 1
            state.chartData.series[idx] += 1
        }
        state.results = data.results
    },
    toggleSearching(state) {
        state.searching = !state.searching
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
            var marker = L.marker([result.info.lat, result.info.lon]).addTo(state.map)
            state.markers.push(marker)
            // Add area
            var polygon = L.geoJSON(result.info.geojson, {
                style: myStyle
            }).addTo(state.map);
            state.polygons.push(polygon)
        }
        var group = new L.featureGroup(state.polygons);
        
        state.map.fitBounds(group.getBounds())
        state.searching = false
    },
    cleanMarkers(state) {
        for (var marker of state.markers) {
            marker.remove()
        }

        for (var polygon of state.polygons) {
            polygon.remove()
        }

    },
  },
    actions: {
        getResults(context, payload) {
            //console.log("axios!")
            context.commit('toggleSearching')
            var url = payload.endpoint +  '/api/result?info=mosquito_exists::yes|display_name::' + payload.query + '&all=1&fulltextsearch=1&limit=' + payload.limit + '&offset=' + payload.offset
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

