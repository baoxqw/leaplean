import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Modal, Button,
} from 'antd';


const { TextArea } = Input;

@connect(({ workcenter, loading }) => ({
  workcenter,
  loading: loading.models.workcenter,
}))
@Form.create()
class WorkAdd extends PureComponent {
  state = {
    BStatus:false
  };

  handleOk = (onOk) => {
    const { form } = this.props;
    const { BStatus} = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = {
        code: values.code,
        name: values.name,
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
      BStatus:false
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
    } = this.props;

    const { visible, loading } = data;
    const { onOk, onCancel } = on;

    return (
      <Modal
        title={'新建'}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工作中心编码">
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  message: '请选择工作中心编码',
                }],
              })(<Input placeholder="请输入工作中心编码" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工作中心名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请选择工作中心名称',
                  },
                ],
              })(
                <Input placeholder="请输入工作中心名称" />,
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
        </Row>

      </Modal>
    );
  }
}

export default WorkAdd;

