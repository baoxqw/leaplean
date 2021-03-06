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
          title: '????????????',
          dataIndex: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
        },
        {
          title: '?????????',
          dataIndex: 'psnId',
        },
        {
          title: '???????????????',
          dataIndex: 'productionlineId',
        },
        {
          title: '',
          width:100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title:'????????????',
      placeholder:'?????????????????????',
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
          title: '????????????????????????',
          dataIndex: 'code',
        },
        {
          title: '????????????????????????',
          dataIndex: 'name',
        },
        {
          title: '',
          width:100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title:'??????????????????',
      placeholder:'?????????????????????',
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
      }, //??????table?????????
      onSetSearch:(key,value,onChange,item)=>{
        onChange(value);
        this.setState({
          SelectUnitValue: [value],
          selectedUnitRowKeys: [key],
        })
      }, //?????????????????????
    };

    return (
        <Modal
          title="??????????????????"
          destroyOnClose
          centered
          visible={visible}
          width={'80%'}
          onCancel={()=>this.handleCancel(onCancel)}
          footer={[<Button key={1} onClick={() => this.handleCancel(onCancel)}>??????</Button>,
            <Button type="primary" key={2} loading={loading} onClick={() => this.handleOk(onOk)}>??????</Button>]}
        >
          <Form>
            <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????????????????">
                  {getFieldDecorator('code',{
                    rules: [{
                      required: true,
                      message:'???????????????????????????'
                    }],
                    initialValue: initData.code?initData.code:''
                  })(<Input placeholder="???????????????????????????" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????????????????">
                  {getFieldDecorator('name',{
                    rules: [
                      {
                        required: true,
                        message:'???????????????????????????'
                      }
                    ],
                    initialValue: initData.name?initData.name:''
                  })(
                    <Input placeholder="???????????????????????????" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="????????????">
                  {getFieldDecorator('unittypeId', {
                    rules: [{
                      required: true,
                      message:'?????????????????????'
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
                <Form.Item label="????????????">
                  {getFieldDecorator('productionregionName',{
                    rules: [{
                      required: true,
                      message:'?????????????????????'
                    }],
                    initialValue:this.state.SelectRegionValue
                  })(<NewModelTable
                    data={onRegionData}
                    on={onRegionOn}
                  />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('status', {
                    initialValue: initData.status?initData.status:''
                  })(<Select style={{ width: '100%' }} placeholder="???????????????">
                    <Option value="1">??????1</Option>
                    <Option value="2">??????2</Option>
                    <Option value="3">??????3</Option>
                  </Select>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('memo', {
                    initialValue: initData.memo?initData.memo:''
                  })(<TextArea rows={3} placeholder={'???????????????'}/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default UnitWorkAdd;

