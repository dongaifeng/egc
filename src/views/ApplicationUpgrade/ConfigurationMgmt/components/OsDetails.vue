<template>
  <div>
    <!-- 操作系统	序号	省（直辖市）	市/区	小区名称	操作系统名称	操作系统版本（服务包）	操作系统位数	服务器主机名称	描述	
        所在服务器UUID	操作系统提供者 -->
    <el-form :inline="true" :model="osDetails">
      <template v-if=" osDetails.courtDto !== null">
        <el-form-item label="省（直辖市）" :label-width="formLabelWidth">
          <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.courtDto.province"></el-input>
        </el-form-item>
        <el-form-item label="市" :label-width="formLabelWidth">
          <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.courtDto.city"></el-input>
        </el-form-item>
        <el-form-item label="区" :label-width="formLabelWidth">
          <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.courtDto.district"></el-input>
        </el-form-item>
        <el-form-item label="小区名称" :label-width="formLabelWidth">
          <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.courtDto.name"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="操作系统名称" :label-width="formLabelWidth">
        <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.name"></el-input>
      </el-form-item>
      <el-form-item label="操作系统版本（服务包）" :label-width="formLabelWidth">
        <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.version"></el-input>
      </el-form-item>
      <el-form-item label="操作系统位数" :label-width="formLabelWidth">
        <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.dataLength"></el-input>
      </el-form-item>
      <el-form-item label="服务器主机名称" :label-width="formLabelWidth">
        <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.hostname"></el-input>
      </el-form-item>
      <el-form-item label="所在服务器UUID" :label-width="formLabelWidth">
        <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.uuid"></el-input>
      </el-form-item>
      <el-form-item label="操作系统提供者" :label-width="formLabelWidth">
        <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.updateUser"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input class="upgrade_el-input" :disabled="isInptDisabled" v-model="osDetails.remark"></el-input>
      </el-form-item>
      <template v-if="osDetails.extDataList !== null">
        <el-form-item :label="item.fieldName" v-for="item in osDetails.extDataList" :key="item.fieldName" :label-width="formLabelWidth">
          <el-input class="upgrade_el-input" v-model="item.fieldValue" :disabled="isInptDisabled"></el-input>
        </el-form-item>
      </template>
    </el-form>
     <div style="text-align: center">
       <el-button type="primary" @click="closeDialog" class="cancel-btn">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    osDetails: {
      type: Object
    }
  },
  data () {
    return {
      formLabelWidth: '160px',
      isInptDisabled: true
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialogEvent')
    }
  },
  watch: {
    osDetails (newValue, oldValue) {
      this.osDetails = newValue
    }
  }
}
</script>
