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
import TreeModelInput from '@/pages/tool/TreeModelInput'

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage
}))
@Form.create()
class AddChild extends PureComponent {
  state = {
    BStatus:false,
    TreeMaterialData:[],//物料
    MaterialConditions:[],
    material_id:null,
    TableMaterialData:[],
    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],

    TableAreaData:[],//工位
    SelectAreaValue:[],
    selectedAreaRowKeys:[],
    AreaConditions:[],

    TableBatchData:[],//批次
    SelectBatchValue:[],
    selectedBatchRowKeys:[],
    BatchConditions:[],

    TreeLeftData:[], //左边树
    TreeRightData:[],//右边树
    SelectValue:[],
    TreeRightKey:[],
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus,selectedAreaRowKeys,selectedMaterialRowKeys,selectedBatchRowKeys,TreeRightKey } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
          cargoId:TreeRightKey.length?Number(TreeRightKey[0]):null,
          amount:values.amount?Number(values.amount):null,
          unit:values.unit?Number(values.unit):null,
          mny:values.mny?Number(values.mny):null,
          materialId:selectedMaterialRowKeys.length?selectedMaterialRowKeys[0]:null,
          batchId:selectedBatchRowKeys.length?selectedBatchRowKeys[0]:null,
          stationId:selectedAreaRowKeys.length?selectedAreaRowKeys[0]:null,
          memo:values.memo,
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

      TableAreaData:[],//工位
      SelectAreaValue:[],
      selectedAreaRowKeys:[],
      AreaConditions:[],

      TreeLeftData:[], //左边树
      TreeRightData:[],//右边树
      SelectValue:[],
      TreeRightKey:[],

      TableBatchData:[],//批次
      SelectBatchValue:[],
      selectedBatchRowKeys:[],
      BatchConditions:[],
    })
  }

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'MManage/kuwei',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        const a = toTree(res.resData);
        this.setState({
          cargoTreeValue:a
        })
      }
    });
  }

  onChangDepartment = (value, label, extra)=>{
    this.setState({
      cargoId:value
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

    const onAreaData = {
      TableData:this.state.TableAreaData,
      SelectValue:this.state.SelectAreaValue,
      selectedRowKeys:this.state.selectedAreaRowKeys,
      columns : [
        {
          title: '工位编号',
          dataIndex: 'code',
        },
        {
          title: '工位名称',
          dataIndex: 'name',
        },
        {
          title: '区域',
          dataIndex: 'productionregionName',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'工位编号',code:'code',placeholder:'请输入工位编号'},
        {label:'工位名称',code:'name',placeholder:'请输入工位名称'},
      ],
      title:'工位',
      placeholder:'请选择工位',
    };
    const onAreaOn = {
      onIconClick:()=>{
        dispatch({
          type:'MManage/fetchAreaWork',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            this.setState({
              TableAreaData:res,
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
          SelectAreaValue:nameList,
          selectedAreaRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { WorkConditions } = this.state;
        const param = {
          ...obj
        };
        if(WorkConditions.length){
          dispatch({
            type:'MManage/fetchAreaWork',
            payload:{
              conditions:WorkConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableAreaData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'MManage/fetchAreaWork',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableAreaData:res,
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
            AreaConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'MManage/fetchAreaWork',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableAreaData:res,
              })
            }
          })
        }else{
          this.setState({
            AreaConditions:[]
          });
          dispatch({
            type:'MManage/fetchAreaWork',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableAreaData:res
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { pageWork } = this.state;
        this.setState({
          AreaConditions:[]
        });
        dispatch({
          type:'MManage/fetchAreaWork',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableAreaData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectAreaValue:[],
          selectedAreaRowKeys:[],
        })
      }
    };

    const onBatchData = {
      TableData:this.state.TableBatchData,
      SelectValue:this.state.SelectBatchValue,
      selectedRowKeys:this.state.selectedBatchRowKeys,
      columns : [
        {
          title: '物料编码',
          dataIndex: 'materialName',
        },
        {
          title: '批次号',
          dataIndex: 'vbatchcode',
        },
        {
          title: '供应商批次号',
          dataIndex: 'vvendbatchcode',
        },
        {
          title: '上次检验日期',
          dataIndex: 'tchecktime',
        },
        {
          title: '质量等级',
          dataIndex: 'cqualitylevelid',
        },
        {
          title: '生产日期',
          dataIndex: 'dproducedate',
        },
        {
          title: '失效日期',
          dataIndex: 'dvalidate',
        },
        {
          title: '封存',
          dataIndex: 'bseal',
        },
        {
          title: '批次形成时间',
          dataIndex: 'tbatchtime',
        },
        {
          title: '在检',
          dataIndex: 'binqc',
        },
        {
          title: '创建批次档案单据类型',
          dataIndex: 'csourcetype',
        },
        {
          title: '创建批次档案单据号',
          dataIndex: 'vsourcebillcode',
        },
        {
          title: '创建批次档案单据行号',
          dataIndex: 'vsourcerowno',
        },
        {
          title: '创建批次档案单据BID',
          dataIndex: 'csourcebid',
        },
        {
          title: '创建批次档案单据HID',
          dataIndex: 'csourcehid',
        },
        {
          title: '集团',
          dataIndex: 'pkGroup',
        },
        {
          title: '版本号',
          dataIndex: 'version',
        },
        {
          title: '散列码',
          dataIndex: 'vhashcode',
        },
        {
          title: '生产批次号',
          dataIndex: 'vprodbatchcode',
        },
        {
          title: '首次入库日期',
          dataIndex: 'dinbounddate',
        },
        {
          title: '备注',
          dataIndex: 'memo',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'批次号',code:'vbatchcode',placeholder:'请输入批次号'},
        {label:'供应商批次号',code:'vvendbatchcode',placeholder:'请输入供应商批次号'},
      ],
      title:'批次档案',
      placeholder:'请选择批次',
    };
    const onBatchOn = {
      onIconClick:()=>{
        dispatch({
          type:'MManage/fetchBatch',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            this.setState({
              TableBatchData:res,
            })
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.vbatchcode
        });
        onChange(nameList)
        this.setState({
          SelectBatchValue:nameList,
          selectedBatchRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { BatchConditions } = this.state;
        const param = {
          ...obj
        };
        if(BatchConditions.length){
          dispatch({
            type:'MManage/fetchBatch',
            payload:{
              conditions:BatchConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableBatchData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'MManage/fetchBatch',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableBatchData:res,
            })
          }
        })
      }, //分页
      handleSearch:(values)=>{
        const { vbatchcode, vvendbatchcode } = values;
        if(vbatchcode || vvendbatchcode){
          let conditions = [];
          let codeObj = {};
          let nameObj = {};

          if(vbatchcode){
            codeObj = {
              code:'vbatchcode',
              exp:'like',
              value:vbatchcode
            };
            conditions.push(codeObj)
          }
          if(vvendbatchcode){
            nameObj = {
              code:'vvendbatchcode',
              exp:'like',
              value:vvendbatchcode
            };
            conditions.push(nameObj)
          }
          this.setState({
            BatchConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'MManage/fetchBatch',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableBatchData:res,
              })
            }
          })
        }else{
          this.setState({
            BatchConditions:[]
          });
          dispatch({
            type:'MManage/fetchBatch',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableBatchData:res
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { pageWork } = this.state;
        this.setState({
          BatchConditions:[]
        });
        dispatch({
          type:'MManage/fetchBatch',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableBatchData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectBatchValue:[],
          selectedBatchRowKeys:[],
        })
      }
    };

    const ons = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'MManage/fetchstore',
          payload: {
            reqData:{
              pageIndex:0,
              pageSize:100000
            }
          },
          callback:(res)=>{
            this.setState({
              TreeLeftData:res
            })
          }
        });
      }, //input聚焦时调用的接口获取信息
      onSelectTreeLeft:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const conditions = [{
            code:'WAREHOUSE_ID',
            exp:'=',
            value:info.selectedNodes[0].props.dataRef.id
          }]
          dispatch({
            type:'MManage/findrespository',
            payload:{
              conditions,
              pageIndex:0,
              pageSize:100000
            },
            callback:(res)=>{
              if(res && res.resData){
                res.resData.map(item=>{
                  item.key = item.id;
                });
                const a = toTree(res.resData);
                this.setState({
                  TreeRightData:a,
                  left_id:info.selectedNodes[0].props.dataRef.id
                })
              }else{
                this.setState({
                  TreeRightData:[],
                  left_id:info.selectedNodes[0].props.dataRef.id
                })
              }
            }
          })
        }else{
          this.setState({
            TreeRightData:[],
            left_id:null
          })
        }
      }, //点击左边的树
      onSelectTreeRight:(selectedKeys, info)=>{
        if(selectedKeys.length){
          //const { name } = info.selectedNodes[0].props.dataRef;
          this.setState({
            TreeRightKey:selectedKeys,
          })
        }else{
          this.setState({
            TreeRightKey:[]
          })
        }
      }, //点击右边的树
      onOk:(selectedKeys, info,clear,onChange)=>{
        function isObjNull(obj) {
          for(let i in obj){
            return true
          }
          return false
        }
        if(!isObjNull(info)){
          clear(1);
          return
        }
        const { name } = info.selectedNodes[0].props.dataRef;
        onChange(name);
        clear(1);
        this.setState({
          SelectValue:[name]
        });
      }, //模态框确定时触发
      onCancel:(clear)=>{
          clear();
          this.setState({
            TreeLeftData:[],
            TreeRightData:[],
            SelectValue:[],
            TreeRightKey:[],
          })
      },  //取消时触发
      onButtonEmpty:(onChange)=>{
        onChange([]);
        this.setState({
          TreeRightKey:[],
          SelectValue:[]
        })
      }
    };
    const datas = {
      TreeLeftData:this.state.TreeLeftData, //树的数据
      TreeRightData:this.state.TreeRightData, //表的数据
      SelectValue:this.state.SelectValue, //框选中的集合
      TreeRightKey:this.state.TreeRightKey,//右边选中的key
      placeholder:'请选择货位',
      leftTitle:'仓库档案',
      rightTitle:'库位档案',
      title:'货位选择'
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
            <Form.Item label="序号">
              {getFieldDecorator('number',{
              })(<Input placeholder="自动生成" disabled/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="数量">
              {getFieldDecorator('amount',{
                rules: [{
                  required: true,
                  message:'请输入数量'
                }]
              })(
                <Input placeholder="请输入数量" type={'number'}/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="批次">
              {getFieldDecorator('batchId',{
              })(<ModelTable
                on={onBatchOn}
                data={onBatchData}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label='物料'>
              {getFieldDecorator('materialId',{
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
            <Form.Item label="单价">
              {getFieldDecorator('unit',{
              })(
                <Input placeholder="请输入批次" type={'number'}/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="金额">
              {getFieldDecorator('mny',{
              })(
                <Input placeholder="请输入金额" type={'number'}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="货位">
              {getFieldDecorator('cargoName',{
                rules: [{
                  required: true,
                  message:'请选择货位'
                }]
              })(
                <TreeModelInput on={ons} data={datas}/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工位">
              {getFieldDecorator('stationId',{
              })(
                <ModelTable
                  on={onAreaOn}
                  data={onAreaData}
                />
              )}
            </Form.Item>
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

export default AddChild;

