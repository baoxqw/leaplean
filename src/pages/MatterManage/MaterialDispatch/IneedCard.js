import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  message,
  Form,
  Table, Button, Input,  Popconfirm, Divider,TreeSelect
} from 'antd';
import NormalTable from '@/components/NormalTable';
import styles from '@/pages/Platform/Sysadmin/UserAdmin.less';
import { toTree } from '@/pages/tool/ToTree';
import NotTreeTable from '@/pages/tool/TreeTable/NotTreeTable';

const { TreeNode } = TreeSelect;

@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage
}))
@Form.create()
class IneedCard extends PureComponent {
  cacheOriginData = {};

  state = {
    BStatus:false,
    data:[],
    dataRows:[],

    TreeOperationData:[],
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

    deptId:[],
    deptTreeValue:[],
    deptName:'',

    TreeMaterialData:[], //存储左边树的数据
    MaterialConditions:[], //存储查询条件
    material_id:null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
    pageMaterial:{},
  };

  componentWillReceiveProps(nextProps) {
    
    if(nextProps.data !== this.props.data){
      this.setState({
        data:nextProps.data,
        dataRows:nextProps.data,
      })
    }
  }

  onSave = (onSave)=>{
    let { BStatus,dataRows } = this.state;
    if(BStatus){
      return
    }


    /*dataRows = dataRows.filter(item =>{
      if(item.psnId && item.deptId){
        return item
      }
    });*/

    let s = false;
    for(let i = 0;i<dataRows.length;i++){
      if(!dataRows[i].pickerId || !dataRows[i].deptId || !dataRows[i].materialId || !dataRows[i].amount){
        s = true;
        break
      }
    }

    if(!dataRows.length || s){
      return message.error("请填写完整数据后提交")
    }

    
    this.setState({
      BStatus:true
    });
    if(typeof onSave === 'function'){
      onSave(dataRows,this.clear);
    }
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
      data:[],
      dataRows:[],
      TreeOperationData:[],
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],

