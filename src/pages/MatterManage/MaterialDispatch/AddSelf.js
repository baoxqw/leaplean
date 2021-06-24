import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  TreeSelect,
  Form,
  Input,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import TableModelTable from '@/pages/tool/TableModelTable';
import SelectModelTable from '@/pages/tool/SelectModelTable';
import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage,
  tableLoading:loading.effects['MManage/fetchTable'],
  userLoading:loading.effects['MManage/fetchstorefile'],
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

    departmentId:[],
    departmentTreeValue:[],
    departmentName:'',


    TableProductData:[],//仓库
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],

    TreePickData:[],//领料人
    TablePickData:[],
    SelectPickValue:[],
    selectedPickRowKeys:[],
    PickConditions:[],
    pick_id:null,

  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus,selectedOperationRowKeys,selectedPickRowKeys,departmentId,selectedProductRowKeys } = this.state;
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
          warehouseId:selectedProductRowKeys.length?selectedProductRowKeys[0]:null,
          librarianId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
         // pickerId:selectedPickRowKeys.length?selectedPickRowKeys[0]:null,
          documentDate:(values.documentDate).format('YYYY-MM-DD'),
          deptId:departmentId,
          memo:values.memo,
        //  stock:values.stock,
        //  num:values.num?Number(values.num):0,
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
    const { form } = this.props;
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    form.resetFields();
    this.setState({
      BStatus:false,

      TreeOperationData:[],
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],

      departmentId:[],
      departmentTreeValue:[],
      departmentName:'',


      TableProductData:[],//仓库
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],
    })
  }

  onChangDepartment = (value, label, extra)=>{
    this.setState({
      departmentId:value
    })
  };

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'MManage/finddept',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        const a = toTree(res.resData);
        this.setState({
          departmentTreeValue:a
        })
      }
    });
  }

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });

  render() {
    const {
      form: { getFieldDecorator },
      tableLoading,
      userLoading,
      dispatch,
      data,
      on
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;

    const ons = {
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
    const datas = {
      TreeData:this.state.TreeOperationData, //树的数据
      TableData:this.state.TableOperationData, //表的数据
      SelectValue:this.state.SelectOperationValue, //框选中的集合
      selectedRowKeys:this.state.selectedOperationRowKeys, //右表选中的数据
      placeholder:'请选择人员',
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

    const onPick = {
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectPickValue:nameList,
          selectedPickRowKeys:selectedRowKeys,
        })
      }, //模态框确定时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectPickValue:[],
          selectedPickRowKeys:[],
        })
      }
    };
    const datasPick = {
      TreeData:this.state.TreePickData, //树的数据
      TableData:this.state.TablePickData, //表的数据
      SelectValue:this.state.SelectPickValue, //框选中的集合
      selectedRowKeys:this.state.selectedPickRowKeys, //右表选中的数据
      placeholder:'请选择人员',
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
      title:'领料人员',
      treeType: 'MManage/newdata',
      tableType: 'MManage/fetchTable',
      //treeCode:'AREACL_ID',
      tableLoading:tableLoading,
    }

    const onProductData = {
      TableData:this.state.TableProductData,
      SelectValue:this.state.SelectProductValue,
      selectedRowKeys:this.state.selectedProductRowKeys,
      columns : [
        {
          title: '仓库编号',
          dataIndex: 'code',
        },
        {
          title: '仓库名称',
          dataIndex: 'name',
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
      title:'仓库',
      placeholder:'请选择仓库',
      tableType:'MManage/fetchstorefile',
      tableLoading:userLoading
    };
    const onProductOn = {
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectProductValue:nameList,
          selectedProductRowKeys:selectedRowKeys,
        })
      },
      onButtonEmpty:()=>{
        this.setState({
          SelectProductValue:[],
          selectedProductRowKeys:[],
        })
      }
    };

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
                initialValue:"初始状态"
              })(
                <Input disabled/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="单据日期">
              {getFieldDecorator('documentDate',{
              })(
                <DatePicker style={{width:'100%'}} />
              )}
            </Form.Item>
          </Col>
        </Row>
        {/*<Row gutter={16}>*/}
        {/*  <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>*/}
        {/*    <Form.Item label="库存组织">*/}
        {/*      {getFieldDecorator('stock',{*/}

        {/*      })(<Input placeholder="库存组织" />)}*/}
        {/*    </Form.Item>*/}
        {/*  </Col>*/}
        {/*  <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>*/}
        {/*    <Form.Item label="申请总数量">*/}
        {/*      {getFieldDecorator('num', {*/}
        {/*      })(<Input placeholder="库存组织" type={'number'}/>)}*/}
        {/*    </Form.Item>*/}
        {/*  </Col>*/}
        {/*  <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>*/}
        {/*    <Form.Item label="领料人">*/}
        {/*      {getFieldDecorator('pickerId',{*/}
        {/*        rules: [{*/}
        {/*          required: true,*/}
        {/*          message:'请选择领料人'*/}
        {/*        }],*/}
        {/*      })(<SelectModelTable*/}
        {/*        on={onPick}*/}
        {/*        data={datasPick}*/}
        {/*      />)}*/}
        {/*    </Form.Item>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="库管员">
              {getFieldDecorator('librarianId',{
                rules: [{
                  required: true,
                  message:'请选择库管员'
                }],
                initialValue: this.state.SelectOperationValue
              })(<SelectModelTable
                on={ons}
                data={datas}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="部门">
              {getFieldDecorator('deptName', {
              })(<TreeSelect
                treeDefaultExpandAll
                //value={this.state.departmentName}
                style={{ width: '100%' }}
                onFocus={this.onFocusDepartment}
                onChange={this.onChangDepartment}
                placeholder="请选择负责部门"
              >
                {this.renderTreeNodes(this.state.departmentTreeValue)}
              </TreeSelect >)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="仓库">
              {getFieldDecorator('warehouseName', {
                rules: [{
                  required: true,
                  message:'请输选择仓库'
                }]
              })(<TableModelTable
                data={onProductData}
                on={onProductOn}
              />)}
            </Form.Item>
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

