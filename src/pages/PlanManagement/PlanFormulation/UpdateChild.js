import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  TreeSelect,
  DatePicker,
  Button,
} from 'antd';

import { toTree } from '@/pages/tool/ToTree';
import moment from 'moment';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';
import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
@connect(({ pfor, loading }) => ({
  pfor,
  HitchLoading: loading.effects['pfor/fetchHitch'],
  userLoading: loading.effects['pfor/fetchTable'],
}))
@Form.create()
class UpdateChild extends PureComponent {
  state = {
    SelectWorkorderValue: [],
    selectedWorkorderRowKeys: [],

    SelectOperationValue: [],
    selectedOperationRowKeys: [],

    SelectHitchValue: [],
    selectedHitchRowKeys: [],


    modelTypeId: [],//型号
    modelTypeValue: [],

    SelectMaterialValue: [],
    selectedMaterialRowKeys: [],

    model: '',
    graphid: '',

    record: {},

    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;

      this.setState({
        record,
        selectedWorkorderRowKeys: [record.workId],
        SelectWorkorderValue: record.workName,

        selectedOperationRowKeys: [record.assignorId],
        SelectOperationValue: record.assignorName,

        selectedHitchRowKeys: [record.developId],
        SelectHitchValue: record.developName,

        selectedMaterialRowKeys: [record.materialId],
        SelectMaterialValue: record.materialName,

        model: record.model,
        graphid: record.graphid,


      })
    }
  }

  handleOk = (onOk) => {
    const { form } = this.props;
    const {record, BStatus, selectedMaterialRowKeys, selectedOperationRowKeys, selectedHitchRowKeys, modelTypeId } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const obj = {
        ...values,
        id: record.id,
        workId: record.workId,
        materialId: selectedMaterialRowKeys ? selectedMaterialRowKeys[0] : null,
        developId: selectedHitchRowKeys ? selectedHitchRowKeys[0] : null,
        assignorId: selectedOperationRowKeys ? selectedOperationRowKeys[0] : null,
        productNumber: values.productNumber ? Number(values.productNumber) : null,
        planStartDate: values.planStartDate ? values.planStartDate.format('YYYY-MM-DD') : null,
        planEndDate: values.planEndDate ? values.planEndDate.format('YYYY-MM-DD') : null,
        spareNumber: values.spareNumber ? Number(values.spareNumber) : null,
        castNumber: values.castNumber ? Number(values.castNumber) : null,
        exampleNumber: values.exampleNumber ? Number(values.exampleNumber) : null,
        filterNumber: values.filterNumber ? Number(values.filterNumber) : null,
        planDeliveryNumber: values.planDeliveryNumber ? Number(values.planDeliveryNumber) : null,
      }
      this.setState({
        BStatus:true
      })
      onOk(obj, this.clear)
    })
  }

  handleCancel = (onCancel) => {
    onCancel(this.clear)
  }

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
      SelectWorkorderValue: [],
      selectedWorkorderRowKeys: [],

      SelectOperationValue: [],
      selectedOperationRowKeys: [],

      SelectHitchValue: [],
      selectedHitchRowKeys: [],


      modelTypeId: [],//型号
      modelTypeValue: [],

      SelectMaterialValue: [],
      selectedMaterialRowKeys: [],

      model: '',
      graphid: '',

      record: {},

      BStatus:false
    })
  }

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
      type: 'pfor/newdataType',
      payload: {
        reqData: {}
      },
      callback: (res) => {
        const a = toTree(res);
        this.setState({
          modelTypeValue: a
        })
      }
    });
  }

  onChangDepartment = (value, label, extra) => {

    this.setState({
      modelTypeId: value
    })
  };

  productChange = (e) => {
    const value = e.target.value;
    const { form } = this.props;
    const spareNumber = form.getFieldValue('spareNumber')//备件
    const filterNumber = form.getFieldValue('filterNumber')//筛选数量
    if (value && spareNumber) {
      const castNumber = Number(value) + Number(spareNumber);
      form.setFieldsValue({
        castNumber
      })
      if (filterNumber) {
        form.setFieldsValue({
          planDeliveryNumber: castNumber - Number(filterNumber)
        })
      }
    }
  }

  spareChange = (e) => {
    const value = e.target.value;
    const { form } = this.props;
    const productNumber = form.getFieldValue('productNumber')//生产
    const filterNumber = form.getFieldValue('filterNumber')//筛选数量
    if (value && productNumber) {
      const castNumber = Number(value) + Number(productNumber);
      form.setFieldsValue({
        castNumber: Number(value) + Number(productNumber)
      })
      if (filterNumber) {
        form.setFieldsValue({
          planDeliveryNumber: castNumber - Number(filterNumber)
        })
      }
    }
  }

  filterChange = (e) => {
    const value = e.target.value;
    const { form } = this.props;
    const castNumber = form.getFieldValue('castNumber')//投产
    if (value && castNumber) {
      form.setFieldsValue({
        planDeliveryNumber: Number(castNumber) - Number(value)
      })
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data,
      HitchLoading,
      userLoading
    } = this.props;
    const { record, SelectHitchValue, SelectOperationValue } = this.state;
    const { visible,loading } = data;
    const { onOk, onCancel } = on;

    //人员
    const onperson = {
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
      }
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
          width: 1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '物料人员',
      tableType: 'pfor/fetchTable',
      treeType: 'pfor/newdata',
      treeCode:'DEPT_ID',
      tableLoading:userLoading
    }
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
        }
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '研制状态',
      placeholder: '请选择研制状态',
      tableType: 'pfor/fetchHitch',
      tableLoading:HitchLoading
    };
    const onHitchOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectHitchValue: nameList,
          selectedHitchRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectHitchValue: [],
          selectedHitchRowKeys: [],
        })
      }
    };
    //物料编码-型号
    const onsmate = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        let graphid = null;
        let model = '';

        const nameList = selectedRows.map(item => {
          graphid = item.graphid;
          model = item.model;
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectMaterialValue: nameList,
          graphid,
          model,
          selectedMaterialRowKeys: selectedRowKeys,
        })
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectMaterialValue: [],
          selectedMaterialRowKeys: [],
        })
      },
    };
    const datasmate = {
      SelectValue: this.state.SelectMaterialValue, //框选中的集合
      selectedRowKeys: this.state.selectedMaterialRowKeys, //右表选中的数据
      placeholder: '请选择物料',
      columns: [
        {
          title: '物料编码',
          dataIndex: 'code',
          key: 'code',
          width: 120
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
          width: 120
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          width: 120
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
          width: 120
        },
        {
          title: '计量单位',
          dataIndex: 'ucumName',
          key: 'ucumName',
          width: 120
        },
        {
          title: '物料简称',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
          width: 120
        },
        {
          title: '物料条形码',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
          width: 120
        },
        {
          title: '物料助记器',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
          width: 120
        },
        {
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
          width: 120
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
          title: '',
          dataIndex: 'caozuo',
          width:100
        },
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '物料选择',
      tableType: 'pfor/fetchMataMtaterial',
      treeType: 'pfor/matype',
      treeCode:'invclId',
    };

    return (
      <Modal
        title="编辑"
        destroyOnClose
        centered
        visible={visible}
        width={"80%"}
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='物料编码'>
                {getFieldDecorator('materialId', {
                  initialValue: this.state.SelectMaterialValue,
                  rules: [
                    {
                      required: true,
                      message: '物料编码'
                    }
                  ],
                })(<SelectTableRedis
                  on={onsmate}
                  data={datasmate}
                />)}

              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='图号'>
                {getFieldDecorator('name', {
                  initialValue: this.state.graphid
                })(<Input placeholder='请输入图号名称' disabled />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='型号'>
                {getFieldDecorator('model', {
                  initialValue: this.state.model
                })(<Input placeholder='请输入型号' disabled />)}
              </FormItem>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='研制状态'>
                {getFieldDecorator('developId', {
                  initialValue: SelectHitchValue,
                })(
                  <TableModelTable
                    data={onHitchData}
                    on={onHitchOn}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='分配人'>
                {getFieldDecorator('assignorId', {
                  initialValue: SelectOperationValue,
                })(<SelectModelTable
                  on={onperson}
                  data={dataperson}
                />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='生产数量'>
                {getFieldDecorator('productNumber', {
                  initialValue: record.productNumber ? record.productNumber : '',
                })(<Input placeholder='生产数量' type={'number'} onChange={this.productChange} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='备件数量'>
                {getFieldDecorator('spareNumber', {
                  initialValue: record.spareNumber ? record.spareNumber : '',
                })(
                  <Input placeholder='请输入备件数量' type={'number'} onChange={this.spareChange} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='投产数量'>
                {getFieldDecorator('castNumber', {
                  initialValue: record.castNumber ? record.castNumber : '',
                })(
                  <Input placeholder='请输入投产数量' disabled />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='筛选数量'>
                {getFieldDecorator('filterNumber', {
                  initialValue: record.filterNumber ? record.filterNumber : '',
                })(
                  <Input placeholder='请输入筛选数量' type={'number'} onChange={this.filterChange} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='计划交付数量'>
                {getFieldDecorator('planDeliveryNumber', {
                  initialValue: record.planDeliveryNumber ? record.planDeliveryNumber : '',
                })(
                  <Input placeholder='请输入计划交付数量' disabled />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

              <Form.Item label='例试数量'>
                {getFieldDecorator('exampleNumber', {
                  initialValue: record.exampleNumber ? record.exampleNumber : '',
                })(
                  <Input placeholder='请输入例试数量' type={'number'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='工作令'>
                {getFieldDecorator('workId', {
                  initialValue: record.workName
                })(<Input placeholder='请输入工作令' disabled />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='计划开始日期'>
                {getFieldDecorator('planStartDate', {
                  initialValue: record.planStartDate ? moment(record.planStartDate) : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='计划完成日期'>
                {getFieldDecorator('planEndDate', {
                  initialValue: record.planEndDate ? moment(record.planEndDate) : null,
                })(<DatePicker style={{ width: '100%' }} />)}
              </FormItem>

            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

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
        </div>
      </Modal>
    );
  }
}

export default UpdateChild;
