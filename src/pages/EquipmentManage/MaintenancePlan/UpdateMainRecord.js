import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  TreeSelect,
  Modal,
  Row,
  Checkbox,
  Spin,
  Col,
  message,
  Upload,
  Icon,
} from 'antd';
import { toTree } from '@/pages/tool/ToTree';
const { TreeNode } = TreeSelect;

const dataAddKey = (data) => {
  return data.map((item) => {
    item.key = item.id;
    if (item.children) {
      dataAddKey(item.children);
    }
    return item;
  });
};

@connect(({ MP,pd, loading }) => ({
  MP,
  pd,
  loading: loading.models.MP,
}))
@Form.create()
class UpdateMainRecord extends PureComponent {
  state = {
    costsubjId:null,
    costsubjName:null,
    costsubjTreeValue:[],

    char:["长途","汽车","火车","高铁","飞机"],

    dis:true,
    fileList: [],
    fileListTicket:[],
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} value={item.id}  dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item}/>;
    });

  onFocusDepartment = () => {
    const { dispatch } = this.props;
   
    dispatch({
      type: 'MP/newdatasss',
      payload: {
        reqData: {},
      },
      callback: (res) => {
       
        if(res && res.resData){
          const a = toTree(res.resData);
          this.setState({
            costsubjTreeValue: a,
          });
        }
      },
    });
  };

  onChangDepartment = (value, label, extra) => {
    const { char } = this.state;
    let status = true;
    char.map(item =>{
      if(item === label[0]){
        status = false
      }
    });
    this.setState({
      costsubjId: value,
      dis:status
    });
  };

  onSubmit = (onOk,type)=>{
    const { form } = this.props;
    form.validateFields((err, values) => {
      if(err) return;
      if(typeof onOk === 'function'){
        // onOk(obj,type,this.handleCancel)
        onOk(values,this.handleCancel)
      }
    })
  }

  handleCancel = (handleCancel)=>{
    if(typeof handleCancel === 'function'){
      handleCancel()
    }
    const { form } = this.props;
    form.resetFields();
  }



  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
      loadingChild
    } = this.props;
    const { visible,initData } = data;
    const { onOk,handleCancel } = on;
    return (
      <Modal
        title={"编辑维修记录"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSubmit(onOk)}
        onCancel={()=>this.handleCancel(handleCancel)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="项目编号">
                {getFieldDecorator('code',{
                  initialValue:initData.code?initData.code:'',
                  rules: [{required: true,message:'项目编号'}]
                })(<Input placeholder="请输入项目编号" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="维护内容">
                {getFieldDecorator('content',{
                  initialValue:initData.content?initData.content:'',
                  rules: [{required: true,message:'维护内容'}]
                })(<Input placeholder="请输入维护内容" />)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="维护部位">
                {getFieldDecorator('position',{
                  initialValue:initData.position?initData.position:'',
                  rules: [{required: true,message:'请选择维护部位'}],
                })(<Input placeholder="请输入维护部位" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="要求">
                {getFieldDecorator('request',{
                  initialValue:initData.request?initData.request:'',
                  rules: [{required: true,message:'要求'}]
                })(<Input placeholder="请输入要求" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='周期'>
                {getFieldDecorator('cycle', {
                  initialValue:initData.cycle?initData.cycle:'',
                })(<Select  style={{ width: '100%' }} placeholder='请选择周期' >
                  <Option value="1个月">1个月</Option>
                  <Option value="6个月">6个月</Option>
                  <Option value="12个月">
                    12个月
                  </Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
              <Form.Item label="维护记录">
                {getFieldDecorator('record',{
                  initialValue:initData.record?initData.record:'',
                  rules: [{required: true,message:'请选择维护记录'}],
                })(<Input placeholder="请输入维护记录" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否合格">
                {getFieldDecorator('iseligible',{
                  initialValue:initData.record?initData.record:'',
                  //rules: [{required: true,message:'要求'}]
                })(<Checkbox></Checkbox>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </Modal>
    );
  }
}

export default UpdateMainRecord;
