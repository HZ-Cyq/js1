<template>
    <div>绘制一个立方体 Primitive</div>
  </template>
  
  <script>
  export default {
    props: ['viewer'],
    mounted() {
      if (!this.viewer || !this.viewer.scene) return;
  
      const scene = this.viewer.scene;
      const primitives = scene.primitives;
  
      const center = Cesium.Cartesian3.fromDegrees(0, 0, 0)

      // 1. 原始 ENU 坐标系
      const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
      // 2. 绕 Y 轴旋转 45 度
      const rotationY = Cesium.Matrix4.fromRotationTranslation(
          Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(45))
      )
      // 3. 组合变换
      const modelMatrix = Cesium.Matrix4.multiply(rotationY, enuMatrix, new Cesium.Matrix4())
      
      const instance = new Cesium.GeometryInstance({
        geometry: new Cesium.BoxGeometry({
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          maximum: new Cesium.Cartesian3(50000, 50000, 50000),
          minimum: new Cesium.Cartesian3(-50000, -50000, -50000),
        }),
        modelMatrix: enuMatrix,
        // modelMatrix: modelMatrix,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.BLUE.withAlpha(0.5)
          ),
        },
      });
      
      const instance2 = new Cesium.GeometryInstance({
        geometry: new Cesium.BoxGeometry({
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
          maximum: new Cesium.Cartesian3(50000, 50000, 50000),
          minimum: new Cesium.Cartesian3(-50000, -50000, -50000),
        }),
        modelMatrix: modelMatrix,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.RED.withAlpha(0.5)
          ),
        },
      });
  
      this.primitive = primitives.add(
        new Cesium.Primitive({
          geometryInstances: instance,
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            closed: true,
          }),
        })
      );
      
    primitives.add(
        new Cesium.Primitive({
          geometryInstances: instance2,
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            closed: true,
          }),
        })
      );
  
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-100, 40, 1000000),
      });
    },
    beforeDestroy() {
      if (this.primitive) {
        this.viewer.scene.primitives.remove(this.primitive);
      }
    },
  };
  </script>
  