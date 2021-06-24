import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Modal, Button,
} from 'antd';

import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable'
const { TextArea } = Input;

@connect(({ area, loading }) => ({
  area,
  loading: loading.models.area,
  WorkLoading: loading.effects['area/fetchWork'],
  OperationLoading: loading.effects['area/fetchTable'],
}))
@Form.create()
class AreaAdd extends PureComponent {
  state = {
    SelectWorkValue: [],
    selectedWorkRowKeys: [],

    SelectOperationValue: [],
    selectedOperationRowKeys: [],

    BStatus:false
  };

  handleOk = (onOk) => {
    const { form } = this.props;
    const { selectedWorkRowKeys, selectedOperationRowKeys,BStatus } = this.state;
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
        productionlineId: selectedWorkRowKeys.length ? selectedWorkRowKeys[0] : null,
        psnId: selectedOperationRowKeys.length ? selectedOperationRowKeys[0] : null,
        memo: values.memo
      };
      this.setState({
        BStatus:true
      })
      if (typeof onOk === 'function') {
        onOk(obj, this.clear);
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
      SelectWorkValue: [],
      selectedWorkRowKeys: [],

      SelectOperationValue: [],
      selectedOperationRowKeys: [],

      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      WorkLoading,
      OperationLoading,
      on,
    } = this.props;

    const { visible,loading } = data;
    const { onOk, onCancel } = on;

    const onWorkData = {
      SelectValue: this.state.SelectWorkValue,
      selectedRowKeys: this.state.selectedOperationRowKeys,
      columns: [
        {
          title: '生产线编号',
          dataIndex: 'code',
        },
        {
          title: '生产线名称',
          dataIndex: 'name',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:100
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title: '生产线',
      placeholder: '请选择生产线',
      tableType: 'area/fetchWork',
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
      },
    };

    const ons = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectOperationValue: nameList,
          selectedOperationRowKeys: selectedRowKeys,
        })
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectOperationValue: [],
          selectedOperationRowKeys: [],
        })
      },
    };
    const datas = {
      SelectValue: this.state.SelectOperationValue,
      selectedRowKeys: this.state.selectedWorkRowKeys,
      placeholder: '请选择人员',
      columns: [
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
          title: '部门',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          width:100,
          dataIndex: 'caozuo',
          key: 'caozuo',
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title: '选择人员',
      treeType: 'area/newdata',
      tableType: 'area/fetchTable',
      treeCode:'DEPT_ID',
      tableLoading:OperationLoading,
    }


    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='76%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="区域编号">
              {getFieldDecorator('code', {
                rules: [{
                  required: true,
                  message: '请选择区域编号'
                }]
              })(<Input placeholder="请输入区域编号" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="区域名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请选择区域名称'
                  }
                ]
              })(
                <Input placeholder="请输入区域名称" />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="负责人">
              {getFieldDecorator('psnName', {
                rules: [{
                  required: true,
                  message: '请选择负责人'
                }],
              })(<SelectModelTable
                on={ons}
                data={datas}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="生产线">
              {getFieldDecorator('productionlineName', {
                rules: [{
                  required: true,
                  message: '请选择生产线'
                }],
              })(<TableModelTable
                data={onWorkData}
                on={onWordOn}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default AreaAdd;

