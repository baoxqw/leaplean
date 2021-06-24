
function content(title,data){
  return `关键字可以是: ${title}等部分或全部内容,比如输入:'${data}' 可以查询到所有包含'${data}'的记录`
}

export default {
  user:content("编号,名称,","手机号","13122179125"),
  role:content("编号,名称","管理员"),
  BusinessList: content("编号,名称,所属地区","上海"),
  PersonalFilelist: content("编号,名称,紧急联系电话","6681198"),
  Material: content("编号,名称,物料分类","SR5.593"),
  ProcessType: content("编号,名称,生产线","100"),
  MeasureMent: content("编号,名称,换算率","1.1"),
  WorkType: content("编号,名称","单元"),
  BreakType: content("编号,名称","机器故障"),
  DeviceStatus: content("编号,名称,状态分类","闲置"),
  BatchLibrary: content("物料编号,批次号,上次检验日期","2020-12-07"),
  ProjectStage: content("编号,名称,创建人","马云"),
  WorkCenter: content("编号,名称","803"),
  Workline: content("编号,名称,工作中心","中心"),
  Area: content("编号,名称,负责人","北京"),
  Station: content("编号,名称,区域","装配"),
  UnitWork: content("编号,名称,单位类型","机械"),
  Team: content("编号,名称,班组长","组长"),
  StoreFile: content("编号,名称","仓库203"),
  PrepareStatus: content("编号,名称,标识","研发"),
  WorkOrder: content("编号,名称,型号类部件","xhj-1"),
  PlanFormulation: content("编号,名称,状态","ABCD202010"),
  TaskManagement: content("任务编号,项目计划编号,物料编号","SR5.593"),
  ProductOrder: content("订单编号,物料名称,订单状态","SR5.593"),
}
