<template>
  <div class="app-container">
  <div id = "showOrHide">
    <div style = "margin-bottom:40px;">
      <input placeholder="用户名" id = 'message' class="form-control" style = "width:300px;float:left;">
      <button class = "add button" @click="select">查询</button>
      <button class = "add button" @click="add">新增</button>
      <button class = "delete button" @click="edit" style = "background-color:#1e9fff">编辑</button>
      <button class = "delete button" @click="remove" style = "background-color:#ff5722">禁用</button>
    </div>
    <el-table :data="list" 
    v-loading.body="listLoading" 
    element-loading-text="Loading"
    border fit highlight-current-row
    @selection-change="handleSelectionChange"
    style = "width:900px;">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="sn"
      label="编号"
      width="250">
    </el-table-column>
    <el-table-column
      prop="name"
      label="用户名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="permissionIds"
      label="权限列表"
      width="200">
    </el-table-column>
    <el-table-column
      prop="des"
      label="描述">
    </el-table-column>
    </el-table>
  <el-pagination
    @current-change="handleCurrentChange"
    id = "pagination"
    layout="prev, pager, next"
    :page-size = 10
    :total="totalElements">
  </el-pagination>
  </div>
<el-form :model="forms" id = "forms" label-width="80px" style = "padding-bottom:20px;display:none;width:500px;">
  <el-form-item label="编号">
    <el-input v-model="forms.id" placeholder="自动生成" readonly="readonly"></el-input>
  </el-form-item>    
  <el-form-item label="名称">
    <el-input v-model="forms.name"></el-input>
  </el-form-item> 
  <el-form-item label="描述">
    <el-input v-model="forms.des"></el-input>
  </el-form-item>
  <el-form-item label="权限列表">
    <el-tree class="filter-tree" 
    :data="data2" 
    node-key="id"
    show-checkbox
    :default-checked-keys="keys"
    :props="defaultProps"
     default-expand-all 
    @node-click = "submitForm"
    ref="tree"
    style="width:80%">
    </el-tree>
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
      forms: [],
      data: {
        pageNo: 1,
        pages: 100
      },
      data2: {},
      defaultProps: {
        children: 'subPermission',
        label: 'name'
      },
      addOrEdit: 'add',
      totalElements: 0,
      changeId: '',
      keys: [],
      currentPage: 0
    }
  },
  created() {
    this.listLoading = false
    this.getRole('空')
  },
  methods: {
    getMore(data) {
      var param = { 'pageOffset': data, 'pageSize': 10 }
      this.$axios.post(this.HOST + '/api/role/findPage', param).then(response => {
        this.list = response.data.result.content
        this.totalElements = response.data.result.totalElements
      }).catch(err => {
        console.log(err)
      })
    },
    getRole(data) {
      if (data === '空') {
        var param = { 'pageOffset': 0, 'pageSize': 10 }
        this.$axios.post(this.HOST + '/api/role/findPage', param).then(response => {
          this.list = response.data.result.content
          this.totalElements = response.data.result.totalElements
        }).catch(err => {
          console.log(err)
        })
      } else {
        var param = { 'match': data, 'pageOffset': 0, 'pageSize': 10 }
        this.$axios.post(this.HOST + '/api/role/findPage', param).then(response => {
          this.list = response.data.result.content
          this.totalElements = response.data.result.totalElements
        }).catch(err => {
          console.log(err)
        })
      }
    },
    select() {
      var message = document.getElementById('message').value
      this.getRole(message)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getMore(currentPage - 1)
    },
    getPermission(data) {
      if (data === '空') {
        this.$axios.post(this.HOST + '/api/permission/findAll')
          .then(response => {
            this.data2 = response.data.result
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        var param = { 'id': data }
        this.$axios.post(this.HOST + '/api/permission/findAll', param)
          .then(response => {
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    add() {
      this.addOrEdit = 'add'
      this.keys = []
      this.forms = []
      this.getPermission('空')
      document.getElementById('showOrHide').style.display = 'none'
      document.getElementById('forms').style.display = 'block'
    },
    remove() {
      if (this.changeId === '' || this.changeId.length > 1) {
        this.$alert('请选中一个角色', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      var param = {
        'id': this.changeId[0].id
      }
      this.$axios.post(this.HOST + '/api/role/delete', param)
        .then(response => {
          this.getRole('空')
          this.$alert('删除成功', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
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
    edit() {
      if (this.changeId === '' || this.changeId.length > 1) {
        this.$alert('请选中一个角色', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      var param = { 'id': this.changeId[0].id }
      this.$axios.post(this.HOST + '/api/role/load', param)
        .then(response => {
          this.getPermission('空')
          // this.forms = response.data.result
          this.forms.id = response.data.result.id
          this.forms.des = response.data.result.des
          this.forms.name = response.data.result.name
          this.forms.sn = response.data.result.sn
          this.keys = this.getString(response.data.result.permissionIds)
          // this.keys = [3, 5]
        })
        .catch(err => {
          console.log(err)
        })
      this.addOrEdit = 'edit'
      document.getElementById('showOrHide').style.display = 'none'
      document.getElementById('forms').style.display = 'block'
    },
    save() {
      if (this.forms.name === undefined || this.forms.name === '') {
        this.$alert('名称不能为空', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      if (this.$refs.tree.getCheckedKeys().length === 0) {
        this.$alert('请选择权限', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      var param = {}
      var permissionIds = ''
      for (var i = 0; i < this.$refs.tree.getCheckedKeys().length; i++) {
        permissionIds += this.$refs.tree.getCheckedKeys()[i]
        if (this.$refs.tree.getCheckedKeys().length - i > 1) {
          if (i === 1) {
            permissionIds += ','
          } else {
            permissionIds += ','
          }
        }
      }
      if (this.addOrEdit === 'add') {
        param = { 'name': this.forms.name,
          'permissionIds': permissionIds,
          'des': this.forms.des
        }
      } else if (this.addOrEdit === 'edit') {
        param = { 'id': this.forms.id,
          'name': this.forms.name,
          'permissionIds': permissionIds,
          'des': this.forms.des
        }
      }
      this.$axios.post(this.HOST + '/api/role/save', param)
        .then(response => {
          this.getRole('空')
          this.$alert('新增成功', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          document.getElementById('forms').style.display = 'none'
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
    back() {
      document.getElementById('forms').style.display = 'none'
      document.getElementById('showOrHide').style.display = 'block'
    },
    handleSelectionChange(val) {
      this.changeId = val
    },
    getString(data) {
      var str = data.substring(1, data.length - 1)
      // str.replace(')(', ',')
      // str = str + ","
      return str.split(')(')
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
.filter-tree{
  font-weight: bold !important;
  width: 20%;
  float: left;
}
.panel {
    margin-bottom: 20px;
    background-color: #fff;
    border: 1px solid transparent;
    /* border-radius: 4px; */
    /* -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05); */
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
}
.col-sm-10 {
    width: 70%;
    padding-left: 0px;
}
.form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
}
.panel-heading {
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    /* border-top-left-radius: 3px; */
    border-top-right-radius: 3px;
}
.col-md-5{
  max-width: 60% !important;
  font-size: 16px !important;
}
.form-horizontal {
    width: 550px;
    padding-top: 20px;
}
:after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.form-horizontal .control-label {
    padding-top: 7px;
    margin-bottom: 0;
    text-align: right;
    padding-left: 0% !important;
}
.floatLeft{
  float: left !important;
}
.form-group{
  height:50px;
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

