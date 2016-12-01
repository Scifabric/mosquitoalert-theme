import Vue from "vue"
import App from "./components/App.vue"
import store from "./store.js"

new Vue({
    el: '#vuejs',
    components: { App },
    store: store
})
