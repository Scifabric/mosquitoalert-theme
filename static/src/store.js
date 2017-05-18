import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import VueI18n from 'vue-i18n'
import locales from './locales.js'
import { getBrowserLanguage, getCookie } from './localesetup.js'
import _ from "lodash"

Vue.use(Vuex)

Vue.use(VueI18n)

Vue.config.lang = getCookie('language').toLowerCase() || getBrowserLanguage()

// set locales
Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang])
})

function pct(data){
    return (( 100 * data.freq)/data.count)
}

function toogleResult(state, result) {
    var index = state.results.indexOf(result)
    if (state.infoAll == false) {
        state.result = state.results[index]
        //state.result.info.mosquito_url = 'http://i.imgur.com/V1Xzzu6.jpg'
        state.infoAll = true
    }
    else {
        state.result = null
        state.infoAll = false
    }
}

export default new Vuex.Store({
  state: {
    searching: false,
    collapse: false,
    modal: false,
    welcome: true,
    results: [],
    result: null,
    endpoint: 'http://mosquitoalert.pybossa.com',
    query: null,
    map: null,
    markers: [],
    polygons: [],
    infoAll: false,
    limit: 100,
    offset:0,
    scroll: 0,
    datemin: null,
    datemax: null,
    chartData: {
        labels: [Vue.t('message.jan'), Vue.t('message.feb'), Vue.t('message.mar'), Vue.t('message.apr'), Vue.t('message.may'), Vue.t('message.jun'), Vue.t('message.jul'), Vue.t('message.aug'), Vue.t('message.sep'), Vue.t('message.oct'), Vue.t('message.nov'), Vue.t('message.dec')],
        series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    chartOptions: {
        distributeSeries: true,
        axisY: {onlyInteger: true, showGrid: false, showLabel: false, offset: 0},
        axisX: {showGrid: false},
        width: "100%",
        height: 100,
    },
    chartist: null,
  },
  mutations: {
    getResults(state) {
        console.log("HOLA")
    },
    toggleSearchbox(state) {
        state.collapse = !state.collapse
    },
    toggleModal(state) {
        state.modal = !state.modal
    },
    toggleWelcome(state) {
        state.welcome = !state.welcome
    },
    toggleResultAll(state, payload) {
        toogleResult(state, payload.result)
    },
    updateQuery(state, query) {
        state.query = query
    },
    updateResults(state, data) {
        state.chartData.series = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        var results = []
        var dates = []
        for (var result of data.results) {
            if ((result.info.mosquito.top === 'tiger' || result.info.mosquito.top === 'yellow') && (result.info.mosquito_thorax.top === 'yes')) {

                result.all = false
                var idx = result.info.month - 1
                state.chartData.series[idx] += 1
                result.thorax_pct = pct(result.info.mosquito_thorax)
                result.people = result.info.mosquito.count
                results.push(result)
                var tmp_date = result.info.year + "/" + result.info.month + "/" + result.info.day + " 00:00:00"
                tmp_date = Math.round(new Date(tmp_date).getTime()/1000)
                dates.push(tmp_date)
            }
        }
        state.datemin = new Date(_.min(dates)*1000)
        state.datemax = new Date(_.max(dates)*1000)
        //state.results = data.results
        // Order results by thorax quality
        if (results.length >= 1) {
            state.results = _.orderBy(results, ['thorax_pct', 'people'],['desc', 'desc'])
        }
        else {
            state.results = []
            state.searching = !state.searching

        }
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
            marker.result = result
            marker.on('click', function() {
                toogleResult(state, this.result)
            })
            state.markers.push(marker)
            // Add area
            var polygon = L.geoJSON(result.info.geojson, {
                style: myStyle
            }).addTo(state.map);
            state.polygons.push(polygon)
        }
        var group = new L.featureGroup(state.polygons);
        
        state.map.fitBounds(group.getBounds())
        state.map.setZoom(5)
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
    cleanResults(state) {
        state.results = []
    },
  },
    actions: {
        getResults(context, payload) {
            //console.log("axios!")
            context.commit('toggleSearching')
            if (payload.random === false) {
                var url = payload.endpoint +  '/api/result?info=mosquito_exists::yes|display_name::' + payload.query + '&all=1&fulltextsearch=1&limit=' + payload.limit + '&offset=' + payload.offset
            }
            else {
                var url = payload.endpoint +  '/api/result?info=thorax::yes&all=1&fulltextsearch=1&limit=' + payload.limit + '&orderby=created&desc=true' 
            }
            console.log(url)
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

