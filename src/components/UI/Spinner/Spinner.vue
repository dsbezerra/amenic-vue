<template>
    <div class="spinner" :class="{ [size]: true }"></div>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: '',
        }
    }
}
</script>

<style lang="scss" scoped>
.spinner {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.5);

    margin: 100px auto;
    -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
    animation: sk-rotateplane 1.2s infinite ease-in-out;
}

@-webkit-keyframes sk-rotateplane {
    0% {
        -webkit-transform: perspective(120px)
    }
    50% {
        -webkit-transform: perspective(120px) rotateY(180deg)
    }
    100% {
        -webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg)
    }
}

@keyframes sk-rotateplane {
    0% {
        transform: perspective(120px) rotateX(0deg) rotateY(0deg);
        -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
        background-color: rgba(255, 255, 255, 0.5);
    }
    50% {
        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
        -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
        background-color: rgba(255, 255, 255, 1.0);
    }
    100% {
        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        background-color: rgba(255, 255, 255, 0.5);
    }
}

.big {
    width: 80px !important;
    height: 80px !important;
}
</style>
