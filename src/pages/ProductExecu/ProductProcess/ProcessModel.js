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

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
@Form.create()
class processModel extends PureComponent {
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
          qualifiednum:Number(values.qualifiednum),
          scrapnum:Number(values.scrapnum),
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
    this.setState({
      BStatus:false
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
        title="完成生产"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='合格数量'>
                {getFieldDecorator('qualifiednum',{
                  rules: [{
                    required:true,
                    message:'合格数量'
                  }]
                })(<Input placeholder='请输入合格数量' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='报废数量'>
                {getFieldDecorator('scrapnum',{
                  rules: [{
                    required:true,
                    message:'报废数量'
                  }]
                })(<Input placeholder='请输入报废数量' />)}
              </FormItem>
            </Col>
          </Row>

        </Form>
      </Modal>
    );
  }
}

export default processModel;