      departmentId:[],
      departmentTreeValue:[],
      departmentName:'',
    })
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `${data.length+1}`,
     // psnName:'',
      pickerName:'',
      number:null,
      amount:null,
      materialName:'',
      //psnId:null,
      pickerId:null,
      materialId:null,
      deptName:'',
      deptId:null,
      memo:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key,onUpdateData) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    if(typeof onUpdateData === 'function'){
      onUpdateData(newData)
    }
    // onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFChange(date,dateString, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = dateString;
      this.setState({ data: newData });
    }
  }

  handleFieldChange(e, fieldName, key,am) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(fieldName === "pickerName"){
       target["pickerId"] = e.pickerId;
       target["pickerName"] = e.pickerName
        this.setState({
          SelectOperationValue:e.pickerName,
          selectedOperationRowKeys:[e.pickerId]
        })
      }
      else if(fieldName === "materialName"){
        target["materialId"] = e.materialId;
        target["materialName"] = e.materialName
        this.setState({
          SelectMaterialValue:e.materialName,
          selectedMaterialRowKeys:[e.materialId]
        })
      }
      else if(fieldName === "deptName"){
        target["deptId"] = e.deptId;
        target["deptName"] = e.deptName;
        this.setState({
          deptId:e.deptId,
          deptName:e.deptName
        })
      }
      else {
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key,onUpdateData) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};

      if(target)
        if ( !target.materialId || !target.deptId || !target.pickerId || !target.amount) {
          message.error('请填写完整信息。');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }

      delete target.isNew;

      this.toggleEditable(e, key);
      const { data } = this.state;
      if(typeof onUpdateData === 'function'){
        onUpdateData(data)
      }
      // const { onChange } = this.props;
      // onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  onUpdateData = (res)=>{
    this.setState({
      dataRows:res
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
          deptTreeValue:a
        })
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      datas,
      on,
    } = this.props;

    const { visible } = datas;
    const { onSave,onCancel } = on;

    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        render: (text, record) => {
          if (record.editable) {
            return <Input
              placeholder={"序号"}
              value={text}
              /*onChange={e => this.handleFieldChange(e, 'number', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}*/
              disabled
            />
          }
          return text;
        },
      },
      {
        title: '物料编码',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text, record) => {
          /*const on = {
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
              }
            }, //点击左边的树
            handleTableChange:(obj)=>{
              const { dispatch } = this.props;
              const { MaterialConditions,material_id } = this.state;
              const param = {
                id:material_id,
                ...obj
              };
              this.setState({
                pageMaterial:param
              })
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
            onOk:(selectedRowKeys,selectedRows)=>{
              if(!selectedRowKeys || !selectedRows){
                return
              }
              const nameList = selectedRows.map(item =>{
                return item.name
              });

              this.handleFieldChange({materialId:selectedRowKeys[0],materialName:nameList[0],}, 'materialName', record.key)
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
                    pageSize:10
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
              const { pageMaterial } = this.state;
              this.setState({
                MaterialConditions:[]
              })
              dispatch({
                type:'MManage/fetchMata',
                payload:{
                  ...pageMaterial
                },
                callback:(res)=>{
                  this.setState({
                    TableMaterialData:res,
                  })
                }
              })
            }, //清空时触发
            onButtonEmpty:()=>{
              this.setState({
                SelectMaterialValue:[],
                selectedMaterialRowKeys:[],
              })
            }
          };
          const datasd = {
            TreeData:this.state.TreeMaterialData, //树的数据
            TableData:this.state.TableMaterialData, //表的数据
            SelectValue:text, //框选中的集合
            selectedRowKeys:[record.materialId], //右表选中的数据
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
                key: 'caozuo',
                width:1
              },
            ],
            fetchList:[
              {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
              {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
            ],
            title:'物料选择'
          }
          if (record.editable) {
            return <NotTreeTable
              on={on}
              data={datasd}
            />
          }
          return text;*/
          if (record.editable) {
            return <Input
              placeholder={"物料名称"}
              value={text}
              disabled
            />
          }
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'amount',
        render: (text, record) => {
          if (record.editable) {
            return <Input
              placeholder={"数量"}
              type={'Number'}
              value={text}
              /*onChange={e => this.handleFieldChange(e, 'amount', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}*/
              disabled
            />
          }
          return text;
        },
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        render: (text, record) => {
          if (record.editable) {
            return <TreeSelect
              value={text}
              treeDefaultExpandAll
              style={{ width: '100%' }}
              onFocus={this.onFocusDepartment}
              onChange={(value, label, extra)=>{
                this.handleFieldChange({deptId:value,deptName:label[0]}, 'deptName', record.key)
              }}
              placeholder="请选择负责部门"
            >
              {this.renderTreeNodes(this.state.deptTreeValue)}
            </TreeSelect >
          }
          return text;
        },
      },
      {
        title: '领料人',
        dataIndex: 'pickerName',
        render: (text, record) => {
          const ons = {
            onIconClick:()=>{
              const { dispatch } = this.props;
              dispatch({
                type:'MManage/newdata',
                payload: {
                  reqData:{}
                },
                callback:(res)=>{
                  const a = toTree(res.resData);
                  this.setState({
                    TreeOperationData:a
                  })
                }
              });
              dispatch({
                type:'MManage/fetchTable',
                payload:{
                  pageIndex:0,
                  pageSize:10,
                },
                callback:(res)=>{
                  this.setState({
                    TableOperationData:res,
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
                  type:'MManage/fetchTable',
                  payload:obj,
                  callback:(res)=>{
                    this.setState({
                      TableOperationData:res,
                      operation_id:obj.id
                    })
                  }
                })
              }else{
                dispatch({
                  type:'MManage/fetchTable',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableOperationData:res,
                      operation_id:null
                    })
                  }
                })
              }
            }, //点击左边的树
            handleTableChange:(obj)=>{
              const { dispatch } = this.props;
              const { OperationConditions,operation_id } = this.state;
              const param = {
                id:operation_id,
                ...obj
              };
              if(OperationConditions.length){
                dispatch({
                  type:'MManage/fetchTable',
                  payload:{
                    conditions:OperationConditions,
                    ...obj,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableOperationData:res,
                    })
                  }
                });
                return
              }
              dispatch({
                type:'MManage/fetchTable',
                payload:param,
                callback:(res)=>{
                  this.setState({
                    TableOperationData:res,
                  })
                }
              })
            }, //分页
            onOk:(selectedRowKeys,selectedRows)=>{
              if(!selectedRowKeys || !selectedRows){
                return
              }
              const nameList = selectedRows.map(item =>{
                return item.name
              });
              this.handleFieldChange({pickerName:nameList[0],pickerId:selectedRowKeys[0]}, 'pickerName', record.key)
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
                  OperationConditions:conditions
                })
                const obj = {
                  pageIndex:0,
                  pageSize:10,
                  conditions,
                };
                dispatch({
                  type:'MManage/fetchTable',
                  payload:obj,
                  callback:(res)=>{
                    this.setState({
                      TableOperationData:res,
                    })
                  }
                })
              }else{
                this.setState({
                  OperationConditions:[]
                })
                dispatch({
                  type:'MManage/fetchTable',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableOperationData:res,
                    })
                  }
                })
              }
            }, //查询时触发
            handleReset:()=>{
              this.setState({
                OperationConditions:[]
              })
              dispatch({
                type:'MManage/fetchTable',
                payload:{
                  pageIndex:0,
                  pageSize:10,
                },
                callback:(res)=>{
                  this.setState({
                    TableOperationData:res,
                  })
                }
              })
            }, //清空时触发
            onButtonEmpty:(onChange)=>{
              onChange([]);
              this.setState({
                SelectOperationValue:[],
                selectedOperationRowKeys:[],
              })
            }
          };
          const datas = {
            TreeData:this.state.TreeOperationData,
            TableData:this.state.TableOperationData,
            SelectValue:text?text:[],
            selectedRowKeys:[record.pickerId],
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
              {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
              {label:'人员姓名',code:'name',placeholder:'请输入人员姓名'},
            ],
            title:'领料人'
          }
          if (record.editable) {
            return (
              <NotTreeTable
                on={ons}
                data={datas}
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key,this.onUpdateData)}>添加</a>
                  {/*<Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,this.onUpdateData)}>
                    <a>删除</a>
                  </Popconfirm>*/}
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key,this.onUpdateData)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              {/*<Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,this.onUpdateData)}>
                <a>删除</a>
              </Popconfirm>*/}
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Modal
        title={"申请单"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <div >
          <NormalTable
            style={{marginTop:'8px'}}
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName={record => (record.editable ? styles.editable : '')}
            scroll={{x:columns.length*80}}
          />
          {/*<Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            新增信息
          </Button>*/}

        </div>
      </Modal>
    );
  }
}

export default IneedCard;
