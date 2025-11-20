<template><div /></template>

<script>
export default {
  props: ['viewer'],
  mounted() {
    if (!this.viewer) return

    // 示例泰森多边形顶点（经纬度）
    // 这里只是简单画几个多边形模拟泰森多边形效果
    const polygons = [
      {
        id: 'poly1',
        coordinates: [
          -110, 35,
          -105, 40,
          -100, 35,
          -105, 30,
        ],
        color: Cesium.Color.RED.withAlpha(0.4),
      },
      {
        id: 'poly2',
        coordinates: [
          -105, 40,
          -100, 45,
          -95, 40,
          -100, 35,
        ],
        color: Cesium.Color.BLUE.withAlpha(0.4),
      },
      {
        id: 'poly3',
        coordinates: [
          -100, 35,
          -95, 40,
          -90, 35,
          -95, 30,
        ],
        color: Cesium.Color.GREEN.withAlpha(0.4),
      },
    ]

    polygons.forEach((poly) => {
      this.viewer.entities.add({
        id: poly.id,
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(poly.coordinates),
          material: poly.color,
          outline: true,
          outlineColor: Cesium.Color.BLACK,
        },
      })
    })

    // 飞到中心点
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-100, 37.5, 3000000),
    })
  },
  beforeDestroy() {
    // 清理这些多边形
    const ids = ['poly1', 'poly2', 'poly3']
    ids.forEach((id) => this.viewer.entities.removeById(id))
  },
}
</script>
