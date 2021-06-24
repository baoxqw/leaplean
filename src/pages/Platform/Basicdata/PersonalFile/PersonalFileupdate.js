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
      }, //模态框确定时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectValue:[],
          selectedRowKeys:[],
        })
      },
    };
    const datas = {
      SelectValue:this.state.SelectValue, //框选中的集合
      selectedRowKeys:this.state.selectedRowKeys, //右表选中的数据
      placeholder:'请选择关联人',
      columns:[
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
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
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title:'关联人选择',
      tableType:'personal/fetchPerson',
      tableLoading:userLoading
    }

    return (
      <Modal
        title="人员新建"
        destroyOnClose
        centered
        visible={visible}
        width='76%'
        onCancel={()=>this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]
        }
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='人员编码'>
                {getFieldDecorator('code', {
                  initialValue:record.code?record.code:'',
                  rules: [{ required: true, message: '请输入人员编码'}],
                })(<Input placeholder='请输入人员编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='姓名'>
                {form.getFieldDecorator('name', {
                  initialValue:record.name?record.name:'',
                  rules: [{ required: true, message:'请输入人员姓名' }],
                })(<Input placeholder='请输入人员姓名' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='曾用名'>
                {form.getFieldDecorator('usedname', {
                  initialValue:record.usedname?record.usedname:'',
                  // rules: [{ required: true, message:'曾用名' }],
                })(<Input placeholder='请输入曾用名' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='紧急联系人'>
                {getFieldDecorator('urgpsn', {
                  initialValue:record.urgpsn?record.urgpsn:'',
                  // rules: [{ required: true, message: '紧急联系人'}],
                })(<Input placeholder='请输入紧急联系人' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='紧急联系电话'>
                {form.getFieldDecorator('urgphone', {
                  initialValue:record.urgphone?record.urgphone:'',
                  // rules: [{ required: true, message:'紧急联系电话' }],
                })(<Input placeholder='请输入紧急联系电话' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='手机号'>
                {form.getFieldDecorator('mobile', {
                  initialValue:record.mobile?record.mobile:'',
                  rules: [
                    { required: true, message:'请输入手机号' },
                    {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '请输入正确手机号',
                    },
                  ],
                })(<Input placeholder='请输入手机号' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='部门'>
                {form.getFieldDecorator('dept_id', {
                  initialValue:record.deptname?record.deptname:'',
                  rules: [{ required: true, message:'请选择部门' }],
                })(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="请选择部门"
                >
                  {this.renderTreeNodes(this.state.deptValues)}
                </TreeSelect >)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='电话'>
                {form.getFieldDecorator('phone', {
                  initialValue:record.phone?record.phone:'',
                  // rules: [{ required: true, message:'电话' }],
                })(<Input placeholder='请输入电话' />)}
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
                      message: '请输入正确邮编',
                    },
                  ],
                })(<Input placeholder='请输入email' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='生日'>
                {form.getFieldDecorator('birthdate', {
                  initialValue:record.birthdate?moment(record.birthdate):null,
                  rules: [{ required: true, message:'请选择生日' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择生日" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='性别'>
                {form.getFieldDecorator('sex', {
                  initialValue:record.sex,
                  rules: [{ required: true,message:'性别'}],
                })(<Select placeholder='请选择性别' style={{ width: '100%' }}>
                  <Option value={'男'}>男</Option>
                  <Option value={'女'}>女</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='是否封存'>
                {form.getFieldDecorator('sealed', {
                  initialValue:record.sealed,
                  rules: [{ required: true, message:'是否封存' }],
                })( <Select placeholder='请选择是否封存' style={{ width: '100%' }}>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='人员类别'>
                {getFieldDecorator('psntype',{
                  initialValue:record.psntype,
                  rules:[{required:true,message:'人员类别'}]
                })( <Select placeholder='请选择人员类别' style={{ width: '100%' }}>
                  <Option value={1}>在职</Option>
                  <Option value={2}>离职</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='部门位置'>
                {getFieldDecorator('address',{
                  initialValue:record.address?record.address:'',
                  // rules:[{required:true,message:'部门位置'}]
                })(<Input placeholder='请输入部门位置' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='邮编'>
                {getFieldDecorator('zipcode',{
                  initialValue:record.zipcode?record.zipcode:'',
                  // rules:[{required:true,message:'邮编'}]
                })(<Input placeholder='请输入邮编' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='身份证号'>
                {getFieldDecorator('personalid',{
                  initialValue:record.personalid?record.personalid:'',
                })(<Input placeholder='请输入身份证号' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='关联用户'>
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
              <Form.Item label={'备注'}>
                {getFieldDecorator('memo',{
                  initialValue:record.memo?record.memo:'',
                  // rules:[{required:true,message:'备注'}]
                })(<TextArea rows={3} placeholder={"请输入备注"}/>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default PersonalFileupdate;
