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
class UpdateSelfTest extends PureComponent {
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
        title="测试数据编辑"
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
                  initialValue:initdate?initdate.number:'',
                })(<Input placeholder='请输入序列号' disabled/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='样式名称'>
                {getFieldDecorator('styleName',{
                  initialValue:initdate?initdate.styleName:'',
                })(<Input placeholder='请输入样式名称'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='材料编码'>
                {getFieldDecorator('materialId',{
                  initialValue:initdate?initdate.materialId:'',
                })(<Input placeholder='请输入材料编码'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='测试项目'>
                {getFieldDecorator('testProjectId',{
                  initialValue:initdate?initdate.testProjectId:'',
                })(<Input placeholder='请输入测试项目'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='测试标准'>
                {getFieldDecorator('standard',{
                  initialValue:initdate?initdate.standard:'',
                })(<Input placeholder='请输入测试标准'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='指标要求'>
                {getFieldDecorator('indicator',{
                  initialValue:initdate?initdate.indicator:'',
                })(<Input placeholder='请输入指标要求'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工艺测试温度'>
                {getFieldDecorator('processTemp',{
                  initialValue:initdate?initdate.processTemp:'',
                })(<Input placeholder='请输入工艺测试温度' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否完全工艺备注'>
                {getFieldDecorator('isProcess',{
                  initialValue:initdate?initdate.isProcess:'',
                  valuePropName:"checked",
                })(<Checkbox></Checkbox>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo',{
                  initialValue:initdate?initdate.memo:'',
                })(<TextArea rows={3} placeholder='请输入备注'/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateSelfTest;
