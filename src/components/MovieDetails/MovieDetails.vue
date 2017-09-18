<template>
    <transition name="slide-fade">
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
                    <img class="poster" :src="movie.poster" />
                </div>
                <div class="right">
                    <h1>Sinopse</h1>
                    <p>{{ movie.plot }}</p>
                    <rating v-if="movie.rating" :value="movie.rating" />
                </div>
            </div>
            <divider />
            <div v-if="movie.isInTheaters" class="showtime-info">
                <div class="showtimes-header">
                    <h1>Horários de Exibição</h1>
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

            <h1 v-if="movie.isComingSoon" class="release-text">Estreia em: {{ releaseDate }}</h1>
        </div>
    </transition>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { parseDate, getNameOfMonth } from '../../utils/time';
import Showtime from '../Showtime/Showtime.vue'
import Rating from './Rating.vue'
import Divider from '../UI/Divider/Divider.vue'
import Icon from '../UI/Icon/Icon.vue'
import IconCinemais from '../UI/Icon/IconCinemais.vue'
import IconIbicinemas from '../UI/Icon/IconIbicinemas.vue'
import Spinner from '../UI/Spinner/Spinner.vue'

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
    },
    computed: {
        ...mapState({
            movies: state => state.movies.movies,
        }),
        ...mapGetters({
            showtimes: 'showtimesByMovie',
        }),
        isFetchingShowtimes() {
            return this.showtimes(this.id).isFetching
        },
        getShowtimes() {
            return this.showtimes(this.id).data
        },
        groupedShowtimes() {
            return this.groupByWeekdays(this.getShowtimes)
        },
        ibiShowtimes() {
            return this.groupedShowtimes[this.currentWeekday].showtimes['ibicinemas']
        },
        cinemaisShowtimes() {
            return this.groupedShowtimes[this.currentWeekday].showtimes['cinemais']
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
        },
    },
    methods: {
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
                    cinemais: [],
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
                        'cinemais': [],
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

            if (showtime.availableIn2D) {
                result = '2D';
            } else if (showtime.availableIn3D) {
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
                    keys.forEach(key => weekdays[key].showtimes[showtime.cinema].push(showtime));
                } else {
                    // Create key from weekday
                    const key = `weekday-${showtime.weekday}`;
                    weekdays[key].showtimes[showtime.cinema].push(showtime);
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
                        let image = item.availableIn2D ? '2d' : '3d';
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
        }
    },
    data() {
        return {
            movie: {},
            weekdaysOriginal: null,
            weekdays: {},
            currentWeekday: '',
            indicator: {
                width: 84,
                leftX: 0,
            }
        }
    },
    created() {
        // Replace for now
        if (!this.movies.byId[this.id]) {
            this.$router.replace('/');
            return
        }

        this.setupWeekdays()

        // Fetch showtimes
        this.fetchShowtimes(this.id)

        // TODO(diego): Remove ID from path and use action SET_MOVIE
        this.movie = this.movies.byId[this.id]
    }
}
</script>

<style lang="scss" scoped>
.container {
    overflow: auto;
    position: relative;
}

.movie-details {
    padding: 0 10%;
    padding-top: 40px;
    background-color: rgba(26, 26, 26, 0.99);

    & h1 {
        font-size: 2rem;
        font-family: 'Roboto Condensed', sans-serif;
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
        font-size: 1.2rem;
        line-height: 1.8rem;
        color: #595959;
    }
}

.genres-runtime {
    font-size: 1.5rem;
    color: #595959;
    margin-top: 10px;
}

.poster {
    width: 100%;
    height: auto;
}

.left {
    width: 260px;
    margin-right: 30px;
}

.right {
    width: 100%;
    position: relative;
}

.title-trailer {
    display: flex;
    align-items: center;
    position: relative;

    & h1 {
        text-transform: capitalize;
    }
}

.trailer {
    position: absolute;
    right: 0;

    font-size: 1.4rem;
    color: #595959;
    font-family: 'Roboto Condensed', sans-serif;

    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    transform-origin: top right;
    transition: all 400ms ease-in-out;

    &:hover {
        color: #fff;
        cursor: pointer;
        background: rgba(60, 60, 60, 1);

        width: 100%;
        height: 200px;
        z-index: 24;
    }
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

.release-text {
    margin-top: 24px;
}

.weekdays {
    position: relative;
    margin-top: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    & ul {
        list-style: none;
        height: 50px;

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
        transition: all 200ms cubic-bezier(.56,.17,.01,.99);
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
    transform: translateX(20px);
    opacity: 0;
}

.showtime-fade-enter-active {
    transition: all .3s ease;
}

.showtime-fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.showtime-fade-enter,
.showtime-fade-leave-to
{
    transform: translateY(10px);
    opacity: 0;
}
</style>
