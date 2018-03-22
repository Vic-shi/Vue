<template>
  <div class="app-container">
  <div id = "showOrHide">
    <div style = "margin-bottom:40px;">
      <input placeholder="用户名" id = 'message' class="form-control" style = "width:300px;float:left;">
      <button class = "add button" @click="select">查询</button>
      <button class = "add button" @click="add">新增</button>
      <button class = "delete button" @click="edit" style = "background-color:#1e9fff">编辑</button>
      <button class = "delete button" style = "background-color:#ff5722;width:100px;" @click="changePass">重置密码</button>
      <button class = "delete button" style = "background-color:#ff5722" @click="remove">禁用</button>
    </div>
    <el-table :data="list" 
    v-loading.body="listLoading" 
    element-loading-text="Loading"
    @selection-change="handleSelectionChange"
    border fit highlight-current-row>
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
      prop="userName"
      label="用户名"
      width="120">
    </el-table-column>
    <el-table-column
      prop="nickName"
      label="昵称"
      width="100">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="100">
    </el-table-column>
    <el-table-column
      prop="mobile"
      label="手机号"
      width="200">
    </el-table-column>
    <el-table-column
      prop="email"
      label="邮箱"
      width="200">
    </el-table-column>
    <el-table-column
      prop="qq"
      label="qq"
      width="120">
    </el-table-column>
    <el-table-column
      prop="wechat"
      label="微信">
    </el-table-column>
    <el-table-column
      prop="createDate"
      label="创建时间">
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
    <el-input v-model="forms.sn" placeholder="自动生成" readonly="readonly"></el-input>
  </el-form-item>    
  <el-form-item label="用户名">
    <el-input v-model="forms.userName"></el-input>
  </el-form-item> 
  <el-form-item label="姓名">
    <el-input v-model="forms.name"></el-input>
  </el-form-item> 
  <el-form-item label="昵称">
    <el-input v-model="forms.nickName"></el-input>
  </el-form-item> 
  <el-form-item label="手机号">
    <el-input v-model="forms.mobile"></el-input>
  </el-form-item> 
  <el-form-item label="邮箱">
    <el-input v-model="forms.email"></el-input>
  </el-form-item> 
  <el-form-item label="qq">
    <el-input v-model="forms.qq"></el-input>
  </el-form-item> 
  <el-form-item label="微信">
    <el-input v-model="forms.wechat"></el-input>
  </el-form-item> 
  <el-form-item label="组织列表">
    <!-- <el-input v-model="forms.orgNames" readonly="readonly" @click="getTree"></el-input> -->
    <input class = "el-input__inner" v-model="forms.orgNames" readonly="readonly" @click="getTree"/>
  </el-form-item> 
  <el-form-item label="角色列表">
    <el-select
        placeholder="请选择角色"
        v-model="forms.roleNames"
        @change="handleChange($event)">
        <el-option
            v-for="item in approvers"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
    </el-select>
    <!-- <el-input v-model ="forms.roleNames" readonly="readonly"></el-input> -->
  </el-form-item> 
  <el-form-item>
    <el-button class = "layui-btn" type="primary" @click="save">保 存</el-button>
    <el-button class = "layui-btn" style = "background-color: #FFB800;" @click="resetForm('form')">重 置</el-button>
  </el-form-item>
</el-form>
<div id = "showTree" class = "treeTable" style = "display:none;text-align:center;">
  <span class = "treeTableTitle">选择组织</span>
    <el-tree class="filter-tree" 
    :data="data2" 
    node-key="id"
    show-checkbox
    default-expand-all
    :default-checked-keys="keys"
    :props="defaultProps"
     default-expand-all 
    ref="tree"
    style="width:80%">
    </el-tree>
  <button class = "layui-btn" style = "margin:150px 20px 0 0" @click="saveTree">确 定</button>
  <button class = "layui-btn" style = "background-color: #FFB800;" @click="cancelTree">取 消</button>
