import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spinner: true
  },
  mutations: {
    addTask(state, payload) {
        state.tasks[payload.task.id] = payload.task
        state.images[payload.task.id] = []
    }
  }
})

