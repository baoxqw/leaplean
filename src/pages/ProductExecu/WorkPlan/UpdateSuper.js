import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  DatePicker,
  Divider,
  Button,
  Card,
  Tabs,
  Icon,
  Checkbox,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import moment from '../../PlanManagement/ProductOrder/ProductOrderAdd';
import momentt from 'moment'
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ workplan,loading }) => ({
  workplan,
  loading: loading.models.workplan,
}))
@Form.create()
class UpdateSuper extends PureComponent {
  state = {
    //工作中心
    TableWorkData:[],
    SelectWorkValue:[],
    selectedWorkRowKeys:[],
    WorkConditions:[],
    //加工人
    TreeProcesspsnData:[],
    ProcesspsnConditions:[],
    Processpsn_id:null,
    TableProcesspsnData:[],
    SelectProcesspsnValue:[],
    selectedProcesspsnRowKeys:[],
    //检验人
    TreeCheckpsnData:[],
    CheckpsnConditions:[],
    Checkpsn_id:null,
    TableCheckpsnData:[],
    SelectCheckpsnValue:[],
    selectedCheckpsnRowKeys:[],
    //首检人
    TreeFirstcheckpsnData:[],
    FirstcheckpsnConditions:[],
    Firstcheckpsn_id:null,
    TableFirstcheckpsnData:[],
    SelectFirstcheckpsnValue:[],
    selectedFirstcheckpsnRowKeys:[],
    //互检人
    TreeEachothercheckpsnData:[],
    EachothercheckpsnConditions:[],
    Eachothercheckpsn_id:null,
    TableEachothercheckpsnData:[],
    SelectEachothercheckpsnValue:[],
    selectedEachothercheckpsnRowKeys:[],
    //负责人
    TreePrincipalpsnData:[],
    PrincipalpsnConditions:[],
    Principalpsn_id:null,
    TablePrincipalpsnData:[],
    SelectPrincipalpsnValue:[],
    selectedPrincipalpsnRowKeys:[],


    record:{},
    BStatus:false
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.record !== this.props.data.record){
      const record = nextProps.data.record;
      this.setState({
        record,
        selectedWorkRowKeys:[record.workcenterId],
        SelectWorkValue:record.workcenterName,

        selectedProcesspsnRowKeys:[record.processpsnId],
        SelectProcesspsnValue:record.processpsnName,

        SelectCheckpsnValue:record.checkpsnName,
        selectedCheckpsnRowKeys:[record.checkpsnId],

        SelectFirstcheckpsnValue:record.firstcheckpsnName,
        selectedFirstcheckpsnRowKeys:[record.firstcheckpsnId],

        SelectEachothercheckpsnValue:record.eachothercheckpsnName,
        selectedEachothercheckpsnRowKeys:[record.eachothercheckpsnId],

        SelectPrincipalpsnValue:record.principalpsnName,
        selectedPrincipalpsnRowKeys:[record.principalpsnId],

      })
    }
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { BStatus,selectedWorkRowKeys,selectedProcesspsnRowKeys,selectedFirstcheckpsnRowKeys,
      selectedCheckpsnRowKeys,selectedEachothercheckpsnRowKeys,selectedPrincipalpsnRowKeys,record } = this.state;
    if(BStatus){
      return
    }
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
      if(BStatus){
        return
      }
      this.setState({
        BStatus:true
      })
     let obj = {
       reqData:{
         id:record.id,
         technologyBId:record.technologyBId,
         techprocesscardId:record.techprocesscardId,
         processplanName:record.processplanName,
         processplanCode:record.processplanCode,
         processstatus:0,
         workcenterId:selectedWorkRowKeys[0],//工作中心id
         productnum:values.productnum?Number(values.productnum):null,
         qualifiednum:values.qualifiednum?Number(values.qualifiednum):null,
         unqualifiednum:values.unqualifiednum?Number(values.unqualifiednum):null,
         manhour:values.manhour?Number(values.manhour):null,
         preparehour:values.preparehour?Number(values.preparehour):null,
         actualhour:values.actualhour?Number(values.actualhour):null,
         processpsnId:selectedProcesspsnRowKeys.length?selectedProcesspsnRowKeys[0]:null,//加工人id
         checkpsnId:selectedCheckpsnRowKeys.length?selectedCheckpsnRowKeys[0]:null,//检验人id
         checkbillId:values.checkbillId?Number(values.checkbillId):null,
         firstcheckpsnId:selectedFirstcheckpsnRowKeys.length?selectedFirstcheckpsnRowKeys[0]:null,//首检人id
         eachothercheckpsnId:selectedEachothercheckpsnRowKeys.length?selectedEachothercheckpsnRowKeys[0]:null,//互检人id
         principalpsnId:selectedPrincipalpsnRowKeys.length?selectedPrincipalpsnRowKeys[0]:null,//负责人id
         checknum:values.checknum?Number(values.checknum):null,
         scrapnum:values.scrapnum?Number(values.scrapnum):null,
         processdate:values.processdate?(values.processdate).format('YYYY-MM-DD'):'',
         checkdate:values.checkdate?(values.checkdate).format('YYYY-MM-DD'):'',
         firstcheckdate:values.firstcheckdate?(values.firstcheckdate).format('YYYY-MM-DD'):'',
         eachothercheckdate:values.eachothercheckdate?(values.eachothercheckdate).format('YYYY-MM-DD'):'',
         billdate:values.billdate?(values.billdate).format('YYYY-MM-DD'):'',
         planstarttime:values.planstarttime?(values.planstarttime).format('YYYY-MM-DD'):'',
         actstarttime:values.actstarttime?(values.actstarttime).format('YYYY-MM-DD'):'',
         actendtime:values.actendtime?(values.actendtime).format('YYYY-MM-DD'):'',
         planendtime:values.planendtime?(values.planendtime).format('YYYY-MM-DD'):'',
         actstarttimerecently:values.actstarttimerecently?(values.actstarttimerecently).format('YYYY-MM-DD'):'',
       }
     }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

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
      TableWorkData:[],
      SelectWorkValue:[],
      selectedWorkRowKeys:[],
      WorkConditions:[],

