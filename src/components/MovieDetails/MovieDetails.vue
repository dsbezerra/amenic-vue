<template>
    <transition name="slide-fade">
        <div class="wrapper">
            <div v-if="!isFetchingMovie && !!movie">
                <div class="backdrop" :style="{ backgroundImage: 'url(' + movie.backdrop + ')'}">
                    <div class="effect" />
                </div>
                <div class="movie-details">
                    <div class="title-trailer">
                        <div>
                            <h1>{{ movie.title }}</h1>
                            <p class="genres-runtime">
                                {{ genresRuntime }}
                            </p>
                        </div>
                    </div>
                    <div class="movie-info">
                        <div class="left">
                            <div class="trailer-poster" @click="seeTrailer($event)">
                                <img class="poster" :src="movie.poster" />
                                <icon v-if="movie.trailer" name="play_arrow" />
                                <p v-if="movie.trailer" class="watch-trailer">Assistir trailer</p>
                            </div>
                        </div>
                        <div class="right">
                            <h1>Sinopse</h1>
                            <p>{{ movie.synopsis ? movie.synopsis : "Indisponível" }}</p>
                            <rating v-if="movie.rating" :value="movie.rating" />
                        </div>
                    </div>
                    <divider />
                    <trailer v-if="movie.trailer && trailer.isWatching" :background="movie.poster" :position="trailer.position" :box="trailer.box" :trailer="movie.trailer" :onClose="closeTrailer.bind(this)" />
                    <div v-if="isMovieReleased" class="showtime-info">
                        <div class="showtimes-header">
                            <h1>Programação</h1>
                            <icon v-on:click.native="refresh()" name="refresh" size="medium" />
                        </div>
                        <spinner v-if="isFetchingShowtimes" />
                        <div v-if="getShowtimes.length !== 0">
                            <div class="weekdays">
                                <ul>
                                    <li v-for="(value, key, index) in weekdays" :key="key" v-on:click="updateWeekday(key)" class="weekday" :class="{ active: currentWeekday === key}">
                                        {{ value.label }}
                                    </li>
                                </ul>
                                <div class="indicator" ref="indicator" :style="{ left: indicator.leftX + 'px', width: indicator.width + 'px' }" />
                            </div>

                            <transition name="showtime-fade" mode="out-in">
                                <div class="showtime-container" :key="currentWeekday">
                                    <div class="cinema">
                                        <icon-ibicinemas width="50" />
                                        <span>IBICINEMAS</span>
                                    </div>
                                    <showtime :showtimes="ibiShowtimes" />

                                    <div class="cinema">
                                        <icon-cinemais width="50" />
                                        <span>Cinemais</span>
                                    </div>
                                    <showtime :showtimes="cinemaisShowtimes" />
                                </div>
                            </transition>
                        </div>
                    </div>
                   
                    <div class="release" v-if="!isMovieReleased">
                        <h1>Estreia</h1>
                        <p>{{ releaseDate }}</p>
                    </div>
                    
                
                </div>
            </div>
            <spinner v-if="isFetchingMovie" />
        </div>
    </transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { parseDate, getNameOfMonth } from '../../utils/time'
import Showtime from '../Showtime/Showtime.vue'
import Rating from './Rating.vue'
import Divider from '../UI/Divider/Divider.vue'
import Icon from '../UI/Icon/Icon.vue'
import IconCinemais from '../UI/Icon/IconCinemais.vue'
import IconIbicinemas from '../UI/Icon/IconIbicinemas.vue'
import Spinner from '../UI/Spinner/Spinner.vue'

import Trailer from '../Trailer/Trailer.vue'

import moment from 'moment'
import _ from 'lodash'

