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
import DateInCard from './DateInCard';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ testduty,loading }) => ({
  testduty,
  loadingSuper:loading.effects['testduty/sourcefetch'],
  loadingChild:loading.effects['testduty/fetchproject'],
  loadingList:loading.effects['testduty/fetchList'],
}))
@Form.create()
class DateIn extends PureComponent {
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
    lookFile:[],

    dataList:[],
    selectedRowKeys:[],
    selectedRows:[],
    addProjectBtn:false,
    isListOk:false,
  };

  componentDidMount(){
    if(this.props.location.state){
      const initData = this.props.location.state.record;
      const { dispatch } = this.props;
      const { page } = this.state;
      dispatch({
        type:"testduty/sourcefetch",
        payload:{
          ...page,
          conditions:[{
            code:'INSPECTION_DATA_ID',
            exp:'=',
            value:initData.id
          }]
        }
      })
      dispatch({
        type:'testduty/fetchproject',
        payload:{
          conditions:[{
            code:'INSPECTION_SAMPLE_ID',
            exp:'=',
            value:null
          }]
        }
      })
      this.setState({initData})
    }
  }

  goClick =()=>{
    router.push('/qualitymanage/testduty/list')
  }

  //??????
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,initData } = this.state;
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
                  value:initData.id
                }]
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
    const { superId } = this.state;
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
                conditions:[{
                  code:'INSPECTION_SAMPLE_ID',
                  exp:'=',
                  value:superId
                }]
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
    const { initData } = this.state;
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
        ...obj,
        conditions:[{
          code:'INSPECTION_DATA_ID',
          exp:'=',
          value:initData.id
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

  handldSource = ()=>{
    this.setState({addSourceVisible:true})
  }

  handldProjectSource = ()=>{
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

  bomCard =(res)=>{

    this.setState({
      dataList:res
    })
  };

  onTijiao = ()=>{
    const { dispatch } = this.props;
    const { initData,dataList } = this.state;
    dataList.map((item)=>{
      item.inspectionDataId = initData.id;
      if(item.isQualified){
        item.isQualified = 1
      }else{
        item.isQualified = 0
      }
      if(item.isComplete){
        item.isComplete = 1
      }else{
        item.isComplete = 0
      }
      if(item.number){
        item.number = Number(item.number)
      }
      if(item.blank){
        item.blank = Number(item.blank)
      }
    })
    dispatch({
      type:'testduty/addProList',
      payload:{
        reqDataList:dataList
      },
      callback:(res)=>{
        if(res.errCode === '0'){
          message.success('????????????????????????',1.5,()=>{
            this.setState({
              superId:null
            })
            dispatch({
              type:"testduty/sourcefetch",
              payload:{
                conditions:[{
                  code:'INSPECTION_DATA_ID',
                  exp:'=',
                  value:initData.id
                }]
              }
            })
            dispatch({
              type:'testduty/fetchproject',
              payload:{
                conditions:[{
                  code:'INSPECTION_SAMPLE_ID',
                  exp:'=',
                  value:null
                }]
              }
            })
          })
        }else{
          message.error("????????????????????????")
        }
      }
    })
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
    if(selectedRows.length){
      this.setState({
        addProjectBtn:true
      })
    }else{
      this.setState({
        addProjectBtn:false
      })
    }
  };

  onFindChild = (res)=>{
    this.setState({
      superId:res.id
    })
  }

  handldProjectSourceList = ()=>{
    const { isListOk } = this.state
    this.setState({
      isListOk:!isListOk
    })
  }

  render() {
    const {
      loadingSuper,
      loadingChild,
      loadingList,
      testduty:{sourceData,projectData},
      dispatch
    } = this.props;

    const { initData,superId,updateSourceData,
      updateSourceVisible,submitProjectId,selectedRows,
      updateProjectDate,addProjectBtn,
      dataList,selectedRowKeys,isListOk
    } = this.state;

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
        title: '????????????',
        dataIndex: 'isComplete',
        render:(text)=>{
          return <Checkbox checked={text}/>
        }
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
        dataIndex: 'unitName',
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

    const OnAddSource = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'testduty/addsource',
          payload:{
            reqData:{
              inspectionDataId:initData.id,
              ...obj
            }
          },
          callback:(res)=>{
            /*//????????????
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
                }*/
            if(res.errCode === '0'){
              message.success('????????????????????????',1.5,()=>{
                clear();
                this.setState({
                  addSourceVisible:false
                })
                const { page } = this.state;
                dispatch({
                  type:'testduty/sourcefetch',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'INSPECTION_DATA_ID',
                      exp:'=',
                      value:initData.id
                    }]
                  }
                })
              });
            }else{
              message.error("????????????????????????")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addSourceVisible:false
        })
      }
    }
    const OnSourceData = {
      visible:this.state.addSourceVisible
    }

    const OnUpdateSource = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'testduty/addsource',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('????????????????????????',1.5,()=>{
                clear();
                this.setState({updateSourceVisible:false})
                const { page } = this.state;
                dispatch({
                  type:'testduty/sourcefetch',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'INSPECTION_DATA_ID',
                      exp:'=',
                      value:initData.id
                    }]
                  }
                })
              });
            }else{
              message.error("????????????????????????")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateSourceVisible:false
        })
      }
    }
    const OnUpdateSourceData = {
      visible:updateSourceVisible,
      record:updateSourceData,
    }

    const OnAddProject = {
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        let a = true
        if(selectedRows.length){
          selectedRows.map((item)=>{
            dispatch({
              type:'testduty/addproject',
              payload:{
                reqData:{
                  inspectionSampleId:item.id,
                  ...obj
                }
              },
              callback:(res)=>{
                if(res.errCode === '0'){
                  if(a){
                    message.success('????????????????????????')
                  }
                    clear();
                    this.setState({
                      addProjectVisible:false,
                      selectedRows:[],
                      selectedRowKeys:[],
                    });
                    a = false
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
                    const { page } = this.state;
                    dispatch({
                      type:'testduty/fetchproject',
                      payload:{
                        ...page,
                        conditions:[{
                          code:'INSPECTION_SAMPLE_ID',
                          exp:'=',
                          value:superId
                        }]
                      }
                    })
                }else{
                  message.error("????????????????????????")
                }
              }
            })
          })
        }else{
          dispatch({
            type:'testduty/addproject',
            payload:{
              reqData:{
                inspectionSampleId:superId,
                ...obj
              }
            },
            callback:(res)=>{
              if(res.errCode === '0'){
                message.success('????????????????????????',1.5,()=>{
                  clear();
                  this.setState({
                    addProjectVisible:false,
                  });
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
                  const { page } = this.state;
                  dispatch({
                    type:'testduty/fetchproject',
                    payload:{
                      ...page,
                      conditions:[{
                        code:'INSPECTION_SAMPLE_ID',
                        exp:'=',
                        value:superId
                      }]
                    }
                  })
                });
              }else{
                message.error("????????????????????????")
              }
            }
          })
        }

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addProjectVisible:false
        })
      }
    }
    const OnAddProjectData = {
      visible:this.state.addProjectVisible
    }

    const OnUpdateProject = {
      onOk:(obj,clear,deleteFile)=>{
        dispatch({
          type:'testduty/addproject',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('????????????????????????',1.5,()=>{
                if(obj.annex){
                  const formData = new FormData();
                  if(obj.annex.fileList){
                    obj.annex.fileList.forEach((file)=>{
                      formData.append('files[]', file.originFileObj?file.originFileObj:file);
                      formData.append('project_id', updateProjectDate.id);
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
                clear();
                this.setState({
                  updateProjectVisible:false,
                })
                dispatch({
                  type:'testduty/fetchproject',
                  payload:{
                    conditions:[{
                      code:'INSPECTION_SAMPLE_ID',
                      exp:'=',
                      value:superId
                    }]
                  }
                })
              });
            }else{
              message.error("????????????????????????")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateProjectVisible:false
        })
      }
    }
    const OnUpdateProjectData = {
      visible:this.state.updateProjectVisible,
      record:updateProjectDate
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
           {/* <Button icon="plus" onClick={ this.handldSource }
                    type="primary"
                    style={{marginBottom:'20px'}}
                    >
              ??????????????????
            </Button>*/}
            <NormalTable
              loading={loadingSuper}
              data={sourceData}
              columns={columns}
              rowSelection={isListOk?rowSelection:null}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    const { dispatch } = this.props;
                    dispatch({
                      type:'testduty/fetchproject',
                      payload:{
                        conditions:[{
                          code:'INSPECTION_SAMPLE_ID',
                          exp:'=',
                          value:record.id
                        }]
                      }
                    })
                    this.setState({
                      superId:record.id,
                      rowId: record.id,
                      superData:record,
                      addProjectBtn:true,
                    })
                  },
                  rowKey:record.id
                }
              }}
              rowClassName={this.setRowClassName}
              onChange={this.handleStandardTableChange}
            />
           {/* <DateInCard data={sourceData.list} bomCard={ this.bomCard } onFindChild={this.onFindChild}/>*/}
            <div style={{marginTop:'20px',display:'flex',justifyContent:'flex-end'}}>
              <Button type={'primary'} style={{display:`${dataList && dataList.length ? '':'none'}`}} onClick={this.onTijiao}>??????</Button>
            </div>
            <AddSource on={OnAddSource} data={OnSourceData} />
            <UpdateSource on={OnUpdateSource} data={OnUpdateSourceData} />

          </div>

          <div style={{marginTop:'20px'}}>
            <Button icon="plus" onClick={ this.handldProjectSourceList }
                    type="primary"
                    style={{marginBottom:'20px',marginRight:'20px'}}
                    //disabled={!addProjectBtn}
              >
              ????????????????????????
            </Button>
            <Button icon="plus" onClick={ this.handldProjectSource }
                    type="primary"
                    style={{marginBottom:'20px'}}
                    disabled={!addProjectBtn} >
              ??????????????????
            </Button>
            <NormalTable
              loading={loadingChild}
              data={projectData}
              pagination={false}
              columns={columns3}
            />

            <AddProject on={OnAddProject} data={OnAddProjectData} />

            <UpdateProject on={OnUpdateProject} data={OnUpdateProjectData} />

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

          </div>
        </Card>
        <FooterToolbar >
          <Button
            onClick={this.goClick}
          >
            ??????
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default DateIn;

