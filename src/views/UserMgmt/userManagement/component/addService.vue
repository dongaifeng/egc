<template>
  <div class = "ui-common">
    <el-row align="left">
        <el-form align="left" :inline="true">
          <el-form-item label="所属应用 ">
            <el-select v-model='appResource' @visible-change='getAppList' placeholder='请选择所属应用' >
              <el-option v-for="appResourceOpt in appResourceList" :key="appResourceOpt.appCode" :label="appResourceOpt.resourceName" :value="appResourceOpt.appCode"> </el-option>
            </el-select>
         </el-form-item>
          <el-form-item label="　　服务名称">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" v-model="searchServiceTxt" class="filter-item" placeholder="请输入服务名称"></el-input>
          </el-form-item>
          <el-form-item style="float:right">
            <el-button class="action-btn" type="primary" @click="handleFilter" style="margin-left:20px;">查询</el-button>
          </el-form-item>
        </el-form>
    </el-row>
    <div v-show="showGrid">
    <el-table
      ref="multipleTable"
      :data="tableData" 
      style="margin-top: 10px"
      @selection-change="handleSelectionChange">
      <el-table-column
        label="选择"
        type="selection"
        >
      </el-table-column>
      <el-table-column        
        v-for="(item, index) in params"
        :label="item.title"
        :prop="item.prop"
        :key="index"
        >
      </el-table-column>
    </el-table>
    <el-pagination layout="total, sizes, prev, pager, next, jumper" 
                   :total="total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :page-sizes="[5,10,15]"
                   :page-size="pageSize"
                   :current-page="currentPage"
                   style="margin-top:10px">
    </el-pagination>
    <el-row align="center" style="margin-top:10px">
      <el-col align="center">
        <span class="dialog-footer">
          <el-button class='cancel-btn' style='margin-left: 10px; ' @click='cancelEvent' type='primary'>取消</el-button>
          <el-button class='action-btn' style='margin-top: 15px; ' @click='handleSave' type='primary'>保存</el-button>
        </span>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
import {
  getResourceList,
  getServiceListPage
} from '@/views/UserMgmt/userManagement/apis'
import '../assets/css/usermanagement.less'
export default {
  props: {
    form: {
      roleName: undefined,
      remark: undefined,
      uuid: undefined
    }
  },
  data () {
    return {
      appResourceList: undefined,
      appResource: '',
      treeData: [],
      searchServiceTxt: '',
      items: [],
      defaultProps: {
        children: 'children',
        label: 'resourceName'
      },
      currentPage: 1,
      total: 0,
      pageSize: 10,
      listPageParm: {
        cloudFlag: '1',
        resourceType: '3',
        appCode: '',
        delAuthority: true,
        roleUuid: this.form.uuid,
        resourceName: '',
        currentPage: '1',
        pageSize: '10'
      },
      emptyData: {
        appCode: '',
        resourceName: ''
      },
      appVal: '1',
      serviceVal: '3',
      showGrid: true,
      tabPlaceholder: undefined,
      selectedName: null,
      tableData: undefined,
      serviceCount: 0,
      roleServiceList: undefined,
      multipleSelection: undefined,
      params: [
        {
          title: '应用名称',
          prop: 'appName'
        },
        {
          title: '服务名称',
          prop: 'resourceName'
        },
        {
          title: '服务URI',
          prop: 'resourceUrl'
        }
      ]
    }
  },
  methods: {
    getAppList () {
      var resourceQuery = {type: this.appVal, cloudFlag: 1}
      getResourceList(resourceQuery)
        .then(
            function (result) {
              result.unshift(this.emptyData)
              this.appResourceList = result
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    mounted () {
      this.loadData()
    },
    getServiceList () {
      this.listPageParm.appCode = this.appResource
      this.listPageParm.resourceName = this.searchServiceTxt
      this.listPageParm.roleUuid = this.form.uuid
      getServiceListPage(this.listPageParm)
        .then(
            function (result) {
              this.tableData = result.resource
              this.total = result.pageCount
            }.bind(this)
          )
        .catch(
          function (error) {
            console.log(error)
          }
        )
    },
    cancelEvent () {
      this.$emit('canelDialogEvent')
    },
    handleSave () {
      if (this.multipleSelection && (this.multipleSelection.length > 0)) {
        this.items = []
        for (let index = 0; index < this.multipleSelection.length; index++) {
          const data = this.multipleSelection[index]
          this.items.push({
            actionType: '1',
            authority: true,
            authorityType: '1',
            courtUuid: '',
            desc: '',
            houseOrgCode: '',
            houseOrgName: '',
            logicalAddress: '',
            resourceName: '',
            resourceType: '3',
            resourceTypeName: '',
            resourceUrl: '',
            resourceUuid: data.uuid,
            roleName: '',
            roleUuid: this.form.uuid,
            uuid: ''
          })
        }
        this.$emit('createServiceAuthorityEvent', this.items)
      } else {
        this.$msgbox({
          title: '消息',
          message: '请选择至少一个服务'}
          )
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 改变分页大小
    handleSizeChange (val) {
      this.pageSize = val
      this.listPageParm.pageSize = this.pageSize
      this.listPageParm.currentPage = this.currentPage
      this.getServiceList()
    },
    // 跳转页数
    handleCurrentChange (val) {
      this.currentPage = val
      this.listPageParm.pageSize = this.pageSize
      this.listPageParm.currentPage = this.currentPage
      this.getServiceList()
    },
    handleFilter () {
      this.getServiceList()
    },
    refresh () {
      this.handleFilter()
    },
    reset () {
      this.appResource = ''
      this.searchServiceTxt = ''
      this.total = 0
      this.pageSize = 5
      if (this.tableData.length > 0) {
        this.tableData = []
      }
    }
  }
}
</script>
<style scoped>
</style>