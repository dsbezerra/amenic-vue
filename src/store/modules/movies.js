import movie from '../../api/movie'
import * as types from '../mutation-types'

// Initial State
const state = {
  movie: {},
  nowPlaying: {
    isFetching: false,
    isFetched: false,
    data: {
      byId: {},
      allIds: [],
    }
  },
  upcoming: {
    isFetching: false,
    isFetched: false,
    data: {
      byId: {},
      allIds: [],
    }
  }
}

// Getters
const getters = {
  movies: state => ({
    upcoming: state.upcoming.data,
    nowPlaying: state.nowPlaying.data,
  }),
  nowPlaying: (state) => state.nowPlaying.data.allIds.map(id => state.nowPlaying.data.byId[id]),
  upcoming: (state) => state.upcoming.data.allIds.map(id => state.upcoming.data.byId[id]),
}

// Actions
const actions = {
  fetchNowPlaying({ commit, state }) {
    commit(types.NOW_PLAYING_REQUEST)
    movie.getNowPlaying(
      (data) => commit(types.NOW_PLAYING_SUCCESS, data),
      () => commit(types.NOW_PLAYING_FAILURE)
    )
  },
  fetchUpcoming({ commit, state }) {
    commit(types.UPCOMING_REQUEST)
    movie.getUpcoming(
      (data) => commit(types.UPCOMING_SUCCESS, data),
      () => commit(types.UPCOMING_FAILURE)
    )
  }
}

// Mutations
const mutations = {
  [types.SET_MOVIE](state, id) {
    state.movie = state.movies.byId[id];
  },

  [types.NOW_PLAYING_REQUEST](state) {
    state.nowPlaying.isFetching = true
  },

  [types.NOW_PLAYING_SUCCESS](state, movies) {
    movies.forEach((movie) => {
      state.nowPlaying.data.allIds.push(movie.id)
      state.nowPlaying.data.byId[movie.id] = movie
    })
    state.nowPlaying.isFetching = false
    state.nowPlaying.isFetched = true
  },

  [types.NOW_PLAYING_FAILURE](state) {
    state.nowPlaying.isFetching = false
  },

  [types.UPCOMING_REQUEST](state) {
    state.upcoming.isFetching = true
  },

  [types.UPCOMING_SUCCESS](state, movies) {
    movies.forEach((movie) => {
      state.upcoming.data.allIds.push(movie.id)
      state.upcoming.data.byId[movie.id] = movie
    })
    state.upcoming.isFetching = false
    state.upcoming.isFetched = true
  },

  [types.UPCOMING_FAILURE](state) {
    state.upcoming.isFetching = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}