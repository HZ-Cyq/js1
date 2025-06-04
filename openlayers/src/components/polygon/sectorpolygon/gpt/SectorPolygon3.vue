<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { Fill, Stroke, Style } from 'ol/style';

export default {
  name: 'GeodesicCircleMap',
  mounted() {
    this.map = new Map({
      target: this.$refs.mapContainer,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([179.5, 65]),
        zoom: 3,
      }),
    });

    // 正确绘制真实地理圆（无洞）
    const circlePolygon = this.createGeodesicCirclePolygon([179.5, 65], 500000);
    const circleFeature = new Feature(circlePolygon);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [circleFeature],
      }),
      style: new Style({
        stroke: new Stroke({ color: 'green', width: 2 }),
        fill: new Fill({ color: 'rgba(0, 255, 0, 0.3)' }), // ✅ 圆内绿色填充
      }),
    });

    this.map.addLayer(vectorLayer);
  },

  methods: {
    createGeodesicCirclePolygon(centerLonLat, radiusInMeters, numPoints = 128) {
      const [lon, lat] = centerLonLat;
      const coords = [];

      for (let i = 0; i <= numPoints; i++) {
        const angle = (360 * i) / numPoints;
        const point = this.destinationPoint([lon, lat], radiusInMeters, angle);
        coords.push(fromLonLat(this.wrapLongitude(point)));
      }

      return new Polygon([coords]);
    },

    destinationPoint([lon, lat], distance, bearing) {
      const R = 6371000; // 地球半径（米）
      const δ = distance / R;
      const θ = bearing * Math.PI / 180;

      const φ1 = lat * Math.PI / 180;
      const λ1 = lon * Math.PI / 180;

      const φ2 = Math.asin(
        Math.sin(φ1) * Math.cos(δ) +
        Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
      );

      let λ2 = λ1 + Math.atan2(
        Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
        Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
      );

      λ2 = ((λ2 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

      return [λ2 * 180 / Math.PI, φ2 * 180 / Math.PI];
    },

    wrapLongitude([lon, lat]) {
      if (lon < -180) lon += 360;
      if (lon > 180) lon -= 360;
      return [lon, lat];
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
