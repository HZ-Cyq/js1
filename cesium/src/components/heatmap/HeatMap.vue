<template>
  <div id="app">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { voronoi } from "d3-voronoi";

export default {
  name: "CesiumIDWHeatmap",
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    this.initCesium();
  },
  methods: {
    initCesium() {
      this.viewer = new Cesium.Viewer("cesiumContainer", {
                imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }),
      });

      const gridSize = 40;
      const lonRange = [-1, 1];
      const latRange = [-1, 1];
      const centerLon = (lonRange[0] + lonRange[1]) / 2;
      const centerLat = (latRange[0] + latRange[1]) / 2;
      const radius = 0.5;

      const points = [];
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const lon = lonRange[0] + (i + 0.5) * (lonRange[1] - lonRange[0]) / gridSize;
          const lat = latRange[0] + (j + 0.5) * (latRange[1] - latRange[0]) / gridSize;
          const distance = Math.sqrt((lon - centerLon) ** 2 + (lat - centerLat) ** 2);
          const weight = distance < radius ? 0 : 1; // 中心为绿，外圈为红
          points.push({ lon, lat, weight });
        }
      }

      const canvasSize = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext("2d");

      const getWeight = (lon, lat) => {
        let num = 0;
        let den = 0;
        const influenceRadius = 0.3;

        points.forEach((p) => {
          const d = Math.sqrt((p.lon - lon) ** 2 + (p.lat - lat) ** 2);
          if (d > influenceRadius) return;
          const safeD = d + 0.001;
          num += p.weight / safeD;
          den += 1 / safeD;
        });

        if (den === 0) return 0;
        return num / den;
      };

      const colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["green", "red"]);

      const imageData = ctx.createImageData(canvasSize, canvasSize);
      for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
          const lon = lonRange[0] + (x / canvasSize) * (lonRange[1] - lonRange[0]);
          const lat = latRange[1] - (y / canvasSize) * (latRange[1] - latRange[0]);
          const value = getWeight(lon, lat);
          const color = d3.rgb(colorScale(Math.min(Math.max(value, 0), 1)));
          const index = (y * canvasSize + x) * 4;
          imageData.data[index] = color.r;
          imageData.data[index + 1] = color.g;
          imageData.data[index + 2] = color.b;
          imageData.data[index + 3] = 255;
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
            transparent: false,
          }),
        },
      });

      const voronoiGen = voronoi()
        .x((d) => d.lon)
        .y((d) => d.lat)
        .extent([lonRange, latRange]);
      const polygons = voronoiGen.polygons(points);

      polygons.forEach((poly) => {
        if (poly.length < 3) return;
        const positions = poly.map((p) => Cesium.Cartesian3.fromDegrees(p[0], p[1]));
        positions.push(positions[0]);

        this.viewer.entities.add({
          polyline: {
            positions: positions,
            width: 1.5,
            material: Cesium.Color.BLACK,
            clampToGround: true,
          },
        });
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
body, html, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>