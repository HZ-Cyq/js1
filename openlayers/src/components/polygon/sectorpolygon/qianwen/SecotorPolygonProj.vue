<template>
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script>
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import Polygon from 'ol/geom/Polygon';
  import VectorSource from 'ol/source/Vector';
  import VectorLayer from 'ol/layer/Vector';
  import { Style, Fill, Stroke } from 'ol/style';
  import proj4 from 'proj4';
  import { register } from 'ol/proj/proj4';
  import { get as getProjection } from 'ol/proj';
  
  // 注册EPSG:3995北极立体投影
  proj4.defs('EPSG:3995', '+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
  register(proj4);
  
  export default {
    name: 'MapComponent',
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        const map = new Map({
          target: this.$refs.mapContainer,
          layers: [
            new TileLayer({
              source: new OSM(),
              // 设置底图的投影为EPSG:3995
              source: new OSM({
                projection: getProjection('EPSG:3995'),
              }),
            }),
          ],
          view: new View({
            projection: 'EPSG:3995',
            center: [165, 68],
            zoom: 2,
          }),
        });
  
        // 添加扇形
        this.addSector(map, [171.662763, 63.769342], 5000000, 0, 60);
      },
      addSector(map, centerLonLat, radius, startAngle, endAngle) {
        const center = proj4('EPSG:4326', 'EPSG:3995', centerLonLat); // 坐标转换
  
        const radPerDeg = Math.PI / 180;
        const startRad = startAngle * radPerDeg;
        const endRad = endAngle * radPerDeg;
  
        const coordinates = [];
        const steps = 64; // 定义细分步数以平滑圆弧
        for (let i = 0; i <= steps; i++) {
          const angle = startRad + (i / steps) * (endRad - startRad);
          const x = center[0] + radius * Math.cos(angle);
          const y = center[1] + radius * Math.sin(angle);
          coordinates.push([x, y]);
        }
        // 添加中心点到多边形坐标数组，形成闭合区域
        coordinates.push(center);
  
        const sectorGeometry = new Polygon([coordinates]);
  
        const sectorFeature = new Feature(sectorGeometry);
        sectorFeature.set('name', 'Sector');
  
        const vectorSource = new VectorSource({
          features: [sectorFeature],
        });
  
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3,
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)',
            }),
          }),
        });
  
        map.addLayer(vectorLayer);
      },
    },
  };
  </script>
  
  <style scoped>
  .map-container {
    width: 100%;
    height: 500px;
  }
  </style>