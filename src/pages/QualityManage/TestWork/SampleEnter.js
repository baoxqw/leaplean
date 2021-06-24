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
//import AddProject from '@/pages/QualityManage/TestWork/AddSource';
//import AddSource from '@/pages/QualityManage/TestWork/AddSource';

import AddSample from '@/pages/QualityManage/TestWork/AddSample';
import UpdateSample from '@/pages/QualityManage/TestWork/UpdateSample';
import TestDates from '@/pages/QualityManage/TestWork/TestDates';
import TestDevice from '@/pages/QualityManage/TestWork/TestDevice';


import UpdateSource from '@/pages/QualityManage/TestDuty/UpdateSource';
import './tableSureBg.less'
import NormalTable from '@/components/NormalTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ testwork,loading }) => ({
  testwork,
  loading:loading.models.testwork,
  loadingList:loading.effects['testwork/fetchList'],
  loadingSample: loading.effects['testwork/fetchsample'],
}))
@Form.create()
class SampleEnter extends PureComponent {
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


    addSampleVisible:false,//样本信息
    updateSampleVisible:false,
    updateSampleData:{},

    addTypeVisible:false,//测试类型
    updateTypeVisible:false,
    updateTypeData:{},
    testD:[],
    testDe:[],
    testdates:[],//列表

