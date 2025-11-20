<template>
    <div id="cesiumContainer" ref="container" style="width: 100vw; height: 100vh" />
  </template>
  
  <script>
  export default {
    data() {
      return {
        viewer: null,
      }
    },
    mounted() {
      this.viewer = new Cesium.Viewer("cesiumContainer", {
        imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }),
      });
    },
  }
  </script>
  