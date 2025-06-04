<template>
    <div>
        <div style="padding: 1em; display: flex; flex-wrap: wrap; gap: 1em;">
            <div style="width: 200px;">
                <label style="display: block;">起点经度: {{ startLon }}</label>
                <input type="range" min="-180" max="180" step="0.1" v-model.number="startLon" style="width: 100%;" />
            </div>
            <div style="width: 200px;">
                <label style="display: block;">起点纬度: {{ startLat }}</label>
                <input type="range" min="-90" max="90" step="0.1" v-model.number="startLat" style="width: 100%;" />
            </div>
            <div style="width: 200px;">
                <label style="display: block;">终点经度: {{ endLon }}</label>
                <input type="range" min="-180" max="180" step="0.1" v-model.number="endLon" style="width: 100%;" />
            </div>
            <div style="width: 200px;">
                <label style="display: block;">终点纬度: {{ endLat }}</label>
                <input type="range" min="-90" max="90" step="0.1" v-model.number="endLat" style="width: 100%;" />
            </div>
        </div>
        <div id="map" style="width: 100%; height: 80vh;"></div>
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
import LineString from 'ol/geom/LineString'
import { Stroke, Style } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import * as turf from '@turf/turf'

export default {
    name: 'GreatCircleMap',
    data() {
        return {
            startLon: 116.391,
            startLat: 39.9075,
            endLon: -74.006,
            endLat: 40.7128,
            map: null,
            vectorLayer: null,
            lineFeature: null,
        }
    },
    mounted() {
        this.initMap()
        this.drawGreatCircle()
    },
    watch: {
        startLon: 'drawGreatCircle',
        startLat: 'drawGreatCircle',
        endLon: 'drawGreatCircle',
        endLat: 'drawGreatCircle',
    },
    methods: {
        initMap() {
            this.lineFeature = new Feature()
            this.lineFeature.setStyle(
                new Style({
                    stroke: new Stroke({ color: 'red', width: 2 }),
                })
            )

            this.vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: [this.lineFeature],
                }),
            })

            this.map = new Map({
                target: 'map',
                layers: [
                    new TileLayer({ source: new OSM() }),
                    this.vectorLayer,
                ],
                view: new View({
                    center: fromLonLat([0, 20]),
                    zoom: 2,
                }),
            })
        },

        drawGreatCircle() {
            const from = [this.startLon, this.startLat]
            const to = [this.endLon, this.endLat]

            const gc = turf.greatCircle(turf.point(from), turf.point(to), {
                npoints: 128,
            })

            const coords = gc.geometry.coordinates.map(coord => fromLonLat(coord))
            const line = new LineString(coords)

            this.lineFeature.setGeometry(line)
        },
    },
}
</script>