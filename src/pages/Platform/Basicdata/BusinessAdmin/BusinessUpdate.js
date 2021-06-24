import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  message,
  Col,
  Row,
  Input,
  Select, Tree, Modal, TreeSelect,
} from 'antd';
import { connect } from 'dva';
import { toTree } from '@/pages/tool/ToTree';


const { TreeNode } = Tree;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ businessadmin, loading }) => ({
  businessadmin,
  submitting: loading.effects['businessadmin/add'],
}))

@Form.create()
class BusinessUpdate extends PureComponent {
  state = {
    areaclValues:[],
    areaclId:null,
    areaclName:'',
    buttonStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;
      this.setState({
        areaclName:record.areaclname,
        areaclId:record.areaclid
      })
    }
  }

  handleOk = (onOk)=>{
    const { form,data:{record} } = this.props;
    const { areaclId,buttonStatus } = this.state;
    this.setState({
      buttonStatus:true
    })
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
          id:record.id,
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
          <TreeNode defaultExpandAll title={item.name} key={item.key} value={item.id}  dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.key} value={item.id} dataRef={item}/>;
    });

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      dispatch,
      form,
      data,
      on
    } = this.props;

    const { visible,loading,record } = data;
    const { onOk,onCancel } = on;

    return (
      <Modal
        title="客商编辑"
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
                  initialValue:record.code?record.code:'',
                  rules: [{ required: true, message: '请输入客商编码'}],
                })(<Input placeholder='请输入客商编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='客商名称'>
                {form.getFieldDecorator('name', {
                  initialValue:record.name?record.name:'',
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
                  initialValue:record.shortname?record.shortname:'',
                  rules: [{ required: true, message: '请输入简称'}],
                })(
                  <Input placeholder='请输入简称' />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='客商类型'>
                {form.getFieldDecorator('custtype', {
                  initialValue:record.custtype,
                  rules: [{ required: true, message: '请选择客商类型'}],
                })(
                  <Select placeholder='请选择客商属性' style={{width:'100%'}}>
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
                  initialValue:record.phone?record.phone:'',
                  rules: [{ required: true, message: '请输入电话'}],
                })(<Input placeholder='请输入电话' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='网址'>
                {form.getFieldDecorator('website', {
                  initialValue:record.website?record.website:'',
                })(<Input placeholder='请输入网址'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='等级'>
                {form.getFieldDecorator('custlevel', {
                  initialValue:record.custlevel?record.custlevel:'',
                  rules: [{ required: true, message: '请输入等级'}],
                })(<Input placeholder='请输入等级' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='法人姓名'>
                {form.getFieldDecorator('respsnname', {
                  initialValue:record.respsnname?record.respsnname:'',
                  rules: [{ required: true, message: '请输入法人姓名'}],
                })(<Input placeholder='请输入法人姓名' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='地址'>
                {form.getFieldDecorator('address', {
                  initialValue:record.address?record.address:'',
                })(<Input placeholder='请输入地址'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='邮编'>
                {form.getFieldDecorator('zipcode', {
                  initialValue:record.zipcode?record.zipcode:'',
                })(<Input placeholder='请输入邮编' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='统一社会信用代码'>
                {form.getFieldDecorator('uscc', {
                  initialValue:record.uscc?record.uscc:'',
                  rules: [{ required: true, message: '请输入统一社会信用代码'}],
                })(<Input placeholder='请输入统一社会信用代码' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='注册资本'>
                {form.getFieldDecorator('regmoney', {
                  initialValue:record.regmoney?record.regmoney:'',
                })(<Input placeholder='请输入注册资本' type="number"/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label={"备注"}>
                {getFieldDecorator('memo',{
                  initialValue:record.memo?record.memo:'',
                })(<TextArea placeholder={'请输入备注'}/>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default BusinessUpdate;
