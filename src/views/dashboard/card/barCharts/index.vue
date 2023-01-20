<template>
  <div ref="bar" class="bar"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Bar',
  mounted() {
    const barCharts = echarts.init(this.$refs.bar)
    barCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [16, 27, 3, 89, 23, 54, 23, 17],
          color: 'skyblue'
        }
      ],
      grid: {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>
