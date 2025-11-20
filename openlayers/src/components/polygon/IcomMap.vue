<template>
    <div class="map-container-wrapper">
      <!-- 地图容器 -->
      <div ref="mapContainer" class="map-container"></div>
  
      <!-- 添加按钮 -->
      <button class="add-button" @click="showDialog = true">添加图片</button>
  
      <!-- 弹窗表单 -->
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog">
          <h3>添加图片图标</h3>
  
          <label>
            经度：
            <input v-model="form.lon" type="number" step="0.0001" />
          </label>
  
          <label>
            纬度：
            <input v-model="form.lat" type="number" step="0.0001" />
          </label>
  
          <label>
            上传图片：
            <input type="file" @change="onFileChange" accept="image/*" />
          </label>
  
          <div class="dialog-buttons">
            <button @click="confirmAdd">确认</button>
            <button @click="cancelAdd">取消</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import 'ol/ol.css'
  import Map from 'ol/Map'
  import View from 'ol/View'
  import TileLayer from 'ol/layer/Tile'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import OSM from 'ol/source/OSM'
  import Feature from 'ol/Feature'
  import Point from 'ol/geom/Point'
  import { Style, Icon } from 'ol/style'
  
  export default {
    name: 'IconMap',
    data() {
      return {
        map: null,
        iconLayer: null,
        showDialog: false,
        form: {
          lat: '',
          lon: '',
          fileUrl: null
        }
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        // 图标图层
        this.iconLayer = new VectorLayer({
          source: new VectorSource()
        })
  
        // 初始化地图
        this.map = new Map({
          target: this.$refs.mapContainer,
          layers: [
            new TileLayer({ source: new OSM() }),
            this.iconLayer
          ],
          view: new View({
            projection: 'EPSG:4326',
            center: [0, 0],
            zoom: 2
          })
        })
      },
      onFileChange(event) {
        const file = event.target.files[0]
        if (file) {
          this.form.fileUrl = URL.createObjectURL(file)
        }
      },
      confirmAdd() {
        const lon = parseFloat(this.form.lon)
        const lat = parseFloat(this.form.lat)
        const src = this.form.fileUrl
  
        if (isNaN(lon) || isNaN(lat) || !src) {
          alert('请正确输入经纬度并选择图片')
          return
        }
  
        // 创建 Feature
        const feature = new Feature({
          geometry: new Point([lon, lat])
        })
  
        feature.setStyle(new Style({
          image: new Icon({
            src,
            scale: 0.5,
            anchor: [0.5, 1]
          })
        }))
  
        // 添加到图层中
        this.iconLayer.getSource().addFeature(feature)
  
        // 清空表单并关闭弹窗
        this.cancelAdd()
      },
      cancelAdd() {
        this.form = { lat: '', lon: '', fileUrl: null }
        this.showDialog = false
      }
    }
  }
  </script>
  
  <style scoped>
  .map-container-wrapper {
    position: relative;
  }
  .map-container {
    width: 100%;
    height: 100vh;
  }
  .add-button {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  .dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(2px);
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
  }
  .dialog {
    background: white;
    padding: 20px;
    border-radius: 10px;
    min-width: 300px;
  }
  .dialog h3 {
    margin-top: 0;
  }
  .dialog label {
    display: block;
    margin: 10px 0;
  }
  .dialog-buttons {
    margin-top: 15px;
    text-align: right;
  }
  .dialog-buttons button {
    margin-left: 10px;
  }
  </style>
  