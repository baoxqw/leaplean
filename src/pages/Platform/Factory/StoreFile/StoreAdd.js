import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  Form,
  Input, Button,
} from 'antd';

const { TextArea } = Input;

@connect(({ RFile,loading }) => ({
  RFile,
  loading:loading.models.RFile
}))
@Form.create()
class StoreAdd extends PureComponent {
  state = {
    BStatus:false
  };

  handleOk = (onSave)=>{
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        code:values.code,
        name:values.name,
        memo:values.memo
      };
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

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
      BStatus:false
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on
    } = this.props;

    const { visible,loading } = data;
    const { onSave,onCancel } = on;
    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='76%'
        destroyOnClose
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>确定</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="仓库编号">
              {getFieldDecorator('code',{
                rules: [{
                  required: true,
                  message:'请输入仓库编号'
                }]
              })(<Input placeholder="请输入仓库编号" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="仓库名称">
              {getFieldDecorator('name',{
                rules: [{
                  required: true,
                  message:'请输入仓库名称'
                }]
              })(
                <Input placeholder="请输入仓库名称" />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default StoreAdd;

