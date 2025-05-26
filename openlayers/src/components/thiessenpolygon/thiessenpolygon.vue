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
  name: 'Thiessenpolygon',
  mounted() {
    this.initMap() // 在组件挂载时初始化地图
  },
  methods: {
    initMap() {
        const coords = [
        [120.15, 30.28], // 杭州
        [121.47, 31.23], // 上海
        [118.78, 32.04], // 南京
        [114.30, 30.59], // 武汉
        [113.26, 23.13]  // 广州
      ]

      // Turf 点集合（不用变）
      const turfPoints = turf.featureCollection(
        coords.map(coord => turf.point(coord))
      )

      // 计算边界框并生成泰森多边形
      const bbox = turf.bbox(turfPoints)
      const voronoi = turf.voronoi(turfPoints, { bbox })

      // GeoJSON 格式读取，dataProjection 和 featureProjection 都是 EPSG:4326
      const format = new GeoJSON()
      const voronoiFeatures = format.readFeatures(voronoi, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      })

      // 创建泰森多边形图层
      const voronoiLayer = new VectorLayer({
        source: new VectorSource({
          features: voronoiFeatures
        }),
        style: new Style({
          stroke: new Stroke({
            color: '#333',
            width: 2
          }),
          fill: new Fill({
            color: 'rgba(0, 150, 255, 0.3)'
          })
        })
      })

      // 点 Feature，直接用经纬度坐标，不用 fromLonLat 转换了
      const pointFeatures = coords.map(coord => {
        const feature = new Feature({
          geometry: new Point(coord) // 直接用经纬度
        })
        feature.setStyle(new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: 'red' }),
            stroke: new Stroke({ color: 'white', width: 2 })
          })
        }))
        return feature
      })

      const pointLayer = new VectorLayer({
        source: new VectorSource({
          features: pointFeatures
        })
      })

      // 创建地图，View 指定 EPSG:4326
      new Map({
        target: this.$refs.mapContainer,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          voronoiLayer,
          pointLayer
        ],
        view: new View({
          projection: 'EPSG:4326',
          center: [115, 30], // 直接用经纬度坐标
          zoom: 5
        })
      })
    }
  },
}
</script>

<style scoped>
/* 设置地图容器大小 */
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
