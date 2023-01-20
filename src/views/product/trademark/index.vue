<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
    <el-table border :data="list">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" align="center"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateDialog(scope)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTrademark(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="margin-top: 20px; text-align: center" :total="total" :current-page="page" :page-sizes="[3, 6, 9]" :page-size="limit" layout="prev,pager,next,jumper,->,sizes,total" @size-change="sizeChange" @current-change="changeCurrent"></el-pagination>

    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item prop="tmName" label="品牌名称" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      list: [],
      total: 0,
      dialogFormVisible: false,
      tmForm: { tmName: '', logoUrl: '' },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'change' }
        ],
        logoUrl: [{ required: true, message: '请选择品牌的图片', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getTradeMark()
  },
  methods: {
    async getTradeMark() {
      const result = await this.$API.trademark.reqTradeMarkList(this.page, this.limit)
      console.log(result)
      if (result.code === 200) {
        this.list = result.data.records
        this.total = result.data.total
      }
    },
    changeCurrent(pager) {
      this.page = pager
      this.getTradeMark()
    },
    sizeChange(size) {
      this.limit = size
      this.getTradeMark()
    },
    showDialog() {
      this.dialogFormVisible = true
      this.tmForm.tmName = ''
      this.tmForm.logoUrl = ''
      this.tmForm.id = ''
    },
    updateDialog(scope) {
      this.dialogFormVisible = true
      console.log(scope.row)
      this.tmForm = { ...scope.row }
    },
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    uploadTrademark() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.dialogFormVisible = false

          if (this.tmForm.id) {
            const res = await this.$API.trademark.reqUpdateTrademark(this.tmForm)
            if (res.code === 200) {
              this.$message({ message: this.tmForm.id ? '修改成功' : '添加成功', type: 'success' })
              this.getTradeMark()
            }
          } else {
            const result = await this.$API.trademark.reqAddTrademark(this.tmForm)
            if (result.code === 200) {
              this.$message({ message: this.tmForm.id ? '修改成功' : '添加成功', type: 'success' })
              this.page = 1
              this.getTradeMark()
            }
          }
        } else {
          console.log('error')
          return false
        }
      })
    },
    deleteTrademark(scope) {
      this.$confirm(`是否删除${scope.row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const result = await this.$API.trademark.reqDeleteTrademark(scope.row.id)
          if (result.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.list.length > 1 ? this.page : this.page - 1
            this.getTradeMark()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
