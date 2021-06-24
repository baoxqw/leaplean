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
  Tabs,
  Icon,
  Checkbox,
  Select,
  message,
  Popconfirm,
  Upload,
  TreeSelect,
} from 'antd';
import moment from '../../PlanManagement/ProductOrder/ProductOrderAdd';
import momentt from 'moment';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;

@connect(({ workplan, loading }) => ({
  workplan,
  loading: loading.models.workplan,
}))
@Form.create()
class UpdateSelf extends PureComponent {
  state = {
    departmentId: [],//部门
    departmentTreeValue: [],
    departmentName: '',
    record: {},

    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;

      let a = new Date();
      const { deptId, deptName } = record;


      this.setState({
        record,
        departmentId: deptId,
        departmentName: deptName,
      });
    }
  }

  handleOk = (onOk) => {
    const { form } = this.props;
    const { BStatus, selectedWorkorderRowKeys, departmentId, record, selectedWorkRowKeys } = this.state;
    if (BStatus) {
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      let obj = {
        id: record.id,
        stageId: record.stageId,
        deptId: departmentId,
        claimCarryDate: values.claimCarryDate ? values.claimCarryDate.format('YYYY-MM-DD') : null,
        actualCarryDate: values.actualCarryDate ? values.actualCarryDate.format('YYYY-MM-DD') : null,
        memo: values.memo,
      };
      this.setState({
        BStatus:true
      })
      onOk(obj, this.clear);
    });
  };

  handleCancel = (onCancel) => {
    onCancel(this.clear);
  };

  clear = (status) => {
    if(status){
      this.setState({
        BStatus:false
      })
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      departmentId: [],//部门
      departmentTreeValue: [],
      departmentName: '',
      record: {},
      BStatus:false
    });
  };

  onFocusDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pfor/newdataDept',
      payload: {
        reqData: {},
      },
      callback: (res) => {
        if (res.resData) {
          const a = toTree(res.resData);
          this.setState({
            departmentTreeValue: a,
          });
        }

      },
    });
  };

  onChangDepartment = (value, label, extra) => {

    this.setState({
      departmentId: value,
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name} key={item.id} />;
    });

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data,
      dispatch,
    } = this.props;
    const { visible } = data;
    const { onOk, onCancel } = on;

    const { record } = this.state;

    return (
      <Modal
        title="编辑"
        destroyOnClose
        centered
        visible={visible}
        width={'80%'}
        onCancel={() => this.handleCancel(onCancel)}
        onOk={() => this.handleOk(onOk)}
      >
        <Form>
          <Row gutter={16}>
            <Col lg={{ span: 6 }} md={{ span: 12 }} sm={24}>
              <FormItem label='阶段编码'>
                {getFieldDecorator('stageCode', {
                  initialValue: record.stageCode ? record.stageCode : '',

                })(<Input placeholder='请输入阶段编码' disabled />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

              <FormItem label='阶段名称'>
                {getFieldDecorator('stageName', {
                  initialValue: record.stageName ? record.stageName : '',

                })(<Input placeholder='请输入阶段名称' disabled />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="责任部门">
                {getFieldDecorator('deptName', {
                  initialValue: this.state.departmentName,
                })(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="请选择责任部门"
                >
                  {this.renderTreeNodes(this.state.departmentTreeValue)}
                </TreeSelect>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='要求完成日期'>
                {getFieldDecorator('claimCarryDate', {
                  initialValue: record.claimCarryDate ? momentt(record.claimCarryDate) : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='实际完成日期'>
                {getFieldDecorator('actualCarryDate', {
                  initialValue: record.actualCarryDate ? momentt(record.actualCarryDate) : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo', {
                  initialValue: record.memo ? record.memo : '',
                })(<TextArea rows={3} placeholder='请输入意见' />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default UpdateSelf;
