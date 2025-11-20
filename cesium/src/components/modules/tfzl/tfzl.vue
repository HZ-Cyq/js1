<template>
    <div>突防走廊（Primitive + 高度）</div>
  </template>
  
  <script>
  export default {
    props: ['viewer'],
    mounted() {
      if (!this.viewer || !this.viewer.scene) return
  
      const scene = this.viewer.scene
      const primitives = scene.primitives
  
      // 敌雷达区（entity 绘制，便于参考）
      this.radarEntity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.0, 40.0, 0),
        ellipse: {
          semiMinorAxis: 30000.0,
          semiMajorAxis: 30000.0,
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.4),
          outline: true,
          outlineColor: Cesium.Color.DARKRED,
        },
        label: {
          text: "敌雷达",
          font: "14pt sans-serif",
          fillColor: Cesium.Color.RED,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -20),
        },
      })
  
      // 突防走廊 Primitive，添加高度范围
      const corridorInstance = new Cesium.GeometryInstance({
        geometry: new Cesium.CorridorGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray([
            115.5, 39.6,
            115.9, 39.8,
            116.3, 40.0,
            116.8, 40.2,
            117.3, 40.4,
          ]),
          width: 20000, // 20km 宽
          height: 1000, // 底部高度为 1000 米
          extrudedHeight: 3000, // 向上拉伸至 3000 米，形成走廊体
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.BLUE.withAlpha(0.4)
          ),
        },
      })
  
      this.corridorPrimitive = primitives.add(
        new Cesium.Primitive({
          geometryInstances: corridorInstance,
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            closed: true, // 设置为 true，顶部底部都封闭
          }),
        })
      )
  
      // 飞行轨迹线（穿过突防走廊）
      this.pathEntity = this.viewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            115.5, 39.6, 1500,
            115.9, 39.8, 1600,
            116.3, 40.0, 1800,
            116.8, 40.2, 2000,
            117.3, 40.4, 1700,
          ]),
          width: 3,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Cesium.Color.YELLOW,
          }),
        },
      })
  
      // 相机飞入全景
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.3, 40.0, 500000),
      })
    },
    beforeDestroy() {
      const primitives = this.viewer?.scene?.primitives
      if (this.corridorPrimitive && primitives) {
        primitives.remove(this.corridorPrimitive)
      }
      if (this.radarEntity) {
        this.viewer.entities.remove(this.radarEntity)
      }
      if (this.pathEntity) {
        this.viewer.entities.remove(this.pathEntity)
      }
    },
  }
  </script>
  