      TreeOperationData:[],
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],

      TreeCheckpsnData:[],
      CheckpsnConditions:[],
      Checkpsn_id:null,
      TableCheckpsnData:[],
      SelectCheckpsnValue:[],
      selectedCheckpsnRowKeys:[],

      TreeFirstcheckpsnData:[],
      FirstcheckpsnConditions:[],
      Firstcheckpsn_id:null,
      TableFirstcheckpsnData:[],
      SelectFirstcheckpsnValue:[],
      selectedFirstcheckpsnRowKeys:[],

      TreeEachothercheckpsnData:[],
      EachothercheckpsnConditions:[],
      Eachothercheckpsn_id:null,
      TableEachothercheckpsnData:[],
      SelectEachothercheckpsnValue:[],
      selectedEachothercheckpsnRowKeys:[],

      TreePrincipalpsnData:[],
      PrincipalpsnConditions:[],
      Principalpsn_id:null,
      TablePrincipalpsnData:[],
      SelectPrincipalpsnValue:[],
      selectedPrincipalpsnRowKeys:[],

      record:{},
      BStatus:false
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data,
      dispatch
    } = this.props;
    const { visible } = data;
    const { onOk,onCancel } = on;

    const { record } = this.state;

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
          type:'workplan/fetchWork',
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
            type:'workplan/fetchWork',
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
          type:'workplan/fetchWork',
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
            type:'workplan/fetchWork',
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
            type:'workplan/fetchWork',
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
          type:'workplan/fetchWork',
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

    const onProcesspsn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'workplan/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreeProcesspsnData:a
            })
          }
        });
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableProcesspsnData:res,
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
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableProcesspsnData:res,
                Processpsn_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableProcesspsnData:res,
                Processpsn_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { ProcesspsnConditions,Processpsn_id } = this.state;
        const param = {
          id:Processpsn_id,
          ...obj
        };
        if(OperationConditions.length){
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              conditions:ProcesspsnConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableProcesspsnData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'workplan/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableProcesspsnData:res,
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
          SelectProcesspsnValue:nameList,
          selectedProcesspsnRowKeys:selectedRowKeys,
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
            ProcesspsnConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableProcesspsnData:res,
              })
            }
          })
        }else{
          this.setState({
            ProcesspsnConditions:[]
          })
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableProcesspsnData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          ProcesspsnConditions:[]
        })
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableProcesspsnData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectProcesspsnValue:[],
          selectedProcesspsnRowKeys:[],
        })
      }
    };
    const dataProcesspsn = {
      TreeData:this.state.TreeProcesspsnData, //树的数据
      TableData:this.state.TableProcesspsnData, //表的数据
      SelectValue:this.state.SelectProcesspsnValue, //框选中的集合
      selectedRowKeys:this.state.selectedProcesspsnRowKeys, //右表选中的数据
      placeholder:'请选择加工人',
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
      title:'选择人员'
    }

    const onCheckpsn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'workplan/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreeCheckpsnData:a
            })
          }
        });
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableCheckpsnData:res,
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
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableCheckpsnData:res,
                Checkpsn_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableCheckpsnData:res,
                Checkpsn_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { CheckpsnConditions,Checkpsn_id } = this.state;
        const param = {
          id:Checkpsn_id,
          ...obj
        };
        if(CheckpsnConditions.length){
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              conditions:CheckpsnConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableCheckpsnData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'workplan/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableCheckpsnData:res,
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
          SelectCheckpsnValue:nameList,
          selectedCheckpsnRowKeys:selectedRowKeys,
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
            CheckpsnConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableCheckpsnData:res,
              })
            }
          })
        }else{
          this.setState({
            CheckpsnConditions:[]
          })
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableCheckpsnData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          CheckpsnConditions:[]
        })
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableCheckpsnData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectCheckpsnValue:[],
          selectedCheckpsnRowKeys:[],
        })
      }
    };
    const dataCheckpsn = {
      TreeData:this.state.TreeCheckpsnData, //树的数据
      TableData:this.state.TableCheckpsnData, //表的数据
      SelectValue:this.state.SelectCheckpsnValue, //框选中的集合
      selectedRowKeys:this.state.selectedCheckpsnRowKeys, //右表选中的数据
      placeholder:'请选择检验人',
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
      title:'选择人员'
    }

    const onFirstcheckpsn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'workplan/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreeFirstcheckpsnData:a
            })
          }
        });
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableFirstcheckpsnData:res,
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
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableFirstcheckpsnData:res,
                Firstcheckpsn_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableFirstcheckpsnData:res,
                Firstcheckpsn_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { FirstcheckpsnConditions,Firstcheckpsn_id } = this.state;
        const param = {
          id:Firstcheckpsn_id,
          ...obj
        };
        if(FirstcheckpsnConditions.length){
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              conditions:FirstcheckpsnConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableFirstcheckpsnData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'workplan/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableFirstcheckpsnData:res,
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
          SelectFirstcheckpsnValue:nameList,
          selectedFirstcheckpsnRowKeys:selectedRowKeys,
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
            FirstcheckpsnConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableFirstcheckpsnData:res,
              })
            }
          })
        }else{
          this.setState({
            FirstcheckpsnConditions:[]
          })
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableFirstcheckpsnData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          FirstcheckpsnConditions:[]
        })
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableFirstcheckpsnData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectFirstcheckpsnValue:[],
          selectedFirstcheckpsnRowKeys:[],
        })
      }
    };
    const dataFirstcheckpsn = {
      TreeData:this.state.TreeFirstcheckpsnData, //树的数据
      TableData:this.state.TableFirstcheckpsnData, //表的数据
      SelectValue:this.state.SelectFirstcheckpsnValue, //框选中的集合
      selectedRowKeys:this.state.selectedFirstcheckpsnRowKeys, //右表选中的数据
      placeholder:'请选择首检人',
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
      title:'选择人员'
    }

    const onEachothercheckpsn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'workplan/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreeEachothercheckpsnData:a
            })
          }
        });
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableEachothercheckpsnData:res,
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
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableEachothercheckpsnData:res,
                Eachothercheckpsn_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableEachothercheckpsnData:res,
                Eachothercheckpsn_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { EachothercheckpsnConditions,Eachothercheckpsn_id } = this.state;
        const param = {
          id:Eachothercheckpsn_id,
          ...obj
        };
        if(EachothercheckpsnConditions.length){
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              conditions:EachothercheckpsnConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableEachothercheckpsnData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'workplan/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableEachothercheckpsnData:res,
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
          SelectEachothercheckpsnValue:nameList,
          selectedEachothercheckpsnRowKeys:selectedRowKeys,
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
            EachothercheckpsnConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableEachothercheckpsnData:res,
              })
            }
          })
        }else{
          this.setState({
            EachothercheckpsnConditions:[]
          })
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableEachothercheckpsnData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          EachothercheckpsnConditions:[]
        })
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableEachothercheckpsnData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectEachothercheckpsnValue:[],
          selectedEachothercheckpsnRowKeys:[],
        })
      }
    };
    const dataEachothercheckpsn = {
      TreeData:this.state.TreeEachothercheckpsnData, //树的数据
      TableData:this.state.TableEachothercheckpsnData, //表的数据
      SelectValue:this.state.SelectEachothercheckpsnValue, //框选中的集合
      selectedRowKeys:this.state.selectedEachothercheckpsnRowKeys, //右表选中的数据
      placeholder:'请选择互检人',
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
      title:'选择人员'
    }

    const onPrincipalpsn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'workplan/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreePrincipalpsnData:a
            })
          }
        });
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePrincipalpsnData:res,
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
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePrincipalpsnData:res,
                Principalpsn_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePrincipalpsnData:res,
                Principalpsn_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { PrincipalpsnConditions,Principalpsn_id } = this.state;
        const param = {
          id:Principalpsn_id,
          ...obj
        };
        if(PrincipalpsnConditions.length){
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              conditions:PrincipalpsnConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TablePrincipalpsnData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'workplan/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TablePrincipalpsnData:res,
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
          SelectPrincipalpsnValue:nameList,
          selectedPrincipalpsnRowKeys:selectedRowKeys,
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
            PrincipalpsnConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'workplan/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePrincipalpsnData:res,
              })
            }
          })
        }else{
          this.setState({
            PrincipalpsnConditions:[]
          })
          dispatch({
            type:'workplan/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePrincipalpsnData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          PrincipalpsnConditions:[]
        })
        dispatch({
          type:'workplan/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePrincipalpsnData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectPrincipalpsnValue:[],
          selectedPrincipalpsnRowKeys:[],
        })
      }
    };
    const dataPrincipalpsn = {
      TreeData:this.state.TreePrincipalpsnData, //树的数据
      TableData:this.state.TablePrincipalpsnData, //表的数据
      SelectValue:this.state.SelectPrincipalpsnValue, //框选中的集合
      selectedRowKeys:this.state.selectedPrincipalpsnRowKeys, //右表选中的数据
      placeholder:'请选择负责人',
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
      title:'选择人员'
    }

    return (
        <Modal
          title="编辑"
          destroyOnClose
          centered
          visible={visible}
          width={'80%'}
          onCancel={()=>this.handleCancel(onCancel)}
          onOk={()=>this.handleOk(onOk)}
        >
          <div  style={{padding:'0 24px',height:document.body.clientHeight/1.5,overflow:"auto"}}>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工作中心'>
                  {getFieldDecorator('workcenterName', {
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue:this.state.SelectWorkValue
                  })(<ModelTable
                    on={onWordOn}
                    data={onWorkData}
                  />)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='投产数量'>
                  {getFieldDecorator('productnum',{
                    initialValue:record.productnum?record.productnum:'',
                    rules: [{
                      required:true,
                      message:'投产数量'
                    }]
                  })(<Input placeholder='请输入投产数量' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='负责人'>
                  {getFieldDecorator('principalpsnName',{
                    initialValue:this.state.SelectPrincipalpsnValue
                  })(<TreeTable
                    on={onPrincipalpsn}
                    data={dataPrincipalpsn}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='加工工时'>
                  {getFieldDecorator('manhour',{
                    initialValue:record.manhour?record.manhour:'',
                  })(<Input placeholder='请输入加工工时' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='合格数量'>
                  {getFieldDecorator('qualifiednum',{
                    initialValue:record.qualifiednum?record.qualifiednum:'',
                    rules: [{
                      required:true,
                      message:'合格数量'
                    }]
                  })(<Input placeholder='请输入合格数量' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='不合格数量'>
                  {getFieldDecorator('unqualifiednum',{
                    initialValue:record.unqualifiednum?record.unqualifiednum:'',
                    rules: [{
                      required:true,
                      message:'不合格数量'
                    }]
                  })(<Input placeholder='请输入不合格数量' type={'number'}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='准备工时'>
                  {getFieldDecorator('preparehour',{
                    initialValue:record.preparehour?record.preparehour:'',
                  })(<Input placeholder='请输入准备工时' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='实际工时'>
                  {getFieldDecorator('actualhour',{
                    initialValue:record.actualhour?record.actualhour:'',
                  })(<Input placeholder='请输入实际工时' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='加工人'>
                  {getFieldDecorator('processpsnName',{
                    rules: [{
                      required: true,
                    }],
                    initialValue: this.state.SelectProcesspsnValue
                  })(<TreeTable
                    on={onProcesspsn}
                    data={dataProcesspsn}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="加工日期">
                  {getFieldDecorator('processdate', {
                    initialValue:record.processdate?momentt(record.processdate,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='检验人'>
                  {getFieldDecorator('checkpsnName',{
                    rules: [{
                      required: true,
                    }],
                    initialValue: this.state.SelectCheckpsnValue
                  })(<TreeTable
                    on={onCheckpsn}
                    data={dataCheckpsn}
                  />)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="检验日期">
                  {getFieldDecorator('checkdate', {
                    initialValue:record.checkdate?momentt(record.checkdate,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="检验结果">
                  {getFieldDecorator('checkresult', {
                    initialValue:record.checkresult?record.checkresult:'',
                  })(<Input placeholder='请输入检验结果'/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='检验单'>
                  {getFieldDecorator('checkbillId',{
                    initialValue:record.checkbillId?record.checkbillId:'',
                  })(<Input placeholder='请输入检验单' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='首检人'>
                  {getFieldDecorator('firstcheckpsnName',{
                    rules: [{
                      required: true,
                    }],
                    initialValue: this.state.SelectFirstcheckpsnValue
                  })(<TreeTable
                    on={onFirstcheckpsn}
                    data={dataFirstcheckpsn}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="首检日期">
                  {getFieldDecorator('firstcheckdate', {
                    initialValue:record.firstcheckdate?momentt(record.firstcheckdate,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='首检结果'>
                  {getFieldDecorator('firstcheckresult',{
                    initialValue:record.firstcheckresult?record.firstcheckresult:'',
                  })(<Input placeholder='请输入首检结果'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='互检人'>
                  {getFieldDecorator('eachothercheckpsnName',{
                    rules: [{
                      required: true,
                    }],
                    initialValue: this.state.SelectEachothercheckpsnValue
                  })(<TreeTable
                    on={onEachothercheckpsn}
                    data={dataEachothercheckpsn}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="互检日期">
                  {getFieldDecorator('eachothercheckdate', {
                    initialValue:record.eachothercheckdate?momentt(record.eachothercheckdate,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='检验数量'>
                  {getFieldDecorator('checknum',{
                    initialValue:record.checknum?record.checknum:'',
                  })(<Input placeholder='请输入检验数量' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='报废数量'>
                  {getFieldDecorator('scrapnum',{
                    initialValue:record.scrapnum?record.scrapnum:'',
                  })(<Input placeholder='请输入报废数量' type={'number'}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工序状态'>
                  {getFieldDecorator('processstatus',{
                    initialValue:'未下达到班组',
                  })(<Input placeholder='请输入工序状态' disabled/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='派工单'>
                  {getFieldDecorator('assignjobId',{
                    initialValue:record.assignjobId?record.assignjobId:'',
                  })(<Input placeholder='请输入派工单' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="制单日期">
                  {getFieldDecorator('billdate', {
                    initialValue:record.billdate?momentt(record.billdate,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='派工标志'>
                  {getFieldDecorator('assignflag',{
                    initialValue:record.assignflag?record.assignflag:'',
                  })(<Input placeholder='请输入派工标志'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="计划开工时间">
                  {getFieldDecorator('planstarttime', {
                    initialValue:record.planstarttime?momentt(record.planstarttime,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}} showTime />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="计划完工时间">
                  {getFieldDecorator('planendtime', {
                    initialValue:record.planendtime?momentt(record.planendtime,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}} showTime />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="上次实际开工时间">
                  {getFieldDecorator('actstarttimerecently', {
                    initialValue:record.actstarttimerecently?momentt(record.actstarttimerecently,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}} showTime />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="实际开工时间">
                  {getFieldDecorator('actstarttime', {
                    initialValue:record.actstarttime?momentt(record.actstarttime,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}} showTime />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="实际完工时间">
                  {getFieldDecorator('actendtime', {
                    initialValue:record.actendtime?momentt(record.actendtime,'YYYY-MM-DD'):null
                  })(<DatePicker  style={{width:'100%'}} showTime />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 24}} md={{ span: 24 }} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo',{
                    initialValue:record.memo?record.memo:'',
                  })(<TextArea rows={4}/>)}
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Modal>
    );
  }
}

export default UpdateSuper;
