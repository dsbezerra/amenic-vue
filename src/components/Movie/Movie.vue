<template>
    <router-link :to="'/movie/' + movie.id" :movie="movie">
        <div class="movie">
            <div class="title">
                <p>{{ movie.title }}
                    <span v-if="movie.cinemas" class="extra">{{ cinemas }}</span>
                    <span v-if="!movie.cinemas && movie.releaseDate" class="extra">{{ releaseDate }}</span>
                </p>
            </div>
            <img :src="movie.poster" />
        </div>
    </router-link>
</template>

<<script>
export default {
    props: {
        movie: Object,
    },
    computed: {
        cinemas() {
            let result = []
            this.movie.cinemas.forEach(cinema => result.push(cinema.shortName))
            return result.join(' - ')
        },
        releaseDate() {
            let result = '';
            const date = new Date(this.movie.releaseDate)
            const d = this.addZero(date.getDate())
            const m = this.addZero(date.getMonth() + 1)
            result = `${d}/${m}/${date.getFullYear()}`
            return result;
        }
    },
    methods: {
        addZero(n) {
            if (n < 10) {
                n = '0' + n
            }
            return n
        }
    }
}
</script>

<style lang="scss" scoped>
.movie {
    position: relative;
    display: inline-block;
    overflow: hidden;
    width: 100%;
    max-width: 300px;
    max-height: 450px;
    background: rgba(0, 0, 0, 0.5);
    transition: all 400ms ease;
    z-index: 0;
    box-sizing: border-box;

    &:hover {
        position: relative;
        border: 0.2em solid #fff;
        z-index: 1;
        transform: scale(1.05);
        cursor: pointer;
        -webkit-box-shadow: 0px 5px 60px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 5px 60px 0px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 5px 60px 0px rgba(0, 0, 0, 0.2);

        & img {
            opacity: 1;
            transform: translateZ(0) scale(1.05);
        }

        & .title {
            opacity: 1;
            transform: translateY(0px);
        }
    }

    & img {
        max-width: 100%;
        max-height: 100%;
        opacity: 0.4;
        transition: all 400ms ease;
    }
}

.title {
    position: absolute;
    bottom: 0;
    z-index: 2;
    width: 100%;
    min-height: 100px;
    color: white;
    opacity: 0;
    transform: translateY(100px);
    transition: all 200ms ease;
    background: -moz-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
    /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#000000', GradientType=0);
    /* IE6-9 */
    & p {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 12px;
        box-sizing: border-box;
        font-size: 20px;
        display: inline-block;
        font-family: 'Roboto Condensed', sans-serif;
        color: #fff;
        width: 100%;
        height: auto;
        white-space: normal;
        font-weight: 500;
        text-align: left;
    }

    & .extra {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
