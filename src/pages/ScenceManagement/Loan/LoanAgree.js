import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
  Checkbox,
  TreeSelect,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ Cre,loading }) => ({
  Cre,
  loading:loading.models.Cre
}))
@Form.create()
class LoanAgree extends PureComponent {
  state = {
    BStatus:false,
    pageStore:{},
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus, } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
     const obj = {
        reqData:{
          ...values,
          eventTime:(values.eventTime).format('YYYY-MM-DD'),
          loanAmount:Number(values.loanAmount),
          extendInfo:{
            fee:Number(values.fee)
          }
        }

      };
        this.setState({
         BStatus:true
       })
       if(typeof onSave === 'function'){
         onSave(obj,this.clear);
       }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

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
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;

    return (
      <Modal
        title={"同意"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label='机构借据号'>
              {getFieldDecorator('institutionLoanNo',{
                rules: [{
                  required: true,
                  message:'机构借据号'
                }]
              })(
                <Input placeholder="请输入机构借据号"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="支用放款状态">
              {getFieldDecorator('status',{
                rules: [{
                  required: true,
                  message:'支用放款状态'
                }]
              })( <Input placeholder="请输入支用放款状态" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="事件发生时间">
              {getFieldDecorator('eventTime',{
                rules: [{
                  required: true,
                  message:'事件发生时间'
                }]
              })( <DatePicker style={{width:'100%'}} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label='对接渠道'>
              {getFieldDecorator('channel',{
                rules: [{
                  required: true,
                  message:'对接渠道'
                }]
              })(
                <Input placeholder="请输入对接渠道"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="放款金额(单位：元)">
              {getFieldDecorator('loanAmount',{
                rules: [{
                  required: true,
                  message:'放款金额'
                }]
              })( <Input placeholder="请输入放款金额"  type={'number'}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="服务费用">
              {getFieldDecorator('fee',{
              })(<Input placeholder="请输入服务费用" type={'number'}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
        </Row>
      </Modal>
    );
  }
}

export default LoanAgree;

