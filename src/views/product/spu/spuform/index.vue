<template>
  <div>
    <el-form label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="tm in trademarkList" :key="tm.id" :label="tm.tmName" :value="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload action="/dev-api/admin/product/fileUpload" :file-list="imageList" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handlerSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndName" :placeholder="`还有${unselectedAttr.length}项未选择`">
          <el-option v-for="op in unselectedAttr" :key="op.id" :label="op.name" :value="`${op.id}:${op.name}`"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addAttr">添加销售属性</el-button>
        <el-table border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="100px" align="center"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName" width="120px"></el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag" size="small" @blur="handleInputConfirm(row)"> </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      attrIdAndName: '',
      dialogImageUrl: '',
      dialogVisible: false,
      spu: {
        category3Id: 0,
        description: '',
        tmId: '',
        spuName: '',
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: '',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: '',
          //       saleAttrName: '',
          //       saleAttrValueName: '',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      trademarkList: [],
      imageList: [],
      attrList: []
    }
  },
  computed: {
    unselectedAttr() {
      const result = this.attrList.filter(item => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.imageList = fileList
      // console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async getSpuData(row) {
      const spuRes = await this.$API.spu.reqSpuById(row.id)
      if (spuRes.code === 200) {
        this.spu = spuRes.data
      }
      const tradeRes = await this.$API.spu.reqTrademarkList()
      if (tradeRes.code === 200) {
        this.trademarkList = tradeRes.data
      }
      const imageRes = await this.$API.spu.reqSpuImageList(row.id)
      if (imageRes.code === 200) {
        const imgList = imageRes.data
        imgList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.imageList = imgList
      }
      const attrRes = await this.$API.spu.reqBaseSaleAttrList()
      if (attrRes.code === 200) {
        this.attrList = attrRes.data
      }
    },
    handlerSuccess(response, file, fileList) {
      this.imageList = fileList
    },
    addAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(':')
      const newArr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newArr)
      this.attrIdAndName = ''
    },
    showInput(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    handleInputConfirm(row) {
      row.inputVisible = false
      if (row.inputValue.trim() === '') {
        this.$message('输入内容不能为空')
        return
      }
      const { baseSaleAttrId, inputValue } = row
      const newArr = { baseSaleAttrId, saleAttrValueName: inputValue }
      const res = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === row.inputValue
      })
      if (res === true) {
        this.$message('请不要输入重复内容')
        return
      }
      row.spuSaleAttrValueList.push(newArr)
    },
    async saveOrUpdate() {
      this.spu.spuImageList = this.imageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.imgUrl
        }
      })
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      Object.assign(this._data, this.$options.data())
    },
    async addSpu(category3Id) {
      this.spu.category3Id = category3Id
      const tradeRes = await this.$API.spu.reqTrademarkList()
      if (tradeRes.code === 200) {
        this.trademarkList = tradeRes.data
      }
      const attrRes = await this.$API.spu.reqBaseSaleAttrList()
      if (attrRes.code === 200) {
        this.attrList = attrRes.data
      }
    },
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
