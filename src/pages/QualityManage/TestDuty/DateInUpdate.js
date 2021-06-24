import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  message,
  Radio,
  Tabs,
  Modal,
  Spin,
  Checkbox,
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddSource from '@/pages/QualityManage/TestDuty/AddSource';
import AddProject from '@/pages/QualityManage/TestDuty/AddProject';
import UpdateProject from '@/pages/QualityManage/TestDuty/UpdateProject';
import UpdateSource from '@/pages/QualityManage/TestDuty/UpdateSource';
import './tableSureBg.less'
import NormalTable from '@/components/NormalTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ testduty,loading }) => ({
  testduty,
  loading:loading.models.testduty,
  loadingList:loading.effects['testduty/fetchList'],
  //loadingChild: loading.effects['testduty/childFetch'],
}))
@Form.create()
class DateInUpdate extends PureComponent {
  state = {
    TableProductData:[],
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],


    TreeOperationData:[],
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

    initData:{},
    submitId:null,
    superId:null,
    submitProjectId:null,
    addSourceVisible:false,
    addProjectVisible:false,
    page:{
      pageSize:10,
      pageIndex:0
    },
    childData:{},
    childProjectData:{},
    updateSourceVisible:false,
    updateProjectVisible:false,
    updateSourceData:{},
    updateProjectDate:{},
    lookShow:false,
    lookFile:[]
  };

  componentDidMount(){

    const { dispatch } = this.props
    const { page } = this.state
    if(this.props.location.state){
      const initData = this.props.location.state.record
      this.setState({
        initData:initData,
        submitId:initData.id
      })
      //样本数据
      dispatch({
        type:'testduty/sourcefetch',
        payload:{
          ...page,
          conditions:[{
            code:'INSPECTION_DATA_ID',
            exp:'=',
            value:initData.id
          }]
        },
        callback:(res)=>{
          if(res){
            this.setState({childData:res})
          }
        }
      })
    }
  }

  backClick =()=>{
    router.push('/qualitymanage/testduty/list')
  }

  goClick =()=>{
    router.push('/qualitymanage/testduty/list')
  }
  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,submitId } = this.state;
    dispatch({
      type:'testduty/deleteSource',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'testduty/sourcefetch',
              payload:{
                ...page,
                conditions:[{
                  code:'INSPECTION_DATA_ID',
                  exp:'=',
                  value:submitId
                }]
              },
              callback:(res)=>{
                if(res && res.list && res.list.length){
                  this.setState({childData:res})
                }else{
                  this.setState({childData:{}})
                }
              }
            })
          })
        }
      }
    })
  }
  //删除检验项目
  handleDeleteProject = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,submitProjectId } = this.state;
    dispatch({
      type:'testduty/deleteproject',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'testduty/fetchproject',
              payload:{
                ...page,
                conditions:[{
                  code:'INSPECTION_SAMPLE_ID',
                  exp:'=',
                  value:submitProjectId
                }]
              },
              callback:(res)=>{
                if(res && res.list && res.list.length){
                  this.setState({childProjectData:res})
                }else{
                  this.setState({childProjectData:{}})
                }
              }
            })
          })
        }
      }
    })
  }
  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { submitId } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    this.setState({
      page:obj
    });
    dispatch({
      type:'testduty/sourcefetch',
      payload:{
        obj,
        conditions:[{
          code:'INSPECTION_DATA_ID',
          exp:'=',
          value:submitId
        }]
      },
      callback:(res)=>{
        if(res && res.list && res.list.length){
          this.setState({childData:res})
        }else{
          this.setState({childData:{}})
        }
      }
    })
  };
  //查看附件
  lookFileThing = (e,record)=>{
    e.preventDefault();
    const { dispatch } = this.props
    this.setState({lookShow:true})
    dispatch({
      type:'testduty/fetchList',
      payload:{
        reqData:{
          bill_id:record.id,
          type:'checkitem'
        }
      },
      callback:(response)=>{
        this.setState({lookFile:response})
      }
    });
  }
  noShow = ()=>{
    this.setState({
      lookShow:false,
      lookFile:[]
    })
  }
  validate = ()=>{
    const { form,dispatch } = this.props;
    const { initData } = this.state
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        id:initData.id,
        inspectionId:initData.oneId,
        ambientTemperature:values.ambientTemperature,
        isAmt:values.isAmt?1:0,
        memo:values.memo
      };
      dispatch({
        type:'testduty/addbook',
        payload:{
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res.errMsg === "成功"){
            message.success("检验数据添加成功",1,()=>{
              this.setState({submitId:res.id})
              // router.push("/platform/factory/area/list")
            })
          }
        }
      })
    })
  }
  handldSource = (e)=>{
    e.preventDefault()
    this.setState({addSourceVisible:true})
  }
  handldProjectSource = (e)=>{
    e.preventDefault()
    this.setState({addProjectVisible:true})
  }
  handleUpdataRoute = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateSourceData:record,
      updateSourceVisible:true
    })
  }
  handleUpdataProject = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateProjectDate:record,
      updateProjectVisible:true
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      loadingList,
      //testduty:{sourcedata},
    } = this.props;
    const { submitId,initData,childData,superId,updateSourceData,
      updateSourceVisible,submitProjectId,childProjectData,
      updateProjectDate,
    } = this.state
    const columns = [
      {
        title: '序列号',
        dataIndex: 'number',
      },
      {
        title: '产品编号',
        dataIndex: 'code',
      },
      {
        title: '毛坯编码',
        dataIndex: 'blank',
      },
      {
        title: '是否合格',
        dataIndex: 'isQualified',
        render:(text)=>{
          return <Checkbox checked={text}/>
        }
      },
      {
        title: '附件',
        dataIndex: 'file',
        width:100,
        render: (text, record) => (
          <Fragment>
            <a href="#javascript:;"  onClick={(e)=> this.lookFileThing(e,record)}>查看附件</a>
          </Fragment>
        ),
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },

      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.handleUpdataRoute(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const onProductData = {
      TableData:this.state.TableProductData,
      SelectValue:this.state.SelectProductValue,
      selectedRowKeys:this.state.selectedProductRowKeys,
      columns : [
        {
          title: '生产线编号',
          dataIndex: 'code',
        },
        {
          title: '生产线名称',
          dataIndex: 'name',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'生产线编号',code:'code',placeholder:'请输入生产线编号'},
        {label:'生产线名称',code:'name',placeholder:'请输入生产线名称'},
      ],
      title:'生产线',
      placeholder:'请选择生产线编码',
    };
    const onProductOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'area/fetchProduct',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            this.setState({
              TableProductData:res,
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
        onChange(nameList);
        this.setState({
          SelectProductValue:nameList,
          selectedProductRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { ProductConditions } = this.state;
        const param = {
          ...obj
        };
        if(ProductConditions.length){
          dispatch({
            type:'area/fetchProduct',
            payload:{
              conditions:ProductConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableProductData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'area/fetchProduct',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableProductData:res,
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
            ProductConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'area/fetchProduct',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableProductData:res,
              })
            }
          })
        }else{
          this.setState({
            ProductConditions:[],
          });
          dispatch({
            type:'area/fetchProduct',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableProductData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          ProductConditions:[]
        });
        dispatch({
          type:'area/fetchProduct',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableProductData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectProductValue:[],
          selectedProductRowKeys:[],
        })
      }
    };
    const columns3 = [
      {
        title: '检验序号',
        dataIndex: 'number',
      },
      {
        title: '检验项目',
        dataIndex: 'projectId',
      },
      {
        title: '标识',
        dataIndex: 'identifier',
      },
      {
        title: '检验要求',
        dataIndex: 'claim',
      },
      {
        title: '要求值',
        dataIndex: 'claimValue',
      },
      {
        title: '单位',
        dataIndex: 'unit',
      },
      {
        title: '上限',
        dataIndex: 'cap',
      },
      {
        title: '下限',
        dataIndex: 'lower',
      },
      {
        title: '检验设备/工具',
        dataIndex: 'tool',
      },
      {
        title: '工艺备注',
        dataIndex: 'memo',
      },
      {
        title: '实测下限值',
        dataIndex: 'measuredLower',
      },
      {
        title: '实测上限值',
        dataIndex: 'measuredCap',
      },
      {
        title: '实测描述',
        dataIndex: 'desc',
      },
      {
        title: '设备',
        dataIndex: 'device',
      },
      {
        title: '单件是否合格',
        dataIndex: 'isSingleQual',
        render:(text)=>{
          return <Checkbox checked={text}></Checkbox>
        }
      },

      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteProject(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.handleUpdataProject(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'area/newdata',
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
          type:'area/fetchTable',
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
            type:'area/fetchTable',
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
            type:'area/fetchTable',
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
            type:'area/fetchTable',
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
          type:'area/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableOperationData:res,
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
          SelectOperationValue:nameList,
          selectedOperationRowKeys:selectedRowKeys,
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
            OperationConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'area/fetchTable',
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
            type:'area/fetchTable',
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
          type:'area/fetchTable',
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
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'人员姓名',code:'name',placeholder:'请输入人员姓名'},
      ],
      title:'物料人员'
    }

    const OnAddSource = {
      onOk:(obj)=>{
        dispatch({
          type:'testduty/addsource',
          payload:{
            reqData:{
              inspectionDataId:submitId,
              ...obj
            }
          },
          callback:(res)=>{
            //上传附件
            if(obj.annex){
              const formData = new FormData();
              if(obj.annex.fileList){
                obj.annex.fileList.forEach((file)=>{
                  formData.append('files[]', file.originFileObj?file.originFileObj:file);
                  formData.append('project_id', res.id);
                  formData.append('type', 'business');
                  formData.append('parentpath', 'checkitem');
                })
              }
              dispatch({
                type:'testduty/addFile',
                payload:formData,
                callback:(res)=>{

                }
              })
            }
            this.setState({
              addSourceVisible:false,
              submitProjectId:res.id,
            })
            const { page } = this.state;
            if(res.errCode === '0'){
              message.success('样本数据添加完成',1.5,()=>{
                dispatch({
                  type:'testduty/sourcefetch',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'INSPECTION_DATA_ID',
                      exp:'=',
                      value:submitId
                    }]
                  },
                  callback:(res)=>{
                    if(res && res.list && res.list.length){
                      this.setState({childData:res})
                    }else{
                      this.setState({childData:{}})
                    }
                  }
                })
              });
            }
          }
        })
      },
      onCancel:()=>{
        this.setState({
          addSourceVisible:false
        })
      }
    }
    const OnSourceData = {
      visible:this.state.addSourceVisible
    }

    const OnAddProject = {
      onOk:(obj)=>{
        dispatch({
          type:'testduty/addproject',
          payload:{
            reqData:{
              inspectionSampleId:Number(submitProjectId),
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({
              addProjectVisible:false,
            })
            const { page } = this.state;
            if(res.errCode === '0'){
              message.success('检验项目添加完成',1.5,()=>{
                dispatch({
                  type:'testduty/fetchproject',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'INSPECTION_SAMPLE_ID',
                      exp:'=',
                      value:submitProjectId
                    }]
                  },
                  callback:(res)=>{
                    if(res && res.list && res.list.length){
                      this.setState({childProjectData:res})
                    }else{
                      this.setState({childProjectData:{}})
                    }

                  }
                })
              });
            }
          }
        })

      },
      onCancel:()=>{
        this.setState({
          addProjectVisible:false
        })
      }
    }
    const OnAddProjectData = {
      visible:this.state.addProjectVisible
    }

    const OnUpdateProject = {
      onOk:(obj)=>{
        dispatch({
          type:'testduty/addproject',
          payload:{
            reqData:{
              id:updateProjectDate.id,
              inspectionSampleId:Number(submitProjectId),
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({
              updateProjectVisible:false,
            })
            const { page } = this.state;
            if(res.errCode === '0'){
              message.success('检验项目添加完成',1.5,()=>{
                dispatch({
                  type:'testduty/fetchproject',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'INSPECTION_SAMPLE_ID',
                      exp:'=',
                      value:submitProjectId
                    }]
                  },
                  callback:(res)=>{
                    if(res && res.list && res.list.length){
                      this.setState({childProjectData:res})
                    }else{
                      this.setState({childProjectData:{}})
                    }
                  }
                })
              });
            }
          }
        })

      },
      onCancel:()=>{
        this.setState({
          updateProjectVisible:false
        })
      }
    }
    const OnUpdateProjectData = {
      visible:this.state.updateProjectVisible,
      initdate:updateProjectDate

    }

    const OnUpdateSource = {
      onOk:(obj,deleteFile)=>{
        if(deleteFile.length){
          for(let i=0;i<deleteFile.length;i++){
            dispatch({
              type:'testduty/deleteend',
              payload:{
                reqData:{
                  id:deleteFile[i].id
                }
              },
              callback:(res)=>{

              }
            })
          }
        }
        dispatch({
          type:'testduty/addsource',
          payload:{
            reqData:{
              id:updateSourceData.id,
              inspectionDataId:submitId,
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({updateSourceVisible:false})
            const { page } = this.state;
            if(res.errCode === '0'){
              //上传附件
              if(obj.annex){
                const formData = new FormData();
                if(obj.annex.fileList){
                  obj.annex.fileList.forEach((file)=>{
                    formData.append('files[]', file.originFileObj?file.originFileObj:file);
                    formData.append('project_id', res.id);
                    formData.append('type', 'business');
                    formData.append('parentpath', 'checkitem');
                  })
                }
                dispatch({
                  type:'testduty/addFile',
                  payload:formData,
                  callback:(res)=>{
                  }
                })
              }
              message.success('样本数据编辑完成',1.5,()=>{
                dispatch({
                  type:'testduty/sourcefetch',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'INSPECTION_DATA_ID',
                      exp:'=',
                      value:submitId
                    }]
                  },
                  callback:(res)=>{
                    if(res && res.list && res.list.length){
                      this.setState({childData:res})
                    }else{
                      this.setState({childData:{}})
                    }
                  }
                })
              });
            }
          }
        })

      },
      onCancel:()=>{
        this.setState({
          updateSourceVisible:false
        })
      }
    }
    const OnUpdateSourceData = {
      visible:updateSourceVisible,
      initdate:updateSourceData,
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="检验数据" key="1">
              <div >
                <Form>
                  <Row gutter={16}>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="物料型号">
                        {getFieldDecorator('modelId',{
                          initialValue:initData?initData.modelId:''
                        })(<Input placeholder="物料型号" disabled/>)}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="工作令">
                        {getFieldDecorator('workId',{
                          initialValue:initData?initData.workId:''
                        })(
                          <Input placeholder="工作令" disabled/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="物料编码">
                        {getFieldDecorator('materialId',{
                          initialValue:initData?initData.materialId:''
                        })( <Input placeholder="物料编码" disabled/>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="物料名称">
                        {getFieldDecorator('matername',{
                          initialValue:initData?initData.matername:''
                        })(<Input placeholder="物料名称" disabled/>)}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="检验工序号">
                        {getFieldDecorator('number',{
                          initialValue:initData?initData.number:''
                        })(
                          <Input placeholder="检验工序号" disabled/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="检验工序编码">
                        {getFieldDecorator('processName',{
                          initialValue:initData?initData.processName:''
                        })( <Input placeholder="检验工序编码" disabled/>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="检验工序名称">
                        {getFieldDecorator('processCode',{
                          initialValue:initData?initData.processCode:''
                        })(<Input placeholder="检验工序名称" disabled/>)}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="环境温度">
                        {getFieldDecorator('ambientTemperature',{
                          initialValue:initData?initData.ambientTemperature:''
                        })(
                          <Input placeholder="环境温度" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="是否默认环境温度">
                        {getFieldDecorator('isAmt',{
                          valuePropName:"checked",
                          initialValue:initData?initData.isAmt:''
                        })( <Checkbox></Checkbox>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                   <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                      <Form.Item label="备注">
                        {getFieldDecorator('memo', {
                          initialValue:initData?initData.memo:''
                        })(<TextArea rows={3} placeholder={'请输入备注'} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <div style={{textAlign:'right'}}>
                  <Button
                    onClick={this.backClick}
                  >
                    取消
                  </Button>
                  <Button type="primary" onClick={()=>this.validate()} loading={loading} style={{marginLeft:'20px'}}>
                    提交
                  </Button>
                </div>
              </div>
            </TabPane>
            <TabPane tab="样本数据" key="2">
              <div>
                <div>
                  <Button icon="plus" onClick={(e)=>this.handldSource(e)}
                          type="primary"
                          style={{marginBottom:'20px'}}
                          disabled={submitId?0:1} >
                    填写样本数据
                  </Button>
                </div>
                <Modal
                  title="查看附件"
                  visible={this.state.lookShow}
                  destroyOnClose
                  onCancel={this.noShow}
                  footer={[
                    // 定义右下角 按钮的地方 可根据需要使用 一个或者 2个按钮
                    <Button  type="primary"  onClick={this.noShow}>
                      确定
                    </Button>,
                  ]}
                ><Spin spinning={loadingList}>
                  { this.state.lookFile.length ?
                    this.state.lookFile.map((item,index)=>{
                      return  <p key={index}>
                        <a download target="_blank" href={item.url} >{item.name}</a>
                      </p>
                    }) : '暂无附件'
                  }
                </Spin>
                </Modal>
                <AddSource on={OnAddSource} data={OnSourceData}></AddSource>
                <UpdateSource on={OnUpdateSource} data={OnUpdateSourceData}></UpdateSource>
                <NormalTable
                  loading={loading}
                  data={childData}
                  columns={columns}
                  onRow={(record )=>{
                    return {
                      onClick:()=>{
                        const { dispatch } = this.props;
                        const { page } = this.state;
                        dispatch({
                          type:'testduty/fetchproject',
                          payload:{
                            ...page,
                            conditions:[{
                              code:'INSPECTION_SAMPLE_ID',
                              exp:'=',
                              value:record.id
                            }]
                          },
                          callback:(res)=>{
                            if(res && res.list && res.list.length) {
                              this.setState({
                                childProjectData: res
                              })
                            }else{
                              this.setState({
                                childProjectData: {}
                              })
                            }
                          }
                        })
                        this.setState({
                          superId:record.id,
                          rowId: record.id,
                          superData:record
                        })
                      },
                      rowKey:record.id
                    }
                  }}
                  rowClassName={this.setRowClassName}
                  onChange={this.handleStandardTableChange}
                />
              </div>
              <div style={{marginTop:'20px'}} bordered={false}>
                <div>
                  <Button icon="plus" onClick={(e)=>this.handldProjectSource(e)}
                          type="primary"
                          style={{marginBottom:'20px'}}
                          disabled={superId?0:1} >
                    填写检验项目
                  </Button>
                  <AddProject on={OnAddProject} data={OnAddProjectData}></AddProject>
                  <UpdateProject on={OnUpdateProject} data={OnUpdateProjectData}></UpdateProject>
                  {/* <UpdateSource on={OnUpdateSource} data={OnUpdateSourceData}></UpdateSource>*/}
                  <NormalTable
                    loading={loading}
                    data={childProjectData}
                    columns={columns3}
                    //onChange={this.handleStandardTableChange}
                  />
                </div>
              </div>
              <FooterToolbar >
                <Button
                  onClick={this.goClick}
                >
                  返回
                </Button>
              </FooterToolbar>
            </TabPane>

          </Tabs>
        </Card>

        {/* <FooterToolbar >
           {this.getErrorInfo()}
          <Button
            onClick={this.backClick}
          >
            取消
          </Button>
          <Button type="primary" onClick={()=>this.validate()} loading={loading}>
            提交
          </Button>

        </FooterToolbar>*/}
      </PageHeaderWrapper>
    );
  }
}

export default DateInUpdate;

