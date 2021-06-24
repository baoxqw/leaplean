import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  Divider,
  message,
  Popconfirm,
  Checkbox, Tooltip,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProcessTypeAdd from '@/pages/Platform/Basicdata/ProcessType/ProcessTypeAdd';
import ProcessTypeUpdate from '@/pages/Platform/Basicdata/ProcessType/ProcessTypeUpdate';
import styles from '../../Sysadmin/UserAdmin.less';
import { InfoCircleOutlined } from '@ant-design/icons';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery.js';

const FormItem = Form.Item;

@connect(({ protype, loading }) => ({
  protype,
  queryLoading: loading.effects['protype/fetch'],
  addLoading: loading.effects['protype/add'],
}))
@Form.create()

class ProcessType extends PureComponent {
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

  columns = [

    {
      title: '工序编号',
      dataIndex: 'code',

    },
    {
      title: '工序名称',
      dataIndex: 'name',

    },
    {
      title: '生产线',
      dataIndex: 'productionlineName',

    },
    {
      title: '时间单位',
      dataIndex: 'timetype',

    },
    {
      title: '工作站',
      dataIndex: 'workstationtypeName',

    },
    {
      title: '工作站数量',
      dataIndex: 'quantityofworkstations',

    },
    {
      title: '工作站类型',
      dataIndex: 'assignedtooperation'
    },
    {
      title: '准备时间',
      dataIndex: 'setuptime'
    },
    {
      title: '拆卸时间',
      dataIndex: 'disassemblytime'
    },
    {
      title: '首检类型',
      dataIndex: 'checktype'
    },
    {
      title: '机器利用率',
      dataIndex: 'machineutilization'
    },
    {
      title: '人工利用率',
      dataIndex: 'laborutilization'
    },
    {
      title: '单位周期生产数量',
      dataIndex: 'productioninonecycle',
    },
    {
      title: '区域',
      dataIndex: 'divisionName',
    },
    {
      title: '加工时间',
      dataIndex: 'productiontime',

    },
    {
      title: '传送时间',
      dataIndex: 'transfertime',
    },
    {
      title: '等待时间',
      dataIndex: 'waitingtime',

    },
    {
      title: '工序描述',
      dataIndex: 'description',

    },
    {
      title: '是否检验点',
      dataIndex: 'checkFlag',
      render: (text, record) => {
        return <Checkbox checked={text} />
      }
    },
    {
      title: '是否激活',
      dataIndex: 'activeFlag',
      render: (text, record) => {
        return <Checkbox checked={text} />
      }
    },
    {
      title: '是否倒冲',
      dataIndex: 'backflushFlag',
      render: (text, record) => {
        return <Checkbox checked={text} />
      }
    },
    {
      title: '是否并行工序',
      dataIndex: 'parallelFlag',
      render: (text, record) => {
        return <Checkbox checked={text} />
      }
    },
    {
      title: '是否交接点',
      dataIndex: 'handoverFlag',
      render: (text, record) => {
        return <Checkbox checked={text} />
      }
    },
    {
      title: '是否计数点',
      dataIndex: 'countFlag',
      render: (text, record) => {
        return <Checkbox checked={text} />
      }
    },
    {
      title: formatMessage({ id: 'validation.operation' }),
      dataIndex: 'caozuo',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.update(e, record)}>编辑</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'protype/fetch',
      payload: {
        pageIndex: 0,
        pageSize: 10
      }
    })
  }
  //点击删除
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'protype/remove',
      payload: {
        reqData: {
          id: record.id
        }
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('删除成功', 1, () => {
            const { page, value } = this.state;
            dispatch({
              type: 'protype/fetch',
              payload: {
                ...page,
                reqData: {
                  value
                }
              }
            })
          })
        } else {
          message.error("删除失败")
        }

      }
    })
  };
  //编辑
  update = (e, record) => {
    e.preventDefault();
    this.setState({
      updateVisible: true,
      updateRecord: record
    })
  }
  //展开-收起
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleCorpAdd = () => {
    this.setState({
      addVisible: true
    })
  }

  //查询
  findList = (e) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { code } = values;
      dispatch({
        type: 'protype/fetch',
        payload: {
          reqData: {
            value: code
          }
        }
      })
      this.setState({ value: code })
    })
  }
  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    this.setState({
      page: {
        pageIndex: 0,
        pageSize: 10
      },
      value: ''
    })
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type: 'protype/fetch',
      payload: {
        pageIndex: 0,
        pageSize: 10
      }
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={this.findList} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.ProcessType}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            {/* <FormItem label='工序名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入工序名称' />)}
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
      type: 'protype/fetch',
      payload: obj,
    });

  };


  render() {
    const {
      queryLoading,
      addLoading,
      dispatch,
      protype: { data }
    } = this.props;
    const { page, addVisible, updateVisible, updateRecord,value } = this.state;

    const AddData = {
      visible: addVisible,
      loading:addLoading
    };

    const AddOn = {
      onOk: (res, clear) => {
        dispatch({
          type: 'protype/add',
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
                  type: 'protype/fetch',
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
      onOk: (res, clear) => {
        dispatch({
          type: 'protype/add',
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
                  updateRecord: {}
                });
                dispatch({
                  type: 'protype/fetch',
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
            data={data}
            columns={this.columns}
            classNameSaveColumns={"processType1"}
            onChange={this.handleStandardTableChange}
            title={() => <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
              新建
            </Button>}
          />
          <ProcessTypeAdd on={AddOn} data={AddData} />
          <ProcessTypeUpdate on={UpdateOn} data={UpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProcessType;
