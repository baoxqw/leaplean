import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Modal,
  DatePicker, Button,
} from 'antd';
import moment from 'moment';
const { TextArea } = Input;
@connect(({ pS, loading }) => ({
  pS,
  loading: loading.models.pS,
}))
@Form.create()
class selfUpdate extends PureComponent {
  state = {
    initData: {},
    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      this.setState({
        initData: nextProps.data.record,
      });
    }
  }

  handleOk = (onOk) => {
    const { form } = this.props;
    const userinfo = localStorage.getItem('userinfo');
    const user = JSON.parse(userinfo);
    const userId = user.id;
    const { initData,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = {
        reqData: {
          ...values,
          id: initData.id,
          userId: userId,
          creatTime: values.creatTime.format(' YYYY-MM-DD'),
          memo: values.memo,
          code: values.code,
          name: values.name,
        },
      };
      this.setState({
        BStatus:true
      })
      if (typeof onOk === 'function') {
        onOk(obj, this.clear);
      }
    });
  };

  handleCancel = (onCancel) => {
    if (typeof onCancel === 'function') {
      onCancel(this.clear);
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
      initData: {},
      BStatus:false
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
    } = this.props;

    const { visible,loading } = data;
    const { onOk, onCancel } = on;

    const { initData } = this.state;

    return (
      <Modal
        title={'编辑'}
        visible={visible}
        width='76%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="项目阶段编码">
              {getFieldDecorator('code', {
                initialValue: initData.code ? initData.code : '',
                rules: [{
                  required: true,
                  message: '请输入项目阶段编码',
                }],
              })(<Input placeholder="请输入项目阶段编码" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="项目阶段名称">
              {getFieldDecorator('name', {
                initialValue: initData.name ? initData.name : '',
                rules: [{
                  required: true,
                  message: '请输入项目阶段名称',
                }],
              })(
                <Input placeholder="请输入项目阶段名称" />,
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="创建人">
              {getFieldDecorator('userName', {
                initialValue: initData.userName ? initData.userName : '',
              })(<Input placeholder="请输入创建人" disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="创建时间">
              {getFieldDecorator('creatTime', {
                initialValue: moment(initData.creatTime),
              })(<DatePicker style={{ width: '100%' }} disabled />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
                initialValue: initData.memo
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default selfUpdate;

