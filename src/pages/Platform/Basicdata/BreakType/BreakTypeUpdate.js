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
const { TextArea } = Input;
const { Option } = Select;
@connect(({ measure, loading }) => ({
  measure,
  loading: loading.models.measure,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class UpdateSelfMea extends PureComponent {
  state = {
    BStatus:false,
    initData:{}

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
         id:record.id,
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
    const {initData } = this.state
    const { visible,record } = data;
    const { onOk,onCancel } = on;
    return (
        <Modal
          title="编辑"
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
                    initialValue:record.code?record.code:'',
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
                    initialValue:record.name?record.name:'',
                    rules: [{
                      required:true,
                      message:'设备故障类型名称'
                    }]
                  })(<Input placeholder='设备故障类型名称'/>)}
                </FormItem>
              </Col>

            </Row>

          </Form>
        </Modal>
    );
  }
}

export default UpdateSelfMea;
