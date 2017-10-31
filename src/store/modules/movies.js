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
  },
  isFetchingMovie: false,
}

// Getters
const getters = {
  isFetchingMovie: state => state.isFetchingMovie,
  movie: state => state.movie,
  movies: state => ({
    upcoming: state.upcoming.data,
    nowPlaying: state.nowPlaying.data,
  }),
  nowPlaying: (state) => state.nowPlaying.data.allIds.map(id => state.nowPlaying.data.byId[id]),
  upcoming: (state) => state.upcoming.data.allIds.map(id => state.upcoming.data.byId[id]),
}

// Actions
const actions = {
  setMovie( { commit, state }, movie) {
    commit(types.SET_MOVIE, movie)
  },
  fetchMovie({ commit, state }, id) {
    commit(types.MOVIE_REQUEST)
    movie.getMovie(
      id,
      (data) => commit(types.MOVIE_SUCCESS, data),
      () => commit(types.MOVIE_FAILURE)
    )
  },
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
  [types.SET_MOVIE](state, movie) {
    state.movie = movie
  },

  [types.MOVIE_REQUEST](state) {
    state.isFetchingMovie = true
  },

  [types.MOVIE_SUCCESS](state, data) {
    state.isFetchingMovie = false
    state.movie = data
  },

  [types.MOVIE_FAILURE](state) {
    state.isFetchingMovie = false
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