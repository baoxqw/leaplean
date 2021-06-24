import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Checkbox,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Select,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from '@/pages/QualityManage/TestWork/AddSelfTest';
import AddChild from '@/pages/QualityManage/TestWork/AddChildTest';
import UpdateSelf from '@/pages/QualityManage/TestWork/UpdateSelfTest';
import UpdateChild from '@/pages/QualityManage/TestWork/UpdateChildTest';
import router from 'umi/router';

import './tableSureBg.less'
const FormItem = Form.Item;

@connect(({ testwork, loading }) => ({
  testwork,
  loading: loading.models.testwork,
  loadingChild: loading.effects['testwork/childFetch'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class TestWork extends PureComponent {
  state = {
    addVisible: false,
    addChildVisible: false,
    updateVisible: false,
    updateChildVisible: false,
    updateSource: [],
    page: {
      pageSize: 10,
      pageIndex: 0
    },
    superId: null,
    rowId: null,
    conditions: [],
    childData: [],
    superData: {}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'testwork/fetch',
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

  handleChilddd = () => {
    this.setState({
      addChildVisible: true
    })
  };

  //删除
  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'testwork/deleteSelf',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'testwork/fetch',
              payload: {
                ...page
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
      type: 'testwork/deleteChild',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            dispatch({
              type: 'testwork/childFetch',
              payload: {
                conditions: [{
                  code: 'TEST_TASK_ID',
                  exp: '=',
                  value: superId
                }]
              },
              callback: (res) => {
                if (res && res.resData && res.resData.length) {
                  this.setState({
                    childData: res.resData
                  })
                }
              }
            })
          })
        } else {
          this.setState({
            childData: []
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
      const { code, name } = values;

      if (code || name) {
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if (code) {
          codeObj = {
            code: 'code',
            exp: 'like',
            value: code
          };
          conditions.push(codeObj)
        }
        if (name) {
          nameObj = {
            code: 'processName',
            exp: 'like',
            value: name
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          pageIndex: 0,
          pageSize: 10,
          conditions,
        };
        dispatch({
          type: 'testwork/fetch',
          payload: obj,
        })
      } else {
        this.setState({
          conditions: []
        })
        dispatch({
          type: 'testwork/fetch',
          payload: {
            ...page
          }
        })
      }
    })

  }

  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions: []
    })
    //清空后获取列表
    dispatch({
      type: 'testwork/fetch',
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

  updataChildRoute = (record) => {
    this.setState({
      updateChildSource: record,
      updateChildVisible: true,
    })
  }

  sampleDate = (e, record) => {
    e.preventDefault()
    router.push('/qualitymanage/testwork/sampleenter', { record: record });
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,

    };
    this.setState({
      page: obj
    });
    if (conditions) {
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type: 'testwork/fetch',
        payload: param,
      });
      return
    }

    dispatch({
      type: 'testwork/fetch',
      payload: obj,
    });

  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;

    return (
      <Form onSubmit={(e) => this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='单据编号'>
              {getFieldDecorator('code')(<Input placeholder='请输入单据编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='工序名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入工序名称' />)}
            </FormItem>
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
      loadingChild,
      dispatch,
      testwork: { data },
    } = this.props;
    const { updateSource, updateVisible, superId, childData, updateChildSource, updateChildVisible } = this.state;
    const columns = [
      {
        title: '单据编号',
        dataIndex: 'billcode',
      },
      {
        title: '生产订单号',
        dataIndex: 'production',
      },
      {
        title: '加工序号',
        dataIndex: 'processing',
      },
      {
        title: '工序名称',
        dataIndex: 'processName',
      },
      {
        title: '产品编码',
        dataIndex: 'productId',
      },
      {
        title: '工作令',
        dataIndex: 'workId',
      },
      {
        title: '试验报告',
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
            <a href="#javascript:;" onClick={(e) => this.updataRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const childColumns = [
      {
        title: '序列号',
        dataIndex: 'number',
      },
      {
        title: '式样名称',
        dataIndex: 'styleName',
      },
      {
        title: '材料编码',
        dataIndex: 'materialId',
      },
      {
        title: '测试项目',
        dataIndex: 'testProjectId',
      },
      {
        title: '测试标准',
        dataIndex: 'standard',
      },
      {
        title: '指标要求',
        dataIndex: 'indicator',
      },
      {
        title: '工艺测试温度',
        dataIndex: 'processTemp',
      },
      {
        title: '是否完全工艺备注',
        dataIndex: 'isProcess',
        render: (text) => {
          return <Checkbox checked={text} />
        }
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
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleChildDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataChildRoute(record)}>编辑</a>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.sampleDate(e, record)}>录入</a>
          </Fragment>
        }
      },
    ];
    const OnAddSelf = {
      onOk: (obj) => {
        dispatch({
          type: 'testwork/addself',
          payload: {
            reqData: {
              ...obj
            }
          },
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('新建成功', 1.5, () => {
                this.setState({ addVisible: false })
                const { page } = this.state;
                dispatch({
                  type: 'testwork/fetch',
                  payload: {
                    ...page
                  }
                })
              });
            } else {
              message.error('新建失败')
            }
          }
        })

      },
      onCancel: () => {
        this.setState({
          addVisible: false
        })
      }
    }
    const OnSelfData = {
      visible: this.state.addVisible
    }
    const OnUpdateSelf = {
      onOk: (obj) => {
        dispatch({
          type: 'testwork/addself',
          payload: {
            reqData: {
              id: this.state.updateSource.id,
              ...obj
            }
          },
          callback: (res) => {
            this.setState({ updateVisible: false })
            const { page } = this.state;
            if (res.errCode === '0') {
              message.success('编辑成功', 1.5, () => {
                dispatch({
                  type: 'testwork/fetch',
                  payload: {
                    ...page
                  }
                })
              });
            }
          }
        })

      },
      onCancel: () => {
        this.setState({
          updateVisible: false
        })
      }
    }
    const OnUpdateData = {
      visible: updateVisible,
      initdate: updateSource
    }

    const OnAddChild = {
      onOk: (obj, clear) => {
        const { superId } = this.state;
        if (obj) {
          obj.testTaskId = superId
        }
        dispatch({
          type: 'testwork/addchild',
          payload: {
            reqData: {
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success('新建成功', 1.5, () => {
                clear()
                this.setState({ addChildVisible: false })
                dispatch({
                  type: 'testwork/childFetch',
                  payload: {
                    conditions: [{
                      code: 'TEST_TASK_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {
                    if (res && res.resData && res.resData.length) {
                      this.setState({
                        childData: res.resData
                      })
                    } else {
                      this.setState({
                        childData: []
                      })
                    }
                  }
                })
              });
            } else {
              message.error('失败')
            }
          }
        })
      },
      onCancel: () => {
        this.setState({
          addChildVisible: false
        })
      }
    }
    const OnAddData = {
      visible: this.state.addChildVisible
    }

    const OnUpdateChild = {
      onOk: (obj) => {
        const { superId } = this.state;
        if (obj) {
          obj.testTaskId = superId
        }
        dispatch({
          type: 'testwork/addchild',
          payload: {
            reqData: {
              id: updateChildSource.id,
              ...obj
            }
          },
          callback: (res) => {
            this.setState({ updateChildVisible: false })
            if (res.errMsg === "成功") {
              message.success('编辑成功', 1.5, () => {
                dispatch({
                  type: 'testwork/childFetch',
                  payload: {
                    conditions: [{
                      code: 'TEST_TASK_ID',
                      exp: '=',
                      value: superId
                    }]
                  },
                  callback: (res) => {
                    if (res && res.resData && res.resData.length) {
                      this.setState({
                        childData: res.resData
                      })
                    } else {
                      this.setState({
                        childData: []
                      })
                    }
                  }
                })
              });
            }
          }
        })

      },
      onCancel: () => {
        this.setState({
          updateChildVisible: false
        })
      }
    }
    const OnUpdateChildData = {
      visible: updateChildVisible,
      initdate: updateChildSource,
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={loading}
            data={data}
            columns={columns}
            onRow={(record) => {
              return {
                onClick: () => {
                  const { dispatch } = this.props;
                  const { page } = this.state;
                  dispatch({
                    type: 'testwork/childFetch',
                    payload: {
                      ...page,
                      conditions: [{
                        code: 'TEST_TASK_ID',
                        exp: '=',
                        value: record.id
                      }]
                    },
                    callback: (res) => {
                      if (res && res.resData && res.resData.length) {
                        this.setState({
                          childData: res.resData
                        })
                      } else {
                        this.setState({
                          childData: []
                        })
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
            classNameSaveColumns={"TestWork1"}
            rowClassName={this.setRowClassName}
            onChange={this.handleStandardTableChange}
            title={() => <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>}
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{ marginTop: 15 }}>
          <div style={{ marginTop: '-18px' }}>
            <NormalTable
              loading={loadingChild}
              data={{ list: childData }}
              columns={childColumns}
              classNameSaveColumns={"TestWork2"}
              pagination={false}
              title={() => <Button icon="plus" onClick={this.handleChilddd} type="primary" disabled={superId ? 0 : 1}>
                记录测试数据
              </Button>
              }
            />
          </div>
          <AddChild on={OnAddChild} data={OnAddData} />
          <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TestWork;
