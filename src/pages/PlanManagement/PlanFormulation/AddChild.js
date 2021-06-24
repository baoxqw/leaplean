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
  Select,
} from 'antd';
import { toTree } from '@/pages/tool/ToTree';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';
import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ pfor, loading }) => ({
  pfor,
  loading: loading.models.pfor,
  HitchLoading: loading.effects['pfor/fetchHitch'],
  userLoading: loading.effects['pfor/fetchTable'],
}))
@Form.create()
class AddSelf extends PureComponent {
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
    startValue: null,
    endValue: null,
    endOpen: false,
    startValueAssign: null,
    endValueAssign: null,
    endOpenAssign: false,
    planStartTime: null,
    assignStartTime: null,
    planEndTime: null,
    endTimeShow: true,
    assignTimeShow: true,

    BStatus:false
  };

  componentWillReceiveProps(nextProps) {

    if (nextProps.data.record !== this.props.data.record) {
      const record = nextProps.data.record;

      this.setState({
        record,
      })
    }
  }

  handleOk = (onOk) => {
    const { form } = this.props;
    const {  selectedMaterialRowKeys, record, selectedOperationRowKeys, selectedHitchRowKeys, BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const obj = {
        ...values,
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
      startValue: null,
      endValue: null,
      endOpen: false,
      startValueAssign: null,
      endValueAssign: null,
      endOpenAssign: false,
      planStartTime: null,
      assignStartTime: null,
      planEndTime: null,
      endTimeShow: true,
      assignTimeShow: true,

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

  //工期开始计划
  disabledStartDate = startValue => {
    const { endValue } = this.state;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  onChangeAssign = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onEndChangeAssign = value => {
    this.onChangeAssign('endValueAssign', value);
  };

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data,
      HitchLoading,
      userLoading
    } = this.props;
    const { endOpen } = this.state;
    const { visible ,loading} = data;
    const { onOk, onCancel } = on;
    const { record } = this.state

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
        title="新建"
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
                {getFieldDecorator('developName', {
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

                })(<SelectModelTable
                  on={onperson}
                  data={dataperson}
                />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='生产数量'>
                {getFieldDecorator('productNumber', {

                })(<Input placeholder='生产数量' type={'number'} onChange={this.productChange} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='备件数量'>
                {getFieldDecorator('spareNumber', {
                })(
                  <Input placeholder='请输入备件数量' type={'number'} onChange={this.spareChange} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='投产数量'>
                {getFieldDecorator('castNumber', {
                })(
                  <Input placeholder='请输入投产数量' disabled />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='筛选数量'>
                {getFieldDecorator('filterNumber', {
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
                })(
                  <Input placeholder='请输入计划交付数量' disabled />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

              <Form.Item label='例试数量'>
                {getFieldDecorator('exampleNumber', {
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

                })(<DatePicker
                  disabledDate={this.disabledStartDate}
                  format="YYYY-MM-DD"
                  //value={startValue}
                  style={{ width: '100%' }}
                  placeholder="请选择计划开始日期"
                  onChange={this.onStartChange}
                  onOpenChange={this.handleStartOpenChange}
                />)}
              </FormItem>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <FormItem label='计划完成日期'>
                {getFieldDecorator('planEndDate', {

                })(<DatePicker
                  disabledDate={this.disabledEndDate}
                  format="YYYY-MM-DD"
                  placeholder="请选择计划完成日期"
                  onChange={this.onEndChange}
                  open={endOpen}
                  style={{ width: '100%' }}
                  onOpenChange={this.handleEndOpenChange}
                />)}
              </FormItem>

            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

            </Col>
          </Row>

          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <FormItem label='备注'>
                {getFieldDecorator('memo', {
                })(<TextArea rows={3} placeholder='请输入意见' />)}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default AddSelf;
