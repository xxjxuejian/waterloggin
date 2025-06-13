import * as Cesium from "cesium";
import { ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user.store.ts";

// 配置常量抽离
const CONFIG = {
  webKey: "ade57801997980f3af716dc86639979e",
  viewerOptions: {
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
  },
  cameraOptions: {
    minimumZoomDistance: 100,
    initialHeight: 4000,
  },
};

const viewer = ref<Cesium.Viewer | null>(null);
const userStore = useUserStoreHook();

export function useCesium() {
  console.log("viewer--------", viewer, viewer.value);

  // 初始化地图图层
  const initMapLayers = (viewer: Cesium.Viewer) => {
    // 添加天地图矢量图层
    viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: `https://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&tk=${CONFIG.webKey}`,
        layer: "img",
        style: "default",
        tileMatrixSetID: "w",
        format: "tiles",
        maximumLevel: 18,
        subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      })
    );

    // 添加天地图矢量注记
    viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: `https://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&tk=${CONFIG.webKey}`,
        layer: "cia",
        style: "default",
        tileMatrixSetID: "w",
        format: "tiles",
        maximumLevel: 18,
        subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      })
    );
  };

  // 配置地图性能
  const configurePerformance = (viewer: Cesium.Viewer) => {
    viewer.scene.screenSpaceCameraController.minimumZoomDistance =
      CONFIG.cameraOptions.minimumZoomDistance;
    viewer.cesiumWidget.creditContainer.style.display = "none";
    viewer.scene.globe.enableLighting = true;
    viewer.scene.skyBox.show = false;
    viewer.scene.fxaa = false;
    viewer.scene.postProcessStages.fxaa.enabled = false;
    viewer.scene.globe.maximumScreenSpaceError = 5 / 3;
    viewer.scene.globe.tileCacheSize = 1000;
    viewer.scene.fog.enabled = false;
  };

  // 初始化相机位置
  const initCameraPosition = (viewer: Cesium.Viewer) => {
    const position = Cesium.Cartesian3.fromDegrees(
      userStore.initCenter.lon,
      userStore.initCenter.lat,
      CONFIG.cameraOptions.initialHeight
    );

    viewer.camera.setView({
      destination: position,
    });
  };

  // 初始化 viewer
  const initViewer = (container: string | HTMLElement) => {
    try {
      viewer.value = new Cesium.Viewer(container, CONFIG.viewerOptions);
      console.log("viewer创建完成", viewer.value);

      initMapLayers(viewer.value);
      configurePerformance(viewer.value);
      initCameraPosition(viewer.value);
    } catch (error) {
      console.error("Failed to initialize Cesium viewer:", error);
      // 错误处理逻辑
    }
  };

  // 地图操作相关函数
  const mapOperations = {
    // 平滑放大
    smoothZoomIn() {
      if (!viewer.value) return;

      const cameraPos = viewer.value.camera.position;
      const ellipsoid = viewer.value.scene.globe.ellipsoid;
      const cartographic = ellipsoid.cartesianToCartographic(cameraPos);

      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const currentHeight = cartographic.height;
      const targetHeight = Math.max(currentHeight * 0.5, 100);

      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, targetHeight),
        duration: 1.5,
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      });
    },

    // 平滑缩小
    smoothZoomOut() {
      if (!viewer.value) return;

      const cameraPos = viewer.value.camera.position;
      const ellipsoid = viewer.value.scene.globe.ellipsoid;
      const cartographic = ellipsoid.cartesianToCartographic(cameraPos);

      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const currentHeight = cartographic.height;
      const targetHeight = Math.min(currentHeight * 2, 10000);

      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, targetHeight),
        duration: 1.5,
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      });
    },

    // 复位
    reset() {
      if (!viewer.value) return;

      const position = Cesium.Cartesian3.fromDegrees(
        userStore.initCenter.lon,
        userStore.initCenter.lat,
        CONFIG.cameraOptions.initialHeight
      );

      viewer.value.camera.flyTo({
        destination: position,
        duration: 1.5,
        easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
      });
    },
  };

  // 清理资源
  onUnmounted(() => {
    if (viewer.value) {
      viewer.value.destroy();
      viewer.value = null;
    }
  });

  return {
    viewer,
    initViewer,
    mapOperations,
  };
}
