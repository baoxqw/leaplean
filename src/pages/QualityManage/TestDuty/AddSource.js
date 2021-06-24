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
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';
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
}))
@Form.create()
class AddSource extends PureComponent {
  state = {

  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { selectedMaterialRowKeys } = this.state
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        number:values.number?Number(values.number):null,
        blank:values.blank?Number(values.blank):null,
        code:values.code?values.code:'',
        memo:values.memo?values.memo:'',
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
        title="填写样本数据"
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
                })(<Input placeholder='请填写序列号'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='产品编号'>
                {getFieldDecorator('code',{
                })(<Input placeholder='请填写产品编号' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='毛坯编号'>
                {getFieldDecorator('blank',{
                })(<Input placeholder='请填写毛坯编号' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否合格'>
                {getFieldDecorator('isQualified',{
                  valuePropName:"checked"
                })(<Checkbox />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否完全'>
                {getFieldDecorator('isComplete',{
                  valuePropName:"checked"
                })(<Checkbox />)}
              </FormItem>
            </Col>
          </Row>
         {/* <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='上传附件'>
                {getFieldDecorator('memo',{
                })(<TextArea rows={3} placeholder='请输入意见'/>)}
              </FormItem>
            </Col>
          </Row>*/}
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

export default AddSource;
