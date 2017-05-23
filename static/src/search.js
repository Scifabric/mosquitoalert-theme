import Vue from "vue"
import App from "./components/App.vue"
import store from "./store.js"
import messages from './locales.js'
import { getBrowserLanguage, getCookie } from './localesetup.js'
import VueI18n from 'vue-i18n'


Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: getCookie('language').toLowerCase() || getBrowserLanguage(),
  messages, // set locale messages
})


new Vue({
    el: '#vuejs',
    components: { App },
    store: store,
    i18n: i18n
})
