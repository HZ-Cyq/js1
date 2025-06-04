<template>
    <div style="width: 100%; height: 100%;">
      <div id="cesiumContainer" style="width: 100%; height: 600px;"></div>
  
      <div style="margin-top: 10px; padding: 10px; background: #eee;">
        <label>
          起始角度: {{ startAngle }}°
          <input
            type="range"
            min="0"
            max="360"
            v-model.number="startAngle"
            @input="updateSector"
            step="1"
            style="width: 45%;"
          />
        </label>
  
        <label style="margin-left: 20px;">
          终止角度: {{ endAngle }}°
          <input
            type="range"
            min="0"
            max="360"
            v-model.number="endAngle"
            @input="updateSector"
            step="1"
            style="width: 45%;"
          />
        </label>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        viewer: null,
        sectorEntity: null,
        startAngle: 0,
        endAngle: 90,
        centerLon: 116.391,
        centerLat: 39.907,
        height: 1000,
        radius: 2000,
      };
    },
    mounted() {
      this.initCesium();
    },
    methods: {
      initCesium() {
        this.viewer = new Cesium.Viewer("cesiumContainer", {
          imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }),
        });
  
        // 添加经纬线网格
        this.viewer.imageryLayers.addImageryProvider(
          new Cesium.GridImageryProvider({
            color: Cesium.Color.YELLOW,
            cellAlpha: 0.3,
            lineCount: 36,
            lineThickness: 1.0,
            glowWidth: 0.0,
          })
        );
  
        // 初始化扇形
        this.addSectorEntity();
  
        // 视角调整
        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(this.centerLon, this.centerLat, this.height + 4000),
          orientation: {
            pitch: Cesium.Math.toRadians(-45),
          },
        });
      },
  
      // 添加扇形Entity
      addSectorEntity() {
        const positions = this.computeSectorPositions(
          this.centerLon,
          this.centerLat,
          this.height,
          this.radius,
          this.startAngle,
          this.endAngle
        );
  
        this.sectorEntity = this.viewer.entities.add({
          name: "Sector Polyline",
          polyline: {
            positions: positions,
            width: 3,
            material: Cesium.Color.RED,
            clampToGround: false,
          },
        });
      },
  
      // 计算扇形边界点
      computeSectorPositions(centerLon, centerLat, height, radius, startAngle, endAngle) {
        const segmentCount = 50;
        const startRad = Cesium.Math.toRadians(startAngle);
        const endRad = Cesium.Math.toRadians(endAngle);
  
        const centerCartesian = Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height);
        const ellipsoid = Cesium.Ellipsoid.WGS84;
        const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(centerCartesian, ellipsoid);
  
        const positions = [centerCartesian];
  
        for (let i = 0; i <= segmentCount; i++) {
          const angle = startRad + ((endRad - startRad) * i) / segmentCount;
  
          const deltaX = radius * Math.sin(angle);
          const deltaY = radius * Math.cos(angle);
  
          const localOffset = new Cesium.Cartesian3(deltaX, deltaY, 0);
          const newCartesian = Cesium.Matrix4.multiplyByPoint(enuMatrix, localOffset, new Cesium.Cartesian3());
  
          positions.push(newCartesian);
        }
  
        positions.push(centerCartesian);
  
        return positions;
      },
  
      // 更新扇形线位置
      updateSector() {
        if (this.sectorEntity) {
          const newPositions = this.computeSectorPositions(
            this.centerLon,
            this.centerLat,
            this.height,
            this.radius,
            this.startAngle,
            this.endAngle
          );
  
          this.sectorEntity.polyline.positions = newPositions;
        }
      },
    },
  };
  </script>
  
  <style>
  #cesiumContainer {
    position: relative;
  }
  </style>
  