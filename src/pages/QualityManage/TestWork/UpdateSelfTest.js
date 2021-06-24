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
        title="试验任务编辑"
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
              <FormItem label='单据编码'>
                {getFieldDecorator('billcode',{
                  initialValue:initdate?initdate.billcode:''
                })(<Input placeholder='系统自动生成' disabled/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='生产订单号'>
                {getFieldDecorator('production',{
                  initialValue:initdate?initdate.production:''
                })(<Input placeholder='请输入生产订单号'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='加工序号'>
                {getFieldDecorator('processing',{
                  initialValue:initdate?initdate.processing:''
                })(<Input placeholder='请输入加工序号'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工序名称'>
                {getFieldDecorator('processName',{
                  initialValue:initdate?initdate.processName:''
                })(<Input placeholder='请输入工序名称'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='产品编码'>
                {getFieldDecorator('productId',{
                  initialValue:initdate?initdate.productId:''
                })(<Input placeholder='请输入产品编码'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工作令'>
                {getFieldDecorator('workId',{
                  initialValue:initdate?initdate.workId:''
                })(<Input placeholder='请输入工作令'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo',{
                  initialValue:initdate?initdate.memo:''
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
