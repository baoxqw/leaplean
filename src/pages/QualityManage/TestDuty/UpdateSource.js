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
  Checkbox,
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
@connect(({ testduty, loading }) => ({
  testduty,
  loading: loading.models.testduty,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class UpdateSource extends PureComponent {
  state = {
    initData:{}
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record.id !== this.props.data.record.id){
      this.setState({
        initData:nextProps.data.record
      })
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { initData } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        id:initData.id,
        number:values.number?Number(values.number):null,
        blank:values.blank?Number(values.blank):null,
        code:values.code?values.code:'',
        memo:values.memo?values.memo:'',
        inspectionDataId:initData.inspectionDataId,
        isQualified:values.isQualified?1:0,
        isComplete:values.isComplete?1:0,
      }
   
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = ()=> {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      initData:{}
    })
  }

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
        title="样本数据编辑"
        Modal
        destroyOnClose
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
                  initialValue:initData.number?initData.number:''
                })(<Input placeholder='请填写序列号'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='产品编号'>
                {getFieldDecorator('code',{
                  initialValue:initData.code?initData.code:''
                })(<Input placeholder='请填写产品编号' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='毛坯编号'>
                {getFieldDecorator('blank',{
                  initialValue:initData.blank?initData.blank:''
                })(<Input placeholder='请填写毛坯编号' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否合格'>
                {getFieldDecorator('isQualified',{
                  initialValue:initData.isQualified,
                  valuePropName:"checked"
                })(<Checkbox />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否完全'>
                {getFieldDecorator('isComplete',{
                  initialValue:initData.isComplete,
                  valuePropName:"checked"
                })(<Checkbox />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo',{
                  initialValue:initData.memo?initData.memo:'',
                })(<TextArea rows={3} placeholder='请输入备注'/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateSource;
