<template>
  <div class='ui-common'>
    <device-category-edit-item ref='deviceCategoryEditDiag' v-bind:providers='providers' v-bind:mode='mode' v-bind:parents='parents'></device-category-edit-item>
    <div>
      <el-form :inline='true' :model='searchForm' ref='searchForm' label-width="68px" style='margin-top:20px'>
        <el-form-item label='设备主数据编码' label-width="120px">
          <el-input placeholder='请输入设备主数据编码' v-model='searchForm.typeCode' @keyup.enter.native='search' :maxlength="12" clearable></el-input>
        </el-form-item>
        <el-form-item label='设备型号'>
          <el-input placeholder='请输入设备型号' v-model='searchForm.typeModel' @keyup.enter.native='search' :maxlength="64" clearable></el-input>
        </el-form-item>
        <el-form-item label='设备名称'>
          <el-input placeholder='请输入设备名称' v-model='searchForm.typeName' @keyup.enter.native='search' :maxlength="64" clearable></el-input>
        </el-form-item>
        <el-form-item label='设备描述'>
          <el-input placeholder='请输入设备描述' v-model='searchForm.typeDesc' @keyup.enter.native='search' :maxlength="64" clearable></el-input>
        </el-form-item>
        <el-form-item label='供应商'>
          <el-select clearable filterable v-model='searchForm.providerCode' placeholder='请选择供应商'>
            <el-option v-for='provider in providers' :key='provider.providerCode' :label='provider.providerCode + ":" + provider.providerName' :value='provider.providerCode'>
            </el-option>
          </el-select>
        </el-form-item>
        <div align="right">
          <el-button @click.stop='clear' type='primary' class="cancel-btn">清空</el-button>
          <el-button @click='search' type='primary' class="action-btn">搜索</el-button>
        </div>
      </el-form>
    </div>

    <div style="margin-top: 15px">
      <el-button @click='addDevice' icon="el-icon-circle-plus-outline" style="margin-center: 10px" plain type="primary">添加</el-button>
    </div>

    <el-table ref='deviceTable' :expand-row-keys='expandRows' :row-key="getRowKeys" :data='tableData' v-loading='loading' @row-dblclick='editDevicedbl' element-loading-text='拼命加载中' height="100%" style='margin-top: 15px'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table empty-text='无子设备' :data='props.row.slave' :show-header='false' @row-dblclick='editDevicedbl'>
            <el-table-column prop='uuid' label='uuid' v-if='showflag'></el-table-column>
            <el-table-column prop='typeCode' label='设备主数据编码' width="155px">
              <template slot-scope="scope">
                <div style="float: left; vertical-align: middle; color: #aaa">
                  <i class='fa fa-cog'></i>
                </div>
                <p style='padding-left: 20px; float: left' v-html="highlightKeys(scope.row.typeCode, searchForm.typeCode)"></p>
              </template>
            </el-table-column>
            <el-table-column prop='typeModel' label='设备型号'>
              <template slot-scope="scope">
                <p v-html="highlightKeys(scope.row.typeModel, searchForm.typeModel)"></p>
              </template>
            </el-table-column>
            <el-table-column prop='typeName' label='设备名称' width="160px">
              <template slot-scope="scope">
                <p v-html="highlightKeys(scope.row.typeName, searchForm.typeName)"></p>
              </template>
            </el-table-column>
            <el-table-column prop='typeDesc' label='设备描述' width="160px">
              <template slot-scope="scope">
                <p v-html="highlightKeys(scope.row.typeDesc, searchForm.typeDesc)"></p>
              </template>
            </el-table-column>
            <el-table-column prop='parentUuid' label='父设备' v-if='showflag'></el-table-column>
            <el-table-column prop='hardwareVersion' label='硬件版本'></el-table-column>
            <el-table-column prop='softwareVersion' label='软件版本'></el-table-column>
            <el-table-column prop='providerCode' label='供应商编码' v-if='showflag'></el-table-column>
            <el-table-column prop='providerName' label='供应商'></el-table-column>
            <el-table-column prop='createTime' label='创建时间' width="155px" show-overflow-tooltip></el-table-column>
            <el-table-column prop='createUser' label='创建人' width="90px"></el-table-column>
            <el-table-column prop='updateTime' label='修改时间' width="155px"></el-table-column>
            <el-table-column prop='updateUser' label='修改人' width="90px"></el-table-column>
            <el-table-column label='操作'>
              <template slot-scope='scope'>
                <el-button type='text' size='mini' icon='el-icon-edit' @click='editDevicedbl(scope.row)'></el-button>
                <el-button type='text' size='mini' icon='el-icon-delete' @click='deleteDevice(scope.row)'></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop='uuid' label='uuid' v-if='showflag'></el-table-column>
      <el-table-column prop='typeCode' label='设备主数据编码' width="155px" sortable>
        <template slot-scope="scopeParent">
          <p v-html="highlightKeys(scopeParent.row.typeCode, searchForm.typeCode)"></p>
        </template>
      </el-table-column>
      <el-table-column prop='typeModel' label='设备型号' sortable>
        <template slot-scope="scopeParent">
          <p v-html="highlightKeys(scopeParent.row.typeModel, searchForm.typeModel)"></p>
        </template>
      </el-table-column>
      <el-table-column prop='typeName' label='设备名称' sortable width="160px">
        <template slot-scope="scopeParent">
          <p v-html="highlightKeys(scopeParent.row.typeName, searchForm.typeName)"></p>
        </template>
      </el-table-column>
      <el-table-column prop='typeDesc' label='设备描述' sortable width="160px">
        <template slot-scope="scopeParent">
          <p v-html="highlightKeys(scopeParent.row.typeDesc, searchForm.typeDesc)"></p>
        </template>
      </el-table-column>
      <el-table-column prop='parentUuid' label='父设备' v-if='showflag'></el-table-column>
      <el-table-column prop='hardwareVersion' label='硬件版本' sortable></el-table-column>
      <el-table-column prop='softwareVersion' label='软件版本' sortable></el-table-column>
      <el-table-column prop='providerCode' label='供应商编码' v-if='showflag'></el-table-column>
      <el-table-column prop='providerName' label='供应商' sortable></el-table-column>
      <el-table-column prop='createTime' label='创建时间' width="155px" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop='createUser' label='创建人' sortable width="90px"></el-table-column>
      <el-table-column prop='updateTime' label='修改时间' width="155px" sortable></el-table-column>
      <el-table-column prop='updateUser' label='修改人' sortable width="90px"></el-table-column>
      <el-table-column label='操作'>
        <template slot-scope='scope'>
          <el-button type='text' size='mini' icon='el-icon-edit' @click='editDevicedbl(scope.row)'></el-button>
          <el-button type='text' size='mini' icon='el-icon-delete' @click='deleteDevice(scope.row)'></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination ref='pager' background :current-page='searchForm.currentPage' :page-sizes='[10, 20, 50, 100]' :page-size='searchForm.pageSize' layout='total, sizes, prev, pager, next, jumper' :total='searchForm.totalCount' @size-change='sizeChange' @current-change='currentChange'>
    </el-pagination>
  </div>
