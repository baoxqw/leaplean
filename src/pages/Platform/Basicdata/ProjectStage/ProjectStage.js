import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Divider,
  Button,
  Card,
  Select,
  message,
  Popconfirm, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Sysadmin/UserAdmin.less';
import AddSelf from './selfAdd';
import UpdateSelf from './selfUpdate';
import AddChild from './childAdd';
import UpdateChild from './childUpdate';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ pS, loading }) => ({
  pS,
  loading: loading.models.pS,
  loadingSuper: loading.effects['pS/fetch'],
  addLoading: loading.effects['pS/add'],
  loadingChild: loading.effects['pS/childFetch'],
  childAddloading: loading.effects['pS/addchild'],
}))
@Form.create()
class ProjectStage extends PureComponent {
  state = {
    addVisible: false,
    addChildVisible: false,
    updateVisible: false,
    updateChildVisible: false,
    updateSource: {},
    updateChildSource: {},
    page: {
      pageSize: 100000,
      pageIndex: 0
    },
    conditions: [],
    superId: null,
    rowId: null,
    childData: {},
    superData: {},
    value:''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'pS/fetch',
      payload: {
        ...page
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('searchcode')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.ProjectStage}>
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
              {/*{
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }*/}
            </span>
          </Col>
        </Row>
        {/* {expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='项目类型'>
              {getFieldDecorator('type')(
                <Select placeholder="请选择项目类型" style={{ width: '100%' }}>
                  <Option value="咨询类">咨询类</Option>
                  <Option value="技术服务类">技术服务类</Option>
                  <Option value="设备类">设备类</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>:''}*/}
      </Form>
    );
  }
  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { searchcode } = values;
      this.setState({ value: searchcode });
      dispatch({
        type: 'pS/fetch',
        payload: {
          ...page,
          reqData: {
            value: searchcode,
          },
        },
      });
    });
  };
  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      page: {
        pageSize: 10,
        pageIndex: 0,
      },
      value: '',
    });
    //清空后获取列表
    dispatch({
      type: 'pS/fetch',
      payload: {
        reqData: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    });
  };
  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible: true
    })
  };
  //删除
  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type: 'pS/delete',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'pS/fetch',
              payload: {
                ...page,
                reqData:{
                  value
                }
              }
            })
          })
        }else{
          message.error("删除成功")
        }
      }
    })
  }

  handleDeleteChild = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { superId } = this.state;
    dispatch({
      type: 'pS/deleteChild',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'pS/childFetch',
              payload: {
                pageIndex: 0,
                pageSize: 10,
                conditions: [{
                  code: 'STAGE_PROJECT_ID',
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

  //编辑
  updataRoute = (e,record) => {
    e.preventDefault();
    this.setState({
      updateSource: record,
      updateVisible: true,
    })
  }

  updataRouteChild = (e,record) => {
    e.preventDefault();
    this.setState({
      updateChildSource: record,
      updateChildVisible: true,
    })
  }

  handleChilddd = () => {
    this.setState({
      addChildVisible: true
    })
  };
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { value } = this.state;
    const params = {
      pageIndex: pagination.current, //第几页
      pageSize: pagination.pageSize, //每页要展示的数量
      reqData: {
        value,
      },
    };
    this.setState({
      page: {
        pageIndex: pagination.current, //第几页
        pageSize: pagination.pageSize, //每页要展示的数量
      },
    });
    dispatch({
      type: 'pS/fetch',
      payload: params,
    });
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      loadingSuper,
      loadingChild,
      addLoading,
      childAddloading,
      pS: { data },
    } = this.props;
    const { updateSource, page, childData, superId, addChildVisible,
      updateChildVisible, updateChildSource } = this.state;
    const columns = [
      {
        title: '项目阶段编码',
        dataIndex: 'code',
      },
      {
        title: '项目阶段名称',
        dataIndex: 'name',
      },
      {
        title: '创建人',
        dataIndex: 'userName',
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
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
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRoute(e,record)}>编辑</a>
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
        title: '阶段编码',
        dataIndex: 'code',
      },
      {
        title: '阶段名称',
        dataIndex: 'name',
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
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChild(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRouteChild(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ]

    const OnAddSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'pS/add',
          payload: obj,
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
                this.setState({ addVisible: false })
                clear()
                dispatch({
                  type: 'pS/fetch',
                  payload: {
                    ...page
                  }
                })
              })
            }else{
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
      loading:addLoading
    }

    const OnUpdateData = {
      visible: this.state.updateVisible,
      record: updateSource,
      loading:addLoading
    }
    const OnUpdateSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'pS/add',
          payload: obj,
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("编辑成功", 1, () => {
                this.setState({
                  updateVisible: false,
                  updateSource: {}
                })
                clear()
                dispatch({
                  type: 'pS/fetch',
                  payload: {
                    ...page
                  }
                })
              })
            }else{
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

    const OnAddChild = {
      onOk: (obj, clear) => {
        const { superId } = this.state;
        dispatch({
          type: 'pS/addchild',
          payload: {
            reqData: {
              stageProjectId: superId,
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success('新建成功', 1.5, () => {
                clear();
                this.setState({ addChildVisible: false })
                dispatch({
                  type: 'pS/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'STAGE_PROJECT_ID',
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
      loading:childAddloading
    }

    const OnUpdateChild = {
      onOk: (obj, clear) => {
        const { superId } = this.state;

        dispatch({
          type: 'pS/addchild',
          payload: {
            reqData: {
              stageProjectId: superId,
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success('编辑成功', 1.5, () => {
                clear();
                this.setState({ updateChildVisible: false })
                dispatch({
                  type: 'pS/childFetch',
                  payload: {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions: [{
                      code: 'STAGE_PROJECT_ID',
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
      loading:childAddloading
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={loadingSuper}
            data={data}
            columns={columns}
            classNameSaveColumns={"projectStage7"}
            pagination={false}
            scroll={{ y: 260 }}
            onRow={(record) => {
              return {
                onClick: () => {
                  const { dispatch } = this.props;
                  const { page } = this.state;
                  dispatch({
                    type: 'pS/childFetch',
                    payload: {
                      pageIndex: 0,
                      pageSize: 10,
                      conditions: [{
                        code: 'STAGE_PROJECT_ID',
                        exp: '=',
                        value: record.id
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
                  this.setState({
                    superId: record.id,
                    rowId: record.id,
                    superData: record
                  })
                },
                rowKey: record.id
              }
            }}
            rowClassName={this.setRowClassName}

            title={() => <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>
            }
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{ marginTop: 15 }}>
          <div style={{ marginBottom: '12px', marginTop: '-7px' }}>
            <Button icon="plus" onClick={this.handleChilddd} type="primary" disabled={superId ? 0 : 1}>
              新建
            </Button>
          </div>
          <NormalTable
            loading={loadingChild}
            data={childData}
            classNameSaveColumns={"projectStage8"}
            columns={childColumns}
          //onChange={this.handleStandardTableChange}
          />

          <AddChild on={OnAddChild} data={OnAddData} />

          <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectStage;
