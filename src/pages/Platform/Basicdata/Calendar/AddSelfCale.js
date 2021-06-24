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
  Checkbox,
  Card,
  TimePicker,
  TreeSelect,
  Select,
  message,
  Radio,
  Popconfirm,
  Upload,
} from 'antd';
import { toTree } from '@/pages/tool/ToTree';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ calendar, loading }) => ({
  calendar,
  loading: loading.models.calendar,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class AddSelfOver extends PureComponent {
  state = {
    workRule:[],
    holidayclId:null,
    typeValue:[],
  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      onOk(values,this.clear)
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
  //日历规则
  onFocusWork = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/fetchWork',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if(res.resData){
          const a = toTree(res.resData);
          this.setState({
            workRule:a
          })
        }else{
          this.setState({ workRule:[]})
        }

      }
    });
  }
  onChangWork =(value, label, extra)=>{
    this.setState({
      workcalendruleId:value
    })
  }
  //假期类别
  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/fetchType',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if(res.resData){
          const a = toTree(res.resData);
          this.setState({
            typeValue:a
          })
        }
      }
    });
  }
  onChangDepartment=(value, label, extra)=>{
    this.setState({
      holidayclId:value
    })
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });
  renderTreeNodesWork = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodesWork(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible, } = data
    const { onOk,onCancel } = on
    const options = [];
    for (let i = 2006; i < 2026; i += 1) {
      options.push(
        <Select.Option key={i} value={i} >
          {i}
        </Select.Option>,
      );
    }
    return (
      <Modal
        title="新建工作日历"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onCancel={()=>this.handleCancel(onCancel)}
        onOk={()=>this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工作日历编码'>
                {getFieldDecorator('workcode', {
                  rules: [{ required: true, message: '工作日历编码' }],
                })(
                  <Input placeholder="请输入工作日历编码" />,
                )}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='假日年度'>
                {getFieldDecorator('holidayyear', {
                  rules: [{ required: true, message: '假日年度' }],
                })(
                  <Select placeholder='请选择假日年度'>
                    {options}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工作日历名称'>
                {getFieldDecorator('workname', {
                  rules: [{ required: true, message: '工作日历名称' }],
                })(
                  <Input placeholder="请输入工作日历名称"/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='启用状态'>
                {getFieldDecorator('enablestate', {
                  rules: [{ required: true, message: 'yearstartdate' }],
                })(
                  <Select  placeholder={'请选择启用状态'}>
                    <Option value={1}>未启用</Option>
                    <Option value={2}>已启用</Option>
                    <Option value={3}>已停用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='日历起始日期'>
                {getFieldDecorator('begindate', {
                  rules: [{ required: true, message: '日历起始日期' }],
                })(
                  <DatePicker style={{width:'100%'}} placeholder="请选择日历起始日期"/>
                )}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='假期类别'>
                {getFieldDecorator('holidayclId', {
                  rules: [{ required: true, message: '假期类别' }],
                })(
                  <TreeSelect
                    treeDefaultExpandAll
                    onFocus={this.onFocusDepartment}
                    onChange={this.onChangDepartment}
                    placeholder="请选择假期类别"
                  >
                    {this.renderTreeNodes(this.state.typeValue)}
                  </TreeSelect >
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='日历结束日期'>
                {getFieldDecorator('enddate', {
                  rules: [{ required: true, message: '日历结束日期' }],
                })(
                  <DatePicker  style={{width:'100%'}} placeholder="请选择日历结束日期"/>
                )}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='日历规则'>
                {getFieldDecorator('workcalendruleId', {
                  rules: [{ required: true, message: '日历规则' }],
                })(
                  <TreeSelect
                    treeDefaultExpandAll
                    onFocus={this.onFocusWork}
                    onChange={this.onChangWork}
                    placeholder="请选择日历规则"
                  >
                    {this.renderTreeNodesWork(this.state.workRule)}
                  </TreeSelect >
                )}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工作日历年度起始日'>
                {getFieldDecorator('yearstartdate', {
                  rules: [{ required: true, message: 'yearstartdate' }],
                })(
                  <DatePicker style={{width:'100%'}} placeholder={'请输入工作日历年度起始日'}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='每周起始日'>
                {getFieldDecorator('ffirstweekday', {
                  // rules: [{ required: true, message: '每周起始日' }],
                })(
                  <Radio.Group>
                    <Radio value="1">周日</Radio>
                    <Radio value="2">周一</Radio>
                    <Radio value="3">周二</Radio>
                    <Radio value="4">周三</Radio>
                    <Radio value="5">周四</Radio>
                    <Radio value="6">周五</Radio>
                    <Radio value="7">周六</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='是否默认日历'>
                {getFieldDecorator('isdefaultcalendar', {
                  valuePropName: 'checked',
                  initialValue: false,
                })(
                  <Checkbox></Checkbox>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default AddSelfOver;
