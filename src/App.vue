<template>
  <div id="app">
    <amenic-header />
    <router-view />
    <amenic-footer />
  </div>
</template>

<script>
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
export default {
  components: {
    'amenic-header': Header,
    'amenic-footer': Footer,
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  color: #fff;
}

body {
  background: #1a1a1a;
}

.header {
    font-size: 42px;
    font-family: 'Roboto Condensed', sans-serif;
    padding: 0 10%;
    margin: 24px 0px;
    font-weight: 300;
}
</style>
