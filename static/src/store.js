import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searching: false,
    collapse: false,
    results: null
  },
  mutations: {
    getResults(state) {
        console.log("HOLA")
    },
    toggleSearchbox(state) {
        state.collapse = !state.collapse
    }
  }
})

