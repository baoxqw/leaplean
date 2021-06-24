import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
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
import WorkAdd from './AddSelf'
import WorkUpdate from './UpdateSelf'
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ workcenter, loading }) => ({
  workcenter,
  loading: loading.effects['workcenter/fetch'],
  addloading: loading.effects['workcenter/add'],
  updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class WorkCenter extends PureComponent {
  state = {
    addVisible: false,
    updateVisible: false,
    updateSource: [],
    page: {
      pageSize: 10,
      pageIndex: 0
    },
    conditions: [],
    value: '',

  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'workcenter/fetch',
      payload: {
        ...page
      }
    })
  }

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
    const { page, value } = this.state;
    dispatch({
      type: 'workcenter/delete',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {

        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'workcenter/fetch',
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
        type: 'workcenter/fetch',
        payload: {
          reqData: {
            value: code
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
      value: '',
      pageSize: 10,
      pageIndex: 0
    })
    //清空后获取列表
    dispatch({
      type: 'workcenter/fetch',
      payload: {
        pageSize: 10,
        pageIndex: 0
      }
    });
  };
  //编辑
  updataRoute = (record) => {
    this.setState({
      updateSource: record,
      updateVisible: true,
    })
  }


  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'workcenter/fetch',
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
                <Tooltip title={IntegratedQuery.WorkCenter}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            {/* <FormItem label='工作中心名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入工作中心名称' />)}
            </FormItem> */}
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
      addloading,
      dispatch,
      workcenter: { data },
    } = this.props;

    const { updateSource, addVisible, page, value,updateVisible } = this.state;
    const columns = [
      {
        title: '工作中心编号',
        dataIndex: 'code',
        //sorter: (a, b) => a.code.length - b.code.length,
      },
      {
        title: '工作中心名称',
        dataIndex: 'name',
        //sorter: (a, b) => a.name.length - b.name.length,
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
            <a href="#javascript:;" onClick={(e) => this.updataRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const AddData = {
      visible: addVisible,
      loading: addloading
    };

    const AddOn = {
      onOk: (res, clear) => {
        dispatch({
          type: 'workcenter/add',
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
                });
                dispatch({
                  type: 'workcenter/fetch',
                  payload: {
                    ...page,
                    reqData: {
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
      record: updateSource,
      loading: addloading
    };

    const UpdateOn = {
      onOk: (res, clear) => {
        dispatch({
          type: 'workcenter/add',
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
                  type: 'workcenter/fetch',
                  payload: {
                    ...page,
                    reqData: {
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
          updateSource: {}
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={loading}
            data={data}
            columns={columns}
            classNameSaveColumns={"workCenter5"}
            onChange={this.handleStandardTableChange}
            title={() => <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>
            }
          />
          <WorkAdd on={AddOn} data={AddData} />
          <WorkUpdate on={UpdateOn} data={UpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WorkCenter;
