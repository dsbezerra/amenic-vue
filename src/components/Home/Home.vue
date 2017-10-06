<template>
    <div class="container">
        <spinner v-if="nowPlaying.isFetching" />
        <transition name="slide-fade">
            <div v-if="!nowPlaying.isFetching">
                <h1 class="header">Filmes em cartaz</h1>
                <movie-slider id="home/now_playing" :movies="nowPlayingMovies" />
            </div>
        </transition>

        <spinner v-if="upcoming.isFetching" />
        <transition name="slide-fade">
            <div v-if="!upcoming.isFetching">
                <h1 class="header">Próximos lançamentos</h1>
                <movie-slider id="home/upcoming" :movies="upcomingMovies" />
            </div>
        </transition>
    </div>
</template>

<script>
import { get } from '../../utils/object'
import { mapGetters, mapState } from 'vuex'
import { appendParam } from '../../api/helpers'
import MovieSlider from '../MovieSlider/MovieSlider.vue'
import Spinner from '../UI/Spinner/Spinner.vue'

export default {
    components: {
        MovieSlider,
        Spinner,
    },
    computed: {
        ...mapState({
            nowPlaying: (state) => state.movies.nowPlaying,
            upcoming: (state) => state.movies.upcoming,
        }),
        ...mapGetters({
            nowPlayingMovies: 'nowPlaying',
            upcomingMovies: 'upcoming',
        }),
    },
    methods: {
        fetchMovies(type) {
            switch (type) {
                case 'now_playing': this.$store.dispatch('fetchNowPlaying'); break;
                case 'upcoming': this.$store.dispatch('fetchUpcoming'); break;
            }
        }
    },
    created() {
        if (!this.nowPlaying.isFetched) {
            this.fetchMovies('now_playing')
        }

        if (!this.upcoming.isFetched) {
            this.fetchMovies('upcoming')
        }
    }
}
</script>

<style scoped>
.container {
    padding: 4px;
}

.header {
    font-size: 42px;
    font-family: 'Roboto Condensed', sans-serif;
    padding: 0 10%;
    margin: 24px 0px;
    font-weight: 300;
}

.movie-slider {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-flow: wrap;
    flex-flow: wrap;
}

.slide-fade-enter-active {
    -webkit-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
}

.slide-fade-leave-active {
    -webkit-transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    -o-transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */

{
    -webkit-transform: translateY(10px);
    -ms-transform: translateY(10px);
    transform: translateY(10px);
    opacity: 0;
}
</style>
