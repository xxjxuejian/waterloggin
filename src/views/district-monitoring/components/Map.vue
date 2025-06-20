<script setup lang="ts">
import * as Cesium from "cesium";
import { Ion } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useCesiumStore } from "@/store/modules/cesium.store.ts";
import { useMeasureStore } from "@/store/modules/measure.store.ts";

import Toolbar from "./Toolbar.vue";

const cesiumStore = useCesiumStore();
const measureStore = useMeasureStore();

// The URL on your server where CesiumJS's static files are hosted.
window.CESIUM_BASE_URL = "/Static/Cesium";
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2MmJlY2YxZS0xZWQ1LTRiNGItYjBlNy1iNmMwYTVjMzNiYzYiLCJpZCI6MjQ3NTIyLCJpYXQiOjE3MzIwMDE2MjB9.r2CklVFhmGaQxjLV1Spscr1WO_BBaOuRAnyeybN4QiE";

onMounted(() => {
  cesiumStore.initViewer("cesiumContainer");
});

// 测量功能实现，需要监听地图的点击事件
let handler: Cesium.ScreenSpaceEventHandler | null = null;
watch(
  () => measureStore.isMeasuring,
  (isMeasuring) => {
    console.log("measure", isMeasuring, measureStore.currentMeasureType);
    if (isMeasuring && measureStore.currentMeasureType === "distance") {
      startDistanceMeasure();
    } else {
      stopDistanceMeasure();
    }
  }
);

// let moveLineEntity: Cesium.Entity | null = null;

function startDistanceMeasure() {
  const viewer = cesiumStore.viewer;
  if (!viewer) return;
  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  // 监听左键点击
  handler.setInputAction((movement) => {
    const pos = movement.position;
    const cartesian = viewer.scene.pickPosition(pos);
    console.log("点击位置笛卡尔坐标", cartesian);

    //  单击添加点实体
    viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    // measureStore.measurePoints.push(pointEntity);

    // 创建实时变化的线
    viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          if (cartesian && currentMousePos) {
            return [cartesian, currentMousePos];
          } else {
            return [];
          }
        }, false),
        width: 2,
        material: Cesium.Color.YELLOW,
      },
    });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 鼠标移动时更新 currentMousePos
  let currentMousePos: Cesium.Cartesian3 | null = null;
  handler.setInputAction((movement) => {
    const endPos = movement.endPosition;
    const cartesian = viewer.scene.pickPosition(endPos);
    if (cartesian) {
      currentMousePos = cartesian;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // 双击结束
  handler.setInputAction(() => {
    finishMeasure();
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

function stopDistanceMeasure() {
  if (handler) {
    handler.destroy();
    handler = null;
  }
  // 清理临时线等
}

// drawMeasureLine
// function drawMeasureLine(tempPoint?: Cesium.Cartesian3) {
//   const viewer = cesiumStore.viewer.value;
//   if (!viewer) return;
//   // 清除旧的entity
//   measureStore.measureEntities.forEach((e) => viewer.entities.remove(e));
//   measureStore.measureEntities.length = 0;

//   const points = [...measureStore.measurePoints];
//   if (tempPoint) points.push(tempPoint);

//   if (points.length < 2) return;

//   const polyline = viewer.entities.add({
//     polyline: {
//       positions: points,
//       width: 3,
//       material: Cesium.Color.YELLOW,
//     },
//   });
//   measureStore.measureEntities.push(polyline);

//   // 计算距离并显示
//   if (!tempPoint) {
//     const distance = calcDistance(measureStore.measurePoints);
//     // 你可以用label显示distance
//   }
// }

function finishMeasure() {
  measureStore.endMeasure();
  stopDistanceMeasure();
  // 可以在这里显示最终距离
}

// function calcDistance(points: Cesium.Cartesian3[]) {
//   let total = 0;
//   for (let i = 1; i < points.length; i++) {
//     total += Cesium.Cartesian3.distance(points[i - 1], points[i]);
//   }
//   return total;
// }
</script>

<template>
  <div
    id="cesiumContainer"
    class="main-content"
    :class="{ 'crosshair-cursor': measureStore.isMeasuring }"
  >
    <Toolbar></Toolbar>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  position: relative;
  //   display: flow-root;
  width: 100%;
  height: 100vh;
}

.crosshair-cursor {
  cursor: crosshair !important;
}
</style>
