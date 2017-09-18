import Vue from 'vue'

import { API_URI } from './helpers'

export default {
    getShowtimes(movieId, cb, errCb) {
        Vue.http.get(`${API_URI}/showtimes?movie=${movieId}`)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                        .then(({ data }) => cb(data))
                } else {
                    errCb(res)
                }
            })
    },
}