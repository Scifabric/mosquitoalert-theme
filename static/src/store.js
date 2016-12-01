import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searching: false,
    collapse: false,
    results: null,
    endpoint: 'http://mosquitoalert.pybossa.com',
    query: null
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
    }
  },
    actions: {
        getResults(context, payload) {
            console.log("axios!")
            var url = payload.endpoint +  '/api/result?info=display_name::' + payload.query + '&all=1&fulltextsearch=1'
            axios.get(url)
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              })
        }
    }
})

