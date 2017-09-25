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
import Icon from '../UI/Icon/Icon.vue'
import Movie from '../Movie/Movie.vue'

export default {
    components: {
        Icon,
        Movie,
    },

    props: {
        movies: {
            type: Array,
            default: [],
        },
        itemWidth: {
            type: Number,
            default: 310,
        }
    },

    data() {
        return {
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
    },

    mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize();
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
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
    display: flex;
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
        background: -moz-linear-gradient(left, rgba(26, 26, 26, 1) 0%, rgba(125, 185, 232, 0) 100%);
        /* FF3.6-15 */
        background: -webkit-linear-gradient(left, rgba(26, 26, 26, 1) 0%, rgba(125, 185, 232, 0) 100%);
        /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right, rgba(26, 26, 26, 1) 0%, rgba(125, 185, 232, 0) 100%);
        /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1a1a1a', endColorstr='#007db9e8', GradientType=1);
        /* IE6-9 */
        & i {
            position: absolute;
            left: 40%;
        }
    }

    &.right {
        right: 0;
        background: -moz-linear-gradient(left, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
        /* FF3.6-15 */
        background: -webkit-linear-gradient(left, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
        /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to right, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
        /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#001a1a1a', endColorstr='#1a1a1a', GradientType=1);
        /* IE6-9 */
        & i {
            position: absolute;
            right: 40%;
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
