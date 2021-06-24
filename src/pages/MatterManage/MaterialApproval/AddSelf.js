import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage,
  tableLoading:loading.effects['MManage/fetchTable'],
}))
@Form.create()
class AddSelf extends PureComponent {
  state = {
    BStatus:false,
    TreeOperationData:[],
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus,selectedOperationRowKeys,selectedPickRowKeys } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        reqData:{
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
      BStatus:false
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      tableLoading,
      on
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;

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
      }, //模态框确定时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      }
    };
    const datas1 = {
      TreeData:this.state.TreeOperationData, //树的数据
      TableData:this.state.TableOperationData, //表的数据
      SelectValue:this.state.SelectOperationValue, //框选中的集合
      selectedRowKeys:this.state.selectedOperationRowKeys, //右表选中的数据
      placeholder:'请选择物资计划员',
      columns : [
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
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询条件'},
      ],
      title:'物料人员',
      treeType: 'MManage/newdata',
      tableType: 'MManage/fetchTable',
      //treeCode:'AREACL_ID',
      tableLoading:tableLoading,
    }

    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="单据编号">
              {getFieldDecorator('code',{
              })(<Input placeholder="自动生成" disabled/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="单据状态">
              {getFieldDecorator('status',{
                initialValue:'初始状态'
              })(
                <Select style={{width:'100%'}} disabled>
                  <Option value={'初始状态'}>初始状态</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="发料状态 ">
              {getFieldDecorator('shippingStatus',{
                initialValue:0
              })(
                <Select style={{width:'100%'}}>
                  <Option value={0}>初始状态</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="智能装备库存组织">
              {getFieldDecorator('stock',{

              })(<Input placeholder="请输入智能装备库存组织" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="申请总数量">
              {getFieldDecorator('num', {
              })(<Input placeholder="请输入申请总数量" type={'number'}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="申领日期">
              {getFieldDecorator('claimDate',{
              })(
                <DatePicker style={{width:'100%'}} />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="物资计划员">
              {getFieldDecorator('planId',{
                rules: [{
                  required: true,
                  message:'请选择物资计划员'
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
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default AddSelf;

