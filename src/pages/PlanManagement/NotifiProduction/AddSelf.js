import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Modal,
  Col,
  Form,
  Input,
  TreeSelect, Button,
  DatePicker, Checkbox,
} from 'antd';
import { toTree } from '@/pages/tool/ToTree';

import SelectModelTable from '@/pages/tool/SelectModelTable';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';

const { TreeNode } = TreeSelect;
const { TextArea } = Input;

@connect(({ NPro, loading }) => ({
  NPro,
  loading: loading.models.NPro,
  tableLoading: loading.effects['Npro/fetchMata'],
  userLoading: loading.effects['NPro/fetchTable'],
  MaterialLoading: loading.effects['NPro/fetchMataCon'],
}))
@Form.create()
class TeamAdd extends PureComponent {
  state = {
    BStatus: false,
    TreeWorkorderData: [], //存储左边树的数据
    WorkorderConditions: [], //存储查询条件
    workorder_id: null, //存储工作令左边数点击时的id  分页时使用
    TableWorkorderData: [], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectWorkorderValue: [], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedWorkorderRowKeys: [], //工作令  存储右表选中时的挣个对象  可以拿到id
    pageWorkorder: null,

    SelectOperationValue: [],//watchId
    selectedOperationRowKeys: [],

    SelectOperationApValue: [],//审核人
    selectedOperationApRowKeys: [],

    TreeMaterialData: [], //存储左边树的数据
    MaterialConditions: [], //存储查询条件
    material_id: null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData: [], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue: [], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys: [], //立项人  存储右表选中时的挣个对象  可以拿到id

  };

