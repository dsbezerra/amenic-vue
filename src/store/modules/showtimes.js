import showtime from '../../api/showtime'
import * as types from '../mutation-types'
import Vue from 'vue'

// Initial State
const state = {
    showtimes: {}
}

// Getters
const getters = {
    showtimes: state => state.showtimes,
    showtimesByMovie: state => id => state.showtimes[id]
}

// Actions
const actions = {
    fetchShowtimes({ commit, state }, options) {
        const { force, movieId } = options
        if (state.showtimes[movieId] && state.showtimes[movieId].isFetched && !force) {
            return
        }

        commit(types.SHOWTIMES_REQUEST, movieId)
        showtime.getShowtimes(
            movieId,
            (data) => commit(types.SHOWTIMES_SUCCESS, {
                movieId,
                showtimes: data,
            }),
            () => commit(types.SHOWTIMES_FAILURE, movieId)
        )
    }
}

// Mutations
const mutations = {
    [types.SHOWTIMES_REQUEST](state, movieId) {
        Vue.set(state.showtimes, movieId, {
            isFetching: true,
            isFetched: false,
            data: [],
        })
    },

    [types.SHOWTIMES_SUCCESS](state, payload) {
        const { movieId, showtimes } = payload
        Vue.set(state.showtimes, movieId, {
            isFetched: true,
            isFetching: false,
            data: showtimes,
        })
    },

    [types.SHOWTIMES_FAILURE](state, movieId) {
        state.showtimes[movieId].isFetching = false
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}