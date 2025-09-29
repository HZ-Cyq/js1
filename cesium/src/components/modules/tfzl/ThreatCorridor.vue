<template>
    <div>自动计算突防走廊</div>
  </template>
  
  <script>
  import {
    generateThreatMap,
    findLowestThreatPath
  } from "../utils/pathPlan"
  
  export default {
    props: ['viewer'],
    mounted() {
      if (!this.viewer || !this.viewer.scene) return
  
      // 模拟生成威胁图（20x20）
      const rows = 20
      const cols = 20
      const radarCenters = [{ x: 10, y: 10, range: 6 }]
      const threatMap = generateThreatMap(rows, cols, radarCenters)
  
      // 起点终点
      const start = { x: 0, y: 10 }
      const end = { x: 19, y: 10 }
  
      const path = findLowestThreatPath(threatMap, start, end)
  
      // 可视化路径
      const lon0 = 115.0
      const lat0 = 40.0
      const dx = 0.01
      const dy = 0.01
  
      const corridorPositions = []
      const heights = []
  
      path.forEach(({ x, y }) => {
        const lon = lon0 + x * dx
        const lat = lat0 + y * dy
        corridorPositions.push(lon, lat)
        heights.push(1500) // 固定高度
      })
  
      // CorridorGeometry 可视化突防走廊（带高度）
      const instance = new Cesium.GeometryInstance({
        geometry: new Cesium.CorridorGeometry({
          positions: Cesium.Cartesian3.fromDegreesArray(corridorPositions),
          width: 10000,
          height: 1000,
          extrudedHeight: 3000,
          vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.BLUE.withAlpha(0.5)
          ),
        },
      })
  
      this.primitive = this.viewer.scene.primitives.add(
        new Cesium.Primitive({
          geometryInstances: instance,
          appearance: new Cesium.PerInstanceColorAppearance({
            translucent: true,
            closed: true,
          }),
        })
      )
  
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(115.1, 40.1, 200000),
      })
    },
    beforeDestroy() {
      if (this.primitive) {
        this.viewer.scene.primitives.remove(this.primitive)
      }
    },
  }
  </script>
  