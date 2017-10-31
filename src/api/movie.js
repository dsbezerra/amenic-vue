import Vue from 'vue'
import { API_URI, STATIC_URI } from './helpers'

export default {
    getMovie(id, cb, errCb) {
        Vue.http.get(`${API_URI}/movie/${id}`)
        .then((res) => {
            if (res.ok) {
                return res.json()
                    .then(({ data }) => cb(data))
            } else {
                errCb(res)
            }
        })
    },
    getNowPlaying(cb, errCb) {
        Vue.http.get(`${STATIC_URI}/movies/now_playing.json`)
        .then((res) => {
            if (res.ok) {
                return res.json()
                    .then((data) => cb(data))
            } else {
                errCb(res)
            }
        })
    },
    getUpcoming(cb, errCb) {
        Vue.http.get(`${STATIC_URI}/movies/upcoming.json`)
        .then((res) => {
            if (res.ok) {
                return res.json()
                    .then((data) => cb(data))
            } else {
                errCb(res)
            }
        })
    }
}