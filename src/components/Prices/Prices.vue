<template>
    <transition name="slide-fade">
        <div id="container">
            <h1 class="header">Tabela de Preços</h1>
            <spinner v-if="isFetching.ibicinemas" />
            <transition name="slide-fade">
                <div v-if="!isFetching.ibicinemas">
                    <div class="cinema">
                        <icon-ibicinemas width="60" />
                        <span>IBICINEMAS</span>
                    </div>
                    <price-table :prices2d="ibicinemas.filter(price => price.is2D)" :prices3d="ibicinemas.filter(price => !price.is2D)" />
                </div>
            </transition>
            <divider />
            <spinner v-if="isFetching.cinemais" />
            <transition name="slide-fade">
                <div v-if="!isFetching.cinemais">
                    <div class="cinema">
                        <icon-cinemais width="60" />
                        <span>Cinemais</span>
                    </div>
                    <price-table :prices2d="cinemais.filter(price => price.is2D)" :prices3d="cinemais.filter(price => !price.is2D)" />
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import PriceTable from './PriceTable.vue'
import Divider from '../UI/Divider/Divider.vue'
import IconCinemais from '../UI/Icon/IconCinemais.vue'
import IconIbicinemas from '../UI/Icon/IconIbicinemas.vue'
import Spinner from '../UI/Spinner/Spinner.vue'

import { API_URI } from '../../api/helpers'

export default {
    components: {
        PriceTable,
        Divider,
        IconCinemais,
        IconIbicinemas,
        Spinner,
    },
    data() {
        return {
            ibicinemas: {},
            cinemais: {},
            isFetching: {
                ibicinemas: false,
                cinemais: false,
            },
        }
    },
    created() {

        // TODO: create module in vuex
        this.isFetching.ibicinemas = true;
        this.$http.get(`${API_URI}/price?cinema=ibicinemas`)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                        .then((json) => {
                            this.ibicinemas = json.data;
                            this.isFetching.ibicinemas = false;
                        })
                }
            });

        this.isFetching.cinemais = true;
        this.$http.get(`${API_URI}/price?cinema=cinemais-34`)
            .then((res) => {
                if (res.ok) {
                    return res.json()
                        .then((json) => {
                            this.cinemais = json.data;
                            this.isFetching.cinemais = false;
                        })
                }
            });
    }
}
</script>

<style lang="scss" scoped>
#container {
    padding: 0 10%;
}

.header {
    padding: 0;
}

.cinema {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    & span {
        font-size: 32px;
        margin-left: 24px;
        margin-right: 12px;
    }

    & a {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.2);
        text-decoration: none;

        &:hover {
            color: #fff;
        }
    }
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
