<template>
  <div class="province-selector">
    <div v-for="province in provinceList" :key="province.provinceId" class="province-button">
      <el-popover
        v-model:visible="visibleMap[province.provinceId]"
        placement="bottom"
        trigger="click"
      >
        <!-- 弹出框内容：市级复选框列表 -->
        <div v-for="city in province.cities" :key="city.cityId">
          <el-checkbox
            v-model="checkedCitiesMap[province.provinceId][city.cityId]"
            :label="city.cityName"
            @change="onCityChange(province.provinceId)"
          />
        </div>

        <!-- 按钮触发区域 -->
        <template #reference>
          <el-button @click.stop>
            <el-checkbox
              v-model="provinceCheckedMap[province.provinceId]"
              :indeterminate="isIndeterminate(province.provinceId)"
              @change="onProvinceChange(province.provinceId)"
            >
              {{ province.provinceName }}
            </el-checkbox>
            <el-icon class="ml-2">
              <ArrowDown />
            </el-icon>
          </el-button>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { ElCheckbox, ElPopover, ElButton, ElIcon } from "element-plus";
import { ArrowDown } from "@element-plus/icons-vue";

// 模拟多组省份数据
const provinceList = [
  {
    provinceId: "430000",
    provinceName: "湖南省",
    cities: [
      { cityId: "430100", cityName: "长沙市" },
      { cityId: "430200", cityName: "株洲市" },
      { cityId: "430300", cityName: "湘潭市" },
    ],
  },
  {
    provinceId: "440000",
    provinceName: "广东省",
    cities: [
      { cityId: "440100", cityName: "广州市" },
      { cityId: "440300", cityName: "深圳市" },
      { cityId: "440600", cityName: "佛山市" },
    ],
  },
  {
    provinceId: "330000",
    provinceName: "浙江省",
    cities: [
      { cityId: "330100", cityName: "杭州市" },
      { cityId: "330200", cityName: "宁波市" },
      { cityId: "330300", cityName: "温州市" },
    ],
  },
];

// 控制弹出框的显示状态
// 控制每个省份弹出框是否可见
const visibleMap = reactive({});
// 记录每个省份复选框是否选中
const provinceCheckedMap = reactive({});
// 记录每个城市是否选中（按省分类）
const checkedCitiesMap = reactive({});

// 初始化各省状态
provinceList.forEach((province) => {
  visibleMap[province.provinceId] = false;
  provinceCheckedMap[province.provinceId] = false;
  checkedCitiesMap[province.provinceId] = {};
  province.cities.forEach((city) => {
    checkedCitiesMap[province.provinceId][city.cityId] = false;
  });
});

// 判断是否不确定状态
const isIndeterminate = (provinceId) => {
  const cities = Object.values(checkedCitiesMap[provinceId]);
  const selected = cities.filter(Boolean).length;
  return selected > 0 && selected < cities.length;
};

// 点击省级复选框
const onProvinceChange = (provinceId) => {
  // 先获取到这个复选框的状态，是否是选中状态，是点击以后得状态值
  const isChecked = provinceCheckedMap[provinceId];
  // 这个省下面的所有市的key
  Object.keys(checkedCitiesMap[provinceId]).forEach((cityId) => {
    checkedCitiesMap[provinceId][cityId] = isChecked;
  });
};

// 点击子项复选框
const onCityChange = (provinceId) => {
  const cityStates = Object.values(checkedCitiesMap[provinceId]);
  const allChecked = cityStates.every(Boolean);
  const noneChecked = cityStates.every((v) => !v);

  if (allChecked) {
    provinceCheckedMap[provinceId] = true;
  } else if (noneChecked) {
    provinceCheckedMap[provinceId] = false;
  } else {
    provinceCheckedMap[provinceId] = false; // 仍然 false，靠 indeterminate 控制状态
  }
};
</script>

<style scoped>
.province-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
  height: 500px;
  background-color: antiquewhite;
}

.province-button {
  display: inline-flex;
  align-items: center;
}
</style>
