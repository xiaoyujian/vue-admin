<template>
  <div>
    <el-card style="margin-bottom: 20px"> <Category :show="!showTable" @getCatoryId="getId"></Category> </el-card>
    <el-card>
      <div v-show="showTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="categoryId3 ? false : true" @click="addAttr">添加属性</el-button>
        <el-table :data="list" border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="200"></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0 20px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!showTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="pushValueName">添加属性值</el-button>
        <el-button @click="showTable = true">取消</el-button>
        <el-table border style="margin-top: 20px" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else style="display: block" @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button style="margin-top: 20px" type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="saveAttrValue">保存</el-button>
        <el-button @click="showTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      showTable: true,
      list: [],
      categoryId1: '',
      categoryId2: '',
      categoryId3: '',
      attrInfo: {
        attrName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  methods: {
    getId({ categoryId, level }) {
      if (level === 1) {
        this.categoryId1 = categoryId
        this.categoryId2 = ''
        this.categoryId3 = ''
      } else if (level === 2) {
        this.categoryId2 = categoryId
        this.categoryId3 = ''
      } else {
        this.categoryId3 = categoryId
        this.getAttrList()
      }
    },
    async getAttrList() {
      const result = await this.$API.attr.reqAttrList(this.categoryId1, this.categoryId2, this.categoryId3)
      if (result.code === 200) {
        this.list = result.data
      }
    },
    pushValueName() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus
      })
    },
    addAttr() {
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.categoryId3,
        categoryLevel: 3
      }
      this.showTable = false
    },
    updateAttr(row) {
      this.showTable = false
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message('请输入合法的名称')
        return
      }
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isRepeat === true) {
        this.$message('请不要输入重复名称')
        return
      }
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async saveAttrValue() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqsaveAttr(this.attrInfo)
        this.getAttrList()
        this.$message({ type: 'success', message: '保存成功' })
        this.showTable = true
      } catch (error) {
        this.$message('保存失败')
      }
    }
  }
}
</script>

<style></style>
