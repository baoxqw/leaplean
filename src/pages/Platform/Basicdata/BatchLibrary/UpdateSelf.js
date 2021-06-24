import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input, Button,
} from 'antd';
import moment from 'moment';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';

const { TextArea } = Input;
@connect(({ BLibrary, loading }) => ({
  BLibrary,
  loading: loading.models.BLibrary,
  userLoading: loading.effects['BLibrary/fetchMata']
}))
@Form.create()
class UpdateChild extends PureComponent {
  state = {
    SelectMaterialValue: [],
    selectedMaterialRowKeys: [],
    initData: {},
    materialCode:'',
    BStatus:false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {

      const initData = nextProps.data.record;

      const materialId = initData.materialId;
      const materialName = initData.materialName;

      this.setState({
        initData: nextProps.data.record,
        SelectMaterialValue: materialName,
        selectedMaterialRowKeys: [materialId],
        materialCode: initData.materialCode,
      })
    }
  }

  onSave = (onSave) => {
    const { form } = this.props;
    const { BStatus,selectedMaterialRowKeys, initData } = this.state;
    if(BStatus){
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      const obj = {
        reqData: {
          ...values,
          id: initData.id,
          tchecktime: values.tchecktime ? (values.tchecktime).format('YYYY-MM-DD') : null,
          dproducedate: values.dproducedate ? (values.dproducedate).format('YYYY-MM-DD') : null,
          dvalidate: values.dvalidate ? (values.dvalidate).format('YYYY-MM-DD') : null,
          tbatchtime: values.tbatchtime ? (values.tbatchtime).format('YYYY-MM-DD') : null,
          dinbounddate: values.dinbounddate ? (values.dinbounddate).format('YYYY-MM-DD') : null,
          materialId: selectedMaterialRowKeys.length ? selectedMaterialRowKeys[0] : null,

        }
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
      SelectMaterialValue: [],
      selectedMaterialRowKeys: [],
      initData: {},
      materialCode:''
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      userLoading,
      data,
      on
    } = this.props;
    const { initData } = this.state
    const { visible,loading } = data;
    const { onSave, onCancel } = on;

    const onm = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys.length || !selectedRows.length) {
          return
        }
        let ucumId = null;
        let ucumname = '';
        let materialCode = ''
        const nameList = selectedRows.map(item => {
          ucumId = item.ucumId;
          ucumname = item.ucumname;
          materialCode = item.code
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectMaterialValue: nameList,
          selectedMaterialRowKeys: selectedRowKeys,
          ucumId,
          ucumname,
          materialCode
        })
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectMaterialValue: [],
          selectedMaterialRowKeys: [],
          superData: [],
          childDataSource: []
        })
      },
    };
    const datam = {
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
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width: 100,
        },
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '物料选择',
      tableType: 'BLibrary/fetchMata',
      treeType: 'BLibrary/matype',
      treeCode:'invclId',
      tableLoading:userLoading,
    }


    return (
      <Modal
        title={"编辑"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.onSave(onSave)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料名称'>
                {getFieldDecorator('materialName', {
                  initialValue: initData.materialName ? initData.materialName : '',
                  rules: [{
                    required: true,
                    message: '请选择物料'
                  }]
                })(
                  <SelectTableRedis
                    on={onm}
                    data={datam}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="物料编码">
                {getFieldDecorator('materialCode', {
                  initialValue: this.state.materialCode
                })(
                  <Input placeholder={'请选择物料名称'} disabled />
                )}
              </Form.Item>

            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="供应商批次号">
                {getFieldDecorator('vvendbatchcode', {
                  initialValue: initData.vvendbatchcode ? initData.vvendbatchcode : '',
                })(
                  <Input placeholder={'请输入供应商批次号'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='上次检验日期'>
                {getFieldDecorator('tchecktime', {
                  initialValue: initData.tchecktime ? moment(initData.tchecktime) : null,
                })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="质量等级">
                {getFieldDecorator('cqualitylevelid', {
                  initialValue: initData.cqualitylevelid ? initData.cqualitylevelid : '',
                })(
                  <Input placeholder={'请输入质量等级'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="生产日期">
                {getFieldDecorator('dproducedate', {
                  initialValue: initData.dproducedate ? moment(initData.dproducedate) : null,
                })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='失效日期'>
                {getFieldDecorator('dvalidate', {
                  initialValue: initData.dvalidate ? moment(initData.dvalidate) : null,
                })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="封存">
                {getFieldDecorator('bseal', {
                  initialValue: initData.bseal ? initData.bseal : '',
                })(
                  <Input placeholder={'请输入封存'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="批次形成时间">
                {getFieldDecorator('tbatchtime', {
                  initialValue: initData.tbatchtime ? moment(initData.tbatchtime) : null,
                })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='在检'>
                {getFieldDecorator('binqc', {
                  initialValue: initData.binqc ? initData.binqc : '',
                })(
                  <Input placeholder={'请输入在检'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="创建批次档案单据类型">
                {getFieldDecorator('csourcetype', {
                  initialValue: initData.csourcetype ? initData.csourcetype : '',
                })(
                  <Input placeholder={'请输入创建批次档案单据类型'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="创建批次档案单据号">
                {getFieldDecorator('vsourcebillcode', {
                  initialValue: initData.vsourcebillcode ? initData.vsourcebillcode : '',
                })(
                  <Input placeholder={'请输入创建批次档案单据号'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='创建批次档案单据行号'>
                {getFieldDecorator('vsourcerowno', {
                  initialValue: initData.vsourcerowno ? initData.vsourcerowno : '',
                })(
                  <Input placeholder={'请输入创建批次档案单据行号'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="创建批次档案单据BID">
                {getFieldDecorator('csourcebid', {
                  initialValue: initData.csourcebid ? initData.csourcebid : '',
                })(
                  <Input placeholder={'请输入创建批次档案单据BID'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="创建批次档案单据HID">
                {getFieldDecorator('csourcehid', {
                  initialValue: initData.csourcehid ? initData.csourcehid : '',
                })(
                  <Input placeholder={'请输入创建批次档案单据HID'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='集团'>
                {getFieldDecorator('pkGroup', {
                  initialValue: initData.pkGroup ? initData.pkGroup : '',
                })(
                  <Input placeholder={'请输入集团'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="版本号">
                {getFieldDecorator('version', {
                  initialValue: initData.version ? initData.version : '',
                })(
                  <Input placeholder={'请输入版本号'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="散列码">
                {getFieldDecorator('vhashcode', {
                  initialValue: initData.vhashcode ? initData.vhashcode : '',
                })(
                  <Input placeholder={'请输入散列码'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='生产批次号'>
                {getFieldDecorator('vprodbatchcode', {
                  initialValue: initData.vprodbatchcode ? initData.vprodbatchcode : '',
                })(
                  <Input placeholder={'请输入生产批次号'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="首次入库日期">
                {getFieldDecorator('dinbounddate', {
                  initialValue: initData.dinbounddate ? moment(initData.dinbounddate) : null,
                })(
                  <DatePicker style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="批次号">
                {getFieldDecorator('vbatchcode', {
                  initialValue: initData.vbatchcode ? initData.vbatchcode : '',
                })(
                  <Input placeholder={'请输入批次号'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue: initData.memo ? initData.memo : '',
                })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal >
    );
  }
}

export default UpdateChild;

