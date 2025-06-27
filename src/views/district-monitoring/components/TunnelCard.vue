<script setup lang="ts">
import CardTitle from "@/components/CardTitle/index.vue";
// import { getTunnelStatusApi } from "@/api/bigScreen/monitoringWarning";

import redWarning from "@/assets/images/redWarning.png";
</script>

<template>
  <div class="tunnel-card">
    <CardTitle title="告警统计"></CardTitle>

    <div class="flex flex-wrap justify-between">
      <div class="w-[130px] h-[100px] relative">
        <!-- <div class="absolute bg-red-100 left-1/2 transform -translate-x-1/2">0</div>
        <div class="absolute bg-red-100 left-1/2 transform -translate-x-1/2">超限告警</div> -->
        <img :src="redWarning" alt="" class="w-full h-full" />
      </div>

      <div class="w-[130px] h-[100px] relative">
        <img :src="redWarning" alt="" class="w-full h-full" />
      </div>

      <div class="w-[130px] h-[100px] relative">
        <img :src="redWarning" alt="" class="w-full h-full" />
      </div>

      <div class="w-[130px] h-[100px] relative">
        <img :src="redWarning" alt="" class="w-full h-full" />
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
}
</style>
