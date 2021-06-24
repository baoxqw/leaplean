import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Tabs,
  Select,
  message, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import UpdateSelf from './UpdateSelf';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ TaskM, loading }) => ({
  TaskM,
  loading: loading.models.TaskM,
  loadingSuper: loading.effects['TaskM/fetch'],
  loadingChild: loading.effects['TaskM/childFetchProduct'],
  childSourceQuery: loading.effects['TaskM/childSourceQuery'],
  loadingWork: loading.effects['TaskM/workList'],
  loadingLower: loading.effects['TaskM/addLower'],
  loadingMerage: loading.effects['TaskM/addMerge'],
}))
@Form.create()

class TaskManagement extends PureComponent {

  state = {
    addVisible: false,
    addChildVisible: false,
    updateVisible: false,
    updateChildVisible: false,
    page: {
      pageSize: 10000,
      pageIndex: 0,
    },
    superId: null,
    rowId: null,
    conditions: [],
    childData: [],
    superData: {},
    updateSource: {},
    updateChildSource: {},
    childDataProject: {},
    originData: {},
    selectedRowKeys: [],
    selectedRows: [],
    merge: false,
    workData: {},
    rowWorkId: null,
    isLower: false,
    value:'',
    productList:{},
    originDetail:{}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'TaskM/fetch',
      payload: {
        conditions: [{
          code: 'MERGE_ID',
          exp: '=',
          value: 0,
        }],
        ...page
      }
    })

  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible: true,
    });
  };

  handleChilddd = () => {
    this.setState({
      addChildVisible: true,
    });
  };

  //删除
  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type: 'TaskM/deleteSelf',
      payload: {
        reqData: {
          id,
        },
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('删除成功', 1, () => {
            dispatch({
              type: 'TaskM/fetch',
              payload: {
                conditions: [{
                  code: 'MERGE_ID',
                  exp: '=',
                  value: 0,
                }],
                ...page,
                reqData:{
                  value
                }
              }
            })
          })

        }
      },
    });
  };

  handleChildDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page, superId } = this.state;
    dispatch({
      type: 'TaskM/deleteChild',
      payload: {
        reqData: {
          id,
        },
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('删除成功', 1, () => {
            dispatch({
              type: 'TaskM/childFetch',
              payload: {
                pageIndex: 0,
                pageSize: 10,
                conditions: [{
                  code: 'PLAN_ID',
                  exp: '=',
                  value: superId,
                }],
              },
              callback: (res) => {
                if (res.list) {
                  this.setState({ childData: res });
                } else {
                  this.setState({ childData: {} });
                }
              },
            });
          });
        }
      },
    });
  };

  //查询
  findList = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code } = values;
      dispatch({
        type: 'TaskM/fetch',
        payload: {
          ...page,
          reqData:{
            value:code
          }

        },
      });
    });

  };

  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      superId: null,
      rowId: null,
      conditions: [],
      childData: {},

    });
    //清空后获取列表
    dispatch({
      type: 'TaskM/fetch',
      payload: {
        conditions: [{
          code: 'MERGE_ID',
          exp: '=',
          value: 0,
        }],
        ...page
      }
    })

  };

  //编辑
  updataRoute = (record) => {
    this.setState({
      updateSource: record,
      updateVisible: true,
    });
  };

  updataChildRoute = (record) => {
    this.setState({
      updateChildSource: record,
      updateChildVisible: true,
    });
  };

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superId } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,

    };
    dispatch({
      type: 'TaskM/childFetch',
      payload: {
        ...obj,
        conditions: [{
          code: 'PLAN_ID',
          exp: '=',
          value: superId,
        }],
      },
      callback: (res) => {
        if (res.list) {
          this.setState({ childData: res });
        } else {
          this.setState({ childData: {} });
        }
      },
    });

  };

  handleStandardTableChangeProject = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superData } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,

    };
    dispatch({
      type: 'TaskM/childFetchProject',
      payload: {
        pageIndex: pagination.current - 1,
        pageSize: pagination.pageSize,
        conditions: [{
          code: 'STAGE_PROJECT_ID',
          exp: '=',
          value: superData.stageProjectId,
        }],
      },
      callback: (res) => {

        if (res.list) {
          this.setState({ childDataProject: res });
        } else {
          this.setState({ childDataProject: {} });
        }
      },
    });

  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  setRowClassNameWork = (record) => {
    return record.id === this.state.rowWorkId ? 'clickRowStyl' : '';
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;

    return (
      <Form onSubmit={(e) => this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.TaskManagement}>
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
      </Form>
    );
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys.length > 1) {
      this.setState({
        merge: true,
      });
    } else {
      this.setState({
        merge: false,
      });
    }
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  onMerge = () => {
    const { dispatch } = this.props
    const { selectedRowKeys, selectedRows, page } = this.state;
    console.log('selectedRows',selectedRows)
    for (let i = 0; i < selectedRows.length; i++) {
      for (let j = 1; j < selectedRows.length; j++) {
        if (selectedRows[i].materialId !== selectedRows[j].materialId || selectedRows[i].taskType !== selectedRows[j].taskType || selectedRows[i].planId !== selectedRows[j].planId || selectedRows[i].bomId === 0) {
          return message.error("存在不同任务，无法合并", 2)
        }
      }
    }

    dispatch({
      type: 'TaskM/addMerge',
      payload: {
        reqDataList: selectedRows,
      },
      callback: (res) => {
        if (res.errCode === '0') {
          message.success('合并成功', 1.5, () => {
            dispatch({
              type: 'TaskM/fetch',
              payload: {
                conditions: [{
                  code: 'MERGE_ID',
                  exp: '=',
                  value: 0,
                }],
                ...page
              }
            })
          })

        } else {
          message.error('合并失败')
        }

      }
    })

  };

  onLower = () => {
    const { dispatch } = this.props
    const { superId, page,superData } = this.state;
    if(superData.taskType === '采购'){
      return message.error('采购暂无接口')
    }
    dispatch({
      type: 'TaskM/addLower',
      payload: {
        reqData: {
          taskId: superId
        },
      },
      callback: (res) => {
        console.log('---下达', res)
        if (res.errCode === '0') {
          message.success('下达成功', 1.5, () => {
             //主表
             dispatch({
              type: 'TaskM/fetch',
              payload: {
                conditions: [{
                  code: 'MERGE_ID',
                  exp: '=',
                  value: 0,
                }],
                ...page
              }
            })
            this.setState({ isLower: false })
          })

        } else {
          message.error('下达失败')
        }

      }
    })

  };

  handleStandardWorkTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superId } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,

    };
    //来源任务
    dispatch({
      type: 'TaskM/workList',
      payload: {
        conditions: [{
          code: 'MERGE_ID',
          exp: '=',
          value: superId
        }]
      },
      callback: (res) => {
        this.setState({
          workData: res
        })

      }
    })
  };


  render() {
    const {
      form: { getFieldDecorator },
      loading,
      loadingMerage,
      loadingLower,
      childSourceQuery,
      dispatch,
      loadingWork,
      loadingSuper, loadingChild,
      TaskM: { data },
    } = this.props;
    const { updateSource,originDetail, childData, originData, childDataProject, selectedRowKeys, updateVisible,
      superId, updateChildSource, updateChildVisible, superData, merge, workData, isLower ,productList} = this.state;

    const columns = [
      {
        title: '任务编号',
        dataIndex: 'code',
      },
      {
        title: '项目计划编号',
        dataIndex: 'planCode',
      },
      {
        title: '项目计划名称',
        dataIndex: 'planName',
      },
      {
        title: '合并任务',
        dataIndex: 'mergeStatus',
        render: (text, record) => {
          return <Checkbox checked={text} />
        }
      },
      {
        title: '任务名称',
        dataIndex: 'taskname',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
      },


      {
        title: '状态',
        dataIndex: 'status',

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
        title: '实际完成日期',
        dataIndex: 'actualFinishedDate',
      },
      {
        title: '下达人',
        dataIndex: 'releaseName',

      },

      {
        title: '下达日期',
        dataIndex: 'releaseDate',
      },
      /*
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
            <a href="#javascript:;" onClick={(e) => this.updataRoute(record)}>编辑</a>
          </Fragment>
        }
      },*/
      {
        title: '',
        width: 100,
        dataIndex: 'caozuo',
      }
    ];
    const workColumns = [
      {
        title: '任务编号',
        dataIndex: 'code',
      },
      {
        title: '项目计划编号',
        dataIndex: 'planCode',
      },
      {
        title: '项目计划名称',
        dataIndex: 'planName',
      },
      {
        title: '任务名称',
        dataIndex: 'taskname',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
      },


      {
        title: '状态',
        dataIndex: 'status',

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
        title: '实际完成日期',
        dataIndex: 'actualFinishedDate',
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
        title: '',
        width: 1,
        dataIndex: 'caozuo',
      },
    ];
    const childColumns = [
      {
        title: '物料编码',
        dataIndex: 'materialCode',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
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
        title: '数量',
        dataIndex: 'netDemandNum',
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
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
        title: '',
        width: 100,
        dataIndex: 'caozuo',
      },
    ];
    const sourceColumns = [

      {
        title: '源头编号',
        dataIndex: 'headSourceCode',
      },
      {
        title: '来源编号',
        dataIndex: 'comeSourceCode',
      },
      {
        title: '毛需求数量',
        dataIndex: 'grossDemandNum',
      },
      {
        title: '库存量',
        dataIndex: 'inventory',
      },
      {
        title: '净需求数量',
        dataIndex: 'netDemandNum',
      },
      {
        title: '',
        width: 100,
        dataIndex: 'caozuo',
      },
    ];

    const originColumns = [

      {
        title: '来源方式',
        dataIndex: 'originStyle',
      },
      {
        title: '来源单据类型',
        dataIndex: 'originType',
      },
      {
        title: '来源单据号',
        dataIndex: 'originCode',
      },
      {
        title: '来源单据行号',
        dataIndex: 'originColCode',
      },

      {
        title: '源头单据号',
        dataIndex: 'headCode',
      },
      {
        title: '源头单据行号',
        dataIndex: 'headColCode',
      },
      {
        title: '来源编号',
        dataIndex: 'traceability',
      },
      {
        title: '毛需求数量  ',
        dataIndex: 'grossDemandAmount',
      },
      {
        title: '利库数量  ',
        dataIndex: 'existingAmount',
      },
      {
        title: '净需求数量',
        dataIndex: 'netDemandAmount',
      },
      {
        title: '',
        width: 100,
        dataIndex: 'caozuo',
      },
    ];


    const OnAddSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'TaskM/addself',
          payload: obj,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('新建成功', 1.5, () => {
                clear();
                this.setState({ addVisible: false });
                const { page } = this.state;
                dispatch({
                  type: 'TaskM/fetch',
                  payload: {
                    conditions: [{
                      code: 'MERGE_ID',
                      exp: '=',
                      value: 0,
                    }],
                    ...page
                  }
                })

              });
            } else {
              message.error('新建失败');
            }
          },
        });
        clear();
        this.setState({
          addVisible: false,
        });
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          addVisible: false,
        });
      },
    };
    const OnSelfData = {
      visible: this.state.addVisible,
    };

    const OnUpdateSelf = {
      onSave: (obj, clear) => {
        /*dispatch({
          type: 'TaskM/addself',
          payload: obj,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('已完成', 1.5, () => {
                clear();
                this.setState({ updateVisible: false })
                const { page } = this.state;
                dispatch({
                  type: 'TaskM/fetch',
                  payload: {
                    ...page
                  }
                })
              });
            } else {
              message.error("编辑失败")
            }
          }
        })*/

      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateVisible: false,
        });
      },
    };
    const OnUpdateData = {
      visible: updateVisible,
      record: updateSource,
    };

    const OnAddChild = {
      onOk: (obj, clear) => {
        const { superId } = this.state;

        dispatch({
          type: 'TaskM/addchild',
          payload: {
            reqData: {
              planId: superId,
              ...obj,
            },
          },
          callback: (res) => {
            if (res.errMsg === '成功') {
              message.success('新建成功', 1.5, () => {
                clear();
                this.setState({ addChildVisible: false });
                dispatch({
                  type: 'TaskM/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId,
                    }],
                  },
                  callback: (res) => {
                    if (res.list) {
                      this.setState({ childData: res });
                    } else {
                      this.setState({ childData: {} });
                    }
                  },
                });
              });
            } else {
              message.error('新建失败');
            }
          },
        });
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          addChildVisible: false,
        });
      },
    };
    const OnAddData = {
      visible: this.state.addChildVisible,
    };

    const OnUpdateChild = {
      onOk: (obj, clear) => {
        const { superId } = this.state;

        dispatch({
          type: 'TaskM/addchild',
          payload: {
            reqData: {
              planId: superId,
              ...obj,
            },
          },
          callback: (res) => {
            if (res.errMsg === '成功') {
              message.success('编辑成功', 1.5, () => {
                clear();
                this.setState({ updateChildVisible: false });
                dispatch({
                  type: 'TaskM/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'PLAN_ID',
                      exp: '=',
                      value: superId,
                    }],
                  },
                  callback: (res) => {
                    if (res.list) {
                      this.setState({ childData: res });
                    } else {
                      this.setState({ childData: {} });
                    }
                  },
                });
              });
            } else {
              message.error('编辑失败');
            }
          },
        });

      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateChildVisible: false,
        });
      },
    };
    const OnUpdateChildData = {
      visible: updateChildVisible,
      record: updateChildSource,
    };
    const childProjectColumns = [
      {
        title: '工序类型',
        dataIndex: 'processName',
        sort: 0,
      },
      {
        title: '工作中心',
        dataIndex: 'workName',
        sort: 1,
      },
      {
        title: '生效时间',
        dataIndex: 'effTime',
        sort: 2,
      },
      {
        title: '失效时间',
        dataIndex: 'expTime',
        sort: 3,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        sort: 4,
      },
      {
        title: '',
        width: 100,
        dataIndex: 'caozuo',
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <NormalTable
              loading={loadingSuper}
              data={data}
              columns={columns}
              scroll={{ y: 260 }}
              classNameSaveColumns={'TaskManage2'}
              pagination={false}
              onRow={(record) => {
                return {
                  onClick: () => {
                    const { dispatch } = this.props;
                    const { page } = this.state;
                    //产品列表
                    dispatch({
                      type: 'TaskM/childFetchProduct',
                      payload: {
                        reqData: {
                          id: record.id,
                        }
                      },
                      callback:(res)=>{
                        if(res){
                          this.setState({productList:res})
                        }
                      }
                    });
                    //来源明细
                    dispatch({
                      type: 'TaskM/childSourceQuery',
                      payload: {
                        reqData: {
                          bomId: record.bomId,
                          mergeId: record.id
                        }
                      },
                      callback:(res)=>{
                        if(res){
                          this.setState({originDetail:res})
                        }
                      }
                    })
                    //来源任务
                    dispatch({
                      type: 'TaskM/workList',
                      payload: {
                        conditions: [{
                          code: 'MERGE_ID',
                          exp: '=',
                          value: record.id
                        }]
                      },
                      callback: (res) => {
                        this.setState({
                          workData: res
                        })

                      }
                    })
                    if (record.status === '初始状态') {
                      this.setState({ isLower: true })
                    } else {
                      this.setState({ isLower: false })
                    }
                    this.setState({
                      superId: record.id,
                      rowId: record.id,
                      superData: record,
                      rowWorkId: null,
                    });
                  },
                  rowKey: record.id,
                };
              }}
              rowClassName={this.setRowClassName}
              rowSelection={rowSelection}
              title={() => <div>
                <Button
                loading={loadingMerage}
                onClick={this.onMerge}
                 disabled={!merge} type="primary">
                  合并
                </Button>
                <Button
                loading={loadingLower}
                onClick={this.onLower}
                type="primary" style={{ marginLeft: '20px' }} disabled={!isLower}>
                  下达
                </Button>
              </div>
              }
            />
          </div>
          {/*} <AddSelf on={OnAddSelf} data={OnSelfData} />*/}
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{ marginTop: 15 }}>
          <Tabs>
            <TabPane tab="产品列表" key="1">
              <NormalTable
                loading={loadingChild}
                data={productList}
                classNameSaveColumns={'TaskManage3'}
                columns={childColumns}
                pagination={false}
              //onChange={this.handleStandardTableChange}
              />
              {/*<AddChild on={OnAddChild} data={OnAddData} />

            <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />*/}
            </TabPane>
            <TabPane tab="来源明细" key="2">
              <NormalTable
                loading={childSourceQuery}
                data={originDetail}
                classNameSaveColumns={'TaskManage4'}
                columns={sourceColumns}
                pagination={false}
              />
            </TabPane>
            <TabPane tab="来源任务" key="3">
              <NormalTable
                loading={loadingWork}
                data={workData}
                classNameSaveColumns={"TaskManage5"}
                columns={workColumns}
                onChange={this.handleStandardWorkTableChange}
                onRow={(record) => {
                  return {
                    onClick: () => {
                      const { dispatch } = this.props;
                      const { page } = this.state;
                      this.setState({ rowWorkId: record.id })
                      //产品列表
                      dispatch({
                        type: 'TaskM/childFetchProduct',
                        payload: {
                          reqData: {
                            id: record.id,
                          }
                        },
                        callback:(res)=>{
                          if(res){
                            this.setState({productList:res})
                          }
                        }
                      });
                      //来源明细
                      dispatch({
                        type: 'TaskM/childSourceQuery',
                        payload: {
                          reqData: {
                            bomId: record.bomId,
                            mergeId: record.id
                          }
                        },
                        callback:(res)=>{
                          if(res){
                            this.setState({originDetail:res})
                          }
                        }
                      })

                    },
                    rowKey: record.id
                  }
                }}
                rowClassName={this.setRowClassNameWork}

              />
            </TabPane>
          </Tabs>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TaskManagement;
