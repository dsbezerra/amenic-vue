const Home = () => import('../components/Home/Home.vue')
const Prices = () => import('../components/Prices/Prices.vue')
const Settings = () => import('../components/Settings/Settings.vue')
const MovieDetails = () => import('../components/MovieDetails/MovieDetails.vue')

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