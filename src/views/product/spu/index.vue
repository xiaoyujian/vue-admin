<template>
  <div>
    <el-card style="margin: 20px 0"><Category :show="scene !== 0" @getCatoryId="getId"></Category></el-card>
    <el-card>
      <div v-show="scene === 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table border style="margin: 20px 0" :data="records">
          <el-table-column type="index" label="序号" width="100"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称"></el-table-column>
          <el-table-column prop="description" label="SPU描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="success" icon="el-icon-plus" size="mini" title="添加" @click="addSku(row)"></el-button>
              <el-button type="warning" icon="el-icon-edit" size="mini" title="修改" @click="updateSPu(row)"></el-button>
              <el-button type="info" icon="el-icon-info" size="mini" title="Spu信息" @click="watchSku(row)"></el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" style="margin-left: 10px" @onConfirm="deleteInfo(row)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: center" :current-page="page" :page-sizes="[3, 6, 9]" :page-size="limit" layout=" prev, pager, next, jumper,->,total,sizes" :total="total" @current-change="getSpuList" @size-change="ChangeSize"> </el-pagination>
      </div>
      <SpuForm v-show="scene === 1" ref="spu" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene === 2" ref="sku" @skuChangeScene="changeSKuScene"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的展示`" :visible.sync="dialogTableVisible" :before-close="closeDialog">
      <el-table v-loading="loading" :data="skuList">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './spuform'
import SkuForm from './skuform'

export default {
  name: 'Spu',
  components: {
    SpuForm,
    SkuForm
  },
  data() {
    return {
      loading: true,
      dialogTableVisible: false,
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0,
      spu: {},
      skuList: []
    }
  },
  methods: {
    getId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages
      const result = await this.$API.spu.reqSpuList(this.page, this.limit, this.category3Id)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    ChangeSize(sizes) {
      this.limit = sizes
      this.getSpuList()
    },
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpu(this.category3Id)
    },
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    updateSPu(row) {
      this.scene = 1
      this.$refs.spu.getSpuData(row)
    },
    async deleteInfo(row) {
      const result = await this.$API.spu.reqDelete(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList()
      }
    },
    addSku(row) {
      this.scene = 2
      this.$refs.sku.getData(this.category1Id, this.category2Id, this.category3Id, row)
    },
    changeSKuScene(index) {
      this.scene = index
    },
    async watchSku(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      const result = await this.$API.sku.reqFindBySpuId(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    closeDialog(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>

<style></style>
