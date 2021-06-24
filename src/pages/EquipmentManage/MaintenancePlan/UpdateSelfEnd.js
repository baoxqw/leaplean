import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
  Checkbox,
  TreeSelect,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';
import moment from 'moment'
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ MP,loading }) => ({
  MP,
  loading:loading.models.MP
}))
@Form.create()
class UpdateChild extends PureComponent {
  state = {
    BStatus:false,
    initData:null,
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const initData = nextProps.data.record;
     
      this.setState({
        initData:nextProps.data.record,
      })
    }
  }
  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus,initData } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        reqData:{
          id:initData.id,
          maintenanceplanMaintainId:initData.maintenanceplanMaintainId,
          maintainAnnal:values.maintainAnnal,
          maintainDate:values.maintainDate?(values.maintainDate).format('YYYY-MM-DD'):null,
          eligible:values.eligible?1:0,

        }

      };
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

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
      TreeOperationData:[],//人员
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],

      departmentId:[],//部门
      departmentTreeValue:[],
      departmentName:'',
      initData:{},
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on
    } = this.props;
    const { initData } = this.state
    const { visible } = data;
    const { onSave,onCancel } = on;

    return (
      <Modal
        title={"编辑"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="保养时间">
              {getFieldDecorator('maintainDate',{
                initialValue:initData?moment(initData.maintainDate):null,
              })(
                <DatePicker style={{width:'100%'}} />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="保养记录">
              {getFieldDecorator('maintainAnnal',{
                initialValue: initData?initData.maintainAnnal:''
              })(
                <Input placeholder={'保养记录'}/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label='是否合格 '>
              {getFieldDecorator('eligible', {
                initialValue: initData?initData.eligible:'',
                valuePropName:"checked"
              })(<Checkbox/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default UpdateChild;

