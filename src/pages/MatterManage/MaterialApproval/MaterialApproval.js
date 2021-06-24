import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Divider,
  Button,
  Card,
  Select,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';
import AddChild from './AddChild';
import UpdateChild from './UpdateChild';
import ModelTable from '@/pages/MatterManage/MaterialApproval/ModelTable';
import DetailLook from './DetailLook';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ MManage, loading }) => ({
  MManage,
  loading: loading.models.MManage,
  fetchTableLoading:loading.effects['MManage/fetchapproval'],
  fetchTable2Loading:loading.effects['MManage/fetchapprovalchild'],
  approval:loading.effects['MManage/addsubapprove'],
}))
@Form.create()
class MaterialApproval extends PureComponent {
  state = {
    addVisible:false,
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    updateSource:[],
    updateChildSource:{},
    page:{
      pageSize:10000,
      pageIndex:0
    },
    conditions:[],
    superId:null,
    rowId:null,
    childDataSource:{},
    record:{},
    queryVisible:false,
    detailVisible:false,
    approvalStatus:false,

  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MManage/fetchapproval',
      payload:{
        ...page
      }
    })
  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };

  handleCorpAddChild = () => {
    this.setState({
      addChildVisible:true
    })
  };

  handleOk = e =>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          code:values.codesadd,
          name:values.namesadd,
        }
      }
      dispatch({
        type:'worktype/add',
        payload:obj,
        callback:(res)=>{
          if(res.errMsg === "成功"){
            this.setState({
              addVisible:false
            })
            dispatch({
              type:'worktype/fetch',
              payload:{
                ...page
              }
            })
          }
        }
      })
    })
  }

  handleCancel  =()=>{
    this.setState({
      addVisible:false
    })
  }

  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MManage/deleteapproval',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'MManage/fetchapproval',
              payload:{
                ...page
              }
            })
          })
        }else{
          message.error('失败')
        }
      }
    })
  }

  handleDeleteChild = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,superId } = this.state;
    dispatch({
      type:'MManage/deleteapprovalchild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            let conditions = [
              {
                code:'APPLY_ID',
                exp:'=',
                value:superId,
              }
            ]
            dispatch({
              type:'MManage/fetchapprovalchild',
              payload:{
                conditions,
                pageIndex:0,
                pageSize:10,
              },
              callback:(res)=>{

                if(res.list){
                  this.setState({childDataSource:res})
                }else{
                  this.setState({childDataSource:{}})
                }
                /* if(res.length){
                   this.setState({childDataSource:res})
                 }else{
                   this.setState({childDataSource:[]})
                 }*/

              }
            })
          })
        }else{
          message.error('失败')
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
      const { code, documentStatus } = values;
      if(code || documentStatus){
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
        if(documentStatus){
          nameObj = {
            code:'documentStatus',
            exp:'=',
            value:documentStatus
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          pageIndex:0,
          pageSize:10000,
          conditions,
        };
        dispatch({
          type:'MManage/fetchapproval',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'MManage/fetchapproval',
          payload:{
            ...page
          }
        })
      }
    })

  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    })
    //清空后获取列表
    dispatch({
      type:'MManage/fetchapproval',
      payload:{
        ...page
      }
    });
  };

  //编辑
  updataRoute = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateSource:record,
      updateVisible:true,
    })
  }

  queryGoucheng = (e,record)=>{
    e.preventDefault();
    this.setState({
      queryVisible:true
    })
  }

  updataRouteChild = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateChildSource:record,
      updateChildVisible:true,
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'MManage/fetchapproval',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'MManage/fetchapproval',
      payload: obj,
    });

  };

  handleStandardTableChangeChild = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superId } = this.state;

    let conditions = [
      {
        code:'APPLY_ID',
        exp:'=',
        value:superId,
      }
    ]
    dispatch({
      type:'MManage/fetchapprovalchild',
      payload:{
        conditions,
        pageIndex: pagination.current-1,
        pageSize: pagination.pageSize,
      },
      callback:(res)=>{
        if(res.list){
          this.setState({childDataSource:res})
        }else{
          this.setState({childDataSource:{}})
        }
      }
    })

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,

    } = this.props;

    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='单据编号'>
              {getFieldDecorator('code')(<Input placeholder='请输入单据编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='单据状态'>
              {getFieldDecorator('documentStatus')(
                <Select style={{width:'100%'}} placeholder={'请选择状态'}>
                  <Option value={0}>初始状态</Option>
                </Select>
                )}
            </FormItem>
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  //发起审批
  addApproval = ()=>{
    const { page, record } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'MManage/addsubapprove',
      payload: {
        reqData: {
          title: '待审批',
          billCode: record.code,
          billType: '初始状态',
          billId: record.id,
          auditType: 'QA_INIT',
          messageType: 2,
          receiverId: 74,
          jump: 0,
        },
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          this.setState({
            approvalStatus:false
          })
          message.success('提交成功', 1, () => {
            dispatch({
              type:'MManage/fetchapproval',
              payload:{
                ...page
              }
            })
          });
        } else {
          message.error('提交失败');
        }
      },
    });
  }

  //查看
  lookDetail = () => {
    this.setState({
      detailVisible:true
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      fetchTableLoading,
      fetchTable2Loading,
      dispatch,
      approval,
      MManage:{ dataapproval }
    } = this.props;
    const { updateSource,page,childDataSource,detailVisible,superId,record,updateChildSource,queryVisible,rowId,approvalStatus} = this.state;
    console.log('[[[',dataapproval)
    const columns = [
      {
        title: '单据编号',
        dataIndex: 'code',
      },
      {
        title: '单据状态',
        dataIndex: 'status',
      },
      {
        title: '智能装备库存组织',
        dataIndex: 'stock',
      },
      {
        title: '申请总数量',
        dataIndex: 'num',
      },
      {
        title: '发料状态',
        dataIndex: 'shippingStatus',
        render:((text,record)=>{
          if(text === 0){
            return '初始状态'
          }else {
            return text
          }
        })
      },
      {
        title: '物资计划员',
        dataIndex: 'planName',
      },
      {
        title: '申领日期',
        dataIndex: 'claimDate',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'key',
        fixed:'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.queryGoucheng(e,record)}>构成</a>
          </Fragment>
        }
      },
    ];

    const columns2 = [
      {
        title: '序号',
        dataIndex: 'number',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '数量',
        dataIndex: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: '领料人',
        dataIndex: 'pickerName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
     /* {
        title: '是否交接点',
        dataIndex: 'junction',
        render:((text,record)=>{
          return <Checkbox checked={text} />
        })
      },
      {
        title: '是否计数点',
        dataIndex: 'count',
        render:((text,record)=>{
          return <Checkbox checked={text} />
        })
      },*/
      {
        title: formatMessage({ id: 'validation.operation' }),
        fixed:'right',
        dataIndex: 'key',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChild(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRouteChild(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];

    const OnAddSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'MManage/addapproval',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'MManage/fetchapproval',
                  payload:{
                    ...page
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
      visible:this.state.addVisible
    }

    const OnUpdateData = {
      visible:this.state.updateVisible,
      record:updateSource
    }
    const OnUpdateSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'MManage/addapproval',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateVisible:false,
                  updateSource:{}
                })
                clear()
                dispatch({
                  type:'MManage/fetchapproval',
                  payload:{
                    ...page
                  }
                })
              })
            }else{
              message.error('失败')
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false
        })
      }
    }

    const OnAddChild = {
      onSave:(obj,clear)=>{
        let object = {
          reqData:{
            applyId:record.id,
            ...obj
          }
        }
        dispatch({
          type:'MManage/addapprovalchild',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addChildVisible:false})
                clear()
                let conditions = [
                  {
                    code:'APPLY_ID',
                    exp:'=',
                    value:superId,
                  }
                ]
                dispatch({
                  type:'MManage/fetchapprovalchild',
                  payload:{
                    conditions,
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{

                    if(res.list){
                      this.setState({childDataSource:res})
                    }else{
                      this.setState({childDataSource:{}})
                    }
                    /* if(res.length){
                       this.setState({childDataSource:res})
                     }else{
                       this.setState({childDataSource:[]})
                     }*/

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
          addChildVisible:false
        })
      }
    }
    const OnChildData = {
      visible:this.state.addChildVisible
    }

    const OnUpdateChildData = {
      visible:this.state.updateChildVisible,
      record:updateChildSource
    }
    const OnUpdateChild = {
      onSave:(obj,clear)=>{
        let object = {
          reqData:{
            applyId:superId,
            ...obj
          }
        }
        dispatch({
          type:'MManage/addapprovalchild',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateChildVisible:false,
                  updateChildSource:{}
                })
                clear()
                let conditions = [
                  {
                    code:'APPLY_ID',
                    exp:'=',
                    value:superId,
                  }
                ]
                dispatch({
                  type:'MManage/fetchapprovalchild',
                  payload:{
                    conditions,
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                    if(res.list){
                      this.setState({childDataSource:res})
                    }else{
                      this.setState({childDataSource:{}})
                    }
                  }
                })
              })
            }else{
              message.error('失败')
            }
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateChildVisible:false
        })
      }
    }

    const detailDates = {
      record,
      visible: detailVisible,
    };
    const detailOn = {
      onCancel: () => {
        this.setState({
          detailVisible: false,
        });
      },
    };

    const queryOn = {
      onCancel:()=>{
        this.setState({
          queryVisible:false
        })
      }
    };
    const queryData = {
      visible:queryVisible,
      id:superId
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={fetchTableLoading}
            data={dataapproval}
            columns={columns}
            scroll={{y:200}}
            //onChange={this.handleStandardTableChange}
            classNameSaveColumns={"MaterialApproval1"}
            rowClassName={this.setRowClassName}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  this.setState({
                    superId:record.id,
                    rowId: record.id,
                    record,
                  })
                  if(record.status === '初始状态'){
                    this.setState({
                      approvalStatus:true
                    })
                  }else{
                    this.setState({
                      approvalStatus:false
                    })
                  }
                  const { dispatch } = this.props;
                  //表体
                  if(record.id){
                    const conditions = [
                      {
                        code:'APPLY_ID',
                        exp:'=',
                        value:record.id,
                      }
                    ]
                    dispatch({
                      type:'MManage/fetchapprovalchild',
                      payload:{
                        conditions,
                        pageIndex:0,
                        pageSize:10,
                      },
                      callback:(res)=>{
                        if(res.list){
                          this.setState({childDataSource:res})
                        }else{
                          this.setState({childDataSource:{}})
                        }
                        /* if(res.length){
                           this.setState({childDataSource:res})
                         }else{
                           this.setState({childDataSource:[]})
                         }*/

                      }
                    });
                  }
                },
                rowKey:record.id
              }
            }}
            pagination={false}
            title={() => <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
              <Button style={{marginLeft:'20px'}} loading={approval} onClick={this.addApproval} disabled={!approvalStatus} type="primary">
                发起审批
              </Button>
              <Button disabled={!rowId} onClick={this.lookDetail} type="primary" style={{ marginLeft: 12 }}>
                查看流程
              </Button>
            </div>}
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
          <DetailLook data={detailDates} on={detailOn} />
          <ModelTable on={queryOn}  data={queryData}/>
        </Card>

        <Card bordered={false} style={{marginTop:15}}>
          <div style={{marginTop:'-18px'}}>
            <NormalTable
              loading={fetchTable2Loading}
              data={childDataSource}
              columns={columns2}
              classNameSaveColumns={"MaterialApprova2"}
              onChange={this.handleStandardTableChangeChild}
              title={() => <div>
                <Button
                  icon="plus"
                  disabled={!superId}
                  onClick={this.handleCorpAddChild}
                  type="primary"
                >新建</Button>
              </div>}
            />
          </div>

          <AddChild on={OnAddChild} data={OnChildData} />
          <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MaterialApproval;
