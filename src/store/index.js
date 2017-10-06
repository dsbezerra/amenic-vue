import Vue from 'vue'
import Vuex from 'vuex'
import movies from './modules/movies'
import showtimes from './modules/showtimes'
import ui from './modules/ui'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    movies,
    showtimes,
    ui,
  },
  strict: debug,
})