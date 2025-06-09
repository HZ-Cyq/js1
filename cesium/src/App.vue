<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <!-- <HomeView/> -->
    <!-- <ThiessenPolygon /> -->
     <!-- <RadarEffect /> -->
      <!-- <RadarEffect2 /> -->
      <!-- <RadarEffect3 /> -->
       <!-- <RadarEffect4 /> -->
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import HomeView  from './components/HomeView.vue'
import ThiessenPolygon from './components/thiessenpolygon/ThiessenPolygon.vue';
import RadarEffect3 from './components/effect/RadarEffect3.vue';
import RadarEffect4 from './components/effect/RadarEffect4.vue';

export default {
  name: 'App',
  components: {
    HelloWorld,
    HomeView,
    ThiessenPolygon,
    /** 贴地扇面 */
    RadarEffect3,
    /** 直线扇形 */
    RadarEffect4,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
