import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import NormalTable from '@/components/NormalTable';
import TreeSelectTransfer from './TreeSelectTransfer';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  Divider,
  Modal,
  message,
  Popconfirm,
  Tooltip
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './UserAdmin.less';
import AddSelfRole from '@/pages/Platform/Sysadmin/AddSelfRole';
import UpdateSelfRole from '@/pages/Platform/Sysadmin/UpdateSelfRole';
import { toTree } from '@/pages/tool/ToTree';
import { InfoCircleOutlined } from '@ant-design/icons';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery.js';

const FormItem = Form.Item;
@connect(({ role, loading }) => ({
  role,
  queryLoading: loading.effects['role/fetch'],
  addLoading: loading.effects['role/add'],
}))
@Form.create()
class RoleAdmins extends PureComponent {
  state = {
    modalVisible: false,
    editVisible: false,
    distribution: false,
    selectedRows: [],
    formValues: {},
    fields: {},
    pageIndex: 0,
    mockData: [], //左边框数据
    targetKeys: [], //右边框数据
    selectedKeys: [], //存放选中的数据
    dataList: [],
    valueLiset: [],
    arrList: [],
    roleId: null,
    roleData: [],
    visibleIndex: false,
    inputValue: '',
    rId: null,
    page: {},
    conditions: [],
    addVisible: false,
    updateVisible: false,
    updateSource: {},
  };

