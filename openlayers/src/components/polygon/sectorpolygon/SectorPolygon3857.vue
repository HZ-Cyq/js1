<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Polygon, Point } from 'ol/geom';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import { fromLonLat } from 'ol/proj';

export default {
  name: 'LargeScaleSector',
  mounted() {
    this.initMap();
  },
  methods: {
    /**
     * 球面距离和方位角计算：
     * 计算给定中心点 (lon, lat)，距离 radius（单位米），方向 bearing (度) 的目标点经纬度
     * 基于球面大圆公式
     */
    getDestinationPoint(center, distanceMeters, bearingDegrees) {
      const R = 6371008.8; // 地球半径，单位：米
      const rad = Math.PI / 180;

      const lat1 = center[1] * rad;
      const lon1 = center[0] * rad;
      const bearing = bearingDegrees * rad;

      const angularDistance = distanceMeters / R;

      const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(angularDistance) +
          Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
      );

      const lon2 =
        lon1 +
        Math.atan2(
          Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
          Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
        );

      return [lon2 / rad, lat2 / rad];
    },

    /**
     * 生成球面扇形 Polygon
     * @param {Array} center [lon, lat]
     * @param {Number} radius 单位米
     * @param {Number} startAngleDeg 起始角度，0为正北，顺时针方向
     * @param {Number} sweepAngleDeg 扇形角度
     * @param {Number} segments 扇形边缘分段数，默认100
     */
    generateSphereSectorPolygon(center, radius, startAngleDeg, sweepAngleDeg, segments = 100) {
      const points = [];

      const angleStep = sweepAngleDeg / segments;

      for (let i = 0; i <= segments; i++) {
        const angle = startAngleDeg + i * angleStep;
        const pt = this.getDestinationPoint(center, radius, angle);
        points.push(fromLonLat(pt));
      }
      // 回到圆心（转投影）
      points.push(fromLonLat(center));

      return new Polygon([points]);
    },

    initMap() {
      const centerLonLat = [116.397128, 60.916527]; // 北京经纬度
      const radiusMeters = 3000000; // 3000公里
      const startAngle = -45; // -45度起始角
      const sweepAngle = 90; // 90度扇形角度

      const sectorPolygon = this.generateSphereSectorPolygon(
        centerLonLat,
        radiusMeters,
        startAngle,
        sweepAngle,
        120
      );

      const sectorFeature = new Feature({ geometry: sectorPolygon });
      sectorFeature.setStyle(
        new Style({
          fill: new Fill({ color: 'rgba(255, 100, 50, 0.4)' }),
          stroke: new Stroke({ color: 'red', width: 2 }),
        })
      );

      const centerFeature = new Feature({
        geometry: new Point(fromLonLat(centerLonLat)),
      });
      centerFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: 'blue' }),
            stroke: new Stroke({ color: 'white', width: 2 }),
          }),
        })
      );

      const vectorSource = new VectorSource({
        features: [sectorFeature, centerFeature],
      });

      const vectorLayer = new VectorLayer({ source: vectorSource });

      const osmLayer = new TileLayer({
        source: new XYZ({
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
      });

      const map = new Map({
        target: 'map',
        layers: [osmLayer, vectorLayer],
        view: new View({
          projection: 'EPSG:3857',
          center: fromLonLat(centerLonLat),
          zoom: 3, // 大范围显示建议缩小缩放级别
        }),
      });
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}
</style>
