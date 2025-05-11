<script setup>
const provinceList = ref([
  {
    provinceId: "130000",
    provinceName: "河北省",
    isSelected: false,
    isIndeterminate: false,
    childList: [],
  },
  {
    provinceId: "430000",
    provinceName: "湖南省",
    isSelected: false,
    isIndeterminate: false,
    childList: [],
  },
  {
    provinceId: "310000",
    provinceName: "上海市",
    isSelected: false,
    isIndeterminate: false,
    childList: [],
  },
]);

const cities = {
  130000: [
    { cityId: "130100", cityName: "石家庄市", isSelected: false },
    { cityId: "130200", cityName: "唐山市", isSelected: false },
    { cityId: "130300", cityName: "秦皇岛市", isSelected: false },
  ],
  430000: [
    { cityId: "430100", cityName: "长沙市", isSelected: false },
    { cityId: "430200", cityName: "株洲市", isSelected: false },
    { cityId: "430300", cityName: "湘潭市", isSelected: false },
  ],
  310000: [{ cityId: "310100", cityName: "上海市辖区", isSelected: false }],
};

// 加载数据
const loadData = (id) => {
  const curProvince = provinceList.value.find((item) => item.provinceId === id);
  if (curProvince) {
    if (curProvince.childList.length > 0) {
      return;
    } else {
      curProvince.childList = [...cities[id]];
    }
  }
};

// 省份按钮点击
const onProvinceChange = (curObj) => {
  const isChecked = curObj.isSelected;
  if (curObj.childList.length === 0) {
    loadData(curObj.provinceId);
  }
  // console.log(curObj.provinceName, isChecked);
  // 修改所有市级的复选框
  curObj.childList.forEach((city) => {
    city.isSelected = isChecked;
    // console.log(city.cityName, city.isSelected);
  });
  // 省级点击时应取消不确定状态
  curObj.isIndeterminate = false;
};

// 市级点击
const onCityChange = (province) => {
  // 修改当前点击的状态：点击就自动做了

  // 获取所有city的,选中状态
  const cityStates = province.childList.map((city) => city.isSelected);
  console.log(cityStates);
  const checkedCount = cityStates.filter((item) => item === true).length;
  console.log(checkedCount);
  // 中间状态： 选中的数量 > 0 && < 全部。其他都是false
  if (checkedCount > 0 && checkedCount < province.childList.length) {
    province.isIndeterminate = true;
    province.isSelected = false;
  } else if (checkedCount === province.childList.length) {
    province.isIndeterminate = false;
    province.isSelected = true;
  } else {
    province.isIndeterminate = false;
    province.isSelected = false;
  }
};
</script>

<template>
  <div class="home">
    <div v-for="(province, index) in provinceList" :key="province.provinceId">
      <el-popover
        class="box-item"
        placement="bottom"
        trigger="click"
        @before-enter="loadData(province.provinceId)"
      >
        <!-- Popover 内嵌 HTML 文本 : 市级列表-->
        <template #default>
          <div v-for="city in province.childList" :key="city.cityId">
            <el-checkbox
              v-model="city.isSelected"
              :label="city.cityName"
              @change="onCityChange(province)"
            />
          </div>
        </template>

        <!-- 触发 Popover 显示的 HTML 元素 :省份元素-->
        <template #reference>
          <el-button @click.stop>
            <el-checkbox
              v-model="province.isSelected"
              :indeterminate="province.isIndeterminate"
              @change="onProvinceChange(province)"
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

<style scoped lang="scss">
.home {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  height: 500px;
}
</style>
