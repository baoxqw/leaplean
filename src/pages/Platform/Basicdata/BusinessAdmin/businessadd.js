import React, { PureComponent } from 'react';
import {
  Button,
  Form,
  Col,
  Row,
  Input,
  Select, Modal, TreeSelect,
} from 'antd';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import { toTree } from '@/pages/tool/ToTree';

const { TreeNode } = TreeSelect;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ businessadmin, loading }) => ({
  businessadmin,
  submitting: loading.effects['businessadmin/add'],
}))
@Form.create()
class BusinessAdd extends PureComponent {
  state = {
    areaclValues:[],
    areaclId:null,
    areaclName:''
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;
      this.setState({
        areaclId: record.id,
        areaclName: record.name
      })
    }
  }

  handleOk = (onOk)=>{
    const { form } = this.props;
    const { areaclId,buttonStatus } = this.state;
    if(buttonStatus){
      return
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if(err){
        return
      }
      const obj = {
        reqData:{
          ...fieldsValue,
          areaclid:areaclId,
          custlevel:fieldsValue.custlevel?Number(fieldsValue.custlevel):null,
          regmoney:fieldsValue.regmoney?Number(fieldsValue.regmoney):null,
        }
      };
      this.setState({
        buttonStatus:true
      })
      onOk(obj,this.clear);
    })
  }

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

  clear = (status)=> {
    if(status){
      this.setState({
        buttonStatus:false
      })
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      areaclValues:[],
      areaclId:null,
      areaclName:'',
      buttonStatus:false
    })
  }

  onFocuSareacl = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessadmin/tree',
      payload: {
        reqData: {},
      },
      callback: (res) => {
        const a = toTree(res.resData);
        this.setState({
          areaclValues: a,
        });
      },
    });
  };

  onChangSareacl = (value) => {
    this.setState({
      areaclId: value,
    });
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

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      form,
      on,
      data,
      userLoading
    } = this.props;

    const { visible,loading,record } = data;
    const { onOk,onCancel } = on;

    return (
      <Modal
        title="客商新建"
        destroyOnClose
        centered
        visible={visible}
        width='76%'
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='客商编码'>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入客商编码'}],
                })(<Input placeholder='请输入客商编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='客商名称'>
                {form.getFieldDecorator('name', {
                  rules: [{ required: true, message:'请输入客商名称' }],
                })(<Input placeholder='请输入客商名称' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='所属地区'>
                {form.getFieldDecorator('areaclName', {
                  initialValue:this.state.areaclName,
                  rules: [{ required: true, message: '请选择所属地区'}],
                })(
                  <TreeSelect
                    treeDefaultExpandAll
                    style={{ width: '100%' }}
                    onFocus={this.onFocuSareacl}
                    onChange={this.onChangSareacl}
                    placeholder="请选择所属地区"
                  >
                    {this.renderTreeNodes(this.state.areaclValues)}
                  </TreeSelect >
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='简称'>
                {form.getFieldDecorator('shortname', {
                  rules: [{ required: true, message: '简称'}],
                })(
                  <Input placeholder='请输入简称' />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='客商类型'>
                {form.getFieldDecorator('custtype', {
                  rules: [{ required: true, message: '客商类型'}],
                })(
                  <Select placeholder='请选择客商类型'  style={{ width: '100%' }}>
                    <Option value={'1'}>客商</Option>
                    <Option value={'2'}>客户</Option>
                    <Option value={'3'}>供应商</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='电话'>
                {form.getFieldDecorator('phone',{
                  rules: [{ required: true, message: '请输入电话'}],
                })(<Input placeholder='请输入电话' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='网址'>
                {form.getFieldDecorator('website', {
                })(<Input placeholder='请输入网址'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='等级'>
                {form.getFieldDecorator('custlevel', {
                  rules: [{ required: true, message: '等级'}],
                })(<Input placeholder='请输入等级' type='number'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='法人姓名'>
                {form.getFieldDecorator('respsnname', {
                  rules: [{ required: true, message: '法人姓名'}],
                })(<Input placeholder='请输入法人姓名' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='地址'>
                {form.getFieldDecorator('address', {
                })(<Input placeholder='请输入地址'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='邮编'>
                {form.getFieldDecorator('zipcode', {
                })(<Input placeholder='请输入邮编' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='统一社会信用代码'>
                {form.getFieldDecorator('uscc', {
                  rules: [{ required: true, message: '请输入统一社会信用代码'}],
                })(<Input placeholder='请输入统一社会信用代码' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='注册资本'>
                {form.getFieldDecorator('regmoney', {
                })(<Input placeholder='请输入注册资本' type="number"/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label={"备注"}>
                {getFieldDecorator('memo')(<TextArea placeholder={"请输入备注"}/>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default BusinessAdd;
