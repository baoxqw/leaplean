import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal, Button,
} from 'antd';
import NewModelTable from '@/pages/tool/NewModelTable/NewModelTable'
const { TextArea } = Input;
const { Option } = Select;

@connect(({ unitwork,loading }) => ({
  unitwork,
  loading:loading.models.unitwork
}))
@Form.create()
class UnitWorkAdd extends PureComponent {
  state = {
    initData:{},

    SelectRegionValue:[],
    selectedRegionRowKeys:[],

    SelectUnitValue:[],
    selectedUnitRowKeys:[],

    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const initData = nextProps.data.record;
      const productionregionId = initData.productionregionId;
      const productionregionName = initData.productionregionName;
      const unittypeId = initData.unittypeId;
      const unittypeName = initData.unittypeName;

      this.setState({
        initData,
        selectedRegionRowKeys:[productionregionId],
        SelectRegionValue:productionregionName,
        selectedUnitRowKeys:[unittypeId],
        SelectUnitValue:unittypeName,
      })
    }
  }

  handleOk = (onOk)=>{
    const { form } = this.props;
    const { initData,selectedUnitRowKeys,selectedRegionRowKeys,BStatus } = this.state;
    if(BStatus){
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        id:initData.id,
        code:values.code,
        name:values.name,
        unittypeId:selectedUnitRowKeys.length?selectedUnitRowKeys[0]:null,
        productionregionId:selectedRegionRowKeys.length?selectedRegionRowKeys[0]:null,
        status:values.status,
        memo:values.memo
      };
      this.setState({
        BStatus:true
      })
      onOk(obj,this.clear);
    })
  }

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
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
      SelectRegionValue:[],
      selectedRegionRowKeys:[],

      SelectUnitValue:[],
      selectedUnitRowKeys:[],

      initData:{},

      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      on,
      data
    } = this.props;
    const { visible,loading } = data
    const { onOk,onCancel } = on
    const { initData } = this.state;

    const onRegionData = {
      SelectValue:this.state.SelectRegionValue,
      selectedRowKeys:this.state.selectedRegionRowKeys,
      columns : [
        {
          title: '区域编号',
          dataIndex: 'code',
        },
        {
          title: '区域名称',
          dataIndex: 'name',
        },
        {
          title: '负责人',
          dataIndex: 'psnId',
        },
        {
          title: '生产线名称',
          dataIndex: 'productionlineId',
        },
        {
          title: '',
          width:100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title:'生产区域',
      placeholder:'请选择生产区域',
      tableType:'unitwork/fetchRegion',
    };
    const onRegionOn = {
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectRegionValue:nameList,
          selectedRegionRowKeys:selectedRowKeys,
        })
      },
      onButtonEmpty:(onChange)=>{
        onChange([])
        this.setState({
          SelectRegionValue:[],
          selectedRegionRowKeys:[],
        })
      },
    };

    const onUnitData = {
      SelectValue:this.state.SelectUnitValue,
      selectedRowKeys:this.state.selectedUnitRowKeys,
      columns : [
        {
          title: '工作单元类型编码',
          dataIndex: 'code',
        },
        {
          title: '工作单元类型名称',
          dataIndex: 'name',
        },
        {
          title: '',
          width:100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title:'工作单元类型',
      placeholder:'请选择单元类型',
      tableType:'unitwork/fetchUnit',
    };
    const onUnitOn = {
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectUnitValue:nameList,
          selectedUnitRowKeys:selectedRowKeys,
        })
      },
      onButtonEmpty:()=>{
        this.setState({
          SelectUnitValue:[],
          selectedUnitRowKeys:[],
        })
      },
      setTableData:(res)=>{
        this.setState({
          TableUnitData:res,
        })
      }, //设置table的表值
      onSetSearch:(key,value,onChange,item)=>{
        onChange(value);
        this.setState({
          SelectUnitValue: [value],
          selectedUnitRowKeys: [key],
        })
      }, //选择输入框的值
    };

    return (
        <Modal
          title="编辑工作单元"
          destroyOnClose
          centered
          visible={visible}
          width={'80%'}
          onCancel={()=>this.handleCancel(onCancel)}
          footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
            <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>确定</Button>]}
        >
          <Form>
            <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="工作单元编号">
                  {getFieldDecorator('code',{
                    rules: [{
                      required: true,
                      message:'请选择工作单元编号'
                    }],
                    initialValue: initData.code?initData.code:''
                  })(<Input placeholder="请输入工作单元编号" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="工作单元名称">
                  {getFieldDecorator('name',{
                    rules: [
                      {
                        required: true,
                        message:'请选择工作单元名称'
                      }
                    ],
                    initialValue: initData.name?initData.name:''
                  })(
                    <Input placeholder="请输入工作单元名称" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="单位类型">
                  {getFieldDecorator('unittypeId', {
                    rules: [{
                      required: true,
                      message:'请选择单元类型'
                    }],
                    initialValue: this.state.SelectUnitValue
                  })(<NewModelTable
                    data={onUnitData}
                    on={onUnitOn}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="生产区域">
                  {getFieldDecorator('productionregionName',{
                    rules: [{
                      required: true,
                      message:'请选择生产区域'
                    }],
                    initialValue:this.state.SelectRegionValue
                  })(<NewModelTable
                    data={onRegionData}
                    on={onRegionOn}
                  />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="状态">
                  {getFieldDecorator('status', {
                    initialValue: initData.status?initData.status:''
                  })(<Select style={{ width: '100%' }} placeholder="请选择状态">
                    <Option value="1">状态1</Option>
                    <Option value="2">状态2</Option>
                    <Option value="3">状态3</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo', {
                    initialValue: initData.memo?initData.memo:''
                  })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default UnitWorkAdd;

