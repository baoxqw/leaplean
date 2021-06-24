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

@connect(({ calendar, loading }) => ({
  calendar,
  loading: loading.models.calendar,
}))
@Form.create()
class Costomize extends PureComponent {
  state = {
    conditions:[],
    valueList:[],
    allvalue:[],
    initData:[],
    page:{},
    total:0,

    dateStatus:false,
    colorStyle:'',
    month:moment().format("YYYY-MM-DD"),

    name:'',
    holidayyear:'',
    starttime:moment().format("YYYY-MM-DD 00:00:00"),
    endtime:moment().format("YYYY-MM-DD 23:59:59"),
    isdeftime:false,

    holidayclId:null,
    holidayclname:'',
  };
  columns = [
    {
      title: '客商编码',
      dataIndex: 'code',
      key: 'code',
      width: '30%',

    },
    {
      title: '客商名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',

    },
    {
      title: '客商类型',
      dataIndex: 'custtype',
      key: 'custtype',
      render:(text,item)=>{
        if(text == 1){
          return '客商'
        }else if(text == 2){
          return '客户'
        }else if(text == 3){
          return '供应商'
        }

      }

    },
    {
      title: '操作',
      dataIndex: 'caozuo',
      render: (text, record) =>
        <Fragment>
          <a href="javascript:;" onClick={() => this.handleUpdate(true,record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?"  onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">删除</a>
          </Popconfirm>
        </Fragment>
    },
  ];
  //删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'businessadmin/remove',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        message.success('删除成功')
        const obj = {
          pageIndex:0,
          pageSize:10,
          id:this.state.id
        }
        dispatch({
          type:'businessadmin/fetch',
          payload:obj
        })
      }
    })
  };
  onSelect = (selectedKeys, info) => {
    const name = info.selectedNodes[0].props.dataRef.name;
    const id = info.selectedNodes[0].props.dataRef.id;
    this.setState({
      holidayclname:name,
      holidayclId:id,
    })
  };

  componentDidMount(){
    const { dispatch} = this.props;
    dispatch({
      type: 'calendar/newdatasss',
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
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize:pagination.pageSize,
      id:this.state.id
    };
    if(conditions.length){
      const obj = {
        pageIndex: pagination.current -1,
        pageSize: pagination.pageSize,
        conditions
      };
      dispatch({
        type:'businessadmin/fetch',
        payload: obj,
      });
      return
    }
    dispatch({
      type:'businessadmin/fetch',
      payload:obj
    })
    this.setState({
      page:obj
    })
  };
  //编辑
  handleUpdate = (flag,record) => {
    router.push('/fundamental/businessadmin/businessupdate',record)
  }
  //取消
  handleReset = () => {
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取
    if(this.state.id){
      dispatch({
        type:'businessadmin/fetch',
        payload: {
          id:this.state.id,
          ...this.state.page
        }
      })
    }else{
      dispatch({
        type:'businessadmin/fetch',
        payload: {
          pageIndex:0,
          pageSize:10,
        }
      })
    }


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

  backClick =()=>{
    router.push('/platform/basicdata/calendar/list')
  }

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
    const { starttime,endtime,holidayclId } = this.state;
    form.validateFields((err, fieldsValue) => {
      const values = {
        reqData:{
          code:fieldsValue.code,
          name:fieldsValue.name,
          holidayyear:fieldsValue.holidayyear,
          isdeftime:fieldsValue.isdeftime?1:0,
          starttime,
          endtime,
          allflag:fieldsValue.allflag?1:0,
          holidayclId
        }
      };
      dispatch({
        type:'calendar/addDefinition',
        payload:values,
        callback:(res)=>{
          if(res.errMsg === "成功"){
            dispatch({
              type: 'calendar/newdatasss',
              payload: {
                reqData:{}
              },
              callback:(res)=>{
                if (res.resData){
                  const a = toTree(res.resData);
                  form.resetFields();
                  this.setState({
                    valueList: a,
                    dateStatus:false,
                    colorStyle:'',
                    month:moment().format("YYYY-MM-DD"),

                    name:'',
                    holidayyear:'',
                    starttime:moment().format("YYYY-MM-DD 00:00:00"),
                    endtime:moment().format("YYYY-MM-DD 23:59:59"),
                    isdeftime:false,

                    holidayclId:null,
                    holidayclname:'',
                  })
                }
              }
            })
          }
        }
      })
    })

  }

  render() {
    const {
      calendar:{},
      form: { getFieldDecorator },
      loading
    } = this.props;

    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card title={'假日类型'} style={{ width:'25%',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div style={{borderBottom:'1px solid #f5f5f5',marginTop:'12px'}}></div>
            <div >
              <Tree
                defaultExpandAll={true}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(this.state.valueList)}
              </Tree>
            </div>

          </Card>
          <Card title="假日定义" style={{ width:'70%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form onSubmit={this.handleSearch}>
              <Row gutter={16}>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假日编码'>
                    {getFieldDecorator('code')(<Input placeholder='假日编码' />)}
                  </FormItem>
                </Col>
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                  <FormItem label='假日名称'>
                    {getFieldDecorator('name',{
                      initialValue:this.state.name
                    })(<Input placeholder='假日名称' />)}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
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
                <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
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
            <Button type="primary"
                    onClick={()=>this.validate()}
            >
              提交
            </Button>

          </FooterToolbar>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Costomize;

