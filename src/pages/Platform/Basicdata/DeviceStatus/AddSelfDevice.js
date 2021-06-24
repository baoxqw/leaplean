import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Checkbox,
  Select,
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ dstatus, loading }) => ({
  dstatus,
  loading: loading.models.dstatus,
}))
@Form.create()
class AddSelfDevice extends PureComponent {
  state = {
    BStatus:false
  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return
    }

    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      this.setState({
        BStatus:true
      })
      let obj = {
        code:values.code,
        name:values.name,
        type:Number(values.type),
        memo:values.memo,
        isOpen:values.isOpen?1:0,
      }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

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
      loading,
      on,
      data
    } = this.props;
    const { visible } = data;
    const { onOk,onCancel } = on;
    return (
      <Modal
        title="设备状态新建"
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
              <FormItem label='状态编码'>
                {getFieldDecorator('code',{
                  rules: [{
                    required:true,
                    message:'状态编码'
                  }]
                })(<Input placeholder='请输入状态编码'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='状态名称'>
                {getFieldDecorator('name',{
                  rules: [{
                    required:true,
                    message:'状态名称'
                  }]
                })(<Input placeholder='请输入状态名称' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='状态分类'>
                {getFieldDecorator('type',{
                  rules: [{
                    required:true,
                    message:'状态分类'
                  }]
                })(<Select placeholder='请选择状态分类' style={{width:'100%'}}>
                  <Option value={1}>在用</Option>
                  <Option value={2}>闲置</Option>
                  <Option value={3}>封存</Option>
                  <Option value={4}>报废</Option>
                  <Option value={5}>处置</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否启用'>
                {getFieldDecorator('isOpen',{
                  valuePropName:"checked",
                })(<Checkbox />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo',{
                })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default AddSelfDevice;
