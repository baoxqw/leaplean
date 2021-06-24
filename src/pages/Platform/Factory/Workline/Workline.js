import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Divider ,
  Button,
  Card,
  Tooltip,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Sysadmin/UserAdmin.less';
import WorklineAdd from '@/pages/Platform/Factory/Workline/WorklineAdd';
import WorklineUpdate from '@/pages/Platform/Factory/Workline/WorklineUpdate';
import WorkCard from '@/pages/Platform/Factory/Workline/WorkCard';
import { InfoCircleOutlined } from '@ant-design/icons';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery.js';

const FormItem = Form.Item;

@connect(({ workline, loading }) => ({
  workline,
  queryLoading: loading.effects['workline/fetch'],
  addLoading: loading.effects['workline/add'],
  childLoading: loading.effects['workline/queryChild'],
}))
@Form.create()
class Workline extends PureComponent {
  state = {
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[],
    addVisible:false,
    updateVisible:false,
    updateRecord:{},
    value:'',

    superId: null,
    rowId: null,

    childData:[],

    status:true
  };

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'workline/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
    })
  }

  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };

  updataRoute = (e,record) => {
    e.preventDefault();
    this.setState({
      updateRecord:record,
      updateVisible:true
    })
  };

  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,value } = this.state;
    dispatch({
      type:'workline/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'workline/fetch',
              payload:{
               ...page,
               reqData:{
                 value
               }
              }
            })
          })
        }
      }
    })
  }
  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code } = values;  
      this.setState({
        value:code
      })
      dispatch({
        type:'workline/fetch',
        payload:{
          reqData:{
            value:code
          }
        },
      })
    })

  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    this.setState({
      value:'',
      page:{
        pageSize:10,
        pageIndex:0
      }
    })
    //清空输入框
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'workline/fetch',
      payload:{
        pageSize:10,
        pageIndex:0
      }
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    const { expandForm } = this.state
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='综合查询'>
              {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                <Tooltip title={IntegratedQuery.Workline}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
           
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //分页
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { value} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
      reqData:{
        value
      }
    };
    this.setState({
      page:{
        pageIndex: pagination.current-1,
        pageSize: pagination.pageSize,
      }
    });

    dispatch({
      type:'workline/fetch',
      payload: obj,
    });

  };

  bomCardAddDate = (data,type) => {
    const { rowId } = this.state;
    const { dispatch } = this.props;
    if(!data) return;
    if(type === 'save'){
      data.productionlineId = rowId;
      dispatch({
        type:"workline/childAdd",
        payload:{
          reqData:{
            ...data
          }
        },
        callback:(res)=>{
          console.log("save---",res)
          if(res.errCode === '0'){
            message.success(`${data.id?'编辑成功':'新建成功'}`,1,()=>{
              dispatch({
                type: 'workline/queryChild',
                payload: {
                  pageIndex: 0,
                  pageSize: 10000000,
                  conditions: [{
                    code: 'PRODUCTIONLINE_ID',
                    exp: '=',
                    value: rowId
                  }]
                },
                callback: (res) => {
                  if(res.list.length){
                    this.setState({
                      childData:res.list
                    })
                  }else{
                    this.setState({
                      childData:[]
                    })
                  }
                }
              })
            })
          }else{
            message.error(`${data.id?'编辑失败':'新建失败'}`)
          }
        }
      })
    }
    if(type === 'delete'){
      if(!data.length){
        return;
      }
      dispatch({
        type:"workline/childDelete",
        payload:{
          reqData:{
            id:data[0].id
          }
        },
        callback:(res)=>{
          if(res.errCode === '0'){
            message.success("删除成功",1,()=>{
              dispatch({
                type: 'workline/queryChild',
                payload: {
                  pageIndex: 0,
                  pageSize: 10000000,
                  conditions: [{
                    code: 'PRODUCTIONLINE_ID',
                    exp: '=',
                    value: rowId
                  }]
                },
                callback: (res) => {
                  if(res.list.length){
                    this.setState({
                      childData:res.list
                    })
                  }else{
                    this.setState({
                      childData:[]
                    })
                  }
                }
              })
            })
          }else{
            message.error("删除失败")
          }
        }
      })
    }
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  render() {
    const {
      loading,
      workline:{data},
      dispatch,
      queryLoading,
      addLoading,
      childLoading
    } = this.props;

    const { page,addVisible,updateVisible,updateRecord,value,childData,status } = this.state;

    const columns = [
      {
        title: '生产线编号',
        dataIndex: 'code',

      },
      {
        title: '生产线名称',
        dataIndex: 'name',

      },
      {
        title: '工作中心名称',
        dataIndex: 'workcenterName',
      },
      {
        title: '状态',
        dataIndex: 'status',

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
              <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
            </Fragment>
        }
      },
    ];

    const AddData = {
      visible:addVisible,
      loading:addLoading
    };

    const AddOn = {
      onSave:(res,clear)=>{
        dispatch({
          type:'workline/add',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                clear();
                this.setState({
                  addVisible:false
                })
                dispatch({
                  type:'workline/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value
                    }
                  }
                })
              })
            }else{
              clear(1);
              message.error("新建失败")
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
    };

    const UpdateData = {
      visible:updateVisible,
      record:updateRecord,
      loading:addLoading
    };

    const UpdateOn = {
      onSave:(res,clear)=>{
        dispatch({
          type:'workline/add',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                clear();
                this.setState({
                  updateVisible:false
                });
                dispatch({
                  type:'workline/fetch',
                  payload:{
                    ...page,
                     reqData:{
                      value
                    }
                  }
                })
              })
            }else{
              clear(1);
              message.error("编辑失败")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false,
          updateRecord:{}
        })
      }
    };

    const OnChild = {
      onOk: (res) => {
        if (res.length > 0) {
          res.map((item) => {
            if (item.id) {
              delete item.id
            }

            delete item.bomId
            item.bomId = superId
            delete item.editable;
            return item
          })
        }
        dispatch({
          type: 'bom/subti',
          payload: {
            reqDataList: res
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success('新建成功')
            }
          }
        })
      },
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={queryLoading}
            data={data}
            classNameSaveColumns = {"workLine5"}
            columns={columns}
            onChange={this.handleStandardTableChange}
            rowClassName={this.setRowClassName}
            onRow={(record) => {
              return {
                onClick: () => {
                  const { dispatch } = this.props;
                  dispatch({
                    type: 'workline/queryChild',
                    payload: {
                      pageIndex: 0,
                      pageSize: 10000000,
                      conditions: [{
                        code: 'PRODUCTIONLINE_ID',
                        exp: '=',
                        value: record.id
                      }]
                    },
                    callback: (res) => {
                      console.log("res",res)
                      if(res.list.length){
                        this.setState({
                          childData:res.list,
                          status:false
                        })
                      }else{
                        this.setState({
                          childData:[],
                          status:false
                        })
                      }
                    }
                  })
                  this.setState({
                    superId: record.id,
                    rowId: record.id,
                    superData: record,
                  })
                },
                rowKey: record.id
              }
            }}
            title={() =>   <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>
            }
          />

          <div>
            <WorkCard data={childData} on={OnChild} loading={childLoading} status={status} bomCardAddDate={this.bomCardAddDate}/>
          </div>


          <WorklineAdd on={AddOn}  data={AddData}/>
          <WorklineUpdate on={UpdateOn}  data={UpdateData}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Workline;
