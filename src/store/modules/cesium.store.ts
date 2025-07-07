import { defineStore } from "pinia";
import { pinia } from "@/store";
import * as Cesium from "cesium";

import { LayerType } from "@/enums/index.ts";

import { useUserStoreHook } from "@/store/modules/user.store.ts";
const userStore = useUserStoreHook();
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
    infoBox: false, // 禁用默认弹窗
    selectionIndicator: false, // 禁用蓝色聚焦框
  },
  cameraOptions: {
    minimumZoomDistance: 100,
    initialHeight: 4000,
  },
  // 图层配置
  layers: {
    [LayerType.VECTOR]: {
      url: "https://t0.tianditu.gov.cn/vec_w/wmts",
      layer: "vec",
      style: "default",
    },
    [LayerType.IMAGE]: {
      url: "https://t0.tianditu.gov.cn/img_w/wmts",
      layer: "img",
      style: "default",
    },
    [LayerType.VECTOR_LABEL]: {
      url: "https://t0.tianditu.gov.cn/cva_w/wmts",
      layer: "cva",
      style: "default",
    },
    [LayerType.IMAGE_LABEL]: {
      url: "https://t0.tianditu.gov.cn/cia_w/wmts",
      layer: "cia",
      style: "default",
    },
  },
};

export const useCesiumStore = defineStore("cesium", () => {
  const viewer = ref<Cesium.Viewer | null>(null);
  // 当前图层类型
  const currentLayerType = ref<LayerType>(LayerType.VECTOR);

  // 创建图层的方法,参数是指定类型的图层，返回值是Cesium.ImageryLayer
  const createLayer = (type: LayerType): Cesium.ImageryLayer => {
    const layerConfig = CONFIG.layers[type];
    // 先创建provider
    const provider = new Cesium.WebMapTileServiceImageryProvider({
      url: `${layerConfig.url}?service=wmts&request=GetTile&version=1.0.0&LAYER=${layerConfig.layer}&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=${layerConfig.style}&tk=${CONFIG.webKey}`,
      layer: layerConfig.layer,
      style: layerConfig.style,
      tileMatrixSetID: "w",
      format: "tiles",
      maximumLevel: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    });
    // 在使用provider创建layer
    const imageryLayer = new Cesium.ImageryLayer(provider);

    return imageryLayer;
  };

  // 初始化地图图层
  const initMapLayers = (viewer: Cesium.Viewer) => {
    // 清除所有图层
    viewer.imageryLayers.removeAll();

    // 添加天地图矢量图层
    const vectorLayer = createLayer(LayerType.VECTOR);
    viewer.imageryLayers.add(vectorLayer);

    // 添加天地图矢量注记
    const vectorLabelLayer = createLayer(LayerType.VECTOR_LABEL);
    viewer.imageryLayers.add(vectorLabelLayer);
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

  // 切换图层
  const switchLayer = (type: LayerType) => {
    console.log("尝试切换图层", type, currentLayerType.value);
    if (!viewer.value) return;

    // 如果切换的是当前图层，不做任何操作
    if (type === currentLayerType.value) return;

    // 清除所有图层
    viewer.value.imageryLayers.removeAll();

    // 根据类型添加新图层
    if (type === LayerType.VECTOR) {
      const vectorLayer = createLayer(LayerType.VECTOR);
      viewer.value.imageryLayers.add(vectorLayer);
      // layerInstances.value.set(LayerType.VECTOR, vectorLayer);

      const vectorLabelLayer = createLayer(LayerType.VECTOR_LABEL);
      viewer.value.imageryLayers.add(vectorLabelLayer);
      // layerInstances.value.set(LayerType.VECTOR_LABEL, vectorLabelLayer);
    } else if (type === LayerType.IMAGE) {
      const imageLayer = createLayer(LayerType.IMAGE);
      viewer.value.imageryLayers.add(imageLayer);
      // layerInstances.value.set(LayerType.IMAGE, imageLayer);

      const imageLabelLayer = createLayer(LayerType.IMAGE_LABEL);
      viewer.value.imageryLayers.add(imageLabelLayer);
      // layerInstances.value.set(LayerType.IMAGE_LABEL, imageLabelLayer);
    }

    // 更新当前图层类型
    currentLayerType.value = type;
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
  const destroyViewer = () => {
    if (viewer.value) {
      viewer.value.destroy();
      viewer.value = null;
    }
  };

  return {
    viewer,
    currentLayerType,
    initViewer,
    createLayer,
    switchLayer,
    mapOperations,
    destroyViewer,
  };
});

export function useCesiumStoreHook() {
  return useCesiumStore(pinia);
}
