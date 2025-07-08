<script setup lang="ts">
import CardTitle from "@/components/CardTitle/index.vue";
import {
  getTunnelStatusApi,
  getStationListByTypeApi,
} from "@/api/bigScreen/monitoringWarning/monitoringTunnel.ts";

import { useCesiumStore } from "@/store/modules/cesium.store.ts";
import { useCesiumEntities } from "@/composables/useCesiumEntities";

const cesiumStore = useCesiumStore();
const { addTunnelEntities, showTunnelByStatus, showAllTunnel } = useCesiumEntities();

const { viewer } = storeToRefs(cesiumStore);

function getTunnelStatus() {
  getTunnelStatusApi().then((res: any) => {
    console.log("告警统计", res);
    const data = res.data;

    data["limitAlarm"] = 2;
    data["waterLevelWarn"] = 3;
    data["reportAlarm"] = 5;
    data["normal"] = 10;

    Object.keys(data).forEach((key) => {
      tunnels.value[key].count = data[key];
    });
  });
}
getTunnelStatus();

// 所有的隧道列表
// statusSec 站点状态 下沉地道对应 1超限预警 2半小时预警 3一小时预警 0正常
const tunnelList = ref([]);
// 四种类型

// const warning
// typeId: 1: 获取所有积水点。 2: 获取所有下沉地道/隧道列表   3: 获取所有 气象监测站
function getStationList(typeId = 2) {
  getStationListByTypeApi(typeId).then((res: any) => {
    // console.log("下沉隧道列表", res);
    tunnelList.value = res.data;
    // 超限：2个； 半小时：3个， 一小时：5个； 正常： 10个
    mockData(tunnelList.value);
    console.log("下沉隧道列表", tunnelList.value);
    addTunnelEntities(viewer.value, tunnelList.value);
  });
}
getStationList(2);

// 模拟隧道数据
function mockData(data: Array<any>) {
  // 超限预警
  for (let i = 0; i < 2; i++) {
    data[i].statusSec = 1;
  }
  // 半小时预警
  for (let i = 2; i < 5; i++) {
    data[i].statusSec = 2;
  }
  // 一小时预警
  for (let i = 5; i < 10; i++) {
    data[i].statusSec = 3;
  }
}

/*
  1. 获取到所有的隧道站点数据，
  2. 过滤获取上面这些数据中的预警站点

*/

import redWarning from "@/assets/images/redWarning.png";
import orangeWarning from "@/assets/images/orangeWarning.png";
import yellowWarning from "@/assets/images/yellowWarning.png";
import greenNormal from "@/assets/images/greenNormal.png";

const tunnels = ref<any>({
  limitAlarm: {
    src: redWarning,
    clickColor: "#FF7474",
    count: 0,
    text: "超限告警",
    statusCode: 1,
  },
  waterLevelWarn: {
    src: orangeWarning,
    clickColor: "#ff5a00",
    count: 0,
    text: "水位预警",
    statusCode: 2,
  },
  reportAlarm: {
    src: yellowWarning,
    clickColor: "#ff8a00",
    count: 0,
    text: "上报告警",
    statusCode: 3,
  },
  normal: {
    src: greenNormal,
    clickColor: "#99FF94",
    count: 0,
    text: "正常",
    statusCode: 0,
  },
});

const activeCard = ref<string>("");
const activeColor = ref<string>("#fff");

// 点击不同的告警卡片
const handleCardClick = (key: string) => {
  const clickCard = tunnels.value[key];
  console.log("点击的card", clickCard);
  // 如果当前active的card和点击的是同一个，就取消active状态，然后显示所有状态的下沉隧道，即全部的下沉隧道
  if (activeCard.value === key) {
    activeCard.value = "";
    activeColor.value = "#fff";
    //显示所有站点
    showAllTunnel(viewer.value);
    return;
  }
  // 设置activeCard的值
  activeCard.value = key;
  // 设置activeCard的激活时颜色
  activeColor.value = clickCard.clickColor;
  // 显示与card状态一致的下沉隧道
  // 添加地图标记物
  const statusSec = clickCard.statusCode;
  showTunnelByStatus(viewer.value, statusSec);
};
</script>

<template>
  <div class="tunnel-card">
    <CardTitle title="告警统计"></CardTitle>

    <div class="flex flex-wrap justify-between gap-y-1">
      <!--  :style="activeCard === key ? { color: value.clickColor } : {}" -->
      <div
        v-for="(value, key) in tunnels"
        :key="key"
        class="tunnel-item"
        :class="{ active: activeCard === key }"
        @click="handleCardClick(key)"
      >
        <div class="count font-count">{{ value.count }}</div>
        <div class="text">{{ value.text }}</div>
        <img :src="value.src" alt="" class="w-full h-full" />
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
    color: #fff;
    cursor: pointer;
    transition: all 0.5s;

    &.active {
      color: v-bind(activeColor);
      transform: scale(1.1);
    }

    .count {
      position: absolute;
      top: 0;
      left: 50%;
      font-size: 32px;
      transform: translateX(-50%);
    }

    .text {
      position: absolute;
      top: 45px;
      left: 50%;
      font-size: 14px;
      transform: translateX(-50%);
    }
  }
}
</style>
