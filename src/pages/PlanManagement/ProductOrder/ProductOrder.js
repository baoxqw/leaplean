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
        if (res.errMsg === "成功") {
          message.success("取消成功", 1, () => {
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
          message.error('取消失败')
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

  //取消
  handleFormReset = () => {
    const { dispatch,form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      value:"",
      page:{
        pageSize:10,
        pageIndex:0
      },
    })
    //清空后获取列表
    dispatch({
      type:'porder/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
    });
  };

  //分页
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

  //订单确认
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
                return message.error('没有维护工艺路线')
              }
            }
          });
        } else {
          return message.error('没有维护BOM')
        }
      }
    })
  }

  //订单下达
  orderOk = () => {
    this.setState({ orderokVisible: true })
  }

  //查看最小齐套数
  samllOk = () => {
    this.setState({ smallVisible: true })
  }
  //查看物资配套情况
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
  //物资发料
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
        if (res.errMsg === "成功") {
          message.success('物资发料成功',1,()=>{
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
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.ProductOrder}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            {/*<FormItem label='订单名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入订单名称' />)}
            </FormItem>*/}
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  handleOk = e => {
    const { modData, record } = this.state;
    const { dispatch } = this.props;
    const productorderId = record.id; //生产订单id
    const workcenterId = record.workcenterId; //生产订单 工作中心id
    const productnum = record.ordernum; //生产订单 订单数量
    const planstarttime = record.planstarttime; //生产订单 计划开始时间
    const planendtime = record.planendtime; //生产订单 计划完成时间
    let arr = [];
    if (modData.list) {
      modData.list.map(item => {
        let technologyBId = item.id; //工艺路线子表id

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
        if (res.errMsg === '成功') {
          message.success("成功")
        } else {
          message.success("失败")
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
        title: '订单编号',
        dataIndex: 'code',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
      },
      {
        title: '订单数量',
        dataIndex: 'orderNum',

      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        // render: (text, record) => {
        //   if (text === 0) {
        //     return '初始状态'
        //   } else if (text === 1) {
        //     return '订单已下达'
        //   } else if (text === 2) {
        //     return '订单完成'
        //   } else if (text === 3) {
        //     return '取消订单'
        //   }

        // },
      },
      {
        title: '完工数量',
        dataIndex: 'finishNum',

      },
      {
        title: '计划开工时间',
        dataIndex: 'planStartTime',
      },
      {
        title: '计划完工时间',
        dataIndex: 'planEndTime',
      },
      {
        title: '实际开工时间',
        dataIndex: 'actStartTime',
      },
      {
        title: '实际完工时间',
        dataIndex: 'actEndTime',
      },
      {
        title: '工作中心',
        dataIndex: 'workCenterName',
      },
      {
        title: '制单人',
        dataIndex: 'billMakerName',
      },
      {
        title: '订单创建日期',
        dataIndex: 'createDate',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            {
              record.status === "初始状态"?<Popconfirm title="确定取消吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">取消</a>
              </Popconfirm>:<a href="#javascript:;" style={{color:'#afa9a9'}}>取消</a>
            }

            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRoute(e, record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const columns2 = [
      {
        title: '工序号',
        dataIndex: 'vno',
      },
      {
        title: '工序编码',
        dataIndex: 'code',
      },
      {
        title: '工序名称',
        dataIndex: 'name',
      },
      {
        title: '所属区域',
        dataIndex: 'divisionname',
      },
      {
        title: '生产线',
        dataIndex: 'productionlinename',
      },
      {
        title: '工作站名称',
        dataIndex: 'workstationtypename',
      },
      {
        title: '工作站类型',
        dataIndex: 'assignedtooperation',
      },
      {
        title: '工作站数量',
        dataIndex: 'quantityofworkstations',
      },
      {
        title: '时间类型',
        dataIndex: 'timetype',
      },
      {
        title: '准备时间',
        dataIndex: 'setuptime',
      },
      {
        title: '生产时间',
        dataIndex: 'productiontime',
      },
      {
        title: '等待时间',
        dataIndex: 'waitingtime'
      },
      {
        title: '传输时间',
        dataIndex: 'transfertime',
      },
      {
        title: '拆卸时间',
        dataIndex: 'disassemblytime',
      },
      {
        title: '单位周期生产数量',
        dataIndex: 'productioninonecycle',
      },
      {
        title: '机器利用率',
        dataIndex: 'machineutilization',
      }, {
        title: '人工利用率',
        dataIndex: 'laborutilization',
      },
      {
        title: '是否检测点',
        dataIndex: 'checkFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '是否交接点',
        dataIndex: 'handoverFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '是否倒冲',
        dataIndex: 'backflushFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '是否计数点',
        dataIndex: 'countFlag',
        render: (text) => {
          if (text === 1) {
            return <Checkbox checked />
          } else if (text === 0) {
            return <Checkbox />
          }
        }
      }, {
        title: '是否并行工序',
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
        title: '首检类型',
        dataIndex: 'checktype',
      },
      {
        title: '生效日期',
        dataIndex: 'effectdate',
      },
      {
        title: '失效日期',
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
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
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
              message.error("新建失败")
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

            if (res.errMsg === "成功") {
              message.success("编辑成功", 1, () => {
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
              message.error("编辑失败")
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
              message.success('订单下达成功', 1.5, () => {
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
              message.error('订单下达失败')
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
                  if(record.orderStatus === '已发料'){
                    this.setState({
                      isMateIssue:true
                    })
                  }else{
                    this.setState({
                      isMateIssue:false
                    })
                  }
                  if (record.orderStatus === '初始状态') {
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
                新建
              </Button> */}

              <Button style={{}} disabled={!orderStatus} onClick={this.orderSure} type="primary" >
                订单确认
              </Button>
              <Button style={{ marginLeft: 20 }} disabled={!makeSure} onClick={this.orderOk} type="primary" >
                订单下达
              </Button>
              <Button style={{ marginLeft: 20 }} disabled={!this.state.rowId} type="primary" onClick={this.samllOk}>
                查看最小齐套树
              </Button>
              <Button style={{ marginLeft: 20 }} disabled={!this.state.rowId} type="primary" onClick={this.materisOk}>
                查看物资配套情况
              </Button>
              <Button style={{ marginLeft: 20 }}
                loading={materailIssueLoading}
                disabled={isMateIssue} type="primary" onClick={this.materisIssue}>
                物资发料
              </Button>
            </div>}
          />

          <ProductOrderAdd on={AddOn} data={AddData} />

          <ProductOrderUpdate on={UpdateOn} data={UpdateData} />
          {/* 订单下达 */}
          <OrderOk on={OrderOn} data={OrderData} />
          <SmallOk on={SmallOn} data={SmallData} />
          <MaterialOk on={MaterialOn} data={MaterialData} />
        </Card>

        <Modal
          title="工艺确认"
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
