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
      }, //????????????????????????
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
      SelectValue: this.state.SelectMaterialValue, //??????????????????
      selectedRowKeys: this.state.selectedMaterialRowKeys, //?????????????????????
      placeholder: '???????????????',
      columns: [
        {
          title: '????????????',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '??????',
          dataIndex: 'spec',
          key: 'spec',
        },
        {
          title: '??????',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '????????????',
          dataIndex: 'ucumName',
          key: 'ucumName',
        },
        {
          title: '????????????',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
        },
        {
          title: '???????????????',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
        },
        {
          title: '???????????????',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
        },
        {
          title: '??????',
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
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title: '????????????',
      tableType: 'QI/fetchMataQu',
      treeType: 'QI/matypeQu',
      treeCode:'invclId',
      tableLoading:userLoading
    }

    return (
      <Modal
        title={"??????"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
          <Button type="primary" key={2} loading={loading} onClick={() => this.onSave(onSave)}>??????</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('materialName', {
                  rules: [{
                    required: true,
                    message: '???????????????'
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
              <Form.Item label="????????????">
                {getFieldDecorator('materialCode', {
                  initialValue: this.state.materialCode
                })(
                  <Input placeholder={'?????????????????????'} disabled />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="??????">
                {getFieldDecorator('status', {
                  initialValue:'????????????'
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('qualityLevel', {
                })(
                  <Select placeholder={'?????????????????????'} style={{width:'100%'}}>
                    <Option value={1}>1</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="?????????">
                {getFieldDecorator('laborCost', {
                })(
                  <Input placeholder={'??????????????????'} type={'number'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="?????????">
                {getFieldDecorator('materialFee', {
                })(
                  <Input placeholder={'??????????????????'} type={'number'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="?????????">
                {getFieldDecorator('outsourcingFee', {
                })(
                  <Input placeholder={'??????????????????'} type={'number'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="??????">
                {getFieldDecorator('prodserial', {
                })(
                  <Input placeholder={'???????????????'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="??????">
                {getFieldDecorator('model', {
                })(
                  <Input placeholder={'???????????????'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('processplanName', {
                })(
                  <Input placeholder={'?????????????????????'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('processplanCode', {
                })(
                  <Input placeholder={'?????????????????????'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('cardnum', {
                })(
                  <Input placeholder={'?????????????????????'} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('causes', {
                })(
                  <Input placeholder={'?????????????????????'} />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('mark', {
                })(
                  <Input placeholder={'?????????????????????'} />
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

