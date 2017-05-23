import Vue from "vue"
import App from "./components/App.vue"
import store from "./store.js"

import Tooltip from 'vue-directive-tooltip'
Vue.use(Tooltip);

new Vue({
    el: '#vuejs',
    components: { App },
    store: store
})
