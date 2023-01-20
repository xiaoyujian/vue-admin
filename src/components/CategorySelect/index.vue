<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="categoryForm">
      <el-form-item label="一级分类">
        <el-select v-model="categoryForm.categoryId1" placeholder="请选择" :disabled="show" @change="getCategory2">
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="categoryForm.categoryId2" :disabled="show" placeholder="请选择" @change="getCategory3">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryForm.categoryId3" :disabled="show" placeholder="请选择" @change="handler3">
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Category',
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      categoryForm: {
        categoryId1: '',
        categoryId2: '',
        categoryId3: ''
      }
    }
  },
  mounted() {
    this.getCategory1()
  },
  methods: {
    async getCategory1() {
      const result = await this.$API.attr.reqCategory1()
      if (result.code === 200) {
        this.list1 = result.data
      }
    },
    async getCategory2() {
      this.list2 = []
      this.list3 = []
      this.categoryForm.categoryId2 = ''
      this.categoryForm.categoryId3 = ''
      this.$emit('getCatoryId', { categoryId: this.categoryForm.categoryId1, level: 1 })
      const result = await this.$API.attr.reqCategory2(this.categoryForm.categoryId1)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    async getCategory3() {
      this.list3 = []
      this.categoryForm.categoryId3 = ''
      this.$emit('getCatoryId', { categoryId: this.categoryForm.categoryId2, level: 2 })
      const result = await this.$API.attr.reqCategory3(this.categoryForm.categoryId2)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    handler3() {
      this.$emit('getCatoryId', { categoryId: this.categoryForm.categoryId3, level: 3 })
    }
  }
}
</script>

<style></style>
