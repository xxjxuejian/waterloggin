<script setup lang="ts">
import zoomIn from "@/assets/images/zoomIn.png";
import zoomOut from "@/assets/images/zoomOut.png";
import reset from "@/assets/images/reset.png";
import layer from "@/assets/images/layer.png";
import measure from "@/assets/images/measure.png";

import { LayerType } from "@/enums/index.ts";

import { useCesiumStore } from "@/store/modules/cesium.store.ts";
import { useMeasureStore } from "@/store/modules/measure.store.ts";

const cesiumStore = useCesiumStore();
const measureStore = useMeasureStore();

// 从 store 中提取属性时需要保持其响应性，需要使用 storeToRefs()，使用要加.value
// 直接从 store 中解构 action，不需要使用storeToRefs()
const { viewer, currentLayerType } = storeToRefs(cesiumStore);
const { mapOperations, switchLayer } = cesiumStore;

const handleZoomIn = () => {
  if (!viewer.value) {
    console.warn("Viewer is not initialized yet");
    return;
  }
  mapOperations.smoothZoomIn();
};

const handleZoomOut = () => {
  if (!viewer.value) {
    console.warn("Viewer is not initialized yet");
    return;
  }
  mapOperations.smoothZoomOut();
};

const handleReset = () => {
  if (!viewer.value) {
    console.warn("Viewer is not initialized yet");
    return;
  }
  mapOperations.reset();
};

const handleSwitchLayer = (type: LayerType) => {
  switchLayer(type);
};

// 测量距离
const handleMeasureDistance = () => {
  console.log("开始进行距离测量");
  measureStore.startMeasure("distance");
};
</script>

<template>
  <div class="toolbar">
    <div
      class="h-full w-[40px] flex-center cursor-pointer hover:bg-[#19a2e8]/10 rounded-md"
      @click="handleZoomIn"
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

    <div
      class="h-full w-[40px] flex-center cursor-pointer hover:bg-[#19a2e8]/10 rounded-md"
      @click="handleReset"
    >
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
            <div
              class="p-2 cursor-pointer rounded hover:bg-[#19a2e8]/80"
              :class="{ 'bg-[#19a2e8]/80': currentLayerType === LayerType.IMAGE }"
              @click="handleSwitchLayer(LayerType.IMAGE)"
            >
              影像图
            </div>
            <div
              class="p-2 cursor-pointer rounded hover:bg-[#19a2e8]/80"
              :class="{ 'bg-[#19a2e8]/80': currentLayerType === LayerType.VECTOR }"
              @click="handleSwitchLayer(LayerType.VECTOR)"
            >
              矢量图
            </div>
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
            <div
              class="p-2 cursor-pointer rounded hover:bg-[#19a2e8]/80"
              @click="handleMeasureDistance"
            >
              测量距离
            </div>
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
