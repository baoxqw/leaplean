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

  //??????
  handleCorpAdd = () => {

    const { dispatch } = this.props
    dispatch({
      type: 'pfor/findPlan',
      payload: {
        reqData: {
          name: '????????????'
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

  //??????
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
        if (res.errMsg === "??????") {
          message.success("????????????", 1, () => {
            dispatch({
              type: 'pfor/fetch',
              payload: {
                ...page,
                reqData:{
                  value
                }
              }
            })
            //????????????
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
                  if (record.status === '????????????') {
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
            //????????????
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
        if (res.errMsg === "??????") {
          message.success("????????????", 1, () => {
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

  //??????
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

  //??????
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    //???????????????
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
    //?????????????????????
    dispatch({
      type: 'pfor/fetch',
      payload: {
        ...page
      }
    })
  };

  //??????
  updataRoute = (e, record) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch({
      type: 'pfor/findPlan',
      payload: {
        reqData: {
          name: '????????????'
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

  //??????
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
    //????????????
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

        if (res.errMsg === '??????') {
          message.success('??????', 1.5, () => {
            let status = "";
            if (superData.status === "????????????") {
              status = "pmrp";
            } else if (superData.status === "??????????????????") {
              status = "?????????";
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
                  } else if (status === "?????????") {
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
          message.error('??????')
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
        if (res.errMsg === '??????') {
          message.success('??????', 1.5, () => {
            let status = "";
            if (superData.status === "????????????") {
              status = "??????????????????";
            } else if (superData.status === "pmrp") {
              status = "?????????";
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
                  if (status === "??????????????????") {
                    this.setState({
                      need: false,
                      superData: {
                        ...superData,
                        status
                      }
                    })
                  } else if (status === "?????????") {
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
          message.error('??????')
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
            <FormItem label='????????????'>
              {getFieldDecorator('code')(<Input placeholder='?????????????????????' suffix={
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
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                ??????
              </Button>
            </span>
          </Col>
        </Row>

        <div style={{ marginBottom: '10px' }}>
          <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
            ??????
          </Button>
          <Button onClick={this.handleStation}
            style={{ marginLeft: '20px' }}
            loading={loadingPmrp}
            type="primary" disabled={!pmrp}>
            PMRP??????
          </Button>
          <Button onClick={this.handleNeed}
            style={{ marginLeft: '20px' }}
            loading={loadingNeed}
            type="primary" disabled={!need}>
            ??????????????????
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
        title: '????????????',
        dataIndex: 'code',

      },
      {
        title: '????????????',
        dataIndex: 'name',

      },
      {
        title: '???????????????',
        dataIndex: 'productNoticeCode',
      },
      {
        title: '??????',
        dataIndex: 'status',


      },
      {
        title: '?????????',
        dataIndex: 'workName',

      },
      {
        title: '????????????',
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
        title: '???????????????',
        dataIndex: 'productNoticeCode',

      },
      {
        title: '??????????????????',
        dataIndex: 'planStartDate',
        ??
      },
      {
        title: '??????????????????',
        dataIndex: 'planEndDate',

      },
      {
        title: '?????????',
        dataIndex: 'releaseName',

      },
      {
        title: '????????????',
        dataIndex: 'releaseDate',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="????????????????" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRoute(e, record)}>??????</a>
          </Fragment>
        }
      },
    ];
    const childColumns = [

      {
        title: '????????????',
        dataIndex: 'materialName',

      },
      {
        title: '????????????',
        dataIndex: 'materialCode',

      },
      {
        title: '??????',
        dataIndex: 'graphid',

      },
      {
        title: '?????????',
        dataIndex: 'workName',

      },
      {
        title: '??????',
        dataIndex: 'model',

      },
      {
        title: '????????????',
        dataIndex: 'developName',

      },
      {
        title: '?????????',
        dataIndex: 'assignorName',

      },
      {
        title: '????????????',
        dataIndex: 'productNumber',

      },
      {
        title: '????????????',
        dataIndex: 'spareNumber',

      },
      {
        title: '????????????',
        dataIndex: 'castNumber',

      },
      {
        title: '????????????',
        dataIndex: 'filterNumber',

      },
      {
        title: '????????????',
        dataIndex: 'exampleNumber',

      },
      {
        title: '??????????????????',
        dataIndex: 'planDeliveryNumber',


      },
      {
        title: '??????????????????',
        dataIndex: 'planStartDate',

      },
      {
        title: '??????????????????',
        dataIndex: 'planEndDate',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="????????????????" onConfirm={() => this.handleChildDelete(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataChildRoute(record)}>??????</a>
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
              message.success('????????????', 1.5, () => {
                clear();
                this.setState({ addVisible: false })
                const { page } = this.state;
                dispatch({
                  type: 'pfor/fetch',
                  payload: {
                    ...page
                  }
                })
                //????????????
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
                      if (record.status === '????????????') {
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
                //????????????
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
              message.error("????????????",1.5,()=>{
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
              message.success('????????????', 1.5, () => {
                clear();
                this.setState({ updateVisible: false })
                const { page } = this.state;
                dispatch({
                  type: 'pfor/fetch',
                  payload: {
                    ...page
                  }
                })
                //????????????
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
                      if (record.status === '????????????') {
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
                //????????????
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
              message.error("????????????",1.5,()=>{
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
            if (res.errMsg === "??????") {
              message.success('????????????', 1.5, () => {
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
              message.error("????????????",1.5,()=>{
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
            if (res.errMsg === "??????") {
              message.success('????????????', 1.5, () => {
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
              message.error("????????????",1.5,()=>{
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
    //????????????
    const childProjectColumns = [

      {
        title: '????????????',
        dataIndex: 'stageCode',

      },
      {
        title: '????????????',
        dataIndex: 'stageName',

      },
      {
        title: '??????????????????',
        dataIndex: 'claimCarryDate',

      },
      {
        title: '??????????????????',
        dataIndex: 'actualCarryDate',

      },
      {
        title: '????????????',
        dataIndex: 'deptName',


      },
      {
        title: '??????',
        dataIndex: 'memo',

      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <a href="#javascript:;" onClick={(e) => this.updataRouteStage(e, record)}>??????</a>
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
              message.success('????????????', 1.5, () => {
                clear();
                this.setState({ updateStageVisible: false })
                const { page } = this.state;
                //????????????
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
              message.error("????????????",1.5,()=>{
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
                    } else if (record.status === '??????????????????') {
                      this.setState({
                        need: false,
                        pmrp: true,
                      })
                    } else if (record.status === '?????????') {
                      this.setState({
                        pmrp: false,
                        need: false
                      })
                    }
                    //????????????
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
                          if (record.status === '????????????') {
                            this.setState({
                              pmrp: true,
                              need: false
                            })
                          }
                          this.setState({ childData: res })
                        } else {
                          if (record.status === '????????????') {
                            this.setState({
                              pmrp: false,
                              need: false
                            })
                          }
                          this.setState({ childData: {} })
                        }
                      }
                    })

                    //????????????
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
            <TabPane tab="????????????" key="1">
              <div style={{ marginTop: '12px' }}>
                <Button icon="plus" onClick={this.handleChilddd} type="primary" disabled={superId ? 0 : 1}>
                  ??????
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
            <TabPane tab="????????????" key="2">
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
