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
import moment from 'moment'
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
class UpdateSample extends PureComponent {
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
    const { visible,initdate } = data
    const { onOk,onCancel } = on
    return (
      <Modal
        title="样本信息编辑"
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
              <FormItem label='序列号'>
                {getFieldDecorator('number',{
                  initialValue:initdate?initdate.number:''
                })(<Input placeholder='请输入序列号' disabled/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='片断数量'>
                {getFieldDecorator('pieces',{
                  initialValue:initdate?initdate.pieces:''
                })(<Input placeholder='请输入片断数量'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='预期号'>
                {getFieldDecorator('expected',{
                  initialValue:initdate?initdate.expected:''
                })(<Input placeholder='请输入预期号'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='实测环境温度'>
                {getFieldDecorator('indicator',{
                  initialValue:initdate?initdate.indicator:''
                })(<Input placeholder='请输入实测环境温度' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='实测环境湿度'>
                {getFieldDecorator('humidity',{
                  initialValue:initdate?initdate.humidity:''
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
                  initialValue:initdate?initdate.memo:''
                })(<TextArea rows={3} placeholder='请输入意见'/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateSample;
