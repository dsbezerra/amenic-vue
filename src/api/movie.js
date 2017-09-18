import Vue from 'vue'
import { API_URI, buildQueryString } from './helpers'

export default {
    getMovies(params, cb, errCb) {
        const query = buildQueryString(params)
        Vue.http.get(`${API_URI}/movies${query}`)
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