<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script>
  // 导入必要的 OpenLayers 类
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  
  export default {
    name: 'MapComponent',
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        new Map({
          target: this.$refs.mapContainer,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 100vh;
  }
  </style>