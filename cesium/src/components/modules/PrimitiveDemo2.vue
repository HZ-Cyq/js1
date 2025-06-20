<template>
  <div>
    添加一个立方体
  </div>
</template>

<script>
export default {
  props: ['viewer'],
  mounted() {
    if (!this.viewer || !this.viewer.scene) return

    const primitives = this.viewer.scene.primitives

    // 创建Box Geometry实例
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.BoxGeometry({
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        maximum: new Cesium.Cartesian3(500000.0, 500000.0, 500000.0),
        minimum: new Cesium.Cartesian3(-500000.0, -500000.0, -500000.0),
      }),
      modelMatrix: Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(
          Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 0)
        ),
        new Cesium.Cartesian3(0.0, 0.0, 0.0),
        new Cesium.Matrix4()
      ),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.CYAN.withAlpha(0.7)
        ),
      },
    })

    this.primitive = primitives.add(
      new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true,
          closed: true,
        }),
      })
    )

    // 飞到盒子位置
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-100, 40, 2000000),
    })
  },
  beforeDestroy() {
    if (this.primitive && this.viewer?.scene?.primitives) {
      this.viewer.scene.primitives.remove(this.primitive)
    }
  },
}
</script>
