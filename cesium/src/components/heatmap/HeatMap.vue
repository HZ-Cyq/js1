<template>
  <div id="app">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>

export default {
  name: "CesiumWeightedHeatmap",
  data() {
    return {
      viewer: null,
      points: [], // 下面mounted生成
    };
  },
  mounted() {
    this.generatePoints(200);
    this.initCesium();
  },
  methods: {
    generatePoints(num) {
      this.points = [];
      const gridSize = Math.ceil(Math.sqrt(num)); // 方格行列数
      const step = 2 / (gridSize - 1); // -1到1区间步长
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const lon = -1 + step * i;
          const lat = -1 + step * j;
          let weight = Math.random(); // 0~1随机权重，或者这里可以自定义
          if(weight > 0.5) {
            weight = 0.99;
          } else {
            weight = 0.01;
          }
          this.points.push([lon, lat, weight]);
          if (this.points.length >= num) break;
        }
        if (this.points.length >= num) break;
      }
    },
    initCesium() {

      this.viewer = new Cesium.Viewer("cesiumContainer", {
        imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }),
      });

      const canvasSize = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");

      const lonRange = [-1.2, 1.2]; // 边界稍微留点余量
      const latRange = [-1.2, 1.2];

      const getWeight = (lon, lat) => {
        let numerator = 0;
        let denominator = 0;
        this.points.forEach(([px, py, w]) => {
          const dist = Math.sqrt((px - lon) ** 2 + (py - lat) ** 2);
          const safeDist = dist + 0.0001;
          const weight = 1 / safeDist;
          numerator += w * weight;
          denominator += weight;
        });
        return denominator === 0 ? 0 : numerator / denominator;
      };

      const imageData = ctx.createImageData(canvasSize, canvasSize);
      for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
          const lon = lonRange[0] + ((x + 0.5) / canvasSize) * (lonRange[1] - lonRange[0]);
          const lat = latRange[1] - ((y + 0.5) / canvasSize) * (latRange[1] - latRange[0]);
          const w = getWeight(lon, lat);
          const r = Math.round(255 * w);
          const g = Math.round(255 * (1 - w));
          const b = 0;
          const idx = (y * canvasSize + x) * 4;
          imageData.data[idx] = r;
          imageData.data[idx + 1] = g;
          imageData.data[idx + 2] = b;
          imageData.data[idx + 3] = 180;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      const rectangle = Cesium.Rectangle.fromDegrees(
        lonRange[0],
        latRange[0],
        lonRange[1],
        latRange[1]
      );

      this.viewer.entities.add({
        rectangle: {
          coordinates: rectangle,
          material: new Cesium.ImageMaterialProperty({
            image: canvas,
            transparent: true,
          }),
        },
      });

      const boundingSphere = Cesium.BoundingSphere.fromRectangle3D(rectangle);
      this.viewer.camera.flyToBoundingSphere(boundingSphere, {
        duration: 2,
        offset: new Cesium.HeadingPitchRange(0, -1.5, boundingSphere.radius * 1.5),
      });
    },
  },
};
</script>

<style>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body,
html,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
