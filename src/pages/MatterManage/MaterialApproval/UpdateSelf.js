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

      TreeMaterialData:[], //存储左边树的数据
      MaterialConditions:[], //存储查询条件
      material_id:null, //存储立项人左边数点击时的id  分页时使用
      TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id

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
        title={"编辑"}
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
                initialValue:initData.code?initData.code:'',
                rules: [{
                  required: true,
                  message:'请输入单据编号'
                }]
              })(<Input placeholder="自动生成" disabled/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="单据状态">
              {getFieldDecorator('status',{
                initialValue:initData.status?initData.status:'初始状态',
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
                initialValue:initData.shippingStatus?initData.shippingStatus:0,
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
                initialValue:initData.stock?initData.stock:'',
              })(<Input placeholder="请输入智能装备库存组织" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="申请总数量">
              {getFieldDecorator('num', {
                initialValue:initData.num?initData.num:'',
              })(<Input placeholder="申请总数量" type={'number'}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="申领日期">
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
                initialValue:initData.memo?initData.memo:'',
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default UpdateSelf;

