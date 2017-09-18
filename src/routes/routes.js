import Home from '../components/Home/Home.vue'
import Prices from '../components/Prices/Prices.vue'
import Settings from '../components/Settings/Settings.vue'
import MovieDetails from '../components/MovieDetails/MovieDetails.vue'

export default [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/prices',
        component: Prices,
    },
    {
        path: '/settings',
        component: Settings,
    },
    {
        path: '/movie/:id',
        component: MovieDetails,
        props: true,
    },
];