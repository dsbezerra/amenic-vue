<template>
    <nav>
        <router-link to="/"><img src="../../assets/logo.png" alt="amenic" /></router-link>
        <ul>
            <li>
                <router-link to="/">
                    <icon name="home" size="medium"></icon>
                </router-link>
            </li>
            <li>
                <router-link to="/prices">
                    <icon name="attach_money" size="medium"></icon>
                </router-link>
            </li>
            <li>
                <router-link to="/settings">
                    <icon name="settings" size="medium"></icon>
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<script>
import Icon from '../UI/Icon/Icon.vue'

export default {
    components: {
        Icon,
    }
}
</script>

<style lang="scss">
nav {
    position: relative;
    min-height: 160px;
    max-height: 240px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.02);

    & img {
        position: absolute;
        left: 10%;
        width: 200px;
        min-width: 50px;
        max-width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }

    & ul {
        position: absolute;
        list-style-type: none;
        padding: 0;
        right: 10%;

        & li {
            display: inline;
            padding: 12px;

            & a.active {
                & .amenic {
                    opacity: 1 !important;
                }
            }
        }
    }
}
</style>