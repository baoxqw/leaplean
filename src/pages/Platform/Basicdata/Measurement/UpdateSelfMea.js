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
  Select, Button,
} from 'antd';

const FormItem = Form.Item;

@connect(({ measure, loading }) => ({
  measure,
  loading: loading.models.measure,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
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
         dimension:values.dimension,
         conversionrate:values.conversionrate,
         basecodeflag:values.basecodeflag?1:0,
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
      initData:{},
      BStatus:false
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
          title="计量单位编辑"
          destroyOnClose
          centered
          visible={visible}
          width={"80%"}
          onCancel={()=>this.handleCancel(onCancel)}
          footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
            <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
        >
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='编号'>
                  {getFieldDecorator('code',{
                    initialValue:record.code?record.code:'',
                    rules:[{
                      required:true,
                      message:'编号'
                    }]
                  })(<Input placeholder='编号'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='名称'>
                  {getFieldDecorator('name',{
                    initialValue:record.name?record.name:'',
                    rules: [{
                      required:true,
                      message:'名称'
                    }]
                  })(<Input placeholder='请输入名称'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='换算率'>
                  {getFieldDecorator('conversionrate',{
                    initialValue:record.conversionrate?record.conversionrate:'',
                    rules: [{
                      required:true,
                      message:'换算率'
                    }]
                  })(<Input placeholder='请输入换算率'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='所属量纲'>
                  {getFieldDecorator('dimension',{
                    initialValue:record.dimension?record.dimension:'',
                    rules: [{
                      required:true,
                      message:'所属量纲'
                    }]
                  })(<Input placeholder='请输入所属量纲'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='是否基本计量单位'>
                  {getFieldDecorator('basecodeflag',{
                    initialValue:initData.basecodeflag,
                    valuePropName:"checked",
                  })(<Checkbox />)}
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

export default UpdateSelfMea;
