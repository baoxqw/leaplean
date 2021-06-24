import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Divider ,
  Button,
  Card,
  Select,
  message,
  Popconfirm,
  Tabs,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import './tableSureBg.less'
import router from 'umi/router';

import AddSelfCommon from './AddSelf';
import UpdateSelfCommon from './UpdateSelf';

const FormItem = Form.Item;

@connect(({ MP, loading }) => ({
  MP,
  loading: loading.models.MP,
}))
@Form.create()
class MaintenancePlan extends PureComponent {
  state = {
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[],
    addModleVisible:false,
    selectedRows:[],
    ChildData:[],
    superId:null,
    rowId:null,
    childfetchData:{},
    updateData:{},
    addVisible:false,
    updateVisible:false,
    addSelfVisible:false,
    updateSelfVisible:false,
    updateSelfSource:{}
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MP/fetch',
      payload:{
        ...page
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({
      addSelfVisible:true
    })
  };

  updataRoute = (e,record) => {
    this.setState({
      updateSelfSource:record,
      updateSelfVisible:true
    })
  };

  mainRecord = (e,record)=>{
    e.preventDefault()
    router.push('/equipmentmanage/maintenanceplan/record',record)
  }

  handleDelete = (record)=>{
   
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MP/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'MP/fetch',
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
    
      const { code,name } = values;
      if(code||name ){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'code',
            exp:'like',
            value:code
          };
          conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'name',
            exp:'like',
            value:name
          };
          conditions.push(nameObj)
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
          type:'MP/fetch',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'MP/fetch',
          payload:{
            pageIndex:0,
            pageSize:10
          }
        })
      }
    })

  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    const { page } = this.state;
    this.setState({
      conditions:[]
    })
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'MP/fetch',
      payload:{
        ...page
      }
    });
  };

  //分页
  handleStandardTableChange = (pagination) => {
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
        type:'MP/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'MP/fetch',
      payload: obj,
    });
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  handleOk = e =>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
    
      /*dispatch({
        type:'workcenter/add',
        payload:obj,
        callback:(res)=>{
          this.setState({
            addVisible:false
          })
          dispatch({
            type:'workcenter/fetch',
            payload:{
              ...page
            }
          })

        }
      })*/
    })
  }

  handleCancel  =()=>{
    this.setState({
      addVisible:false
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='设备编号'>
              {getFieldDecorator('code')(<Input placeholder='请输入设备编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='设备名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入设备名称' />)}
            </FormItem>
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
      </Form>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      MP:{fetchData}
    } = this.props;
    const { page,updateSelfSource } = this.state
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'code',
      },
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '设备卡片',
        dataIndex: 'equipmentName',
      },
      {
        title: '维修计划类型',
        dataIndex: 'mptype',
        render:(text, record)=>{
          if(text === 0){
            return '一级保养计划'
          }
          if(text === 1){
            return '二级保养计划'
          }
          if(text === 2){
            return '三级保养计划'
          }
          if(text === 3){
            return '点检计划'
          }
        },
      },
      {
        title: '计划开始日期',
        dataIndex: 'startdate',
      },
      {
        title: '计划结束日期',
        dataIndex: 'enddate',
      },
      {
        title: '发起部门',
        dataIndex: 'deptName',
      },
      {
        title: '发起人',
        dataIndex: 'psndocName',
      },
      {
        title: '维修数量',
        dataIndex: 'num',
        sorter: (a, b) => a.num - b.num,
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 's',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.mainRecord(e,record)}>维修记录</a>
          </Fragment>
        }
      },
    ];

    //主表新建
    const OnAddSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'MP/addMP',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addSelfVisible:false})
                clear()
                dispatch({
                  type:'MP/fetch',
                  payload:{
                    ...page
                  }
                })
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addSelfVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addSelfVisible
    }

    const OnUpdateData = {
      visible:this.state.updateVisible,
      record:updateSelfSource
    }
    const OnUpdateSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'MP/addMP',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateSelfVisible:false,
                  updateSelfSource:{}
                })
                clear()
                dispatch({
                  type:'MP/fetch',
                  payload:{
                    ...page
                  }
                })
              })
            }else{
              message.error('失败')
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateSelfVisible:false
        })
      }
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            style={{marginTop:'12px'}}
            loading={loading}
            data={fetchData}
            columns={columns}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  this.setState({
                    superId:record.id,
                    rowId: record.id,
                    superData:record
                  })
                },
                rowKey:record.id
              }
            }}
            rowClassName={this.setRowClassName}
            onChange={this.handleStandardTableChange}
            classNameSaveColumns={"MaintenancePlan"}
            title={() =>  <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" style={{marginRight:'20px'}}>
                新建
              </Button>
            </div>}
          />
          <AddSelfCommon on={OnAddSelf} data={OnSelfData} />
          <UpdateSelfCommon on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MaintenancePlan;
