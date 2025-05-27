<template>
    <div id="my-map"></div>
</template>
  
  <script>
  
  
  export default {
    name: "HomeView",
    mounted() {
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZWZjOWNmNC01MzAyLTQxNWYtYWRmMC0xNmRiNDU3MGE1ZGIiLCJpZCI6MjY1NjY5LCJpYXQiOjE3NDgzMDcyNDZ9.kJqw38UmmZaJIdTeT_zDaXL3KtfJ-m83qxIN0k0chzo";
      this.viewer = new Cesium.Viewer('my-map', {
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false, // 影像切换
        animation: true, // 是否显示动画控件
        infoBox: false, // 是否显示点击要素之后显示的信息
        selectionIndicator: false, // 要素选中框
        geocoder: false, // 是否显示地名查找控件
        timeline: true, // 是否显示时间线控件
        fullscreenButton: false,
        shouldAnimate: false,
        navigationHelpButton: false, // 是否显示帮助信息控件
      });
      console.log("HomeView mounted");
    },
  };
  </script>
  
  <style scoped>
  #my-map {
    width: 100%;
    height: 100%;
    background-color: black;
  }
  </style>
  
  