import React, { PureComponent } from 'react';
import {
  Modal,
  Form,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Button,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import TableModelTable from '@/pages/tool/TableModelTable';
import { toTree } from '@/pages/tool/ToTree';
const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;
@connect(({ personal, loading }) => ({
  personal,
  submitting: loading.effects['personal/add'],
  userLoading: loading.effects['personal/fetchPerson']
}))
@Form.create()
class PersonalFileupdate extends PureComponent {
  state = {
    SelectValue:[],
    selectedRowKeys:[],

    deptValues:[],
    deptId:null,
    deptName:'',

    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;
      this.setState({
        selectedRowKeys: [record.userId],
        SelectValue: record.username,
        deptName:record.deptname,
        deptId:record.deptId
      })
    }
  }

  handleOk = (onOk)=>{
    const { form,data:{record} } = this.props;
    const { selectedRowKeys,deptId,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if(err){
        return
      }
      const obj = {
        reqData:{
          ...fieldsValue,
          dept_id:deptId,
          birthdate: fieldsValue.birthdate?fieldsValue.birthdate.format('YYYY-MM-DD'):'',
          user_id:selectedRowKeys.length?this.state.selectedRowKeys[0]:null,
          id:record.id
        }
      };
      this.setState({
        BStatus:true
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
        BStatus:false
      })
      return;
    }
    const { form,data:{ record } } = this.props;
    form.resetFields();
    this.setState({
      SelectValue:[],
      selectedRowKeys:[],

      deptValues:[],
      deptName:record.deptname,
      deptId:record.deptId,
      BStatus:false
    })
  }

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
      type: 'personal/queryDept',
      payload: {
        reqData: {},
      },
      callback: (res) => {
        const a = toTree(res.resData);
        this.setState({
          deptValues: a,
        });
      },
    });
  };

  onChangDepartment = (value) => {
    this.setState({
      deptId: value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      dispatch,
      form,
      data,
      userLoading,
      on
    } = this.props;

    const { visible,loading,record } = data;
    const { onOk,onCancel } = on;

    const ons = {
      onOk:(selectedRowKeys,selectedRows)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        this.setState({
          SelectValue:nameList,
          selectedRowKeys,
        })
      }, //????????????????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectValue:[],
          selectedRowKeys:[],
        })
      },
    };
    const datas = {
      SelectValue:this.state.SelectValue, //??????????????????
      selectedRowKeys:this.state.selectedRowKeys, //?????????????????????
      placeholder:'??????????????????',
      columns:[
        {
          title: '????????????',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
          key: 'name',

        },
        {
          title: '',
          dataIndex: 'caozuo',
          key: 'caozuo',
          width:100
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title:'???????????????',
      tableType:'personal/fetchPerson',
      tableLoading:userLoading
    }

    return (
      <Modal
        title="????????????"
        destroyOnClose
        centered
        visible={visible}
        width='76%'
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>??????</Button>]
        }
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('code', {
                  initialValue:record.code?record.code:'',
                  rules: [{ required: true, message: '?????????????????????'}],
                })(<Input placeholder='?????????????????????' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='??????'>
                {form.getFieldDecorator('name', {
                  initialValue:record.name?record.name:'',
                  rules: [{ required: true, message:'?????????????????????' }],
                })(<Input placeholder='?????????????????????' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='?????????'>
                {form.getFieldDecorator('usedname', {
                  initialValue:record.usedname?record.usedname:'',
                  // rules: [{ required: true, message:'?????????' }],
                })(<Input placeholder='??????????????????' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='???????????????'>
                {getFieldDecorator('urgpsn', {
                  initialValue:record.urgpsn?record.urgpsn:'',
                  // rules: [{ required: true, message: '???????????????'}],
                })(<Input placeholder='????????????????????????' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='??????????????????'>
                {form.getFieldDecorator('urgphone', {
                  initialValue:record.urgphone?record.urgphone:'',
                  // rules: [{ required: true, message:'??????????????????' }],
                })(<Input placeholder='???????????????????????????' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='?????????'>
                {form.getFieldDecorator('mobile', {
                  initialValue:record.mobile?record.mobile:'',
                  rules: [
                    { required: true, message:'??????????????????' },
                    {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '????????????????????????',
                    },
                  ],
                })(<Input placeholder='??????????????????' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='??????'>
                {form.getFieldDecorator('dept_id', {
                  initialValue:record.deptname?record.deptname:'',
                  rules: [{ required: true, message:'???????????????' }],
                })(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="???????????????"
                >
                  {this.renderTreeNodes(this.state.deptValues)}
                </TreeSelect >)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='??????'>
                {form.getFieldDecorator('phone', {
                  initialValue:record.phone?record.phone:'',
                  // rules: [{ required: true, message:'??????' }],
                })(<Input placeholder='???????????????' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='email'>
                {form.getFieldDecorator('email', {
                  initialValue:record.email?record.email:'',
                  rules: [
                    { required: true, message:'email' },
                    {
                      pattern: /^[a-z0-9][\w\-\.]{2,29}@[a-z0-9\-]{2,67}(\.[a-z\u2E80-\u9FFF]{2,6})+$/,
                      message: '?????????????????????',
                    },
                  ],
                })(<Input placeholder='?????????email' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='??????'>
                {form.getFieldDecorator('birthdate', {
                  initialValue:record.birthdate?moment(record.birthdate):null,
                  rules: [{ required: true, message:'???????????????' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="???????????????" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='??????'>
                {form.getFieldDecorator('sex', {
                  initialValue:record.sex,
                  rules: [{ required: true,message:'??????'}],
                })(<Select placeholder='???????????????' style={{ width: '100%' }}>
                  <Option value={'???'}>???</Option>
                  <Option value={'???'}>???</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {form.getFieldDecorator('sealed', {
                  initialValue:record.sealed,
                  rules: [{ required: true, message:'????????????' }],
                })( <Select placeholder='?????????????????????' style={{ width: '100%' }}>
                  <Option value={0}>???</Option>
                  <Option value={1}>???</Option>
                </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('psntype',{
                  initialValue:record.psntype,
                  rules:[{required:true,message:'????????????'}]
                })( <Select placeholder='?????????????????????' style={{ width: '100%' }}>
                  <Option value={1}>??????</Option>
                  <Option value={2}>??????</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('address',{
                  initialValue:record.address?record.address:'',
                  // rules:[{required:true,message:'????????????'}]
                })(<Input placeholder='?????????????????????' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='??????'>
                {getFieldDecorator('zipcode',{
                  initialValue:record.zipcode?record.zipcode:'',
                  // rules:[{required:true,message:'??????'}]
                })(<Input placeholder='???????????????' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('personalid',{
                  initialValue:record.personalid?record.personalid:'',
                })(<Input placeholder='?????????????????????' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('user_id',{
                  // rules:[{required:true}],
                  initialValue: this.state.SelectValue
                })(<TableModelTable
                  on={ons}
                  data={datas}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label={'??????'}>
                {getFieldDecorator('memo',{
                  initialValue:record.memo?record.memo:'',
                  // rules:[{required:true,message:'??????'}]
                })(<TextArea rows={3} placeholder={"???????????????"}/>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default PersonalFileupdate;
