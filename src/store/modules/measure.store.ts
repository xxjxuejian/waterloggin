// src/store/modules/measure.store.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import * as Cesium from "cesium";

import { MeasureType } from "@/enums/index.ts";

export const useMeasureStore = defineStore("measure", () => {
  // 测量类型（距离/面积）
  const currentMeasureType = ref<MeasureType>(MeasureType.NONE);
  // 是否正在测量
  const isMeasuring = ref(false);
  // 测量点集合
  const measurePoints = ref<Cesium.Cartesian3[]>([]);
  // 测量实体（线、面等）
  const measureEntities = ref<Cesium.Entity[]>([]);

  // 开始测量
  const startMeasure = (type: MeasureType) => {
    currentMeasureType.value = type;
    isMeasuring.value = true;
    measurePoints.value = [];
    measureEntities.value = [];
  };

  // 结束测量
  const endMeasure = () => {
    currentMeasureType.value = MeasureType.NONE;
    isMeasuring.value = false;
  };

  // 清除测量
  const clearMeasure = () => {
    measurePoints.value = [];
    measureEntities.value = [];
  };

  return {
    currentMeasureType,
    isMeasuring,
    measurePoints,
    measureEntities,
    startMeasure,
    endMeasure,
    clearMeasure,
  };
});