export default {
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    components: {
        Divider,
        Icon,
        IconCinemais,
        IconIbicinemas,
        Spinner,
        Showtime,
        Rating,
        Trailer,
    },
    computed: {
        ...mapGetters({
            movie: 'movie',
            movies: 'movies',
            isFetchingMovie: 'isFetchingMovie',
            showtimes: 'showtimesByMovie',
        }),
        isMovieReleased() {
            const { movie } = this;
            if (!movie || !movie.releaseDate) {
                return false
            }

            const now = Date.now()
            const date = new Date(movie.releaseDate)
            return now - date.getTime() > 0
        },
        isFetchingShowtimes() {
            const showtimes = this.showtimes(this.id)
            return !showtimes || showtimes.isFetching
        },
        getShowtimes() {
            const showtimes = this.showtimes(this.id)
            return showtimes ? showtimes.data : []
        },
        groupedShowtimes() {
            return this.groupByWeekdays(this.getShowtimes)
        },
        ibiShowtimes() {
            return this.groupedShowtimes[this.currentWeekday].showtimes['ibicinemas'] || []
        },
        cinemaisShowtimes() {
            return this.groupedShowtimes[this.currentWeekday].showtimes['cinemais-34'] || []
        },
        genresRuntime() {
            let result = ''

            const { movie } = this
            if (movie.genres) {
                result += movie.genres.join(', ')
            }

            if (movie.runtime) {
                result += ' - ' + movie.runtime + ' min'
            }

            return result
        },
        releaseDate() {
            if (!this.movie.releaseDate) {
                return '';
            }

            return parseDate(new Date(this.movie.releaseDate));
        }
    },
    methods: {
        setMovie(movie) {
            if (movie == undefined) {
                return;
            }

            this.$store.dispatch('setMovie', movie)
        },
        fetchMovie(movieId) {
            if (!movieId) {
                throw new Error('invalid ID')
            }

            this.$store.dispatch('fetchMovie', movieId)
        },
        fetchShowtimes(movieId, force = false) {
            this.$store.dispatch('fetchShowtimes', {
                movieId,
                force,
            })
        },
        refresh() {
            if (this.isFetchingShowtimes) {
                return
            }
            this.fetchShowtimes(this.id, true)
        },
        // Fix undefined on route open
        calculateIndicator() {
            const keys = Object.keys(this.weekdays)
            const index = keys.indexOf(this.currentWeekday)
            const el = document.getElementsByClassName('weekday')[index]
            if (el) {
                this.indicator = {
                    width: el.clientWidth,
                    leftX: el.offsetLeft,
                }
            }
        },
        setupWeekdays() {
            const today = new Date()
            const weekday = today.getDay()
            this.currentWeekday = 'weekday-' + weekday

            const daysToCreate = weekday < 4 ? (3 - weekday) : (4 + 7 - 1) - weekday
            this.weekdays['weekday-' + weekday] = {
                label: 'Hoje',
                date: moment(),
                showtimes: {
                    'cinemais-34': [],
                    ibicinemas: [],
                },
            };

            for (let i = 1; i <= daysToCreate; i++) {
                const nextDate = moment().add(i, 'days')

                let label = ''
                if (i === 1) {
                    label = 'Amanhã'
                } else {
                    label = this.getNameForWeekday(nextDate.day() + 1, true)
                    label = label.toLocaleLowerCase() + ' ' + nextDate.date() + " " + getNameOfMonth(nextDate.month(), true)
                }

                this.weekdays['weekday-' + nextDate.day()] = {
                    label,
                    date: nextDate,
                    showtimes: {
                        'cinemais-34': [],
                        'ibicinemas': [],
                    },
                }
            }

            this.weekdaysOriginal = _.cloneDeep(this.weekdays)
        },
        getRoomText(showtime, withRoom = false) {
            let text = '';
            if (withRoom) {
                text = `Sala ${showtime.room}, `;
            }

            text += `${this.getNameForAudioVersion(showtime)}${this.getNameForVideoVersion(showtime)}`;
            return text;
        },
        getWeekdaysText(weekdays) {
            const weekdaysInText = [];
            if (weekdays.length > 0) {
                weekdays.forEach((weekday) => {
                    weekdaysInText.push(this.getNameForWeekday(weekday));
                });

                return weekdaysInText.join(', ');
            }

            return weekdaysInText;
        },
        getNameForWeekday(weekday, abbr = true) {
            let result = '';

            if (weekday === 0) {
                result = 'Todos os dias';
            } else if (weekday === 1) {
                result = abbr ? 'Dom.' : 'Domingo';
            } else if (weekday === 2) {
                result = abbr ? 'Seg.' : 'Segunda';
            } else if (weekday === 3) {
                result = abbr ? 'Ter.' : 'Terça';
            } else if (weekday === 4) {
                result = abbr ? 'Qua.' : 'Quarta';
            } else if (weekday === 5) {
                result = abbr ? 'Qui.' : 'Quinta';
            } else if (weekday === 6) {
                result = abbr ? 'Sex.' : 'Sexta';
            } else if (weekday === 7) {
                result = abbr ? 'Sáb.' : 'Sábado';
            } else if (weekday === 8) {
                result = 'Feriados';
            } else if (weekday === 9) {
                result = 'Pré-Estreia'
            }

            return result;
        },
        getNameForVideoVersion(showtime) {
            let result = '';

            if (showtime.is2D) {
                result = '2D';
            } else if (showtime.is3D) {
                result = '3D';
            }

            return result;
        },
        getNameForAudioVersion(showtime, abbr = false) {
            let result = '';

            if (showtime.isSubbed) {
                result = abbr ? 'Leg.' : 'Legendado, ';
            } else if (showtime.isDubbed) {
                result = abbr ? 'Dub.' : 'Dublado, ';
            }
            return result;
        },
        groupByWeekdays(arr) {
            // Create a brand new weekdays object to make sure we are starting with the desired initial state for weekdays
            const weekdays = _.cloneDeep(this.weekdaysOriginal);

            const keys = Object.keys(weekdays);
            arr.forEach((showtime) => {
                if (showtime.weekday === 0) {
                    // Push to all weeekdays available
                    keys.forEach(key => weekdays[key].showtimes[showtime.cinemaId].push(showtime));
                } else {
                    // Create key from weekday
                    const key = `weekday-${showtime.weekday - 1}`;
                    if (weekdays[key]) {
                        weekdays[key].showtimes[showtime.cinemaId].push(showtime);
                    }
                }
            });

            // Group by version and audio every showtime in each weekday for each cinema
            keys.forEach((key) => {
                let weekday = weekdays[key];
                let cinemas = Object.keys(weekday.showtimes);
                cinemas.forEach((cinema) => {
                    let grouped = _.groupBy(weekday.showtimes[cinema], (item) => {
                        let audio = item.isSubbed ? 'sub' : 'dub';
                        if (item.national) {
                            audio = 'nat';
                        }
                        let image = item.is2D ? '2d' : '3d';
                        return `${audio}-${image}`;
                    });

                    let groups = _.keys(grouped);
                    let newArr = _.map(groups, (group) => {
                        let showtimes = grouped[group];
                        let times = showtimes.map(showtime => showtime.time);
                        let description = this.getRoomText(showtimes[0]);
                        return {
                            description,
                            times,
                        }
                    });

                    weekdays[key].showtimes[cinema] = newArr;
                })
            });

            return weekdays;
        },
        updateWeekday(newWeekday) {
            this.currentWeekday = newWeekday
            // Update indicator position
            this.calculateIndicator()
        },
        seeTrailer(event) {
            const { target } = event
            if (target) {
                // Get start positions
                const X = this.getOffset(target, 'offsetLeft') - window.scrollX
                const Y = this.getOffset(target, 'offsetTop') - window.scrollY

                this.trailer = {
                    isWatching: true,
                    position: {
                        left: X,
                        top: Y,
                    },
                    box: {
                        width: target.clientWidth,
                        height: target.clientHeight,
                    }
                }
            }
        },
        getOffset(element, prop) {
            if (prop !== 'offsetTop' && prop !== 'offsetLeft') {
                throw new Error('prop must be offsetTop or offsetLeft')
            }

            let copy = Object.assign(element, {})
            let total = copy[prop]
            while (copy.offsetParent) {
                copy = copy.offsetParent
                total += copy[prop]
            }

            return total
        },
        closeTrailer() {
            this.trailer = {
                isWatching: false,
            }
        }
    },
    data() {
        return {
            weekdaysOriginal: null,
            weekdays: {},
            currentWeekday: '',
            indicator: {
                width: 84,
                leftX: 0,
            },
            trailer: {
                isWatching: false,
                position: {
                    left: 0,
                    top: 0,
                },
                box: {
                    width: 0,
                    left: 0,
                }
            }
        }
    },
    created() {
        const { nowPlaying, upcoming } = this.movies;
        if (!nowPlaying.byId[this.id] && !upcoming.byId[this.id]) {
            this.fetchMovie(this.id)
            return
        }

        this.setMovie(nowPlaying.byId[this.id] || upcoming.byId[this.id])
        this.setupWeekdays()
    },
    watch: {
        movie: function(newMovie) {
            this.setupWeekdays()
            this.fetchShowtimes(newMovie.id)
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    overflow: auto;
    position: relative;
}

.wrapper {
    position: relative;
}

.backdrop {
    position: absolute;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    background-attachment: fixed;
    height: 100%;
    width: 100%;
}

.backdrop .effect {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: rgba(26, 26, 26, 0);
    background: -moz-linear-gradient(top, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(26, 26, 26, 0)), color-stop(100%, rgba(26, 26, 26, 1)));
    background: -webkit-linear-gradient(top, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
    background: -o-linear-gradient(top, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
    background: -ms-linear-gradient(top, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
    background: linear-gradient(to bottom, rgba(26, 26, 26, 0) 0%, rgba(26, 26, 26, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1a1a1a', endColorstr='#1a1a1a', GradientType=0);
}

.movie-details {
    padding: 0 10%;
    padding-top: 40px;
    background: rgba(26, 26, 26, 1);
    background: -moz-linear-gradient(top, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0.85) 50%, rgba(26, 26, 26, 1) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(26, 26, 26, 1)), color-stop(50%, rgba(26, 26, 26, 0.85)), color-stop(100%, rgba(26, 26, 26, 1)));
    background: -webkit-linear-gradient(top, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0.85) 50%, rgba(26, 26, 26, 1) 100%);
    background: -o-linear-gradient(top, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0.85) 50%, rgba(26, 26, 26, 1) 100%);
    background: -ms-linear-gradient(top, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0.85) 50%, rgba(26, 26, 26, 1) 100%);
    background: linear-gradient(to bottom, rgba(26, 26, 26, 1) 0%, rgba(26, 26, 26, 0.85) 50%, rgba(26, 26, 26, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1a1a1a', endColorstr='#1a1a1a', GradientType=0);
    position: relative;

    & h1 {
        font-size: 2rem;
        font-family: 'Roboto Condensed', sans-serif;
        font-weight: 300;
    }
}

.movie-info {
    margin-top: 50px;
    margin-bottom: 12px;
    display: flex;

    & h1 {
        margin-bottom: 20px;
    }

    & p {
        font-size: 1.1rem;
        line-height: 1.8rem;
        font-family: Roboto, sans-serif;
        font-weight: 300 !important;
        color: rgba(255, 255, 255, 0.6);
    }
}

.genres-runtime {
    font-size: 1.5rem;
    color: #595959;
    margin-top: 10px;
}

.trailer-poster {
    max-height: 450px;
    position: relative;

    &:hover {
        cursor: pointer;
        & i {
            transform: translate(-50%, -50%) scale(3);
        }

        & .watch-trailer {
            opacity: 1;
            max-height: 45px;
        }
    }

    & i {
        position: absolute;
        top: 50%;
        left: 50%;
        opacity: 1;
        transform: translate(-50%, -50%) scale(0);
        border-radius: 50%;
        border: 1px solid white;
        background-color: rgba(0, 0, 0, 0.2);
        pointer-events: none;
    }
}

.poster {
    width: 100%;
    height: auto;
}

.watch-trailer {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 6px;
    overflow: hidden;
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    transition: all 400ms ease;
    background: -moz-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 35%, rgba(0, 0, 0, 1) 100%);
    /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 35%, rgba(0, 0, 0, 1) 100%);
    /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 35%, rgba(0, 0, 0, 1) 100%);
    /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#000000', GradientType=0);
    /* IE6-9 */
    & p {
        text-overflow: ellipsis;
        font-size: 12px !important;
        color: white !important;
    }
    pointer-events: none;
}


