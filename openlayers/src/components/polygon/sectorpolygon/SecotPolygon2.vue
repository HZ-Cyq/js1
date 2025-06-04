<template>
    <div id="map" style="width: 100%; height: 100vh;"></div>
  </template>
  
  <script>
  import Map from 'ol/Map';
  import View from 'ol/View';
  import TileLayer from 'ol/layer/Tile';
  import OSM from 'ol/source/OSM';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import Feature from 'ol/Feature';
  import { Polygon, Point } from 'ol/geom';
  import { transform } from 'ol/proj';
  import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
  import * as turf from '@turf/turf';
  
  export default {
    data() {
      return {
        map: null,
        vectorSource: null,
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        this.vectorSource = new VectorSource();
  
        this.map = new Map({
          target: 'map',
          layers: [
            new TileLayer({ source: new OSM() }),
            new VectorLayer({ source: this.vectorSource }),
          ],
          view: new View({
            center: transform([135, 75], 'EPSG:4326', 'EPSG:3857'),
            zoom: 3,
          }),
        });
  
        // 添加中心点
        const center = [135, 70];
        const centerFeature = new Feature({
          geometry: new Point(transform(center, 'EPSG:4326', 'EPSG:3857')),
        });
        centerFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: 'red' }),
              stroke: new Stroke({ color: 'white', width: 2 }),
            }),
          }),
        );
        this.vectorSource.addFeature(centerFeature);
  
        // 画扇形
        this.drawSector(center, 5000, 0, 360);
      },
  
      normalizeCoordsTo360(coords) {
        return coords.map(([lon, lat]) => {
          let newLon = lon;
          if (newLon < 0) newLon += 360;
          return [newLon, lat];
        });
      },
  
      denormalizeCoords(coords) {
        return coords.map(([lon, lat]) => {
          let newLon = lon;
          if (newLon > 180) newLon -= 360;
          return [newLon, lat];
        });
      },
  
      drawSector(center, radiusKm, startAngle, sweepAngle) {
        // turf lineArc 生成扇形弧线（经纬度）
        let arc = turf.lineArc(center, radiusKm, startAngle, startAngle + sweepAngle, {
          steps: 128,
          units: 'kilometers',
        });
  
        let coords = arc.geometry.coordinates;
  
        // 加入圆心闭合多边形
        coords.push(center);
        coords.push(coords[0]);
  
        // 判断跨线
        const lons = coords.map((c) => c[0]);
        const maxLon = Math.max(...lons);
        const minLon = Math.min(...lons);
        if (maxLon - minLon > 180) {
          // 跨线，所有小于0的经度加360，使坐标连续
          coords = this.normalizeCoordsTo360(coords);
        }
  
        // 投影坐标
        const polygonCoords = coords.map((c) => transform(c, 'EPSG:4326', 'EPSG:3857'));
  
        const polygon = new Polygon([polygonCoords]);
        const feature = new Feature({ geometry: polygon });
        feature.setStyle(
          new Style({
            fill: new Fill({ color: 'rgba(0, 0, 255, 0.3)' }),
            stroke: new Stroke({ color: 'blue', width: 2 }),
          }),
        );
        this.vectorSource.addFeature(feature);
      },
    },
  };
  </script>
  