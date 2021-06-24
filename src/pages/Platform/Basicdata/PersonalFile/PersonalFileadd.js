import React, { PureComponent } from 'react';
import {
  Button,
  Form,
  Col,
  Row,
  DatePicker,
  Modal,
  Input,
  Select,
  TreeSelect
} from 'antd';
import { connect } from 'dva';
import TableModelTable from '@/pages/tool/TableModelTable';
import { toTree } from '@/pages/tool/ToTree';

const { TreeNode } = TreeSelect;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ personal, loading }) => ({
  personal,
  userLoading: loading.effects['personal/fetchPerson']
}))
@Form.create()
class PersonalFileadd extends PureComponent {
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
        deptId: record.id,
        deptName: record.name
      })
    }
  }

  handleOk = (onOk)=>{
    const { form } = this.props;
    const { BStatus,selectedRowKeys,deptId } = this.state;
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
    const { form } = this.props;
    form.resetFields();
    this.setState({
      SelectValue:[],
      selectedRowKeys:[],

      deptValues:[],
      deptId:null,
      deptName:'',
      BStatus:false
    })
  }

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
      form,
      on,
      data,
      userLoading
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
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='人员编码'>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入人员编码'}],
                })(<Input placeholder='请输入人员编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='姓名'>
                {form.getFieldDecorator('name', {
                  rules: [{ required: true, message:'请输入人员姓名' }],
                })(<Input placeholder='请输入人员姓名' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='曾用名'>
                {form.getFieldDecorator('usedname', {
                  // rules: [{ required: true, message:'曾用名' }],
                })(<Input placeholder='请输入曾用名' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='紧急联系人'>
                {getFieldDecorator('urgpsn', {
                  // rules: [{ required: true, message: '紧急联系人'}],
                })(<Input placeholder='请输入紧急联系人' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='紧急联系电话'>
                {form.getFieldDecorator('urgphone', {
                  // rules: [{ required: true, message:'紧急联系电话' }],
                })(<Input placeholder='请输入紧急联系电话' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='手机号'>
                {form.getFieldDecorator('mobile', {
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
                  initialValue:record.name,
                })(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="请选择负责部门"
                >
                  {this.renderTreeNodes(this.state.deptValues)}
                </TreeSelect >)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='电话'>
                {form.getFieldDecorator('phone', {
                  // rules: [{ required: true, message:'电话' }],
                })(<Input placeholder='请输入电话' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='email'>
                {form.getFieldDecorator('email', {
                  rules: [
                    { required: true, message:'email' },
                    {
                      pattern: /^[a-z0-9][\w\-\.]{2,29}@[a-z0-9\-]{2,67}(\.[a-z\u2E80-\u9FFF]{2,6})+$/,
                      message: '请输入正确邮箱',
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
                  rules: [{ required: true, message:'请选择生日' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择生日" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='性别'>
                {form.getFieldDecorator('sex', {
                  rules: [{ required: true,message:'请选择性别'}],
                })(<Select placeholder='请选择性别' style={{width:'100%'}}>
                  <Option value={'男'}>男</Option>
                  <Option value={'女'}>女</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='是否封存'>
                {form.getFieldDecorator('sealed', {
                  rules: [{ required: true, message:'请选择是否封存' }],
                })( <Select placeholder='请选择是否封存' style={{width:'100%'}}>
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
                  rules:[{required:true,message:'请选择人员类别'}]
                })( <Select placeholder='请选择人员类别' style={{width:'100%'}}>
                  <Option value={1}>在职</Option>
                  <Option value={0}>离职</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='部门位置'>
                {getFieldDecorator('address',{
                  // rules:[{required:true,message:'部门位置'}]
                })(<Input placeholder='请输入部门位置' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='邮编'>
                {getFieldDecorator('zipcode',{
                  // rules:[{required:true,message:'邮编'}]
                })(<Input placeholder='请输入邮编' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='身份证号'>
                {getFieldDecorator('personalid',{
                  /* rules:[
                     {required:true,message:'身份证号'},
                     {
                       pattern: /^(\d{17}|\d{14})[\dx]$/,
                       message: '请输入正确身份证号',
                     },
                    ]*/
                })(<Input placeholder='请输入身份证号' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='关联用户'>
                {getFieldDecorator('user_id',{
                  initialValue:this.state.SelectValue
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
                  // rules:[{required:true,message:'备注'}]
                })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default PersonalFileadd;