.left {
    width: 260px;
    margin-right: 30px;
}

.right {
    width: 100%;
    position: relative;
    padding-bottom: 56px;
}

.title-trailer {
    display: flex;
    align-items: center;
    position: relative;
}

.showtime-info {
    margin-top: 24px;
}

.showtimes-header {
    display: flex;
    align-items: center;
    user-select: none;

    & i {
        margin-left: 12px;
    }
}

.release {
    margin-top: 24px;

    p {
        font-size: 24px;
        color: #595959;
        margin-top: 12px;
    }
}

.weekdays {
    position: relative;
    margin-top: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    & ul {
        list-style: none;
        height: 50px;
        overflow: hidden;

        & li {
            font-size: 18px;
            display: inline-block;
            color: rgba(255, 255, 255, 0.5);
            line-height: 50px;
            padding: 0 24px;
            text-align: center;
            white-space: nowrap;
            transition: all 400ms ease;

            &:hover {
                color: #fff;
                cursor: pointer;
            }

            &.active {
                color: #fff;
            }
        }
    }

    & .indicator {
        position: absolute;
        left: 0;
        width: 84px;
        height: 2px;
        background-color: #fff;
        transition: all 200ms cubic-bezier(.56, .17, .01, .99);
    }
}

.showtime-container {}

.cinema {
    display: flex;
    align-items: center;

    & span {
        margin-left: 24px;
        font-size: 18px;
    }
}

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */

{
    transform: translateY(20px);
    opacity: 0;
}

.showtime-fade-enter-active {
    transition: all .3s ease;
}

.showtime-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.showtime-fade-enter,
.showtime-fade-leave-to {
    transform: translateY(10px);
    opacity: 0;
}
</style>
