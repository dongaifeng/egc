<template>
  <div class='ui-common'>
    <div class="search-container">
      <el-form :inline='true' :model='searchAttrForm' ref='searchAttrForm' label-width="70px" style='margin-top: 20px'>
        <el-form-item label='属性编码'>
          <el-input placeholder='请输入属性编码' v-model='searchAttrForm.attrCode' @keyup.enter.native='search' :maxlength="64" clearable></el-input>
        </el-form-item>
        <el-form-item label='属性描述'>
          <el-input placeholder='请输入属性描述' v-model='searchAttrForm.attrDesc' @keyup.enter.native='search' :maxlength="128" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn-container">
            <el-button @click='reset' type='primary' class="cancel-btn">清空</el-button>
            <el-button @click='search' type='primary' class="action-btn">搜索</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div style="margin-top: 15px">
      <el-button @click='addAttr' icon='el-icon-circle-plus-outline' style="margin-center: 10px" plain type="primary">添加</el-button>
    </div>

    <el-table ref='attrTable' :data='attrList' v-loading='attrListLoading' @row-dblclick='editAttrdbl' height="100%" element-loading-text='拼命加载中' style='margin-top: 15px'>
      <el-table-column prop='uuid' label='uuid' v-if='showflag'></el-table-column>
      <el-table-column prop='attrCode' label='属性编码' sortable></el-table-column>
      <el-table-column prop='attrDesc' label='属性描述' sortable></el-table-column>
      <el-table-column prop='attrType' label='属性类型' sortable>
        <template slot-scope="scope">
          <div v-for='at in attrTypes' v-bind:key='at.itemCode'>
            {{scope.row.attrType == at.itemCode ? at.itemName : ''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop='attrDataType' label='数据类型' sortable>
        <template slot-scope="scope">
          <div v-for='adt in attrDataTypes' v-bind:key='adt.itemCode'>
            {{scope.row.attrDataType == adt.itemCode ? adt.itemName : ''}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop='unitDesc' label='单位描述' sortable></el-table-column>
      <el-table-column prop='unitCode' label='单位编码' sortable></el-table-column>
      <el-table-column prop='createTime' label='创建时间' width="180px" sortable></el-table-column>
      <el-table-column prop='createUser' label='创建人' sortable></el-table-column>
      <el-table-column prop='updateTime' label='修改时间' width="180px" sortable></el-table-column>
      <el-table-column prop='updateUser' label='修改人' sortable></el-table-column>
      <el-table-column label='操作'>
        <template slot-scope='scope'>
          <el-button type='text' size='mini' icon="el-icon-edit" @click='editAttrdbl(scope.row)'></el-button>
          <el-button type='text' size='mini' icon="el-icon-delete" @click='delAttr(scope.row)'></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination ref='pager' background :current-page='searchAttrForm.currentPage' :page-sizes='[10, 20, 50, 100]' :page-size='searchAttrForm.pageSize' layout='total, sizes, prev, pager, next, jumper' :total='searchAttrForm.total' @size-change='sizeChange' @current-change='currentChange'>
    </el-pagination>

    <el-dialog :visible.sync='attrDialogVisible' :modal-append-to-body='false' :before-close='closedialog' style="min-width: 750px" :close-on-click-modal="false">
      <div slot='title' class='header-style'>
        <i class='el-icon-edit'></i>{{ title }}</div>
      <el-tabs style="margin-top:-20px" v-model='activeTab'>
        <el-tab-pane label="属性基本信息" name='basic'>
          <div style="padding-left: 30px">
            <el-form :model='attrForm' ref='attrForm' label-width='160px' :rules='attrFormRules' :inline='true'>
              <el-form-item label='属性编码' prop='attrCode'>
                <el-input v-model.trim='attrForm.attrCode' :disabled='disabledflag' :maxlength="64"></el-input>
              </el-form-item>
              <el-form-item label='属性描述' prop='attrDesc'>
                <el-input v-model.trim='attrForm.attrDesc' :disabled='disabledflag' :maxlength="128"></el-input>
              </el-form-item>
              <el-form-item label='属性类型' prop='attrType'>
                <el-select v-model='attrForm.attrType' :disabled='disabledflag'>
                  <el-option v-for='attrType in attrTypes' :key='attrType.itemCode' :value='attrType.itemCode' :label='attrType.itemName'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='数据类型' prop='attrDataType'>
                <el-select v-model='attrForm.attrDataType' :disabled='disabledflag'>
                  <el-option v-for='attrDataType in attrDataTypes' :key='attrDataType.itemCode' :value='attrDataType.itemCode' :label='attrDataType.itemName'></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='单位描述' prop='unitDesc'>
                <el-input v-model.trim='attrForm.unitDesc' :disabled='disabledflag' :maxlength="32"></el-input>
              </el-form-item>
              <el-form-item label='单位编码' prop='unitCode'>
                <el-input v-model.trim='attrForm.unitCode' :disabled='disabledflag' :maxlength="32"></el-input>
              </el-form-item>
            </el-form>
            <div style='text-align: center; '>
              <el-button type='primary' @click='save' class="action-btn" :disabled='disabledflag'>保存</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="属性域信息" name='domain' v-if='attrSaved'>
          <attr-domain-item ref='openAttrDomainDialog' v-bind:attrUuid='attrForm.uuid'></attr-domain-item>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
// 导入设备分类属性的域弹框页面
import AttrDomainItem from './AttrDomainItem'

// 导入各种get，pos等请求方法
import {
  getDeviceAttributes,
  deleteDeviceAttribute,
  insertDeviceAttribute,
  updateDeviceAttribute,
  getDictItem
} from '@/views/MdmApp/apis/index'
import { addEventHandler } from '@/assets/js/util'

export default {
  data () {
    return {
      attrListLoading: false,
      showflag: false,
      attrDialogVisible: false,
      mode: 1,
      selections: [],
      disabledflag: false,
      activeTab: 'basic',
      attrSaved: true,
      menu: null,
      // 检索条件用表单
      searchAttrForm: {
        uuid: '',
        pageSize: 10,
        currentPage: 1,
        total: 0,
        attrCode: '',
        attrDesc: ''
      },
      // 检索返回数据
      attrList: [],
      // 属性类型下拉列表
      attrTypes: [],
      // 属性数据类型下拉列表
      attrDataTypes: [],
      attrForm: {
        uuid: '',
        attrCode: '',
        attrDesc: '',
        attrType: '',
        attrDataType: '',
        unitDesc: '',
        unitCode: ''
      },
      attrFormRules: {
        attrCode: [
          { required: true, message: '请输入属性编码', trigger: 'blur' },
          { max: 64, message: '输入内容应少于64位字符', trigger: 'blur' }
        ],
        attrDesc: [
          { required: true, message: '请输入属性描述', trigger: 'blur' },
          { max: 128, message: '输入内容应少于128位字符', trigger: 'blur' }
        ],
        attrType: [{ required: true, message: '请选择属性类型', trigger: 'change' }],
        attrDataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
        unitDesc: [
          { max: 32, message: '输入内容应少于32位字符', trigger: 'blur' }
        ],
        unitCode: [
          { max: 32, message: '输入内容应少于32位字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    AttrDomainItem
  },
  mounted () {
    this.search()
    this.attatchEventToPager()
    this.getDictData()
  },
  computed: {
    title: function () {
      if (this.mode === 1) {
        return '查看设备属性'
      } else if (this.mode === 2) {
        return '新增设备属性'
      } else if (this.mode === 3) {
        return '修改设备属性'
      }
    }
  },
  methods: {
    // 取得字典数据
    getDictData: function () {
      const ATTR_DATA_TYPE = '19'
      getDictItem({ 'itemType': ATTR_DATA_TYPE })
      .then(res => { this.attrDataTypes = res.data })
      .catch(err => { console.log(err) })

      const ATTR_TYPE = '18'
      getDictItem({ 'itemType': ATTR_TYPE })
      .then(res => { this.attrTypes = res.data })
      .catch(err => { console.log(err) })
    },
    // 根据条件查询设备分类数据到列表中
    search () {
      this.attrListLoading = true
      getDeviceAttributes(this.searchAttrForm)
        .then(
        function (result) {
          console.log('getDeviceAttributes')
          this.attrList = result.data.result
          this.searchAttrForm.total = result.data.totalCount
          this.attrListLoading = false
        }.bind(this)
        )
        .catch(
        function (error) {
          this.attrListLoading = false
          console.log(error)
        }.bind(this)
        )
    },
    // 跳转到设备主数据页面
    gotodevicemgnt: function () {
      this.$router.push({
        name: 'deviceCategoryList'
      })
    },
    // 改变分页大小
    sizeChange: function (val) {
      this.searchAttrForm.pageSize = val
      this.searchAttrForm.currentPage = 1
      this.search()
    },
    // 跳转页面
    currentChange: function (val) {
      this.searchAttrForm.currentPage = val
      this.search()
    },
    // ************************添加属性*****************
    addAttr: function () {
      this.disabledflag = false
      this.mode = 2
      this.clear()
      this.attrForm.uuid = ''
      this.attrDialogVisible = true
      this.attrSaved = false
    },
    // ************************双击修改属性*****************
    editAttrdbl: function (attr = {}) {
      this.mode = 3
      this.attrForm = {
        uuid: attr.uuid,
        attrCode: attr.attrCode,
        attrDesc: attr.attrDesc,
        attrType: attr.attrType,
        attrDataType: attr.attrDataType,
        unitDesc: attr.unitDesc,
        unitCode: attr.unitCode
      }
      this.attrDialogVisible = true
      if (this.attrForm.attrDataType === '3') {
        this.attrSaved = true
      } else {
        this.attrSaved = false
      }
    },
    // 删除属性
    delAttrBatch: function (attr = {}) {
      if (this.selections.length === 0) {
        this.$message({
          message: '请选择要删除的设备属性',
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
        let uuidList = []
        this.selections.forEach((attr) => uuidList.push(attr.uuid))
        deleteDeviceAttribute({ 'value': uuidList }).then(res => {
          this.$message({
            message: '刪除成功!',
            type: 'warning'
          })
          this.search({})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    delAttr: function (attr = {}) {
      this.$confirm('确定要刪除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        let uuidList = []
        uuidList.push(attr.uuid)
        deleteDeviceAttribute({ 'value': uuidList }).then(res => {
          this.$message({
            message: '刪除成功!',
            type: 'success'
          })
          this.search({})
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 保存新增的设备属性或者修改的设备属性
    save: function () {
      this.$refs['attrForm'].validate((valid) => {
        if (valid) {
          var func
          func = this.attrForm.uuid ? updateDeviceAttribute : insertDeviceAttribute
          func(Object.assign({}, this.attrForm)).then(res => {
            this.$message({
              message: '设备类别保存成功!',
              type: 'success'
            })
            this.attrForm.uuid = res.data.uuid
            if (this.attrForm.attrDataType === '3') {
              this.attrSaved = true
            } else {
              this.attrSaved = false
              this.attrDialogVisible = false
            }
            this.search({})
          })
        } else {
          this.$message({
            message: '请填写正确的内容',
            type: 'warning'
          })
          return false
        }
      })
    },
    // 清空新增和修改属性表单
    clear: function () {
      this.attrForm.attrCode = ''
      this.attrForm.attrDesc = ''
      this.attrForm.attrType = ''
      this.attrForm.attrDataType = ''
      this.attrForm.unitDesc = ''
      this.attrForm.unitCode = ''
      this.clearValidate()
    },
    // 清空查询表单
    reset: function () {
      this.searchAttrForm = {
        uuid: '',
        pageSize: 10,
        currentPage: 1,
        attrCode: '',
        attrDesc: ''
      }
    },
    // 清除验证信息
    clearValidate: function () {
      this.$nextTick(() => {
        this.$refs['attrForm'].clearValidate()
      })
    },
    // 关闭当前弹框前执行的方法
    closedialog: function (done) {
      done()
      this.clear()
      this.attrSaved = false
      this.activeTab = 'basic'
    },
    attatchEventToPager: function (params) {
      const self = this
      let input = self.$refs.pager.$el.querySelectorAll('input')[1]
      addEventHandler(input, 'keyup', function (e) {
        if ((e.keyCode === 13) && (parseInt(input.value) !== self.searchAttrForm.currentPage)) {
          self.currentChange(parseInt(input.value))
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/views/MdmApp/assets/css/index.less";
</style>
