<template>
  <div>
    <div ref="mapContainer" style="width: 100%; height: 500px;"></div>
    
    <div style="margin-top:10px; max-width:600px;">
      <label>半径 (km): {{ radiusKm }}</label>
      <input type="range" min="500" max="5000" step="100" v-model.number="radiusKm" @input="updateSector" />

      <label>起始角度 (°): {{ startAngle }}</label>
      <input type="range" min="-180" max="180" step="1" v-model.number="startAngle" @input="updateSector" />

      <label>扫过角度 (°): {{ sweepAngle }}</label>
      <input type="range" min="0" max="360" step="1" v-model.number="sweepAngle" @input="updateSector" />
    </div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Polygon, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import * as turf from '@turf/turf';

export default {
  name: 'SphericalSectorDemo',
  data() {
    return {
      map: null,
      vectorLayer: null,
      center: [135, 75], // 固定中心点（经度,纬度）
      radiusKm: 1000,    // 半径，单位千米
      startAngle: -45,   // 起始角度，度数
      sweepAngle: 90     // 扫过角度，度数
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const rasterLayer = new TileLayer({
        source: new OSM()
      });

      this.vectorLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          stroke: new Stroke({
            color: '#ff0000',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.3)'
          })
        })
      });

      this.map = new Map({
        target: this.$refs.mapContainer,
        layers: [rasterLayer, this.vectorLayer],
        view: new View({
          center: fromLonLat(this.center),
          zoom: 4
        })
      });

      this.drawSector(this.center, this.radiusKm, this.startAngle, this.sweepAngle);
      this.addCenterPoint(this.center);
    },

    drawSector(centerLonLat, radiusKm, startAngle, sweepAngle) {
      // 清空之前的要素
      this.vectorLayer.getSource().clear();

      // 扇形边缘
      const arc = turf.lineArc(centerLonLat, radiusKm, startAngle, startAngle + sweepAngle, {
        steps: 128,
        units: 'kilometers'
      });

      const coords = arc.geometry.coordinates;
      coords.push(centerLonLat); // 加入中心点闭合成多边形
      coords.push(coords[0]);    // 闭合路径

      const polygon = turf.polygon([coords]);
      const transformedCoords = polygon.geometry.coordinates[0].map(c => fromLonLat(c));

      const feature = new Feature({
        geometry: new Polygon([transformedCoords])
      });

      this.vectorLayer.getSource().addFeature(feature);

      // 重新添加中心点
      this.addCenterPoint(centerLonLat);
    },

    addCenterPoint(lonLat) {
      const pointFeature = new Feature({
        geometry: new Point(fromLonLat(lonLat))
      });

      pointFeature.setStyle(new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({ color: 'blue' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        })
      }));

      this.vectorLayer.getSource().addFeature(pointFeature);
    },

    updateSector() {
      this.drawSector(this.center, this.radiusKm, this.startAngle, this.sweepAngle);
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

input[type="range"] {
  width: 100%;
  margin-top: 5px;
}
</style>
