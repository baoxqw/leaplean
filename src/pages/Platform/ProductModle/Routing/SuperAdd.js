import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import Cadd from './Cadd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Divider,
  Button,
  Card,
  Upload,
  Icon,
  Checkbox,
  message,
} from 'antd';
import router from 'umi/router';
import NormalTable from '@/components/NormalTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ rout, loading }) => ({
  rout,
  loading: loading.models.rout,
}))
@Form.create()
class SuperAdd extends PureComponent {
  state = {
    materialBaseName: '',
    materialBaseId: null,

    ucumId: null,
    ucumname: '',

    version: '',

    routlist: [],

    cardList: [],

    initData: {
      defaultFlag: false
    },

    TreeOperationData: [],
    OperationConditions: [],
    operation_id: null,
    TableOperationData: [],
    SelectOperationValue: [],
    selectedOperationRowKeys: [],

    visible: false,

    userDefineInt1: 0,

    values: {},

    BStatus: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.visible !== this.props.data.visible) {
      const initData = nextProps.data.record;

      //const materialBaseId = initData.materialBaseId;
      const { dispatch } = this.props;
      dispatch({
        type: 'rout/isversion',
        payload: {
          reqData: {
            id: initData.id
          }
        },
        callback: (res) => {

          this.setState({
            userDefineInt1: res.userDefineInt1,
          })
        }
      });
      this.setState({
        initData
      });
    }
  }

  onSave = (onSave) => {
    const { form } = this.props;
    const { BStatus, selectedOperationRowKeys, initData, userDefineInt1 } = this.state;
    if (BStatus) {
      return
    }
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const obj = {
        code: fieldsValue.code,
        name: fieldsValue.name,
        materialBaseId: initData.id,
        version: fieldsValue.version,
        state: fieldsValue.state,
        sl: fieldsValue.sl,
        templateFlag: fieldsValue.templateFlag ? 1 : 0,
        defaultFlag: initData.defaultFlag ? 1 : 0,
        ucumId: initData.ucumId,
        operationId: selectedOperationRowKeys.length ? selectedOperationRowKeys[0] : null,
        description: fieldsValue.description,
      };
      this.setState({
        BStatus: true
      })
      if (userDefineInt1 && initData.defaultFlag) {
        this.setState({
          visible: true,
          values: obj
        });
        return
      }
      if (typeof onSave === 'function') {
        onSave(obj, this.clear);
      }
    })
  };

  handleCancel = (onCancel) => {
    if (typeof onCancel === 'function') {
      onCancel(this.clear)
    }
  };

  clear = (status) => {
    if (status) {
      this.setState({
        BStatus: false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      materialBaseName: '',
      materialBaseId: null,

      ucumId: null,
      ucumname: '',

      version: '',

      routlist: [],

      cardList: [],

      initData: {
        defaultFlag: false
      },

      TreeOperationData: [],
      OperationConditions: [],
      operation_id: null,
      TableOperationData: [],
      SelectOperationValue: [],
      selectedOperationRowKeys: [],

      visible: false,
      userDefineInt1: 0,

      values: {},
      BStatus: false
    })
  }

  onChange = (e) => {
    this.setState({
      initData: {
        ...this.state.initData,
        defaultFlag: e.target.checked
      }
    })
  };

  queDing = (onSave) => {
    const { values } = this.state;
    if (typeof onSave === 'function') {
      onSave(values, this.clear, 1);
    }
  }

  quXiao = () => {
    this.setState({
      visible: false,
      initData: {
        ...this.state.initData,
        defaultFlag: false
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      data,
      on,
    } = this.props;

    const { visible } = data;
    const { onSave, onCancel } = on;

    const { initData } = this.state;

    const ons = {
      onIconClick: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'rout/newdata',
          payload: {
            reqData: {}
          },
          callback: (res) => {
            const a = toTree(res.resData);
            this.setState({
              TreeOperationData: a
            })
          }
        });
        dispatch({
          type: 'rout/fetchTable',
          payload: {
            pageIndex: 0,
            pageSize: 10,
          },
          callback: (res) => {
            this.setState({
              TableOperationData: res,
            })
          }
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree: (selectedKeys, info) => {
        const { dispatch } = this.props;
        if (info.selectedNodes[0]) {
          const obj = {
            pageIndex: 0,
            pageSize: 10,
            id: info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type: 'rout/fetchTable',
            payload: obj,
            callback: (res) => {
              this.setState({
                TableOperationData: res,
                operation_id: obj.id
              })
            }
          })
        } else {
          dispatch({
            type: 'rout/fetchTable',
            payload: {
              pageIndex: 0,
              pageSize: 10,
            },
            callback: (res) => {
              this.setState({
                TableOperationData: res,
                operation_id: obj.id
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange: (obj) => {
        const { dispatch } = this.props;
        const { OperationConditions, operation_id } = this.state;
        const param = {
          id: operation_id,
          ...obj
        };
        if (OperationConditions.length) {
          dispatch({
            type: 'rout/fetchTable',
            payload: {
              conditions: OperationConditions,
              ...obj,
            },
            callback: (res) => {
              this.setState({
                TableOperationData: res,
              })
            }
          });
          return
        }
        dispatch({
          type: 'rout/fetchTable',
          payload: param,
          callback: (res) => {
            this.setState({
              TableOperationData: res,
            })
          }
        })
      }, //分页
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectOperationValue: nameList,
          selectedOperationRowKeys: selectedRowKeys,
        })
      }, //模态框确定时触发
      onCancel: () => {

      },  //取消时触发
      handleSearch: (values) => {
        //点击查询调的方法 参数是个对象  就是输入框的值
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
              code: 'name',
              exp: 'like',
              value: name
            };
            conditions.push(nameObj)
          }
          this.setState({
            OperationConditions: conditions
          })
          const obj = {
            pageIndex: 0,
            pageSize: 10,
            conditions,
          };
          dispatch({
            type: 'rout/fetchTable',
            payload: obj,
            callback: (res) => {
              this.setState({
                TableOperationData: res,
              })
            }
          })
        } else {
          this.setState({
            OperationConditions: []
          })
          dispatch({
            type: 'rout/fetchTable',
            payload: {
              pageIndex: 0,
              pageSize: 10,
            },
            callback: (res) => {
              this.setState({
                TableOperationData: res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset: () => {
        this.setState({
          OperationConditions: []
        })
        dispatch({
          type: 'rout/fetchTable',
          payload: {
            pageIndex: 0,
            pageSize: 10,
          },
          callback: (res) => {
            this.setState({
              TableOperationData: res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty: () => {
        this.setState({
          SelectOperationValue: [],
          selectedOperationRowKeys: [],
        })
      }
    };
    const datas = {
      TreeData: this.state.TreeOperationData, //树的数据
      TableData: this.state.TableOperationData, //表的数据
      SelectValue: this.state.SelectOperationValue, //框选中的集合
      selectedRowKeys: this.state.selectedOperationRowKeys, //右表选中的数据
      placeholder: '请选择人员',
      columns: [
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          width: 1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList: [
        { label: '人员编码', code: 'code', placeholder: '请输入人员编码' },
        { label: '人员姓名', code: 'name', placeholder: '请输入人员姓名' },
      ],
      title: '物料人员'
    }

    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={() => this.onSave(onSave)}
        onCancel={() => this.handleCancel(onCancel)}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工艺编码">
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    message: '请输入工艺编码'
                  }],
                })(<Input placeholder="请输入工艺编码" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工艺名称">
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请输入工艺名称'
                  }],
                })(<Input placeholder="请输入工艺名称" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="物料编码">
                {getFieldDecorator('materialBaseCode', {
                  rules: [{
                    required: true,
                    message: '请输入物料'
                  }],
                  initialValue: initData.code
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料名称'>
                {getFieldDecorator('materialBaseName', {
                  initialValue: initData.name
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="状态">
                {getFieldDecorator('state', {
                  rules: [{
                    required: true,
                    message: '请选择状态'
                  }],
                })(<Select style={{ width: '100%' }} placeholder={"请选择状态"}>
                  <Option value={1}>初稿</Option>
                  <Option value={2}>已审核</Option>
                  <Option value={3}>已拒绝</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="数量">
                {getFieldDecorator('sl', {
                  rules: [{
                    required: true,
                    message: '请输入数量'
                  }],
                })(<Input placeholder="请输入数量" type="Number" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否模板">
                {getFieldDecorator('templateFlag', {
                  valuePropName: 'checked',
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否默认版本">
                <Checkbox onChange={this.onChange} checked={initData.defaultFlag} />
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="计量单位">
                {getFieldDecorator('ucumName', {
                  rules: [{
                    required: true,
                  }],
                  initialValue: initData.ucumName
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="创建人">
                {getFieldDecorator('operationName', {
                  rules: [{
                    required: true,
                    message: '请选择创建人'
                  }],
                })(<TreeTable
                  on={ons}
                  data={datas}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="版本">
                {getFieldDecorator('version', {
                  rules: [{
                    required: true,
                    message: '请输入版本'
                  }],
                  initialValue: initData.version ? initData.version : ''
                })(<Input placeholder="请输入版本" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label='工艺描述'>
                {getFieldDecorator('description', {
                })(
                  <TextArea rows={3} placeholder={"请输入工艺描述"} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

            </Col>
          </Row>
        </div>

        <Modal
          title={"询问"}
          visible={this.state.visible}
          onOk={() => this.queDing(onSave)}
          onCancel={this.quXiao}
        >
          <p>当前物料已存在默认版本的BOM，继续保存将使原来的
            默认版本变为普通版本，是否继续？</p>
        </Modal>
      </Modal>
    );
  }
}

export default SuperAdd;

