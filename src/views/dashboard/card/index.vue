<template>
  <div>
    <el-row>
      <el-col :span="6"
        ><Detail :title="'总销售额'" :price="'￥126560'">
          <template #charts> <span>周同比 56.67%</span> <i class="el-icon-caret-top" style="color: red"></i>日同比 19.16% <i class="el-icon-caret-bottom" style="color: green"></i></template>
          <template #footer> <span>日销售额￥12432</span> </template>
        </Detail></el-col
      >
      <el-col :span="6"
        ><Detail :title="'访问量'" :price="'26560'">
          <template #charts> <LineCharts></LineCharts></template>
          <template #footer> <span>日销访问量 1234</span> </template></Detail
        ></el-col
      >
      <el-col :span="6"
        ><Detail :title="'支付笔数'" :price="'26560'">
          <template #charts> <BarCharts></BarCharts> </template>
          <template #footer> <span>转化率 65%</span> </template></Detail
        ></el-col
      >
      <el-col :span="6"
        ><Detail :title="'运营活动效果'" :price="'78%'">
          <template #charts> <Progress></Progress></template>
          <template #footer> <span>周同比 12%</span> <i class="el-icon-caret-top" style="color: red"></i>日同比 11% <i class="el-icon-caret-bottom" style="color: green"></i> </template></Detail
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './detail/index'
import LineCharts from './lineCharts/index.vue'
import BarCharts from './barCharts/index.vue'
import Progress from './progressCharts/index.vue'

export default {
  name: 'Card',
  components: {
    Detail,
    LineCharts,
    BarCharts,
    Progress
  }
}
</script>

<style></style>
