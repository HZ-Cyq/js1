<template>
    <div></div>
  </template>
  
  <script>
  export default {
    name: "GridlineWithLabels",
    props: {
      viewer: Object,
      interval: {
        type: Number,
        default: 10,
      },
      color: {
        type: Object,
        default: () => Cesium.Color.YELLOW.withAlpha(0.4),
      },
      labelColor: {
        type: Object,
        default: () => Cesium.Color.WHITE,
      },
      labelFont: {
        type: String,
        default: "12px sans-serif",
      },
    },
    data() {
      return {
        entitiesList: [],
        cameraListener: null,
      };
    },
    mounted() {
      if (!this.viewer) return;
      this.drawGridAndLabels();
      this.startCameraListener();
    },
    beforeDestroy() {
      this.clearEntities();
      this.stopCameraListener();
    },
    methods: {
      drawGridAndLabels() {
        const entities = this.viewer.entities;
        const interval = this.interval;
        const color = this.color;
        const labelColor = this.labelColor;
        const labelFont = this.labelFont;
  
        // 画纬线
        for (let lat = -90; lat <= 90; lat += interval) {
          const positions = [];
          for (let lon = -180; lon <= 180; lon += 1) {
            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat));
          }
          const line = entities.add({
            polyline: {
              positions,
              width: 1,
              material: color,
            },
          });
          this.entitiesList.push(line);
        }
  
        // 画经线
        for (let lon = -180; lon <= 180; lon += interval) {
          const positions = [];
          for (let lat = -90; lat <= 90; lat += 1) {
            positions.push(Cesium.Cartesian3.fromDegrees(lon, lat));
          }
          const line = entities.add({
            polyline: {
              positions,
              width: 1,
              material: color,
            },
          });
          this.entitiesList.push(line);
        }
  
        // 画交点标签
        for (let lat = -90; lat <= 90; lat += interval) {
          for (let lon = -180; lon <= 180; lon += interval) {
            const lonText = lon > 0 ? `${lon}°E` : lon < 0 ? `${-lon}°W` : "0°";
            const latText = lat > 0 ? `${lat}°N` : lat < 0 ? `${-lat}°S` : "0°";
            const labelText = `${lonText}, ${latText}`;
            const position = Cesium.Cartesian3.fromDegrees(lon, lat);
  
            const label = entities.add({
              position,
              label: {
                text: labelText,
                font: labelFont,
                fillColor: labelColor,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                scale: 0.7,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
              },
            });
            this.entitiesList.push(label);
          }
        }
      },
  
      clearEntities() {
        this.entitiesList.forEach((e) => {
          this.viewer.entities.remove(e);
        });
        this.entitiesList = [];
      },
  
      startCameraListener() {
        this.cameraListener = () => {
          this.cullBackLabels();
        };
        this.viewer.camera.changed.addEventListener(this.cameraListener);
        this.cullBackLabels();
      },
  
      stopCameraListener() {
        if (this.cameraListener) {
          this.viewer.camera.changed.removeEventListener(this.cameraListener);
          this.cameraListener = null;
        }
      },
  
      cullBackLabels() {
        if (!this.viewer) return;
        const cameraPos = this.viewer.camera.positionWC;
        const scene = this.viewer.scene;
        const canvas = scene.canvas;
        const entities = this.entitiesList;
        const time = this.viewer.clock.currentTime;

        for (const entity of entities) {
          if (!entity.label || !entity.position) continue;

          const labelPos = entity.position.getValue(time);
          if (!labelPos) continue;

          // 背面剔除判断
          const labelNormal = Cesium.Cartesian3.normalize(labelPos, new Cesium.Cartesian3());
          const labelToCamera = Cesium.Cartesian3.subtract(cameraPos, labelPos, new Cesium.Cartesian3());
          const dot = Cesium.Cartesian3.dot(labelNormal, labelToCamera);

          if (dot <= 0) {
            entity.label.show = false;
            continue;
          }

          // 获取屏幕坐标
          const windowPosition = Cesium.SceneTransforms.worldToWindowCoordinates(scene, labelPos);

          if (!windowPosition) {
            entity.label.show = false;
            continue;
          }

          const visible =
            windowPosition.x >= 0 &&
            windowPosition.x <= canvas.clientWidth &&
            windowPosition.y >= 0 &&
            windowPosition.y <= canvas.clientHeight;

          entity.label.show = visible;
        }
      }
   },
};
  </script>
  