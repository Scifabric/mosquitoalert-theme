import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'swiper/dist/css/swiper.css'
import swiper from 'swiper'
import VueI18n from 'vue-i18n'
import locales from './locales.js'

Vue.use(VueI18n)

function getBrowserLanguage() {
    // detect browser language (compatible with Chrome, Firefox, Safari and IE10+)
    var userLang = window.navigator.languages ? window.navigator.languages[0] : null;
        userLang = userLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
    if (userLang.indexOf('-') !== -1)
        userLang = userLang.split('-')[0];
    
    if (userLang.indexOf('_') !== -1)
        userLang = userLang.split('_')[0];
    // url parameter for lang?
    // set language
    var re = new RegExp("^es.*");
    var userLocale = "es"
    if (re.test(userLang)) {
        userLocale = "es";
    } else if (userLang === "ca") {
        userLocale = "ca";
    } else {
        userLocale = "en";
    }

    console.log(userLocale);
    return userLocale;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

Vue.config.lang = getCookie('language').toLowerCase() || getBrowserLanguage()

// set locales
Object.keys(locales).forEach(function (lang) {
  Vue.locale(lang, locales[lang])
})



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
    swiper: null,
    markers: [],
    polygons: [],
    infoAll: false,
    limit: 100,
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
    addSwiper(state) {
        var slidesPerView = 4
        if (window.matchMedia("(max-width: 360px)").matches) {
          slidesPerView = 2
        } 
        state.swiper = new Swiper('.swiper-container', {
               pagination: '.swiper-pagination',
               slidesPerView: slidesPerView,
               centeredSlides: true,
               paginationClickable: true,
               spaceBetween: 30
           })
    },
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
        state.results = []
        for (var result of data.results) {
            if (result.info.mosquito.top === 'tiger' || result.info.mosquito.top === 'yellow') {
                result.all = false
                var idx = result.info.month - 1
                state.chartData.series[idx] += 1
                state.results.push(result)
                var url = result.info.mosquito_url
                var type = result.info.mosquito.top
                if (type === 'tiger') {
                    type = Vue.t("message.tiger")
                }
                var location = result.info.county + ", " + result.info.country
                var slide = `<div class="swiper-slide" style="background: url(${url}) 0% 0% / cover;"><p class="type">${type}</p><p class="location">${location}</p>` 
                state.swiper.appendSlide(slide)
            }
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
            console.log("axios!")
            console.log(payload)
            context.commit('toggleSearching')
            var url = payload.endpoint +  '/api/result?info=mosquito_exists::yes&all=1&fulltextsearch=1&limit=' + payload.limit + '&offset=' + payload.offset
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

