import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Table,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  Checkbox,
  Select,
  Tree,
  Badge,
  Calendar ,
  Modal,
  message, Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment';
import FooterToolbar from '@/components/FooterToolbar';
import LunarCalendar from 'lunar-calendar';
import { toTree } from '@/pages/tool/ToTree'
import './style.less'
const FormItem = Form.Item;
const { TreeNode } = Tree;

@connect(({ dholiday, loading }) => ({
  dholiday,
  loading: loading.models.calendar,
}))
@Form.create()
class DefineHolidayDef extends PureComponent {
  state = {
    conditions:[],
    valueList:[],
    allvalue:[],
    initData:[],
    page:{},
    total:0,

    dateStatus:false,
    colorStyle:moment().format("YYYY-MM-DD"),
    month:moment().format("YYYY-MM-DD"),

    name:'',
    holidayyear:'',
    starttime:moment().format("YYYY-MM-DD 00:00:00"),
    endtime:moment().format("YYYY-MM-DD 23:59:59"),
    isdeftime:false,

    holidayclId:null,
    holidayclname:'',


    subStatus:0,

    initial:{},

    addStatus:false,

    status:true
  };

  //删除
  handleDelete = (e)=>{
    e.preventDefault();
    const { dispatch } = this.props;
    const { initial } = this.state;
    dispatch({
      type: 'dholiday/delete',
      payload:{
        reqData:{
          id:initial.id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            this.setState({
              status:false
            });
            this.init();
            dispatch({
              type: 'dholiday/newdatasss',
              payload: {
                reqData:{}
              },
              callback:(res)=>{
                if (res.resData){
                  const a = toTree(res.resData);
                  this.setState({
                    valueList: a,
                    status:true
                  })
                }
              }
            })
          })
        }else{
          message.error("删除失败")
        }
      }
    })
  };

  onSelect = (selectedKeys, info) => {
    if(!selectedKeys.length){
      this.init();
      return
    };
    if('holidayclId' in info.selectedNodes[0].props.dataRef){
      //message.error("假日定义节点不可以新建节点")
      const { endtime,starttime,name,holidayyear } =  info.selectedNodes[0].props.dataRef;
      this.setState({
        subStatus:2,
        initial:info.selectedNodes[0].props.dataRef,
        endtime,
        starttime,
        name,
        holidayyear
      });
      return
    }
    this.init();
    const name = info.selectedNodes[0].props.dataRef.name;
    const id = info.selectedNodes[0].props.dataRef.id;
    this.setState({
      holidayclname:name,
      holidayclId:id,
      subStatus:1
    })
  };

  init = () =>{
    const { form } = this.props;
    form.resetFields();
    this.setState({
      initial:{},
      subStatus:0,
      dateStatus:false,
      colorStyle:moment().format("YYYY-MM-DD"),
      month:moment().format("YYYY-MM-DD"),

      name:'',
      holidayyear:'',
      starttime:moment().format("YYYY-MM-DD 00:00:00"),
      endtime:moment().format("YYYY-MM-DD 23:59:59"),
      isdeftime:false,

      holidayclId:null,
      holidayclname:'',

      addStatus:false
    })
  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'dholiday/newdatasss',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            valueList: a,
          })
        }
      }
    })
  }

  onChange = value => {

    this.setState({ value });
  };
  //查询
  handleSearch = (e) => {
    const {form,dispatch} = this.props

    e.preventDefault();
    form.validateFieldsAndScroll(async (err, values) => {
      const {code,name} = values;
      if(!code && !name){
        const object = {
          pageIndex:0,
          pageSize:10,
        }
        dispatch({
          type:'businessadmin/fetch',
          payload:object
        })
      }
      if(code || name){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'code',
            exp:'like',
            value:code
          };
          await conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'like',
            value:name
          };
          await conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'businessadmin/fetch',
          payload: obj
        })
      }
    })
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.key} dataRef={item} />;
    });

  dateFullCellRender = (date)=>{
    const { month,colorStyle } = this.state;
    const monthList = month.split("-");

    const da = date.format('YYYY-MM-DD');
    const dd = date.format('dddd');
    const dateStr = da.split("-");
    const dat = LunarCalendar.solarToLunar(dateStr[0],dateStr[1],dateStr[2]);
    let lunarDayName = dat.lunarDayName; //初几
    const lunarMonthName = dat.lunarMonthName; //农历几月
    let solarFestival = dat.solarFestival; //公历节日
    let solarList = [];
    if(solarFestival){
      solarList = solarFestival.split(" ");

      solarList = solarList.map(item=>{
        if (item === '国庆节' || item === '国际儿童节' || item === '劳动节' || item === '妇女节'){
          return item
        }
      })
      solarList = solarList.filter(item=>item !== undefined);
    }
    const term = dat.term; //气节
    let lunarFestival = dat.lunarFestival; //农历节日
    let status = false;
    const arrList = ['除夕','元旦','春节','元宵节','清明节','端午节','建军节','中秋节','教师节','腊八节'];
    arrList.map(item =>{
      if(item === lunarFestival){
        status = true
      }
    });
    if(!status){
      lunarFestival = ''
    }
    if(term === '清明'){
      lunarFestival = '清明节'
    }

    if(lunarDayName === "初一"){
      lunarDayName = lunarMonthName
    }

    const backgroundColor = ()=>{
      let color = '';
      let ddStatus = false;
      let Festival = false;
      if(dd === '星期六' || dd === '星期日'){
        color = '#8AD8D9';
        ddStatus = true;
      }
      if(lunarFestival || solarList.length){
        color = '#FEF7A1';
        Festival = true;
      }
      if(ddStatus && Festival){
        color = '#88D99B'
      }
      return color
    };

    return <div style={{backgroundColor:backgroundColor(),display:'flex',height:'120px',borderTop:'2px solid #d9d9d9',padding:'2px'}}>
      <div className={`hover ${colorStyle === da?'colorStyle':''}`} onDoubleClick={()=>this.onClickColor(da)} style={{display:'flex',flex:1,flexDirection:'column',alignItems:'flex-end',padding:'2px',overflow:'auto'}}>
        {monthList[1] === dateStr[1]?<span>{dateStr[2]}</span>:<span style={{color:'#d9d9d9'}}>{dateStr[2]}</span>}
        {
          this.state.dateStatus?<span>{lunarDayName}</span>:''
        }
        <span>{term}</span>
        {
          this.state.dateStatus?<span>&#12288;&#12288;{lunarFestival}</span>:solarList.map((item,index) =>{
            return <span key={index}>&#12288;&#12288;{item}</span>
          })
        }
      </div>
    </div>
  };

  onClickColor = (da)=>{
    const dateStr = da.split("-");
    this.setState({
      colorStyle:da,
      time:da,
      holidayyear:dateStr[0],
      starttime:moment().format(`${da} 00:00:00`),
      endtime:moment().format(`${da} 23:59:59`),
    })
  };

  onCheckbox = (e)=>{
    this.setState({
      dateStatus:e.target.checked
    })
  };

  endtimeChange = (date,dateString)=>{
    this.setState({
      endtime:dateString
    })
  }

  starttimeChange = (date,dateString)=>{
    this.setState({
      starttime:dateString
    })
  }

  onChangeIsdeftime = (e)=>{
    this.setState({
      isdeftime:e.target.checked
    })
  };

  onChangeCalendar = (date)=>{
    const da = date.format('YYYY-MM-DD');
    this.setState({
      month:da
    })
  };

  validate () {
    const { dispatch,form } = this.props;
    const { starttime,endtime,holidayclId,subStatus } = this.state;

    form.validateFields((err, fieldsValue) => {
      if(err) return;
      const values = {
        code:fieldsValue.code,
        name:fieldsValue.name,
        holidayyear:fieldsValue.holidayyear,
        isdeftime:fieldsValue.isdeftime?1:0,
        starttime,
        endtime,
        allflag:fieldsValue.allflag?1:0,
      };
      if(subStatus === 1){
        dispatch({
          type:'dholiday/addDefinition',
          payload:{
            reqData:{
              ...values,
              holidayclId
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({
                  status:false
                });
                this.init();
                dispatch({
                  type: 'dholiday/newdatasss',
                  payload: {
                    reqData:{}
                  },
                  callback:(res)=>{
                    if (res.resData){
                      const a = toTree(res.resData);
                      this.setState({
                        valueList: a,
                        status:true
                      })
                    }
                  }
                })
              })
            }else{
              message.error("新建失败")
            }
          }
        })
      }
      if(subStatus === 2){
        const { initial } = this.state;
        dispatch({
          type:'dholiday/addDefinition',
          payload:{
            reqData:{
              id:initial.id,
              holidayclId:initial.holidayclId,
              ...values
            }
          },
          callback:(res)=>{

            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  status:false
                })
                this.init();
                dispatch({
                  type: 'dholiday/newdatasss',
                  payload: {
                    reqData:{}
                  },
                  callback:(res)=>{
                    if (res.resData){
                      const a = toTree(res.resData);
                      this.setState({
                        valueList: a,
                        status:true
                      })
                    }
                  }
                })
              })
            }else{
              message.error("编辑失败")
            }
          }
        })
      }
    })

  }

  onLoadData = treeNode =>
    new Promise(resolve => {
      const { dispatch } = this.props;
      const id = treeNode.props.dataRef.id;
      if('holidayclId' in treeNode.props.dataRef){
        resolve();
        return
      }
      const conditions = [{
        code:'HOLIDAYCL_ID',
        exp:'=',
        value:id + ''
      }];
      dispatch({
        type:'dholiday/findHoliday',
        payload:{
          conditions
        },
        callback:(res)=>{
          if(res.resData){
            res.resData.map(item =>{
              item.key = 'key2-'+item.id
              return item
            });         
            treeNode.props.dataRef.children = res.resData;
            this.setState({
              valueList: [...this.state.valueList],
            });
            resolve();
          }else{
            resolve();
          }
        }
      })
    });

  onClickAdd = () =>{
    this.setState({
      addStatus:true
    })
  };

  backClick = ()=>{
    this.init()
  }

  render() {
    const {
      dholiday:{},
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { initial,addStatus,subStatus,status } = this.state;

    let titleButton = '提交';
    if(subStatus === 1){
      titleButton = '新建'
    }
    if(subStatus === 2){
      titleButton = '编辑'
    }

    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card title={'假日类型'} extra={subStatus === 2?<a href={'#javascript:;'} style={{color:'#f5222D'}} onClick={(e)=>this.handleDelete(e)}>删除</a>:''} style={{ width:'25%',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div >
              {
                status?<Tree
                  defaultExpandAll={true}
                  onSelect={this.onSelect}
                  loadData={this.onLoadData}
                >
                  {this.renderTreeNodes(this.state.valueList)}
                </Tree>:''
              }
            </div>

          </Card>
          <Card title="假日定义" style={{ width:'70%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form onSubmit={this.handleSearch}>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假日编码'>
                    {getFieldDecorator('code',{
                      initialValue:initial.code?initial.code:'',
                      rules: [{ required: true, message: '请输入假日编码' }],
                    })(<Input placeholder='假日编码' />)}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假日名称'>
                    {getFieldDecorator('name',{
                      initialValue:this.state.name,
                      rules: [{ required: true, message: '请输入假日名称' }],
                    })(<Input placeholder='假日名称' />)}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假日类型'>
                    {getFieldDecorator('holidaytype',{
                      initialValue: this.state.holidayclname
                    })(
                      <Input placeholder={'请选择假日类型'} disabled/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假日年度'>
                    {getFieldDecorator('holidayyear',{
                      initialValue: this.state.holidayyear
                    })(
                      <Input placeholder={'请输入假日年度'}/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <Form.Item label="是否分时假日">
                    {getFieldDecorator('isdeftime', {
                      valuePropName: 'checked',
                      initialValue:initial.isdeftime
                    })(<Checkbox onChange={this.onChangeIsdeftime}/>)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='开始时间'>
                    <DatePicker showTime disabled={!this.state.isdeftime} format="YYYY-MM-DD HH:mm:ss" onChange={this.starttimeChange} value={this.state.starttime?moment(this.state.starttime):null} style={{width:'100%'}} placeholder={'请选择开始时间'}/>
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='结束时间'>
                    <DatePicker showTime disabled={!this.state.isdeftime} format="YYYY-MM-DD HH:mm:ss" onChange={this.endtimeChange} value={this.state.endtime?moment(this.state.endtime):null} style={{width:'100%'}} placeholder={'请选择结束时间'}/>
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <Form.Item label="是否适用于全体人员">
                    {getFieldDecorator('allflag', {
                      valuePropName: 'checked',
                      initialValue:initial.allflag
                    })(<Checkbox />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <div style={{textAlign:'right',padding:'16px'}}>
              <span style={{fontSize:'18px',marginRight:'10px'}}>农历: </span><Checkbox onChange={this.onCheckbox}/>
            </div>
            <Row>
              <Calendar onChange={this.onChangeCalendar}  dateFullCellRender={this.dateFullCellRender} />
            </Row>
          </Card>
          <FooterToolbar >
            {/* {this.getErrorInfo()} */}
            <Button
              onClick={this.backClick}
            >
              取消
            </Button>
            <Button
              type="primary"
              disabled={!subStatus}
              onClick={()=>this.validate()}
            >
              {titleButton}
            </Button>

          </FooterToolbar>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default DefineHolidayDef;

