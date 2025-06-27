<template>
  <div>
    <div class="card-title font-ysbth">
      <div class="tracking-wide">{{ title }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "卡片标题",
  },
});
</script>

<style scoped>
.card-title {
  width: 100%;
  height: 30px;
  padding-left: 32px;
  font-size: 20px;
  line-height: 18px;
  color: #f2feff;
  text-shadow:
    0 0 5px rgba(81, 185, 254, 0.3),
    0 0 5px rgba(81, 185, 254, 0.3),
    0 0 5px rgba(81, 185, 254, 0.3),
    0 0 5px rgba(81, 185, 254, 0.3);
  background-image: url(/images/card_title_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
