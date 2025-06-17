<template>
  <div id="app">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import { Delaunay } from "d3-delaunay";
import * as d3 from "d3";

export default {
  name: "CesiumVoronoiHeatmap",
  data() {
    return {
      viewer: null,
    };
  },
  mounted() {
    this.initCesium();
  },
  methods: {
    generateUniformPoints(lonRange, latRange, rows, cols) {
      const pts = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const lon = lonRange[0] + (i + 0.5) * (lonRange[1] - lonRange[0]) / cols;
          const lat = latRange[0] + (j + 0.5) * (latRange[1] - latRange[0]) / rows;
          // 这里给权重示例：左半区权重0，右半区权重1，方便观察渐变
          const midLon = (lonRange[0] + lonRange[1]) / 2;
          const weight = lon < midLon ? 0 : 1;
          pts.push({ lon, lat, weight });
        }
      }
      return pts;
    },

    clipPolygonToRect(polygon, rect) {
      // Sutherland–Hodgman clipping，和之前一样，裁剪多边形到范围rect = [minX, minY, maxX, maxY]
      const [minX, minY, maxX, maxY] = rect;

      function clipEdge(points, edge) {
        const clipped = [];
        for (let i = 0; i < points.length; i++) {
          const curr = points[i];
          const prev = points[(i - 1 + points.length) % points.length];

          let currInside, prevInside;
          switch (edge) {
            case "left":
              currInside = curr[0] >= minX;
              prevInside = prev[0] >= minX;
              break;
            case "right":
              currInside = curr[0] <= maxX;
              prevInside = prev[0] <= maxX;
              break;
            case "bottom":
              currInside = curr[1] >= minY;
              prevInside = prev[1] >= minY;
              break;
            case "top":
              currInside = curr[1] <= maxY;
              prevInside = prev[1] <= maxY;
              break;
          }

          function intersect(p1, p2, edge) {
            const x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
            if (edge === "left") {
              const x = minX;
              const y = y1 + (y2 - y1) * (minX - x1) / (x2 - x1);
              return [x, y];
            }
            if (edge === "right") {
              const x = maxX;
              const y = y1 + (y2 - y1) * (maxX - x1) / (x2 - x1);
              return [x, y];
            }
            if (edge === "bottom") {
              const y = minY;
              const x = x1 + (x2 - x1) * (minY - y1) / (y2 - y1);
              return [x, y];
            }
            if (edge === "top") {
              const y = maxY;
              const x = x1 + (x2 - x1) * (maxY - y1) / (y2 - y1);
              return [x, y];
            }
          }

          if (currInside) {
            if (!prevInside) clipped.push(intersect(prev, curr, edge));
            clipped.push(curr);
          } else if (prevInside) clipped.push(intersect(prev, curr, edge));
        }
        return clipped;
      }

      let output = polygon;
      ["left", "right", "bottom", "top"].forEach(edge => {
        output = clipEdge(output, edge);
        if (output.length === 0) return [];
      });
      return output;
    },

    // 计算点权重插值，做简单的IDW插值（Inverse Distance Weighting）
    getWeightAt(lon, lat, points) {
      let numerator = 0;
      let denominator = 0;
      const influenceRadius = 0.5; // 半径限制，超出权重为0
      for (const p of points) {
        const dist = Math.sqrt((p.lon - lon) ** 2 + (p.lat - lat) ** 2);
        if (dist > influenceRadius) continue;
        const w = 1 / (dist + 0.0001);
        numerator += p.weight * w;
        denominator += w;
      }
      if (denominator === 0) return 0;
      return numerator / denominator;
    },

    createHeatmapCanvas(lonRange, latRange, points) {
      const width = 512;
      const height = 512;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(width, height);

      const colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["green", "red"]);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // 经纬度对应像素
          const lon = lonRange[0] + (x / width) * (lonRange[1] - lonRange[0]);
          // y从上往下，纬度从大到小，所以下面要反过来
          const lat = latRange[1] - (y / height) * (latRange[1] - latRange[0]);
          const weight = this.getWeightAt(lon, lat, points);
          const c = d3.color(colorScale(weight));
          const idx = (y * width + x) * 4;
          imageData.data[idx] = c.r;
          imageData.data[idx + 1] = c.g;
          imageData.data[idx + 2] = c.b;
          imageData.data[idx + 3] = 180; // 半透明
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas;
    },

    initCesium() {
      this.viewer = new Cesium.Viewer("cesiumContainer", {
                imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }),
      });

      const lonRange = [121, 124];
      const latRange = [23, 25];
      const rows = 10;
      const cols = 15;

      const points = this.generateUniformPoints(lonRange, latRange, rows, cols);

      // 画热力图贴图
      const heatmapCanvas = this.createHeatmapCanvas(lonRange, latRange, points);
      const rectangle = Cesium.Rectangle.fromDegrees(lonRange[0], latRange[0], lonRange[1], latRange[1]);

      this.viewer.entities.add({
        rectangle: {
          coordinates: rectangle,
          material: new Cesium.ImageMaterialProperty({
            image: heatmapCanvas,
            transparent: true,
            color: new Cesium.Color(1, 1, 1, 0.6),
          }),
        },
      });

      // 计算泰森多边形
      const delaunay = Delaunay.from(points.map((p) => [p.lon, p.lat]));
      const voronoi = delaunay.voronoi([lonRange[0], latRange[0], lonRange[1], latRange[1]]);

      // 画泰森多边形边界线
      for (let i = 0; i < points.length; i++) {
        let cell = voronoi.cellPolygon(i);
        if (!cell) continue;
        cell = this.clipPolygonToRect(cell, [lonRange[0], latRange[0], lonRange[1], latRange[1]]);
        if (!cell || cell.length < 3) continue;

        const positions = cell.map(p => Cesium.Cartesian3.fromDegrees(p[0], p[1]));
        positions.push(positions[0]); // 闭合

        this.viewer.entities.add({
          polyline: {
            positions,
            width: 2,
            material: Cesium.Color.WHITE.withAlpha(0.1),
            clampToGround: false,
          },
        });
      }

      // 飞到视角
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
  margin: 0; padding: 0;
  overflow: hidden;
}
body, html, #app {
  margin: 0; padding: 0;
  width: 100%; height: 100%;
}
</style>
