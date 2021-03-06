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
     if(nextProps.data.record.id !== this.props.data.record.id){
       let a = nextProps.data.record.begindate
       let b = nextProps.data.record.enddate
       this.setState({
         initData:nextProps.data.record,
         startValue:a?moment(a):null,
         endValue:b?moment(b):null,
         workcalendruleId:nextProps.data.record.workcalendruleId
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

  clear = () =>{ //?????????????????????
    const { form } = this.props;
    //???????????????
    form.resetFields();

    // state ??????  ??????state?????????????????? ???????????????????????????
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
  //????????????
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

  //?????????
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
  //?????????
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
    const { endOpen,initData } = this.state
    const { onOk,onCancel } = on
    return (
      <Modal
        title="????????????????????????"
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
              <FormItem label='??????????????????'>
                {getFieldDecorator('workcalendruleName', {
                  initialValue: initData?initData.workcalendruleName:'',
                  // rules: [{ required: true, message: '???????????????' }],
                })(
                  <TreeSelect
                    treeDefaultExpandAll
                    style={{ width: '100%'}}
                    onFocus={this.onFocusWork}
                    onChange={this.onChangWork}
                    placeholder="?????????????????????"
                  >
                    {this.renderTreeNodesWork(this.state.workRule)}
                  </TreeSelect >
                )}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='???????????????'>
                {getFieldDecorator('begindate', {
                  initialValue:initData?moment(initData.begindate):null
                  // rules: [{ required: true, message: '???????????????' }],
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
              <FormItem label='???????????????'>
                {getFieldDecorator('enddate', {
                  initialValue:initData?moment(initData.enddate):null,
                  rules: [{ required: true, message: '???????????????' }],
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
              <FormItem label='????????????'>
                {getFieldDecorator('holidayclId', {
                  initialValue: initData?initData.holidayclId:'',
                  // rules: [{ required: true, message: '????????????' }],
                })(
                  <Select  style={{width:'100%'}} placeholder="????????????">
                    <Option value={0}>?????????</Option>
                    <Option value={1}>?????????</Option>
                    <Option value={2}>?????????</Option>
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
              <b>????????????????????????????????????????????????????????????????????????????????????????????????!</b>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default AddChildOver;
