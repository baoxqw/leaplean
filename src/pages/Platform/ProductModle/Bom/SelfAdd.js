import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Checkbox, Button,
} from 'antd';
const { TextArea } = Input;


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

    version: 1,

    routlist: [],

    cardList: [],

    initData: {
      defaultFlag: false
    },

    visible: false,

    userDefineInt1: 0,//是否有默认版本

    values: {},
    initSource:{},

    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.visible !== this.props.data.visible) {
      const initData = nextProps.data.record;
      const { dispatch } = this.props;
      dispatch({
        type: 'bom/finddefault',
        payload: {
          reqData: {
            id: initData.id
          }
        },
        callback: (res) => {
          if(res.userDefineInt1){
            this.setState({
              userDefineInt1: res.userDefineInt1,
              initData:{
                defaultFlag:false
              }
            })
          }else{
            this.setState({
              userDefineInt1: 0,
              initData:{
                defaultFlag:true
              }
            })
          }
        }
      });
      //
      //查看版本号
      dispatch({
        type: 'bom/findVersion',
        payload: {
          reqData:{
            materialId:initData.id
          }
        },
        callback: (res) => {
          if(res.resData && res.resData[0].version){
            this.setState({
              version:res.resData[0].version + 1
            })
          }else{
            this.setState({
              version:1
            })
          }
        }

      })
      this.setState({
        initSource:nextProps.data.record
      });
    }
  }

  handleOk = (onSave) => {
    const { form } = this.props;
    const { BStatus, initData, userDefineInt1,initSource } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      const obj = {
        reqData: {
          ...fieldsValue,
          ucumId: initSource.ucumId,
          materialBaseId: initSource.id,
          defaultFlag: initData.defaultFlag ? 1 : 0,
        }
      };
      this.setState({
        BStatus:true
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
    if(status){
      this.setState({
        BStatus:false
      })
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      materialBaseName: '',
      materialBaseId: null,

      ucumId: null,
      ucumname: '',

      version: 1,

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
      initSource:{},

      BStatus:false
    })
  }

  onChange = (e) => {
    this.setState({
      initData: {
        ...this.state.initData,
        defaultFlag: e.target.checked
      },
      userDefineInt1:e.target.checked
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
      data,
      on,
    } = this.props;

    const { visible,loading} = data;
    const { onSave, onCancel } = on;

    const { initData,userDefineInt1,initSource,version } = this.state;

    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>确定</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="物料编码">
              {getFieldDecorator('materialBaseCode', {
                initialValue: initSource.code ? initSource.code : '',
              })(<Input placeholder="请输入物料编码" disabled />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="物料名称">
              {getFieldDecorator('materialBaseName', {
                initialValue: initSource.name ? initSource.name : '',
              })(<Input placeholder="请输入物料名称" disabled />)}
            </Form.Item>

          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="版本号">
              {getFieldDecorator('version', {
                initialValue: version,
                rules: [
                  {
                    required: true,
                    message: '版本号',
                  },
                ],
              })(<Input placeholder="请输入版本号" disabled/>)}
            </Form.Item>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="计量单位">
              {getFieldDecorator('ucumId', {
                initialValue: initSource.ucumName ? initSource.ucumName : '暂无',
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="换算率">
              {getFieldDecorator('hsl', {
                initialValue: initData.hsl ? initData.hsl : '',
              })(
                <Input placeholder="请输入换算率" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="是否默认版本">
              <Checkbox onChange={this.onChange} checked={initData.defaultFlag} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="数量">
              {getFieldDecorator('sl', {
                initialValue: initData.sl ? initData.sl : '',
              })(<Input placeholder="请输入数量" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="副数量">
              {getFieldDecorator('fsl', {
                initialValue: initData.fsl ? initData.fsl : '',
              })(<Input placeholder="请输入副数量" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>

        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} placeholder='请输入备注' />)}
            </Form.Item>
          </Col>
        </Row>


        <Modal
          title={"询问"}
          visible={this.state.visible}
          footer={[<Button key={1} onClick={this.quXiao}>取消</Button>,
            <Button type="primary" key={2} loading={loading} onClick={() => this.queDing(onSave)}>确定</Button>]}

        >
          <p>当前物料已存在默认版本的BOM，继续保存将使原来的
            默认版本变为普通版本，是否继续？</p>
        </Modal>
      </Modal>
    );
  }
}

export default SuperAdd;

