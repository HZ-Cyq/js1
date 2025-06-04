<template>
  <div id="my-map"></div>
</template>

<script>

import { MdUtil } from "@/util/MdUtil";
import * as turf from "@turf/turf";
export default {
  name: "thiessenpolygon",
  mounted() {
    // MdUtil.aaa();
    MdUtil.bbb();
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
    this.drawVoronoi();
  },
  methods: {
    drawVoronoi() {
      // Step 1: 原始点集合（经纬度）
      const points = [
        [116.391, 39.907], // 北京
        [121.4737, 31.2304], // 上海
        [114.3055, 30.5928], // 武汉
        [113.2644, 23.1291], // 广州
        [104.0665, 30.5728], // 成都
      ];

      const features = points.map((pt) =>
        turf.point(pt)
      );

      const pointsFC = turf.featureCollection(features);

      // Step 2: 设置边界区域（防止 Voronoi 图无限延伸）
      const bbox = turf.bbox(pointsFC); // [minX, minY, maxX, maxY]

      // Step 3: 生成 Voronoi 图（泰森多边形）
      const voronoiFC = turf.voronoi(pointsFC, { bbox });

      // Step 4: 遍历每个多边形并绘制
      voronoiFC.features.forEach((feature) => {
        if (
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          const coords = feature.geometry.coordinates;
          const polygons = feature.geometry.type === "Polygon" ? [coords] : coords;

          polygons.forEach((polyCoords) => {
            // 取外圈坐标（忽略洞a）
            const exterior = polyCoords[0];

            this.viewer.entities.add({
              polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(
                  exterior.flat()
                ),
                material: Cesium.Color.fromRandom({ alpha: 0.4 }),
                outline: true,
                outlineColor: Cesium.Color.BLACK,
              },
            });
          });
        }
      });
      // Step 5: 在原始点位置画上点
      points.forEach((lonlat) => {
        this.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1]),
          point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: `${lonlat[0].toFixed(2)}, ${lonlat[1].toFixed(2)}`,
            font: '14px sans-serif',
            fillColor: Cesium.Color.WHITE,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -12),
          },
        });
      });

      const points2 = turf.featureCollection([
        turf.point([0, 0]),
        turf.point([1, 0]),
        turf.point([0, 1]),
        turf.point([1, 1]),
        turf.point([0.5, 0.5]), // 中间点造成复杂结构
      ]);

      const bbox2 = [-1, -1, 2, 2];
      const voronoi2 = turf.voronoi(points2, { bbox2 });

      voronoi2.features.forEach((f, i) => {
        console.log(`Feature ${i}:`, f.geometry.type);
      });
    },
  }
};
</script>

<style scoped>
#my-map {
  width: 100%;
  height: 100%;
  background-color: black;
}
</style>