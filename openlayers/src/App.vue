<template>
  <div id="app">
    <!-- <ThiessenPolygon /> -->
    <!-- <Projection /> -->
     <!-- <SectorPolygon /> -->
     <!-- <SecotPolygon2 /> -->
     <!-- <SectorPolygon3857 /> -->
    <!-- <SectorPolygon4326 /> -->
    <!-- <SecotorPolygonProj /> -->
     <!-- <SectorPolygonProj2 /> -->
    <!-- <SectorPolygon3 />     -->
    <!-- <GreatCircle> </GreatCircle> -->
    <!-- <DrawPolygon /> -->
    <!-- <HeatMap /> -->
    <IcomMap />
</div>
</template>

<script>
import ThiessenPolygon from './components/polygon/thiessenpolygon/thiessenpolygon.vue';
import Projection from './components/projection/Projection.vue';
import SectorPolygon from './components/polygon/sectorpolygon/SectorPolygon.vue';
import SectorPolygon3857 from './components/polygon/sectorpolygon/SectorPolygon3857.vue';
import SectorPolygon4326 from './components/polygon/sectorpolygon/SectorPolygon4326.vue';
import SecotPolygon2 from './components/polygon/sectorpolygon/SecotPolygon2.vue';
import SecotorPolygonProj from './components/polygon/sectorpolygon/qianwen/SecotorPolygonProj.vue';
import SectorPolygonProj2 from './components/polygon/sectorpolygon/qianwen/SectorPolygonProj2.vue';
import SectorPolygon3 from './components/polygon/sectorpolygon/gpt/SectorPolygon3.vue';
import GreatCircle from './components/line/GreatCircle.vue';
import DrawPolygon from './components/polygon/sectorpolygon/drawPolygon/DrawPolygon.vue';
import HeatMap from './components/heatmap/HeatMap.vue';
import IcomMap from './components/polygon/IcomMap.vue';

export default {
  name: 'App',
  components: {
    ThiessenPolygon,
    Projection,
    SectorPolygon,
    SectorPolygon3857,
    SectorPolygon4326,
    SecotPolygon2,
    SecotorPolygonProj,
    SectorPolygonProj2,
    SectorPolygon3,
    GreatCircle,
    DrawPolygon,
    HeatMap,
    IcomMap,
  },
};
</script>

<style>
/* 可以在这里添加全局样式 */
</style>