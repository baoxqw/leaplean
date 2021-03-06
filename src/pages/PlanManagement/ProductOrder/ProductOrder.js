import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Checkbox,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import './tableBg.less'
import ProductOrderAdd from '@/pages/PlanManagement/ProductOrder/ProductOrderAdd';
import ProductOrderUpdate from '@/pages/PlanManagement/ProductOrder/ProductOrderUpdate';
import OrderOk from '@/pages/PlanManagement/ProductOrder/OrderOn';
import SmallOk from '@/pages/PlanManagement/ProductOrder/SmallOk';
import MaterialOk from '@/pages/PlanManagement/ProductOrder/MaterialOk';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

@connect(({ porder, loading }) => ({
  porder,
  loading: loading.effects['porder/fetch'],
  materailIssueLoading: loading.effects['porder/materailIssue'],
  setLoading: loading.effects['porder/materailSet'],
}))
@Form.create()
class ProductOrder extends PureComponent {
  state = {
    record: {},
    rowId: null,
    visible: false,
    page: {
      pageSize: 10,
      pageIndex: 0
    },
    conditions: [],
    addVisible: false,
    updateVisible: false,
    updateRecord: {},
    modData: [],
    makeSure: false,
    orderokVisible: false,
    smallVisible: false,
    materialVisible: false,
    orderStatus: false,
    numData: {},
    isMateIssue:true,
    setData:[],
    value:''
  };

