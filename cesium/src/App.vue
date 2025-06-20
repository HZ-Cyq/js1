<template>
  <div id="app" class="layout">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <HoverTreeMenu
        :nodes="menuData"
        @component-selected="loadComponent"
      />
    </div>

    <!-- 右侧地图和动态面板 -->
    <div class="main">
      <!-- Cesium 容器 -->
      <div id="cesiumContainer"></div>

      <!-- 动态组件面板 -->
      <div class="plugin-panel" v-if="currentComponent">
        <component
          :is="currentComponent.component"
          :viewer="viewer"
          :key="currentComponent.key"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HoverTreeMenu from "@/components/hovertreemenus/HoverTreeMenu.vue";

export default {
  components: { HoverTreeMenu },
  data() {
    return {
      viewer: null,
      currentComponent: null,
      menuData: [
        {
          title: "primitive",
          subMenu: [
            {
              title: "primitive1",
              componentName: "PrimitiveDemo"
            },
            {
              title: "primitive2",
              componentName: "PrimitiveDemo2"
            }
          ]
        },
        {
          title: "泰森多边形",
          subMenu: [
            {
              title: "Voronoi",
              componentName: "Voronoi"
            },
            {
              title: "Voronoi2",
              componentName: "Voronoi2"
            }
          ]
        }
      ]
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
    },
    async loadComponent(name) {
      const componentMap = {
        PrimitiveDemo: () => import("@/components/modules/PrimitiveDemo.vue"),
        PrimitiveDemo2: () => import("@/components/modules/PrimitiveDemo2.vue"),
        Voronoi: () => import("@/components/modules/Voronoi.vue"),
        Voronoi2: () => import("@/components/modules/Voronoi2.vue"),
      };

      try {
        if (!componentMap[name]) throw new Error("组件未注册：" + name);
        const mod = await componentMap[name]();
        this.currentComponent = {
          component: mod.default,
          key: name + "-" + Date.now(), // 强制更新
        };
      } catch (e) {
        alert("加载组件失败：" + name);
        console.error(e);
      }
    },
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
</style>
