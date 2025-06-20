<template>
  <div>
    添加一个矩形面
  </div>
</template>

<script>
export default {
  props: ['viewer'],
  mounted() {
    if (!this.viewer || !this.viewer.scene) return

    const scene = this.viewer.scene
    const primitives = scene.primitives

    // 添加一个黄色半透明的矩形 Primitive
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(-100, 30, -90, 40),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
      }),
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.YELLOW.withAlpha(0.6)
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

    // 飞行到区域
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-95, 35, 1000000),
    })
  },
  beforeDestroy() {
    if (this.primitive && this.viewer?.scene?.primitives) {
      this.viewer.scene.primitives.remove(this.primitive)
    }
  },
}
</script>