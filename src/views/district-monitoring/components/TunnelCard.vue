<script setup lang="ts">
import CardTitle from "@/components/CardTitle/index.vue";
import {
  getTunnelStatusApi,
  getStationListByTypeApi,
} from "@/api/bigScreen/monitoringWarning/monitoringTunnel.ts";

function getTunnelStatus() {
  getTunnelStatusApi().then((res: any) => {
    console.log("隧道状态", res);
  });
}
getTunnelStatus();

function getStationList(typeId = 1) {
  getStationListByTypeApi(typeId).then((res: any) => {
    console.log("站点列表", res);
  });
}
getStationList(2);

// import redWarning from "@/assets/images/redWarning.png";
// import orangeWarning from "@/assets/images/orangeWarning.png";
// import yellowWarning from "@/assets/images/yellowWarning.png";
// import greenNormal from "@/assets/images/greenNormal.png";

// const tunnels = ref({
//   limitAlarm: {
//     src: "@/assets/images/redWarning.png",
//     clickColor: "#FF7474",
//     count: 0,
//     text: "超限告警",
//   },
//   waterLevelWarn: {
//     src: "@/assets/images/orangeWarning.png",
//     clickColor: "#ff5a00",
//     count: 0,
//     text: "水位预警",
//   },
//   reportAlarm: {
//     src: "@/assets/images/yellowWarning.png",
//     clickColor: "#ff8a00",
//     count: 0,
//     text: "上报告警",
//   },
//   normal: {
//     src: "@/assets/images/greenNormal.png",
//     clickColor: "#99FF94",
//     count: 0,
//     text: "正常",
//   },
// });
</script>

<template>
  <div class="tunnel-card">
    <CardTitle title="告警统计"></CardTitle>

    <div class="flex flex-wrap justify-between gap-y-1">
      <div class="tunnel-item">
        <div class="count font-count">0</div>
        <div class="text">超限告警</div>
        <img src="@/assets/images/redWarning.png" alt="" class="w-full h-full" />
      </div>

      <div class="tunnel-item">
        <div class="count font-count">0</div>
        <div class="text">超限告警</div>
        <img src="@/assets/images/orangeWarning.png" alt="" class="w-full h-full" />
      </div>

      <div class="tunnel-item">
        <div class="count font-count">0</div>
        <div class="text">超限告警</div>
        <img src="@/assets/images/yellowWarning.png" alt="" class="w-full h-full" />
      </div>

      <div class="tunnel-item">
        <div class="count font-count">0</div>
        <div class="text">超限告警</div>
        <img src="@/assets/images/greenNormal.png" alt="" class="w-full h-full" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tunnel-card {
  position: absolute;
  top: 70px;
  left: 10px;
  z-index: 10;
  width: 340px;
  height: 30%;
  padding: 16px;
  overflow: hidden;
  background-color: rgba(5, 16, 28, 0.8);
  border-radius: 12px;

  .tunnel-item {
    position: relative;
    width: 130px;
    height: 100px;

    .count {
      position: absolute;
      top: 0;
      left: 50%;
      font-size: 32px;
      color: #fff;
      transform: translateX(-50%);
    }

    .text {
      position: absolute;
      top: 45px;
      left: 50%;
      font-size: 14px;
      color: #fff;
      transform: translateX(-50%);
    }
  }
}
</style>
