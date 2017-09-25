import Vue from 'vue'
import { API_URI, buildQueryString } from './helpers'

export default {
    getNowPlaying(cb, errCb) {
        Vue.http.get(`${API_URI}/movie/now_playing`)
        .then((res) => {
            if (res.ok) {
                return res.json()
                    .then(({ data }) => cb(data))
            } else {
                errCb(res)
            }
        })
    },
    getUpcoming(cb, errCb) {
        Vue.http.get(`${API_URI}/movie/upcoming`)
        .then((res) => {
            if (res.ok) {
                return res.json()
                    .then(({ data }) => cb(data))
            } else {
                errCb(res)
            }
        })
    }
}