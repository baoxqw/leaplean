import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Modal,
  Col,
  DatePicker,
  Select,
  Form,
  Input, Button,
} from 'antd';

import SelectTableRedis from '@/pages/tool/SelectTableRedis';
const { TextArea } = Input;
const { Option } = Select;
@connect(({ QI, loading }) => ({
  QI,
  loading: loading.models.QI,
  userLoading:loading.effects['QI/fetchMataQu']
}))
@Form.create()
class AddSelf extends PureComponent {
  state = {
    SelectMaterialValue: [],
    selectedMaterialRowKeys: [],
    materialCode: '',

    BStatus:false
  };

  onSave = (onSave) => {
    const { form } = this.props;
    const { BStatus,selectedMaterialRowKeys } = this.state;
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
          materialId: selectedMaterialRowKeys.length ? selectedMaterialRowKeys[0] : null,
        }
      };
      console.log("obj",obj)
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
      materialCode: '',
      BStatus:false
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
      tableType: 'QI/fetchMataQu',
      treeType: 'QI/matypeQu',
      treeCode:'invclId',
      tableLoading:userLoading
    }

    return (
      <Modal
        title={"新建"}
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
              <Form.Item label="版本">
                {getFieldDecorator('status', {
                  initialValue:'初始版本'
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='质量等级'>
                {getFieldDecorator('qualityLevel', {
                })(
                  <Select placeholder={'请选择质量等级'} style={{width:'100%'}}>
                    <Option value={1}>1</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="人工费">
                {getFieldDecorator('laborCost', {
                })(
                  <Input placeholder={'请输入人工费'} type={'number'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="材料费">
                {getFieldDecorator('materialFee', {
                })(
                  <Input placeholder={'请输入材料费'} type={'number'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="外协费">
                {getFieldDecorator('outsourcingFee', {
                })(
                  <Input placeholder={'请输入外协费'} type={'number'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="批次">
                {getFieldDecorator('prodserial', {
                })(
                  <Input placeholder={'请输入批次'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="型号">
                {getFieldDecorator('model', {
                })(
                  <Input placeholder={'请输入型号'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='工艺名称'>
                {getFieldDecorator('processplanName', {
                })(
                  <Input placeholder={'请输入工艺名称'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='工艺步骤'>
                {getFieldDecorator('processplanCode', {
                })(
                  <Input placeholder={'请输入工艺步骤'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="产品编号">
                {getFieldDecorator('cardnum', {
                })(
                  <Input placeholder={'请输入产品编号'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='问题原因'>
                {getFieldDecorator('causes', {
                })(
                  <Input placeholder={'请输入问题原因'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="确认标志">
                {getFieldDecorator('mark', {
                })(
                  <Input placeholder={'请输入确认标志'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

            </Col>
          </Row>

        </div>
      </Modal>
    );
  }
}

export default AddSelf;

