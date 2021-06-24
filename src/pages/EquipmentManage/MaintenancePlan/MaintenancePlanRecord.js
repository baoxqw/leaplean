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
  Checkbox,
  Card,
  message,
  Radio,
  TreeSelect,
  Popconfirm,
} from 'antd';
import './tableSureBg.less'
import router from 'umi/router';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { toTree } from '@/pages/tool/ToTree';

import AddSelfEnd from './AddSelfEnd'
import UpdateSelfEnd from './UpdateSelfEnd'


const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;

@connect(({ MP,loading }) => ({
  MP,
  loading:loading.models.MP,
  loadingSuper:loading.effects['MP/findprojectdata'],
  loadingChild:loading.effects['MP/childFetchListEnd'],

}))
@Form.create()
class MaintenancePlanRecord extends PureComponent {
  state = {
    initData:{},
    recordData:[],
    superData:[],
    isRelease:false,//子表是否禁用
    childCommonData:[],//子表数据
    superId:null,
    addEndVisible:false,
    updateEndVisible:false,
    updateEndSource:{},
    page:{
      pageSize:10,
      pageIndex:0
    },
    childSourceList:{}

  };

  componentDidMount() {
    const { dispatch } = this.props
    const initData = this.props.location.state;
    dispatch({
      type:'MP/findprojectdata',
      payload: {
        conditions:[{
          code:'MAINTENANCEPLAN_ID',
          exp:'=',
          value:initData.id
        }]
      },
      callback:(res)=>{
        if(res && res.list){
          this.setState({
            superData:res.list
          })
        }
      }
    })
  }

  backClick =()=>{
    router.push('/equipmentmanage/maintenanceplan/list')
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page ,superId} = this.state;
    dispatch({
      type:'MP/deleteend',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'MP/childFetchListEnd',
              payload:{
                conditions:[{
                  code:'MAINTENANCEPLAN_MAINTAIN_ID',
                  exp:'=',
                  value:superId
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

  updataRoute = (e,record)=>{
    this.setState({
      updateEndVisible:true,
      updateEndSource:record,
    })
  }

  addChildEnd = ()=>{
    this.setState({
      addEndVisible:true
    })
  }

  //分页
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { superId} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page:obj
    });
    dispatch({
      type:'MP/childFetchListEnd',
      payload:{
        conditions:[{
          code:'MAINTENANCEPLAN_MAINTAIN_ID',
          exp:'=',
          value:superId
        }]
      },
      callback:(res)=>{

      }
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      loadingSuper,
      loadingChild,
      MP:{ dateend }
    } = this.props;
    const { initData,superData ,updateEndSource,page,superId,childSourceList} = this.state;
    const columns3 =  [
      {
        title: '保养项目编码',
        dataIndex: 'maintainCode',
      },
      {
        title: '保养部位',
        dataIndex: 'maintainPosition',
      },
      {
        title: '保养内容',
        dataIndex: 'maintainContent',
      },
      {
        title: '要求',
        dataIndex: 'maintainRequest',
      },
      {
        title: '周期',
        dataIndex: 'maintainCycle',
      },
      {
        title: '',
        dataIndex: 'caozuo',
        width:1
      }
    ]
    const columns2 =  [
      {
        title: '保养时间',
        dataIndex: 'maintainDate',
      },
      {
        title: '保养记录',
        dataIndex: 'maintainAnnal',
      },
      {
        title: '是否合格',
        dataIndex: 'eligible',
        render:((text,record)=>{
          return <Checkbox checked={text}/>
        })
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 's',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ]

    const OnAddSelf = {
      onSave:(obj,clear)=>{
        let object = {
          reqData:{
            maintenanceplanMaintainId:superId,
            ...obj,
          }
        }
        dispatch({
          type:'MP/addend',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addEndVisible:false})
                clear()
                dispatch({
                  type:'MP/childFetchListEnd',
                  payload:{
                    conditions:[{
                      code:'MAINTENANCEPLAN_MAINTAIN_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{


                  }
                })
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addEndVisible
    }

    const OnUpdateData = {
      visible:this.state.updateEndVisible,
      record:updateEndSource
    }
    const OnUpdateSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'MP/addend',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({updateEndVisible:false})
                clear()
                dispatch({
                  type:'MP/childFetchListEnd',
                  payload:{
                    conditions:[{
                      code:'MAINTENANCEPLAN_MAINTAIN_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{

                  }
                })
              })
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateEndVisible:false
        })
      }
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="保养项目">
          <NormalTable
            style={{marginTop:'12px'}}
            loading={loadingSuper}
            scroll={{ y: 260}}
            dataSource={superData}
            columns={columns3}
            pagination={false}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  dispatch({
                    type:'MP/childFetchListEnd',
                    payload:{
                      conditions:[{
                        code:'MAINTENANCEPLAN_MAINTAIN_ID',
                        exp:'=',
                        value:record.id
                      }]
                    },
                    callback:(res)=>{

                    }
                  })
                  this.setState({
                    superId:record.id,
                    rowId: record.id,
                    isRelease:true
                  })
                },
                rowKey:record.id
              }
            }}
            rowClassName={this.setRowClassName}
          />
        </Card>
        <Card bordered={false} title="维修记录" style={{marginTop:'30px'}}>
          <Button icon="plus" onClick={this.addChildEnd} type="primary" disabled={this.state.superId ?0:1}>
            新建
          </Button>
          <NormalTable
            style={{marginTop:'12px'}}
            loading={loadingChild}
            data={dateend}
            columns={columns2}
            onChange={this.handleStandardTableChange}
          />
          <AddSelfEnd on={OnAddSelf} data={OnSelfData} />
          <UpdateSelfEnd on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MaintenancePlanRecord;

