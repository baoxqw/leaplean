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
  message,
  Popconfirm, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddSelf from '@/pages/Platform/Factory/UnitWork/UnitWorkAdd';
import UpdateSelf from '@/pages/Platform/Factory/UnitWork/UnitWorkUpdate';
import styles from '../../Sysadmin/UserAdmin.less';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

@connect(({ unitwork, loading }) => ({
  unitwork,
  queryLoading: loading.effects['unitwork/fetch'],
  addLoading: loading.effects['unitwork/add'],
}))
@Form.create()
class UnitWork extends PureComponent {
  state = {
    page: {
      pageSize: 10,
      pageIndex: 0
    },
    addVisible: false,
    updateVisible: false,
    updateSource: {},
    value: ''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'unitwork/fetch',
      payload: {
        ...page
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({ addVisible: true })
  };

  updataRoute = (e, record) => {
    e.preventDefault();
    this.setState({
      updateSource: record,
      updateVisible: true,
    })
  };

  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page, value } = this.state;
    dispatch({
      type: 'unitwork/delete',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'unitwork/fetch',
              payload: {
                ...page,
                reqData: {
                  value
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
      this.setState({ value: code })
      dispatch({
        type: 'unitwork/fetch',
        payload: {
          ...page,
          reqData: {
            value: code
          }
        }
      })
    })

  }
  //取消
  handleFormReset = () => {
    const { dispatch } = this.props;
    const { page } = this.state;
    //清空输入框
    this.setState({
      value: '',
      page: {
        pageSize: 10,
        pageIndex: 0
      },
    })
    dispatch({
      type: 'unitwork/fetch',
      payload: {
        pageSize: 10,
        pageIndex: 0
      }
    });
  };

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { value } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
      reqData: {
        value
      }
    };
    this.setState({
      page: {
        pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
      }
    });

    dispatch({
      type: 'unitwork/fetch',
      payload: obj,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;

    return (
      <Form onSubmit={(e) => this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.UnitWork}>
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

  render() {
    const {
      loading,
      unitwork: { data },
      dispatch,
      queryLoading,
      addLoading
    } = this.props;
    const { page, updateSource,value } = this.state
    const columns = [
      {
        title: '工作单元编号',
        dataIndex: 'code',

      },
      {
        title: '工作单元名称',
        dataIndex: 'name',

      },
      {
        title: '单位类型',
        dataIndex: 'unittypeName',

      },
      {
        title: '生产区域',
        dataIndex: 'productionregionName',

      },
      {
        title: '状态',
        dataIndex: 'status',

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
            <a href="#javascript:;" onClick={(e) => this.updataRoute(e, record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const OnAddSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'unitwork/add',
          payload: {
            reqData: {
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
                this.setState({ addVisible: false })
                clear()
                dispatch({
                  type: 'unitwork/fetch',
                  payload: {
                    ...page,
                    reqData:{
                      value
                    }
                  }
                })
              })
            } else {
              message.error(`新建失败 ${res.userObj ? res.userObj.msg : ''}`, 3.5, () => {
                clear(1)
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
          type: 'unitwork/add',
          payload: {
            reqData: {
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("编辑成功", 1, () => {
                this.setState({ updateVisible: false,updateSource: {} })
                clear()
                dispatch({
                  type: 'unitwork/fetch',
                  payload: {
                    ...page,
                    reqData:{
                      value
                    }
                  }
                })
              })
            } else {
              message.error(`编辑失败 ${res.userObj ? res.userObj.msg : ''}`, 3.5, () => {
                clear(1)
              })
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
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={queryLoading}
            data={data}
            classNameSaveColumns={"unitWork5"}
            columns={columns}
            onChange={this.handleStandardTableChange}
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
      </PageHeaderWrapper>
    );
  }
}

export default UnitWork;
