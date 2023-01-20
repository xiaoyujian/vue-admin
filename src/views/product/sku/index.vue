<template>
  <div>
    <el-table border :data="records">
      <el-table-column type="index" width="80px" label="序号" align="center"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="110px">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80px"></el-table-column>
      <el-table-column label="价格" width="80px" prop="price"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button v-if="row.isSale === 1" type="success" size="mini" icon="el-icon-bottom" @click="cancel(row)"></el-button>
          <el-button v-else type="success" size="mini" icon="el-icon-top" @click="sale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" size="mini" icon="el-icon-info" @click="skuInfo(row)"></el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="clickSku(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="text-align: center" :page-sizes="[3, 6, 9]" :total="total" :current-page="page" :page-size="limit" layout=" prev, pager, next, jumper,->, sizes,total" @current-change="getData" @size-change="handleSizeChange"></el-pagination>

    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="6">名称</el-col>
        <el-col :span="14">{{ info.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">>描述</el-col>
        <el-col :span="14">{{ info.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">价格</el-col>
        <el-col :span="14">{{ info.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">平台属性</el-col>
        <el-col :span="14">
          <el-tag v-for="attr in info.skuAttrValueList" :key="attr.id" type="primary" style="margin: 0 5px">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">商品图片</el-col>
        <el-col :span="14">
          <el-carousel height="400px">
            <el-carousel-item v-for="item in info.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      drawer: false,
      total: 20,
      page: 1,
      limit: 3,
      records: [],
      info: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(pages = 1) {
      this.page = pages
      const result = await this.$API.sku.reqGetSkuData(this.page, this.limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleSizeChange(sizes) {
      this.limit = sizes
      this.getData()
    },
    async sale(row) {
      const result = await this.$API.sku.reqOnSale(row.id)
      if (result.code === 200) {
        // row.isSale = 1
        this.getData()
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    async cancel(row) {
      const result = await this.$API.sku.reqCancelSale(row.id)
      if (result.code === 200) {
        // row.isSale = 0
        this.getData()
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    edit() {
      this.$message('正在开发中')
    },
    async skuInfo(spu) {
      const result = await this.$API.sku.reqGetSkuById(spu.id)
      if (result.code === 200) {
        this.info = result.data
      }
      this.drawer = true
    },
    async clickSku(row) {
      const result = await this.$API.sku.reqDeleteSku(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getData()
      }
    }
  }
}
</script>
<style scoped>
.el-row .el-col-6 {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

el-carousel__container >>> .el-carousel__item:nth-child(2n) {
  width: 500px;
  height: 400px;
  background-color: #99a9bf;
}

el-carousel__container >>> .el-carousel__item:nth-child(2n + 1) {
  width: 500px;
  height: 400px;
  background-color: #d3dce6;
}
</style>
