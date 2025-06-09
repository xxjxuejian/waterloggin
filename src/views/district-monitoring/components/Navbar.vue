<script setup>
import { usePermissionStoreHook } from "@/store/modules/permission.store.ts";
import router from "@/router";

const permissionStore = usePermissionStoreHook();
const time = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
const goAdminSystem = () => {
  console.log("teshi", permissionStore.adminEntryRoute);
  router.push(permissionStore.adminEntryRoute);
};

const tabs = ref([
  { type: 0, name: "监测预警" },
  { type: 1, name: "风险隐患" },
  { type: 2, name: "内涝模拟" },
]);
const activeTab = ref(0);
const handleChangeTab = (type) => {
  activeTab.value = type;
};
</script>

<template>
  <div class="navbar">
    <div class="left title_shadow font-title relative h-full flex items-center">
      <img src="@/assets/images/line.png" class="absolute top-7 -left-10" alt="" />
      <div class="text-white pl-20 text-3xl tracking-[5px]">临平项目</div>
    </div>
    <div
      class="tabs flex-center gap-x-32 h-full text-[#8DBFEE] text-lg font-semibold tracking-wide"
    >
      <div
        v-for="tab in tabs"
        :key="tab.type"
        class="tab w-[138px] h-[40px] flex-center cursor-pointer"
        :class="{ active: activeTab === tab.type }"
        @click="handleChangeTab(tab.type)"
      >
        {{ tab.name }}
      </div>
    </div>
    <div class="right flex justify-end items-center pr-5">
      <div class="text-[white] font-bold text-xl mr-10 title_shadow">{{ time }}</div>
      <div class="w-[1px] h-7 bg-[#9EC5E7]/80 mr-10"></div>
      <el-popover placement="bottom" trigger="click" :teleported="false" width="100">
        <template #default>
          <div class="flex flex-col text-[#fff] bg-[#001736]/80">
            <div
              class="cursor-pointer py-2 text-center hover:bg-[#8db8e9]/30"
              @click="goAdminSystem"
            >
              后台管理
            </div>
            <div
              class="cursor-pointer py-2 text-center hover:bg-[#8db8e9]/30"
              @click="goAdminSystem"
            >
              系统设置
            </div>
          </div>
        </template>

        <template #reference>
          <img src="@/assets/images/user.png" alt="" />
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  position: absolute;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  width: 100%;
  height: $navbar-height;
  background-image: url("@/assets/images/topBar.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .left {
    width: 500px;
    // font-family:
  }
  .tabs {
    flex: 1;
  }
  .right {
    width: 500px;
    height: 100%;

    :deep(.el-popover) {
      padding: 0;
      overflow: hidden;
      border: 1px solid #8db8e9;
      border-radius: 5px;
    }
  }
}

.title_shadow {
  text-shadow:
    0 0 5px rgba(81, 185, 254, 0.4),
    0 0 5px rgba(81, 185, 254, 0.4),
    0 0 5px rgba(81, 185, 254, 0.4),
    0 0 5px rgba(81, 185, 254, 0.4);
}

.active {
  color: white;
  background-image: url(@/assets/images/activeType.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
