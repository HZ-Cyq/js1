<template>
    <div id="map" style="width: 100%; height: 100vh;"></div>
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
  import Polygon from 'ol/geom/Polygon'
  import { Style, Stroke, Fill, Circle as CircleStyle, Text, Fill as FillStyle, Stroke as StrokeStyle } from 'ol/style'
  import { fromLonLat } from 'ol/proj'
  import * as turf from '@turf/turf'
  
  function insertPoleIfNeeded(coords) {
    const bbox = turf.bbox(turf.lineString(coords))
    const [, minLat, , maxLat] = bbox
  
    const closed = coords[0][0] === coords[coords.length - 1][0] &&
                   coords[0][1] === coords[coords.length - 1][1]
    if (!closed) coords.push(coords[0])
  
    const northPole = [0, 90]
    const southPole = [0, -90]
  
    if (maxLat > 85 && !coords.some(c => c[1] === 90)) {
      coords.splice(Math.floor(coords.length / 2), 0, northPole)
    } else if (minLat < -85 && !coords.some(c => c[1] === -90)) {
      coords.splice(Math.floor(coords.length / 2), 0, southPole)
    }
  
    return coords
  }
  
  export default {
    name: 'PolarPolygon',
    mounted() {
      let coords = [
        [30, 85],
        [120, 87],
        [-150, 86],
        [30, 85]
      ]
  
      coords = insertPoleIfNeeded(coords)
  
      // 投影多边形顶点坐标
      const projectedCoords = coords.map(c => fromLonLat(c))
  
      // 创建多边形要素
      const polygon = new Polygon([projectedCoords])
      const polygonFeature = new Feature(polygon)
  
      // 创建顶点点要素和文本标签要素
      const pointFeatures = coords.map((coord, index) => {
        const projectedPoint = fromLonLat(coord)
        const pointFeature = new Feature(new Point(projectedPoint))
        pointFeature.setStyle(new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new FillStyle({ color: 'blue' }),
            stroke: new StrokeStyle({ color: 'white', width: 1 })
          }),
          text: new Text({
            text: `(${coord[0].toFixed(2)}, ${coord[1].toFixed(2)})`,
            offsetY: -15,
            fill: new FillStyle({ color: 'black' }),
            stroke: new StrokeStyle({ color: 'white', width: 2 }),
            font: '12px Arial',
            overflow: true
          })
        }))
        return pointFeature
      })
  
      // 创建地图
      const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({ source: new OSM() }),
          new VectorLayer({
            source: new VectorSource({ features: [polygonFeature] }),
            style: new Style({
              stroke: new Stroke({ color: 'red', width: 2 }),
              fill: new Fill({ color: 'rgba(255, 0, 0, 0.3)' })
            })
          }),
          new VectorLayer({
            source: new VectorSource({ features: pointFeatures })
          })
        ],
        view: new View({
          center: fromLonLat([0, 85]),
          zoom: 2,
          projection: 'EPSG:3857'
        })
      })
  
      map.getView().fit(polygon.getExtent(), {
        padding: [20, 20, 20, 20],
        duration: 1000
      })
    }
  }
  </script>
  