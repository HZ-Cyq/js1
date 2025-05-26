<template>
  <div id="app">
    <ThiessenPolygon />
    <!-- <Projection /> -->
  </div>
</template>

<script>
import ThiessenPolygon from './components/thiessenpolygon/thiessenpolygon.vue';
import Projection from './components/projection/Projection.vue';
export default {
  name: 'App',
  components: {
    ThiessenPolygon,
    Projection,
  },
};
</script>

<style>
/* 可以在这里添加全局样式 */
</style>