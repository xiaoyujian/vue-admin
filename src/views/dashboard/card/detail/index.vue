<template>
  <div>
    <el-card
      ><div class="header">{{ title }} <i class="el-icon-info"></i></div>
      <div class="content">{{ price }}</div>
      <div class="charts"><slot name="charts"></slot></div>
      <div class="footer"><slot name="footer"></slot></div
    ></el-card>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'price']
}
</script>

<style scoped>
.header {
  color: gray;
  display: flex;
  justify-content: space-between;
}
.content {
  font-size: 30px;
  padding: 10px 10px;
}
.charts {
  /* margin-top: 30px;
  margin-bottom: 10px; */
  height: 50px;
  font-size: 14px;
  text-align: center;
}
.footer {
  border-top: 1px solid #eee;
  padding-top: 10px;
}
</style>
