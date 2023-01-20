<template>
  <div ref="bar" class="bar"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'Bar',
  props: ['title'],
  data() {
    return {
      barCharts: null
    }
  },
  computed: {
    maintitle() {
      return this.title === 'first' ? '销售额趋势' : '访问量趋势'
    },
    newdata() {
      return this.title === 'first' ? [10, 52, 200, 334, 390, 330, 220, 23, 54, 453, 222, 43] : [43, 222, 123, 123, 434, 231, 232, 121, 543, 23, 12, 354]
    }
  },
  watch: {
    title() {
      this.barCharts.setOption({
        title: {
          text: this.maintitle
        },
        series: {
          data: this.newdata
        }
      })
    }
  },
  mounted() {
    this.barCharts = echarts.init(this.$refs.bar)
    this.barCharts.setOption({
      title: {
        text: `销售额趋势`
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 23, 54, 453, 222, 43]
        }
      ]
    })
  }
}
</script>

<style>
.bar {
  width: 100%;
  height: 100%;
}
</style>
