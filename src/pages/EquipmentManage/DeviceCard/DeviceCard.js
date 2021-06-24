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
  Tabs,
  Checkbox,
  Select,
  message,
  Popconfirm,
} from 'antd';
import './tableSureBg.less'
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import DCchildADD from '@/pages/EquipmentManage/DeviceCard/DeviceCardAddChild';
import DCchildUpdate from '@/pages/EquipmentManage/DeviceCard/DeviceCardUpdateChild';
import AddSelfCommon from './AddSelf'
import UpdateSelfCommon from './UpdateSelf'

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ DC, loading }) => ({
  DC,
  loading: loading.models.DC,
  superLoading:loading.effects['DC/fetch'],
  childLoading:loading.effects['DC/childFetch'],
  weiXiuLoading:loading.effects['DC/childFetchListEnd']
}))
@Form.create()
class DeviceCard extends PureComponent {
  state = {
    page:{
      pageSize:1000000,
      pageIndex:0
    },
    conditions:[],
    superId:null,
    rowId:null,
    row2Id:null,
    superData:{},
    childfetchData:{},
    recordChild:{},
    childaddvisible:false,
    childupdatevisible:false,
    addVisible:false,
    updateVisible:false,
    updateSource:{},

    weiXiuData:[]
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'DC/fetch',
      payload:{
        ...page
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };

  handleCorpAddChild = ()=>{
    this.setState({
      childaddvisible:true
    })
  }

  updataRoute = (e,record) => {
    e.preventDefault();
    this.setState({
      updateVisible:true,
      updateSource:record
    })
  };

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'DC/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'DC/fetch',
              payload:{
                ...page
              }
            })
          })
        }
      }
    })
  }

  handleDeleteChild =(record)=>{
    const { id, } = record;
    const { dispatch } = this.props;
    const { superId } = this.state;
    dispatch({
      type:'DC/deleteChild',
      payload:{
        reqData:{
          id:id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'DC/childFetch',
              payload:{
                conditions:[{
                  code:'EQUIPMENT_ID',
                  exp:'=',
                  value:superId
                }]
              },
              callback:(res)=>{
                this.setState({childfetchData:res})
              }
            })
          })
        }
      }
    })
  }

  updataRouteChild = (e,record)=>{
    e.preventDefault()
    this.setState({
      recordChild:record,
      childupdatevisible:true

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
          type:'DC/fetch',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'DC/fetch',
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
      type:'DC/fetch',
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
        type:'DC/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'DC/fetch',
      payload: obj,
    });
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  setRowClassName2 = (record) => {
    return record.id === this.state.row2Id ? 'clickRowStyl' : '';
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
      loading,
      superLoading,
      childLoading,
      weiXiuLoading,
      DC:{fetchData},
      dispatch,
    } = this.props;
    const { childaddvisible, superId, childupdatevisible, recordChild,page,updateSource,weiXiuData } = this.state
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
        title: '设备类别',
        dataIndex: 'equipmentclName',
      },
      {
        title: '设备状态',
        dataIndex: 'equipmentstatusName',
      },
      {
        title: '规格',
        dataIndex: 'spec',
        sorter: (a, b) => a.spec - b.spec,
      },
      {
        title: '型号',
        dataIndex: 'model',
        sorter: (a, b) => a.model - b.model,
      },
      {
        title: '制造商',
        dataIndex: 'manufacturer',
      },
      {
        title: '使用部门',
        dataIndex: 'deptName',
      },
      {
        title: '责任人',
        dataIndex: 'psndocName',
      },
      {
        title: '开始使用日期',
        dataIndex: 'startUsedDate',
      },
      {
        title: '是否特种设备',
        dataIndex: 'specialflag',
        render: (text, record) => {
          if(text){
            return '是'
          }else{
            return '否'
          }
        }
      },
      {
        title: '电子标签',
        dataIndex: 'electroniclabel',
      },
      {
        title: '关联工作单元',
        dataIndex: 'workunitName',
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
          </Fragment>
        }
      },
    ];
    const columns2 = [
      {
        title: '保养项目编码',
        dataIndex: 'code',
      },
      {
        title: '保养部位',
        dataIndex: 'position',
      },
      {
        title: '保养内容',
        dataIndex: 'content',
      },
      {
        title: '要求',
        dataIndex: 'request',
      },
      {
        title: '周期',
        dataIndex: 'cycle',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 's',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChild(record)} disabled={this.state.superId ?0:1}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRouteChild(e,record)} disabled={this.state.superId ?0:1}>编辑</a>
          </Fragment>
        }
      },
    ];
    const columns3 = [
      {
        title: '保养时间',
        dataIndex: 'maintainDate',
      },
      {
        title: '保养记录',
        dataIndex: 'maintainAnnal',
      },
      {
        title: '是否合格',
        dataIndex: 'eligible',
        render:((text,record)=>{
          return <Checkbox checked={text}/>
        })
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
          </Fragment>
        }
      },
    ];

    const onAddChild = {
      onOk:(obj)=>{
        dispatch({
          type:'DC/addChild',
          payload:{
            reqData:{
              equipmentId:this.state.superId,
              ...obj,
            }
          },
          callback:(res)=>{
            if(res.errMsg == '成功'){
              message.success('子表创建成功',1,()=>{
                dispatch({
                  type:'DC/childFetch',
                  payload:{
                    conditions:[{
                      code:'EQUIPMENT_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{
                    this.setState({
                      childfetchData:res,
                      childaddvisible:false
                    })
                  }
                })
              })
            }

          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childaddvisible:false
        })
      }
    }
    const ChildAddData = {
      visible:childaddvisible,
    }
    const onUpdateChild = {
      onOk:(obj)=>{
        dispatch({
          type:'DC/addChild',
          payload:{
            reqData:{
              equipmentId:this.state.superId,
              id:recordChild.id,
              ...obj,
            }
          },
          callback:(res)=>{
            if(res.errMsg == '成功'){
              message.success('子表编辑成功',1,()=>{
                dispatch({
                  type:'DC/childFetch',
                  payload:{
                    conditions:[{
                      code:'EQUIPMENT_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{
                    this.setState({
                      childfetchData:res,
                      childupdatevisible:false
                    })
                  }
                })
              })
            }
          }
        })
      },
      handleCancel:()=>{
        this.setState({
          childupdatevisible:false
        })
      }
    }
    const ChildUpdateData = {
      visible: childupdatevisible,
      childdata:recordChild,
    }

    const OnAddSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'DC/addDC',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'DC/fetch',
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
          addVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addVisible
    }


    const OnUpdateData = {
      visible:this.state.updateVisible,
      record:updateSource
    }
    const OnUpdateSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'DC/addDC',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateVisible:false,
                  updateSource:{}
                })
                clear()
                dispatch({
                  type:'DC/fetch',
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
          updateVisible:false,
          updateSource:{}
        })
      }
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            style={{marginTop:'12px'}}
            loading={superLoading}
            scroll={{ y: 260}}
            data={fetchData}
            columns={columns}
            pagination={false}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  const { dispatch } = this.props;
                  dispatch({
                    type:'DC/childFetch',
                    payload:{
                      conditions:[{
                        code:'EQUIPMENT_ID',
                        exp:'=',
                        value:record.id
                      }],
                      ...this.state.page
                    },
                    callback:(res)=>{
                      this.setState({childfetchData:res})
                    }
                  });
                  if(record.id !== superId){
                    this.setState({
                      weiXiuData: [],
                      row2Id:null
                    })
                  }
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
            classNameSaveColumns={"DeviceCard1"} // 存进去的key
            title={() =>  <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" style={{marginRight:'20px'}}>
                新建
              </Button>
            </div>}
          />
          <AddSelfCommon on={OnAddSelf} data={OnSelfData} />
          <UpdateSelfCommon on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{marginTop:15}}>
          <div style={{marginBottom:'12px',marginTop:'-7px'}}>
            <Button icon="plus" onClick={this.handleCorpAddChild} type="primary" disabled={this.state.superId ?0:1}>
              新建
            </Button>
          </div>
          <DCchildADD on={onAddChild} data={ChildAddData} />
          <DCchildUpdate on={onUpdateChild} data={ChildUpdateData} />
          <Tabs >
            <TabPane tab="保养项目" key="1">
               <NormalTable
                loading={childLoading}
                data={this.state.childfetchData}
                columns={columns2}
                onRow={(record )=>{
                  return {
                    onClick:()=>{
                      const { dispatch } = this.props;
                      dispatch({
                        type:'DC/childFetchListEnd',
                        payload:{
                          conditions:[{
                            code:'MAINTENANCEPLAN_MAINTAIN_ID',
                            exp:'=',
                            value:record.id
                          }],
                          ...this.state.page
                        },
                        callback:(res) =>{
                          
                          this.setState({
                            weiXiuData:res
                          })
                        }
                      })
                      this.setState({
                        row2Id: record.id,
                      })
                    },
                    rowKey:record.id
                  }
                }}
                rowClassName={this.setRowClassName2}
                pagination={false}
                classNameSaveColumns={"DeviceCard2"}
              />
            </TabPane>
            <TabPane tab="保养记录" key="2">
              <NormalTable
                loading={weiXiuLoading}
                data={weiXiuData}
                columns={columns3}
                pagination={false}
                classNameSaveColumns={"DeviceCard3"}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeviceCard;
