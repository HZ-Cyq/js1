<template>
  <div id="app" class="layout">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <HoverTreeMenu :nodes="menuData" @component-selected="loadComponent" />
    </div>

    <!-- 右侧地图和动态面板 -->
    <div class="main">
      <!-- Cesium 容器 -->
      <div id="cesiumContainer"></div>

      <!-- 动态组件面板 -->
      <div class="plugin-panel" v-if="currentComponent">
        <component :is="currentComponent.component" :viewer="viewer" :key="currentComponent.key" />
      </div>

      <!-- 鼠标经纬度显示 -->
      <div v-if="mouseLonLat" class="mouse-coords">
        经度: {{ mouseLonLat.lon }}°, 纬度: {{ mouseLonLat.lat }}°
      </div>
      <GridlineLayer v-if="viewer" :viewer="viewer" :interval="10" />
    </div>
  </div>
</template>

<script>
import HoverTreeMenu from "@/components/hovertreemenus/HoverTreeMenu.vue";
import GridlineLayer from "./components/init/GridlineLayer.vue";
export default {
  components: { HoverTreeMenu, GridlineLayer },
  data() {
    return {
      viewer: null,
      currentComponent: null,
      mouseLonLat: null,  // 新增：存鼠标经纬度
      menuData: [
        {
          title: "primitive",
          subMenu: [
            { title: "primitive1", componentName: "PrimitiveDemo" },
            { title: "primitive2", componentName: "PrimitiveDemo2" },
            { title: "立方体", componentName: "PrimitiveBox" },
          ],
        },
        {
          title: "泰森多边形",
          subMenu: [
            { title: "Voronoi", componentName: "Voronoi" },
            { title: "Voronoi2", componentName: "Voronoi2" },
          ],
        },
        {
          title: "其他",
          subMenu: [
            { title: "突防走廊", componentName: "Tfzl" },
            { title: "突防走廊2", componentName: "ThreatCorridor" },
          ],
        },
      ],
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
      this.viewer.scene.globe.enableLighting = true;

      // // 添加网格
      // this.viewer.imageryLayers.addImageryProvider(
      //   new Cesium.GridImageryProvider({
      //     cells: 36,
      //     color: Cesium.Color.YELLOW,
      //     glowColor: Cesium.Color.BLACK,
      //     glowWidth: 2.0,
      //   })
      // );

      // 添加鼠标经纬度显示事件监听
      this.addMouseMoveHandler();
    },
    addMouseMoveHandler() {
      const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
      handler.setInputAction((movement) => {
        const cartesian = this.viewer.camera.pickEllipsoid(
          movement.endPosition,
          this.viewer.scene.globe.ellipsoid
        );
        if (cartesian) {
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          this.mouseLonLat = {
            lon: Cesium.Math.toDegrees(cartographic.longitude).toFixed(6),
            lat: Cesium.Math.toDegrees(cartographic.latitude).toFixed(6),
          };
        } else {
          this.mouseLonLat = null;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.handler = handler;
    },
    async loadComponent(name) {
      const componentMap = {
        PrimitiveDemo: () => import("@/components/modules/primitive/PrimitiveDemo.vue"),
        PrimitiveDemo2: () => import("@/components/modules/primitive/PrimitiveDemo2.vue"),
        Voronoi: () => import("@/components/modules/voronoi/Voronoi.vue"),
        Voronoi2: () => import("@/components/modules/voronoi/Voronoi2.vue"),
        PrimitiveBox: () => import("@/components/modules/primitive/PrimitiveBox.vue"),
        Tfzl: () => import("@/components/modules/tfzl/tfzl.vue"),
        ThreatCorridor: () => import("@/components/modules/tfzl/ThreatCorridor.vue"),
      };

      try {
        if (!componentMap[name]) throw new Error("组件未注册：" + name);
        const mod = await componentMap[name]();
        this.currentComponent = {
          component: mod.default,
          key: name + "-" + Date.now(),
        };
      } catch (e) {
        alert("加载组件失败：" + name);
        console.error(e);
      }
    },
  },
  beforeDestroy() {
    if (this.handler) {
      this.handler.destroy();
      this.handler = null;
    }
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.sidebar {
  width: 240px;
  background-color: #2c3e50;
  overflow-y: auto;
}
.main {
  flex: 1;
  position: relative;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
.plugin-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.mouse-coords {
  position: absolute;
  bottom: 10px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 8px;
  border-radius: 3px;
  font-size: 12px;
  user-select: none;
  pointer-events: none;
  z-index: 10000;
}
</style>
