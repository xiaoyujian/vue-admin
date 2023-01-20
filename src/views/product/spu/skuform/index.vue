<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" placeholder="规格描述" rows="4"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.AttrAndValue" placeholder="请选择">
              <el-option v-for="value in attr.attrValueList" :key="value.id" :label="value.valueName" :value="`${attr.id}:${value.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item v-for="sale in spuSaleAttr" :key="sale.id" :label="sale.saleAttrName">
            <el-select v-model="sale.saleIdAndValueId" placeholder="请选择">
              <el-option v-for="value in sale.spuSaleAttrValueList" :key="value.id" :label="value.saleAttrValueName" :value="`${sale.id}:${value.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="imgList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="100px"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row }">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button v-if="row.isDefault === 0" type="primary" @click="changeDefault(row)">设为默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancelSkuform">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      imgList: [],
      spuSaleAttr: [],
      attrInfoList: [],
      skuInfo: {
        category3Id: 0,
        tmId: 0,
        spuId: 0,
        price: '',
        weight: '',
        skuDesc: '',
        skuDefaultImg: '',
        skuName: '',
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: 'string',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: 'string',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      },
      spu: {},
      newImgList: []
    }
  },
  methods: {
    async getData(category1Id, category2Id, category3Id, spu) {
      this.spu = spu
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      const imgRes = await this.$API.sku.reqSpuImageList(spu.id)
      if (imgRes.code === 200) {
        const list = imgRes.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.imgList = list
      }
      const saleRes = await this.$API.sku.reqSpuSaleAttr(spu.id)
      if (saleRes.code === 200) {
        this.spuSaleAttr = saleRes.data
      }
      const attrRes = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, category3Id)
      if (attrRes.code === 200) {
        this.attrInfoList = attrRes.data
      }
    },
    handleSelectionChange(params) {
      this.newImgList = params
    },
    changeDefault(row) {
      this.imgList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    cancelSkuform() {
      this.$emit('skuChangeScene', 0)
      Object.assign(this._data, this.$options.data())
    },
    async save() {
      this.attrInfoList.forEach(item => {
        if (item.AttrAndValue) {
          const [attrId, valueId] = item.AttrAndValue.split(':')
          const obj = { attrId, valueId }
          this.skuInfo.skuAttrValueList.push(obj)
        }
      })
      this.spuSaleAttr.forEach(item => {
        if (item.saleIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(':')
          const obj = { saleAttrId, saleAttrValueId }
          this.skuInfo.skuSaleAttrValueList.push(obj)
        }
      })
      this.skuInfo.skuImageList = this.newImgList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      const result = await this.$API.sku.reqSaveSkuFormData(this.skuInfo)
      if (result.code === 200) {
        this.$emit('skuChangeScene', 0)
        this.$message({ type: 'success', message: '保存成功' })
      }
    }
  }
}
</script>

<style></style>
