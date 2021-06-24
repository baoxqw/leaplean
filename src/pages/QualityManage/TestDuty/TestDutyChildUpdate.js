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
  message,
  Checkbox,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';

import router from 'umi/router';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ testduty, loading }) => ({
  testduty,
  loading:loading.models.testduty,
  loadingList:loading.effects['testduty/fetchList'],
}))
@Form.create()
class TestDutyChildUpdate extends PureComponent {
  state = {
    initData:{}
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record.id !== this.props.data.record.id){
      // 在这里可以做详细的处理
      this.setState({
        initData:nextProps.data.record
      })
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { initData } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        id:initData.id,
        number:values.number?Number(values.number):null,
        ambientTemperature:values.ambientTemperature,
        ambientHumidity:values.ambientHumidity,
        isAmt:values.isAmt?1:0,
        memo:values.memo
      }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = () =>{ //在这里面写清除
    const { form } = this.props;
    //清空输入框
    form.resetFields();

    this.setState({
      initData:{}
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible } = data;
    const { onOk,onCancel } = on;
    const { initData } = this.state;
    return (
      <Modal
        title="检验数据"
        destroyOnClose
        centered
        visible={visible}
        width={"80%"}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="湿度">
              {getFieldDecorator('ambientHumidity',{
                initialValue:initData.ambientHumidity?initData.ambientHumidity:'',
                rules: [{
                  required: true,
                  message:'请输入湿度'
                }],
              })(
                <Input placeholder="请输入湿度" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="环境温度">
              {getFieldDecorator('ambientTemperature',{
                initialValue:initData.ambientTemperature?initData.ambientTemperature:''
              })(
                <Input placeholder="请输入环境温度" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="是否默认环境温度">
              {getFieldDecorator('isAmt',{
                valuePropName:"checked",
                initialValue:initData.isAmt
              })( <Checkbox />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
                initialValue:initData.memo?initData.memo:''
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default TestDutyChildUpdate;