  componentDidMount() {
    const { dispatch,location:{query},form } = this.props;
    const { page } = this.state;
    let reqData = {}
    if(query){
      reqData.value = query.conditions;
      form.setFieldsValue({
        code:query.conditions
      })
    }

    dispatch({
      type: 'porder/fetch',
      payload:{
        ...page,
        reqData
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({
      addVisible: true
    })
  };

  updataRoute = (e, record) => {
    e.preventDefault();
    this.setState({
      updateVisible: true,
      updateRecord: record
    })
  };

  handleDelete = (record) => {
    const { id, taskId } = record;
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type: 'porder/delete',
      payload: {
        reqData: {
          id,
          taskId
        }
      },
      callback: (res) => {
        if (res.errMsg === "??????") {
          message.success("????????????", 1, () => {
            dispatch({
              type: 'porder/fetch',
              payload: {
                ...page,
                reqData:{
                  value
                }
              }
            })
          })
        } else {
          message.error('????????????')
        }
      }
    })
  }

  //??????
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code } = values;
      this.setState({value:code})
      dispatch({
        type:'porder/fetch',
        payload:{
          ...page,
          reqData:{
            value:code
          }
        }
      })
    })
  }

  //??????
  handleFormReset = () => {
    const { dispatch,form } = this.props;
    //???????????????
    form.resetFields();
    this.setState({
      value:"",
      page:{
        pageSize:10,
        pageIndex:0
      },
    })
    //?????????????????????
    dispatch({
      type:'porder/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
    });
  };

  //??????
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { value } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        value
      }

    };
    this.setState({
      page:{
        pageIndex: pagination.current-1,
        pageSize: pagination.pageSize,
      }
    })
    dispatch({
      type:'porder/fetch',
      payload: obj,
    });
  };

  //????????????
  orderSure = () => {
    const { record } = this.state
    const { dispatch } = this.props
    let conditions = [{
      code: 'MATERIAL_BASE_ID',
      exp: '=',
      value: record.materialBaseId
    }]
    dispatch({
      type: 'porder/findbom',
      payload: {
        conditions
      },
      callback: (res) => {
        console.log("res",res)
        if (res.resData && res.resData.length) {
          dispatch({
            type: 'porder/findrout',
            payload: {
              conditions
            },
            callback: (res) => {
              if (res.resData && res.resData.length) {
                this.setState({ makeSure: true })
              } else {
                return message.error('????????????????????????')
              }
            }
          });
        } else {
          return message.error('????????????BOM')
        }
      }
    })
  }

  //????????????
  orderOk = () => {
    this.setState({ orderokVisible: true })
  }

  //?????????????????????
  samllOk = () => {
    this.setState({ smallVisible: true })
  }
  //????????????????????????
  materisOk = () => {
    this.setState({ materialVisible: true })
    const { record } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'porder/materailSet',
      payload: {
        pageIndex:0,
        pageSize:10000000,
        reqData: {
          taskId:record.taskId
        }
      },
      callback:(res)=>{

        if(res.resData){
          this.setState({
            setData:res.resData
          })
        }else{
         this.setState({
           setData:[]
         })
        }
      }
    })
  }
  //????????????
  materisIssue = () => {
    const { record } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'porder/materailIssue',
      payload: {
        reqData: {
          productId: record.id
        }
      },
      callback:(res)=>{
        if (res.errMsg === "??????") {
          message.success('??????????????????',1,()=>{
            dispatch({
              type: 'porder/fetch',
              payload: {
                conditions: [{
                  code: 'CANCEL',
                  exp: '=',
                  value: 0
                }],
                ...this.state.page
              }
            })
          })

        }
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={(e) => this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='????????????'>
              {getFieldDecorator('code')(<Input placeholder='?????????????????????' suffix={
                <Tooltip title={IntegratedQuery.ProductOrder}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            {/*<FormItem label='????????????'>
              {getFieldDecorator('name')(<Input placeholder='?????????????????????' />)}
            </FormItem>*/}
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  handleOk = e => {
    const { modData, record } = this.state;
    const { dispatch } = this.props;
    const productorderId = record.id; //????????????id
    const workcenterId = record.workcenterId; //???????????? ????????????id
    const productnum = record.ordernum; //???????????? ????????????
    const planstarttime = record.planstarttime; //???????????? ??????????????????
    const planendtime = record.planendtime; //???????????? ??????????????????
    let arr = [];
    if (modData.list) {
      modData.list.map(item => {
        let technologyBId = item.id; //??????????????????id

        let qualifiednum = null;
        let unqualifiednum = null;
        let manhour = null;
        let preparehour = null;
        let actualhour = null;
        let processpsnId = null;
        let processdate = '';
        let checkpsnId = null;
        let checkdate = '';
        let checkresult = '';
        let checkbillId = null;
        let firstcheckpsnId = null;
        let firstcheckdate = '';
        let firstcheckresult = '';
        let eachothercheckpsnId = null;
        let eachothercheckdate = '';
        let checknum = null;
        let scrapnum = null;
        let processstatus = null;
        let principalpsnId = null;
        let billdate = '';
        let assignflag = '';
        let assignjobId = null;
        let actstarttime = '';
        let actendtime = '';
        let actstarttimerecently = '';
        let memo = '';

        let obj = {
          technologyBId,
          productorderId,
          workcenterId,
          productnum,
          planstarttime,
          planendtime,
          qualifiednum,
          unqualifiednum,
          manhour,
          preparehour,
          actualhour,
          processpsnId,
          processdate,
          checkpsnId,
          checkdate,
          checkresult,
          checkbillId,
          firstcheckpsnId,
          firstcheckdate,
          firstcheckresult,
          eachothercheckpsnId,
          eachothercheckdate,
          checknum,
          scrapnum,
          processstatus,
          principalpsnId,
          billdate,
          assignflag,
          assignjobId,
          actstarttime,
          actendtime,
          actstarttimerecently,
          memo
        };
        arr.push(obj)
      })
    } else {
      this.setState({
        visible: false,
      });
      return
    }
    dispatch({
      type: 'porder/batchadd',
      payload: {
        reqDataList: arr
      },
      callback: (res) => {
        if (res.errMsg === '??????') {
          message.success("??????")
        } else {
          message.success("??????")
        }
        this.setState({
          visible: false,
        });
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {
      loading,
      porder: { data },
      dispatch,
      materailIssueLoading,
      setLoading
    } = this.props;
    console.log('---',data)
    const columns = [
      {
        title: '????????????',
        dataIndex: 'code',
      },
      {
        title: '????????????',
        dataIndex: 'materialName',
      },
      {
        title: '????????????',
        dataIndex: 'materialCode',
      },
      {
        title: '????????????',
        dataIndex: 'orderNum',

      },
      {
        title: '????????????',
        dataIndex: 'orderStatus',
        // render: (text, record) => {
        //   if (text === 0) {
        //     return '????????????'
        //   } else if (text === 1) {
        //     return '???????????????'
        //   } else if (text === 2) {
        //     return '????????????'
        //   } else if (text === 3) {
        //     return '????????????'
        //   }

        // },
      },
      {
        title: '????????????',
        dataIndex: 'finishNum',

      },
      {
        title: '??????????????????',
        dataIndex: 'planStartTime',
      },
      {
        title: '??????????????????',
        dataIndex: 'planEndTime',
      },
      {
        title: '??????????????????',
        dataIndex: 'actStartTime',
      },
      {
        title: '??????????????????',
        dataIndex: 'actEndTime',
      },
      {
        title: '????????????',
        dataIndex: 'workCenterName',
      },
      {
        title: '?????????',
        dataIndex: 'billMakerName',
      },
      {
        title: '??????????????????',
        dataIndex: 'createDate',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            {
              record.status === "????????????"?<Popconfirm title="????????????????" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">??????</a>
              </Popconfirm>:<a href="#javascript:;" style={{color:'#afa9a9'}}>??????</a>
            }

            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRoute(e, record)}>??????</a>
          </Fragment>
        }
      },
    ];

    const columns2 = [
      {
        title: '?????????',
        dataIndex: 'vno',
      },
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
        dataIndex: 'divisionname',
      },
      {
        title: '?????????',
        dataIndex: 'productionlinename',
      },
      {
        title: '???????????????',
        dataIndex: 'workstationtypename',
      },
      {
        title: '???????????????',
        dataIndex: 'assignedtooperation',
      },
      {
        title: '???????????????',
        dataIndex: 'quantityofworkstations',
      },
      {
        title: '????????????',
        dataIndex: 'timetype',
      },
      {
        title: '????????????',
        dataIndex: 'setuptime',
      },
      {
        title: '????????????',
        dataIndex: 'productiontime',
      },
      {
        title: '????????????',
        dataIndex: 'waitingtime'
      },
      {
        title: '????????????',
        dataIndex: 'transfertime',
      },
      {
        title: '????????????',
        dataIndex: 'disassemblytime',
      },
      {
        title: '????????????????????????',
        dataIndex: 'productioninonecycle',
      },
      {
        title: '???????????????',
        dataIndex: 'machineutilization',
      }, {
        title: '???????????????',
        dataIndex: 'laborutilization',
      },
      {
        title: '???????????????',
        dataIndex: 'checkFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '???????????????',
        dataIndex: 'handoverFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '????????????',
        dataIndex: 'backflushFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '???????????????',
        dataIndex: 'countFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '??????????????????',
        dataIndex: 'parallelFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      },
      {
        title: '????????????',
        dataIndex: 'checktype',
      },
      {
        title: '????????????',
        dataIndex: 'effectdate',
      },
      {
        title: '????????????',
        dataIndex: 'invaliddate',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
      },
    ];

    const { page, numData, setData,addVisible, isMateIssue,updateVisible, updateRecord, orderokVisible, record, rowId, smallVisible, materialVisible, makeSure, orderStatus } = this.state;

    const AddData = {
      visible: addVisible
    };

    const AddOn = {
      onSave: (res, clear) => {
        dispatch({
          type: 'porder/addOrder',
          payload: {
            reqData: {
              ...res,
            }
          },
          callback: (res) => {
            if (res.errMsg === "??????") {
              message.success("????????????", 1, () => {
                clear();
                this.setState({
                  addVisible: false
                });
                dispatch({
                  type: 'porder/fetch',
                  payload: {
                    conditions: [{
                      code: 'CANCEL',
                      exp: '=',
                      value: 0
                    }],
                    ...page
                  }
                })
              })
            } else {
              clear(1);
              message.error("????????????")
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          addVisible: false
        })
      }
    };

    const UpdateData = {
      visible: updateVisible,
      record: updateRecord
    };

    const UpdateOn = {
      onSave: (res, clear) => {

        dispatch({
          type: 'porder/addOrder',
          payload: {
            reqData: {
              ...res
            }
          },
          callback: (res) => {

            if (res.errMsg === "??????") {
              message.success("????????????", 1, () => {
                clear();
                this.setState({
                  updateVisible: false
                });
                dispatch({
                  type: 'porder/fetch',
                  payload: {
                    conditions: [{
                      code: 'CANCEL',
                      exp: '=',
                      value: 0
                    }],
                    ...page
                  }
                })
              })
            } else {
              clear(1);
              message.error("????????????")
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateVisible: false,
          updateRecord: {}
        })
      }
    };

    const OrderData = {
      visible: orderokVisible
    }
    const OrderOn = {
      onOk: (obj, clear) => {
        let a = {
          reqData: {
            ...obj,
            productorderId: rowId,
          }
        }
        dispatch({
          type: 'porder/addproduct',
          payload: a,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('??????????????????', 1.5, () => {
                clear()
                this.setState({
                  orderokVisible: false,
                  makeSure: false,
                })
                dispatch({
                  type: 'porder/changest',
                  payload: {
                    reqData: {
                      id: rowId,
                      orderStatus: '1',
                    }
                  },
                  callback: (res) => {
                    this.setState({
                      orderStatus: false
                    })

                    if (res.errCode === '0') {
                      dispatch({
                        type: 'porder/fetch',
                        payload: {
                          conditions: [{
                            code: 'CANCEL',
                            exp: '=',
                            value: 0
                          }],
                          ...page
                        }
                      })
                    }
                  }
                })
              })
            } else {
              clear(1)
              message.error('??????????????????')
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          orderokVisible: false,
          makeSure: false,
        })
      }
    }

    const SmallOn = {
      onCancel: () => {
        this.setState({
          smallVisible: false
        })
      }
    }
    const SmallData = {
      record: record,
      visible: smallVisible
    }

    const MaterialOn = {
      onOk: (obj) => {

      },
      onCancel: () => {
        this.setState({
          materialVisible: false,
        })
      }
    }
    const MaterialData = {
      record: setData,
      visible: materialVisible,
      loading:setLoading,
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={loading}
            data={data}
            columns={columns}
            classNameSaveColumns={"ProductOrder1"}
            onChange={this.handleStandardTableChange}
            onRow={(record) => {
              return {
                onClick: () => {
                  if(record.orderStatus === '?????????'){
                    this.setState({
                      isMateIssue:true
                    })
                  }else{
                    this.setState({
                      isMateIssue:false
                    })
                  }
                  if (record.orderStatus === '????????????') {
                    this.setState({
                      orderStatus: true
                    })
                  } else {
                    this.setState({
                      orderStatus: false
                    })
                  }
                  this.setState({
                    record,
                    rowId: record.id,
                    makeSure: false,
                  });
                },
                rowKey: record.id
              }
            }}
            rowClassName={this.setRowClassName}
            title={() => <div>
              {/* <Button icon="plus" onClick={this.handleCorpAdd} type="primary">
                ??????
              </Button> */}

              <Button style={{}} disabled={!orderStatus} onClick={this.orderSure} type="primary" >
                ????????????
              </Button>
              <Button style={{ marginLeft: 20 }} disabled={!makeSure} onClick={this.orderOk} type="primary" >
                ????????????
              </Button>
              <Button style={{ marginLeft: 20 }} disabled={!this.state.rowId} type="primary" onClick={this.samllOk}>
                ?????????????????????
              </Button>
              <Button style={{ marginLeft: 20 }} disabled={!this.state.rowId} type="primary" onClick={this.materisOk}>
                ????????????????????????
              </Button>
              <Button style={{ marginLeft: 20 }}
                loading={materailIssueLoading}
                disabled={isMateIssue} type="primary" onClick={this.materisIssue}>
                ????????????
              </Button>
            </div>}
          />

          <ProductOrderAdd on={AddOn} data={AddData} />

          <ProductOrderUpdate on={UpdateOn} data={UpdateData} />
          {/* ???????????? */}
          <OrderOk on={OrderOn} data={OrderData} />
          <SmallOk on={SmallOn} data={SmallData} />
          <MaterialOk on={MaterialOn} data={MaterialData} />
        </Card>

        <Modal
          title="????????????"
          destroyOnClose
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={'70%'}
          centered
        >
          <Card bordered style={{ height: `${window.innerHeight > 960 ? 760 : window.innerHeight / 1.5}px` }}>
            <NormalTable
              data={this.state.modData}
              scroll={{ y: window.screen.height >= 900 ? window.innerHeight / 2.5 : window.innerHeight / 3 }}
              columns={columns2}
              classNameSaveColumns={"ProductOrder2"}
            />
          </Card>
        </Modal>

      </PageHeaderWrapper>
    );
  }
}

export default ProductOrder;
