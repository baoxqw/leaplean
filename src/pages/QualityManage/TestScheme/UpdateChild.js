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
class UpdateChild extends PureComponent {
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
        id:initData.id,
        qaExamineId:initData.qaExamineId
      }
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
      deptId:[],
      deptTreeValue:[],
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
        title="子表编辑"
        Modal
        destroyOnClose
        visible={visible}
        width="80%"
        centered
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='序号'>
                {getFieldDecorator('number', {
                  initialValue:initData.number?initData.number:null,
                })(<Input placeholder="请输入序号" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='检验编号'>
                {getFieldDecorator('code', {
                  initialValue:initData.code?initData.code:'',
                  rules: [
                    {
                      required: true,
                      message:'请输入检验编号'
                    }
                  ],
                })(<Input placeholder="请输入检验编号" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='检验项目名称'>
                {getFieldDecorator('name', {
                  initialValue:initData.name?initData.name:'',
                  rules: [
                    {
                      required: true,
                      message:'请输入检验项目名称'
                    }
                  ],
                })(<Input placeholder="请输入检验项目名称" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='检验要求'>
                {getFieldDecorator('claim', {
                  initialValue:initData.claim?initData.claim:'',
                })(<Input placeholder="请输入检验要求" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='检验项目类型'>
                {getFieldDecorator('projectType', {
                  initialValue:initData.projectType
                })(<Select placeholder='请选择检验项目类型' style={{width:"100%"}}>
                  <Option value={0}>人工校验</Option>
                  <Option value={1}>机械校验</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='检验方法'>
                {getFieldDecorator('method', {
                  initialValue:initData.method
                })(<Select placeholder='请选择检验方法' style={{width:"100%"}}>
                  <Option value={0}>全检</Option>
                  <Option value={1}>抽检</Option>
                </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='标准值'>
                {getFieldDecorator('standard', {
                  initialValue:initData.standard?initData.standard:null,
                })(<Input placeholder="请输入标准值" type='number' max={99}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='上下平均值'>
                {getFieldDecorator('average', {
                  initialValue:initData.average?initData.average:null,
                })(<Input placeholder="请输入上下平均值" type='number' max={99}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='下界'>
                {getFieldDecorator('boundary', {
                  initialValue:initData.boundary?initData.boundary:null,
                })(<Input placeholder="请输入标准值" type='number' max={99}/>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateChild;
