<script setup lang="ts">
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
</script>

<template>
  <div v-if="isShow" class="tunnel-warning-dialog">
    <div class="h-[50px] flex justify-between bg-[#2c6ea1]">
      <span>迎宾路北延隧道</span>
      <span @click="handleCloseDialog">X</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tunnel-warning-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 440px;
  height: 720px;
  padding: 4px;
  background-color: #313f4a;
  transform: translate(-50%, -50%);
}
</style>
