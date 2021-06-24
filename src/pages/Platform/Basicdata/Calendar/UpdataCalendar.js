import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Table,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TimePicker ,
  Button,
  Card,
  Checkbox,
  Select,
  Tree,
  TreeSelect,
  Calendar,
  Radio,
  Modal,
  message, Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import FooterToolbar from '@/components/FooterToolbar';
import './style.less'
import { toTree } from '@/pages/tool/ToTree';
import WorkCalendar from '@/pages/Platform/Basicdata/Calendar/WorkCalendar';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;

function tab(date1,date2,date3){
  const oDate1 = new Date(date1);
  const oDate2 = new Date(date2);
  const oDate3 = new Date(date3);
  if((oDate1.getTime() <= oDate2.getTime()) && (oDate2.getTime() <= oDate3.getTime())){
    return true
  } else {
    return false
  }
}

@connect(({ calendar, loading }) => ({
  calendar,
  loading: loading.models.calendar,
}))
@Form.create()
class UpdataCalendar extends PureComponent {
  state = {
    valueList: [],
    year: moment(),
    month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    visible: false,
    solarList: [],
    lunarFestival: '',

    initData: {},
    workArr: [],
    id: null,
    offdutytime: '',
    ondutytime: '',
    datetype: '',
    calendardate: '',
    memo: '',
    workcalendruleId:null,
    workRule:[],
    holidayclId:null,
    typeValue:[],
    record:{},

    startValue: null,
    endValue: null,
    endOpen: false,
    startValueAssign: null,
    endValueAssign: null,
    endOpenAssign: false,
    planStartTime:null,
    assignStartTime:null,
    planEndTime:null,
    endTimeShow:true,
    assignTimeShow:true,
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} dataRef={item} />;
    });

  componentDidMount() {
    const { dispatch } = this.props;
    const initData = this.props.location.state;
    const { begindate,enddate } = initData;
    let year = moment();
    if(begindate){
      const begindatearr = begindate.split("-");
      year = moment(begindatearr[0])
    }
    if(initData.holidayyear){
      initData.holidayyear = Number(initData.holidayyear)
    }
    this.setState({
      initData,
      year,
      workcalendruleId:initData.workcalendruleId,
      holidayclId:initData.holidayclId,
      startValue:begindate?moment(begindate):null,
      endValue:enddate?moment(enddate):null,
    });
    if (initData.id){
      const conditions = [{
        code:'WORKCALENDAR_ID',
        exp:'=',
        value:initData.id + ''
      }];
      dispatch({
        type:'calendar/findCalend',
        payload:{
          conditions
        },
        callback:(res)=>{
          if(res.resData && res.resData.length){
            this.setState({
              workArr:res.resData,
            })
          }else{
            this.setState({
              workArr:[]
            })

          }
        }
      });
    }
  }

  onSelectValue = (data)=>{

  }

  backClick =()=>{
    router.push('/platform/basicdata/calendar/list')
  }

  dateCellRender = (date)=>{
    const da = date.format('YYYY-MM-DD');
    const { workArr } = this.state;
    let datetype = 0; //日期类型 0=工作日，1=公休日，2=节假日
    let calendardate = '';
    if(workArr.length){
      workArr.map((item)=>{
        if(item.calendardate === da){
          datetype = item.datetype;
          calendardate = item.calendardate;
        }
      });
    }
    const Color = ()=>{
      let color = '';
      if(datetype === 0){
        color = '#61C2C9'
      }
      if(datetype === 1){
        color = '#FEE91C'
      }
      if(datetype === 2){
        color = 'rgba(201, 45, 40,0.8)'
      }
      return color
    };
    const style = {
      width:'5px',
      height:'5px',
      borderRadius:'50%',
      backgroundColor:Color(),
      margin:'0 auto',
      position:'relative',
      top:'-10px'
    };
    if(da === calendardate){
      return <div style={ style }></div>
    }
  };

  onSelect = (date)=>{
    const da = date.format('YYYY-MM-DD');
    const { workArr,initData } = this.state;
    const { form } = this.props;
    let record = {};
    if(workArr.length){
      workArr.map((item,index)=>{
        if(item.calendardate === da){
          record = workArr[index]
        }
      });
    }
    if(!record.calendardate){
      record.calendardate = da;
    }
    record.workcalendarId = initData.id;
    form.validateFieldsAndScroll(['begindate','enddate'],(err,values) => {
      if(err) return;
      let begindate = values.begindate.format('YYYY-MM-DD');
      let enddate = values.enddate.format('YYYY-MM-DD');
      const bool = tab(begindate,da,enddate);
      if(bool && initData.id){
        this.setState({
          visible:true,
          record
        })
      }
    })
  };

  //假期类别
  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/fetchType',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if(res && res.resData){
          const a = toTree(res.resData);
          this.setState({
            typeValue:a
          })
        }
      }
    });
  }

  onChangDepartment=(value, label, extra)=>{
    this.setState({
      holidayclId:value
    })
  }
  //日历规则
  onFocusWork = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/fetchWork',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if(res && res.resData){
          res.resData.map(item=>{
            item.key = item.id
          })
          const a = toTree(res.resData);
          this.setState({
            workRule:a
          })
        }
      }
    });
  }

  onChangWork =(value, label, extra)=>{
    this.setState({
      workcalendruleId:value
    })
  }

  renderTreeNodesTo = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodesWork(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });

  validate = ()=>{
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err,values) => {
      if(err) return;
      const { initData,holidayclId,workcalendruleId } = this.state;
      const obj = {
        id:initData.id,
        code:values.code,
        name:values.name,
        begindate:values.begindate?values.begindate.format('YYYY-MM-DD'):'',
        yearstartdate:values.yearstartdate?values.yearstartdate.format('YYYY-MM-DD'):'',
        enddate:values.enddate?values.enddate.format('YYYY-MM-DD'):'',
        isdefaultcalendar:values.isdefaultcalendar?1:0,
        ffirstweekday:values.ffirstweekday?Number(values.ffirstweekday):null,
        holidayyear:values.holidayyear + '',
        enablestate:values.enablestate,
        holidayclId,
        workcalendruleId,
      };
      dispatch({
        type:'calendar/detailAdd',
        payload:{
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res.errMsg === "成功"){
            message.success('编辑成功',1.5,()=>{
              router.push('/platform/basicdata/calendar/list')
            })
          }else{
            message.error("编辑失败")
          }

        }
      })
    })
  }
  //起始日
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  onStartChange = value => {
    this.onChange('startValue', value);
  };
  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };
  //结束日
  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };
  onEndChange = value => {
    this.onChange('endValue', value);
  };
  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };
  render() {
    const {
      calendar:{},
      form: { getFieldDecorator },
      dispatch
    } = this.props;
    const { year,initData,endOpen } = this.state;

    const options = [];
    for (let i = year.year() - 15; i < year.year() + 15; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>,
      );
    }

    const color0 = {
      width:'10px',
      height:'10px',
      borderRadius:'50%',
      backgroundColor:'#61C2C9',
    }  //工作日
    const color1 = {
      width:'10px',
      height:'10px',
      borderRadius:'50%',
      backgroundColor:'#FEE91C',
    }  //公休日
    const color2 = {
      width:'10px',
      height:'10px',
      borderRadius:'50%',
      backgroundColor:'rgba(201, 45, 40,0.8)',
    }  //节假日

    const WCData = {
      visible:this.state.visible,
      record:this.state.record
    };
    const WCOn = {
      onOk:(res,clear)=>{
        dispatch({
          type:'calendar/workcalendardate',
          payload: {
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success("录入成功",1,()=>{
                clear();
                this.setState({
                  visible: false,
                });
                const conditions = [{
                  code:'WORKCALENDAR_ID',
                  exp:'=',
                  value:initData.id + ''
                }];
                dispatch({
                  type:'calendar/findCalend',
                  payload:{
                    conditions
                  },
                  callback:(res)=>{
                    if(res.resData && res.resData.length){
                      this.setState({
                        workArr:res.resData,
                      })
                    }else{
                      this.setState({
                        workArr:[],
                      })
                    }
                  }
                });
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          visible:false
        })
      }
    }

    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card title={'录入节假日'} style={{ width:'20%',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div style={{borderBottom:'1px solid #f5f5f5',marginTop:'12px'}}></div>
            <div >
              <Tree
                defaultExpandAll={true}
                onSelect={this.onSelectValue}
              >
                {this.renderTreeNodes(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="修改工作日历" style={{ width:'75%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='工作日历编码'>
                    {getFieldDecorator('code',{
                      rules: [{ required: true,message:"工作日历编码"}],
                      initialValue:initData.code?initData.code:''
                    })(<Input placeholder='工作日历编码' />)}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='工作日历名称'>
                    {getFieldDecorator('name',{
                      rules: [{ required: true,message:'工作日历名称'}],
                      initialValue:initData.name?initData.name:''
                    })(<Input placeholder='工作日历名称' />)}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假日年度'>
                    {getFieldDecorator('holidayyear', {
                      rules: [{ required: true,message:'请选择假日年度'}],
                      initialValue:initData.holidayyear
                    })(
                      <Select placeholder='请选择假日年度' >
                        {options}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='工作日历年度起始日'>
                    {getFieldDecorator('yearstartdate', {
                      rules: [{ required: true,message:'请选择工作日历年度起始日'}],
                      initialValue:initData.yearstartdate?moment(initData.yearstartdate):null
                    })(
                      <DatePicker style={{width:'100%'}} placeholder={'请选择工作日历年度起始日'}/>
                    )}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='日历起始日'>
                    {getFieldDecorator('begindate', {
                      rules: [{ required: true,message:'请选择起始日期'}],
                      initialValue:initData.begindate?moment(initData.begindate):null
                    })(
                      <DatePicker
                        style={{width:'100%'}}
                        format="YYYY-MM-DD"
                        placeholder={"请选择起始日期"}
                        disabledDate={this.disabledStartDate}
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='日历结束日'>
                    {getFieldDecorator('enddate',{
                      rules: [{ required: true,message:'请选择结束日期'}],
                      initialValue:initData.enddate?moment(initData.enddate):null
                    })(<DatePicker
                      style={{width:'100%'}}
                      placeholder={"请选择结束日期"}
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM-DD"
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                    />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='日历规则'>
                    {getFieldDecorator('workcalendruleName', {
                      initialValue:initData.workcalendruleName?initData.workcalendruleName:null
                    })(
                      <TreeSelect
                        treeDefaultExpandAll
                        onFocus={this.onFocusWork}
                        onChange={this.onChangWork}
                        placeholder="请选择日历规则"
                      >
                        {this.renderTreeNodesTo(this.state.workRule)}
                      </TreeSelect >
                    )}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='启用状态'>
                    {getFieldDecorator('enablestate',{
                      initialValue:initData.enablestate
                    })(<Select placeholder={'请选择状态'}>
                      <Option value={1}>未启用</Option>
                      <Option value={2}>已启动</Option>
                      <Option value={3}>已停用</Option>
                    </Select>)}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假期类别'>
                    {getFieldDecorator('holidayclName', {
                      initialValue:initData.holidayclName?initData.holidayclName:null
                    })(
                      <TreeSelect
                        treeDefaultExpandAll
                        onFocus={this.onFocusDepartment}
                        onChange={this.onChangDepartment}
                        placeholder="请选择假期类别"
                      >
                        {this.renderTreeNodesTo(this.state.typeValue)}
                      </TreeSelect >
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <Form.Item label="是否默认日历">
                    {getFieldDecorator('isdefaultcalendar', {
                      valuePropName: 'checked',
                      initialValue:initData.isdefaultcalendar
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
               <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                  <FormItem label='每周起始日'>
                    {getFieldDecorator('ffirstweekday', {
                      initialValue:initData.ffirstweekday
                    })(
                      <Radio.Group>
                        <Radio value="1">周日</Radio>
                        <Radio value="2">周一</Radio>
                        <Radio value="3">周二</Radio>
                        <Radio value="4">周三</Radio>
                        <Radio value="5">周四</Radio>
                        <Radio value="6">周五</Radio>
                        <Radio value="7">周六</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Row style={{display:'flex',justifyContent:'space-between',marginTop:'20px'}}>
              <Row style={{display:'flex',flex:1,flexWrap:'wrap'}}>
                <Row style={{display:'flex',alignItems:'center',margin:'10px'}}>
                  <div style={ color0 }></div>
                  <Col style={{marginLeft:'5px'}}>
                    <span>:</span>
                    <span style={{marginLeft:3}}>工作日</span>
                  </Col>
                </Row>
                <Row style={{display:'flex',alignItems:'center',margin:'10px'}}>
                  <div style={ color1 }></div>
                  <Col style={{marginLeft:'5px'}}>
                    <span>:</span>
                    <span style={{marginLeft:3}}>公休日</span>
                  </Col>
                </Row>
                <Row style={{display:'flex',flex:1,alignItems:'center',margin:'10px'}}>
                  <div style={ color2 }></div>
                  <Col style={{marginLeft:'5px'}}>
                    <span>:</span>
                    <span style={{marginLeft:3}}>节假日</span>
                  </Col>
                </Row>
              </Row>
              <Row style={{flex:1,display:'flex',justifyContent:"flex-end"}}>
                <Select
                  dropdownMatchSelectWidth={false}
                  onChange={newYear => {
                    const now = year.clone().year(newYear);
                    this.setState({
                      year:now
                    })
                  }}
                  value={year.year()}
                  style={{marginRight:'18px'}}
                >
                  {options}
                </Select>
              </Row>
            </Row>
            <Row style={{display:'flex',flexWrap:'wrap',marginTop:'20px'}}>
              {
                this.state.month.map((item,index) =>{
                  return <div style={{ width: "33%", border: '1px solid #d9d9d9', borderRadius: 4,padding:'5px 0' }} key={index}>
                            <Calendar
                              fullscreen={false}
                              headerRender={() => {
                                return (
                                  <div style={{ padding: 10,textAlign:'center',borderBottom:'1px solid #d9d9d9' }}>
                                    {item}月
                                  </div>
                                );
                              }}
                              value={moment(this.state.year).month(parseInt(item - 1, 10))}
                              dateCellRender={this.dateCellRender}
                              onSelect={this.onSelect}
                            />
                        </div>
                })
              }
            </Row>
          </Card>
        </div>

        <WorkCalendar on={WCOn} data={WCData}/>
          <FooterToolbar >
            {/* {this.getErrorInfo()} */}
            <Button
              onClick={this.backClick}
            >
              取消
            </Button>
            <Button type="primary"
              onClick={()=>this.validate()}
            >
              提交
            </Button>

          </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default UpdataCalendar;

