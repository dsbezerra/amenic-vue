import movie from '../../api/movie'
import * as types from '../mutation-types'

// Initial State
const state = {
  movie: {},
  movies: {
    byId: {},
    allIds: [],
  },
  isFetching: false,
  isFetched: false,
}

// Getters
const getters = {
  movies: state => state.movies,
  comingSoon: (state) => {
    const ids = state.movies.allIds.filter(id => state.movies.byId[id].isComingSoon);
    return ids.map(id => state.movies.byId[id]);
  },
  inTheaters: (state) => {
    const ids = state.movies.allIds.filter(id => state.movies.byId[id].isInTheaters);
    return ids.map(id => state.movies.byId[id]);
  },
  isFetching: state => state.isFetching,
  isFetched: state => state.isFetched,
}

// Actions
const actions = {
  fetchMovies ({ commit, state }, query) {
    commit(types.MOVIES_REQUEST)
    movie.getMovies(
      query,
      (data) => commit(types.MOVIES_SUCCESS, data.movies),
      () => commit(types.MOVIES_FAILURE)
    )
  }
}

// Mutations
const mutations = {
  [types.SET_MOVIE](state, id) {
    state.movie = state.movies.byId[id];
  },

  [types.MOVIES_REQUEST] (state) {
    state.isFetching = true
  },

  [types.MOVIES_SUCCESS] (state, movies) {
    movies.forEach((movie) => {
      state.movies.allIds.push(movie.id)
      state.movies.byId[movie.id] = movie
    })
    state.isFetching = false
    state.isFetched = true
  },

  [types.MOVIES_FAILURE] (state) {
    state.isFetching = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}