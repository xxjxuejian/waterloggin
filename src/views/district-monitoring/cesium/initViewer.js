import * as Cesium from "cesium";
import { useUserStoreHook } from "@/store/modules/user.store.ts";

// 天地图token
const webKey = "ade57801997980f3af716dc86639979e";
const userStore = useUserStoreHook();
export function initViewer() {
  const viewer = new Cesium.Viewer("cesiumContainer", {
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
    // creditContainer: document.getElementById("hiddenCredit"),
    // 是否显示时间轴
    timeline: false,
    // 是否显示全屏按钮
    fullscreenButton: false,
  });

  // 添加天地图影像图层
  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url:
        "https://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&tk=" +
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
  // "https://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk="
  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url:
        "https://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&tk=" +
        webKey,
      layer: "cia",
      style: "default",
      tileMatrixSetID: "w",
      format: "tiles",
      maximumLevel: 18,
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    })
  );

  // 作用：限制相机最近只能缩放到离地表 100 米的位置，防止“钻到地下”或视角过近导致穿模
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
  // 作用：隐藏 Cesium 左下角的版权信息（数据来源、Cesium 标志等）。
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 作用：打开地球表面的“光照效果”，可以模拟太阳照明效果，让地球有“白天黑夜”变化。
  // 必须配合时间设置或者 viewer.clock 正确设置，才会看到明显的“昼夜交替”效果。
  viewer.scene.globe.enableLighting = true;
  // 作用：隐藏默认的天空盒背景（模拟星空）。
  //  说明：关闭后背景将是纯黑或透明，适用于你想用自定义背景或让地图“漂浮”在无背景场景中。
  viewer.scene.skyBox.show = false;
  // 关闭 FXAA（快速近似抗锯齿） 后处理效果。
  // Cesium 默认开启 FXAA，用于平滑锯齿边缘。
  // 在某些低性能设备上，或者你想自己处理画面抗锯齿时，可以关闭。
  viewer.scene.fxaa = false;
  viewer.scene.postProcessStages.fxaa.enabled = false;

  // 提高采样率以提高细节
  viewer.scene.globe.maximumScreenSpaceError = 5 / 3; // 默认是2
  viewer.scene.globe.tileCacheSize = 1000; // 增加缓存大小
  viewer.scene.fog.enabled = false; // 禁用雾化效果，增强图像清晰度

  let layer = viewer.scene.imageryLayers.get(0);
  // 改变当前地图的组织结构
  layer.minificationFilter = Cesium.TextureMinificationFilter.NEAREST;
  layer.magnificationFilter = Cesium.TextureMagnificationFilter.NEAREST;

  let position = Cesium.Cartesian3.fromDegrees(
    userStore.initCenter.lon,
    userStore.initCenter.lat,
    4000
  );

  //   立即定位，❌ 无动画	快速跳转
  viewer.camera.setView({
    // 指定相机位置
    destination: position,
    // 指定相机视角
    // orientation: {
    //   // 指定相机的朝向,偏航角
    //   heading: Cesium.Math.toRadians(20),
    //   // 指定相机的俯仰角,0度是竖直向上,-90度是向下
    //   pitch: Cesium.Math.toRadians(-20),
    //   // 指定相机的滚转角,翻滚角
    //   roll: 0
    // }
  });

  //   flyTo有动画，让相机平滑飞行到指定位置
  // viewer.camera.flyTo({
  //   destination: position,
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0), // 朝北
  //     pitch: Cesium.Math.toRadians(-45), // 向下看 45 度
  //     roll: 0,
  //   },
  //   duration: 3, // 飞行时间（秒），可省略，默认约为 3 秒
  // });

  return viewer;
}
