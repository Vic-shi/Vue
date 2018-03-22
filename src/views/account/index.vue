<template>
  <div class="app-container">
  <div id = "showOrHide">
    <div style = "margin-bottom:40px;">
      <button class = "add button" @click="add">新增</button>
      <button class = "delete button" @click="edit" style = "background-color:#1e9fff">编辑</button>
      <button class = "delete button" @click="deletes" style = "background-color:#ff5722">禁用</button>
    </div>
    <el-table :data="list" 
    v-loading.body="listLoading" 
    element-loading-text="Loading"
    border fit highlight-current-row
    @selection-change="handleSelectionChange"
    style = "width:600px;">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="id"
      label="账套id"
      width="120">
    </el-table-column>
    <el-table-column
      prop="rmbRate"
      label="人名币积分汇率"
      min-width="200">
    </el-table-column>
    </el-table>
  </div>
<el-form ref="form" :model="form" id = "form" label-width="80px" style = "padding-bottom:20px;display:none;width:500px;">
  <el-form-item label="账套id">
    <el-input v-model="form.id" placeholder="自动生成" readonly="readonly"></el-input>
  </el-form-item>    
  <el-form-item label="积分汇率">
    <el-input v-model="form.rmbRate"></el-input>
  </el-form-item> 
  <el-form-item>
    <el-button class = "layui-btn" type="primary" @click="save">保 存</el-button>
    <el-button class = "layui-btn" style = "background-color: #FFB800;" @click="resetForm('form')">重 置</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
// import { getList } from '@/api/table'
export default {
  data() {
    return {
      listLoading: true,
      list: [],
      data: {
        pageNo: 1,
        pages: 100
      },
      form: {},
      changeId: '空'
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.listLoading = false
    this.getAccount()
  },
  methods: {
    add() {
      this.form = []
      document.getElementById('showOrHide').style.display = 'none'
      document.getElementById('form').style.display = 'block'
    },
    edit() {
      if (this.changeId == '空' || this.changeId.length > 1) {
        this.$alert('请选中一个账套', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
      }else{
        var params = { 'id': this.changeId[0].id
        }
        this.$axios.post(this.HOST + '/api/account/load', params)
          .then(response => {
            this.form = response.data.result
          })
          .catch(err => {
            console.log(err)
          })
        document.getElementById('showOrHide').style.display = 'none'
        document.getElementById('form').style.display = 'block'
      }
    },
    getAccount() {
      this.$axios.post(this.HOST + '/api/account/list')
        .then(response => {
          this.list = response.data.result
          for (var i = 0; i < response.data.result.length;i++) {
            if (response.data.result[i].status == 0) {
              this.list[i].status = '禁用'
            }else{
              this.list[i].status = '启用'
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    save() {
      var params = { 'rmbRate': this.form.rmbRate,
        'id': this.form.id
      }
      this.$axios.post(this.HOST + '/api/account/save', params)
        .then(response => {
          this.getAccount()
          this.$alert('保存成功', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          document.getElementById('form').style.display = 'none'
          document.getElementById('showOrHide').style.display = 'block'
        })
        .catch(err => {
          this.$alert(err.response.data.message, {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          console.log(err)
        })

    },
    deletes() {
      if (this.changeId == '空' || this.changeId.length > 1) {
        this.$alert('请选中一个账套', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }else{
        var params = { 'id': this.changeId[0].id }
        this.$axios.post(this.HOST + '/api/account/delete', params)
          .then(response => {
            this.$alert('删除成功', {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
            this.getAccount()
          })
          .catch(err => {
            this.$alert(err.response.data.message, {
              confirmButtonText: '确定',
              callback: action => {
              }
            })
            console.log(err)
          })
      }
    },
    back() {
      document.getElementById('form').style.display = 'none'
      document.getElementById('showOrHide').style.display = 'block'
    },
    resetForm(formName) {
      this.form.rmbRate = ''
    },
    handleSelectionChange(val) {
      this.changeId = val
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';
/* @import '../src/static/layui.css'; */
.el-table__header-wrapper{
  font-size: 16px;
}
.el-pagination{
  position: fixed;
  bottom: 20px;
  width: 88%;
  text-align: center;
}
.button{
  height:40px;
  width: 100px;
  margin-left: 10px;
  border:none;
  border-radius: 2px;
  background-color: #009688;
}
.add{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 12px;
    display: inline-block;
    height: 38px;
    line-height: 38px;
    padding: 0 18px;
    background-color: #009688;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 16px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    width: 85px;
}
.delete{
    display: inline-block;
    height: 38px;
    line-height: 38px;
    padding: 0 18px;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 16px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    background-color: #FF5722;
    margin-left: 20px;
    width: 85px;
}
.app-container{
  margin: 20px 0 0 50px;
}
:after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.layui-btn {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    padding: 0 18px;
    background-color: #009688;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
}
.layui-btn-warm {
    background-color: #FFB800;
}
</style>

