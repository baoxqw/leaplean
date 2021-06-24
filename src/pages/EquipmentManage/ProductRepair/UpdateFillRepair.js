import React, { Fragment, PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Checkbox,
  Modal,
  message,
  TreeSelect,
} from 'antd';

import BraftEditor from 'braft-editor';
import { formatMessage, FormattedMessage } from 'umi/locale';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import moment from 'moment';

const { TextArea } = Input;
@connect(({ EMA, loading }) => ({
  EMA,
  loading: loading.models.EMA,
}))

@Form.create()
class UpdateFillRepair extends PureComponent {
  state = {
    initdata:null
  };

  componentDidMount() {

  }

  onOk = (onOk)=>{
    const { form,data} = this.props;
    const { initdata } = data
    form.validateFields((err, fieldsValue) => {
      const obj ={
        ...fieldsValue,
        repairorderId:initdata.id,
        starttime:fieldsValue['starttime'].format('YYYY-MM-DD HH:mm:ss'),
        endtime:fieldsValue['endtime'].format('YYYY-MM-DD HH:mm:ss'),
        startpause:fieldsValue['startpause'].format('YYYY-MM-DD HH:mm:ss'),
        endpause:fieldsValue['endpause'].format('YYYY-MM-DD HH:mm:ss'),
        isextension:fieldsValue['isextension']?1:0,
        ishours:fieldsValue['ishours']?1:0,
      }
      
      onOk(obj)
    })

  }

  handleCancel = (onCancle)=>{
    const { form} = this.props;
    form.resetFields()
    onCancle()
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      on,
      data,
    } = this.props;
    const { onOk,onCancle } = on
    const { visible,initdata } = data
    return (
      <Modal
        title={"编辑报修单"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onOk(onOk)}
        onCancel={()=>this.handleCancel(onCancle)}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='单据编号'>
                {getFieldDecorator('code', {
                  initialValue:initdata?initdata.billcode:''
                })(<Input placeholder='自动带入' disabled/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='故障类型'>
                {getFieldDecorator('faultTypeId', {
                  initialValue:initdata?initdata.faultTypeId:''
                })(<Input placeholder='自动带入' disabled/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='维修类型'>
                {getFieldDecorator('spec', {
                  initialValue:initdata?initdata.spec:''
                })(<Input placeholder='请输入维修类型'  />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='设备代码'>
                {getFieldDecorator('equi', {
                  initialValue:initdata?initdata.equi:''
                })(<Input placeholder='自动带入' disabled/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='设备名称'>
                {getFieldDecorator('equiname', {
                  initialValue:initdata?initdata.equiname:''
                })(<Input placeholder='自动带入' disabled/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='规格型号'>
                {getFieldDecorator('size', {
                  initialValue:initdata?initdata.size:''
                })(<Input placeholder='自动带入' disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='开始维修时间'>
                {getFieldDecorator('starttime', {
                  initialValue:initdata?moment(initdata.starttime):null,
                  rules: [{
                    required: true,
                    message:'请选择开始维修时间'
                  }],
                })( <DatePicker showTime style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='结束维修时间'>
                {getFieldDecorator('endtime', {
                  initialValue:initdata?moment(initdata.endtime):null,
                  rules: [{
                    required: true,
                    message:'请选择结束维修时间'
                  }],
                })( <DatePicker showTime style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='是否默认维修工时(小时)'>
                {getFieldDecorator('ishours', {
                  initialValue:initdata?initdata.ishours:'',
                  valuePropName:"checked"
                })(<Checkbox></Checkbox>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='开始暂停时间'>
                {getFieldDecorator('startpause', {
                  initialValue:initdata?moment(initdata.startpause):null,
                  rules: [{
                    required: true,
                    message:'请选择开始暂停时间'
                  }],
                })( <DatePicker showTime style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='结束暂停时间'>
                {getFieldDecorator('endpause', {
                  initialValue:initdata?moment(initdata.endpause):null,
                  rules: [{
                    required: true,
                    message:'请选择结束维修时间'
                  }],
                })( <DatePicker showTime style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='停机工时(小时)'>
                {getFieldDecorator('parkinghours', {
                  initialValue:initdata?initdata.parkinghours:'',
                })(<Input placeholder='自动计算得出' disabled/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='外包维修商'>
                {getFieldDecorator('businessId', {
                  initialValue:initdata?initdata.businessId:'',
                })( <Input/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='是否扩展'>
                {getFieldDecorator('isextension', {
                  initialValue:initdata?initdata.isextension:'',
                  valuePropName:"checked"
                })( <Checkbox ></Checkbox>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label='备注'>
                {getFieldDecorator('memo', {
                  initialValue:initdata?initdata.memo:'',
                })( <TextArea rows={3} placeholder={'请输入备注'}/>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateFillRepair;
