<template>
    <div class="container">
        <spinner v-if="isFetching" />
        <transition name="slide-fade">
            <div v-if="!isFetching">
                <h1 class="header">Filmes em cartaz</h1>
                <movie-slider :movies="inTheaters" />
                <h1 class="header">Próximos lançamentos</h1>
                <movie-slider :movies="comingSoon" />
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { appendParam } from '../../api/helpers'
import MovieSlider from '../MovieSlider/MovieSlider.vue'
import Spinner from '../UI/Spinner/Spinner.vue'

export default {
    components: {
        MovieSlider,
        Spinner,
    },
    computed: {
        ...mapGetters({
            comingSoon: 'comingSoon',
            inTheaters: 'inTheaters',
            isFetching: 'isFetching',
            isFetched: 'isFetched',
        }),
    },
    methods: {
        fetchMovies(params) {
            this.$store.dispatch('fetchMovies', params)
        }
    },
    created() {
        if (!this.isFetched) {
            let params = appendParam(null, 'isInTheaters', true);
            this.fetchMovies(params);

            params = appendParam(null, 'isComingSoon', true);
            this.fetchMovies(params);
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
}

.movie-slider {
    display: flex;
    justify-content: center;
    flex-flow: wrap;
}

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */

{
    transform: translateY(10px);
    opacity: 0;
}
</style>
