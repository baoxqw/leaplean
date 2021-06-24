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
      // 在这里可以做详细的处理
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
      const obj = {
        ...values,
        status:'初始状态',
        //materialId:selectedMaterialRowKeys[0]?selectedMaterialRowKeys[0]:'',
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

    // state 清空  这里state本来就是空的 在复杂的情况下会有
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
        title="编辑"
        destroyOnClose
        centered
        visible={visible}
        width={"80%"}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <div style={{height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='单据编号'>
                {getFieldDecorator('billcode',{
                  initialValue:initData?initData.billcode:''
                })(<Input placeholder='系统自动生成' disabled/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='检验状态'>
                {getFieldDecorator('state',{
                  initialValue:initData?initData.state:''
                })(<Input placeholder='检验状态' disabled/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              {/* <FormItem label='物料编码'>
                  {getFieldDecorator('materialId',{
                  })(<TreeTable
                    on={onMater}
                    data={datasMater}
                  />)}
                </FormItem>*/}
              <FormItem label='物料编码'>
                {getFieldDecorator('materialId',{
                  initialValue:initData?initData.materialId:''
                })(<Input placeholder='物料编码' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='物料名称'>
                {getFieldDecorator('matername',{
                  initialValue:initData?initData.matername:''
                })(<Input placeholder='选择物料编码，自动带出' disabled/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='型号'>
                {getFieldDecorator('modelId',{
                  initialValue:initData?initData.modelId:''
                })(<Input placeholder='型号' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工作令'>
                {getFieldDecorator('workId',{
                  initialValue:initData?initData.workId:''
                })(<Input placeholder='工作令' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工序号'>
                {getFieldDecorator('number',{
                  initialValue:initData?initData.number:''
                })(<Input placeholder='工序号'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工序名称'>
                {getFieldDecorator('processName',{
                  initialValue:initData?initData.processName:''
                })(<Input placeholder='工序名称' />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='送审人员'>
                {getFieldDecorator('submitPsnId',{
                  initialValue:initData?initData.submitPsnId:''
                })(<Input placeholder='送审人员' />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='检验人员'>
                {getFieldDecorator('inspectorsId',{
                  initialValue:initData?initData.inspectorsId:''
                })(<Input placeholder='检验人员'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='完工数量'>
                {getFieldDecorator('completed',{
                  initialValue:initData?initData.completed:''
                })(<Input placeholder='完工数量' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='合格数量'>
                {getFieldDecorator('qualified',{
                  initialValue:initData?initData.qualified:''
                })(<Input placeholder='合格数量' type={'number'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='不合格数量'>
                {getFieldDecorator('noQualified',{
                  initialValue:initData?initData.noQualified:''
                })(<Input placeholder='请输入不合格数量' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='派工单号'>
                {getFieldDecorator('dispatchNumber',{
                  initialValue:initData?initData.dispatchNumber:''
                })(<Input placeholder='请输入派工单号' type={'number'}/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='生产订单号'>
                {getFieldDecorator('productionNumber',{
                  initialValue:initData?initData.productionNumber:''
                })(<Input placeholder='请输入生产订单号' type={'number'}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='质量要求'>
                {getFieldDecorator('requorements',{
                  initialValue:initData?initData.requorements:''
                })(<Input placeholder='请输入质量要求'/>)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工艺路线'>
                {getFieldDecorator('craftId',{
                  initialValue:initData?initData.craftId:''
                })(<Input placeholder='请输入工艺路线'/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo',{
                  initialValue:initData?initData.memo:''
                })(<TextArea rows={3} placeholder='请输入备注'/>)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default UpdateSelf;
