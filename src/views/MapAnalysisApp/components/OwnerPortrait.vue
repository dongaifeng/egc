<template>
  <el-dialog title="业主画像数据展示" :visible.sync="dialogVisible" width="70%" class='popup-own' @close="onCloseDialog">
    <el-row>
      <el-col :span="4">
        <div class='court-info'>
          <div>
            <span>小区地址：</span>{{cellDetailsList.regionName}}</div>
          <div>
            <span>小区名称：</span>{{cellDetailsList.courtName}}</div>
          <div>
            <span>户数：</span>{{cellDetailsList.homeCount}}户</div>
          <div>
            <span>房屋总数：</span>{{cellDetailsList.houseCount}}间</div>
          <div>
            <span>占地面积：</span>{{cellDetailsList.floorArea}}平方米</div>
          <div>
            <span>建筑面积：</span>{{cellDetailsList.buildArea}}平方米</div>
        </div>
      </el-col>
      <!-- 表单选择开始 -->
      <el-col :span="20" style="height:600px">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
          <el-row class="table-header" :span="24">
            <el-col :span="4">
              <el-form-item label="楼栋选择">
                <el-select v-model="form.buildValue" placeholder="请选择" size="small" @change='onBuildingSelection'>
                  <el-option v-for="item in form.buildList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="查询项">
                <el-select v-model="parameter.classValue" placeholder="请选择" size="small" @change="onReportLabel">
                  <el-option v-for="item in form.classList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="报表类型">
                <el-select v-model="parameter.reportType" placeholder="请选择" size="small" :disabled='disabled' @change="onReportTypeEvent">
                  <el-option v-for="item in form.reportTypeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开始时间">
                <el-date-picker v-model="startTime" :type="timeType" placeholder="开始时间" style="width:100%" :picker-options="starForbiddenDatetime" size="small" :disabled='disabled' :clearable="clearableDatepick" :editable="editableDatepick" @blur="onTimeJudgment">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间">
                <el-date-picker v-model="endTime" :type="timeType" placeholder="结束时间" style="width:100%" size="small" :picker-options="endForbiddenDatetime" :disabled='disabled' :clearable="clearableDatepick" :editable="editableDatepick" @blur="onTimeJudgment">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align:right;margin-top:10px;">
              <el-button type="primary" @click.native="onInquireData">查询</el-button>
              <el-button type="success" :plain="tableOrMap!=='0'" @click.native="onGoTable">表单</el-button>
              <el-button type="danger" :plain="tableOrMap!=='1'" @click.native="onGoMap">图表</el-button>
            </el-col>
          </el-row>
        </el-form>
        <!-- 表单选择结束 -->
        <!-- 业主人数显示 -->
        <div class="show" v-show='isOwner'>
          <!-- 表格展示 -->
          <div v-if="isOwenrTable" style="width:100%">
            <el-table :data="ownerTableData" width="100%" height="420" stripe>
              <el-table-column style="width:100%" prop="group" label="年龄段">
              </el-table-column>
              <el-table-column style="width:100%" prop="countNum" label="人数">
              </el-table-column>
            </el-table>
          </div>
          <!-- 图表展示 -->
          <div v-show="isOwenrMap" class="canvas-owner">
            <div id="owner-formation" class='map'></div>
            <img v-show='isErrData' :src='perErrImg' />
          </div>
        </div>
        <!-- 出入频率显示 -->
        <div class="show" v-show='isRate'>
          <!-- 表格展示 -->
          <div v-show='isRateTable' width="100%">
            <el-table :data='rateTableData' width="100%" height="380" stripe>
              <el-table-column style="width:100%" prop="timeGroup" label="时间">
              </el-table-column>
              <el-table-column style="width:100%" prop="inCount" label="进入次数">
              </el-table-column>
              <el-table-column style="width:100%" prop="outCount" label="出去次数">
              </el-table-column>
            </el-table>
            <el-pagination class="table-pager" background :current-page="parameter.currentPage" :page-sizes="[10, 20, 30, 50, 100]" :page-size="parameter.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="onSizeChange" @current-change="onCurrentChange">
            </el-pagination>
          </div>
          <!-- 图表展示  -->
          <div v-show="isRateMap" class="canvas-rate" style="width:98%">
            <div id="rate-formation" class='map'></div>
            <img v-show='isErrData' :src='perErrImg' />
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import optionsData from '@/views/MapAnalysisApp/assets/js/owneroptions.js'
import { getCourtInfo, getCourtProfile, getBuildProfile } from '@/views/MapAnalysisApp/apis/index'
import errImg from '@/views/MapAnalysisApp/assets/images/err.png'
import LOG_TAG from '@/views/MapAnalysisApp/assets/js/mapanalysislog.js'
export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        buildList: [], // 楼栋选择
        buildValue: '', // 默认选中小区
        classList: [{ // 业主或出入频率选择
          value: '1',
          label: '业主人数'
        }, {
          value: '2',
          label: '出入频率'
        }],
        reportTypeList: [{ // 报表选择
          value: '0',
          label: '日报'
        }, {
          value: '1',
          label: '月报'
        }, {
          value: '2',
          label: '年报'
        }]
      },
      cellDetailsList: {}, // 小区信息
      courtId: '', // 小区ID
      buildId: '', // 楼栋ID
      tempId: '', // 中间ID
      parameter: {
        courtUuid: '', // 小区ID
        classValue: '1', // 默认业主
        reportType: '0', // 默认日报
        currentPage: 1, // 默认第一页
        pageSize: 10, // 默认每页条数
        startDate: null,
        endDate: null
      },
      total: 10, // 总条数
      disabled: true, // 业主默认报表,时间不可选
      startTime: new Date(new Date().setDate(new Date().getDate() - 6)), // 默认开始时间
      endTime: new Date(), // 结束时间
      starForbiddenDatetime: { // 限制开始时间选择器
        disabledDate: (time) => {
          return time.getTime() > this.endTime
        }
      },
      endForbiddenDatetime: { // 限制结束时间选择器
        disabledDate: (time) => {
          return time.getTime() > new Date() || time.getTime() < this.startTime
        }
      },
      timeType: 'date', // 日期type属性
      myOwenrChart: null, // 业主echarts
      myRateChart: null, // 出入频率echarts
      ownerTableData: [], // 业主表格数据
      owerMapData: { ageGroupInfo: [], sexInfo: [] }, // 业主图表格数据
      rateTableData: [], // 出入频率表格数据
      rateMapData: { // 出入频率图表数据
        dateList: [], // 日期集合
        perInCountList: [], // 入园人数集合
        perOutCountList: [] // 出园人数集合
      },
      perErrImg: errImg, // 图表错误提示
      isErrData: false,
      clearableDatepick: false,
      editableDatepick: false,
      isOwner: true, // 默认显示业主人数
      isRate: false, // 显示出入频率
      isOwenrTable: true, // 默认显示业主表格
      isOwenrMap: false, // 显示业主图表
      isRateTable: false, // 显示出入频率表格
      isRateMap: false, // 显示出入频率图表
      isRequest: true, // 时间选择是否正确,
      clickTap: false, // 控制数据未变重复点击(图表)
      clickTable: false, // 控制数据未变重复点击(表格)
      myChartContainer: null,
      tableOrMap: '0', // 控制当前是表格还是图表
      flagVal: '1', // 业主或出入频率条件
      flag: false // 控制业主图表重复点击
    }
  },
  methods: {
    /**
     * @description 进入业主弹窗
     * @param {String} courtId 小区id
     */
    ownerPortrait (courtId) {
      this.dialogVisible = true
      this.disabled = true
      this.form.buildList = []
      this.parameter.courtUuid = courtId
      this.courtId = courtId
      getCourtInfo({ courtUuid: courtId, type: 0 }) // 获取小区详细信息
        .then(res => {
          let result = res.data.data
          this.cellDetailsList = result
          this.form.buildList.unshift({ value: result.courtUuid, label: result.courtName })
          console.log(LOG_TAG + '获取到小区名并插入到列表')
          this.form.buildValue = result.courtUuid
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err
          })
        })
      let queryParams = {
        courtUuid: this.parameter.courtUuid,
        currentPage: this.parameter.currentPage,
        pageSize: this.parameter.pageSize,
        startTime: this.processingDate(this.startTime),
        endTime: this.processingDate(this.endTime),
        type: 0
      }
      getCourtProfile(queryParams) // 获取小区楼栋
        .then(res => {
          if (res.data.code === '00000') {
            res.data.data.buildInfo.map(item => {
              this.form.buildList.push({
                value: item.uuid,
                label: item.memo.slice(item.memo.indexOf(' ') + 1)
              })
            })
            console.log(LOG_TAG + '获取到小区楼栋名并插入到列表')
          }
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err
          })
        })
      this.getCourtTableData(courtId) // 获取小区业主年龄段
    },
    /**
     * @description 楼栋选择
     * @param {String} id 选中的数据ID
     */
    onBuildingSelection (id) {
      this.tempId = id
      if (id !== this.courtId) { // 选中的是楼栋
        this.buildId = id
      }
    },
    /**
     * @description 报表选择
     * @param {String} val 选中的报表类型
     */
    onReportTypeEvent (val) {
      switch (val) {
        case '0':
          this.timeType = 'date'
          this.startTime = new Date(new Date().setDate(new Date().getDate() - 6)) // 默认开始时间
          this.endTime = new Date()
          break
        case '1':
          this.timeType = 'date'
          this.startTime = new Date(this.endTime.getTime() - 86400000 * 30)
          break
        case '2':
          this.timeType = 'month'
          this.startTime = new Date(this.endTime.getTime() - 86400000 * 365)// 默认开始时间
          break
        default:
          break
      }
    },
    /**
     * @description 切换到表格显示
     */
    onGoTable () {
      console.log(LOG_TAG + '切换到表格显示')
      this.tableOrMap = '0'
      switch (this.flagVal) {
        case '1': // 选择业主人数
          this.isOwenrTable = true
          this.isOwenrMap = false
          let tableHeader = document.querySelector('.el-table__header')
          let tableBody = document.querySelector('.el-table__body')
          tableHeader.style.width = '100%'
          tableBody.style.width = '100%'
          if (!this.clickTable) { // 控制多次点击
            return
          }
          this.clickTable = false
          if (this.tempId !== this.courtId && this.tempId !== '') {
            this.getBuildOwnerTableData() // 获取楼栋表格
          } else { // 获取小区表格
            this.getCourtTableData(this.courtId)
          }
          break
        case '2': // 选择出入频率
          this.isRateTable = true
          this.isRateMap = false
          if (!this.clickTable) { // 控制多次点击
            return
          }
          this.clickTable = false
          if (this.tempId !== this.courtId && this.tempId !== '') {
            this.getBuildRateTableData() // 获取楼栋表格
          } else {
            this.getRateTableData() // 获取小区表格
          }
          break
        default:
          break
      }
    },
    /**
     * @description 切换每页条数
     * @param {Number} pageSize 每页条数
     */
    onSizeChange (pageSize) {
      if (!this.parameter.courtUuid) return
      this.parameter.pageSize = pageSize
      this.parameter.currentPage = 1
      if (this.tempId !== this.courtId && this.tempId !== '') {
        this.getBuildRateTableData() // 获取楼栋表格
      } else {
        this.getRateTableData() // 获取小区表格
      }
    },
    /**
     * @description 切换当前页
     * @param {Number} currentPage 当前页数
     */
    onCurrentChange (currentPage) {
      if (!this.parameter.courtUuid) return
      console.log(LOG_TAG + '当前页数:' + currentPage)
      this.parameter.currentPage = currentPage
      if (this.tempId !== this.courtId && this.tempId !== '') {
        this.getBuildRateTableData() // 获取楼栋表格
      } else {
        this.getRateTableData() // 获取小区表格
      }
    },
    /**
     * @description 切换到图表显示
     */
    onGoMap () {
      console.log(LOG_TAG + '切换到图表显示')
      this.tableOrMap = '1'
      switch (this.flagVal) {
        case '1': // 选择业主人数
          this.isOwenrTable = false
          this.isOwenrMap = true
          if (this.flag) { // 控制多次点击
            return
          }
          this.flag = true
          if (this.tempId !== this.courtId && this.tempId !== '') {
            this.getBuildOwnerTableData() // 获取楼栋图表数据
          } else {
            this.getCourtTableData(this.courtId) // 获取小区图表数据
          }
          break
        case '2': // 选择出入频率
          this.isRateTable = false
          this.isRateMap = true
          optionsData.rateOptionData.series[0].areaStyle.normal = { // option配置
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(199, 237, 250,0.7)'
            }, {
              offset: 1,
              color: 'rgba(199, 237, 250,0.5)'
            }], false)
          }
          optionsData.rateOptionData.series[1].areaStyle.normal = {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(216, 244, 247,1)'
            }, {
              offset: 1,
              color: 'rgba(216, 244, 247,1)'
            }], false)
          }
          if (!this.clickTap) { // 控制多次点击
            return
          }
          this.clickTap = false
          if (this.tempId !== this.courtId && this.tempId !== '') {
            this.getBuildMapData() // 获取楼栋图表数据
          } else {
            this.getCourtMapData() // 获取小区图表数据
          }
          break
        default:
          break
      }
    },
    /**
     * @description 是否禁用时间
     * @param {String} type 1表示禁用，2可用
     */
    onReportLabel (type) {
      switch (type) {
        case '1':
          this.isRequest = true
          this.disabled = true
          break
        case '2':
          this.disabled = false
          this.parameter.startDate = this.processingDate(this.startTime) // 对日期赋值
          this.parameter.endDate = this.processingDate(this.endTime)
          break
        default:
          break
      }
    },
    /**
     * @description 判断选择的时间是否符合要求
     */
    onTimeJudgment () {
      switch (this.parameter.reportType) {
        case '0':
          if (this.endTime.getTime() - this.startTime.getTime() > 30 * 24 * 3600 * 1000) {
            this.isRequest = false
            this.$message({
              type: 'error',
              message: '日报查询范围为1个月'
            })
          } else {
            this.isRequest = true
          }
          break
        case '1':
          if (this.endTime.getTime() - this.startTime.getTime() > 365 * 24 * 3600 * 1000) {
            this.isRequest = false
            this.$message({
              type: 'error',
              message: '月报查询范围为1年'
            })
          } else {
            this.isRequest = true
          }
          break
        case '2':
          this.isRequest = true
          break
        default:
          break
      }
    },
    /**
     * @description 处理日期对象
     * @param {Object} date 日期对象
     * @returns {String} 返回日期 xxxx-xx-xx
     */
    processingDate (date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return year + '-' + month + '-' + day
    },
    /**
     * @description 屏幕变化重置echarts方法
     * @param {String} dom 图表dom
     * @param {String} canvas 图表容器
     * @param {Object} myContainer 重置容器高宽
     * @param {Object} echarts 图表
     */
    resizeEcharts (dom, canvas, myContainer, echarts) {
      let myChartNode = document.querySelector(dom)
      let canvasNode = document.querySelector(canvas)
      // 自适应宽
      setTimeout(() => {
        myContainer = function () {
          // 处理IE获取不到canvas.offsetWidth的问题
          myChartNode.style.width = canvasNode.offsetWidth === 0 ? '900px' : canvasNode.offsetWidth + 'px'
        }
        myContainer()
        echarts.resize()
      })
      // 屏幕宽度发生改变时重置容器高宽
      window.onresize = () => {
        myContainer()
        echarts.resize()
      }
    },
    /**
     * @description 点击查询
     */
    onInquireData () {
      this.clickTap = true // 控制重复点击图表
      this.clickTable = true
      this.flagVal = this.parameter.classValue
      this.flag = false
      this.parameter.currentPage = 1 // 重置第一页
      switch (this.flagVal) {
        case '1': // 选择业主人数
          this.isOwner = true
          this.isRate = false
          if (this.tableOrMap === '0') { // 当前是表格
            this.onGoTable()
          } else { // 当前是图表
            this.onGoMap()
          }
          break
        case '2': // 选择出入频率
          this.onTimeJudgment()
          if (!this.isRequest) {
            return
          }
          this.isRate = true
          this.isOwner = false
          this.parameter.startDate = this.processingDate(this.startTime)
          this.parameter.endDate = this.processingDate(this.endTime)
          if (this.tableOrMap === '0') { // 当前是表格
            this.onGoTable()
          } else { // 当前是图表
            this.onGoMap()
          }
          break
        default:
          break
      }
    },
    /**
     * @description 业主图表赋值
     */
    owenrChart () {
      optionsData.owenrOptionData.legend.data = this.owerMapData.ageGroupInfo.map(item => {
        return item.group
      })
      optionsData.owenrOptionData.series[1].data = this.owerMapData.ageGroupInfo.map(item => {
        return { value: item.countNum, name: item.group }
      })
      if (this.owerMapData.sexInfo.length) {
        optionsData.owenrOptionData.series[0].data = [{
          value: this.owerMapData.sexInfo[0].femaleOwner,
          name: '女',
          selected: true
        }, {
          value: this.owerMapData.sexInfo[0].maleOwner,
          name: '男'
        }]
      } else {
        optionsData.owenrOptionData.series[0].data = []
      }
      this.myOwenrChart = this.$echarts.init(document.getElementById('owner-formation'))
      this.myOwenrChart.setOption(optionsData.owenrOptionData)
      this.resizeEcharts('#owner-formation', '.canvas-owner', this.myChartContainer, this.myOwenrChart)
    },
    /**
     * @description 关闭弹窗（初始化数据）
     */
    onCloseDialog () {
      console.log(LOG_TAG + '关闭弹窗')
      this.isOwner = true
      this.isRate = false
      this.isOwenrTable = true
      this.isOwenrMap = false
      this.isRateTable = false
      this.isRateMap = false
      this.isRequest = true
      this.clickTap = false
      this.clickTable = false
      this.tableOrMap = '0'
      this.flagVal = '1'
      this.flag = false
      this.parameter = {
        courtUuid: '',
        classValue: '1',
        reportType: '0',
        currentPage: 1,
        pageSize: 10,
        startDate: null,
        endDate: null
      }
      this.ownerTableData = []
      this.isErrData = false
    },
    /**
     * @description 获取小区表格（业主人数）
     * @param {String} courtId 小区id
     */
    getCourtTableData (courtId) {
      getCourtProfile({ courtUuid: courtId, type: 1 })
        .then(res => {
          if (res.data.code === '00000') {
            console.log(LOG_TAG + '获取小区表格（业主人数')
            this.isErrData = false
            let ageGroupInfo = res.data.data.ageGroupInfo
            let num = 0
            let ageGroup = []
            for (let i = 0; i < ageGroupInfo.length; i++) {
              if (Number(ageGroupInfo[i].group.slice(0, ageGroupInfo[i].group.indexOf('-'))) >= 80) {
                num += ageGroupInfo[i].countNum
                if (i === ageGroupInfo.length - 1) {
                  ageGroup.push({
                    countNum: num,
                    group: '80以上'
                  })
                }
              } else {
                ageGroup.push(ageGroupInfo[i])
              }
            }
            this.ownerTableData = ageGroup
            this.owerMapData = {
              ageGroupInfo: ageGroup,
              sexInfo: res.data.data.sexInfo
            }
            if (this.tableOrMap === '1') {
              this.owenrChart()
            }
          }
        }).catch(err => {
          this.isErrData = true
          this.$message({
            type: 'warning',
            message: err
          })
        })
    },
    /**
     * @description 获取小区表格（出入频率）
     */
    getRateTableData () {
      let parmas = {
        courtUuid: this.parameter.courtUuid,
        reportType: this.parameter.reportType,
        currentPage: this.parameter.currentPage,
        pageSize: this.parameter.pageSize,
        startTime: this.parameter.startDate,
        endTime: this.parameter.endDate,
        type: 2
      }
      getCourtProfile(parmas)
        .then(res => {
          if (res.data.code === '00000') {
            this.rateTableData = res.data.data.flow
            this.total = res.data.data.totalRows
          }
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err
          })
        })
    },
    /**
     * @description 获取楼栋表格(出入频率)
     */
    getBuildRateTableData () {
      let parmas = {
        courtUuid: this.parameter.courtUuid,
        buildId: this.buildId,
        reportType: this.parameter.reportType,
        currentPage: this.parameter.currentPage,
        pageSize: this.parameter.pageSize,
        startTime: this.parameter.startDate,
        endTime: this.parameter.endDate,
        type: 2
      }
      getBuildProfile(parmas)
        .then(res => {
          if (res.data.code === '00000') {
            this.rateTableData = res.data.data.flow
            this.total = res.data.data.totalRows
          }
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err
          })
        })
    },
    /**
     * @description 获取楼栋表格(业主人数)
     */
    getBuildOwnerTableData () {
      getBuildProfile({ courtUuid: this.courtId, buildId: this.buildId, type: 1 })
        .then(res => {
          if (res.data.code === '00000') {
            this.isErrData = false
            let ageGroupInfo = res.data.data.ageGroupInfo
            let num = 0
            let ageGroup = []
            for (let i = 0; i < ageGroupInfo.length; i++) {
              if (Number(ageGroupInfo[i].group.slice(0, ageGroupInfo[i].group.indexOf('-'))) >= 80) {
                num += ageGroupInfo[i].countNum
                if (i === ageGroupInfo.length - 1) {
                  ageGroup.push({
                    countNum: num,
                    group: '80以上'
                  })
                }
              } else {
                ageGroup.push(ageGroupInfo[i])
              }
            }
            this.ownerTableData = ageGroup
            this.owerMapData = {
              ageGroupInfo: ageGroup,
              sexInfo: res.data.data.sexInfo
            }
            if (this.tableOrMap === '1') {
              this.owenrChart()
            }
          }
        }).catch(err => {
          this.isErrData = true
          this.$message({
            type: 'warning',
            message: err
          })
        })
    },
    /**
     * @description 获取小区图表数据(出入频率)
     */
    getCourtMapData () {
      let parmas = {
        courtUuid: this.parameter.courtUuid,
        reportType: this.parameter.reportType,
        currentPage: this.parameter.currentPage,
        startTime: this.parameter.startDate,
        endTime: this.parameter.endDate,
        type: 2
      }
      getCourtProfile(parmas)
        .then(res => {
          if (res.data.code === '00000') {
            console.log(LOG_TAG + '获取小区图表数据(出入频率)')
            this.isErrData = false
            this.rateMapData.dateList = res.data.data.flow.map(item => {
              return item.timeGroup
            })
            this.rateMapData.perInCountList = res.data.data.flow.map(item => {
              return item.inCount
            })
            this.rateMapData.perOutCountList = res.data.data.flow.map(item => {
              return item.outCount
            })
            this.total = res.data.data.totalRows
            optionsData.rateOptionData.xAxis.data = this.rateMapData.dateList
            optionsData.rateOptionData.series[0].data = this.rateMapData.perInCountList
            optionsData.rateOptionData.series[1].data = this.rateMapData.perOutCountList
            this.myRateChart = this.$echarts.init(document.getElementById('rate-formation'))
            this.myRateChart.setOption(optionsData.rateOptionData)
          }
          this.resizeEcharts('#rate-formation', '.canvas-rate', this.myChartContainer, this.myRateChart)
        }).catch(err => {
          this.isErrData = true
          this.$message({
            type: 'warning',
            message: err
          })
        })
    },
    /**
     * @description 获取楼栋图表数据(出入频率)
     */
    getBuildMapData () {
      let parmas = {
        courtUuid: this.parameter.courtUuid,
        buildId: this.buildId,
        reportType: this.parameter.reportType,
        currentPage: this.parameter.currentPage,
        startTime: this.parameter.startDate,
        endTime: this.parameter.endDate,
        type: 2
      }
      getBuildProfile(parmas)
        .then(res => {
          if (res.data.code === '00000') {
            console.log(LOG_TAG + '获取楼栋图表数据(出入频率)')
            this.isErrData = false
            this.rateMapData.dateList = res.data.data.flow.map(item => {
              return item.timeGroup
            })
            this.rateMapData.perInCountList = res.data.data.flow.map(item => {
              return item.inCount
            })
            this.rateMapData.perOutCountList = res.data.data.flow.map(item => {
              return item.outCount
            })
            this.total = res.data.data.totalRows
            optionsData.rateOptionData.xAxis.data = this.rateMapData.dateList
            optionsData.rateOptionData.series[0].data = this.rateMapData.perInCountList
            optionsData.rateOptionData.series[1].data = this.rateMapData.perOutCountList
            this.myRateChart = this.$echarts.init(document.getElementById('rate-formation'))
            this.myRateChart.setOption(optionsData.rateOptionData)
          }
          this.resizeEcharts('#rate-formation', '.canvas-rate', this.myChartContainer, this.myRateChart)
        }).catch(err => {
          this.isErrData = true
          this.$message({
            type: 'warning',
            message: err
          })
        })
    }
  }
}
</script>
<style lang='less' scoped>
.popup-own {
  /deep/.el-dialog {
    min-width: 710px;
  }
  /deep/.table-pager {
    padding: 0;
    padding-right: 10px;
    text-align: right;
    position: absolute;
    right: 60px;
    bottom: 35px;
  }
  /deep/.el-dialog__header {
    .el-dialog__title {
      font-weight: 600;
      line-height: 24px;
      font-size: 18px;
      color: #303133;
    }
  }
  /deep/.court-info {
    padding: 0 10px;
    margin-right: 10px;
    line-height: 30px;
    font-size: 14px;
    div {
      span {
        color: #150e0e;
        text-align-last: justify;
        display: inline-block;
        text-align: justify;
        width: 75px;
      }
    }
  }
  /deep/.block {
    float: left;
    margin-right: 40px;
  }
  /deep/.el-form-item__label {
    padding: 0;
  }
  /deep/.el-form-item {
    margin: 0;
  }
  /deep/.show {
    border: 1px solid #eee;
    padding: 10px 0 5px 5px;
    height: 430px;
    margin-top: 10px;
  }
  /deep/.table-header .el-col {
    padding-right: 10px;
    vertical-align: top;
  }
  /deep/.table-header .el-input__inner {
    vertical-align: middle;
  }
}
.canvas-owner,
.canvas-rate {
  position: relative;
  img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .map {
    width: 100%;
    height: 430px;
  }
}
</style>

