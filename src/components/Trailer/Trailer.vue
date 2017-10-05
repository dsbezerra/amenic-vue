<template>
    <transition name="fade">
        <div class="wrapper">
            <div class="close" @click="handleClose">
                <icon name="close" size="big" />
            </div>
            <div class="trailer media-animated" ref="trailer" :style="{ background: `url(${background}) no-repeat center center`, backgroundSize: 'cover'}">
                <iframe ref="iframe" width="100%" height="100%" :class="{ invisible: isLoading }" frameborder="0" allowfullscreen @load="isLoading = false">
                </iframe>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 1;
}

.close {
    position: absolute;
    right: 6%;
    top: 3%;
}

.trailer {
    position: absolute;
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    & iframe {
        opacity: 1;

        &.invisible {
            opacity: 0;
        }

        transition: 400ms ease;
    }
}

.media-animated {
    background: #1a1a1a;
    transition: all 400ms ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */

{
    opacity: 0
}
</style>

<script>
import Icon from '../UI/Icon/Icon.vue'

import { enableScroll, disableScroll } from '../../utils/dom'
export default {
    props: {
        // Start X position
        position: {
            left: Number,
            top: Number,
        },
        box: {
            width: Number,
            height: Number,
        },
        trailer: String,
        background: String,
        // onClose function to execute
        onClose: Function,
    },
    components: {
        Icon,
    },
    computed: {
        getEmbed() {
            const root = 'https://www.youtube.com/embed'
            return `${root}/${this.trailer}?rel=0&showinfo=0&autoplay=1`
        }
    },
    methods: {
        handleClose() {
            const { trailer, iframe } = this.$refs;
            if (trailer) {
                const { left, top } = this.position
                trailer.style.left = left + 'px'
                trailer.style.top = top + 'px'

                const { width, height } = this.box
                trailer.style.width = width + 'px'
                trailer.style.height = height + 'px'

                iframe.src = ''
            }

            setTimeout(() => {
                this.onClose()
            }, 500)
        }
    },
    data() {
        return {
            isLoading: true,
        }
    },
    created() {
        disableScroll('html')
    },
    mounted() {
        const { trailer, iframe } = this.$refs
        if (trailer) {
            const { left, top } = this.position
            trailer.style.left = left + 'px'
            trailer.style.top = top + 'px'

            const { width, height } = this.box
            trailer.style.width = width + 'px'
            trailer.style.height = height + 'px'

            setTimeout(() => {
                trailer.style.width = '80%'
                trailer.style.height = '80%'
                trailer.style.top = "10%"
                trailer.style.left = "10%"
                trailer.style.bottom = "10%"
                trailer.style.bottom = "10%"

                setTimeout(() => {
                    iframe.src = this.getEmbed
                }, 400)

            }, 1000 / 60)
        }
    },
    destroyed() {
        enableScroll('html')
    }
}
</script>
