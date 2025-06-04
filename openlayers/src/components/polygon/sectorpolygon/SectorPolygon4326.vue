<template>
    <div style="display: flex; height: 100vh;">
      <div style="width: 300px; padding: 10px; background: #f7f7f7; border-right: 1px solid #ccc;">
        <h3>扇形参数</h3>
        <label>经度: <input v-model.number="center[0]" type="number" step="0.0001" /></label><br />
        <label>纬度: <input v-model.number="center[1]" type="number" step="0.0001" /></label><br />
        <label>半径 (米): <input v-model.number="radius" type="number" /></label><br />
        <label>起始角度 (°): <input v-model.number="startAngle" type="number" /></label><br />
        <label>扇形角度 (°): <input v-model.number="sweepAngle" type="number" /></label><br />
        <button @click="updateSector">更新扇形</button>
      </div>
      <div id="map" style="flex: 1;"></div>
    </div>
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
  
  export default {
    data() {
      return {
        center: [116.397128, 39.916527],
        radius: 3000000,
        startAngle: -45,
        sweepAngle: 90,
        map: null,
        vectorSource: null,
        sectorFeature: null,
        centerFeature: null,
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      getDestinationPoint(center, distanceMeters, bearingDegrees) {
        const R = 6371008.8;
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
  
      generateSphereSectorPolygon(center, radius, startAngleDeg, sweepAngleDeg, segments = 100) {
        const points = [];
        const angleStep = sweepAngleDeg / segments;
        for (let i = 0; i <= segments; i++) {
          const angle = startAngleDeg + i * angleStep;
          const pt = this.getDestinationPoint(center, radius, angle);
          points.push(pt);
        }
        points.push(center);
        return new Polygon([points]);
      },
  
      initMap() {
        const polygon = this.generateSphereSectorPolygon(
          this.center,
          this.radius,
          this.startAngle,
          this.sweepAngle,
          100
        );
  
        this.sectorFeature = new Feature({ geometry: polygon });
        this.sectorFeature.setStyle(
          new Style({
            fill: new Fill({ color: 'rgba(255, 100, 50, 0.4)' }),
            stroke: new Stroke({ color: 'red', width: 2 }),
          })
        );
  
        this.centerFeature = new Feature({
          geometry: new Point(this.center),
        });
        this.centerFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: 'blue' }),
              stroke: new Stroke({ color: 'white', width: 2 }),
            }),
          })
        );
  
        this.vectorSource = new VectorSource({
          features: [this.sectorFeature, this.centerFeature],
        });
  
        const vectorLayer = new VectorLayer({ source: this.vectorSource });
  
        const baseLayer = new TileLayer({
          source: new XYZ({
            url:
              'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/osm@EPSG:4326@png/{z}/{x}/{-y}.png',
            projection: 'EPSG:4326',
          }),
        });
  
        this.map = new Map({
          target: 'map',
          layers: [baseLayer, vectorLayer],
          view: new View({
            projection: 'EPSG:4326',
            center: this.center,
            zoom: 3,
          }),
        });
      },
  
      updateSector() {
        const polygon = this.generateSphereSectorPolygon(
          this.center,
          this.radius,
          this.startAngle,
          this.sweepAngle,
          100
        );
        this.sectorFeature.setGeometry(polygon);
        this.centerFeature.setGeometry(new Point(this.center));
        this.map.getView().setCenter(this.center);
      },
    },
  };
  </script>
  