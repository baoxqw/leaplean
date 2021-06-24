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
import './tableBg.less'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from '@/pages/EquipmentManage/ProductRepair/AddSelfProduct';
import UpdateSelf from '@/pages/EquipmentManage/ProductRepair/UpdateSelfProduct';
import FillRepair from '@/pages/EquipmentManage/ProductRepair/FillRepair';
import UpdateFillRepair from '@/pages/EquipmentManage/ProductRepair/UpdateFillRepair';
import AddRepairPiece from './AddRepairPiece'
import UpdateRepairPiece from './UpdateRepairPiece'
import storage from '@/utils/storage';


const FormItem = Form.Item;

@connect(({ EMA, loading }) => ({
  EMA,
  loading: loading.models.EMA,
  superloading: loading.effects['EMA/fetchProduct'],
  childloading: loading.effects['EMA/fetchrepair']
}))
@Form.create()
class ProductRepair extends PureComponent {

  state = {
    addVisible:false,
    addRepairPieceVisible:false,
    updateRepairPieceVisible:false,
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    updateSource:[],
    page:{
      pageSize:10,
      pageIndex:0
    },
    superId:null,
    conditions:[],
    childData:[],
    superData:{},
    uData:{},
    rowId:null,
    addRepairVisible:false,
    repairData:[],
    repairUpdateVisible:false,
    repairUpdateData:{},
    pieceData:[],
    peaceVisible:false,
    peaceRecord:{},
    updateRepairPieceSource:{},
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'EMA/fetchProduct',
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

  fillRepair = ()=>{
    this.setState({
      addRepairVisible:true,
    })
  }

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
      type:'EMA/deleteSelf',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'EMA/fetchProduct',
              payload:{
                ...page
              }
            })
          })
        }
      }
    })
  }

  updataRepair = (e,record)=>{
    e.preventDefault();
    this.setState({
      repairUpdateData:record,
      repairUpdateVisible:true
    })
  }

  repairDelete = (record)=>{
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'EMA/deleteRepair',
      payload:{
        reqData:{
          id:record.id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'EMA/fetchrepair',
              payload:{

                  conditions:[{
                    code:'REPAIRORDER_ID',
                    exp:'=',
                    value:this.state.superId
                  }]

              },
              callback:(res)=>{
                if(res.resData){
                  this.setState({repairData:res.resData})
                }else{
                  this.setState({repairData:[]})
                }
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
                conditions:[{
                  code:'QA_EXAMINE_ID',
                  exp:'=',
                  value:superId
                }]
              },
              callback:(res)=>{
                if(res && res.resData && res.resData.length) {
                  this.setState({
                    childData: res.resData
                  })
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
      if(!code && !name){
        dispatch({
          type:'testS/fetch',
          payload:{
            ...page
          }
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
          type:'testS/fetch',
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
      type:'testS/fetch',
      payload:{
        ...page
      }
    });
  };

  //编辑
  updataRoute = (e,record)=>{
    e.preventDefault();
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
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
        type:'testS/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'testS/fetch',
      payload: obj,
    });

  };

  peace = (e,record)=>{
    const { dispatch } = this.props
    e.preventDefault()
    dispatch({
      type:'EMA/fetchRepairPiece',
      payload:{
        conditions:[{
          code:'MAINTENANCEREPORT_ID',
          exp:'=',
          value:record.id,
        }],
      },
      callback:(res)=>{
        this.setState({
          pieceData:res
        })
      }

    })
    this.setState({
      peaceVisible:true,
      peaceRecord:record
    })
  }

  peaceok = ()=>{
    this.setState({
      peaceVisible:false,
      peaceRecord:{}
    })
  }

  addPeice = ()=>{
    this.setState({
      addRepairPieceVisible:true
    })
  }

  handleDeletepeace = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,peaceRecord } = this.state;
    dispatch({
      type:'EMA/deletepeice',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'EMA/fetchRepairPiece',
              payload:{
                conditions:[{
                  code:'MAINTENANCEREPORT_ID',
                  exp:'=',
                  value:peaceRecord.id,
                }],
                ...page
              },
              callback:(res)=>{

              }

            })
          })
        }
      }
    })
  }

  updataRoutepeace = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateRepairPieceSource:record,
      updateRepairPieceVisible:true,
    })
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
            <FormItem label='单据编码'>
              {getFieldDecorator('code')(<Input placeholder='请输入单据编码' />)}
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
      superloading,
      childloading,
      dispatch,
      EMA:{data,datapiece},
    } = this.props;

    const { updateSource,updateVisible,addRepairVisible,uData,repairData,
      repairUpdateData,repairUpdateVisible,pieceData,superId,peaceRecord,
      addRepairPieceVisible,updateRepairPieceVisible } = this.state;
    const columns = [
      {
        title: '单据编号',
        dataIndex: 'billcode',
      },
      {
        title: '申请时间',
        dataIndex: 'application',
      },
      {
        title: '所属设备',
        dataIndex: 'deviceId',
      },
      {
        title: '维修人员',
        dataIndex: 'serviceId',
      },
      {
        title: '故障类型',
        dataIndex: 'faultTypeId',
      },
      {
        title: '申请人',
        dataIndex: 'personId',
      },
      {
        title: '故障描述',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
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
        title: '开始维修时间',
        dataIndex: 'starttime',
      },
      {
        title: '结束维修时间',
        dataIndex: 'endtime',
      },
      {
        title: '是否扩展',
        dataIndex: 'isextension',
        render:(text)=>{
          return <Checkbox checked={text} disabled={!text}/>
        }
      },
      {
        title: '开始暂停时间',
        dataIndex: 'startpause',
      },
      {
        title: '结束暂停时间',
        dataIndex: 'endpause',
      },
      {
        title: '停机工时',
        dataIndex: 'parkinghours',
        sorter: (a, b) => a.parkinghours - b.parkinghours,
      },
      {
        title: '外包维修商',
        dataIndex: 'businessId',
      },
      {
        title: '默认维修工时',
        dataIndex: 'ishours',
        sorter: (a, b) => a.ishours - b.ishours,
        render:(text)=>{
          return <Checkbox checked={text} disabled={!text}/>
        }
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.repairDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRepair(e,record)}>编辑</a>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.peace(e,record)}>备件</a>
          </Fragment>
        }
      },
    ];
    const columns3 = [
      {
        title: '物料编码',
        dataIndex: 'materialCode',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '规格型号',
        dataIndex: 'spec',
        sorter: (a, b) => a.spec - b.spec,
      },
      {
        title: '数量',
        dataIndex: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeletepeace(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoutepeace(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ]

    const OnAddSelf = {
      onOk:(obj)=>{
        dispatch({
          type:'EMA/addself',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({addVisible:false})
            const { page } = this.state;
            if(res.errCode === '0'){
              message.success('新建成功',1.5,()=>{
                dispatch({
                  type:'EMA/fetchProduct',
                  payload:{
                    ...page
                  }
                })
              });
            }
          }
        })

      },
      onCancle:()=>{
        this.setState({
          addVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addVisible
    }
    const OnUpdateSelf = {
      onOk:(obj)=>{
        dispatch({
          type:'EMA/addself',
          payload:{
            reqData:{
              id:this.state.updateSource.id,
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({updateVisible:false})
            const { page } = this.state;
            if(res.errCode === '0'){
              message.success('已完成',1.5,()=>{
                dispatch({
                  type:'EMA/fetchProduct',
                  payload:{
                    ...page
                  }
                })
              });
            }
          }
        })

      },
      onCancle:()=>{
        this.setState({
          updateVisible:false
        })
      }
    }
    const OnUpdateData= {
      visible:updateVisible,
      initdate:updateSource
    }

    const OnAddRepair = {
      onOk:(obj)=>{
        dispatch({
          type:'EMA/addrepair',
          payload:{
            reqData:{
              repairorderId:this.state.superId,
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({
              addRepairVisible:false
            })
            if(res.errCode === '0'){
              message.success('新建成功',1.5,()=>{
                dispatch({
                  type:'EMA/fetchrepair',
                  payload:{

                      conditions:[{
                        code:'REPAIRORDER_ID',
                        exp:'=',
                        value:this.state.superId
                      }]

                  },
                  callback:(res)=>{
                    if(res.resData){
                      this.setState({repairData:res.resData})
                    }else{
                      this.setState({repairData:[]})
                    }
                  }
                })
              });
            }
          }
        })
      },
      onCancle:()=>{
        this.setState({
          addRepairVisible:false
        })
      },
      addpeace:(object)=>{

      }
    }
    const OnRepairData = {
      visible:addRepairVisible,
      initdata:uData,
      record:uData,
      pieceData:pieceData,
    }
    const OnUpdateRepair = {
      onOk:(obj)=>{
        dispatch({
          type:'EMA/addrepair',
          payload:{
            reqData:{
              id:repairUpdateData.id,
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({
              repairUpdateVisible:false
            })
            if(res.errCode === '0'){
              message.success('编辑成功',1.5,()=>{
                dispatch({
                  type:'EMA/fetchrepair',
                  payload:{

                      conditions:[{
                        code:'REPAIRORDER_ID',
                        exp:'=',
                        value:this.state.superId
                      }]

                  },
                  callback:(res)=>{
                    if(res.resData){
                      this.setState({repairData:res.resData})
                    }else{
                      this.setState({repairData:[]})
                    }
                  }
                })
              });
            }
          }
        })
      },
      onCancle:()=>{
        this.setState({
          repairUpdateVisible:false
        })
      }
    }
    const OnUpdateRepairData = {
      visible:repairUpdateVisible,
      initdata:repairUpdateData
    }

    const OnRepairPeace = {
      onSave:(obj,clear)=>{
        
        dispatch({
          type:'EMA/addpeice',
          payload:{
            reqData:{
              maintenancereportId:peaceRecord.id,
              ...obj,
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('新建成功',1.5,()=>{
                this.setState({
                  addRepairPieceVisible:false
                })
                clear()
                dispatch({
                  type:'EMA/fetchRepairPiece',
                  payload:{
                    conditions:[{
                      code:'MAINTENANCEREPORT_ID',
                      exp:'=',
                      value:peaceRecord.id,
                    }],
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                  }
                })
              });
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear()
        this.setState({
          addRepairPieceVisible:false
        })
      }
    }
    const OnRepairPeaceData = {
      visible:addRepairPieceVisible,
    }

    const OnUpdateRepairPeace = {
      onSave:(obj,clear)=>{

        dispatch({
          type:'EMA/addpeice',
          payload:obj,
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('编辑成功',1.5,()=>{
                this.setState({
                  updateRepairPieceVisible:false
                })
                clear()
                dispatch({
                  type:'EMA/fetchRepairPiece',
                  payload:{
                    conditions:[{
                      code:'MAINTENANCEREPORT_ID',
                      exp:'=',
                      value:peaceRecord.id,
                    }],
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                  }
                })
              });
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear()
        this.setState({
          updateRepairPieceVisible:false
        })
      }
    }
    const OnUpdateRepairPeaceData = {
      record:this.state.updateRepairPieceSource,
      visible:updateRepairPieceVisible,
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={superloading}
            data={data}
            columns={columns}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  this.setState({
                    rowId: record.id,
                    superId:record.id,
                    uData:record,
                  })
                  dispatch({
                    type:'EMA/fetchrepair',
                    payload:{
                      conditions:[{
                        code:'REPAIRORDER_ID',
                        exp:'=',
                        value:record.id
                      }],
                      pageIndex:0,
                      pageSize:1000000
                    },
                    callback:(res)=>{
                      if(res && res.resData && res.resData.length) {
                        this.setState({repairData:res.resData})
                      }else{
                        this.setState({repairData:[]})
                      }
                    }
                  })
                },
                rowKey:record.id
              }
            }}
            rowClassName={this.setRowClassName}
            onChange={this.handleStandardTableChange}
            classNameSaveColumns={"ProductRepair1"}
            title={() =><div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>}
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
          {/* 填写报修单 */}
        </Card>
        <Card bordered={false} style={{marginTop:'15px'}}>
          <div style={{marginTop:'-18px'}}>
            <NormalTable
              loading={childloading}
              data={{list:repairData}}
              columns={columns2}
              pagination={false}
              classNameSaveColumns={"ProductRepair2"}
              //onChange={this.handleStandardTableChange}
              title={() => <Button icon="plus" onClick={this.fillRepair}
                                   type="primary"
                                   disabled={this.state.superId?0:1}
              >
                填写报修单
              </Button>}
            />
          </div>

          <FillRepair on={OnAddRepair} data={OnRepairData} />
          <UpdateFillRepair on={OnUpdateRepair} data={OnUpdateRepairData} />
        </Card>
        <Modal
          title={"备件"}
          visible={this.state.peaceVisible}
          width='80%'
          destroyOnClose
          centered
          onCancel={this.peaceok}
          footer={[
            // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
            <Button  type="primary"  onClick={this.peaceok}>
              确定
            </Button>,
          ]}
        >
          <div>
            <Button icon="plus" onClick={this.addPeice}
                    type="primary"
                    style={{marginBottom:'20px'}}>
              新建
            </Button>
            <NormalTable
              loading={loading}
              data={datapiece}
              columns={columns3}
              pagination={false}
            />
            <AddRepairPiece on={ OnRepairPeace } data={ OnRepairPeaceData}/>
            <UpdateRepairPiece on={ OnUpdateRepairPeace } data={ OnUpdateRepairPeaceData}/>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ProductRepair;
