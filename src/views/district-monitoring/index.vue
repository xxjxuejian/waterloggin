<script setup lang="ts">
// @ts-nocheck
import { usePermissionStoreHook } from "@/store/modules/permission.store.ts";
import router from "@/router";

const time = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");

const permissionStore = usePermissionStoreHook();
const goAdminSystem = () => {
  console.log("teshi", permissionStore.adminEntryRoute);
  router.push(permissionStore.adminEntryRoute);
};

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = "/Static/Cesium";

//  Cartesian3, createOsmBuildingsAsync, Math as CesiumMath,

import { Ion, Viewer } from "cesium";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE";

// 天地图token
const webKey = "da499f7d0eeb7c2e4bf72b84b13a5918";

onMounted(async () => {
  const viewer = new Viewer("cesiumContainer", {
    // 开启地形，会有3d效果
    // terrain: Terrain.fromWorldTerrain(),
    geocoder: false, //地理搜索工具
    homeButton: false, //主页按钮
    // 控制查看器的显示模式
    sceneModePicker: false,
    // 是否显示图层选择
    baseLayerPicker: false,
    // 是否显示帮助按钮
    navigationHelpButton: false,
    // 是否播放动画
    animation: false,
    //商标版权和数据源
    creditContainer: document.getElementById("hiddenCredit"),
    // 是否显示时间轴
    timeline: false,
    // 是否显示全屏按钮
    fullscreenButton: false,
  });

  // viewer.camera.flyTo({
  //   destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
  //   orientation: {
  //     heading: CesiumMath.toRadians(0.0),
  //     pitch: CesiumMath.toRadians(-15.0),
  //   },
  // });

  // Add Cesium OSM Buildings, a global 3D buildings layer.
  // 添加3d建筑物模型
  // const buildingTileset = await createOsmBuildingsAsync();
  // viewer.scene.primitives.add(buildingTileset);

  // 添加天地图影像图层
  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url:
        "https://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" +
        webKey,
      layer: "img",
      style: "default",
      tileMatrixSetID: "w",
      format: "tiles",
      maximumLevel: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    })
  );

  // 天地图矢量注记
  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url:
        "https://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" +
        webKey,
      layer: "cia",
      style: "default",
      tileMatrixSetID: "w",
      format: "tiles",
      maximumLevel: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    })
  );
});
</script>

<template>
  <div class="app-main">
    <!-- 导航栏 -->
    <div class="navbar">
      <div class="left title_shadow font-title relative h-full flex items-center">
        <img src="@/assets/images/line.png" class="absolute top-7 -left-10" alt="" />
        <div class="text-white pl-20 text-3xl tracking-[5px]">临平项目</div>
      </div>
      <div class="tabs"></div>
      <div class="right flex justify-end items-center pr-5">
        <div class="text-[white] font-bold text-xl mr-10 title_shadow">{{ time }}</div>
        <div class="w-[1px] h-7 bg-[#9EC5E7]/80 mr-10"></div>
        <el-popover placement="bottom" trigger="click" :teleported="false" width="100">
          <template #default>
            <div class="flex flex-col text-[#fff] bg-[#001736]/80">
              <div
                class="cursor-pointer py-2 text-center hover:bg-[#8db8e9]/30"
                @click="goAdminSystem"
              >
                后台管理
              </div>
              <div
                class="cursor-pointer py-2 text-center hover:bg-[#8db8e9]/30"
                @click="goAdminSystem"
              >
                系统设置
              </div>
            </div>
          </template>

          <template #reference>
            <img src="@/assets/images/user.png" alt="" />
          </template>
        </el-popover>
      </div>
    </div>

    <!-- 主内容 -->
    <div id="cesiumContainer" class="main-content"></div>
    <div id="hiddenCredit" style="display: none"></div>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  position: relative;
  width: 100%;
  height: 100%;

  .navbar {
    position: absolute;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    width: 100%;
    height: $navbar-height;
    background-image: url("@/assets/images/topBar.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .left {
      width: 400px;
      // font-family:
    }
    .tabs {
      flex: 1;
    }
    .right {
      width: 500px;
      height: 100%;

      :deep(.el-popover) {
        padding: 0;
        overflow: hidden;
        border: 1px solid #8db8e9;
        border-radius: 5px;
      }
    }
  }

  .main-content {
    width: 100%;
    height: 100vh;
    background-color: rgb(130, 232, 236);
  }

  .title_shadow {
    text-shadow:
      0 0 5px rgba(81, 185, 254, 0.4),
      0 0 5px rgba(81, 185, 254, 0.4),
      0 0 5px rgba(81, 185, 254, 0.4),
      0 0 5px rgba(81, 185, 254, 0.4);
  }
}
</style>
