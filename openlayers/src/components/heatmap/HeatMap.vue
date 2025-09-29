<template>
  <div id="mapContainer" ref="mapContainer" style="width: 100%; height: 600px;"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import {ScatterplotLayer} from '@deck.gl/layers';
import {MapboxLayer} from '@deck.gl/mapbox';

// 替换成你自己的 mapbox token
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

export default {
  name: 'HeatMap',
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const data = this.generatePoints(50);

      // 初始化 mapbox 底图
      this.map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-95, 40],
        zoom: 3
      });

      this.map.on('load', () => {
        // 创建 deck.gl Layer
        const scatterLayer = new MapboxLayer({
          id: 'scatter',
          type: ScatterplotLayer,
          data,
          getPosition: d => [d.longitude, d.latitude],
          getRadius: d => 10000 + d.weight * 50000,
          getFillColor: d => {
            const t = Math.min(1, d.weight / 100);
            return [255 * t, 0, 255 * (1 - t), 180];
          },
          radiusMinPixels: 5,
          radiusMaxPixels: 100,
          pickable: true
        });

        // 添加到地图中
        this.map.addLayer(scatterLayer);
      });
    },

    generatePoints(count) {
      const points = [];
      for (let i = 0; i < count; i++) {
        points.push({
          longitude: -125 + Math.random() * 60,
          latitude: 25 + Math.random() * 25,
          weight: Math.random() * 100
        });
      }
      return points;
    }
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>
