<script setup lang="ts">
import * as echarts from "echarts";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const isShow = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emits("update:visible", val);
  },
});
const emits = defineEmits(["update:visible"]);

// 关闭对话框
const handleCloseDialog = () => {
  isShow.value = false;
};

// 预警列表，救援设备，物联设备
const activeTab = ref(1);
const handleTabClick = (val) => {
  activeTab.value = val;
};

// 水位统计图的参数设置
const chartRef = ref<HTMLElement | null>(null);
const option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
    },
  ],
};
onMounted(() => {
  // console.log("草泥马1");
  if (chartRef.value) {
    // console.log("草泥马2");
    const myChart = echarts.init(chartRef.value);
    myChart.setOption(option);
  }
});
</script>

<template>
  <div v-if="isShow" class="tunnel-warning-dialog">
    <div class="h-[50px] flex justify-between bg-[#2c6ea1]">
      <span>迎宾路北延隧道</span>
      <span @click="handleCloseDialog">X</span>
    </div>

    <!-- 站点信息 -->
    <div class="flex p-2 gap-x-4">
      <img src="@/assets/images/waterRuler.png" alt="" class="w-[90px]" />
      <div class="text-xs flex flex-col justify-between text-[#fff]">
        <div>
          <span class="text-[#B6C7D5]">积水深度：</span>
          <span>0.89m</span>
        </div>
        <div>
          <span class="text-[#B6C7D5]">水位读取时间：</span>
          <span>2024-08-09 12:23:42</span>
        </div>
        <div>
          <span class="text-[#B6C7D5]">泵站状态：</span>
          <span>关闭</span>
        </div>
        <div>
          <span class="text-[#B6C7D5]">泵站启动事时间：</span>
          <span>2024-08-08 12:23:42</span>
        </div>
        <div>
          <span class="text-[#B6C7D5]">人员数量：</span>
          <span>0</span>
        </div>
        <div>
          <span class="text-[#B6C7D5]">车辆数量：</span>
          <span>0</span>
        </div>
      </div>
    </div>

    <!-- 预警列表，救援设备，物联设备 -->
    <div class="px-2 text-[#fff]">
      <!-- tabs -->
      <div class="flex bg-[#455159] h-8 cursor-pointer">
        <div
          class="flex-1 flex-center hover:bg-[#0579c6]/50"
          :class="{ 'bg-[#0579c6]': activeTab === 1 }"
          @click="handleTabClick(1)"
        >
          预警列表
        </div>

        <div
          class="flex-1 flex-center hover:bg-[#0579c6]/50"
          :class="{ 'bg-[#0579c6]': activeTab === 2 }"
          @click="handleTabClick(2)"
        >
          救援设备
        </div>

        <div
          class="flex-1 flex-center hover:bg-[#0579c6]/50"
          :class="{ 'bg-[#0579c6]': activeTab === 3 }"
          @click="handleTabClick(3)"
        >
          物联设备
        </div>
      </div>

      <!-- 不同tab对应的内容 -->
      <!-- 1. 预警列表 -->
      <div>
        <!-- 标题 -->
        <div class="flex w-full text-center text-sm bg-[rgba(0, 144, 195,0.3)]">
          <div class="w-1/5 py-1">预警等级</div>
          <div class="w-2/5 py-1">预警时间</div>
          <div class="w-1/5 py-1">状态</div>
          <div class="w-1/5 py-1">操作</div>
        </div>
        <!-- 内容 -->
        <div v-for="i in 5" class="flex w-full text-center text-xs py-2 text-[#B6C7D5]">
          <div class="w-1/5">半小时预警</div>
          <div class="w-2/5">2023-12-22 14:35:00</div>
          <div class="w-1/5">
            <!-- <span class="text-[#f00] " v-if="row.status === 0">待审核</span> -->
            <!-- <span class="text-[#00BAFF] " v-if="row.status === 1">处理中</span> -->
            <span class="text-[#0CFF00]">处理完成</span>
          </div>
          <div class="w-1/5 cursor-pointer">详情</div>
        </div>
      </div>
      <!-- 2. 救援设备 -->
      <!-- 3. 物联设备 -->
    </div>

    <!-- 水位统计曲线图 -->
    <div id="water-statistics" ref="chartRef" class="w-full h-[230px]"></div>
  </div>
</template>

<style lang="scss" scoped>
.tunnel-warning-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 440px;
  height: 720px;
  background-color: #313f4a;
  transform: translate(-50%, -50%);
}
</style>
