<script setup>
import * as Cesium from "cesium";
import zoomIn from "@/assets/images/zoomIn.png";
import zoomOut from "@/assets/images/zoomOut.png";
import reset from "@/assets/images/reset.png";
import layer from "@/assets/images/layer.png";
import measure from "@/assets/images/measure.png";

// 从父组件注入 viewer 实例,获取的也是响应式数据
const viewer = inject("cesiumViewer");

const handleSmoothZoomIn = () => {
  // 获取当前相机的位置，是一个三维直角坐标（Cartesian3），单位是米，表示在地心坐标系中的位置。
  const cameraPos = viewer.value.camera.position;
  // 获取当前地球使用的椭球体模型（一般是 WGS84），用于执行地理坐标与三维坐标的相互转换。
  const ellipsoid = viewer.value.scene.globe.ellipsoid;
  // 将三维直角坐标转换为地理坐标,cartesian:笛卡尔坐标,cartographic:地理坐标
  // cartographic:  longitude: 经度（单位是弧度）,latitude: 纬度（单位是弧度）,height: 高度（单位是米）
  const cartographic = ellipsoid.cartesianToCartographic(cameraPos);

  // 将经纬度从弧度转换为度，方便传给 fromDegrees() 来创建目标坐标点。
  const lon = Cesium.Math.toDegrees(cartographic.longitude);
  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  // 当前相机的高度，单位是米。
  const currentHeight = cartographic.height;
  // 放大 2 倍，最小高度限制
  const targetHeight = Math.max(currentHeight * 0.5, 100); // 放大 2 倍，最小高度限制

  // 平滑缩放,让相机飞行到目标位置：
  viewer.value.camera.flyTo({
    // destination: 目标位置的笛卡尔坐标,fromDegrees: 将经纬度转换为笛卡尔坐标
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, targetHeight),
    // 飞行时间，单位是秒
    duration: 1.5,
    // 缓动函数，用于平滑过渡
    easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
  });
};

const handleZoomOut = () => {
  const cameraPos = viewer.value.camera.position;
  const ellipsoid = viewer.value.scene.globe.ellipsoid;
  const cartographic = ellipsoid.cartesianToCartographic(cameraPos);

  const lon = Cesium.Math.toDegrees(cartographic.longitude);
  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  const currentHeight = cartographic.height;

  const targetHeight = Math.min(currentHeight * 2, 10000); // 缩小 2 倍，最大高度限制

  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, targetHeight),
    duration: 1.5,
    easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
  });
};
</script>

<template>
  <div class="toolbar">
    <div
      class="h-full w-[40px] flex-center cursor-pointer hover:bg-[#19a2e8]/10 rounded-md"
      @click="handleSmoothZoomIn"
    >
      <el-tooltip effect="dark" content="放大" placement="bottom">
        <template #default>
          <img :src="zoomIn" class="w-[26px] h-[26px]" />
        </template>
      </el-tooltip>
    </div>

    <div
      class="h-full w-[40px] flex-center cursor-pointer hover:bg-[#19a2e8]/10 rounded-md"
      @click="handleZoomOut"
    >
      <el-tooltip effect="dark" content="缩小" placement="bottom">
        <template #default>
          <img :src="zoomOut" class="w-[26px] h-[26px]" />
        </template>
      </el-tooltip>
    </div>

    <div class="h-full w-[40px] flex-center cursor-pointer hover:bg-[#19a2e8]/10 rounded-md">
      <el-tooltip effect="dark" content="复位" placement="bottom">
        <template #default>
          <img :src="reset" class="w-[26px] h-[26px]" />
        </template>
      </el-tooltip>
    </div>

    <div class="h-full w-[40px] flex-center cursor-pointer hover:bg-[#19a2e8]/10 rounded-md">
      <el-tooltip effect="dark" placement="bottom">
        <template #default>
          <img :src="layer" class="w-[26px] h-[26px]" />
        </template>

        <template #content>
          <div class="">
            <div class="p-2 cursor-pointer rounded hover:bg-[#19a2e8]/80">影像图</div>
            <div class="p-2 cursor-pointer rounded hover:bg-[#19a2e8]/80">矢量图</div>
          </div>
        </template>
      </el-tooltip>
    </div>

    <div class="h-full w-[40px] flex-center cursor-pointer hover:bg-[#19a2e8]/10 rounded-md">
      <el-tooltip effect="dark" placement="bottom" popper-class="measure-tooltip">
        <template #default>
          <img :src="measure" class="w-[26px] h-[26px]" />
        </template>

        <template #content>
          <div class="">
            <div class="p-2 cursor-pointer rounded hover:bg-[#19a2e8]/80">测量距离</div>
            <div class="p-2 cursor-pointer rounded hover:bg-[#19a2e8]/80">测量面积</div>
          </div>
        </template>
      </el-tooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  position: absolute;
  top: $navbar-height;
  left: 100px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  height: 40px;
  background-color: rgb(5 16 28 / 0.8);
  border-radius: 6px;
}
</style>
