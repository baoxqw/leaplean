import React, { PureComponent } from 'react';
import {
  Form,
  Col,
  Row,
  DatePicker,
  Input,
  Modal,
  Select,
  TreeSelect, Button,
} from 'antd';

import { connect } from 'dva';
import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable';
import { toTree } from '@/pages/tool/ToTree';

const { TreeNode } = TreeSelect;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ WO, loading }) => ({
  WO,
  submitting: loading.effects['WO/add'],
  OperationLoading:loading.effects['WO/fetchTable'],
  HitchLoading:loading.effects['WO/fetchHitch']
}))
@Form.create()
class WorkOrderAdd extends PureComponent {
  state = {
    SelectOperationValue: [],
    selectedOperationRowKeys: [],

    SelectHitchValue: [],
    selectedHitchRowKeys: [],

    deptId: null,//申请部门
    deptName: null,
    deptTreeValue: [],

    modelId:null,
    modelName:null,
    modelValue: [],

    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;
      this.setState({
        modelId:record.id,
        modelName:record.name
      })
    }
  }

  handleOk = (onOk) => {
    const { form } = this.props;
    const { selectedHitchRowKeys, selectedOperationRowKeys, deptId,modelId,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      const obj = {
        reqData: {
          ...fieldsValue,
          pid: modelId,
          endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : null,
          startDate: fieldsValue.startDate ? fieldsValue.startDate.format('YYYY-MM-DD') : null,
          extension: fieldsValue.extension ? fieldsValue.extension.format('YYYY-MM-DD') : null,
          applicantId: selectedOperationRowKeys ? selectedOperationRowKeys[0] : null,
          deptId,
          developmentId: selectedHitchRowKeys ? selectedHitchRowKeys[0] : null,
        },
      };
      this.setState({
        BStatus:true
      })
      onOk(obj, this.clear);
    });
  };

  handleCancel = (onCancel) => {
    if (typeof onCancel === 'function') {
      onCancel(this.clear);
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
      SelectOperationValue: [],
      selectedOperationRowKeys: [],

      SelectHitchValue: [],
      selectedHitchRowKeys: [],

      deptId: null,//申请部门
      deptName: null,
      deptTreeValue: [],

      modelId:null,
      modelName:null,
      modelValue: [],
      BStatus:false
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

  onFocusDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'WO/newdata',
      payload: {
        reqData: {},
        pageIndex: 0,
        pageSize: 10000000,
      },
      callback: (res) => {
        const a = toTree(res.resData);
        this.setState({
          deptTreeValue: a,
        });
      },
    });
  };

  onChangDepartment = (value, label, extra) => {
    this.setState({
      deptId: value,
    });
  };

  onFocusModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'WO/newdatasss',
      payload: {
        reqData: {},
        pageIndex: 0,
        pageSize: 10000000,
      },
      callback: (res) => {
        const a = toTree(res.resData);
        this.setState({
          modelValue: a,
        });
      },
    });
  };

  onChangModel = (value, label, extra) => {
    this.setState({
      modelId: value,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      form,
      on,
      data,
      OperationLoading,
      HitchLoading,
    } = this.props;
    const { modelName } = this.state;
    const { visible, loading, record } = data;
    const { onOk, onCancel } = on;
    //人员
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
    const datas = {
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
        { label: '综合查询', code: 'code', placeholder: '请输入查询条件' },
      ],
      title: '物料人员',
      treeType: 'WO/newdata',
      tableType: 'WO/fetchTable',
      treeCode: 'DEPT_ID',
      tableLoading:OperationLoading,
    };
    //研制状态
    const onHitchData = {
      SelectValue: this.state.SelectHitchValue,
      selectedRowKeys: this.state.selectedHitchRowKeys,
      columns: [
        {
          title: '编码',
          dataIndex: 'code',
        },
        {
          title: '名称',
          dataIndex: 'name',
        },
        {
          title: '标识',
          dataIndex: 'logo',
        },
        {
          title: '备注',
          dataIndex: 'memo',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        { label: '综合查询', code: 'code', placeholder: '请输入查询条件' },
      ],
      title: '研制状态',
      placeholder: '请选择研制状态',
      tableType: 'WO/fetchHitch',
      tableLoading:HitchLoading,
    };
    const onHitchOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return;
        }
        const nameList = selectedRows.map(item => {
          return item.name;
        });
        onChange(nameList);
        this.setState({
          SelectHitchValue: nameList,
          selectedHitchRowKeys: selectedRowKeys,
        });
      },
      onButtonEmpty: (onChange) => {
        this.setState({
          SelectHitchValue: [],
          selectedHitchRowKeys: [],
        });
      },
    };

    return (
      <Modal
        title="工作令编辑"
        destroyOnClose
        centered
        visible={visible}
        width='76%'
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: 'auto' }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='工作令编码'>
                {getFieldDecorator('code', {
                 // rules: [{ required: true, message: '工作令编码' }],
                })(<Input placeholder='系统自动生成' disabled/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='工作令名称'>
                {form.getFieldDecorator('name', {
                  rules: [{ required: true, message: '工作令名称' }],
                })(<Input placeholder='请输入工作令名称' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='研制状态'>
                {form.getFieldDecorator('developmentName', {})(
                  <TableModelTable
                    data={onHitchData}
                    on={onHitchOn}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='项目分类号'>
                {form.getFieldDecorator('developCategory', {})(
                  <Select placeholder={'请选择项目分类号'} style={{width:'100%'}}>
                    <Option value={'预算'}>预算</Option>
                    <Option value={'技改'}>技改</Option>
                    <Option value={'预研'}>预研</Option>
                    <Option value={'设计'}>设计</Option>
                    <Option value={'固定资产'}>固定资产</Option>
                    <Option value={'维修'}>维修</Option>
                    <Option value={'其他'}>其他</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='工作令性质'>
                {form.getFieldDecorator('developNature', {})(
                  <Input placeholder='请输入工作令性质' />,
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='工作令批次'>
                {form.getFieldDecorator('developBatch', {})(<Input placeholder='请输入工作令批次' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='项目名称'>
                {form.getFieldDecorator('modelNumber', {})(
                  <Select placeholder={'请选择项目名称'} style={{width:'100%'}}>
                    <Option value={'东风系列'}>东风系列</Option>
                    <Option value={'运载系列'}>运载系列</Option>
                    <Option value={'电机,涡轮齿轮组系列'}>电机,涡轮齿轮组系列</Option>
                    <Option value={'激活器系列'}>激活器系列</Option>
                    <Option value={'50*产品系列'}>50*产品系列</Option>
                    <Option value={'双频电源系列'}>双频电源系列</Option>
                    <Option value={'中频电源系列'}>中频电源系列</Option>
                    <Option value={'车载电源系列'}>车载电源系列</Option>
                    <Option value={'组合电源系列'}>组合电源系列</Option>
                    <Option value={'组合机柜系列'}>组合机柜系列</Option>
                    <Option value={'套接尾翼系列'}>套接尾翼系列</Option>
                    <Option value={'长途通讯设备'}>长途通讯设备</Option>
                    <Option value={'传真机'}>传真机</Option>
                    <Option value={'油泵定子系列'}>油泵定子系列</Option>
                    <Option value={'横向收入系列'}>横向收入系列</Option>
                    <Option value={'新产品系列'}>新产品系列</Option>
                  </Select>,
                  )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='经费来源'>
                {form.getFieldDecorator('sourceOfFunding', {})(<Input placeholder='请输入经费来源' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='开始时间'>
                {form.getFieldDecorator('startDate', {})(<DatePicker style={{ width: '100%' }}
                                                                     placeholder={'请选择开始时间'} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='终止时间'>
                {form.getFieldDecorator('endDate', {})(<DatePicker style={{ width: '100%' }}
                                                                   placeholder={'请选择终止时间'} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='停止标志'>
                {form.getFieldDecorator('stopSign', {})(<Input placeholder='请输入停止标志' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="申请人">
                {getFieldDecorator('applicantName', {})(<SelectModelTable
                  on={ons}
                  data={datas}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='申请部门'>
                {form.getFieldDecorator('deptName', {})(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="请选择负责部门"
                >
                  {this.renderTreeNodes(this.state.deptTreeValue)}
                </TreeSelect>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='延期使用日期'>
                {form.getFieldDecorator('extension', {})(<DatePicker style={{ width: '100%' }}
                                                                     placeholder={'请选择延期使用日期'} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='单据状态'>
                {form.getFieldDecorator('status', {
                  initialValue:'初始状态'
                })(<Input placeholder='请输入单据状态' disabled/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='型号'>
                {form.getFieldDecorator('modelName', {
                  initialValue:modelName
                })(<TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusModel}
                  onChange={this.onChangModel}
                  placeholder="请选择型号"
                >
                  {this.renderTreeNodes(this.state.modelValue)}
                </TreeSelect>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label='工作令描述'>
                {form.getFieldDecorator('description', {})(<Input placeholder='请输入工作令描述' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label={'备注'}>
                {getFieldDecorator('memo')(<TextArea placeholder={'请输入备注'} />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default WorkOrderAdd;
