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
  TimePicker,
  TreeSelect,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import moment from 'moment';
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
class AddChildOver extends PureComponent {
  state = {
    workRule:[],

    startValue: null,
    endValue: null,
    endOpen: false,
    startValueAssign: null,
    endValueAssign: null,
    endOpenAssign: false,
    planStartTime:null,
    assignStartTime:null,
    planEndTime:null,
    endTimeShow:true,
    assignTimeShow:true,
    initData:{},
    workcalendruleId:null,
  };
  componentDidMount(){

  }
  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      let a = nextProps.data.record.begindate
      this.setState({
        initData:nextProps.data.record,
        startValue:a?moment(a):null,
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
       workcalendruleId:this.state.workcalendruleId,
       begindate:values.begindate?values.begindate.format('YYYY-MM-DD'):'',
       enddate:values.enddate?values.enddate.format('YYYY-MM-DD'):'',
       holidayclId:values.holidayclId?Number(values.holidayclId):'',
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

  //起始日
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  onStartChange = value => {
    this.onChange('startValue', value);
  };
  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };
  //结束日
  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };
  onEndChange = value => {
    this.onChange('endValue', value);
  };
  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible,record } = data
    const { endOpen } = this.state
    const { onOk,onCancel } = on
    return (
        <Modal
          title="生成工作日历明细"
          destroyOnClose
          centered
          width={'80%'}
          visible={visible}
          onCancel={()=>this.handleCancel(onCancel)}
          onOk={()=>this.handleOk(onOk)}
        >
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='依据日立规则'>
                  {getFieldDecorator('workcalendruleName', {
                    // rules: [{ required: true, message: '日历结束日' }],
                  })(
                    <TreeSelect
                      treeDefaultExpandAll
                      style={{ width: '100%'}}
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
                <FormItem label='日历起始日'>
                  {getFieldDecorator('begindate', {
                    initialValue:record?moment(record.begindate):null
                    // rules: [{ required: true, message: '日历起始日' }],
                  })(
                    <DatePicker
                      style={{width:'100%'}}
                      format="YYYY-MM-DD"
                      disabledDate={this.disabledStartDate}
                      onChange={this.onStartChange}
                      onOpenChange={this.handleStartOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='日历结束日'>
                  {getFieldDecorator('enddate', {
                    rules: [{ required: true, message: '日历结束日' }],
                  })(
                    <DatePicker
                      style={{width:'100%'}}
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM-DD"
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='假日类别'>
                  {getFieldDecorator('holidayclId', {
                    // rules: [{ required: true, message: '假日类别' }],
                  })(
                    <Select  style={{width:'100%'}} placeholder="假日类别">
                      <Option value="0">工作日</Option>
                      <Option value="1">公休日</Option>
                      <Option value="2">节假日</Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <b>说明：新设置日历期间与当前日历期间重叠时，按照最新设置覆盖原日历!</b>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default AddChildOver;
