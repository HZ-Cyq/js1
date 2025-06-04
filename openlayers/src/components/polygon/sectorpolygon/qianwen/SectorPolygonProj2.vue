<template>
    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>
  </template>
  
  <script>
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import Feature from 'ol/Feature';
  import Polygon from 'ol/geom/Polygon';
  import VectorSource from 'ol/source/Vector';
  import VectorLayer from 'ol/layer/Vector';
  import { Style, Fill, Stroke } from 'ol/style';
  
  export default {
    name: 'MapComponent',
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        // 创建地图实例
        const map = new Map({
          target: this.$refs.mapContainer,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            projection: 'EPSG:4326', // 使用 WGS84 投影（经纬度）
            center: [0, 90],         // 初始中心设为北极点
            zoom: 2,
          }),
        });
  
        // 添加扇形
        this.addSector(map, [-171.69, 60.75], 1000000, 0, 90); // 中心点接近北极，半径1000km，角度范围30~120度
      },
  
      /**
       * 球面大圆公式：已知起点(lat, lon)，方向 bearing (度)，距离 distance (米)
       * 返回终点经纬度 [lon, lat]
       */
      computeDestinationPoint(lon, lat, bearing, distance) {
        const R = 6371000; // 地球半径，单位：米
        const φ1 = (lat * Math.PI) / 180;
        const λ1 = (lon * Math.PI) / 180;
        const θ = (bearing * Math.PI) / 180;
  
        const δ = distance / R; // angular distance in radians
  
        const sinφ1 = Math.sin(φ1);
        const cosφ1 = Math.cos(φ1);
        const sindδ = Math.sin(δ);
        const cosdδ = Math.cos(δ);
        const sinθ = Math.sin(θ);
        const costh = Math.cos(θ);
  
        const sinφ2 = sinφ1 * cosdδ + cosφ1 * sindδ * costh;
        const φ2 = Math.asin(sinφ2);
  
        const y = sinθ * sindδ * cosφ1;
        const x = cosdδ - sinφ1 * sinφ2;
        const λ2 = λ1 + Math.atan2(y, x);
  
        const lat2 = φ2 * (180 / Math.PI);
        const lon2 = λ2 * (180 / Math.PI);
  
        return [lon2, lat2];
      },
  
      /**
       * 绘制扇形（基于球面大圆路径）
       */
      addSector(map, centerLonLat, radiusInMeters, startAngle, endAngle) {
        const steps = 64; // 扇形边界的点数
        const coordinates = [];
  
        for (let i = 0; i <= steps; i++) {
          const angle = startAngle + ((endAngle - startAngle) / steps) * i;
          const point = this.computeDestinationPoint(
            centerLonLat[0],
            centerLonLat[1],
            angle,
            radiusInMeters
          );
          coordinates.push(point); // 推入外圈点
        }
  
        // 添加中心点闭合图形
        coordinates.push(centerLonLat);
  
        // 创建多边形几何体
        const sectorGeometry = new Polygon([coordinates]);
  
        // 创建要素
        const sectorFeature = new Feature(sectorGeometry);
        sectorFeature.set('name', 'Sector');
  
        // 创建矢量源和图层
        const vectorSource = new VectorSource({
          features: [sectorFeature],
        });
  
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)',
            }),
          }),
        });
  
        // 添加到地图
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