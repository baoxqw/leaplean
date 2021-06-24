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
import styles from '../../Sysadmin/UserAdmin.less';
import StoreAdd from './StoreAdd'
import StoreUpdate from './StoreUpdate'
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

@connect(({ RFile, loading }) => ({
  RFile,
  queryLoading: loading.effects['RFile/fetch'],
  addLoading: loading.effects['RFile/add'],
}))
@Form.create()
class StoreFile extends PureComponent {
  state = {
    page: {
      pageSize: 10,
      pageIndex: 0
    },
    conditions: [],
    addVisible: false,
    updateVisible: false,
    updateRecord: {},
    value: ''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'RFile/fetchstore',
      payload: {
        pageSize: 10,
        pageIndex: 0
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
      updateRecord: record,
      updateVisible: true
    })
  };

  handleDelete = (record) => {

    const { id } = record;
    const { dispatch } = this.props;
    const { page, value } = this.state;
    dispatch({
      type: 'RFile/deletestore',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'RFile/fetchstore',
              payload: {
                pageSize: 10,
                pageIndex: 0,
                reqData: {
                  value
                }
              }
            })
          })
        } else {
          message.error('删除失败')
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
        type: 'RFile/fetchstore',
        payload: {
          pageIndex: 0,
          pageSize: 10,
          reqData: {
            value: code
          }
        }
      })
    })

  }

  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;

    this.setState({
      value: '',
      page: {
        pageSize: 10,
        pageIndex: 0
      }
    })
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type: 'RFile/fetchstore',
      payload: {
        pageSize: 10,
        pageIndex: 0,

      }
    })
  };

  //分页
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
      type: 'RFile/fetchstore',
      payload: obj,
    });

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={(e) => this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.StoreFile}>
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
      RFile: { datastore },
      dispatch,
      queryLoading,
      addLoading
    } = this.props;

    const { page, addVisible, updateVisible, updateRecord,value } = this.state;

    const columns = [
      {
        title: '仓库编号',
        dataIndex: 'code',

      },
      {
        title: '仓库名称',
        dataIndex: 'name',

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

    const AddData = {
      visible: addVisible,
      loading:addLoading
    };

    const AddOn = {
      onSave: (res, clear) => {
        dispatch({
          type: 'RFile/addstore',
          payload: {
            reqData: {
              ...res
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
                clear();
                this.setState({
                  addVisible: false
                })
                dispatch({
                  type: 'RFile/fetchstore',
                  payload: {
                    ...page,
                    reqData:{
                      value
                    }
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
      record: updateRecord,
      loading:addLoading
    };

    const UpdateOn = {
      onSave: (res, clear) => {
        dispatch({
          type: 'RFile/addstore',
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
                  updateVisible: false,
                  updateRecord:{}
                });
                dispatch({
                  type: 'RFile/fetchstore',
                  payload: {
                    ...page,
                    reqData:{
                      value
                    }
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

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={queryLoading}
            data={datastore}
            columns={columns}
            classNameSaveColumns={"StoreFile5"}
            onChange={this.handleStandardTableChange}
            title={() => <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>
            }
          />
          <StoreAdd on={AddOn} data={AddData} />
          <StoreUpdate on={UpdateOn} data={UpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default StoreFile;
