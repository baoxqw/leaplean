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

@connect(({ DC,pd, loading }) => ({
  DC,
  pd,
  loading: loading.models.DC,
}))
@Form.create()
class DeviceCardUpdateChild extends PureComponent {
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
      type: 'DC/newdatasss',
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

  taxrateChange = (e)=>{
    const { form } = this.props;
    const claimingamount = form.getFieldValue("claimingamount");
    const taxrate = e.target.value;
    if(claimingamount){
      form.setFieldsValue({
        taxamount:claimingamount * taxrate
      })
    }
  };

  claimingChange = (e)=>{
    const { form } = this.props;
    const taxrate = form.getFieldValue("taxrate");
    const claimingamount = e.target.value;
    if(taxrate){
      form.setFieldsValue({
        taxamount:claimingamount * taxrate
      })
    }
  };


  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
      loadingChild
    } = this.props;
    const { visible,childdata } = data;
    const { onOk,handleCancel } = on;
    return (
      <Modal
        title={"子表编辑"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSubmit(onOk)}
        onCancel={()=>this.handleCancel(handleCancel)}
      >
        <div style={{padding:'0 24px',height:document.body.clientHeight/1.5,overflow:"auto"}}>
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='保养项目编码'>
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message:'保养项目编码'
                      }
                    ],
                    initialValue:childdata.code?childdata.code:''
                  })(
                    <Input placeholder={"保养项目编码"}/>
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='保养部位'>
                  {getFieldDecorator('position', {
                    rules: [
                      {
                        required: true,
                        message:'请输入保养部位'
                      }
                    ],
                    initialValue:childdata.position?childdata.position:''
                  })( <Input placeholder={"请输入保养部位"}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='保养内容'>
                  {getFieldDecorator('content', {
                    rules: [
                      {
                        required: true,
                        message:'请输入保养内容'
                      }
                    ],
                    initialValue:childdata.content?childdata.content:''
                  })( <Input placeholder={"请输入保养内容"}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='要求'>
                  {getFieldDecorator('request', {
                    initialValue:childdata.request?childdata.request:''
                  })(<Input placeholder={"请输入要求"}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='周期'>
                  {getFieldDecorator('cycle', {
                    initialValue:childdata.cycle?childdata.cycle:''
                  })(<Select  style={{ width: '100%' }} >
                    <Option value="1个月">1个月</Option>
                    <Option value="6个月">6个月</Option>
                    <Option value="12个月">
                      12个月
                    </Option>
                    <Option value="Yiminghe">yiminghe</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default DeviceCardUpdateChild;
