import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Modal,
  Input, Button,
} from 'antd';

const FormItem = Form.Item;

@connect(({ sysuser, loading }) => ({
  sysuser,
  loading: loading.models.sysuser,
}))
@Form.create()
class AddSelfRole extends PureComponent {
  state = {
    BStatus:false
  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if(err) return ;
      onOk(values,this.clear)
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
      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;
    const { visible,loading } = data;
    const { onOk,onCancel } = on;
    return (
      <Modal
        title="新建角色"
        destroyOnClose
        centered
        visible={visible}
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolecode' })}>
          {getFieldDecorator('code', {
            rules: [{
              required: true,
              message: '请输入角色编码！',
            }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={formatMessage({ id: 'validation.rolename' })}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称！' }],
          })(<Input placeholder={formatMessage({ id: 'validation.inputvalue' })} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default AddSelfRole;
