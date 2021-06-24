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
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';

import router from 'umi/router';


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
class AddSample extends PureComponent {
  state = {

  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
     const obj = {
       ...values,
       indicator:values.indicator?Number(values.indicator):'',
       humidity:values.humidity?Number(values.humidity):'',
     }
      onOk(obj)
    })
  }
  handleCancel  =(onCancel)=>{
    const { form } = this.props;
    //清空输入框
    form.resetFields();
    onCancel()
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible } = data
    const { onOk,onCancel } = on
    return (
        <Modal
          title="样本信息新建"
          destroyOnClose
          centered
          visible={visible}
          width={"80%"}
          onCancel={()=>this.handleCancel(onCancel)}
          onOk={()=>this.handleOk(onOk)}
        >
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='序列号'>
                  {getFieldDecorator('number',{
                  })(<Input placeholder='请输入序列号'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='片断数量'>
                  {getFieldDecorator('pieces',{
                  })(<Input placeholder='请输入片断数量'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='预期号'>
                  {getFieldDecorator('expected',{
                  })(<Input placeholder='请输入预期号'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='实测环境温度'>
                  {getFieldDecorator('indicator',{
                  })(<Input placeholder='请输入实测环境温度' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='实测环境湿度'>
                  {getFieldDecorator('humidity',{
                  })(<Input placeholder='请输入实测环境湿度'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                  })(<TextArea rows={3} placeholder='请输入备注'/>)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default AddSample;
