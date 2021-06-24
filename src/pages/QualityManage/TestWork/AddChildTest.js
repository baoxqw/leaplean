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
  Checkbox,
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
@connect(({ overtask, loading }) => ({
  overtask,
  loading: loading.models.overtask,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class AddChildOver extends PureComponent {
  state = {

  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
     const obj = {
       ...values,
       isProcess:values.isProcess?1:0,
       processTemp:values.processTemp?Number(values.processTemp):'',
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
      //deptId:[],
      //deptTreeValue:[],
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible } = data
    const { onOk,onCancel } = on
    return (
        <Modal
          title="测试数据新建"
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
                <FormItem label='序列号'>
                  {getFieldDecorator('number',{
                  })(<Input placeholder='请输入序列号'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='样式名称'>
                  {getFieldDecorator('styleName',{
                  })(<Input placeholder='请输入样式名称'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='材料编码'>
                  {getFieldDecorator('materialId',{
                  })(<Input placeholder='请输入材料编码'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='测试项目'>
                  {getFieldDecorator('testProjectId',{
                  })(<Input placeholder='请输入测试项目'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='测试标准'>
                  {getFieldDecorator('standard',{
                  })(<Input placeholder='请输入测试标准'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='指标要求'>
                  {getFieldDecorator('indicator',{
                  })(<Input placeholder='请输入指标要求'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工艺测试温度'>
                  {getFieldDecorator('processTemp',{
                  })(<Input placeholder='请输入工艺测试温度' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='是否完全工艺备注'>
                  {getFieldDecorator('isProcess',{
                    valuePropName:"checked",
                  })(<Checkbox></Checkbox>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                  })(<TextArea rows={3} placeholder='请输入备注'/>)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default AddChildOver;
