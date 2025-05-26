<template>
    <div ref="mapContainer" class="map" style="width: 100%; height: 100vh;"></div>
  </template>
  
  <script>
  import { Map, View } from 'ol'
  import TileLayer from 'ol/layer/Tile'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import OSM from 'ol/source/OSM'
  import Feature from 'ol/Feature'
  import Point from 'ol/geom/Point'
  import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
  import { fromLonLat } from 'ol/proj'
  
  export default {
    name: 'Projection',
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        // 地图容器
        const container = this.$refs.mapContainer
  
        // 杭州经纬度坐标
        const lonLat = [120.15, 30.28]
  
        // 转换为 EPSG:3857（Web 墨卡托）坐标
        const projected = fromLonLat(lonLat)
  
        // 红点：原始 EPSG:4326 坐标
        const point4326 = new Feature({
          geometry: new Point(lonLat)
        })
        point4326.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: 'red' }),
              stroke: new Stroke({ color: 'white', width: 2 })
            })
          })
        )
  
        // 蓝点：EPSG:3857 坐标
        const point3857 = new Feature({
          geometry: new Point(projected)
        })
        point3857.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: 'blue' }),
              stroke: new Stroke({ color: 'white', width: 2 })
            })
          })
        )
  
        // 地图初始化
        let map = new Map({
          target: container,
          layers: [
            new TileLayer({
              source: new OSM()
            }),
            new VectorLayer({
              source: new VectorSource({
                features: [point4326, point3857]
              })
            })
          ],
          view: new View({
            zoom: 10,
            center: projected,
            // 如果是4326坐标系，则红点的位置是对的。(下面两行注释打开)
            // projection: 'EPSG:4326',
            // center: lonLat,
          })
        });
        console.log(map.getView().getProjection());
      }
    }
  }
  </script>
  
  <style scoped>
  .map {
    width: 100%;
    height: 100%;
  }
  </style>
  