  columns = [
    {
      title: `${formatMessage({ id: 'validation.code' })}`,
      dataIndex: 'code',

    },
    {
      title: `${formatMessage({ id: 'validation.name' })}`,
      dataIndex: 'name',

    },

    {
      title: `${formatMessage({ id: 'validation.operation' })}`,
      dataIndex: 'caozuo',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })}
                      onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="#javascript:;"
             onClick={(e) => this.handleEditVisible(e, record)}>{formatMessage({ id: 'validation.update' })}</a>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.handleDistribution(e, record)}>分配权限</a>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.showModal(e, record)}>选择</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const obj = {
      pageIndex: 0,
      pageSize: 10,
    };
    dispatch({
      type: 'role/fetch',
      payload: obj,
    });
  }

  findList = (e) => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { searchcode } = values;
      this.setState({ value: searchcode });
      dispatch({
        type: 'role/fetch',
        payload: {
          ...page,
          reqData: {
            value: searchcode,
          },
        },
      });
    });
  };

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
      type: 'role/fetch',
      payload: {
        reqData: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    /*
      pagination中包含：
        current: 2
        pageSize: 10
        showQuickJumper: true
        showSizeChanger: true
        total: 48
    */
    const { dispatch } = this.props;
    const { conditions} = this.state;

    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };

    this.setState({
      page:obj
    });

    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'role/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'role/fetch',
      payload: obj,
    });
  };

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
                <Tooltip title={IntegratedQuery.role}>
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
      </Form>
    );
  }

  showModal = (e, record) => {
    e.preventDefault();
    this.setState({
      visibleIndex: true,
      rId: record.id,
      inputValue: record.indexpage,
    });
  };

  handleIndex = e => {
    const { inputValue, rId } = this.state;
    const { dispatch } = this.props;

    if (!inputValue) {
      message.error('请输入首页路径');
      return;
    }
    dispatch({
      type: 'role/index',
      payload: {
        reqData: {
          role_id: rId,
          indexpage: inputValue,
        },
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('设置成功', 1, () => {
            this.setState({
              visibleIndex: false,
              inputValue: '',
              rId: null,
            });
            dispatch({
              type: 'role/fetch',
              payload: {
                ...this.state.page,
              },
            });
          });
        }
      },
    });
  };

  cancelIndex = e => {
    this.setState({
      visibleIndex: false,
      inputValue: '',
      rId: null,
    });
  };

  //删除
  handleDelete = (record) => {
    const { dispatch } = this.props;
    const obj = {
      reqData: {
        id: record.id,
      },
    };
    dispatch({
      type: 'role/remove',
      payload: obj,
      callback: (res) => {
        if(res.errCode === '0'){
          message.success("删除成功", 1, () => {
            const { value,page } = this.state;
            dispatch({
              type: 'role/fetch',
              payload: {
                ...page,
                reqData:{
                  value
                }
              }
            })
          })
        }else{
          message.error("删除失败")
        }
      },
    });
  };

  handleEditVisible = (e, record) => {
    e.preventDefault();
    this.setState({
      updateVisible: true,
      updateSource: record,
    });
  };

  handleDistribution = (e, record) => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.setState({
      distribution: true,
      roleId: record.id,
    });
    if (!this.state.editVisible) {
      this.setState({
        fields: record,
      });
    }
    dispatch({
      type: 'role/fetchAntu',
      payload: {
        reqData: {},
      },
      callback: (res) => {

        if (!res.resData) {
          this.setState({
            roleData: [],
            valueLiset: [],
          });
          return;
        }
        const a = toTree(res.resData);
        this.setState({
          dataList: res.resData,
          valueList: a,
          roleId: record.id,
        });
        dispatch({
          type: 'role/roleIdAntu',
          payload: {
            id: record.id,
          },
          callback: (ress) => {
            if (!ress.resData) {
              this.setState({
                roleData: [],
              });
              return;
            }
            this.setState({
              roleData: ress.resData,
            });
          },
        });
      },
    });
  };

  handleModalVisible = () => {
    this.setState({
      addVisible: true,
    });
  };


  handleCancel = () => {
    this.setState({
      distribution: false,
    });
  };


  getTheTree = (obj) => {
    let arr = [];
    Object.keys(obj).forEach(function(key) {
      arr.push(obj[key]);
    });

    this.setState({
      arrList: arr,
    });
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { arrList, roleId } = this.state;
    if (arrList.length) {
      dispatch({
        type: 'role/distribution',
        payload: {
          userDefineStrGroup: arrList,
          id: roleId,
        },
        callback: (res) => {

          message.success('分配成功', 1.5, () => {
            this.setState({
              distribution: false,
            });
          });
        },
      });
    }
  };

  chanValue = (e) => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  render() {
    const {
      role: { data },
      queryLoading,
      addLoading,
      dispatch,
    } = this.props;
    const { valueList } = this.state;
    const { addVisible, updateVisible, updateSource } = this.state;

    const OnAddSelf = {
      onOk: (response, clear) => {
        dispatch({
          type: 'role/add',
          payload: {
            reqData: {
              ...response,
            },
          },
          callback: (res) => {
            if (res.resData && res.resData.length) {
              message.success('添加成功', 1, () => {
                clear();
                this.setState({
                  addVisible: false,
                });
                dispatch({
                  type: 'role/fetch',
                  payload: {
                    ...this.state.page,
                  },
                });
              });
            } else {
              clear(1);
              message.error('添加失败');
            }

          },
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
      visible: addVisible,
      loading:addLoading
    };

    const OnUpdateSelf = {
      onOk: (response, clear) => {
        dispatch({
          type: 'role/add',
          payload: {
            reqData: {
              ...response,
            },
          },
          callback: (res) => {
            if (res.resData && res.resData.length) {
              message.success('编辑成功', 1, () => {
                clear();
                this.setState({
                  updateVisible: false,
                });
                dispatch({
                  type: 'role/fetch',
                  payload: {
                    ...this.state.page,
                  },
                });
              });
            } else {
              clear();
              message.error('编辑失败');
            }
          },
        });
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateVisible: false,
          updateSource: {},
        });
      },
    };
    const OnUpdateData = {
      visible: updateVisible,
      record: updateSource,
      loading:addLoading
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={queryLoading}
            data={data}
            columns={this.columns}
            classNameSaveColumns={'roleAdminName1'}
            onChange={this.handleStandardTableChange}
            title={() => <Button icon="plus" type="primary" size='default'
                                 onClick={() => this.handleModalVisible(true)}>
              {formatMessage({ id: 'validation.new' })}
            </Button>
            }
          />
        </Card>

        <AddSelfRole on={OnAddSelf} data={OnSelfData} />

        <UpdateSelfRole on={OnUpdateSelf} data={OnUpdateData} />

        <Modal
          title="分配权限"
          visible={this.state.distribution}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={700}
          destroyOnClose={true}
        >
          <TreeSelectTransfer
            filterOption={this.filterOption}
            dataSource={valueList}
            rightDataList={this.state.roleData}
            dataList={this.state.dataList}
            titles={['分配权限', '已分配权限']}
            onChange={this.getTheTree}
          />

        </Modal>

        <Modal
          title="设置首页"
          visible={this.state.visibleIndex}
          onOk={this.handleIndex}
          onCancel={this.cancelIndex}
        >
          <Input value={this.state.inputValue} onChange={(e) => this.chanValue(e)} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default RoleAdmins;
