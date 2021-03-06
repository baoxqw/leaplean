import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Modal
} from 'antd';
import moment from 'moment'
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage,
  tableLoading:loading.effects['MManage/fetchTable'],
  userLoading:loading.effects['MManage/fetchstorefile'],
}))
@Form.create()
class UpdateSelf extends PureComponent {
  state = {
    initData:{},
    TreeOperationData:[],
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],


  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const initData = nextProps.data.record;

      const planId = initData.planId;
      const planName = initData.planName;

      this.setState({
        initData:nextProps.data.record,
        SelectOperationValue:planName,
        selectedOperationRowKeys:[planId],
      })
    }
  }

  onSave = (onSave)=>{
    const { form } = this.props;
    const { initData,selectedOperationRowKeys,BStatus } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        reqData:{
          id:initData.id,
          code:values.code,
          status:values.status,
          shippingStatus:values.shippingStatus,
          planId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
          claimDate:(values.claimDate).format('YYYY-MM-DD'),
          memo:values.memo,
          stock:values.stock,
          num:values.num?Number(values.num):0,
        }
      };
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

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
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      initData:{},

      TableWorkData:[],
      SelectWorkValue:[],
      selectedWorkRowKeys:[],
      WorkConditions:[],

      TreeMaterialData:[], //????????????????????????
      MaterialConditions:[], //??????????????????
      material_id:null, //????????????????????????????????????id  ???????????????
      TableMaterialData:[], //???????????????  ??????{list: response.resData, pagination:{total: response.total}}
      SelectMaterialValue:[], //???????????????????????????name  ????????????????????????????????????name??????????????????
      selectedMaterialRowKeys:[], //?????????  ????????????????????????????????????  ????????????id

      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      data,
      tableLoading,
      on
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;

    const { initData } = this.state;

    const ons1 = {
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectOperationValue:nameList,
          selectedOperationRowKeys:selectedRowKeys,
        })
      }, //????????????????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      }
    };
    const datas1 = {
      TreeData:this.state.TreeOperationData, //????????????
      TableData:this.state.TableOperationData, //????????????
      SelectValue:this.state.SelectOperationValue, //??????????????????
      selectedRowKeys:this.state.selectedOperationRowKeys, //?????????????????????
      placeholder:'????????????????????????',
      columns : [
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
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title:'????????????',
      treeType: 'MManage/newdata',
      tableType: 'MManage/fetchTable',
      //treeCode:'AREACL_ID',
      tableLoading:tableLoading,
    }

    return (
      <Modal
        title={"??????"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('code',{
                initialValue:initData.code?initData.code:'',
                rules: [{
                  required: true,
                  message:'?????????????????????'
                }]
              })(<Input placeholder="????????????" disabled/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('status',{
                initialValue:initData.status?initData.status:'????????????',
              })(
                <Select style={{width:'100%'}} disabled>
                  <Option value={'????????????'}>????????????</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????? ">
              {getFieldDecorator('shippingStatus',{
                initialValue:initData.shippingStatus?initData.shippingStatus:0,
              })(
                <Select style={{width:'100%'}}>
                  <Option value={0}>????????????</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????????????????">
              {getFieldDecorator('stock',{
                initialValue:initData.stock?initData.stock:'',
              })(<Input placeholder="?????????????????????????????????" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('num', {
                initialValue:initData.num?initData.num:'',
              })(<Input placeholder="???????????????" type={'number'}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('claimDate',{
                initialValue:initData.claimDate?moment(initData.claimDate):null,
              })(
                <DatePicker style={{width:'100%'}} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('planId',{
                rules: [{
                  required: true,
                  message:'????????????????????????'
                }],
                initialValue: this.state.SelectOperationValue
              })(<SelectModelTable
                on={ons1}
                data={datas1}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="??????">
              {getFieldDecorator('memo', {
                initialValue:initData.memo?initData.memo:'',
              })(<TextArea rows={3} placeholder={'???????????????'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default UpdateSelf;

