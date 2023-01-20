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
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          type: 'bar',
          data: [78],
          color: 'cyan',
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          label: {
            show: true
          },
          barWidth: 10
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
