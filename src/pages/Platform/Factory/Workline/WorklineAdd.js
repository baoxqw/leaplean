import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  Form,
  Input, Button,
} from 'antd';

import SelectTableRedis from '@/pages/tool/SelectTableRedis';
import TableModelTable from '@/pages/tool/TableModelTable';


const { TextArea } = Input;
const { Option } = Select;

@connect(({ workline, loading }) => ({
  workline,
  loading: loading.models.workline,
  fetchMataCon: loading.effects['workline/fetchMataCon'],
  fetchWorkConditions: loading.effects['workline/fetchWorkConditions'],
  WorkLoading: loading.effects['workline/fetchWorkConditions'],
  MaterialLoading:loading.effects['workline/fetchMataCon'],
}))
@Form.create()
class WorklineAdd extends PureComponent {
  state = {
    SelectWorkValue:[],
    selectedWorkRowKeys:[],

    BStatus:false
  };

  handleOk = (onSave) => {
    const { form } = this.props;
    const { selectedWorkRowKeys,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      const obj = {
        code: values.code,
        name: values.name,
        workcenterId: selectedWorkRowKeys.length ? selectedWorkRowKeys[0] : null,
        status: values.status,
        memo: values.memo
      };
      this.setState({
        BStatus:true
      })
      if (typeof onSave === 'function') {
        onSave(obj, this.clear);
      }
    })
  };

  handleCancel = (onCancel) => {
    if (typeof onCancel === 'function') {
      onCancel(this.clear)
    }
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
      SelectWorkValue:[],
      selectedWorkRowKeys:[],

      BStatus:false
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on,
      MaterialLoading,
      WorkLoading,
    } = this.props;

    const { visible,loading } = data;
    const { onSave, onCancel } = on;

    const onWorkData = {
      SelectValue: this.state.SelectWorkValue,
      selectedRowKeys: this.state.selectedWorkRowKeys,
      columns: [
        {
          title: '工作中心编号',
          dataIndex: 'code',
        },
        {
          title: '工作中心名称',
          dataIndex: 'name',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '工作中心',
      placeholder: '请选择工作中心编码',
      tableType: 'workline/fetchWorkConditions',
      tableLoading:WorkLoading,
    };
    const onWordOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectWorkValue: nameList,
          selectedWorkRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectWorkValue: [],
          selectedWorkRowKeys: [],
        })
      }, //取消选中项
    };

    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='76%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>确定</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="生产线编号">
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  message: '请选择生产线编号'
                }]
              })(<Input placeholder="请输入生产线编号" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="生产线名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请选择生产线名称'
                }]
              })(
                <Input placeholder="请输入生产线名称" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工作中心编码">
              {getFieldDecorator('workcenterName', {
                rules: [{
                  required: true,
                  message: '请选择工作中心编码'
                }]
              })(<TableModelTable
                data={onWorkData}
                on={onWordOn}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="状态">
              {getFieldDecorator('status', {
                initialValue:'初始状态'
              })(<Input placeholder={'请输入状态'}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} />)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default WorklineAdd;

