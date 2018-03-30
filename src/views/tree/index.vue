<template>
  <div class="app-container">
    <div style = "margin-bottom:40px;">
      <button class = "add" @click="add">新增</button>
      <button class = "delete" @click="open2">删除</button>
    </div>
    <div style = "margin-bottom:10px;">    
        <img style = "width:25px;margin-left:10px;" src="../../assets/tree.png">
        <span style = "font-size:20px;">组织机构树</span>
    </div>
    <el-tree class="filter-tree" 
    :data="data2" 
    node-key="id"
    :props="defaultProps"
     default-expand-all 
    :filter-node-method="filterNode" 
    @node-click = "submitForm"
    ref="tree">
    </el-tree>
        <div id = "showOrHide" class="col-md-5 col-sm-10" style="float:right;margin-right:200px;width:60%;margin-top:-40px;display:none;">
          <div class="panel panel-default">
            <div class="panel-heading">
              <i class="layui-icon" style="font-size: 20px; color: rgb(0, 150, 136);"></i> 
              <span id = "titleName">修改组织</span>
              </div> 
<el-form ref="form" :model="form" label-width="80px" style = "padding-bottom:20px;">
  <el-form-item label="父节点名">
    <el-input v-model="form.pname" readonly="readonly" placeholder="自动获取"></el-input>
  </el-form-item>
  <el-form-item label="编号">
    <el-input v-model="form.sn" readonly="readonly" placeholder="自动生成"></el-input>
  </el-form-item>    
  <el-form-item label="组织名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item> 
  <el-form-item label="组织类型">
    <el-select
        placeholder="请选择组织类型"
        v-model="name"
        @change="handleChange($event)">
        <el-option
            v-for="item in approvers"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
    </el-select>
  </el-form-item> 
  <el-form-item label="账套">
    <el-select
        placeholder="请选择账套"
        v-model="id2"
        @change="handleChange2($event)">
        <el-option
            v-for="item2 in accounts"
            :key="item2.id2"
            :label="item2.id2"
            :value="item2.id2">
        </el-option>
    </el-select>
  </el-form-item> 
  <el-form-item>
    <el-button class = "layui-btn" type="primary" @click="save">保 存</el-button>
    <el-button class = "layui-btn" style = "background-color: #FFB800;" @click="resetForm('form')">重 置</el-button>
  </el-form-item>
</el-form>
    </div>
    </div>
  </div>
</template>
<script>
// import qs from 'qs'
export default {
  mounted() {
    // 树状列表取数
    this.getTree()
    // 账套取数
    this.$axios.post(this.HOST + '/api/account/list')
      .then(response => {
        this.accounts = response.data.result
        for (var i = 0; i < this.accounts.length; i++) {
          this.accounts[i].id2 = this.accounts[i].id
        }
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getTree() {
      this.$axios.post(this.HOST + '/api/org/findAll').then(response => {
        console.log(response.data.result[0])
        this.data2 = []
        this.data2 = this.transData(eval(response.data.result), 'id', 'pid', 'suborg')
        console.log(this.data2)
      }).catch(err => {
        console.log(err)
      })

    },
    remove() {
      var params = { 'id': this.id }
      this.$axios.post(this.HOST + '/api/org/delete', params)
        .then(response => {
          this.getTree()
          document.getElementById('showOrHide').style.display = 'none'
          this.form = {}
        })
        .catch(err => {
          console.log(err)
        })
    },
    submitForm(data) {
      this.id = data.id
      var params = { 'id': data.id }
      this.$axios.post(this.HOST + '/api/org/load', params)
        .then(response => {
          this.name = response.data.result.typeName
          this.id2 = response.data.result.accountId
          this.form = response.data.result
          this.idid = this.form.id
          this.pname = this.form.name
          console.log(response)
        })
        .catch(err => {
          console.log(err)
        })
      // 组织类型取数
      var params2 = { 'id': this.form.pid }
      this.$axios.post(this.HOST + '/api/orgType/listChildren', params2).then(response => {
        this.approvers = response.data.result
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
      document.getElementById('showOrHide').style.display = 'block'
      document.getElementById('titleName').innerHTML = '修改组织'
    },
    handleChange(value) {
      this.id = value
      console.log(value)
    },
    handleChange2(value) {
      this.id2 = value
      console.log(value)
    },
    add() {
      // if (this.id == "") {
      //   this.$alert('请选中组织', {
      //     confirmButtonText: '确定',
      //     callback: action => {
      //     }
      //   })
      //   return
      // }
      this.form = []
      this.name = ''
      this.form.pname = this.pname
      this.form.pid = this.idid
      this.id2 = ''
      // 组织类型取数
      var params = { 'id': this.id }
      this.$axios.post(this.HOST + '/api/orgType/listChildren', params).then(response => {
        this.approvers = response.data.result
        console.log(response)
      }).catch(err => {
        console.log(err)
      })
      document.getElementById('showOrHide').style.display = 'block'
      document.getElementById('titleName').innerHTML = '新增字典'
    },
    save() {
      if (this.form.name === '' || this.form.name === undefined) {
        this.open('组织名称为空')
        return
      }
      if (this.name === '' || this.name === undefined) {
        this.open('组织类型为空')
        return
      }
      if (this.id2 === '' || this.id2 === undefined) {
        this.open('账套为空')
        return
      }
      var params = { 'id': this.form.id,
        'sn': this.form.sn,
        'name': this.form.name,
        'typeId': this.id,
        'pid': this.form.pid,
        'accountId': this.id2
      }
      this.$axios.post(this.HOST + '/api/org/save', params)
        .then(response => {
          this.getTree()
          this.$alert('保存成功', {
            confirmButtonText: '确定',
            callback: action => {
            }
          })
          document.getElementById('showOrHide').style.display = 'none'
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
    resetForm(formName) {
      this.form.name = ''
      this.form.id = ''
      this.name = ''
      this.id2 = ''
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
    open2() {
      if (this.id === '') {
        this.$alert('请选中组织', {
          confirmButtonText: '确定',
          callback: action => {
          }
        })
        return
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    open(data) {
      this.$alert(data, {
        confirmButtonText: '确定',
        callback: action => {
        }
      })
    }
  },
  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'suborg',
        label: 'name'
      },
      id: '',
      id2: '',
      pid: '',
      approvers: [],
      account: [],
      name: '',
      form: {},
      pname: '',
      idid: ''
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';
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
.el-form-item{
  width: 70%;
  margin: 20px 0 0 20px;
}
</style>
