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
class AddChildOver extends PureComponent {
  state = {

  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
     const obj = {
       ...values,
       requestDate:values.requestDate?values.requestDate.format('YYYY-MM-DD'):'',
       testTemperature:values.testTemperature?Number(values.testTemperature):null,
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

    // state 清空  这里state本来就是空的 在复杂的情况下会有
  };

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
          title="测试项目新建"
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
                <FormItem label='序号'>
                  {getFieldDecorator('number',{
                  })(<Input placeholder='请输入序号'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='试样名称'>
                  {getFieldDecorator('sampleName',{
                  })(<Input placeholder='请输入试样名称'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='测试项目'>
                  {getFieldDecorator('testProject',{
                  })(<Input placeholder='请输入测试项目'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='测试标准	'>
                  {getFieldDecorator('standardTest',{
                  })(<Input placeholder='请输入测试标准'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='指标要求'>
                  {getFieldDecorator('target',{
                  })(<Input placeholder='请输入指标要求'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='测试温度'>
                  {getFieldDecorator('testTemperature',{
                  })(<Input placeholder='请输入测试温度' type={'number'}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                  })(<TextArea rows={3} placeholder='请输入意见'/>)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default AddChildOver;
