<template>
    <table>
        <tr>
            <th>Dias da semana</th>
            <th>Inteira</th>
            <th>Meia</th>
        </tr>
        <tr>
            <td class="highlight">Projeção 2D</td>
        </tr>
        <tr v-for="price of prices2d" :key="price.value">
            <td class="weekdays">{{ getWeekdaysText(price.weekdays) }}</td>
            <td>{{ formatPrice(price.value) }}</td>
            <td>{{ formatPrice(price.value / 2) }}</td>
        </tr>
        <tr>
            <td class="highlight">Projeção 3D</td>
        </tr>
        <tr v-for="price of prices3d" :key="price.value">
            <td class="weekdays">{{ getWeekdaysText(price.weekdays) }}</td>
            <td>{{ formatPrice(price.value) }}</td>
            <td>{{ formatPrice(price.value / 2) }}</td>
        </tr>
    </table>
</template>

<script>
export default {
    props: {
        prices2d: Array,
        prices3d: Array,
    },
    
    methods: {
        formatPrice(price) {
            const fixed = price.toFixed(2);
            const result = 'R$ ' + String(fixed);
            return result.replace('.', ',');
        },

        getWeekdaysText(weekdays) {
            let result = '';
            weekdays.forEach((weekday, index) => {
                result += this.getWeekdayText(weekday);

                if (index === weekdays.length - 2) {
                    result += ' e ';
                } else if (index < weekdays.length - 1) {
                    result += ', ';
                }
            }); 
            return result;
        },

        getWeekdayText(weekday) {
            let result = '';

            switch (weekday) {
                case 1: result = 'Domingo'; break;
                case 2: result = 'Segunda'; break;
                case 3: result = 'Terça'; break;
                case 4: result = 'Quarta'; break;
                case 5: result = 'Quinta'; break;
                case 6: result = 'Sexta'; break;
                case 7: result = 'Sábado'; break;
                case 8: result = 'Feriado'; break;
                case 9: result = 'Pré-Estreia'; break;
                default:
                    console.log('Unknown weekday %s', weekday);
                    break;
            }

            return result;
        }
    }
}
</script>

<style lang="scss" scoped>
table {
    width: 100%;
    text-align: left;
}
th {
    color: #fff;
    font-size: 24px;
    height: 40px;
}
td {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 200;
    font-size: 20px;
    height: 30px;
}

.highlight {
    color: #fff;
    font-size: 20px;
}

.weekdays {
    max-width: 200px;
}
</style>
