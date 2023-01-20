<template>
  <div>
    <el-card>
      <div class="flex">
        <div class="tabs">
          <el-tabs v-model="activeName">
            <el-tab-pane label="销售额" name="first"></el-tab-pane>
            <el-tab-pane label="访问量" name="second"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="right">
          <span @click="setDay"><el-button>今日</el-button></span>
          <span @click="setWeek"><el-button type="">本周</el-button></span>
          <span @click="setMonth"><el-button type="">本月</el-button></span>
          <span @click="setYear"><el-button type="">本年</el-button></span>
          <el-date-picker v-model="value1" value-format="yyyy-MM-dd" type="daterange" style="margin: 0 20px; width: 300px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini"> </el-date-picker>
        </div>
      </div>
      <div>
        <el-row>
          <el-col :span="18">
            <div class="charts"><BarCharts :title="activeName"></BarCharts></div>
          </el-col>
          <el-col :span="6">
            <span>门店{{ title }}排名</span>
            <ul class="right-ul">
              <li>
                <span><h3>1</h3></span>
                <span>{{ count1 }}</span>
                <span>1234</span>
              </li>
              <li>
                <span><h3>2</h3></span>
                <span>麦当劳</span>
                <span>1204</span>
              </li>
              <li>
                <span><h3>3</h3></span>
                <span>{{ count2 }}</span>
                <span>1134</span>
              </li>
              <li>
                <span><h3>4</h3></span>
                <span>汉堡王</span>
                <span>1034</span>
              </li>
              <li>
                <span><h3>5</h3></span>
                <span>必胜客</span>
                <span>934</span>
              </li>
              <li>
                <span><h3>6</h3></span>
                <span>{{ count4 }}</span>
                <span>834</span>
              </li>
              <li>
                <span><h3>7</h3></span>
                <span>麻辣烫</span>
                <span>784</span>
              </li>
              <li>
                <span><h3>8</h3></span>
                <span>炸鸡</span>
                <span>694</span>
              </li>
              <li>
                <span><h3>9</h3></span>
                <span>{{ count3 }}</span>
                <span>684</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import BarCharts from './barCharts.vue'
import dayjs from 'dayjs'

export default {
  name: 'Sale',
  components: { BarCharts },
  data() {
    return {
      activeName: 'first',
      value1: []
    }
  },
  computed: {
    title() {
      return this.activeName === 'first' ? '销售额' : '访问量'
    },
    count1() {
      return this.activeName === 'first' ? '肯德基' : '海底捞'
    },
    count2() {
      return this.activeName === 'first' ? '海底捞' : '肯德基'
    },
    count3() {
      return this.activeName === 'first' ? '茶颜悦色' : '古茗'
    },
    count4() {
      return this.activeName === 'first' ? '星巴克' : '瑞星咖啡'
    }
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.value1 = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.value1 = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.value1 = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.value1 = [start, end]
    }
  }
}
</script>

<style scoped>
.flex {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.right span {
  margin: 0 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
.right-ul > li {
  list-style: none;
}
.right-ul > li h3 {
  display: inline;
}
.right-ul > li {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
</style>
