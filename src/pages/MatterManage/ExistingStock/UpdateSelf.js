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
  Checkbox,
  TreeSelect,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage
}))
@Form.create()
class UpdateSelf extends PureComponent {
  state = {
    BStatus:false,

    TreeMaterialData:[],//物料
    MaterialConditions:[],
    material_id:null,
    TableMaterialData:[],
    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],

    departmentId:[],//部门
    departmentTreeValue:[],
    departmentName:'',
    initData:{},
    TableStoreData:[],//仓库
    SelectStoreValue:[],
    selectedStoreRowKeys:[],
    StoreConditions:[],
    pageStore:{},
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const initData = nextProps.data.record;
      const materialId = initData.materialId;
      const materialName = initData.materialName;
      const warehouseId = initData.warehouseId;
      const warehouseName = initData.warehouseName;

      const departmentId = initData.locationId;
      const departmentName = initData.locationName;
      this.setState({
        initData:nextProps.data.record,
        SelectMaterialValue:materialName,
        selectedMaterialRowKeys:[materialId],
        SelectStoreValue:warehouseName,
        selectedStoreRowKeys:[warehouseId],
        departmentId:departmentId,
        departmentName:departmentName

      })
    }
  }

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus,selectedMaterialRowKeys,initData,departmentId,selectedStoreRowKeys } = this.state;
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
          serial:values.serial,
          amount:values.amount?Number(values.amount):null,
          materialId:selectedMaterialRowKeys.length?selectedMaterialRowKeys[0]:null,
          warehouseId:selectedStoreRowKeys.length?selectedStoreRowKeys[0]:null,
          memo:values.memo,
          locationId:departmentId
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
      BStatus:false,
      TreeMaterialData:[],//物料
      MaterialConditions:[],
      material_id:null,
      TableMaterialData:[],
      SelectMaterialValue:[],
      selectedMaterialRowKeys:[],
      departmentId:[],//库位档案
      departmentTreeValue:[],
      departmentName:'',
      TableStoreData:[],//仓库
      SelectStoreValue:[],
      selectedStoreRowKeys:[],
      StoreConditions:[],
      pageStore:{},
    })
  }

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'MManage/findlocation',
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

  onChangDepartment = (value, label, extra)=>{
    
    this.setState({
      departmentId:value
    })
  };

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
      dispatch,
      data,
      on
    } = this.props;
    const { initData } = this.state
    const { visible } = data;
    const { onSave,onCancel } = on;

    const onm = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'MManage/matype',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreeMaterialData:a
            })
          }
        });
        dispatch({
          type:'MManage/fetchMata',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'MManage/fetchMata',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
                material_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'MManage/fetchMata',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
                material_id:obj.id
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { MaterialConditions,material_id } = this.state;
        const param = {
          id:material_id,
          ...obj
        };
        if(MaterialConditions.length){
          dispatch({
            type:'MManage/fetchMata',
            payload:{
              conditions:MaterialConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'MManage/fetchMata',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys.length || !selectedRows.length){
          return
        }
        let ucumId = null;
        let ucumname = '';
        const nameList = selectedRows.map(item =>{
          ucumId = item.ucumId;
          ucumname = item.ucumname;
          return item.name
        });
        onChange(nameList)
        const { dispatch } = this.props;
        this.setState({
          SelectMaterialValue:nameList,
          selectedMaterialRowKeys:selectedRowKeys,
          ucumId,
          ucumname,
        })
        /*  let conditions = [{
            code:'PROCESSSTATUS',
            exp:'=',
            value:0
          }]
          dispatch({
            type:'MManage/fetchtable',
            payload:{
              conditions,
              pageSize:10000,
              reqData:{
                MATERIAL_BASE_ID:selectedRowKeys[0]
              }
            },
            callback:(res)=>{
              this.setState({superData:res})
            }
          });
          let conditions2 = [{
            code:'PROCESSSTATUS',
            exp:'=',
            value:1
          }]
          dispatch({
            type:'MManage/fetchtable2',
            payload:{
              conditions:conditions2,
              pageSize:10000,
              reqData:{
                MATERIAL_BASE_ID:selectedRowKeys[0]
              }
            },
            callback:(res)=>{
              this.setState({childDataSource:res})
            }
          });*/
      }, //模态框确定时触发
      onCancel:()=>{

      },  //取消时触发
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { code, name } = values;
        if(code || name){
          let conditions = [];
          let codeObj = {};
          let nameObj = {};

          if(code){
            codeObj = {
              code:'code',
              exp:'like',
              value:code
            };
            conditions.push(codeObj)
          }
          if(name){
            nameObj = {
              code:'name',
              exp:'like',
              value:name
            };
            conditions.push(nameObj)
          }
          this.setState({
            MaterialConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'MManage/fetchMata',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
              })
            }
          })
        }else{
          this.setState({
            MaterialConditions:[]
          })
          dispatch({
            type:'MManage/fetchMata',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          MaterialConditions:[]
        })
        dispatch({
          type:'MManage/fetchMata',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        const { form} = this.props;
        //清空输入框
        form.resetFields();
        this.setState({
          SelectMaterialValue:[],
          selectedMaterialRowKeys:[],
          superData:[],
          childDataSource:[]
        })
      }
    };
    const datam = {
      TreeData:this.state.TreeMaterialData, //树的数据
      TableData:this.state.TableMaterialData, //表的数据
      SelectValue:this.state.SelectMaterialValue, //框选中的集合
      selectedRowKeys:this.state.selectedMaterialRowKeys, //右表选中的数据
      placeholder:'请选择物料',
      columns : [
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
          width:1,
        },
      ],
      fetchList:[
        {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
        {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
      ],
      title:'物料选择'
    }

    const onStoreData = {
      TableData:this.state.TableStoreData,
      SelectValue:this.state.SelectStoreValue,
      selectedRowKeys:this.state.selectedStoreRowKeys,
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
        {label:'仓库编号',code:'code',placeholder:'请输入仓库编号'},
        {label:'仓库名称',code:'name',placeholder:'请输入仓库名称'},
      ],
      title:'仓库',
      placeholder:'请选择仓库',
    };
    const onStoreOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'MManage/fetchStore',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            this.setState({
              TableStoreData:res,
            })
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectStoreValue:nameList,
          selectedStoreRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { StoreConditions } = this.state;
        const param = {
          ...obj
        };
        if(StoreConditions.length){
          dispatch({
            type:'MManage/fetchStore',
            payload:{
              conditions:StoreConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableStoreData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'MManage/fetchStore',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableStoreData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        const { code, name } = values;
        if(code || name){
          let conditions = [];
          let codeObj = {};
          let nameObj = {};

          if(code){
            codeObj = {
              code:'code',
              exp:'like',
              value:code
            };
            conditions.push(codeObj)
          }
          if(name){
            nameObj = {
              code:'name',
              exp:'like',
              value:name
            };
            conditions.push(nameObj)
          }
          this.setState({
            StoreConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'MManage/fetchStore',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableStoreData:res,
              })
            }
          })
        }else{
          this.setState({
            StoreConditions:[]
          });
          dispatch({
            type:'MManage/fetchStore',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableStoreData:res
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { pageStore } = this.state;
        this.setState({
          StoreConditions:[]
        });
        dispatch({
          type:'MManage/fetchStore',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableStoreData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectStoreValue:[],
          selectedStoreRowKeys:[],
        })
      }
    };

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
            <Form.Item label='物料'>
              {getFieldDecorator('materialId',{
                initialValue:this.state.SelectMaterialValue,
                rules: [{
                  required: true,
                  message:'请选择物料'
                }]
              })(
                <TreeTable
                  on={onm}
                  data={datam}
                />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="批次号">
              {getFieldDecorator('serial',{
                initialValue:initData?initData.serial:'',
              })(
                <Input placeholder="请输入批次号"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="数量">
              {getFieldDecorator('amount',{
                initialValue:initData?initData.amount:'',
              })( <Input placeholder="请输入数量" type={'number'} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="库位档案">
              {getFieldDecorator('locationId',{
                initialValue:this.state.departmentName
              })(
                <TreeSelect
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                  onFocus={this.onFocusDepartment}
                  onChange={this.onChangDepartment}
                  placeholder="请选择库位档案"
                >
                  {this.renderTreeNodes(this.state.departmentTreeValue)}
                </TreeSelect >
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="仓库">
              {getFieldDecorator('warehouseId', {
                initialValue:this.state.SelectStoreValue,
                rules: [{
                  required: true,
                  message:'请选择仓库'
                }],
              })(<ModelTable
                on={onStoreOn}
                data={onStoreData}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
                initialValue:initData?initData.memo:'',
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default UpdateSelf;

