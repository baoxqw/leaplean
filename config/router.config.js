import authoritizeRoutes from './routesAuthority.config';

const routesConfig = [
  // user
  {
    path: '/user',
    // component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      /*{ path: '/user/register', component: './User/Register' },
     { path: '/user/register-result', component: './User/RegisterResult' },*/
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 管理员 dashboard
      {
        path: '/dashboard/projectDashboard',
        component: './Dashboard/projectDashboard',
      },

      //平台设置
      {
        path: '/platform',
        icon: 'setting',
        name: 'platform',
        routes: [
          //系统设置
          {
            path: '/platform/sysadmin',
            name: 'sysadmin',
            routes: [
              {
                path: '/platform/sysadmin/useradmin',
                name: 'useradmin',
                component: './Platform/Sysadmin/UserAdmin',
              },
              {
                path: '/platform/sysadmin/roleadmin',
                name: 'roleadmin',
                component: './Platform/Sysadmin/RoleAdmin',
              },
              {
                path: '/platform/sysadmin/registered',
                name: 'registered',
                component: './Platform/Sysadmin/Registered',
              },
            ],
          },
          //基础数据
          {
            path: '/platform/basicdata',
            name: 'basicdata',
            routes: [
              //地区管理
              {
                path: '/platform/basicdata/areaadmin',
                name: 'areaadmin',
                component: './Platform/Basicdata/Areaadmin/Add',
              },
              //客商管理
              {
                path: '/platform/basicdata/businessadmin',
                name: 'businessadmin',
                component: './Platform/Basicdata/BusinessAdmin/BusinessList',
              },
              //部门管理
              {
                path: '/platform/basicdata/dapartmanage',
                name: 'dapartmanage',
                component: './Platform/Basicdata/DapartManage/DapartManagelist',
              },
              //人员档案
              {
                path: '/platform/basicdata/personalfile',
                name: 'personalfile',
                component: './Platform/Basicdata/PersonalFile/PersonalFilelist',
              },
              //编码规则
              {
                path: '/platform/basicdata/coderule',
                name: 'coderule',
                component: './Platform/Basicdata/CodeRule/CodeRule',
              },
              //  物料分类
              {
                path: '/platform/basicdata/itemclass',
                name: 'itemclass',
                component: './Platform/Basicdata/ItemClass/ItemClass',
              },
              //  物料档案
              {
                path: '/platform/basicdata/material',
                name: 'material',
                component: './Platform/Basicdata/Material/Material',
              },
              //工序类型
              {
                path: '/platform/basicdata/processtype',
                name: 'processtype',
                component: './Platform/Basicdata/ProcessType/ProcessType',
              },
              //  计量单位
              {
                path: '/platform/basicdata/measurement',
                name: 'measurement',
                component: './Platform/Basicdata/Measurement/Measurement',
              },
              //工作单元类型
              {
                path: '/platform/basicdata/worktype',
                name: 'worktype',
                component: './Platform/Basicdata/WorkType/WorkType',
              },
              //工作日历明细
              /* {
                 path: '/platform/basicdata/cadetail',
                 name: 'cadetail',
                 hideChildrenInMenu: true,
                 routes: [
                   {
                     path: '/platform/basicdata/cadetail',
                     redirect: '/platform/basicdata/cadetail/list',
                   },
                   {
                     path: '/platform/basicdata/cadetail/list',
                     name: 'list',
                     component: './Platform/Basicdata/CaDetail/CaDetail',
                   },
                 ],
               },*/
              //日历规则
              {
                path: '/platform/basicdata/calendarrule',
                name: 'calendarrule',
                component: './Platform/Basicdata/CalendarRule/CalendarRule',
              },
              //工作日历
              {
                path: '/platform/basicdata/calendar',
                name: 'calendar',
                hideChildrenInMenu: true,
                component: './Platform/Basicdata/Calendar/Calendar',
                routes: [
                  {
                    path: '/platform/basicdata/calendar/add',
                    name: 'add',
                    component: './Platform/Basicdata/Calendar/CalendarAdd',
                  },
                  {
                    path: '/platform/basicdata/calendar/update',
                    name: 'add',
                    component: './Platform/Basicdata/Calendar/CalendarUpdate',
                  },
                  //自定义日历
                  {
                    path: '/platform/basicdata/calendar/costomize',
                    name: 'costomize',
                    component: './Platform/Basicdata/Calendar/Costomize',
                  },
                  //  新增工作日历规则
                  {
                    path: '/platform/basicdata/calendar/newrule',
                    name: 'newrule',
                    component: './Platform/Basicdata/Calendar/NewRule',
                  },
                  //  修改工作日历
                  {
                    path: '/platform/basicdata/calendar/updata',
                    name: 'updata',
                    component: './Platform/Basicdata/Calendar/UpdataCalendar',
                  },
                ],
              },
              //假日类型
              {
                path: '/platform/basicdata/holidaytype',
                name: 'holidaytype',
                component: './Platform/Basicdata/HolidayType/List',
              },
              //假日定义
              {
                path: '/platform/basicdata/defineholiday',
                name: 'defineholiday',
                component: './Platform/Basicdata/DefineHoliday/DefineHolidayDef',
              },
              //设备分类
              {
                path: '/platform/basicdata/equipmentclass',
                name: 'equipmentclass',
                component: './Platform/Basicdata/EquipmentClass/EquipmentClass',
              },
              //设备故障类型
              {
                path: '/platform/basicdata/breaktype',
                name: 'breaktype',
                component: './Platform/Basicdata/BreakType/BreakType',
              },
              //设备状态
              {
                path: '/platform/basicdata/devicestatus',
                name: 'devicestatus',
                component: './Platform/Basicdata/DeviceStatus/list',
              },
              //批次库档案
              {
                path: '/platform/basicdata/batchlibrary',
                name: 'batchlibrary',
                component: './Platform/Basicdata/BatchLibrary/BatchLibrary',
              },
              //项目阶段
              {
                path: '/platform/basicdata/projectstage',
                name: 'projectstage',
                component: './Platform/Basicdata/ProjectStage/ProjectStage',
              },
            ],
          },
          //编码规则
          // {
          //   path: '/platform/processplatform',
          //   name: 'processplatform',
          //   hideChildrenInMenu: true,
          //   routes: [
          //     {
          //       path: '/platform/processplatform',
          //       redirect: '/platform/processplatform/list',
          //     },
          //     {
          //       path: '/platform/processplatform/list',
          //       name: 'list',
          //       component: './Platform/ProcessPlatform/ProcessPlatform',
          //     },
          //   ],
          // },

          //工厂建模
          {
            path: '/platform/factory',
            name: 'factory',
            routes: [
              //工作中心
              {
                path: '/platform/factory/workcenter',
                name: 'workcenter',
                component: './Platform/Factory/WorkCenter/WorkCenter',
              },
              //生产线
              {
                path: '/platform/factory/workline',
                name: 'workline',
                hideChildrenInMenu: true,
                component: './Platform/Factory/Workline/Workline',
              },
              //  区域
              {
                path: '/platform/factory/area',
                name: 'area',
                component: './Platform/Factory/Area/Area',
              },
              //  工位
              {
                path: '/platform/factory/station',
                name: 'station',
                component: './Platform/Factory/Station/Station',
              },
              //  工作单元
              {
                path: '/platform/factory/unitwork',
                name: 'unitwork',
                component: './Platform/Factory/UnitWork/UnitWork',
              },
              //  工厂全景查看
              {
                path: '/platform/factory/factoryview',
                name: 'factoryview',
                component: './Platform/Factory/FactoryView/FactoryView',
              },
              //班组
              {
                path: '/platform/factory/team',
                name: 'team',
                component: './Platform/Factory/Team/Team',
              },
              //仓库档案
              {
                path: '/platform/factory/storefile',
                name: 'storefile',
                component: './Platform/Factory/StoreFile/StoreFile',
              },
              //库位档案
              {
                path: '/platform/factory/repositoryfile',
                name: 'repositoryfile',
                component: './Platform/Factory/RepositoryFile/RepositoryFile',
              },

            ],
          },
          //  产品建模
          {
            path: '/platform/productmodle',
            name: 'productmodle',
            routes: [
              //BOM
              {
                path: '/platform/productmodle/bom',
                name: 'bom',
                component: './Platform/ProductModle/Bom/Bom',
              },
              //  工艺路线
              {
                path: '/platform/productmodle/routing',
                name: 'routing',
                component: './Platform/ProductModle/Routing/Routing',
              },
              //  物料结构信息
              {
                path: '/platform/productmodle/materainfor',
                name: 'materainfor',
                component: './Platform/ProductModle/MateraInfor/MateraInfor',
              },
            ],
          },
          //行业建模
          {
            path: '/platform/industry',
            name: 'industrymodel',
            routes: [
              //型号
              {
                path: '/platform/industry/modeltype',
                name: 'modeltype',
                component: './Platform/Industry/ModelType/ModelType',
              },
              //研制状态
              {
                path: '/platform/industry/preparestatus',
                name: 'preparestatus',
                component: './Platform/Industry/PrepareStatus/PrepareStatus',
              },
              //工作令
              {
                path: '/platform/industry/workorder',
                name: 'workorder',
                routes: [
                  {
                    path: '/platform/industry/workorder/list',
                    name: 'list',
                    component: './Platform/Industry/WorkOrder/WorkOrder',
                  },
                  {
                    path: '/platform/industry/workorder/check',
                    name: 'check',
                    component: './Platform/Industry/WorkOrderCheck/WorkOrderCheck',
                    hideChildrenInMenu: true,
                    routes:[
                      {
                      path: '/platform/industry/workorder/check/detail',
                      name: 'detail',
                      component: './Platform/Industry/WorkOrderCheck/WorkOrderDetail',
                    }
                    ]
                  }
                ],
              },

            ],
          },
          //实施工具
          {
            path: '/platform/contool',
            name: 'contool',
            component: './Platform/Contool/DateIn/DateIn',
          },
          //  流程平台
          {
            path: '/platform/processplatform',
            name: 'processplatform',
            component: './Platform/ProcessPlatform/ProcessPlatform',
          },


          //  数据分析
          {
            path: '/platform/dataanalysis',
            name: 'dataanalysis',
            component: './Platform/DataAnalysis/DataAnalysis',
          },
          //  数据采集
          {
            path: '/platform/datacollect',
            name: 'datacollect',
            component: './Platform/DataCollect/DataCollect',
          },

        ],
      },
      //计划管理
      {
        path: '/planmanagement',
        icon: 'database',
        name: 'planmanagement',
        routes: [
          //投产通知单
          {
            path: '/planmanagement/notifiproduction',
            name: 'notifiproduction',
            component: './PlanManagement/NotifiProduction/NotifiProduction',
          },
          //项目计划
          {
            path: '/planmanagement/planformulation',
            name: 'planformulation',
            component: './PlanManagement/PlanFormulation/PlanFormulation',
          },
          //进度查看
          {
            path: '/planmanagement/progresslook',
            name: 'progresslook',
            component: './PlanManagement/ProgressLook/ProgressLook',
          },
          //任务管理
          {
            path: '/planmanagement/taskmanagement',
            name: 'taskmanagement',
            component: './PlanManagement/TaskManagement/TaskManagement',
          },


          //生产订单
          {
            path: '/planmanagement/productorder',
            name: 'productorder',
            component: './PlanManagement/ProductOrder/ProductOrder',
          },

          //项目执行情况查询
          {
            path: '/planmanagement/projectexecu',
            name: 'projectexecu',
            component: './PlanManagement/ProjectExecu/ProjectExecu',
          },
          //计划导入
          {
            path: '/planmanagement/planleading',
            name: 'planleading',
            component: './PlanManagement/PlanLeading/PlanLeading',
          },
        ],
      },
      //生产执行
      {
        path: '/productexecu',
        icon: 'tool',
        name: 'productexecu',
        routes: [
          //工序计划
          {
            path: '/productexecu/workplan',
            name: 'workplan',
            component: './ProductExecu/WorkPlan/WorkPlan',
          },
          //工序派工
          {
            path: '/productexecu/processdispatch',
            name: 'processdispatch',
            component: './ProductExecu/ProcessDispatch/ProcessDispatch',
          },
          //生产过程管理
          {
            path: '/productexecu/productprocess',
            name: 'productprocess',
            hideChildrenInMenu: true,
            component: './ProductExecu/ProductProcess/ProductProcess',
            routes: [
              {
                path: '/productexecu/productprocess/add',
                name: 'add',
                component: './ProductExecu/ProductProcess/ProductProcessAdd',
              },
              {
                path: '/productexecu/productprocess/update',
                name: 'update',
                component: './ProductExecu/ProductProcess/ProductProcessUpdate',
              },
              {
                path: '/productexecu/productprocess/tasks',
                name: 'tasks',
                component: './ProductExecu/ProductProcess/ProductProcessTasks',
              },
              {
                path: '/productexecu/productprocess/checklist',
                name: 'checklist',
                component: './ProductExecu/ProductProcess/ProductProcessCheckList',
              },
            ],
          },
          //作业指导
          {
            path: '/productexecu/workguidence',
            name: 'workguidence',
            component: './ProductExecu/WorkGuidence/WorkGuidence',
          },
          //队列管理
          {
            path: '/productexecu/queuemanage',
            name: 'queuemanage',
            component: './ProductExecu/QueueManage/QueueManage',
          },
          //  在制品管理
          {
            path: '/productexecu/producting',
            name: 'producting',
            component: './ProductExecu/Producting/Producting',
          },
          //  返修管理
          {
            path: '/productexecu/reworkmanage',
            name: 'reworkmanage',
            component: './ProductExecu/ReworkManage/ReworkManage',
          },
        ],
      },
      //物料管理
      {
        path: '/mattermanage',
        name: 'mattermanage',
        icon: 'switcher',
        routes: [
          {
            path: '/mattermanage/materialneed',
            name: 'materialneed',
            component: './MatterManage/Materialneed/Materialneed',
          },
          //物料申请单
          {
            path: '/mattermanage/materialapproval',
            name: 'materialapproval',
            //hideChildrenInMenu: true,
            routes: [
              //物料申请单列表
              {
                path: '/mattermanage/materialapproval/list',
                name: 'list',
                component: './MatterManage/MaterialApproval/MaterialApproval',
              },
              //物料申请单审核
              {
                path: '/mattermanage/materialapproval/check',
                name: 'check',
                hideChildrenInMenu: true,
                component: './MatterManage/MaterialApprovalCheck/MaterialApprovalCheck',
                routes: [
                  {
                    path: '/mattermanage/materialapproval/check/detail',
                    name: 'detail',
                    component: './MatterManage/MaterialApprovalCheck/MaterialApprovalDetail',
                  },
                ],
              },
            ],
          },
          //物料出库单
          {
            path: '/mattermanage/materialdispatch',
            name: 'materialdispatch',
            component: './MatterManage/MaterialDispatch/MaterialDispatch',
          },
          {
            path: '/mattermanage/piefeed',
            name: 'piefeed',
            component: './MatterManage/PieFeed/PieFeed',
          },
          //完工入库单
          {
            path: '/mattermanage/completedstorage',
            name: 'completedstorage',
            component: './MatterManage/CompletedStorage/CompletedStorage',
          },
          //派料

          //现存量
          {
            path: '/mattermanage/existingstock',
            name: 'existingstock',
            component: './MatterManage/ExistingStock/ExistingStock',
          },
          //库存台账
          {
            path: '/mattermanage/stockaspx',
            name: 'stockaspx',
            component: './MatterManage/StockAspx/StockAspx',
          },
          //出入库流水账
          {
            path: '/mattermanage/issuebook',
            name: 'issuebook',
            component: './MatterManage/IssueBook/IssueBook',
          },
        ],

      },
      //质量管理
      {
        path: '/qualitymanage',
        icon: 'play-square',
        name: 'qualitymanage',
        routes: [
          {
            path: '/qualitymanage/qualitydata',
            name: 'qualitydata',
            component: './QualityManage/QualityData/QualityData',
          },
          //检验方案
          {
            path: '/qualitymanage/testscheme',
            name: 'testscheme',
            component: './QualityManage/TestScheme/TestScheme',
          },
          //超期复验任务
          {
            path: '/qualitymanage/overduetask',
            name: 'overduetask',
            component: './QualityManage/OverdueTask/OverdueTask',
          },
          //试验任务
          {
            path: '/qualitymanage/testwork',
            name: 'testwork',
            hideChildrenInMenu: true,
            component: './QualityManage/TestWork/TestWork',
            routes: [
              {
                path: '/qualitymanage/testwork/sampleenter',
                name: 'sampleenter',
                component: './QualityManage/TestWork/SampleEnter',
              },
            ],
          },
          //质量检验
          {
            path: '/qualitymanage/qualitytest',
            name: 'qualitytest',
            component: './QualityManage/QualityData/QualityData',
          },
          //检验任务
          {
            path: '/qualitymanage/testduty',
            name: 'testduty',
            hideChildrenInMenu: true,
            component: './QualityManage/TestDuty/TestDuty',
            routes: [
              {
                path: '/qualitymanage/testduty/datein',
                name: 'datein',
                component: './QualityManage/TestDuty/DateIn',
              }
            ],
          },
          //  质量问题
          {
            path: '/qualitymanage/qualitissues',
            name: 'qualitissues',
            routes: [
              {
                path: '/qualitymanage/qualitissues/list',
                name: 'list',
                component: './QualityManage/QualitIssues/QualitIssues',
              },
              //质量问题审核
              {
                path: '/qualitymanage/qualitissues/qualitisverify',
                name: 'qualitisverify',
                hideChildrenInMenu: true,
                component: './QualityManage/QualitIssuesVerify/QualitIssuesVerifyList',
                routes: [
                  {
                    path: '/qualitymanage/qualitissues/qualitisverify/qualitissuescheck',
                    name: 'qualitissuescheck',
                    component: './QualityManage/QualitIssuesVerify/QualitIssuesCheck',
                  },
                ],
              },
              //报废审核
              {
                path: '/qualitymanage/qualitissues/scrapreview',
                name: 'scrapreview',
                hideChildrenInMenu: true,
                component: './QualityManage/ScrapReview/ScrapReview',
                routes: [
                  {
                    path: '/qualitymanage/qualitissues/scrapreview/check',
                    name: 'check',
                    component: './QualityManage/ScrapReview/ScrapReviewCheck',
                  },
                ],
              },
            ],
          },
          //质量追溯
          {
            path: '/qualitymanage/qualittraceability',
            name: 'qualittraceability',
            component: './QualityManage/QualitTraceability/QualitTraceability',
          },

          //  质量分析
          {
            path: '/qualitymanage/qualitanalysis',
            name: 'qualitanalysis',
            component: './QualityManage/QualitanAlysis/QualitanAlysis',
          },

        ],
      },
      //生产排程
      {
        path: '/productsched',
        icon: 'fork',
        name: 'productsched',
        routes: [
          {
            path: '/productsched/resouseanaly',
            name: 'resouseanaly',
            component: './ProductSched/ResouseAnaly/ResouseAnaly',
          },

        ],
      },
      //设备管理
      {
        path: '/equipmentmanage',
        icon: 'calendar',
        name: 'equipmentmanage',
        routes: [
          {
            path: '/equipmentmanage/equipmentfiles',
            name: 'equipmentfiles',
            component: './EquipmentManage/EquipmentFiles/EquipmentFiles',
          },
          //设备卡片
          {
            path: '/equipmentmanage/devicecard',
            name: 'devicecard',
            component: './EquipmentManage/DeviceCard/DeviceCard',
          },
          //报修
          {
            path: '/equipmentmanage/productrepair',
            name: 'productrepair',
            hideChildrenInMenu: true,
            component: './EquipmentManage/ProductRepair/ProductRepair',
            routes: [
              {
                path: '/equipmentmanage/productrepair/fillrepair',
                name: 'fillrepair',
                component: './EquipmentManage/ProductRepair/FillRepair',
              },
            ],
          },
          //维修计划
          {
            path: '/equipmentmanage/maintenanceplan',
            name: 'maintenanceplan',
            hideChildrenInMenu: true,
            component: './EquipmentManage/MaintenancePlan/MaintenancePlan',
            routes: [
              {
                path: '/equipmentmanage/maintenanceplan/record',
                name: 'record',
                component: './EquipmentManage/MaintenancePlan/MaintenancePlanRecord',
              },

            ],
          },
          //维修维护
          {
            path: '/equipmentmanage/repair',
            name: 'repair',
            component: './EquipmentManage/Repair/Repair',
          },
          //  备品备件
          {
            path: '/equipmentmanage/spareparts',
            name: 'spareparts',
            component: './EquipmentManage/SpareParts/SpareParts',
          },
          //  设备监控
          {
            path: '/equipmentmanage/monitoring',
            name: 'monitoring',
            component: './EquipmentManage/Monitoring/Monitoring',
          },
          //  设备OEE
          {
            path: '/equipmentmanage/OEE',
            name: 'oee',
            component: './EquipmentManage/OEE/OEE',
          },
        ],
      },
      //绩效管理
      {
        path: '/achievements',
        icon: 'line-chart',
        name: 'achievements',
        routes: [
          {
            path: '/achievements/costanalysis',
            name: 'costanalysis',
            hideChildrenInMenu: true,
            component: './Achievements/CostAnalysis',
          },
        ],
      },
      //现场管理
      {
        path: '/scencemanagement',
        icon: 'export',
        name: 'scencemanagement',
        routes: [
          {
            path: '/scencemanagement/workshopscreen',
            name: 'workshopscreen',
            component: './ScenceManagement/WorkshopScreen/WorkshopScreen',
          },
          //预警监控
          {
            path: '/scencemanagement/earlywarning',
            name: 'earlywarning',
            component: './ScenceManagement/EarlyWarning/EarlyWarning',
          },
        ],
      },
      //文档管理
      {
        path: '/documentmanage',
        name: 'documentmanage',
        icon: 'copy',
        component: './DocumentManage/DocumentManage',
      },
    ],
  },
];

export default routesConfig;
