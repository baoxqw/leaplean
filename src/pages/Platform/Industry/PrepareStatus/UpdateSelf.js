import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Button,
  Select,
} from 'antd';

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
class UpdateSelf extends PureComponent {
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
    const { form, data } = this.props;
    const { record } = data;
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
          id: record.id,
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
      initData: {},
      BStatus:false
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      //loading,
      on,
      data,
    } = this.props;
    const { initData } = this.state;
    const { visible, record, loading } = data;
    const { onOk, onCancel } = on;
    return (
      <Modal
        title="编辑"
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
                  initialValue: record.code ? record.code : '',
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
                  initialValue: record.name ? record.name : '',
                  rules: [{
                    required: true,
                    message: '名称',
                  }],
                })(<Input placeholder='请输入名称' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='标识'>
                {getFieldDecorator('logo', {
                  initialValue: record.logo ? record.logo : '',
                })(<Input placeholder='请输入标识' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue: record.memo ? record.memo : '',
                })(<TextArea rows={3} placeholder={'请输入备注'} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateSelf;
