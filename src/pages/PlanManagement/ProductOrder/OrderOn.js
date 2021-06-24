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
  Radio,
  Tabs,
  Icon,
  Checkbox,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ porder, loading }) => ({
  porder,
  loading: loading.models.porder,
}))
@Form.create()
class OrderOn extends PureComponent {
  state = {
    BStatus:false,
    value: 0,
  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      if(BStatus){
        return
      }
      this.setState({
        BStatus:true
      })
      let obj = {
          ...values,
        prodquan:Number(values.prodquan),
        procersscards:Number(values.procersscards),
        mode:Number(this.state.value)
      }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = (status)=> {
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      BStatus:false,
      value: 0,
    })
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible } = data;
    const { onOk,onCancel } = on;
    return (
      <Modal
        title="下达订单"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='每卡生产数量'>
                {getFieldDecorator('prodquan',{
                  rules: [{
                    required:true,
                    message:'每卡生产数量'
                  }]
                })(<Input placeholder='请输入每卡生产数量' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工艺过程卡数量'>
                {getFieldDecorator('procersscards',{
                  rules: [{
                    required:true,
                    message:'请输入工艺过程卡数量'
                  }]
                })(<Input placeholder='请输入工艺过程卡数量' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='产品编号前缀'>
                {getFieldDecorator('producecode',{
                  rules: [{
                    required:true,
                    message:'产品编号前缀'
                  }]
                })(<Input placeholder='请输入产品编号前缀' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 24}} md={{ span: 24 }} sm={24}>
              <FormItem label='生产模式'>
                <Radio.Group onChange={this.onChange} value={this.state.value}>
                  <Radio value={0}>序列化</Radio>
                  <Radio value={1}>批次化</Radio>
                  <Radio value={2}>批次序列化</Radio>
                </Radio.Group>
              </FormItem>
            </Col>

          </Row>
        </Form>
      </Modal>
    );
  }
}

export default OrderOn;
