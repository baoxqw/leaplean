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
      //????????????
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
  //??????
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
        if(res.errMsg === "??????"){
          message.success("????????????",1,()=>{
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
  //??????????????????
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
        if(res.errMsg === "??????"){
          message.success("????????????",1,()=>{
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
  //??????
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
  //????????????
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
          if(res.errMsg === "??????"){
            message.success("????????????????????????",1,()=>{
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
        title: '?????????',
        dataIndex: 'number',
      },
      {
        title: '????????????',
        dataIndex: 'code',
      },
      {
        title: '????????????',
        dataIndex: 'blank',
      },
      {
        title: '????????????',
        dataIndex: 'isQualified',
        render:(text)=>{
          return <Checkbox checked={text}/>
        }
      },
      {
        title: '??????',
        dataIndex: 'file',
        width:100,
        render: (text, record) => (
          <Fragment>
            <a href="#javascript:;"  onClick={(e)=> this.lookFileThing(e,record)}>????????????</a>
          </Fragment>
        ),
      },
      {
        title: '??????',
        dataIndex: 'memo',
      },

      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="????????????????" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.handleUpdataRoute(e,record)}>??????</a>
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
          title: '???????????????',
          dataIndex: 'code',
        },
        {
          title: '???????????????',
          dataIndex: 'name',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'???????????????',code:'code',placeholder:'????????????????????????'},
        {label:'???????????????',code:'name',placeholder:'????????????????????????'},
      ],
      title:'?????????',
      placeholder:'????????????????????????',
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
      }, //??????
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
      }, //???????????????
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
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectProductValue:[],
          selectedProductRowKeys:[],
        })
      }
    };
    const columns3 = [
      {
        title: '????????????',
        dataIndex: 'number',
      },
      {
        title: '????????????',
        dataIndex: 'projectId',
      },
      {
        title: '??????',
        dataIndex: 'identifier',
      },
      {
        title: '????????????',
        dataIndex: 'claim',
      },
      {
        title: '?????????',
        dataIndex: 'claimValue',
      },
      {
        title: '??????',
        dataIndex: 'unit',
      },
      {
        title: '??????',
        dataIndex: 'cap',
      },
      {
        title: '??????',
        dataIndex: 'lower',
      },
      {
        title: '????????????/??????',
        dataIndex: 'tool',
      },
      {
        title: '????????????',
        dataIndex: 'memo',
      },
      {
        title: '???????????????',
        dataIndex: 'measuredLower',
      },
      {
        title: '???????????????',
        dataIndex: 'measuredCap',
      },
      {
        title: '????????????',
        dataIndex: 'desc',
      },
      {
        title: '??????',
        dataIndex: 'device',
      },
      {
        title: '??????????????????',
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
            <Popconfirm title="????????????????" onConfirm={() => this.handleDeleteProject(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.handleUpdataProject(e,record)}>??????</a>
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
      }, //input????????????????????????????????????
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
      }, //??????????????????
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
      }, //??????
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
      onCancel:()=>{

      },  //???????????????
      handleSearch:(values)=>{
        //???????????????????????? ??????????????????  ?????????????????????
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
      }, //???????????????
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
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      }
    };
    const datas = {
      TreeData:this.state.TreeOperationData, //????????????
      TableData:this.state.TableOperationData, //????????????
      SelectValue:this.state.SelectOperationValue, //??????????????????
      selectedRowKeys:this.state.selectedOperationRowKeys, //?????????????????????
      placeholder:'???????????????',
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
        {label:'????????????',code:'name',placeholder:'?????????????????????'},
      ],
      title:'????????????'
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
            //????????????
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
              message.success('????????????????????????',1.5,()=>{
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
              message.success('????????????????????????',1.5,()=>{
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
              message.success('????????????????????????',1.5,()=>{
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
              //????????????
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
              message.success('????????????????????????',1.5,()=>{
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
            <TabPane tab="????????????" key="1">
              <div >
                <Form>
                  <Row gutter={16}>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="????????????">
                        {getFieldDecorator('modelId',{
                          initialValue:initData?initData.modelId:''
                        })(<Input placeholder="????????????" disabled/>)}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="?????????">
                        {getFieldDecorator('workId',{
                          initialValue:initData?initData.workId:''
                        })(
                          <Input placeholder="?????????" disabled/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="????????????">
                        {getFieldDecorator('materialId',{
                          initialValue:initData?initData.materialId:''
                        })( <Input placeholder="????????????" disabled/>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="????????????">
                        {getFieldDecorator('matername',{
                          initialValue:initData?initData.matername:''
                        })(<Input placeholder="????????????" disabled/>)}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="???????????????">
                        {getFieldDecorator('number',{
                          initialValue:initData?initData.number:''
                        })(
                          <Input placeholder="???????????????" disabled/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="??????????????????">
                        {getFieldDecorator('processName',{
                          initialValue:initData?initData.processName:''
                        })( <Input placeholder="??????????????????" disabled/>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="??????????????????">
                        {getFieldDecorator('processCode',{
                          initialValue:initData?initData.processCode:''
                        })(<Input placeholder="??????????????????" disabled/>)}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="????????????">
                        {getFieldDecorator('ambientTemperature',{
                          initialValue:initData?initData.ambientTemperature:''
                        })(
                          <Input placeholder="????????????" />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                      <Form.Item label="????????????????????????">
                        {getFieldDecorator('isAmt',{
                          valuePropName:"checked",
                          initialValue:initData?initData.isAmt:''
                        })( <Checkbox></Checkbox>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                   <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                      <Form.Item label="??????">
                        {getFieldDecorator('memo', {
                          initialValue:initData?initData.memo:''
                        })(<TextArea rows={3} placeholder={'???????????????'} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
                <div style={{textAlign:'right'}}>
                  <Button
                    onClick={this.backClick}
                  >
                    ??????
                  </Button>
                  <Button type="primary" onClick={()=>this.validate()} loading={loading} style={{marginLeft:'20px'}}>
                    ??????
                  </Button>
                </div>
              </div>
            </TabPane>
            <TabPane tab="????????????" key="2">
              <div>
                <div>
                  <Button icon="plus" onClick={(e)=>this.handldSource(e)}
                          type="primary"
                          style={{marginBottom:'20px'}}
                          disabled={submitId?0:1} >
                    ??????????????????
                  </Button>
                </div>
                <Modal
                  title="????????????"
                  visible={this.state.lookShow}
                  destroyOnClose
                  onCancel={this.noShow}
                  footer={[
                    // ??????????????? ??????????????? ????????????????????? ???????????? 2?????????
                    <Button  type="primary"  onClick={this.noShow}>
                      ??????
                    </Button>,
                  ]}
                ><Spin spinning={loadingList}>
                  { this.state.lookFile.length ?
                    this.state.lookFile.map((item,index)=>{
                      return  <p key={index}>
                        <a download target="_blank" href={item.url} >{item.name}</a>
                      </p>
                    }) : '????????????'
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
                    ??????????????????
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
                  ??????
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
            ??????
          </Button>
          <Button type="primary" onClick={()=>this.validate()} loading={loading}>
            ??????
          </Button>

        </FooterToolbar>*/}
      </PageHeaderWrapper>
    );
  }
}

export default DateInUpdate;

