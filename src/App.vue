<template>
  <div id="app">
    <TransportProblem/>
  </div>
</template>

<script>
import TransportProblem from "@/components/TransportProblem";

export default {
  name: 'App',
  components: {
    TransportProblem
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
