import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Modal ,
  Button,
  Checkbox,
  Card,
  message,
  Radio,
  TreeSelect,
  Popconfirm,
} from 'antd';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';
import moment from 'moment'
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;

@connect(({ porder,loading }) => ({
  porder,
  loading:loading.models.porder
}))
@Form.create()
class ProductOrderAdd extends PureComponent {
  state = {

    TableWorkData:[],//工作中心
    SelectWorkValue:[],
    selectedWorkRowKeys:[],
    WorkConditions:[],

    TreePersonData:[], //制单人--存储左边树的数据
    PersonConditions:[], //存储查询条件
    person_id:null, //存储立项人左边数点击时的id  分页时使用
    TablePersonData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectPersonValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedPersonRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id

    TreeMaterialData:[], //物料编码--存储左边树的数据
    MaterialConditions:[], //存储查询条件
    material_id:null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id

    ucumname:'',
    ucumId:'',

    //计量单位
    TableData:[],
    SelectValue:'',
    selectedRowKeys:[],
    Jconditions:[],

    TablePData:[],
    SelectPValue:'',
    selectedPRowKeys:[],
    Pconditions:[],
    Pperson_id:null,

    BStatus:false
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { selectedWorkRowKeys,selectedMaterialRowKeys,selectedPersonRowKeys,BStatus } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        code:values.code,
        ordernum:values.ordernum?Number(values.ordernum):null,
        finishnum:values.finishnum?Number(values.finishnum):null,
        planstarttime:values.planstarttime?values.planstarttime.format('YYYY-MM-DD'):'',
        planendtime:values.planendtime?values.planendtime.format('YYYY-MM-DD'):'',
        actstarttime:values.actstarttime?values.actstarttime.format('YYYY-MM-DD'):'',
        actendtime:values.actendtime?values.actendtime.format('YYYY-MM-DD'):'',
        createdate:values.createdate?values.createdate.format('YYYY-MM-DD'):'',
        materialBaseId:selectedMaterialRowKeys.length?selectedMaterialRowKeys[0]:null,
        billmakerId:selectedPersonRowKeys.length?selectedPersonRowKeys[0]:null,
        workcenterId:selectedWorkRowKeys.length?selectedWorkRowKeys[0]:null,
        orderstatus:values.orderstatus,
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
      TableWorkData:[],//工作中心
      SelectWorkValue:[],
      selectedWorkRowKeys:[],
      WorkConditions:[],//工作中心查询条件

      TreePersonData:[], //制单人--存储左边树的数据
      PersonConditions:[], //存储查询条件
      person_id:null, //存储立项人左边数点击时的id  分页时使用
      TablePersonData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectPersonValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedPersonRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id

      TreeMaterialData:[], //物料编码--存储左边树的数据
      MaterialConditions:[], //存储查询条件
      material_id:null, //存储立项人左边数点击时的id  分页时使用
      TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id

      ucumname:'',
      ucumId:'',

      //计量单位
      TableData:[],
      SelectValue:'',
      selectedRowKeys:[],
      Jconditions:[],

      TablePData:[],
      SelectPValue:'',
      selectedPRowKeys:[],
      Pconditions:[],
      Pperson_id:null,

      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      data,
      on,
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;

    const onWorkData = {
      TableData:this.state.TableWorkData,
      SelectValue:this.state.SelectWorkValue,
      selectedRowKeys:this.state.selectedWorkRowKeys,
      columns : [
        {
          title: '工作中心编号',
          dataIndex: 'code',
        },
        {
          title: '工作中心名称',
          dataIndex: 'name',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'工作中心编号',code:'code',placeholder:'请输入工作中心编号'},
        {label:'工作中心名称',code:'name',placeholder:'请输入工作中心名称'},
      ],
      title:'工作中心',
      placeholder:'请选择工作中心编码',
    };
    const onWordOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'porder/fetchWork',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            
            if(res){
              this.setState({
                TableWorkData:res,
              })
            }
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
          SelectWorkValue:nameList,
          selectedWorkRowKeys:selectedRowKeys,
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
            type:'porder/fetchWork',
            payload:{
              conditions:WorkConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'porder/fetchWork',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
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
            WorkConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'porder/fetchWork',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          })
        }else{
          this.setState({
            WorkConditions:[],
          });
          dispatch({
            type:'porder/fetchWork',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          WorkConditions:[]
        });
        dispatch({
          type:'porder/fetchWork',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectWorkValue:[],
          selectedWorkRowKeys:[],
        })
      }
    };

    const ons = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'porder/matype',
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
          type:'porder/fetchMata',
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
        if(info.selectedNodes.length){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'porder/fetchMata',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
                material_id:obj.id
              })
            }
          })
        }else{
          const obj = {
            pageIndex:0,
            pageSize:10,
          }
          dispatch({
            type:'porder/fetchMata',
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
        if(MaterialConditions.length){
          dispatch({
            type:'porder/fetchMata',
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
          type:'porder/fetchMata',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
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
        this.setState({
          SelectMaterialValue:nameList,
          ucumId,
          ucumname,
          selectedMaterialRowKeys:selectedRowKeys,
        })
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
            type:'porder/fetchMata',
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
            type:'porder/fetchMata',
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
          type:'porder/fetchMata',
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
        this.setState({
          SelectMaterialValue:[],
          selectedMaterialRowKeys:[],
        })
      },
      onAdd:(form)=>{
        const on = {
          onIconClick:()=>{
            const { dispatch } = this.props;
            dispatch({
              type:'porder/fetchUcum',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              },
              callback:(res)=>{
                if(res){
                  this.setState({
                    TableData:res,
                  })
                }
              }
            })
          },
          onOk:(selectedRowKeys,selectedRows)=>{
            if(!selectedRowKeys || !selectedRows){
              return
            }

            const nameList = selectedRows.map(item =>{
              return item.name
            });
            this.setState({
              SelectValue:nameList,
              selectedRowKeys:selectedRowKeys,
            })
          },
          handleTableChange:(obj)=>{
            const { dispatch } = this.props;
            const { Jconditions } = this.state;
            const param = {
              ...obj
            };
            this.setState({
              Jpage:param
            });
            if(Jconditions.length){
              dispatch({
                type:'porder/fetchUcum',
                payload:{
                  conditions:Jconditions,
                  ...obj,
                },
                callback:(res)=>{
                  this.setState({
                    TableData:res,
                  })
                }
              });
              return
            }
            dispatch({
              type:'porder/fetchUcum',
              payload:param,
              callback:(res)=>{
                this.setState({
                  TableData:res,
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
                Jconditions:conditions,
              });
              const obj = {
                conditions,
              };
              dispatch({
                type:'porder/fetchUcum',
                payload:obj,
                callback:(res)=>{
                  this.setState({
                    TableData:res,
                  })
                }
              })
            }
          }, //查询时触发
          handleReset:()=>{
            const { Jpage } = this.state;
            this.setState({
              Jconditions:[]
            });
            dispatch({
              type:'porder/fetchUcum',
              payload:{
                ...Jpage
              },
              callback:(res)=>{
                this.setState({
                  TableData:res,
                })
              }
            })
          }, //清空时触发
          onButtonEmpty:()=>{
            this.setState({
              SelectValue:[],
              selectedRowKeys:[],
            })
          }
        };
        const onData = {
          TableData:this.state.TableData,
          SelectValue:this.state.SelectValue,
          selectedRowKeys:this.state.selectedRowKeys,
          columns :[
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
              render:(text)=>{
                return <Checkbox checked={text}/>
              }
            },
            {
              title: '换算率（与量纲基本单位）',
              dataIndex: 'conversionrate',
            },
            {
              title: '操作',
              dataIndex: 'caozuo',
            }
          ],
          fetchList:[
            {label:'编码',code:'code',placeholder:'请输入区域编号'},
            {label:'名称',code:'name',placeholder:'请输入区域名称'},
          ],
          title:'计量单位',
          placeholder:'请选择计量单位',
        };
        return <Form layout="vertical" >
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料编码'>
                {form.getFieldDecorator('code', {
                  // rules: [{ required: true}],
                })(<Input placeholder='请输入物料编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料名称'>
                {form.getFieldDecorator('name', {
                  // rules: [{ required: true}],
                })(<Input placeholder='请输入物料名称' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='规格'>
                {form.getFieldDecorator('spec', {
                  // rules: [{ required: true}],
                })(<Input placeholder='请输入规格' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='型号'>
                {form.getFieldDecorator('model', {
                  // rules: [{ required: true}],
                })(<Input placeholder='请输入型号' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='计量单位'>
                {form.getFieldDecorator('ucumId', {
                  // rules: [{ required: true }],
                })(<ModelTable
                  data={onData}
                  on={on}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料简称'>
                {form.getFieldDecorator('materialshortname', {
                  rules: [
                    { required: true }
                  ]
                })(<Input placeholder='请输入物料简称' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料条码'>
                {form.getFieldDecorator('materialbarcode', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入物料条码'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料助记码'>
                {form.getFieldDecorator('materialmnecode', {
                  rules: [{ required: true }],
                })(<Input placeholder='请输入物料助记码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='图号'>
                {form.getFieldDecorator('graphid', {
                  rules: [
                    { required: true},
                  ],
                })(<Input placeholder='图号' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="备注">
                {form.getFieldDecorator('memo',{
                })(<TextArea rows={3}placeholder={'请输入备注'}/>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      },
      onAddOk:(values)=>{

        const { selectedRowKeys,material_id } = this.state;
        const { code,name,spec,model,materialshortname,materialbarcode,materialmnecode,graphid,memo} = values;
        const { dispatch } = this.props;
        return new Promise((resolve, reject) => {
          dispatch({
            type:'porder/addWuLiao',
            payload:{
              reqData:{
                invclId:material_id,
                code,
                name,
                spec,
                model,
                materialshortname,
                materialbarcode,
                materialmnecode,
                graphid,
                memo,
                ucumId:selectedRowKeys[0]
              }
            },
            callback:(res)=>{
              if(res.errMsg === "成功"){
                dispatch({
                  type:'porder/fetchMata',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                    id:material_id
                  },
                  callback:(res)=>{
                    this.setState({
                      TableMaterialData:res,
                      TableData:[],
                      SelectValue:'',
                      selectedRowKeys:[],
                      Jpage:{},
                      Jconditions:[]
                    })
                    resolve()
                  }
                })
              }else{
                reject()
              }
            }
          })
        })
      },
      onAddCancel:()=>{
        this.setState({
          TableData:[],
          SelectValue:'',
          selectedRowKeys:[],
          Jpage:{},
          Jconditions:[]
        })
      }
    };
    const datas = {
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
          width:120
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
          width:120
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          width:120
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
          width:120
        },
        {
          title: '计量单位',
          dataIndex: 'ucumName',
          key: 'ucumName',
          width:120
        },
        {
          title: '物料简称',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
          width:120
        },
        {
          title: '物料条形码',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
          width:120
        },
        {
          title: '物料助记器',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
          width:120
        },
        {
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
          width:120
        },
       /* {
          title: '操作',
          dataIndex: 'operation',
        },*/
      ],
      fetchList:[
        {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
        {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
      ],
      title:'物料选择',
      add:true
    };

    const personDatas = {
      TreeData:this.state.TreePersonData, //树的数据
      TableData:this.state.TablePersonData, //表的数据
      SelectValue:this.state.SelectPersonValue, //框选中的集合
      selectedRowKeys:this.state.selectedPersonRowKeys, //右表选中的数据
      placeholder:'请选择制单人',
      columns :[
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
          dataIndex: 'operation',
          width:1
        },
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'人员名称',code:'name',placeholder:'请输入人员名称'},
      ],
      title:'人员选择',
      add:true
    };
    const personOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'porder/fetchonPerson',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreePersonData:a
            })
          }
        });
        dispatch({
          type:'porder/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes.length){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'porder/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
                person_id:obj.id
              })
            }
          })
        }else{
          const obj = {
            pageIndex:0,
            pageSize:10,
          }
          dispatch({
            type:'porder/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { PersonConditions,person_id } = this.state;
        const param = {
          id:person_id,
          ...obj
        };
        if(PersonConditions.length){
          dispatch({
            type:'porder/fetchTable',
            payload:{
              conditions:PersonConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'porder/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectPersonValue:nameList,
          selectedPersonRowKeys:selectedRowKeys,
        })
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
            PersonConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'porder/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }else{
          this.setState({
            PersonConditions:[]
          })
          dispatch({
            type:'porder/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          PersonConditions:[]
        })
        dispatch({
          type:'porder/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectPersonValue:[],
          selectedPersonRowKeys:[],
        })
      },
      onAdd:(form,info)=>{
        const on = {
          onIconClick:()=>{
            const { dispatch } = this.props;
            dispatch({
              type:'porder/fetchPerson',
              payload:{
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{
                this.setState({
                  TablePData:res,
                })
              }
            })
          }, //input聚焦时调用的接口获取信息
          handleTableChange:(obj)=>{
            const { dispatch } = this.props;
            const { Pconditions,Pperson_id } = this.state;
            const param = {
              id:Pperson_id,
              ...obj
            };
            this.setState({
              Ppage:param
            })
            if(Pconditions.length){
              dispatch({
                type:'porder/fetchPerson',
                payload:{
                  conditions:Pconditions,
                  ...obj,
                },
                callback:(res)=>{
                  this.setState({
                    TablePData:res,
                  })
                }
              });
              return
            }
            dispatch({
              type:'porder/fetchPerson',
              payload:param,
              callback:(res)=>{
                this.setState({
                  TablePData:res,
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
           
            this.setState({
              SelectPValue:nameList,
              selectedPRowKeys:selectedRowKeys,
            })
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
                Pconditions:conditions
              })
              const obj = {
                conditions,
              };
              
              dispatch({
                type:'porder/fetchPerson',
                payload:obj,
                callback:(res)=>{
                  this.setState({
                    TablePData:res,
                  })
                }
              })
            }
          }, //查询时触发
          handleReset:()=>{
            const { Ppage } = this.state;
            this.setState({
              Pconditions:[]
            })
            dispatch({
              type:'porder/fetchPerson',
              payload:{
                ...Ppage
              },
              callback:(res)=>{
                this.setState({
                  TablePData:res,
                })
              }
            })
          }, //清空时触发
          onButtonEmpty:()=>{
            this.setState({
              SelectPValue:[],
              selectedPRowKeys:[],
            })
          }
        };
        const data = {
          TableData:this.state.TablePData, //表的数据
          SelectValue:this.state.SelectPValue, //框选中的集合
          selectedRowKeys:this.state.selectedPRowKeys, //右表选中的数据
          placeholder:'请选择关联人',
          columns:[
            {
              title: '编码',
              dataIndex: 'code',
              key: 'code',
            },
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',

            }
          ],
          fetchList:[
            {label:'编码',code:'code',placeholder:'请输入编码'},
            {label:'姓名',code:'name',placeholder:'请输入姓名'},
          ],
          title:'关联人选择'
        };
        return <Form layout="vertical" >
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='人员编码'>
                {form.getFieldDecorator('code', {
                  rules: [{ required: true, message: '人员编码'}],
                })(<Input placeholder='人员编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='姓名'>
                {form.getFieldDecorator('name', {
                  rules: [{ required: true, message:'姓名' }],
                })(<Input placeholder='请输入姓名' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='曾用名'>
                {form.getFieldDecorator('usedname', {
                  // rules: [{ required: true, message:'曾用名' }],
                })(<Input placeholder='曾用名' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='紧急联系人'>
                {form.getFieldDecorator('urgpsn', {
                  // rules: [{ required: true, message: '紧急联系人'}],
                })(<Input placeholder='紧急联系人' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='紧急联系电话'>
                {form.getFieldDecorator('urgphone', {
                  // rules: [{ required: true, message:'紧急联系电话' }],
                })(<Input placeholder='请输入紧急联系电话' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='手机'>
                {form.getFieldDecorator('mobile', {
                  rules: [
                    { required: true, message:'手机' },
                    {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '请输入正确手机号',
                    },
                  ],
                })(<Input placeholder='手机' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='部门'>
                {form.getFieldDecorator('dept_name', {
                  initialValue:info.selectedNodes && info.selectedNodes.length?info.selectedNodes[0].props.dataRef.name:'',
                  // rules: [{ required: true, message:'部门' }],
                })(<Input placeholder='选择部门'  disabled/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='电话'>
                {form.getFieldDecorator('phone', {
                  // rules: [{ required: true, message:'电话' }],
                })(<Input placeholder='电话' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='email'>
                {form.getFieldDecorator('email', {
                  rules: [
                    { required: true, message:'email' },
                    {
                      pattern: /^[a-z0-9][\w\-\.]{2,29}@[a-z0-9\-]{2,67}(\.[a-z\u2E80-\u9FFF]{2,6})+$/,
                      message: '请输入正确邮箱',
                    },
                  ],
                })(<Input placeholder='email' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='生日'>
                {form.getFieldDecorator('birthdate', {
                  rules: [{ required: true, message:'出生日期' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择生日" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='性别'>
                {form.getFieldDecorator('sex', {
                  rules: [{ required: true}],
                })(<Select placeholder='是否封存'>
                  <Option value={'男'}>男</Option>
                  <Option value={'女'}>女</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='是否封存'>
                {form.getFieldDecorator('sealed', {
                  rules: [{ required: true, message:'是否封存' }],
                })( <Select placeholder='是否封存'>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='人员类别'>
                {form.getFieldDecorator('psntype',{
                  rules:[{required:true,message:'人员类别'}]
                })( <Select placeholder='人员类别'>
                  <Option value={1}>在职</Option>
                  <Option value={2}>离职</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='部门位置'>
                {form.getFieldDecorator('address',{
                  // rules:[{required:true,message:'部门位置'}]
                })(<Input placeholder='请输入部门位置' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='邮编'>
                {form.getFieldDecorator('zipcode',{
                  // rules:[{required:true,message:'邮编'}]
                })(<Input placeholder='请输入邮编' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='身份证号'>
                {form.getFieldDecorator('personalid',{
                  rules:[
                    {required:true,message:'身份证号'},
                    {
                      pattern: /^(\d{17}|\d{14})[\dx]$/,
                      message: '请输入正确身份证号',
                    },
                  ]
                })(<Input placeholder='身份证号' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='关联用户'>
                {form.getFieldDecorator('user_name',{
                  // rules:[{required:true}],
                  initialValue: this.state.selectedPRowKeys
                })(<ModelTable
                  on={on}
                  data={data}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label={'备注'}>
                {form.getFieldDecorator('memo',{
                  // rules:[{required:true,message:'备注'}]
                })(<TextArea />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      },
      onAddOk:(values)=>{
        const { dispatch } = this.props;
        const { person_id } = this.state;
        return new Promise((resolve, reject) => {
          dispatch({
            type:'porder/addadd',
            payload:{
              reqData:{
                ...values,
                dept_id:person_id,
                'birthdate': values['birthdate'].format('YYYY-MM-DD'),
                user_id:this.state.selectedPRowKeys[0],
              }
            },
            callback:(res)=>{
              if(res.errMsg === "成功"){
                dispatch({
                  type:'porder/fetchTable',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                    id:person_id
                  },
                  callback:(res)=>{
                    this.setState({
                      TablePersonData:res,
                      TablePData:[],
                      SelectPValue:'',
                      selectedPRowKeys:[],
                      Pconditions:[],
                      Ppage:{},
                    })
                    resolve()
                  }
                })
              }else{
                reject()
              }
            }
          })
        })
      },
      onAddCancel:()=>{
        this.setState({
          TablePData:[],
          SelectPValue:'',
          selectedPRowKeys:[],
          Pconditions:[],
          Ppage:{},
        })
      },
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
            <Form.Item label="订单编码">
              {getFieldDecorator('code',{
                rules: [{required: true,message:'订单编码'}]
              })(<Input placeholder="请输入订单编码" />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="物料编码">
              {getFieldDecorator('materialBaseName', {
                rules: [
                  {
                    required: true,
                    message:'物料编码'
                  }
                ],
              })(<TreeTable
                on={ons}
                data={datas}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="订单数量">
              {getFieldDecorator('ordernum',{
                rules: [{required: true}],
              })(<Input placeholder="请输入订单数量" type={'Number'}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="完工数量">
              {getFieldDecorator('finishnum', {
              })(<Input placeholder="请输入完工数量" type={'Number'}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="计划开工时间">
              {getFieldDecorator('planstarttime', {
                rules: [{
                  required: true,
                  message:'计划开工时间'
                }],
              })(<DatePicker  style={{width:'100%'}}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="计划完工时间">
              {getFieldDecorator('planendtime', {
                rules: [{
                  required: true,
                  message:'计划完工时间'
                }],
              })(<DatePicker  style={{width:'100%'}}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工作中心">
              {getFieldDecorator('workcenterName', {
                rules: [
                  {
                    required: true,
                    message:'工作中心'
                  }
                ],
              })(<ModelTable
                on={onWordOn}
                data={onWorkData}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="实际开工时间">
              {getFieldDecorator('actstarttime', {
              })(<DatePicker  style={{width:'100%'}}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="实际完工时间">
              {getFieldDecorator('actendtime', {
              })(<DatePicker style={{width:'100%'}}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="制单人">
              {getFieldDecorator('billmakerName',{
                rules: [{required: true,message:'制单人'}],
              })(<TreeTable
                on={personOn}
                data={personDatas}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="订单创建日期">
              {getFieldDecorator('createdate', {
                initialValue:moment(new Date(),'YYYY-MM-DD')
              })(<DatePicker  style={{width:'100%'}}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="订单状态">
              {getFieldDecorator('orderstatus', {
                initialValue:0
              })( <Select style={{width:'100%'}} placeholder="请选择订单状态">
                <Option value={0}>初始状态</Option>
              </Select>)}
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

export default ProductOrderAdd;

