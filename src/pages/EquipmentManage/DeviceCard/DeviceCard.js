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
        if(res.errMsg === "??????"){
          message.success("????????????",1,()=>{
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
        if(res.errMsg === "??????"){
          message.success("????????????",1,()=>{
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

  //??????
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

  //??????
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    const { page } = this.state;
    this.setState({
      conditions:[]
    })
    //???????????????
    form.resetFields();
    //?????????????????????
    dispatch({
      type:'DC/fetch',
      payload:{
        ...page
      }
    });
  };

  //??????
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
            <FormItem label='????????????'>
              {getFieldDecorator('code')(<Input placeholder='?????????????????????' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='????????????'>
            {getFieldDecorator('name')(<Input placeholder='?????????????????????' />)}
          </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               ??????
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
        title: '????????????',
        dataIndex: 'code',
      },
      {
        title: '????????????',
        dataIndex: 'name',
      },
      {
        title: '????????????',
        dataIndex: 'equipmentclName',
      },
      {
        title: '????????????',
        dataIndex: 'equipmentstatusName',
      },
      {
        title: '??????',
        dataIndex: 'spec',
        sorter: (a, b) => a.spec - b.spec,
      },
      {
        title: '??????',
        dataIndex: 'model',
        sorter: (a, b) => a.model - b.model,
      },
      {
        title: '?????????',
        dataIndex: 'manufacturer',
      },
      {
        title: '????????????',
        dataIndex: 'deptName',
      },
      {
        title: '?????????',
        dataIndex: 'psndocName',
      },
      {
        title: '??????????????????',
        dataIndex: 'startUsedDate',
      },
      {
        title: '??????????????????',
        dataIndex: 'specialflag',
        render: (text, record) => {
          if(text){
            return '???'
          }else{
            return '???'
          }
        }
      },
      {
        title: '????????????',
        dataIndex: 'electroniclabel',
      },
      {
        title: '??????????????????',
        dataIndex: 'workunitName',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 's',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="????????????????" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>??????</a>
          </Fragment>
        }
      },
    ];
    const columns2 = [
      {
        title: '??????????????????',
        dataIndex: 'code',
      },
      {
        title: '????????????',
        dataIndex: 'position',
      },
      {
        title: '????????????',
        dataIndex: 'content',
      },
      {
        title: '??????',
        dataIndex: 'request',
      },
      {
        title: '??????',
        dataIndex: 'cycle',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 's',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="????????????????" onConfirm={() => this.handleDeleteChild(record)} disabled={this.state.superId ?0:1}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRouteChild(e,record)} disabled={this.state.superId ?0:1}>??????</a>
          </Fragment>
        }
      },
    ];
    const columns3 = [
      {
        title: '????????????',
        dataIndex: 'maintainDate',
      },
      {
        title: '????????????',
        dataIndex: 'maintainAnnal',
      },
      {
        title: '????????????',
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
            <Popconfirm title="????????????????" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>??????</a>
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
            if(res.errMsg == '??????'){
              message.success('??????????????????',1,()=>{
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
            if(res.errMsg == '??????'){
              message.success('??????????????????',1,()=>{
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
            if(res.errMsg === "??????"){
              message.success("????????????",1,()=>{
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
            if(res.errMsg === "??????"){
              message.success("????????????",1,()=>{
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
              message.error('??????')
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
            classNameSaveColumns={"DeviceCard1"} // ????????????key
            title={() =>  <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" style={{marginRight:'20px'}}>
                ??????
              </Button>
            </div>}
          />
          <AddSelfCommon on={OnAddSelf} data={OnSelfData} />
          <UpdateSelfCommon on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{marginTop:15}}>
          <div style={{marginBottom:'12px',marginTop:'-7px'}}>
            <Button icon="plus" onClick={this.handleCorpAddChild} type="primary" disabled={this.state.superId ?0:1}>
              ??????
            </Button>
          </div>
          <DCchildADD on={onAddChild} data={ChildAddData} />
          <DCchildUpdate on={onUpdateChild} data={ChildUpdateData} />
          <Tabs >
            <TabPane tab="????????????" key="1">
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
            <TabPane tab="????????????" key="2">
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
