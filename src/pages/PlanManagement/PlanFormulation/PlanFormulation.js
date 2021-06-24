import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Checkbox,
  Form,
  Input,
  Divider,
  Button,
  Card,
  Tabs,
  Select,
  message,
  Popconfirm, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';
import AddChild from './AddChild';
import UpdateStageSelf from './UpdateStageSelf'
import UpdateChild from './UpdateChild';
import './tableSureBg.less'
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { TabPane } = Tabs;

@connect(({ pfor, loading }) => ({
  pfor,
  loading: loading.models.pfor,
  loadingSuper: loading.effects['pfor/fetch'],
  loadingChild: loading.effects['pfor/childFetch'],
  loadingStage: loading.effects['pfor/childFetchProjectStage'],
  loadingPmrp: loading.effects['pfor/addStation'],
  loadingNeed: loading.effects['pfor/addNeed'],
  SAddloading: loading.effects['pfor/addself'],
  CAddloading: loading.effects['pfor/addchild'],
}))
@Form.create()
class PlanFormulation extends PureComponent {
  state = {
    addVisible: false,
    addChildVisible: false,
    updateVisible: false,
    updateChildVisible: false,
    page: {
      pageSize: 10000,
      pageIndex: 0
    },
    superId: null,
    rowId: null,
    conditions: [],
    childData: {},
    superData: {},
    updateSource: {},
    updateChildSource: {},
    childDataProject: {},
    pmrp: false,
    need: false,
    updateStageSource: {},
    updateStageVisible: false,
    editable: 1,
    editableUpdate: 1,
    dateCode: null,
    serial: null,
    serialUpdate: null,
    value:'',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'pfor/fetch',
      payload: {
        ...page
      }
    })
  }

  //新建
  handleCorpAdd = () => {

    const { dispatch } = this.props
    dispatch({
      type: 'pfor/findPlan',
      payload: {
        reqData: {
          name: '项目计划'
        }
      },
      callback: (res) => {

        this.setState({
          addVisible: true
        })
        if (res.resData) {
          let editable = res.resData[0].editable
          let serial = res.resData[0].serial
          let dateCode = res.resData[0].data
          this.setState({
            editable,
            dateCode,
            serial,
          })
        }
      }
    })
  };

  handleChilddd = () => {
    this.setState({
      addChildVisible: true
    })
  };

  //删除
  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page, superId ,value} = this.state;
    dispatch({
      type: 'pfor/deleteSelf',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'pfor/fetch',
              payload: {
                ...page,
                reqData:{
                  value
                }
              }
            })
            //产品列表
            dispatch({
              type: 'pfor/childFetch',
              payload: {
                pageIndex: 0,
                pageSize: 10,
                conditions: [{
                  code: 'PLAN_ID',
                  exp: '=',
                  value: superId
                }]
              },
              callback: (res) => {

                if (res.list) {
                  if (record.status === '初始状态') {
                    this.setState({
                      pmrp: true,
                      need: true
                    })
                  } else {
                    this.setState({
                      pmrp: false,
                      need: false
                    })
                  }
                  this.setState({ childData: res })
                } else {
                  this.setState({ childData: {} })
                }
              }
            })
            //项目阶段
            dispatch({
              type: 'pfor/childFetchProjectStage',
              payload: {
                pageIndex: 0,
                pageSize: 10,
                conditions: [{
                  code: 'PLAN_ID',
                  exp: '=',
                  value: superId
                }]
              },
              callback: (res) => {
                if (res.list) {
                  this.setState({ childDataProject: res })
                } else {
                  this.setState({ childDataProject: {} })
                }
              }
            })
          })
        }
      }
    })
  }

  handleChildDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page, superId } = this.state;
    dispatch({
      type: 'pfor/deleteChild',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'pfor/childFetch',
              payload: {
                pageIndex: 0,
                pageSize: 10,
                conditions: [{
                  code: 'PLAN_ID',
                  exp: '=',
                  value: superId
                }]
              },
              callback: (res) => {
                if (res.list) {
                  this.setState({ childData: res })
                } else {
                  this.setState({ childData: {} })
                }
              }
            })
          })
        }
      }
    })
  }

  //查询
  findList = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code } = values;
      this.setState({
        value:code
      })
      dispatch({
        type: 'pfor/fetch',
        payload: {
          ...page,
          reqData:{
            value:code
          }
        },
      })
    })

  }

  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      superId: null,
      rowId: null,
      value: '',
      childData: {},
      page:{
        pageIndex:0,
        pageSize:1000000
      }

    })
    //清空后获取列表
    dispatch({
      type: 'pfor/fetch',
      payload: {
        ...page
      }
    })
  };

  //编辑
  updataRoute = (e, record) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch({
      type: 'pfor/findPlan',
      payload: {
        reqData: {
          name: '项目计划'
        }
      },
      callback: (res) => {
        this.setState({
          updateSource: record,
          updateVisible: true,
        })
        if (res.resData) {
          let editableUpdate = res.resData[0].editable
          let serialUpdate = res.resData[0].serial
          this.setState({
            editableUpdate,
            serialUpdate,
          })
        }

      }
    })
  }

  updataRouteStage = (e, record) => {
    e.preventDefault()
    this.setState({
      updateStageSource: record,
      updateStageVisible: true,
    })
  }

  updataChildRoute = (record) => {
    this.setState({
      updateChildSource: record,
      updateChildVisible: true,
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superId } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,

    };
    dispatch({
      type: 'pfor/childFetch',
      payload: {
        ...obj,
        conditions: [{
          code: 'PLAN_ID',
          exp: '=',
          value: superId
        }]
      },
      callback: (res) => {
        if (res.list) {
          this.setState({ childData: res })
        } else {
          this.setState({ childData: {} })
        }
      }
    })

  };

  handleStandardTableChangeProject = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superData } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    //项目阶段
    dispatch({
      type: 'pfor/childFetchProjectStage',
      payload: {
        pageIndex: pagination.current - 1,
        pageSize: pagination.pageSize,
        conditions: [{
          code: 'PLAN_ID',
          exp: '=',
          value: superId
        }]
      },
      callback: (res) => {
        if (res.list) {
          this.setState({ childDataProject: res })
        } else {
          this.setState({ childDataProject: {} })
        }
      }
    })

  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  handleStation = () => {
    const { pmrp, superId, superData, page } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'pfor/addStation',
      payload: {
        reqData: {
          planId: superId,
        }
      },
      callback: (res) => {

        if (res.errMsg === '成功') {
          message.success('成功', 1.5, () => {
            let status = "";
            if (superData.status === "初始状态") {
              status = "pmrp";
            } else if (superData.status === "物资需求平衡") {
              status = "已运算";
            }
            dispatch({
              type: 'pfor/addself',
              payload: {
                reqData: {
                  ...superData,
                  status
                }
              },
              callback: (res) => {
                if (res.errCode === '0') {
                  if (status === "pmrp") {
                    this.setState({
                      pmrp: false,
                      superData: {
                        ...superData,
                        status
                      }
                    })
                  } else if (status === "已运算") {
                    this.setState({
                      need: false,
                      pmrp: false,
                      superData: {
                        ...superData,
                        status
                      }
                    })
                  }
                  dispatch({
                    type: 'pfor/fetch',
                    payload: {
                      ...page
                    }
                  })
                }

              }
            })

          })
        } else {
          message.error('失败')
        }
      }

    })
  }

  handleNeed = () => {
    const { need, superId, superData, page } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'pfor/addNeed',
      payload: {
        reqData: {
          planId: superId,
        }
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('成功', 1.5, () => {
            let status = "";
            if (superData.status === "初始状态") {
              status = "物资需求平衡";
            } else if (superData.status === "pmrp") {
              status = "已运算";
            }
            dispatch({
              type: 'pfor/addself',
              payload: {
                reqData: {
                  ...superData,
                  status
                }
              },
              callback: (res) => {
                if (res.errCode === '0') {
                  if (status === "物资需求平衡") {
                    this.setState({
                      need: false,
                      superData: {
                        ...superData,
                        status
                      }
                    })
                  } else if (status === "已运算") {
                    this.setState({
                      need: false,
                      pmrp: false,
                      superData: {
                        ...superData,
                        status
                      }
                    })
                  }

                  dispatch({
                    type: 'pfor/fetch',
                    payload: {
                      ...page
                    }
                  })
                }

              }
            })

          })
        } else {
          message.error('失败')
        }
      }

    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
      loadingPmrp,
      loadingNeed,
    } = this.props;
    const { pmrp, need } = this.state
    return (
      <Form onSubmit={(e) => this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.PlanFormulation}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
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

        <div style={{ marginBottom: '10px' }}>
          <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
            新建
          </Button>
          <Button onClick={this.handleStation}
            style={{ marginLeft: '20px' }}
            loading={loadingPmrp}
            type="primary" disabled={!pmrp}>
            PMRP运算
          </Button>
          <Button onClick={this.handleNeed}
            style={{ marginLeft: '20px' }}
            loading={loadingNeed}
            type="primary" disabled={!need}>
            物资需求平衡
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      loadingStage,
      loadingSuper, loadingChild,
      pfor: { data },
      SAddloading,
      CAddloading
    } = this.props;

    //
    const { updateSource, editable, editableUpdate, serial, serialUpdate,
      dateCode, childData, childDataProject, updateVisible, superId,
      updateChildSource, updateChildVisible, updateStageSource, updateStageVisible,
    } = this.state;
    const columns = [
      {
        title: '计划编号',
        dataIndex: 'code',

      },
      {
        title: '计划名称',
        dataIndex: 'name',

      },
      {
        title: '来源单据号',
        dataIndex: 'productNoticeCode',
      },
      {
        title: '状态',
        dataIndex: 'status',


      },
      {
        title: '工作令',
        dataIndex: 'workName',

      },
      {
        title: '是否完成',
        dataIndex: 'isOver',
        render: ((text, record) => {
          if (text) {
            return <Checkbox checked={text} />
          } else {
            return <Checkbox checked={text} />
          }
        })
      },
      {
        title: '来源单据号',
        dataIndex: 'productNoticeCode',

      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartDate',
         
      },
      {
        title: '计划完成日期',
        dataIndex: 'planEndDate',

      },
      {
        title: '下达人',
        dataIndex: 'releaseName',

      },
      {
        title: '下达日期',
        dataIndex: 'releaseDate',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRoute(e, record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const childColumns = [

      {
        title: '物料名称',
        dataIndex: 'materialName',

      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',

      },
      {
        title: '图号',
        dataIndex: 'graphid',

      },
      {
        title: '工作令',
        dataIndex: 'workName',

      },
      {
        title: '型号',
        dataIndex: 'model',

      },
      {
        title: '研制状态',
        dataIndex: 'developName',

      },
      {
        title: '分配人',
        dataIndex: 'assignorName',

      },
      {
        title: '生产数量',
        dataIndex: 'productNumber',

      },
      {
        title: '备件数量',
        dataIndex: 'spareNumber',

      },
      {
        title: '投产数量',
        dataIndex: 'castNumber',

      },
      {
        title: '筛选数量',
        dataIndex: 'filterNumber',

      },
      {
        title: '例试数量',
        dataIndex: 'exampleNumber',

      },
      {
        title: '计划交付数量',
        dataIndex: 'planDeliveryNumber',


      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartDate',

      },
      {
        title: '计划完成日期',
        dataIndex: 'planEndDate',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleChildDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataChildRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const OnAddSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'pfor/addself',
          payload: obj,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('新建成功', 1.5, () => {
                clear();
                this.setState({ addVisible: false })
                const { page } = this.state;
                dispatch({
                  type: 'pfor/fetch',
                  payload: {
                    ...page
                  }
                })
                //产品列表
                dispatch({
                  type: 'pfor/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {

                    if (res.list) {
                      if (record.status === '初始状态') {
                        this.setState({
                          pmrp: true,
                          need: true
                        })
                      } else {
                        this.setState({
                          pmrp: false,
                          need: false
                        })
                      }
                      this.setState({ childData: res })
                    } else {
                      this.setState({ childData: {} })
                    }
                  }
                })
                //项目阶段
                dispatch({
                  type: 'pfor/childFetchProjectStage',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {
                    if (res.list) {
                      this.setState({ childDataProject: res })
                    } else {
                      this.setState({ childDataProject: {} })
                    }
                  }
                })
              });
            } else {
              message.error("新建失败",1.5,()=>{
                clear(1);
              })
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
    }
    const OnSelfData = {
      visible: this.state.addVisible,
      editable,
      dateCode,
      serial,
      loading:SAddloading
    }

    const OnUpdateSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'pfor/addself',
          payload: obj,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('编辑成功', 1.5, () => {
                clear();
                this.setState({ updateVisible: false })
                const { page } = this.state;
                dispatch({
                  type: 'pfor/fetch',
                  payload: {
                    ...page
                  }
                })
                //产品列表
                dispatch({
                  type: 'pfor/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {

                    if (res.list) {
                      if (record.status === '初始状态') {
                        this.setState({
                          pmrp: true,
                          need: true
                        })
                      } else {
                        this.setState({
                          pmrp: false,
                          need: false
                        })
                      }
                      this.setState({ childData: res })
                    } else {
                      this.setState({ childData: {} })
                    }
                  }
                })
                //项目阶段
                dispatch({
                  type: 'pfor/childFetchProjectStage',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {
                    if (res.list) {
                      this.setState({ childDataProject: res })
                    } else {
                      this.setState({ childDataProject: {} })
                    }
                  }
                })
              });
            } else {
              message.error("编辑失败",1.5,()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateVisible: false
        })
      }
    }
    const OnUpdateData = {
      visible: updateVisible,
      record: updateSource,
      editableUpdate,
      serialUpdate,
      loading:SAddloading
    }

    const OnAddChild = {
      onOk: (obj, clear) => {
        const { superId } = this.state;
        dispatch({
          type: 'pfor/addchild',
          payload: {
            reqData: {
              planId: superId,
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success('新建成功', 1.5, () => {
                clear();
                this.setState({ addChildVisible: false })
                dispatch({
                  type: 'pfor/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {
                    if (res.list) {
                      this.setState({ childData: res })
                    } else {
                      this.setState({ childData: {} })
                    }
                  }
                })
              });
            } else {
              message.error("新建失败",1.5,()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          addChildVisible: false
        })
      }
    }
    const OnAddData = {
      visible: this.state.addChildVisible,
      record: this.state.superData,
      loading:CAddloading
    }

    const OnUpdateChild = {
      onOk: (obj, clear) => {
        const { superId } = this.state;
        dispatch({
          type: 'pfor/addchild',
          payload: {
            reqData: {
              planId: superId,
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success('编辑成功', 1.5, () => {
                clear();
                this.setState({ updateChildVisible: false })
                dispatch({
                  type: 'pfor/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {
                    if (res.list) {
                      this.setState({ childData: res })
                    } else {
                      this.setState({ childData: {} })
                    }
                  }
                })
              });
            } else {
              message.error("编辑失败",1.5,()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateChildVisible: false
        })
      }
    }
    const OnUpdateChildData = {
      visible: updateChildVisible,
      record: updateChildSource,
      loading:CAddloading
    };
    //项目阶段
    const childProjectColumns = [

      {
        title: '阶段编码',
        dataIndex: 'stageCode',

      },
      {
        title: '阶段名称',
        dataIndex: 'stageName',

      },
      {
        title: '要求完成日期',
        dataIndex: 'claimCarryDate',

      },
      {
        title: '实际完成日期',
        dataIndex: 'actualCarryDate',

      },
      {
        title: '责任部门',
        dataIndex: 'deptName',


      },
      {
        title: '备注',
        dataIndex: 'memo',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <a href="#javascript:;" onClick={(e) => this.updataRouteStage(e, record)}>编辑</a>
          </Fragment>
        }
      }
    ]
    const OnUpdateStageSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'pfor/addselfStage',
          payload: {
            reqData: {
              planId: superId,
              ...obj,
            }
          },
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('编辑成功', 1.5, () => {
                clear();
                this.setState({ updateStageVisible: false })
                const { page } = this.state;
                //项目阶段
                dispatch({
                  type: 'pfor/childFetchProjectStage',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {
                    if (res.list) {
                      this.setState({ childDataProject: res })
                    } else {
                      this.setState({ childDataProject: {} })
                    }
                  }
                })
              });
            } else {
              message.error("编辑失败",1.5,()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateStageVisible: false
        })
      }
    }
    const OnUpdateStageData = {
      visible: updateStageVisible,
      record: updateStageSource
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <NormalTable
              loading={loadingSuper}
              data={data}
              columns={columns}
              scroll={{ y: 260 }}
              classNameSaveColumns={"PlanFormulation1"}
              pagination={false}
              onRow={(record) => {
                return {
                  onClick: () => {
                    const { dispatch } = this.props;
                    const { page } = this.state;
                    if (record.status === 'pmrp') {
                      this.setState({
                        pmrp: false,
                        need: true
                      })
                    } else if (record.status === '物资需求平衡') {
                      this.setState({
                        need: false,
                        pmrp: true,
                      })
                    } else if (record.status === '已运算') {
                      this.setState({
                        pmrp: false,
                        need: false
                      })
                    }
                    //产品列表
                    dispatch({
                      type: 'pfor/childFetch',
                      payload: {
                        pageIndex: 0,
                        pageSize: 10,
                        conditions: [{
                          code: 'PLAN_ID',
                          exp: '=',
                          value: record.id
                        }]
                      },
                      callback: (res) => {

                        if (res.list && res.list.length) {
                          if (record.status === '初始状态') {
                            this.setState({
                              pmrp: true,
                              need: false
                            })
                          }
                          this.setState({ childData: res })
                        } else {
                          if (record.status === '初始状态') {
                            this.setState({
                              pmrp: false,
                              need: false
                            })
                          }
                          this.setState({ childData: {} })
                        }
                      }
                    })

                    //项目阶段
                    dispatch({
                      type: 'pfor/childFetchProjectStage',
                      payload: {
                        pageIndex: 0,
                        pageSize: 10,
                        conditions: [{
                          code: 'PLAN_ID',
                          exp: '=',
                          value: record.id
                        }]
                      },
                      callback: (res) => {
                        if (res.list) {
                          this.setState({ childDataProject: res })
                        } else {
                          this.setState({ childDataProject: {} })
                        }
                      }
                    })
                    this.setState({
                      superId: record.id,
                      rowId: record.id,
                      superData: record,
                    })
                  },
                  rowKey: record.id
                }
              }}
              rowClassName={this.setRowClassName}
            //onChange={this.handleStandardTableChange}
            />
          </div>
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{ marginTop: 15 }}>
          <Tabs >
            <TabPane tab="产品列表" key="1">
              <div style={{ marginTop: '12px' }}>
                <Button icon="plus" onClick={this.handleChilddd} type="primary" disabled={superId ? 0 : 1}>
                  新建
            </Button>
              </div>
              <NormalTable
                loading={loadingStage}
                data={childData}
                classNameSaveColumns={"PlanFormulation7"}
                columns={childColumns}
                onChange={this.handleStandardTableChange}
              />

              <AddChild on={OnAddChild} data={OnAddData} />

              <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
            </TabPane>
            <TabPane tab="项目阶段" key="2">
              <NormalTable
                loading={loadingStage}
                data={childDataProject}
                classNameSaveColumns={"PlanFormulation2"}
                columns={childProjectColumns}
                onChange={this.handleStandardTableChangeProject}
              />
              <UpdateStageSelf on={OnUpdateStageSelf} data={OnUpdateStageData} />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PlanFormulation;
