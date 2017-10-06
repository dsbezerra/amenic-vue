<template>
    <section class="container">
        <div class="movie-slider" :style="{ left: x + 'px' }">
            <movie v-for="movie of movies" :movie="movie" :key="movie.id" />
        </div>
        <div class="gradient-effect left" :class="{ visible: leftVisible }" v-on:mouseenter="slideRight" v-on:mouseleave="stopAnimation">
            <icon name="keyboard_arrow_left" size="big" />
        </div>
        <div class="gradient-effect right" :class="{ visible: rightVisible }" v-on:mouseenter="slideLeft" v-on:mouseleave="stopAnimation">
            <icon name="keyboard_arrow_right" size="big" />
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex'
import Icon from '../UI/Icon/Icon.vue'
import Movie from '../Movie/Movie.vue'
import { get } from '../../utils/object'

export default {
    components: {
        Icon,
        Movie,
    },

    props: {
        id: String,
        name: {
            type: String,
            default: 'MovieSlider',
        },
        movies: {
            type: Array,
            default: [],
        },
        itemWidth: {
            type: Number,
            default: 310,
        }
    },
    computed: {
        ...mapState({
            state: function (state) {
                const { name, id } = this;

                // Create a high order component
                const parts = id.split('/');

                let route, tag;
                if (parts.length == 2) {
                    route = parts[0];
                    tag = parts[1];
                } else {
                    tag = parts[0]
                    route = 'any'
                }

                if (!route || !tag) {
                    throw new Error('component must have route and tag defined');
                }  

                this.route = route;
                this.tag = `${name}:${tag}`

                return get(state, `ui.${route}.${name}:${tag}`)
            }
        })
    },
    data() {
        return {
            route: null,
            tag: null,
            
            x: 130,
            leftVisible: false,
            rightVisible: true,
            speed: 10,
            interval: null,
            containerWidth: null,
        }
    },
    methods: {
        slideLeft() {
            this.startAnimation(-1);
        },
        slideRight() {
            this.startAnimation(1);
        },
        startAnimation(dir) {
            const { itemWidth, movies } = this;
            const animate = () => {
                const { x, containerWidth } = this;
                const newX = x + (this.speed * dir);

                const GAP = itemWidth / 2;
                const MAX_LEFT = 0 + GAP;
                if (dir > 0 && newX >= MAX_LEFT) {
                    this.stopAnimation();
                    return;
                }

                const MAX_RIGHT = -(itemWidth * movies.length + GAP - containerWidth);
                
                this.leftVisible = newX < -(itemWidth - GAP)
                this.rightVisible = newX - (itemWidth + GAP) > MAX_RIGHT
                if (dir < 0 && newX <= MAX_RIGHT) {
                    this.stopAnimation();
                    return;
                }

                this.x = newX;
                this.interval = window.requestAnimationFrame(animate);
            };

            this.interval = window.requestAnimationFrame(animate);
        },
        stopAnimation() {
            if (this.interval) {
                window.cancelAnimationFrame(this.interval);
            }

            this.speed = 10;
        },
        onResize() {
            this.containerWidth = document.getElementsByClassName('container')[0].clientWidth
        }
    },

    created() {
        this.onResize = this.onResize.bind(this);
        if (!!this.state) {
            const { x, leftVisible, rightVisible, speed, interval, containerWidth } = this.state;
            this.x = x
            this.leftVisible = leftVisible
            this.rightVisible = rightVisible
            this.speed = speed
            this.interval = interval
            this.containerWidth = containerWidth
        }
    },
    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize();
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
        
        // Save state to vuex store
        // TODO(diego): Create utility
        this.$store.dispatch('updateUi', {
            route: this.route,
            tag: this.tag,
            __state: {
                x: this.x,
                leftVisible: this.leftVisible,
                rightVisible: this.rightVisible,
                speed: this.speed,
                interval: this.interval,
                containerWidth: this.containerWidth,
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    padding: 12px 0px;
    text-align: center;
}

.movie-slider {
    position: relative;
    left: 100px;
}

.gradient-effect {
    position: absolute;
    display: inline-block;
    top: 0;
    width: 20vw;
    max-width: 200px;
    height: 100%;
    z-index: 4;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;

    &:hover {
        & i {
            opacity: 1;
        }
    }

    & i {
        opacity: 0;
    }

    &.left {
        left: 0;
        /* FF3.6-15 */
        background: -webkit-linear-gradient(left, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0) 100%);
        /* Chrome10-25,Safari5.1-6 */
        background: -webkit-gradient(linear, left top, right top, from(rgba(26, 26, 26, 1)), to(rgba(26, 26, 26, 0)));
        background: -o-linear-gradient(left, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0) 100%);
        background: linear-gradient(to right, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0) 100%);
        /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1a1a1a', endColorstr='#1a1a1a', GradientType=1);
        /* IE6-9 */
        & i {
            position: absolute;
            left: 40%;
            top: 50%;
            -webkit-transform: translate(0, -50%);
                -ms-transform: translate(0, -50%);
                    transform: translate(0, -50%)
        }
    }

    &.right {
        right: 0;
        /* FF3.6-15 */
        background: -webkit-linear-gradient(left, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
        /* Chrome10-25,Safari5.1-6 */
        background: -webkit-gradient(linear, left top, right top, from(rgba(26, 26, 26, 0)), to(rgba(26, 26, 26, 1)));
        background: -o-linear-gradient(left, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
        background: linear-gradient(to right, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
        /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1a1a1a', endColorstr='#1a1a1a', GradientType=1);
        /* IE6-9 */
        & i {
            position: absolute;
            right: 40%;
            top: 50%;
            -webkit-transform: translate(0, -50%);
                -ms-transform: translate(0, -50%);
                    transform: translate(0, -50%)
        }
    }

    &.visible {
        & i {
            -webkit-animation: fade 2s infinite;
            /* Safari 4.0 - 8.0 */
            animation: fade 2s infinite;

            &:hover {
                 -webkit-animation: none;
                animation: none;
            }
        }
    }
}


/* Safari 4.0 - 8.0 */

@-webkit-keyframes fade {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

@keyframes fade {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

</style>
