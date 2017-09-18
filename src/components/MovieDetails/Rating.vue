<template>
    <div class="rating">
        <img :src="require('../../assets/' + rating.image)" alt="Classificação Indicativa" width="48px" />
        <span>
            {{ rating.text }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        value: Number,
    },
    computed: {
        rating() {
            const rating = {
                image: '',
                text: '',
            }

            switch (this.value) {
                case -1:
                    rating.image = 'L.png'
                    rating.text = 'Livre para todas as idades'
                    break

                case 18:
                    rating.image = '18.png'
                    rating.text = 'Proibido para menores de 18 anos'
                    break

                default:
                    rating.image = `${this.value}.png`
                    rating.text = `Não recomendado para menores de ${this.value} anos`
                    break
            }

            return rating
        },
    }
}
</script>

<style lang="scss" scoped>
.rating {
    display: flex;
    align-items: center;

    position: absolute;
    bottom: 5px;

    & span {
        color: #595959;
        margin-left: 24px;
    }
}
</style>
