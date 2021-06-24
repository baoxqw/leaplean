import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  TimePicker,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Tabs,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../../System/UserAdmin.less';
import router from 'umi/router';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ cdetail, loading }) => ({
  cdetail,
  loading: loading.models.cdetail,
}))
@Form.create()
class CaDetail extends PureComponent {
  state = {
    addVisible:false,
    updateVisible:false,
    updateSource:[],
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[]
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'cdetail/fetch',
      payload:{
        ...page
      }
    })
  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };
  handleDetailOk= ()=>{
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          datetype:values.datetype?Number(values.datetype):'',
          calendardate:values.calendardate?values.calendardate.format('YYYY-MM-DD'):'',
          ondutytime:values.ondutytime?values.ondutytime.format('h:mm:ss'):'',
          offdutytime:values.offdutytime?values.offdutytime.format('h:mm:ss'):'',
        }
      }
      dispatch({
        type:'cdetail/detailadd',
        payload:obj,
        callback:(res)=>{
          if(res.errCode == '0'){
            message.success('成功',1,()=>{
              this.setState({addVisible:false})
              dispatch({
                type:'cdetail/fetch',
                payload:{
                  ...page
                }
              })
            })
          }
        }
      })
    })

  }
  handleDetailCancel  =()=>{
    this.setState({
      addVisible:false
    })
  }

  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'cdetail/deletedetail',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'cdetail/fetch',
              payload:{
                ...page
              }
            })
          })
        }
      }
    })
  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { finddatetype } = values;
      if(!finddatetype){
        dispatch({
          type:'cdetail/fetch',
          payload:{
            ...page
          }
        })
      }
      if(finddatetype){
        let conditions = [];
        let codeObj = {};

        if(finddatetype){
          codeObj = {
            code:'datetype',
            exp:'like',
            value:finddatetype
          };
          conditions.push(codeObj)
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
          type:'cdetail/fetch',
          payload:obj,
        })
      }
    })

  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type:'cdetail/fetch',
      payload:{
        ...page
      }
    });
  };
  //编辑
  updataRoute = (record)=>{
    this.setState({
      updateSource:record,
      updateVisible:true,
    })
  }
  updatehandleOk = ()=>{
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          id:this.state.updateSource.id,
          datetype:values.udatetype?Number(values.udatetype):'',
          calendardate:values.ucalendardate?values.ucalendardate.format('YYYY-MM-DD'):'',
          ondutytime:values.uondutytime?values.uondutytime.format('h:mm:ss'):'',
          offdutytime:values.uoffdutytime?values.uoffdutytime.format('h:mm:ss'):'',
        }
      }
      dispatch({
        type:'cdetail/detailadd',
        payload:obj,
        callback:(res)=>{
          if(res.errCode == '0'){
            message.success('编辑成功',1,()=>{

              this.setState({updateVisible:false})
              dispatch({
                type:'cdetail/fetch',
                payload:{
                  ...page
                }
              })
            })
          }
        }
      })
    })

  }
  updatehandleCancel  =()=>{
    this.setState({
      updateVisible:false
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'worktype/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'worktype/fetch',
      payload: obj,
    });

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;

    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='假日类别'>
              {getFieldDecorator('finddatetype', {
                // rules: [{ required: true, message: '假日类别' }],
              })(
                <Select style={{width:'100%'}} placeholder="假日类别">
                  <Option value="0">工作日</Option>
                  <Option value="1">公休日</Option>
                  <Option value="2">节假日</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>

          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>

        <div>
          <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
            新建
          </Button>
        </div>
      </Form>
    );
  }
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      cdetail:{data},
    } = this.props;
    const { updateSource } = this.state;
    const columns = [
      {
        title: '日历日期',
        dataIndex: 'calendardate',
      },
      {
        title: '下班时间',
        dataIndex: 'offdutytime',
      },
      {
        title: '上班时间',
        dataIndex: 'ondutytime',
      },
      {
        title: '日期类型',
        dataIndex: 'datetype',
        render:(text,record)=>{
          if(text == '0'){
            return '工作日'
          }else if(text == '1'){
            return '公休日'
          }else{
            return '节假日'
          }
        }
      },
      {
        title:'操作',
        dataIndex: 'caozuo',
        sort:2,
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}></div>
            <NormalTable
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
          {/*新建*/}
          <Modal
            title="生成工作日历明细"
            destroyOnClose={true}
            centered
            visible={this.state.addVisible}
            onOk={this.handleDetailOk}
            onCancel={this.handleDetailCancel}
          >
            <Form  layout="inline" style={{display:'flex'}}>
              <Row>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='日历日期'>
                    {getFieldDecorator('calendardate', {
                      // rules: [{ required: true, message: '日历结束日' }],
                    })(
                      <DatePicker style={{display:'inline-block',marginLeft:'14px',width:'340px'}} />
                    )}
                  </FormItem>
                </Col>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='上班时间'>
                    {getFieldDecorator('ondutytime', {
                      // rules: [{ required: true, message: '日历起始日' }],
                    })(
                      <TimePicker use24Hours format="h:mm:ss" style={{display:'inline-block',marginLeft:'14px',width:'340px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='下班时间'>
                    {getFieldDecorator('offdutytime', {
                      // rules: [{ required: true, message: '日历结束日' }],
                    })(
                      <TimePicker use24Hours format="h:mm:ss" style={{display:'inline-block',marginLeft:'14px',width:'340px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='假日类别'>
                    {getFieldDecorator('datetype', {
                      // rules: [{ required: true, message: '假日类别' }],
                    })(
                      <Select  style={{display:'inline-block',marginLeft:'18px',width:'340px'}} placeholder="假日类别">
                        <Option value="0">工作日</Option>
                        <Option value="1">公休日</Option>
                        <Option value="2">节假日</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col style={{marginTop:'20px'}}>
                  <b>说明：新设置日历期间与当前日历期间重叠时，按照最新设置覆盖原日历!</b>
                </Col>
              </Row>

            </Form>
          </Modal>
          {/*编辑*/}
          <Modal
            title="编辑工作日历明细"
            destroyOnClose={true}
            centered
            visible={this.state.updateVisible}
            onOk={this.updatehandleOk}
            onCancel={this.updatehandleCancel}
          >
            <Form  layout="inline" style={{display:'flex'}}>
              <Row>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='日历日期'>
                    {getFieldDecorator('ucalendardate', {
                      initialValue:updateSource.calendardate?moment(updateSource.calendardate):''
                      // rules: [{ required: true, message: '日历结束日' }],
                    })(
                      <DatePicker style={{display:'inline-block',marginLeft:'14px',width:'340px'}} />
                    )}
                  </FormItem>
                </Col>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='上班时间'>
                    {getFieldDecorator('uondutytime', {
                      initialValue:updateSource.ondutytime?moment(updateSource.ondutytime,'HH:mm:ss'):null
                    })(
                      <TimePicker use24Hours format="h:mm:ss" style={{display:'inline-block',marginLeft:'14px',width:'340px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='下班时间'>
                    {getFieldDecorator('uoffdutytime', {
                      initialValue:updateSource.offdutytime?moment(updateSource.offdutytime,'HH:mm:ss'):null
                    })(
                      <TimePicker use24Hours format="h:mm:ss" style={{display:'inline-block',marginLeft:'14px',width:'340px'}}/>
                    )}
                  </FormItem>
                </Col>
                <Col style={{margin:'10px 0'}}>
                  <FormItem label='假日类别33'>
                    {getFieldDecorator('udatetype', {
                      initialValue:updateSource.datetype?updateSource.datetype:''
                    })(
                      <Select  style={{display:'inline-block',marginLeft:'18px',width:'340px'}} placeholder="假日类别">
                        <Option value={0}>工作日</Option>
                        <Option value={1}>公休日</Option>
                        <Option value={2}>节假日</Option>
                      </Select>,
                    )}
                  </FormItem>
                </Col>
                <Col style={{marginTop:'20px'}}>
                  <b>说明：新设置日历期间与当前日历期间重叠时，按照最新设置覆盖原日历!</b>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CaDetail;
