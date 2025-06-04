<template>
    <div>
      <div id="cesiumContainer" style="width: 100%; height: 80vh;"></div>
      <div style="padding: 10px;">
        <div>起始角度：{{ options.startAngleDeg }}
          <input type="range" min="0" max="360" v-model.number="options.startAngleDeg" @input="drawSector" />
        </div>
        <div>终止角度：{{ options.endAngleDeg }}
          <input type="range" min="0" max="360" v-model.number="options.endAngleDeg" @input="drawSector" />
        </div>
        <!-- <div>距离（km）：{{ options.distanceKm }}
          <input type="range" min="1" max="20" v-model.number="options.distanceKm" @input="drawSector" />
        </div> -->
        <div>俯仰角：{{ options.pitchDeg }}
          <input type="range" min="-90" max="90" v-model.number="options.pitchDeg" @input="drawSector" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CesiumSectorPitchComponent",
    data() {
      return {
        viewer: null,
        sectorEntity: null,
        options: {
          centerLon: 120,
          centerLat: 30,
          centerHeight: 1000,
          startAngleDeg: 30,
          endAngleDeg: 120,
          distanceKm: 5,
          pitchDeg: 0
        }
      };
    },
    mounted() {
      this.initCesium();
    },
    methods: {
      initCesium() {
        this.viewer = new Cesium.Viewer("cesiumContainer", {
          animation: false,
          timeline: false
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.drawSector();
      },
  
      drawSector() {
        if (this.sectorEntity) {
          this.viewer.entities.remove(this.sectorEntity);
        }
  
        const Cesium = window.Cesium;
        const {
          centerLon,
          centerLat,
          centerHeight,
          startAngleDeg,
          endAngleDeg,
          distanceKm,
          pitchDeg
        } = this.options;
  
        const centerCarto = Cesium.Cartographic.fromDegrees(centerLon, centerLat, centerHeight);
        const center = Cesium.Ellipsoid.WGS84.cartographicToCartesian(centerCarto);
        const radius = distanceKm * 1000;
  
        const geocenter = new Cesium.Cartesian3(0, 0, 0);
        const zAxis = Cesium.Cartesian3.subtract(geocenter, center, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(zAxis, zAxis);
  
        // 找到局部坐标系
        const arbitrary = Cesium.Cartesian3.UNIT_Z;
        let xAxis = Cesium.Cartesian3.cross(arbitrary, zAxis, new Cesium.Cartesian3());
        Cesium.Cartesian3.normalize(xAxis, xAxis);
        const yAxis = Cesium.Cartesian3.cross(zAxis, xAxis, new Cesium.Cartesian3());
  
        const pitchRad = Cesium.Math.toRadians(pitchDeg);
        const pitchQuat = Cesium.Quaternion.fromAxisAngle(xAxis, pitchRad);
        const pitchMatrix = Cesium.Matrix3.fromQuaternion(pitchQuat);
  
        const angleStep = 2;
        const positions = [center];
  
        for (let angle = startAngleDeg; angle <= endAngleDeg; angle += angleStep) {
          const azimuthRad = Cesium.Math.toRadians(angle);
          const localDir = new Cesium.Cartesian3(
            Math.cos(azimuthRad),
            Math.sin(azimuthRad),
            0
          );
  
          // 将 localDir 转到世界坐标
          let worldDir = new Cesium.Cartesian3(
            xAxis.x * localDir.x + yAxis.x * localDir.y,
            xAxis.y * localDir.x + yAxis.y * localDir.y,
            xAxis.z * localDir.x + yAxis.z * localDir.y
          );
  
          // 绕 x 轴进行 pitch 旋转
          worldDir = Cesium.Matrix3.multiplyByVector(pitchMatrix, worldDir, new Cesium.Cartesian3());
  
          const endpoint = Cesium.Cartesian3.multiplyByScalar(worldDir, radius, new Cesium.Cartesian3());
          const final = Cesium.Cartesian3.add(center, endpoint, new Cesium.Cartesian3());
          positions.push(final);
        }
  
        positions.push(center);
  
        this.sectorEntity = this.viewer.entities.add({
          polyline: {
            positions: positions,
            width: 2,
            material: Cesium.Color.YELLOW.withAlpha(0.9),
            clampToGround: false
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  #cesiumContainer {
    width: 100%;
    height: 80vh;
  }
  input[type="range"] {
    width: 100%;
    margin: 5px 0;
  }
  </style>
  