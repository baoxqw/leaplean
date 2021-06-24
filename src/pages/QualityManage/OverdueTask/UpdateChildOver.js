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
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ overtask, loading }) => ({
  overtask,
  loading: loading.models.overtask,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class UpdateChildOver extends PureComponent {
  state = {
    initData:{}
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record.id !== this.props.data.record.id){
      // 在这里可以做详细的处理
      this.setState({
        initData:nextProps.data.record
      })
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        ...values,
        requestDate:values.requestDate?values.requestDate.format('YYYY-MM-DD'):''
      }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = () =>{ //在这里面写清除
    const { form } = this.props;
    //清空输入框
    form.resetFields();

    this.setState({
      initData:{}
    })
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
    const { initData } = this.state;
    return (
      <Modal
        title="测试项目编辑"
        Modal
        destroyOnClose
        visible={visible}
        width={"80%"}
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='序号'>
                {getFieldDecorator('number',{
                  initialValue:initData.number?initData.number:''
                })(<Input placeholder='请输入序号' disabled/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='试样名称'>
                {getFieldDecorator('sampleName',{
                  initialValue:initData.sampleName?initData.sampleName:''
                })(<Input placeholder='请输入试样名称'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='测试项目'>
                {getFieldDecorator('testProject',{
                  initialValue:initData.testProject?initData.testProject:''
                })(<Input placeholder='请输入测试项目'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='测试标准	'>
                {getFieldDecorator('standardTest',{
                  initialValue:initData.standardTest?initData.standardTest:''
                })(<Input placeholder='请输入测试标准'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='指标要求'>
                {getFieldDecorator('target',{
                  initialValue:initData.target?initData.target:''
                })(<Input placeholder='请输入指标要求'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='测试温度'>
                {getFieldDecorator('testTemperature',{
                  initialValue:initData.testTemperature?initData.testTemperature:''
                })(<Input placeholder='请输入测试温度' type={'number'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo',{
                  initialValue:initData.memo?initData.memo:''
                })(<TextArea rows={3} placeholder='请输入意见'/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateChildOver;
