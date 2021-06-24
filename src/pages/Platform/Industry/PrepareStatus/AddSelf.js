import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Tabs,
  Icon,
  Checkbox,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


import router from 'umi/router';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ modelType, loading }) => ({
  modelType,
  loading: loading.models.modelType,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class AddSelf extends PureComponent {
  state = {
    BStatus:false
  };

  handleOk = (onOk) => {
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      let obj = {
        reqData: {
          ...values,
        },
      };
      this.setState({
        BStatus:true
      })
      onOk(obj, this.clear);
    });
  };

  handleCancel = (onCancel) => {
    onCancel(this.clear);
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
      //loading,
      on,
      data,
    } = this.props;
    const { visible, loading } = data;
    const { onOk, onCancel } = on;
    return (
      <Modal
        title="新建"
        destroyOnClose
        centered
        visible={visible}
        width={'76%'}
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='编号'>
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    message: '编号',
                  }],
                })(<Input placeholder='编号' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='名称'>
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '名称',
                  }],
                })(<Input placeholder='请输入名称' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='标识'>
                {getFieldDecorator('logo', {})(<Input placeholder='请输入标识' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {})(<TextArea rows={3} placeholder={'请输入备注'} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default AddSelf;
