<template>
    <div id="cesiumContainer" style="width: 100vw; height: 100vh;"></div>
</template>
  
  <script>
  
  export default {
    name: "AccurateFan",
    mounted() {
      const viewer = new Cesium.Viewer("cesiumContainer", {
      });
  
      // 输入参数
      const centerLon = 0;
      const centerLat = 0;
      const height = 100000; // 米
  
      const radius = 2000000; // 扇形半径（米）
      const angle = 80;    // 扇形张角（度）
      const heading = 10;  // 扇形朝向（度）
  
      // 计算扇形边界点，基于大圆航线公式
      const positions = [];
      // 转换成弧度
      const toRad = Cesium.Math.toRadians;
      // 转换成角度
      const toDeg = Cesium.Math.toDegrees;
  
      // 扇形中心点笛卡尔坐标
      // fromDegrees：将经纬度坐标转换成笛卡尔坐标
      positions.push(Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height));
  
      const earthRadius = 6378137; // 地球平均半径（米）
  
      // 从heading - angle/2到heading + angle/2采样边界点
      for (let a = heading - angle / 2; a <= heading + angle / 2; a += 2) {
        const bearing = toRad(a);
        const lat1 = toRad(centerLat);
        const lon1 = toRad(centerLon);
        const d = radius / earthRadius; // 角距离
  
        // 计算边界点纬度
        const lat2 = Math.asin(
          Math.sin(lat1) * Math.cos(d) +
            Math.cos(lat1) * Math.sin(d) * Math.cos(bearing)
        );
  
        // 计算边界点经度
        const lon2 =
          lon1 +
          Math.atan2(
            Math.sin(bearing) * Math.sin(d) * Math.cos(lat1),
            Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
          );
  
        positions.push(
          Cesium.Cartesian3.fromDegrees(toDeg(lon2), toDeg(lat2), height)
        );
      }
  
      viewer.entities.add({
        name: "Accurate Fan Shape",
        polygon: {
          hierarchy: positions,
          material: Cesium.Color.ORANGE.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.ORANGE,
          heightReference: Cesium.HeightReference.NONE,
        },
      });
  
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height + 5000),
        orientation: {
          heading: toRad(heading),
          pitch: toRad(-30),
          roll: 0,
        },
      });
    },
  };
  </script>
  
  <style>
  </style>
  