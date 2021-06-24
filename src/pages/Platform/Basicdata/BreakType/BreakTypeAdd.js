import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Select,
} from 'antd';


const FormItem = Form.Item;

@connect(({ measure, loading }) => ({
  measure,
  loading: loading.models.measure,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class AddSelfMea extends PureComponent {
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
       reqData:{
         code:values.code,
         name:values.name,
       }
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
          title="新建"
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
                <FormItem label='设备故障类型编码'>
                  {getFieldDecorator('code',{
                    rules:[{
                      required:true,
                      message:'设备故障类型编码'
                    }]
                  })(<Input placeholder='设备故障类型编码'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='设备故障类型名称'>
                  {getFieldDecorator('name',{
                    rules: [{
                      required:true,
                      message:'设备故障类型名称'
                    }]
                  })(<Input placeholder='请输入设备故障类型名称'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
            </Row>

            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default AddSelfMea;
