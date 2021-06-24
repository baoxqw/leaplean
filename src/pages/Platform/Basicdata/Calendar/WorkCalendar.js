import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Modal,
  TimePicker
} from 'antd';
import moment from 'moment';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ calendar,loading }) => ({
  calendar,
  loading:loading.models.calendar
}))
@Form.create()
class WorkCalendar extends PureComponent {
  state = {
    dataTree:[],

    holidayclId:null,
  };

  handleOk = (onOk)=>{
    const { form,data } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      const { record } = data;
      const obj = {
        id:record.id?record.id:null,
        workcalendarId:record.workcalendarId,
        offdutytime:values.offdutytime?values.offdutytime.format('HH:mm:ss'):'',
        ondutytime:values.ondutytime?values.ondutytime.format('HH:mm:ss'):'',
        datetype:values.datetype,
        calendardate:values.calendardate?values.calendardate.format('YYYY-MM-DD'):'',
        memo:values.memo
      }
      if(typeof onOk === 'function'){
        onOk(obj,this.clear)
      }
    })
  }

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  }

  clear = ()=>{
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on
    } = this.props;
    const { visible,record } = data;
    const { onOk,onCancel } = on;

    return (
      <Modal
        title="工作日历明细"
        destroyOnClose
        width={'80%'}
        visible={visible}
        onOk={()=>this.handleOk(onOk)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="日历日期">
              {getFieldDecorator('calendardate',{
                rules: [{required: true}],
                initialValue:record.calendardate?moment(record.calendardate):null
              })(<DatePicker placeholder="请选择日历日期" style={{width:'100%'}} disabled/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="上班时间">
              {getFieldDecorator('ondutytime',{
                rules: [{required: true}],
                initialValue: record.ondutytime?moment(record.ondutytime, 'HH:mm:ss'):null
              })(
                <TimePicker placeholder="请选择上班时间" style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="下班时间">
              {getFieldDecorator('offdutytime',{
                rules: [{ required: true} ],
                initialValue: record.offdutytime?moment(record.offdutytime, 'HH:mm:ss'):null
              })(
                <TimePicker placeholder="请选择下班时间" style={{width:'100%'}}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="日期类型">
              {getFieldDecorator('datetype',{
                rules: [{required: true}],
                initialValue:record.datetype
              })(<Select placeholder="请选择日历日期" style={{width:'100%'}}>
                <Option value={0}>工作日</Option>
                <Option value={1}>公休日</Option>
                <Option value={2}>节假日</Option>
              </Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo',{
                initialValue:record.memo
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default WorkCalendar;

