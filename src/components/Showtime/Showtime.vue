<template>
    <ul>
        <li v-for="showtime of showtimes" :key="showtime.id">
            <div>
                <span class="room">{{ showtime.description }}</span>
            </div>
            <div class="times">
                <span v-for="time of showtime.times" :key="time" :class="{ open: isSessionOpen(time) }">
                    {{ time }}
                </span>
                <span v-if="showtime.times.length === 0" class="closed">
                    Não informado
                </span>
            </div>
        </li>
        <li v-if="!showtimes.length">
            <p class="info">Nenhuma exibição</p>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        showtimes: Array,
    },

    data() {
        // TODO: Make it better
        return {
            currHours: new Date().getHours(),
            currMinutes: new Date().getMinutes(),
        }
    },
    methods: {
        isSessionOpen(time) {
            let result = false;
            if (!time) {
                return result;
            }

            const parts = time.split(':');
            if (parts.length === 2) {
                const hours = parseInt(parts[0]);
                const minutes = parseInt(parts[1]);

                /* 
                  Show as active even if it passed some minutes 
                  TODO(diego): Use date to compare here
                */
                result = this.currHours < hours || this.currHours === hours && this.currMinutes <= minutes + 5;
            }

            return result;
        }
    }
}
</script>

<style lang="scss" scoped>
ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
}

ul li {
    width: 100%;
    margin: 0;
    padding: 12px 0px;
    min-height: 24px;
    line-height: 24px;
    position: relative;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}

ul li span {
    color: rgba(255, 255, 255, 0.5);
}

.times {
    margin-top: 12px;
}

.times span {
    border-radius: 4px;
    padding: 2px 6px;
    margin-right: 6px;
    font-size: 18px;
    background: #313131;
    color: rgba(255, 255, 255, 0.3);
}

.times span.open {
    background: #006FDE;
    color: #fff;
}

.times span.empty {
    background: #AE4040;
}

.weekday {
    font-size: 12px;
}

.room {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: bold;
    margin-left: 2px;
}

.info {
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0px;
    margin-bottom: 6px;
    font-size: 20px;
}
</style>