    testdevice:[],//测试设备列表
    deleteType:[],
  };

  componentDidMount(){
    const { dispatch } = this.props
    const { page } = this.state
    if(this.props.location.state){
      const initData = this.props.location.state.record
      this.setState({initData})
      //样本信息
      dispatch({
        type:'testwork/fetchsample',
        payload:{
          ...page,
          conditions:[{
            code:'RTD_ID',
            exp:'=',
            value:initData.id
          }]
        },
        callback:(res)=>{

        }
      })
      //测试数据类型
      dispatch({
        type:'testwork/fetchtestdate',
        payload:{
          ...page,
          conditions:[{
            code:'RTD_ID',
            exp:'=',
            value:initData.id
          }]
        },
        callback:(res)=>{
          this.setState({testdates:res})
        }
      })
      //测试设备
      dispatch({
        type:'testwork/fetchdevice',
        payload:{
          ...page,
          conditions:[{
            code:'RTD_ID',
            exp:'=',
            value:initData.id
          }]
        },
        callback:(res)=>{
          this.setState({testdevice:res})
        }
      })
    }
  }

  backClick =()=>{
    router.push('/qualitymanage/testwork/list')
  }

  goClick =()=>{
    router.push('/qualitymanage/testwork/list')
  }
  //删除
  deleteSample = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,initData } = this.state;
    dispatch({
      type:'testwork/deletesample',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'testwork/fetchsample',
              payload:{
                ...page,
                conditions:[{
                  code:'RTD_ID',
                  exp:'=',
                  value:initData.id
                }]
              },
              callback:(res)=>{
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
      type:'testwork/sourcefetch',
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
  handleStandardTableSample = (pagination, filtersArg, sorter) => {
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
      type:'testwork/fetchsample',
      payload:{
        ...obj,
        conditions:[{
          code:'RTD_ID',
          exp:'=',
          value:initData.id
        }]
      },
      callback:(res)=>{

      }
    })
  };
  validate = ()=>{
    const { form,dispatch } = this.props;
    const { initData } = this.state
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        inspectionId:initData.id,
        ambientTemperature:values.ambientTemperature,
        isAmt:values.isAmt?1:0,
        memo:values.memo
      };
      dispatch({
        type:'testwork/addbook',
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
  handldSampleAdd  = (e)=>{
    e.preventDefault()
    this.setState({addSampleVisible:true})
  }
  updataSample = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateSampleData:record,
      updateSampleVisible:true
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      loadingList,
      fetchsample,
      testwork:{sampledata},
    } = this.props;
    const { submitId,initData,superId,updateSampleData,
      updateSampleVisible,testdevice,testdates
    } = this.state
    testdates.map((item)=>{
      item.key = item.id
      return item
    })
    testdevice.map((item)=>{
      item.key = item.id
      return item
    })
    const columns1 = [
      {
        title: '序列号',
        dataIndex: 'number',
      },
      {
        title: '片断数量',
        dataIndex: 'pieces',
      },
      {
        title: '预期号',
        dataIndex: 'expected',
      },
      {
        title: '实测环境温度(℃)',
        dataIndex: 'indicator',
      },
      {
        title: '实测环境湿度(℃)',
        dataIndex: 'humidity',
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
            <Popconfirm title="确定删除吗?" onConfirm={() => this.deleteSample(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataSample(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    //样本信息
    const OnAddSample = {
      onOk:(obj)=>{
        dispatch({
          type:'testwork/addsample',
          payload:{
            reqData:{
              rtdId:Number(initData.id),
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({
              addProjectVisible:false,
            })
            const { page } = this.state;
            if(res.errCode === '0'){
              message.success('样本信息添加完成',1.5,()=>{
                this.setState({
                  addSampleVisible:false
                })
                dispatch({
                  type:'testwork/fetchsample',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'RTD_ID',
                      exp:'=',
                      value:initData.id
                    }]
                  },
                  callback:(res)=>{

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
    const OnAddSampleData = {
      visible:this.state.addSampleVisible
    }

    const OnUpdateSample = {
      onOk:(obj)=>{
        dispatch({
          type:'testwork/addsample',
          payload:{
            reqData:{
              id:updateSampleData.id,
              rtdId:Number(initData.id),
              ...obj
            }
          },
          callback:(res)=>{
            this.setState({
              updateSampleVisible:false,
            })
            const { page } = this.state;
            if(res.errCode === '0'){
              message.success('样本信息编辑完成',1.5,()=>{
                this.setState({
                  updateSampleVisible:false
                })
                dispatch({
                  type:'testwork/fetchsample',
                  payload:{
                    ...page,
                    conditions:[{
                      code:'RTD_ID',
                      exp:'=',
                      value:initData.id
                    }]
                  },
                  callback:(res)=>{

                  }
                })
              });
            }
          }
        })

      },
      onCancel:()=>{
        this.setState({
          updateSampleVisible:false
        })
      }
    }
    const OnUpdateSampleData = {
      visible:updateSampleVisible,
      initdate:updateSampleData,
    }
   // 测试数据
    const OnTestDates = {
      onOk:(obj)=>{
        if(obj){
         obj.map((item)=>{
           item.rtdId = initData.id
           delete item.key
           return item
         })
          dispatch({
               type:'testwork/addtestdate',
               payload:{
                 reqDataList:obj
               },
               callback:(res)=>{
                 if(res.errCode === '0'){
                   message.success('成功',1.5,()=>{
                     const { page}= this.state
                     dispatch({
                       type:'testwork/fetchtestdate',
                       payload:{
                         ...page,
                         conditions:[{
                           code:'RTD_ID',
                           exp:'=',
                           value:initData.id
                         }]
                       },
                       callback:(res)=>{
                         this.setState({testdates:res})
                       }
                     })
                   });
                 }
               }
             })
        }

      },
      onRemove:(d)=>{
        if(d[0].id){
            dispatch({
              type:'testwork/deletetype',
              payload:{
                reqData:{
                  id:d[0].id
                }
              },
              callback:(res)=>{
              }
            })
        }
      }
    }
    // 测试设备
    const OnTestDevice = {
      onOk:(obj)=>{
        if(obj){
         obj.map((item)=>{
           item.rtdId = initData.id
           item.indicator = Number(item.indicator)
           item.humidity = Number(item.humidity)
           delete item.key
           return item
         })
          dispatch({
            type:'testwork/addtestdevice',
            payload:{
              reqDataList:obj
            },
            callback:(res)=>{
              if(res.errCode === '0'){
                message.success('成功',1.5,()=>{
                  const { page } = this.state
                  dispatch({
                    type:'testwork/fetchdevice',
                    payload:{
                      ...page,
                      conditions:[{
                        code:'RTD_ID',
                        exp:'=',
                        value:initData.id
                      }]
                    },
                    callback:(res)=>{
                      this.setState({testdevice:res})
                    }
                  })
                });
              }
            }
          })
        }

      },
      onRemove:(d)=>{
        if(d[0].id){
          dispatch({
            type:'testwork/deletedevice',
            payload:{
              reqData:{
                id:d[0].id
              }
            },
            callback:(res)=>{

            }
          })
        }
      }
    }


    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="样本信息" key="1">
              <div style={{}} bordered={false}>
                <div>
                  <Button icon="plus" onClick={(e)=>this.handldSampleAdd(e)}
                          type="primary"
                          style={{marginBottom:'20px'}}
                           >
                    新建
                  </Button>
                  <AddSample on={OnAddSample} data={OnAddSampleData}></AddSample>
                  <UpdateSample on={OnUpdateSample} data={OnUpdateSampleData}></UpdateSample>
                  {/* <UpdateSource on={OnUpdateSource} data={OnUpdateSourceData}></UpdateSource>*/}
                  <NormalTable
                    loading={fetchsample}
                    data={sampledata}
                    columns={columns1}
                    onChange={this.handleStandardTableSample}
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
            <TabPane tab="测试类型" key="2">
                <div style={{}} bordered={false}>
                  <TestDates on ={OnTestDates} data={testdates}></TestDates>
                </div>
              <FooterToolbar >
                <Button
                  onClick={this.goClick}
                >
                  返回
                </Button>
              </FooterToolbar>
            </TabPane>
            <TabPane tab="测试设备" key="3">
              <div style={{}} bordered={false}>
                <TestDevice on ={OnTestDevice} data={testdevice}></TestDevice>
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

export default SampleEnter;

