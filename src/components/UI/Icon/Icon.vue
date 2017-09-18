<template>
    <i class="material-icons amenic" :class="{ [size]: true, active: active }">
        {{ name }}
    </i>
</template>

<script>

export default {
    props: {
        name: String,
        size: {
            type: String,
            default: 'normal',
        },
        active: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.amenic {
    transition: all 400ms ease;
    color: #fff;
    opacity: 0.2;

    &:hover {
        cursor: pointer;
        opacity: 1;
    }

    &.active {
        opacity: 1;
    }
}

.small {
    font-size: 12px;
}

.normal {
    font-size: 24px;
}

.medium {
    font-size: 32px;
}

.big {
    font-size: 56px;
}
</style>