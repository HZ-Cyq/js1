<template>
  <div id="map" style="width: 100%; height: 100vh;"></div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import { Fill, Stroke, Style } from 'ol/style';

import * as turf from '@turf/turf';

export default {
  name: 'PolarPolygonMap',
  mounted() {
    // 原始坐标示例，跨极点区域，注意[lon, lat]
    const rawCoords = [
      [10, 80],
      [100, 80],
      [150, 85],
      [-150, 85],
      [-100, 80],
      [-10, 80],
      [10, 80], // 闭合
    ];

    // 1. 标准化经度到[-180,180]
    function normalizeLon(lon) {
      let val = lon;
      while (val > 180) val -= 360;
      while (val < -180) val += 360;
      return val;
    }

    // 2. 插入极点顶点函数（检测跨极点纬度区域，插入极点顶点）
    function insertPolarPoints(coords) {
      const result = [];
      for (let i = 0; i < coords.length - 1; i++) {
        const [lon1, lat1] = coords[i];
        const [lon2, lat2] = coords[i + 1];
        result.push([normalizeLon(lon1), lat1]);

        // 北极跨越
        if ((lat1 < 85 && lat2 > 85) || (lat1 > 85 && lat2 < 85)) {
          // 插入北极点
          const polarLon = normalizeLon((lon1 + lon2) / 2);
          result.push([polarLon, 90]);
        }
        // 南极跨越
        if ((lat1 < -85 && lat2 > -85) || (lat1 > -85 && lat2 < -85)) {
          // 插入南极点
          const polarLon = normalizeLon((lon1 + lon2) / 2);
          result.push([polarLon, -90]);
        }
      }
      // 添加最后一个点
      const last = coords[coords.length - 1];
      result.push([normalizeLon(last[0]), last[1]]);
      return result;
    }

    // 处理后坐标
    const coordsWithPolars = insertPolarPoints(rawCoords);

    // 3. 用turf创建Polygon
    const polygon = turf.polygon([coordsWithPolars]);

    // 4. 转换成OpenLayers Geometry
    const geojsonFormat = new GeoJSON();
    const olGeom = geojsonFormat.readGeometry(polygon.geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });

    // 5. 创建Feature
    const feature = new Feature({
      geometry: olGeom,
    });

    // 6. 设置样式
    feature.setStyle(
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.3)',
        }),
      })
    );

    // 7. 初始化地图
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 9000000], // 视角偏北极
        zoom: 3,
      }),
    });

    // 8. 添加矢量图层
    const vectorSource = new VectorSource({
      features: [feature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    map.addLayer(vectorLayer);
  },
};
</script>
