import * as types from '../mutation-types'
import Vue from 'vue'

const MovieSliderInitialState = {
    x: 130,
    leftVisible: false,
    rightVisible: true,
    speed: 10,
    interval: null,
    containerWidth: null,
}

// Initial State
const state = {
    home: {
        'MovieSlider:now_playing': MovieSliderInitialState,
        'MovieSlider:upcoming': MovieSliderInitialState,
    }
}

// Actions
const actions = {
    updateUi({ commit, state }, options) {
        commit(types.UPDATE_UI, options)
    },
}

// Mutations
const mutations = {
    [types.UPDATE_UI](state, options) {
        const { route, tag, __state } = options
        Vue.set(state[route], tag, __state)
    },
}

export default {
    state,
    actions,
    mutations
}