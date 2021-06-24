import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Checkbox,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Select,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from '@/pages/QualityManage/TestScheme/AddSelf';
import AddChild from '@/pages/QualityManage/TestScheme/AddChild';
import UpdateSelf from '@/pages/QualityManage/TestScheme/UpdateSelf';
import UpdateChild from '@/pages/QualityManage/TestScheme/UpdateChild';

import './tableSureBg.less'
const FormItem = Form.Item;

@connect(({ testS, loading }) => ({
  testS,
  loading: loading.models.testS,
  loadingSuper: loading.effects['testS/fetch'],
  loadingChild: loading.effects['testS/childFetch'],
}))
@Form.create()
class TestScheme extends PureComponent {
  state = {
    addVisible:false,
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    page:{
      pageSize:10000,
      pageIndex:0
    },
    superId:null,
    rowId:null,
    conditions:[],
    childData:{},
    superData:{},
    updateSource:{},
    updateChildSource:{}
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'testS/fetch',
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

  handleChilddd = () => {
    this.setState({
      addChildVisible:true
    })
  };

  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'testS/deleteSelf',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'testS/fetch',
              payload:{
                ...page
              }
            })
          })
        }
      }
    })
  }

  handleChildDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,superId } = this.state;
    dispatch({
      type:'testS/deleteChild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'testS/childFetch',
              payload:{
                pageIndex:0,
                pageSize:10,
                conditions:[{
                  code:'QA_EXAMINE_ID',
                  exp:'=',
                  value:superId
                }]
              },
              callback:(res)=>{
                if(res.list){
                  this.setState({childData:res})
                }else{
                  this.setState({childData:{}})
                }
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
      const { code, name } = values;
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
          pageSize:100000,
          conditions,
        };
        dispatch({
          type:'testS/fetch',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'testS/fetch',
          payload:{
           ...page
          },
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
      type:'testS/fetch',
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

  updataChildRoute = (record)=>{
    this.setState({
      updateChildSource:record,
      updateChildVisible:true,
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superId} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    dispatch({
      type:'testS/childFetch',
      payload:{
        ...obj,
        conditions:[{
          code:'QA_EXAMINE_ID',
          exp:'=',
          value:superId
        }]
      },
      callback:(res)=>{
        if(res.list){
          this.setState({childData:res})
        }else{
          this.setState({childData:{}})
        }
      }
    })

  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;

    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='方案编号'>
              {getFieldDecorator('code')(<Input placeholder='请输入方案编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='方案名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入方案名称' />)}
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
      loadingSuper,loadingChild,
      testS:{data},
    } = this.props;
    const { updateSource,childData,updateVisible,superId,updateChildSource,updateChildVisible } = this.state;
    const columns = [
      {
        title: '方案编号',
        dataIndex: 'code',
      },
      {
        title: '方案名称',
        dataIndex: 'name',
      },
      {
        title: '检验方法',
        dataIndex: 'method',
        render:(text,record)=>{
          if(text == 0){
            return '全检'
          }else if(text == 1){
            return '抽检'
          }
        }
      },
      {
        title: '是否体现',
        dataIndex: 'incarnate',
        render:(text,record)=>{
          if(text == 0){
            return <Checkbox checked={false}/>
          }else if(text == 1){
            return <Checkbox checked={true}/>
          }
        }
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
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
    const childColumns = [
      {
        title: '序号',
        dataIndex: 'number',
      },
      {
        title: '检验编号',
        dataIndex: 'code',
      },
      {
        title: '检验项目名称',
        dataIndex: 'name',
      },
      {
        title: '检验要求',
        dataIndex: 'claim',
      },
      {
        title: '检验项目类型',
        dataIndex: 'projectType',
        render:(text,record)=>{
          if(text == 0){
            return '人工检验'
          }else if(text == 1){
            return '机械检验'
          }
        }
      },
      {
        title: '检验方法',
        dataIndex: 'method',
        render:(text,record)=>{
          if(text == 0){
            return '全检'
          }else if(text == 1){
            return '抽检'
          }
        }
      },
      {
        title: '标准值',
        dataIndex: 'standard',
        sorter: (a, b) => a.standard - b.standard,
      },
      {
        title: '上下平均值',
        dataIndex: 'average',
        sorter: (a, b) => a.average - b.average,
      },
      {
        title: '下界',
        dataIndex: 'boundary',
        sorter: (a, b) => a.boundary - b.boundary,
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleChildDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataChildRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const OnAddSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'testS/addself',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
                message.success('已完成',1.5,()=>{
                  clear();
                  this.setState({addVisible:false})
                  const { page } = this.state;
                  dispatch({
                    type:'testS/fetch',
                    payload:{
                      ...page
                    }
                  })
                });
              }else{
              message.error("新建失败")
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addVisible
    }

    const OnUpdateSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'testS/addself',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('已完成',1.5,()=>{
                clear();
                this.setState({updateVisible:false})
                const { page } = this.state;
                dispatch({
                  type:'testS/fetch',
                  payload:{
                    ...page
                  }
                })
              });
            }else{
              message.error("编辑失败")
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false
        })
      }
    }
    const OnUpdateData= {
      visible:updateVisible,
      record:updateSource
    }

    const OnAddChild ={
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        if(obj){
          if(!obj.qaExamineId){
            obj.qaExamineId = superId
          }
          if(obj.number){
            obj.number = Number(obj.number)
          }
          if(obj.standard){
            obj.standard = Number(obj.standard)
          }
          if(obj.average){
            obj.average = Number(obj.average)
          }
          if(obj.boundary){
            obj.boundary = Number(obj.boundary)
          }
        }
        dispatch({
          type:'testS/addchild',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('已完成',1.5,()=>{
                clear();
                this.setState({addChildVisible:false})
                dispatch({
                  type:'testS/childFetch',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                    conditions:[{
                      code:'QA_EXAMINE_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{
                    if(res.list){
                      this.setState({childData:res})
                    }else{
                      this.setState({childData:{}})
                    }
                  }
                })
              });
            }else{
              message.error("新建失败")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addChildVisible:false
        })
      }
    }
    const OnAddData = {
      visible:this.state.addChildVisible
    }

    const OnUpdateChild ={
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        if(obj){
          if(obj.number){
            obj.number = Number(obj.number)
          }
          if(obj.standard){
            obj.standard = Number(obj.standard)
          }
          if(obj.average){
            obj.average = Number(obj.average)
          }
          if(obj.boundary){
            obj.boundary = Number(obj.boundary)
          }
        }
        dispatch({
          type:'testS/addchild',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('已完成',1.5,()=>{
                clear();
                this.setState({updateChildVisible:false})
                dispatch({
                  type:'testS/childFetch',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                    conditions:[{
                      code:'QA_EXAMINE_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{
                    if(res.list){
                      this.setState({childData:res})
                    }else{
                      this.setState({childData:{}})
                    }
                  }
                })
              });
            }else{
              message.error("编辑失败")
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateChildVisible:false
        })
      }
    }
    const OnUpdateChildData = {
      visible:updateChildVisible,
      record:updateChildSource,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={loadingSuper}
            data={data}
            columns={columns}
            scroll={{ y: 260}}
            pagination={false}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  const { dispatch } = this.props;
                  const { page } = this.state;
                  dispatch({
                    type:'testS/childFetch',
                    payload:{
                      pageIndex:0,
                      pageSize:10,
                      conditions:[{
                        code:'QA_EXAMINE_ID',
                        exp:'=',
                        value:record.id
                      }]
                    },
                    callback:(res)=>{
                      if(res.list){
                        this.setState({childData:res})
                      }else{
                        this.setState({childData:{}})
                      }
                    }
                  })
                  this.setState({
                    superId:record.id,
                    rowId: record.id,
                    superData:record
                  })
                },
                rowKey:record.id
              }
            }}
            classNameSaveColumns={"TestScheme1"}
            rowClassName={this.setRowClassName}
            //onChange={this.handleStandardTableChange}
            title={() => <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>}
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{marginTop:15}}>
          <div style={{marginTop:'-18px'}}>
            <NormalTable
              loading={loadingChild}
              data={childData}
              columns={childColumns}
              classNameSaveColumns={"TestScheme2"}
              onChange={this.handleStandardTableChange}
              title={() => <Button icon="plus" onClick={this.handleChilddd} type="primary" disabled={superId?0:1}>
                新建
              </Button>
              }
            />
          </div>
          <AddChild on={OnAddChild} data={OnAddData} />

          <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TestScheme;
