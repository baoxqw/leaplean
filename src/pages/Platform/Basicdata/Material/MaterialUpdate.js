import React, { Fragment, PureComponent } from 'react';
import {
  Form,
  Col,
  Row,
  Modal,
  Input,
  Checkbox,
  message,
  TreeSelect,
  Select,
  Tree, Button,
} from 'antd';
import { connect } from 'dva';
import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable';
import { getParentKey, toTree } from '@/pages/tool/ToTree';

const { TreeNode } = Tree;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ material, loading }) => ({
  material,
  loading: loading.models.material,
  userLoading: loading.effects['material/fetchUcum'],
  tableLoading: loading.effects['material/newdataList'],
}))
@Form.create()
class MaterialUpdate extends PureComponent {
  state = {
    SelectValue: [],
    selectedRowKeys: [],
    graphidStatus: false,
    allValue: [],
    invclId: null,
    BStatus:false,
    SelectOperationValue: [],
    selectedOperationRowKeys: [],

  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.record !== this.props.data.record) {

      const { record } = nextProps.data;
      console.log('record',record)
      if (record.materialType === '制造件') {
        this.setState({
          graphidStatus: true
        })
      }
      this.setState({
        invclId: record.invclId,
        invclName: record.invclName,
        selectedRowKeys: [record.ucumId],
        SelectValue: record.ucumName?record.ucumName:[],
        selectedOperationRowKeys: [record.factoryId],
        SelectOperationValue: record.factoryName?record.factoryName:[],

      })
    }
  }

  onChanged = value => {
    this.setState({
      invclId: value
    });
  };

  materialTypeChange = (value) => {
    if (value === '制造件') {
      this.setState({
        graphidStatus: true
      })
    } else {
      this.setState({
        graphidStatus: false
      })
    }
  }

  handleOk = (onOk) => {
    const { form, data: { record } } = this.props;

    const { BStatus,selectedRowKeys, invclId, selectedOperationRowKeys} = this.state;
    if(BStatus){
      return;
    }

    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return
      }
      const obj = {
        reqData: {
          id: record.id,
          invclId: invclId,
          code: fieldsValue.code,
          name: fieldsValue.name,
          spec: fieldsValue.spec,
          model: fieldsValue.model,
          ucumId: selectedRowKeys.length ? selectedRowKeys[0] : null,
          materialshortname: fieldsValue.materialshortname,
          materialbarcode: fieldsValue.materialbarcode,
          materialmnecode: fieldsValue.materialmnecode,
          graphid: fieldsValue.graphid,
          materialType: fieldsValue.materialType,
          outsourcingType: fieldsValue.outsourcingType,
          materialForm: fieldsValue.materialForm,
          memo: fieldsValue.memo,
          factoryId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
          packageForm:fieldsValue.packageForm,
          qualityLevel:fieldsValue.qualityLevel,
          norm:fieldsValue.norm,
        }
      };
      this.setState({
        BStatus:true
      })
      onOk(obj,this.clear);
    })
  }

  handleCancel = (onCancel) => {
    if (typeof onCancel === 'function') {
      onCancel(this.clear)
    }
  };


  clear = (status)=> {
    if(status){
      this.setState({
        BStatus:false
      })
      return;
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      SelectValue: [],
      selectedRowKeys: [],
      graphidStatus: false,
      allValue: [],
      invclId: null,
      SelectOperationValue: [],
      selectedOperationRowKeys: [],
      level:'',
      BStatus:false,
    })
  }

  yy = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item}>
            {this.yy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item} />;
    });

  onFocus = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'material/matype',
      payload: {
        reqData: {}
      },
      callback: (res) => {
        let allValue = [];
        if (res.resData) {
          allValue = toTree(res.resData);
        }
        this.setState({
          allValue
        })
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      data,
      tableLoading,
      userLoading,
      on
    } = this.props;
    const { visible, loading, record } = data;
    const { onOk, onCancel } = on;

    const { graphidStatus, allValue, invclName } = this.state;

    const ons = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectValue: nameList,
          selectedRowKeys: selectedRowKeys,
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectValue: [],
          selectedRowKeys: [],
        })
      },
    };
    const onDatas = {
      SelectValue: this.state.SelectValue,
      selectedRowKeys: this.state.selectedRowKeys,
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
          title: '所属量纲',
          dataIndex: 'dimension',
        },
        {
          title: '是否基本计量单位',
          dataIndex: 'basecodeflag',
          render: (text) => {
            return <Checkbox checked={text} />
          }
        },
        {
          title: '换算率（与量纲基本单位）',
          dataIndex: 'conversionrate',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo'
        }
      ],
      fetchList: [
        { label: '综合查询', code: 'code', placeholder: '请输入查询条件' },
      ],
      title: '计量单位',
      placeholder: '请选择计量单位',
      tableType: 'material/fetchUcum',
      tableLoading: userLoading
    };

    const onInvestor = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        console.log('----selectedRows',selectedRows)
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
    const dataInvestor = {
      SelectValue: this.state.SelectOperationValue,
      selectedRowKeys: this.state.selectedOperationRowKeys,
      placeholder: '请选择生产厂家',
      columns: [
        {
          title: '客商编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '客商名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '客商类型',
          dataIndex: 'custtype',
          key: 'custtype',
          render:(text,item)=>{
            if(text == 1){
              return '客商'
            }else if(text == 2){
              return '客户'
            }else if(text == 3){
              return '供应商'
            }

          },
        },
        {
          title: '所属地区',
          dataIndex: 'areaclid',
          key: 'areaclid',
        },
        {
          title: '简称',
          dataIndex: 'shortname',
          key: 'shortname',
        },
        {
          title: '电话',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: '网址',
          dataIndex: 'website',
          key: 'website',
        },
        {
          title: '等级',
          dataIndex: 'custlevel',
          key: 'custlevel',
        },
        {
          title: '法人姓名',
          dataIndex: 'respsnname',
          key: 'respsnname',
        },
        {
          title: '地址',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '邮编',
          dataIndex: 'zipcode',
          key: 'zipcode',
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'uscc',
          key: 'uscc',
        },
        {
          title: '注册资本',
          dataIndex: 'regmoney',
          key: 'regmoney',
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
      title: '选择生产厂家',
      treeType: 'material/tree',
      tableType: 'material/newdataList',
      treeCode:'AREACL_ID',
      tableLoading:tableLoading,
    }
    return (
      <Modal
        title="物料编辑"
        destroyOnClose
        centered
        visible={visible}
        width='76%'
        onCancel={() => this.handleCancel(onCancel)}
        footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
        <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
      >
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料分类'>
                {getFieldDecorator('invclName', {
                  initialValue: invclName
                })(<TreeSelect
                  style={{ width: '100%' }}
                  treeDefaultExpandAll
                  onFocus={this.onFocus}
                  onChange={this.onChanged}
                >
                  {this.yy(allValue)}
                </TreeSelect>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料编码'>
                {getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    message: '请选择物料编码'
                  }],
                  initialValue: record.code ? record.code : ''
                })(<Input placeholder='请输入物料编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料名称'>
                {getFieldDecorator('name', {
                  rules: [{
                    required: true,
                    message: '请选择物料名称'
                  }],
                  initialValue: record.name ? record.name : ''
                })(<Input placeholder='请输入物料名称' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='型号'>
                {getFieldDecorator('model', {
                  rules: [{
                    required: true,
                    message: '请选择型号'
                  }],
                  initialValue: record.model ? record.model : ''
                })(<Input placeholder='请输入型号' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='计量单位'>
                {getFieldDecorator('ucumId', {
                  rules: [{
                    required: true,
                    message: '请选择计量单位'
                  }],
                  initialValue: this.state.SelectValue
                })(<TableModelTable
                  data={onDatas}
                  on={ons}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料简称'>
                {getFieldDecorator('materialshortname', {

                  initialValue: record.materialshortname ? record.materialshortname : ''
                })(<Input placeholder='请输入物料简称' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料条码'>
                {getFieldDecorator('materialbarcode', {
                  initialValue: record.materialbarcode ? record.materialbarcode : ''
                })(<Input placeholder='请输入物料条码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料助记码'>
                {getFieldDecorator('materialmnecode', {
                  initialValue: record.materialmnecode ? record.materialmnecode : ''
                })(<Input placeholder='请输入物料助记码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='规格'>
                {getFieldDecorator('spec', {
                  rules: [{
                    required: true,
                    message: '请选择规格'
                  }],
                  initialValue: record.spec ? record.spec : ''
                })(<Input placeholder='请输入规格' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料类型'>
                {getFieldDecorator('materialType', {
                  initialValue: record.materialType,
                  rules: [{
                    required: true,
                    message: '请选择物料类型'
                  }],
                })(<Select placeholder='请选择备件'
                  onChange={this.materialTypeChange}
                  style={{ width: '100%' }}>
                  <Option value="制造件">制造件</Option >
                  <Option value="采购件">采购件</Option >
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='委外类型'>
                {getFieldDecorator('outsourcingType', {
                  initialValue: record.outsourcingType,
                  rules: [{
                    required: true,
                    message: '请选择委外类型'
                  }],
                })(<Select placeholder='请选择委外类型' style={{ width: '100%' }}>
                  <Option value="不委外">不委外</Option >
                  <Option value="带料委外">带料委外</Option >
                  <Option value="不带料委外">不带料委外</Option >
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料形态'>
                {getFieldDecorator('materialForm', {
                  initialValue: record.materialForm,
                  rules: [{
                    required: true,
                    message: '请选择委外类型'
                  }],
                })(<Select placeholder='请选择物料形态' style={{ width: '100%' }}>
                  <Option value="产成品">产成品</Option >
                  <Option value="半成品">半成品</Option >
                  <Option value="原材料">原材料</Option >
                </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='图号'>
                {getFieldDecorator('graphid', {
                  rules: [{
                    required: graphidStatus,
                    message: '请输入图号'
                  }],
                  initialValue: record.graphid ? record.graphid : ''
                })(<Input placeholder='请输入图号' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='生产厂家'>
                {getFieldDecorator('factoryId', {
                  initialValue: this.state.SelectOperationValue
                })(<SelectModelTable
                  on={onInvestor}
                  data={dataInvestor}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='质量等级'>
                {getFieldDecorator('qualityLevel', {
                  initialValue:record.qualityLevel ? record.qualityLevel : ''
                })(<Input  placeholder={'请输入质量等级'} />)}
              </Form.Item>

            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='封装形式'>
                {getFieldDecorator('packageForm', {
                  initialValue: record.packageForm ? record.packageForm : ''
                })(<Input placeholder={'请输入封装形式'} />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='总规范/标准代号'>
                {getFieldDecorator('norm', {
                  initialValue: record.norm ? record.norm : ''
                })(<Input placeholder={'请输入总规范/标准代号'}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="备注">
                {getFieldDecorator('memo', {
                  initialValue: record.memo ? record.memo : ''
                })(<TextArea rows={3} placeholder={'请输入备注'} />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default MaterialUpdate;
