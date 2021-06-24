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
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';

import router from 'umi/router';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ testS, loading }) => ({
  testS,
  loading: loading.models.testS,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class UpdateSelf extends PureComponent {
  state = {
    initData:{}
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record.id !== this.props.data.record.id){
      this.setState({
        initData:nextProps.data.record
      })
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const { initData } = this.state;
      const obj = {
        ...values,
        id:initData.id
      };
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = ()=> {
    const { form } = this.props;
    form.resetFields();
    this.setState({
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
    const { visible } = data;
    const { onOk,onCancel } = on;
    const { initData } = this.state;
    return (
      <Modal
        title="编辑"
        Modal
        destroyOnClose
        visible={visible}
        width={"80%"}
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col  lg={{ span: 6}} md={{ span: 12 }} sm={24}>
              <FormItem label='方案编码'>
                {getFieldDecorator('code',{
                  initialValue:initData.code?initData.code:'',
                  rules: [
                    {
                      required: true,
                      message:'请输入方案编码'
                    }
                  ],
                })(<Input placeholder='请输入方案编码'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='方案名称'>
                {getFieldDecorator('name',{
                  initialValue:initData.name?initData.name:'',
                  rules: [
                    {
                      required: true,
                      message:'请输入方案名称'
                    }
                  ],
                })(<Input placeholder='请输入方案名称'/>)}
              </FormItem>
            </Col>
            <Col  xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
              <FormItem label='检验方法'>
                {getFieldDecorator('method',{
                  initialValue:initData.method,
                })(<Select placeholder='请选择检验方法'>
                  <Option value={0}>全检</Option>
                  <Option value={1}>抽检</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否体现'>
                {getFieldDecorator('incarnate',{
                  initialValue:initData.incarnate
                })(<Select  placeholder='请选择是否体现'>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo',{
                  initialValue:initData.memo?initData.memo:'',
                })(<TextArea rows={3} placeholder='请输入备注'/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateSelf;