</div>
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
      forms: [],
      data2: {},
      changeId: '',
      addOrEdit: '',
      defaultProps: {
        children: 'suborg',
        label: 'name'
      },
      keys: [],
      orgIds: [],
      roleIds: [],
      approvers: [],
      totalElements: 0
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
    this.getPerson()
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getMore(currentPage - 1)
    },
    getMore(data) {
      var param = { 'pageOffset': data, 'pageSize': 10 }
      this.$axios.post(this.HOST + '/api/person/findPage', param).then(response => {
        this.list = response.data.result.content
        this.totalElements = response.data.result.totalElements
      }).catch(err => {
        console.log(err)
      })
    },
    getPerson() {
      var param = { 'pageOffset': 0, 'pageSize': 10 }
      this.$axios.post(this.HOST + '/api/person/findPage', param)
        .then(response => {
          this.list = response.data.result.content
          this.totalElements = response.data.result.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    changePass() {
      if (this.changeId == '' || this.changeId.length > 1) {
        this.$alert('请选中一个用户', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      var param = {'personId': this.changeId[0].id }
      this.$axios.post(this.HOST + '/api/person/resetPassword', param)
        .then(response => {
          this.$alert('重置成功', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        })
        .catch(err => {
          this.$alert(err.response.data.result, {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          console.log(err)
        })
    },
    select() {
      var match = document.getElementById('message').value
      var param = {
        'match':match
      }
      this.$axios.post(this.HOST + '/api/person/findPage', param)
        .then(response => {
          this.list = response.data.result.content
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTree() {
      if (this.addOrEdit == 'edit') {
        this.keys = this.getString(this.forms.orgIds)
      }

      this.$axios.post(this.HOST + '/api/org/findAll').then(response => {
        console.log(response.data.result[0])
        this.data2 = []
        this.data2 = this.transData(eval(response.data.result), 'id', 'pid', 'suborg')
        document.getElementById('showTree').style.display = 'block'
        console.log(this.data2)
      }).catch(err => {
        console.log(err)
      })
    },
    add() {
      this.addOrEdit = 'add'
      this.forms = []
      this.getRole()
      document.getElementById('showOrHide').style.display = 'none'
      document.getElementById('forms').style.display = 'block'
    },
    remove() {
      if (this.changeId == '' || this.changeId.length > 1) {
        this.$alert('请选中一个用户', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      var param = {
        'id': this.changeId[0].id
      }
      this.$axios.post(this.HOST + '/api/person/delete', param)
        .then(response => {
          this.getPerson('空')
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
        })
    },
    edit() {
      if (this.changeId == '' || this.changeId.length > 1) {
        this.$alert('请选中一个用户', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      this.addOrEdit = 'edit'
      this.getRole()
      this.forms = []
      var param = {'id': this.changeId[0].id }
      this.$axios.post(this.HOST + '/api/person/load', param)
        .then(response => {
          this.forms = response.data.result
        })
        .catch(err => {
          console.log(err)
        })
      document.getElementById('showOrHide').style.display = 'none'
      document.getElementById('forms').style.display = 'block'
    },
    getRole() {
      this.$axios.post(this.HOST + '/api/role/findPage').then(response => {
        this.approvers = response.data.result.content
      }).catch(err => {
        console.log(err)
      })
    },
    save() {
      // if (this.$refs.tree.getCheckedKeys().length == 0) {
      //   this.$alert('请选择权限', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //     }
      //   })
      //   return
      // }
      var orgIds = ''
      var roleIds = ''
      if (this.forms.orgIds.indexOf('(') > -1) {
        this.forms.orgIds = this.getString(this.forms.orgIds)
        for(var i =0;i<this.forms.orgIds.length;i++) {
          orgIds += this.forms.orgIds[i]
          if (this.forms.orgIds.length - i > 1 ) {
            if (i == 1) {
              orgIds += ','
            }else{
              orgIds += ','
            }
          }
        }
      }else{
        orgIds = this.forms.orgIds
      }
      var param = {}
      if(this.roleIds.length == 0) {
        var str = this.forms.roleIds.substring(1, this.forms.roleIds.length - 1)
        roleIds = str.replace(')(', ',')
        // roleIds = this.forms.roleIds
      }else{
        roleIds = this.roleIds
      }

      if (this.addOrEdit == 'add') {
        param = {
          'userName': this.forms.userName,
          'nickName': this.forms.nickName,
          'name': this.forms.name,
          'mobile': this.forms.mobile,
          'email': this.forms.email,
          'qq': this.forms.qq,
          'wechat': this.forms.wechat,
          'orgIds': orgIds,
          'roleIds': roleIds
        }
      }else if (this.addOrEdit == 'edit') {
        param = {'id': this.forms.id,
          'userName': this.forms.userName,
          'nickName': this.forms.nickName,
          'name': this.forms.name,
          'mobile': this.forms.mobile,
          'email': this.forms.email,
          'qq': this.forms.qq,
          'wechat': this.forms.wechat,
          'orgIds': orgIds,
          'roleIds': roleIds
        }
      }
      this.$axios.post(this.HOST + '/api/person/save', param)
        .then(response => {
          // this.forms = response.data.result
          this.$alert('保存成功', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          document.getElementById('forms').style.display = 'none'
          document.getElementById('showOrHide').style.display = 'block'
          this.getPerson()
        })
        .catch(err => {
          this.$alert(err.response.data.message, {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        })

    },
    back() {
      document.getElementById('forms').style.display = 'none'
      document.getElementById('showOrHide').style.display = 'block'
    },
    saveTree() {
      var orgIds = ''
      var orgNames = ''
      for (var i = 0; i < this.$refs.tree.getCheckedKeys().length; i++) {
        orgIds += this.$refs.tree.getCheckedKeys()[i]
        if (this.$refs.tree.getCheckedKeys().length - i > 1 ) {
          if (i == 1) {
            orgIds += ','
          }else{
            orgIds += ','
          }
        }
      }
      for (var i = 0; i < this.$refs.tree.getCheckedNodes().length; i++) {
        orgNames += this.$refs.tree.getCheckedNodes()[i].name
        if (this.$refs.tree.getCheckedNodes().length - i > 1 ) {
          if (i == 1) {
            orgNames += ','
          }else{
            orgNames += ','
          }
        }
      }
      this.forms.orgIds = orgIds
      this.forms.orgNames = orgNames
      // console.log(orgIds)
      document.getElementById('showTree').style.display = 'none'
    },
    cancelTree() {
      document.getElementById('showTree').style.display = 'none'
    },
    transData(a, idStr, pidStr, chindrenStr) {    
      var r = []
      var hash = {}
      var id = idStr 
      var pid = pidStr 
      var children = chindrenStr 
      var i = 0 
      var j = 0 
      var len = a.length   
      for (; i < len; i++) {    
        hash[a[i][id]] = a[i]    
      }    
      for (; j < len; j++) {    
        var aVal = a[j]
        var hashVP = hash[aVal[pid]]    
        if (hashVP) {    
          !hashVP[children] && (hashVP[children] = [])    
          hashVP[children].push(aVal)    
        } else {    
          r.push(aVal)    
        }    
      }    
      return r  
    },
    handleSelectionChange(val) {
      this.changeId = val
    },
    handleChange(value) {
      this.roleIds = value
      console.log(value)
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
.treeTable{
    border: 2px;
    border-color: #333333;
    width: 350px;
    position: fixed;
    top: 200px;
    right: 700px;
    z-index: 9999;
    height: 550px;
    box-shadow: 1px 1px 50px rgba(0,0,0,.3);
    background-color: #fff
}
.treeTableTitle{
    display: block;
    text-align: center;
    height: 50px;
    background-color: #304156;
    color: #fff;
    padding-top: 15px
}
</style>