  handleOk = (onSave) => {
    const { form } = this.props;
    const { BStatus, selectedWorkorderRowKeys, selectedOperationRowKeys, selectedOperationApRowKeys, selectedMaterialRowKeys } = this.state;
    if (BStatus) {
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const obj = {
        ...values,
        workOrderId: selectedWorkorderRowKeys ? selectedWorkorderRowKeys[0] : null,
        watchId: selectedOperationRowKeys ? selectedOperationRowKeys[0] : null,
        reviewId: selectedOperationApRowKeys ? selectedOperationApRowKeys[0] : null,
        materialId: selectedMaterialRowKeys ? selectedMaterialRowKeys[0] : null,
        dueTime: values.dueTime ? values.dueTime.format('YYYY-MM-DD') : null,
        receiptTime: values.receiptTime ? values.receiptTime.format('YYYY-MM-DD') : null,
        isApproval: values.isApproval ? 1 : 0,
        militaryCensor: values.militaryCensor ? 1 : 0,
        num: values.num ? Number(values.num) : 0,
      };
      this.setState({
        BStatus: true,
      });
      if (typeof onSave === 'function') {
        onSave(obj, this.clear);
      }
    });
  };

  handleCancel = (onCancel) => {
    if (typeof onCancel === 'function') {
      onCancel(this.clear);
    }
  };

  clear = (status) => {
    if (status) {
      this.setState({
        BStatus: false,
      });
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      BStatus: false,
      TreeWorkorderData: [], //存储左边树的数据
      WorkorderConditions: [], //存储查询条件
      workorder_id: null, //存储工作令左边数点击时的id  分页时使用
      TableWorkorderData: [], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectWorkorderValue: [], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedWorkorderRowKeys: [], //工作令  存储右表选中时的挣个对象  可以拿到id
      pageWorkorder: null,

      SelectOperationValue: [],//watchId
      selectedOperationRowKeys: [],

      SelectOperationApValue: [],//审核人
      selectedOperationApRowKeys: [],

      TreeMaterialData: [], //存储左边树的数据
      MaterialConditions: [], //存储查询条件
      material_id: null, //存储立项人左边数点击时的id  分页时使用
      TableMaterialData: [], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectMaterialValue: [], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedMaterialRowKeys: [], //立项人  存储右表选中时的挣个对象  可以拿到id
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      data,
      on,
      tableLoading,
      userLoading,
      MaterialLoading,
    } = this.props;

    const { visible, loading } = data;
    const { onSave, onCancel } = on;

    const ons = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return;
        }
        const nameList = selectedRows.map(item => {
          return item.name;
        });
        onChange(nameList);
        this.setState({
          SelectWorkorderValue: nameList,
          selectedWorkorderRowKeys: selectedRowKeys,
        });
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([]);
        this.setState({
          SelectWorkorderValue: [],
          selectedWorkorderRowKeys: [],
        });
      },

    };
    const datas = {
      SelectValue: this.state.SelectWorkorderValue, //框选中的集合
      selectedRowKeys: this.state.selectedWorkorderRowKeys, //右表选中的数据
      placeholder: '请选择工作令',
      columns: [
        {
          title: '工作令编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '工作令名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '型号类部件号',
          dataIndex: 'modelNumber',
          key: 'modelNumber',
        },
        {
          title: '经费来源',
          dataIndex: 'sourceOfFunding',
          key: 'sourceOfFunding',
        },
        {
          title: '开始时间',
          dataIndex: 'startDate',
          key: 'startDate',
        },
        {
          title: '终止时间',
          dataIndex: 'endDate',
          key: 'endDate',
        },
        {
          title: '停止标志',
          dataIndex: 'stopSign',
          key: 'stopSign',
        },
        {
          title: '申请人',
          dataIndex: 'applicantName',
          key: 'applicantName',
        },
        {
          title: '申请部门',
          dataIndex: 'deptName',
          key: 'deptName',
        },
        {
          title: '延期使用日期',
          dataIndex: 'extension',
          key: 'extension',
        },
        {
          title: '单据状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '工作令描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '研制状态',
          dataIndex: 'developmentName',
          key: 'developmentName',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        { label: '综合查询', code: 'code', placeholder: '请输入查询内容' },
      ],
      title: '工作令选择',
      treeType: 'NPro/findtree',
      tableType: 'NPro/fetchMata',
      treeCode: 'PID',
      tableLoading: tableLoading,
      tableConditions:[{
        code:'STATUS',
        exp:'=',
        value:'生效'
      }]
    };

    //制表人
    const onperson = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return;
        }
        const nameList = selectedRows.map(item => {
          return item.name;
        });
        onChange(nameList);
        this.setState({
          SelectOperationValue: nameList,
          selectedOperationRowKeys: selectedRowKeys,
        });
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([]);
        this.setState({
          SelectOperationValue: [],
          selectedOperationRowKeys: [],
        });
      },
    };
    const dataperson = {
      SelectValue: this.state.SelectOperationValue, //框选中的集合
      selectedRowKeys: this.state.selectedOperationRowKeys, //右表选中的数据
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
          width: 100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        { label: '综合查询', code: 'code', placeholder: '请输入查询内容' },
      ],
      title: '物料人员',
      tableType: 'NPro/fetchTable',
      treeType: 'NPro/newdata',
      treeCode: 'DEPT_ID',
      tableLoading: userLoading,
    };
    //审核人
    const onpersonAp = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return;
        }
        const nameList = selectedRows.map(item => {
          return item.name;
        });
        onChange(nameList);
        this.setState({
          SelectOperationApValue: nameList,
          selectedOperationApRowKeys: selectedRowKeys,
        });
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([]);
        this.setState({
          SelectOperationApValue: [],
          selectedOperationApRowKeys: [],
        });
      },
    };
    const datapersonAp = {
      SelectValue: this.state.SelectOperationApValue, //框选中的集合
      selectedRowKeys: this.state.selectedOperationApRowKeys, //右表选中的数据
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
          width: 100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        { label: '综合查询', code: 'code', placeholder: '请输入查询内容' },
      ],
      title: '物料人员',
      tableType: 'NPro/fetchTable',
      treeType: 'NPro/newdata',
      treeCode: 'DEPT_ID',
      tableLoading: userLoading,
    };
    //产品
    const onMaterial = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys.length || !selectedRows.length) {
          return;
        }

        const nameList = selectedRows.map(item => {
          return item.name;
        });
        onChange(nameList);
        this.setState({
          SelectMaterialValue: nameList,
          selectedMaterialRowKeys: selectedRowKeys,
        });
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        const { form } = this.props;
        //清空输入框
        form.resetFields();
        onChange([]);
        this.setState({
          SelectMaterialValue: [],
          selectedMaterialRowKeys: [],
          material_id: null,
        });
      },
    };
    const dataMaterial = {
      SelectValue: this.state.SelectMaterialValue, //框选中的集合
      selectedRowKeys: this.state.selectedMaterialRowKeys, //右表选中的数据
      placeholder: '请选择物料',
      columns: [
        {
          title: '物料编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '计量单位',
          dataIndex: 'ucumName',
          key: 'ucumName',
        },
        {
          title: '物料简称',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
        },
        {
          title: '物料条形码',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
        },
        {
          title: '物料助记器',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
        },
        {

          title: '物料类型',
          dataIndex: 'materialType',
          key: 'materialType',
        },
        {

          title: '委外类型',
          dataIndex: 'outsourcingType',
          key: 'outsourcingType',
        },
        {
          title: '物料形态',
          dataIndex: 'materialForm',
          key: 'materialForm',
        },
        {
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        { label: '综合查询', code: 'code', placeholder: '请输入查询内容' },
      ],
      title: '物料选择',
      tableType: 'NPro/fetchMataCon',
      treeType: 'NPro/matype',
      treeCode: 'invclId',
      tableLoading: MaterialLoading,
    };
    return (
      <Modal
        title={'新建'}
        visible={visible}
        width='76%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onSave)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: 'auto' }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="编号">
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    message: '编号必填',
                  }],
                })(<Input placeholder="请输入编号" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工作令">
                {getFieldDecorator('workOrderId', {
                  rules: [{
                    required: true,
                    message: '工作令必填',
                  }],
                })(
                  <SelectModelTable
                    on={ons}
                    data={datas}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="订货单位">
                {getFieldDecorator('orderUnit', {})(<Input placeholder={'请输入订货单位'} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="所属行业">
                {getFieldDecorator('industry', {})(<Input placeholder={'请输入所属行业'} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="产品">
                {getFieldDecorator('materialId', {})(<SelectTableRedis
                  on={onMaterial}
                  data={dataMaterial}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="订货数量">
                {getFieldDecorator('num', {})(<Input placeholder={'请输入订货数量'} type={'number'} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="技术状态">
                {getFieldDecorator('tech', {})(<Input placeholder={'请输入技术状态'} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="交付时间">
                {getFieldDecorator('dueTime', {})(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="军种">
                {getFieldDecorator('militaryType', {})(<Input placeholder={'请输入军种'} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="制表人">
                {getFieldDecorator('watchId', {})(<SelectModelTable
                  on={onperson}
                  data={dataperson}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="审核人">
                {getFieldDecorator('reviewId', {})(<SelectModelTable
                  on={onpersonAp}
                  data={datapersonAp}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否军检">
                {getFieldDecorator('militaryCensor', {
                  valuePropName: 'checked',
                })(<Checkbox />)}
              </Form.Item>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="制表组">
                {getFieldDecorator('watchGroup', {})(<Input placeholder={'请输入制表组'} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="单据日期">
                {getFieldDecorator('receiptTime', {})(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否准批">
                {getFieldDecorator('isApproval', {
                  valuePropName: 'checked',
                })(<Checkbox />)}
              </Form.Item>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {})(<TextArea rows={3} placeholder={'请输入备注'} />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default TeamAdd;

