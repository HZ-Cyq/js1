<template>
  <!-- 地图容器，OpenLayers 会挂载到这里 -->
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import 'ol/ol.css'

// OpenLayers 地图核心组件
import Map from 'ol/Map'
import View from 'ol/View'

// 图层相关
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'

// 数据源
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

// 样式
import { Fill, Stroke, Style, Circle as CircleStyle } from 'ol/style'

// 地理坐标转换
import { fromLonLat } from 'ol/proj'

// 几何对象和要素
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

// Turf.js 用于生成泰森多边形
import * as turf from '@turf/turf'

export default {
  name: 'MapComponent',
  mounted() {
    this.initMap() // 在组件挂载时初始化地图
  },
  methods: {
    initMap() {
      // 原始经纬度坐标点（五个城市）
      const coords = [
        [120.15, 30.28], // 杭州
        [121.47, 31.23], // 上海
        [118.78, 32.04], // 南京
        [114.30, 30.59], // 武汉
        [113.26, 23.13]  // 广州
      ]

      // === 1. 创建 Turf 点集合 ===
      const turfPoints = turf.featureCollection(
        coords.map(coord => turf.point(coord))
      )

      // === 2. 计算外接边界框并生成泰森多边形 ===
      const bbox = turf.bbox(turfPoints) // [minX, minY, maxX, maxY]
      const voronoi = turf.voronoi(turfPoints, { bbox })

      // === 3. 将泰森结果转换为 OpenLayers 的 Feature ===
      const format = new GeoJSON()
      const voronoiFeatures = format.readFeatures(voronoi, {
        featureProjection: 'EPSG:3857' // 将经纬度投影为 Web 墨卡托坐标系
      })

      // === 4. 创建泰森多边形图层 ===
      const voronoiLayer = new VectorLayer({
        source: new VectorSource({ features: voronoiFeatures }),
        style: new Style({
          stroke: new Stroke({ color: '#333', width: 2 }), // 边框样式
          fill: new Fill({ color: 'rgba(0, 150, 255, 0.3)' }) // 填充样式
        })
      })

      // === 5. 创建点 Feature 数组 ===
      const pointFeatures = coords.map(coord => {
        const feature = new Feature({
          geometry: new Point(fromLonLat(coord)) // 将经纬度转换为地图投影坐标
        })

        // 设置点样式（红色圆点 + 白边）
        feature.setStyle(new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({ color: 'white', width: 2 })
          })
        }))

        return feature
      })

      // === 6. 创建点图层 ===
      const pointLayer = new VectorLayer({
        source: new VectorSource({ features: pointFeatures })
      })

      // === 7. 创建地图对象 ===
      new Map({
        target: this.$refs.mapContainer, // 挂载到 DOM
        layers: [
          new TileLayer({ source: new OSM() }), // 底图图层
          voronoiLayer, // 泰森多边形图层
          pointLayer     // 城市点图层
        ],
        view: new View({
          center: fromLonLat([115, 30]), // 地图初始中心点
          zoom: 5 // 缩放级别
        })
      })
    }
  }
}
</script>

<style scoped>
/* 设置地图容器大小 */
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