</template>

<script>
// 导入设备编辑组件，设备属性列表编辑组件
import DeviceCategoryEditItem from './DeviceCategoryEditItem' // 设备编辑（查看，增加，修改）组件

// 导入访问后端方法
import {
  getDeviceCategoryList, // 查询设备方法
  deleteDeviceCategory,  // 删除设备方法
  getAllProviders, // 查询所有供应商方法
  getDeviceCategories // 查询所有设备分类
} from '@/views/MdmApp/apis/index'
import { addEventHandler } from '@/assets/js/util'

export default {
  data () {
    return {
      loading: false,
      showflag: false,
      expandRows: [],
      // 检索用表单
      searchForm: {
        uuid: null,
        pageSize: 10,
        currentPage: 1,
        totalCount: 0,
        typeCode: '',
        typeName: '',
        typeDesc: '',
        typeModel: '',
        providerCode: ''
      },
      // 检索返回数据
      tableData: [],
      // 供应商数据
      providers: [],
      // 设备编辑组件模式（1：查看，2：新增，3：修改)
      mode: 1,
      // 列表选择项
      selections: [],
      // 所有设备数据
      parents: []
    }
  },
  components: {
    // 新增/修改设备分类弹框页面
    DeviceCategoryEditItem
    // 设备分类的属性弹框页面
    // DeviceAttrEditItem
  },
  mounted () {
    // 查询所有的设备信息
    this.search()
    // 查询所有的供应商信息
    this.getProviders()
    this.getParents()
    this.attatchEventToPager()
  },
  methods: {
    // ********************新增设备********************
    addDevice: function () {
      this.mode = 2
      this.$refs['deviceCategoryEditDiag'].addDeviceCategoryDialog()
    },
    // ********************删除设备********************
    deleteDeviceBatch: function () {
      if (this.selections.length === 0) {
        this.$message({
          message: '请选择要删除的设备',
          type: 'warning'
        })
        return
      }
      this.$confirm('确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        deleteDeviceCategory(this.selections[0].uuid).then(res => {
          if (res.code !== '0000') {
            return
          }
          this.$message({
            message: '刪除成功!',
            type: 'success'
          })
          this.search()
          this.getParents()
        })
      }).catch(
        function (error) {
          console.log(error)
        }
        )
    },
    deleteDevice: function (device = {}) {
      this.$confirm('确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        deleteDeviceCategory({ 'value': [device.uuid] }).then(res => {
          this.$message({
            message: '刪除成功!',
            type: 'success'
          })
          this.search()
          this.getParents()
        })
      }).catch(
        function (error) {
          console.log(error)
        }
        )
    },
    // ********************修改设备********************
    editDevice: function () {
      if (this.selections.length === 0) {
        this.$message({
          message: '请选择要修改的设备',
          type: 'warning'
        })
      } else if (this.selections.length > 1) {
        this.$message({
          message: '一次只能修改一个设备',
          type: 'warning'
        })
      } else {
        this.mode = 3
        this.$refs['deviceCategoryEditDiag'].editDeviceCategoryDialog(this.selections[0])
      }
    },
    editDevicedbl: function (device = {}) {
      this.mode = 3
      this.$refs['deviceCategoryEditDiag'].editDeviceCategoryDialog(device)
    },
    // ********************查询设备********************
    search () {
      console.log('search method')
      this.loading = true
      getDeviceCategoryList(this.searchForm)
        .then(
        function (result) {
          let haveChilds = []
          this.tableData = result.data.result
          this.searchForm.totalCount = result.data.totalCount
          if (Array.isArray(this.tableData) && this.tableData.length > 0) {
            this.tableData.forEach(element => {
              if (Array.isArray(element.slave) && element.slave.length > 0) {
                haveChilds.push(element.uuid)
              }
            })
          }
          this.expandRows = haveChilds
          this.loading = false
        }.bind(this)
        )
        .catch(
        function (error) {
          this.loading = false
          console.log(error)
        }.bind(this)
        )
    },
    // 改变分页大小
    sizeChange: function (val) {
      console.log('sizeChange')
      this.searchForm.pageSize = val
      this.searchForm.currentPage = 1
      this.search()
    },
    // 改变当前显示页面
    currentChange: function (val) {
      console.log('currentChange')
      this.searchForm.currentPage = val
      this.search()
    },
    // 查询供应商信息
    getProviders: function () {
      getAllProviders()
        .then(
        function (result) {
          console.log(result.data)
          this.providers = result.data
        }.bind(this)
        )
        .catch(
        function (error) {
          console.log(error)
        }
        )
    },
    // 查询所有的设备
    getParents: function () {
      getDeviceCategories('')
        .then(
        function (result) {
          this.parents = result.data
        }.bind(this)
        )
        .catch(
        function (error) {
          console.log(error)
        }
        )
    },
    // 打开设备属性列表管理页面
    gotoattrmgnt: function () {
      this.$router.push({
        name: 'deviceAttrList'
      })
    },
    // 清除查询表单信息
    clear: function () {
      this.searchForm = {
        uuid: null,
        pageSize: 10,
        currentPage: 1,
        typeCode: '',
        typeName: '',
        typeDesc: '',
        typeModel: '',
        providerCode: ''
      }
    },
    getRowKeys: function (row) {
      return row.uuid
    },
    highlightKeys: function (txt, key) {
      let t = txt
      let k = key
      if (t !== null && t.length > 0 && k !== null && k.length > 0) {
        let temp = t.replace(k, '<span style = "background-color: antiquewhite;">' + k + '</span>')
        return temp
      } else {
        return t
      }
    },
    attatchEventToPager: function (params) {
      const self = this
      let input = self.$refs.pager.$el.querySelectorAll('input')[1]
      addEventHandler(input, 'keyup', function (e) {
        if ((e.keyCode === 13) && (parseInt(input.value) !== self.searchForm.currentPage)) {
          self.currentChange(parseInt(input.value))
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/views/MdmApp/assets/css/index.less";
@import "~@/views/MdmApp/assets/css/font-awesome/css/font-awesome.min.css";
</style>
<style scoped>
@font-face {
  font-family: "FontAwesome";
  src: url("~@/views/MdmApp/assets/css/font-awesome/fonts/fontawesome-webfont.eot?v=4.7.0");
  src: url("~@/views/MdmApp/assets/css/font-awesome/fonts/fontawesome-webfont.eot?#iefix&v=4.7.0")
      format("embedded-opentype"),
    url("~@/views/MdmApp/assets/css/font-awesome/fonts/fontawesome-webfont.woff2?v=4.7.0")
      format("woff2"),
    url("~@/views/MdmApp/assets/css/font-awesome/fonts/fontawesome-webfont.woff?v=4.7.0")
      format("woff"),
    url("~@/views/MdmApp/assets/css/font-awesome/fonts/fontawesome-webfont.ttf?v=4.7.0")
      format("truetype"),
    url("~@/views/MdmApp/assets/css/font-awesome/fonts/fontawesome-webfont.svg?v=4.7.0#fontawesomeregular")
      format("svg");
  font-weight: normal;
  font-style: normal;
}
.el-table {
  border: none;
}
.el-table /deep/ .el-table__expanded-cell[class*="cell"] {
  padding: 0px 0px 0px 50px;
}
.el-table /deep/ .child-row td {
  padding: 0px;
}
</style>
