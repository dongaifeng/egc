import Vue from 'vue'
import Router from 'vue-router'

// 路由文件，引用各业务模块路由
// 引入各业务模块路由数据
import demorouters from '@/views/demo/routers/index'

// 引入用户管理模块路由数据
import userMgmtrouters from '@/views/UserMgmt/login/routers/index'
import userManagementRouters from '@/views/UserMgmt/userManagement/routers/index'
import MapAnalysisApp from '@/views/MapAnalysisApp/routers/index'
// 引人大屏模块路由
import mdmAppRouters from '@/views/MdmApp/routers/index'

// 引入设备管理模块路由数据
import deviceInfoMaintain from '@/views/DeviceMgmt/deviceInfoMaintain/routers/index'
import firmwareUpdate from '@/views/DeviceMgmt/firmwareUpdate/routers/index'
// 引入模型管理模块路由数据
import modelManagementrouters from '@/views/modelManagement/routers/index'

// 引入更新升级模块路由数据
import upgradeMgmt from '@/views/ApplicationUpgrade/ConfigurationMgmt/routers/index'
import sofwarePackageMgmt from '@/views/ApplicationUpgrade/SofwarePackageMgmt/routers/index'
import sofwarePackageDispatch from '@/views/ApplicationUpgrade/SoftwarePackageDispatch/routers/index'
import metaDataMaintance from '@/views/ApplicationUpgrade/MetaDataMaintance/routers/index'
// 引入日志服务组件路由数据
import logServiceComponentrouters from '@/views/LogServiceComponent/routers/index'
// 引入短信网关模块路由数据
import ismgAppIsmgRouters from '@/views/IsmgApp/routers/index'

// 配置路由
Vue.use(Router)
// 定义路由实例
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: '/login',
      component: resolve =>
        require(['@/views/UserMgmt/login/Login.vue'], resolve)
    },
    {
      path: '/401',
      name: '无权访问',
      component: resolve => require(['@/components/error/page401.vue'], resolve)
    },
    {
      path: '/404',
      name: '找不到页面',
      component: resolve => require(['@/components/error/page404.vue'], resolve)
    },
    {
      path: '/home',
      component: resolve => require(['@/components/main/Home.vue'], resolve),
      children: [
        {
          path: '/',
          component: resolve =>
            require(['@/components/main/Index.vue'], resolve)
        },
        ...demorouters,
        ...userMgmtrouters,
        ...userManagementRouters,
        ...MapAnalysisApp,
        ...mdmAppRouters,
        ...deviceInfoMaintain,
        ...firmwareUpdate,
        ...upgradeMgmt,
        ...modelManagementrouters,
        ...logServiceComponentrouters,
        ...sofwarePackageMgmt,
        ...sofwarePackageDispatch,
        ...metaDataMaintance,
        ...ismgAppIsmgRouters
      ]
    }
  ]
})
