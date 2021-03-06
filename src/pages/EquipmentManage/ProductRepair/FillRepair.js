import React, { Fragment, PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Checkbox,
  Divider,
  Popconfirm,
  Modal,
  message,
  TreeSelect,
} from 'antd';
import NormalTable from '@/components/NormalTable';

import BraftEditor from 'braft-editor';
import { formatMessage, FormattedMessage } from 'umi/locale';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';

const { TextArea } = Input;

@connect(({ EMA, loading }) => ({
  EMA,
  loading: loading.models.EMA,
}))
@Form.create()
class FillRepair extends PureComponent {
  state = {
    initdata:null,
    pieceData:[],
    addRepairPieceVisible:false,
    updateRepairPieceVisible:false,
    updateRepairPieceSource:{},
    page:{
      pageSize:10,
      pageIndex:0
    },
  };

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps){
    const { dispatch } = this.props;
    const { page } = this.state;
    if(nextProps.data.record !== this.props.data.record){
      const initData = nextProps.data.record;
      const pieceData = nextProps.data.pieceData;
      this.setState({
        initdata:initData,
        pieceData,
      })
    }
  }

  onOk = (onOk)=>{
    const { form,data} = this.props;
    const { initdata } = data
    form.validateFields((err, fieldsValue) => {
      const obj ={
        ...fieldsValue,
        starttime:fieldsValue['starttime'].format('YYYY-MM-DD HH:mm:ss'),
        endtime:fieldsValue['endtime'].format('YYYY-MM-DD HH:mm:ss'),
        startpause:fieldsValue['startpause'].format('YYYY-MM-DD HH:mm:ss'),
        endpause:fieldsValue['endpause'].format('YYYY-MM-DD HH:mm:ss'),
        isextension:fieldsValue['isextension']?1:0,
        ishours:fieldsValue['ishours']?1:0,

      }
      onOk(obj)
    })

  }

  handleCancel = (onCancle)=>{
    const { form} = this.props;
    form.resetFields()
    onCancle()
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      on,
      data,
    } = this.props;
    const { initdata,} = this.state;

    const { onOk,onCancle } = on

    const { visible } = data;

    return (
      <Modal
        title={"???????????????"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onOk(onOk)}
        onCancel={()=>this.handleCancel(onCancle)}
      >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('code', {
                    initialValue:initdata?initdata.billcode:''
                  })(<Input placeholder='????????????' disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('faultTypeId', {
                    initialValue:initdata?initdata.faultTypeId:''
                  })(<Input placeholder='????????????' disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('spec', {
                    initialValue:initdata?initdata.spec:''
                  })(<Input placeholder='?????????????????????'  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('equi', {
                    initialValue:initdata?initdata.equi:''
                  })(<Input placeholder='????????????' disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('equiname', {
                    initialValue:initdata?initdata.equiname:''
                  })(<Input placeholder='????????????' disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('size', {
                    initialValue:initdata?initdata.size:''
                  })(<Input placeholder='????????????' disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='??????????????????'>
                  {getFieldDecorator('starttime', {
                    rules: [{
                      required: true,
                      message:'???????????????????????????'
                    }],
                  })( <DatePicker showTime style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='??????????????????'>
                  {getFieldDecorator('endtime', {
                    rules: [{
                      required: true,
                      message:'???????????????????????????'
                    }],
                  })( <DatePicker showTime style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????????????????(??????)'>
                  {getFieldDecorator('ishours', {
                    valuePropName:"checked"
                  })(<Checkbox></Checkbox>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='??????????????????'>
                  {getFieldDecorator('startpause', {
                    rules: [{
                      required: true,
                      message:'???????????????????????????'
                    }],
                  })( <DatePicker showTime style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='??????????????????'>
                  {getFieldDecorator('endpause', {
                    rules: [{
                      required: true,
                      message:'???????????????????????????'
                    }],
                  })( <DatePicker showTime style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????(??????)'>
                  {getFieldDecorator('parkinghours', {

                  })(<Input placeholder='??????????????????' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='???????????????'>
                  {getFieldDecorator('businessId', {
                  })( <Input/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('isextension', {
                    valuePropName:"checked"
                  })( <Checkbox ></Checkbox>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label='??????'>
                  {getFieldDecorator('memo', {
                  })( <TextArea rows={3} placeholder={'???????????????'}/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
      </Modal>
    );
  }
}

export default FillRepair;
