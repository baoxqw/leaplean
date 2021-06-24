import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Modal,
  Input, Button,
} from 'antd';

const FormItem = Form.Item;
@connect(({ measure, loading }) => ({
  measure,
  loading: loading.models.measure,
}))
@Form.create()
class UpdateSelfMea extends PureComponent {
  state = {
    initData:{},
    BStatus:false
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      this.setState({
        initData:nextProps.data.record,
      })
    }
  }
  handleOk = (onOk) =>{
    const { form,data} = this.props;
    const { record } = data;
    const { BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
     let obj = {
       reqData:{
         id:record.id,
         code:values.code,
         name:values.name,
       }
     }
      this.setState({
        BStatus:true
      })
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
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      BStatus:false,
      initData:{}
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;
    const {initData } = this.state
    const { visible,record,loading } = data;
    const { onOk,onCancel } = on;
    return (
        <Modal
          title="编辑"
          destroyOnClose
          centered
          visible={visible}
          width={"80%"}
          onCancel={() => this.handleCancel(onCancel)}
          footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
            <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
        >
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工作单元类型编码'>
                  {getFieldDecorator('code',{
                    initialValue:record.code?record.code:'',
                    rules:[{
                      required:true,
                      message:'工作单元类型编码'
                    }]
                  })(<Input placeholder='工作单元类型编码'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工作单元类型名称'>
                  {getFieldDecorator('name',{
                    initialValue:record.name?record.name:'',
                    rules: [{
                      required:true,
                      message:'工作单元类型名称'
                    }]
                  })(<Input placeholder='工作单元类型名称'/>)}
                </FormItem>
              </Col>

            </Row>

          </Form>
        </Modal>
    );
  }
}

export default UpdateSelfMea;
