<template>
  <div ref="mapContainer" style="width: 100%; height: 500px;"></div>
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
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // 初始化底图和视图
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
          center: fromLonLat([116.397128, 45]), // 更合适的纬度
          zoom: 4
        })
      });

      // 添加扇形和中心点
      const center = [135, 75]; // 北京经度，纬度 45
      this.drawSector(center, 5000000, -45, 90); // 半径 1000km，角度范围 90°
      this.addCenterPoint(center);
    },

    drawSector(centerLonLat, radiusMeters, startAngle, sweepAngle) {
      // 用 turf 构建一个球面扇形边缘
      const arc = turf.lineArc(centerLonLat, radiusMeters / 1000, startAngle, startAngle + sweepAngle, {
        steps: 128,
        units: 'kilometers'
      });

      const coords = arc.geometry.coordinates;
      coords.push(centerLonLat); // 添加中心点形成多边形
      coords.push(coords[0]);    // 闭合多边形

      const polygon = turf.polygon([coords]);
      const transformedCoords = polygon.geometry.coordinates[0].map(c => fromLonLat(c));

      const feature = new Feature({
        geometry: new Polygon([transformedCoords])
      });

      this.vectorLayer.getSource().addFeature(feature);
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
    }
  }
};
</script>

<style scoped>
/* 地图容器已在模板内设置 */
</style>
