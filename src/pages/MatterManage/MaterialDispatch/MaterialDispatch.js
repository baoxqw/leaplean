import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Button, Menu, Dropdown,
  Input,
  Divider,
  Card,
  Icon,
  Select,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import UpdateSelf from './UpdateSelf';
import AddChild from './AddChild';
import UpdateChild from './UpdateChild';
import IneedCard from './IneedCard';
import AddSelf from './AddSelf';
import ModelTableSuperChild from '@/pages/tool/ModelTable/ModelTableSuperChild';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ MManage, loading }) => ({
  MManage,
  loading: loading.models.MManage,
  fetchTableLoading:loading.effects['MManage/fetchdispatch'],
  fetchTable2Loading:loading.effects['MManage/fetchdispatchchild'],
}))
@Form.create()
class MaterialDispatch extends PureComponent {
  state = {
    addVisible:false,
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    updateSource:[],
    updateChildSource:{},
    page:{
      pageSize:100000,
      pageIndex:0
    },
    conditions:[],
    superId:null,
    rowId:null,
    childDataSource:{},
    record:{},

    TableSuperData:[],
    TableChildData:[],
    visible:false,
    compInfoVisible:false,
    compInfoData:[],
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MManage/fetchdispatch',
      payload:{
        ...page
      }
    })
  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible:true,
    })
  };

  handleXuanZe = () => {
    this.setState({
      visible:true
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
      type:'MManage/deletedispatch',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'MManage/fetchdispatch',
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
      type:'MManage/deletedispatchchild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            const conditions = [
              {
                code:'DISTRIBUTION_ID',
                exp:'=',
                value:superId,
              }
            ]
            dispatch({
              type:'MManage/fetchdispatchchild',
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
            });
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
      const { code, status } = values;
      if(code || status){
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
        if(status){
          nameObj = {
            code:'status',
            exp:'like',
            value:status
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'MManage/fetchdispatch',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'MManage/fetchdispatch',
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
      type:'MManage/fetchdispatch',
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

    const conditions = [
      {
        code:'DISTRIBUTION_ID',
        exp:'=',
        value:superId,
      }
    ]
    dispatch({
      type:'MManage/fetchdispatchchild',
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
            <FormItem label="单据状态">
              {getFieldDecorator('status',{
              })(
                <Select style={{width:'100%'}} placeholder={'请选择状态'}>
                  <Option value={0}>初始状态</Option>
                  <Option value={1}>已收料</Option>
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

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      fetchTableLoading,
      fetchTable2Loading,
      dispatch,
      MManage:{ datadispatch }
    } = this.props;
    const { TableSuperData,TableChildData,
      visible,updateSource,page,childDataSource,
      superId,record,updateChildSource,compInfoVisible,
      compInfoData,} = this.state;

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
        title: '单据日期',
        dataIndex: 'documentDate',
      },
      {
        title: '仓库',
        dataIndex: 'warehouseName',
      },


      {
        title: '库管员',
        dataIndex: 'librarianName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
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
        title: '批次',
        dataIndex: 'batchName',
      },
      {
        title: '单价',
        dataIndex: 'unit',
        sorter: (a, b) => a.unit - b.unit,
      },
     {
        title: '金额',
        dataIndex: 'mny',
        sorter: (a, b) => a.mny - b.mny,
      },
     {
        title: '货位',
        dataIndex: 'cargoName',
      },
     {
        title: '工位',
        dataIndex: 'stationName',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },

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
          type:'MManage/adddispatch',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'MManage/fetchdispatch',
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
        console.log('编辑数据',obj)
        dispatch({
          type:'MManage/adddispatch',
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
                  type:'MManage/fetchdispatch',
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
            distributionId:record.id,
            ...obj
          }
        }
        dispatch({
          type:'MManage/adddispatchchild',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addChildVisible:false})
                clear()
                const conditions = [
                  {
                    code:'DISTRIBUTION_ID',
                    exp:'=',
                    value:record.id,
                  }
                ]
                dispatch({
                  type:'MManage/fetchdispatchchild',
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
                });
                let addsave = {
                  reqData:{
                    // outId:res.id,
                    materialId:obj.materialId,
                    //serial:obj.batch,
                    amount:obj.amount,
                    tupdatetime:new Date()
                    //warehouseId:record.warehouseId,
                  }
                }
                //现存量新建
                dispatch({
                  type:'MManage/addsaveout',
                  payload:addsave
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
            distributionId:superId,
            ...obj
          }
        }
        dispatch({
          type:'MManage/adddispatchchild',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateChildVisible:false,
                  updateChildSource:{}
                })
                clear()
                const conditions = [
                  {
                    code:'DISTRIBUTION_ID',
                    exp:'=',
                    value:record.id,
                  }
                ]
                dispatch({
                  type:'MManage/fetchdispatchchild',
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
                });
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

    const dataG = {
      columns : [
        {
          title: '单据编号',
          dataIndex: 'code',
        },
        {
          title: '单据状态',
          dataIndex: 'documentStatus',
          render:((text,record)=>{
            if(text === 0){
              return '初始状态'
            }
          })
        },
        {
          title: '发料状态',
          dataIndex: 'shippingStatus',
          render:((text,record)=>{
            if(text === 0){
              return '初始状态'
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
          title: '',
          dataIndex: 'caozuo',
          width:1,
        },
      ],
      columns2 : [
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
        },
        {
          title: '领料人',
          dataIndex: 'pickerName',
        },
        {
          title: '部门',
          dataIndex: 'deptName',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:1,
        },
      ],
      fetchList:[
        {label:'单据编号',code:'code',placeholder:'请输入单据编号'},
        {label:'单据状态',code:'documentStatus',type:()=> <Select style={{width:200}} placeholder={'请选择单据状态'}>
            <Option value={0}>初始状态</Option>
          </Select>},
      ],
      title:'请选择申请单',
      TableSuperData,
      TableChildData,
      visible
    };
    const onG = {
      handleSearch:(values)=>{
        const { code, documentStatus } = values;
        if(code || documentStatus || documentStatus === 0){
          let conditions = [];
          let codeObj = {};
          let documentStatusObj = {};

          if(code){
            codeObj = {
              code:'code',
              exp:'like',
              value:code
            };
            conditions.push(codeObj)
          }
          if(documentStatus || documentStatus === 0){
            documentStatusObj = {
              code:'DOCUMENT_STATUS',
              exp:'like',
              value:documentStatus
            };
            conditions.push(documentStatusObj)
          }
          const obj = {
            pageIndex:0,
            pageSize:100000,
            conditions,
          };

          dispatch({
            type:'MManage/TableSuperData',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableSuperData:res.resData,
              })
            }
          })
        }else{
          this.setState({
            TableSuperData:[],
          })
        }
      },
      onSelected:(record)=>{
        const  conditions = [{
          code:'APPLY_ID',
          exp:'=',
          value:record.id,
        }]
        dispatch({
          type:'MManage/TableChildData',
          payload:{
            pageIndex:0,
            pageSize:100000,
            conditions
          },
          callback:(res)=>{
            if(res && res.resData && res.resData.length){
              this.setState({
                TableChildData:res.resData,
              })
            }else{
              this.setState({
                TableChildData:[]
              })
            }
          }
        })
      },
      handleReset:(clear)=>{
        clear();
        this.setState({
          TableSuperData:[],
          TableChildData:[],
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange,clear)=>{
        if(!selectedRows.length){
          return message.error("请选择数据")
        }
        const arrsave = [];
        let atn  = false

        this.setState({
          compInfoVisible:true,
          compInfoData:selectedRows,

        })
       /* //现存量新建
        dispatch({
          type:'MManage/addsaveList',
          payload:{
            reqDataList:arrsave
          }
        })
        //生成主表
        dispatch({
          type:'MManage/adddispatch',
          payload:{
            reqData:{
              status:0,
              documentDate:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              const arr = [];
             selectedRows.map(item =>{
                arr.push({
                  distributionId:res.id,
                  materialId:item.materialId,
                  amount:item.amount
                })
              })
              dispatch({
                type:'MManage/childBatchAdd',
                payload:{
                  reqDataList:arr
                },
                callback:(res2)=>{
                  if(res2){
                    message.success("新建成功",1,()=>{
                      this.setState({
                        visible:false,
                        TableSuperData:[],
                        TableChildData:[],
                      });
                      clear();
                      dispatch({
                        type:'MManage/fetchdispatch',
                        payload:{
                          ...page
                        }
                      })
                    })
                  }else{
                    message.error("子表新建失败")
                  }
                }
              })
            }else{
              message.error("主表新建失败")
            }
          }
        })*/
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          TableSuperData:[],
          TableChildData:[],
          visible:false
        })
      }
    };

    const OnIneed = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'MManage/childBatchAddSSS',
          payload:{
            reqDataList:obj
          },
          callback:(res)=>{
            if(!res.code){
              return message.error(`${res.name}的出库数量不能大于现存量`,1)
            }
            //生成主表
            dispatch({
              type:'MManage/adddispatch',
              payload:{
                reqData:{
                  status:0,
                  documentDate:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                }
              },
              callback:(res)=>{

                if(res.errMsg === "成功"){
                  const array = [];
                  obj.map(item =>{
                    array.push({
                      distributionId:res.id,
                      materialId:item.materialId,
                      amount:item.amount
                    })
                  })

                  dispatch({
                    type:'MManage/childBatchAdd',
                    payload:{
                      reqDataList:array
                    },
                    callback:(res2)=>{
                      //子表编辑接口
                      dispatch({
                        type:'MManage/approvalList',
                        payload:{
                          reqDataList:obj
                        }
                      })
                      message.success("新建成功",1,()=>{
                        this.setState({
                          visible:false,
                          TableSuperData:[],
                          TableChildData:[],
                          compInfoVisible:false,
                          compInfoData:[],
                        });
                        clear();
                          dispatch({
                            type:'MManage/fetchdispatch',
                            payload:{
                              ...page
                            }
                          })
                      })
                    }
                  })
                }else{
                  message.error("主表新建失败")
                }
              }
            })
          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          compInfoVisible:false,
          compInfoData:[],
        })
      }
    }
    const OnIneedData = {
      visible:compInfoVisible
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={fetchTableLoading}
            data={datadispatch}
            columns={columns}
            scroll={{y:200}}
            classNameSaveColumns={"MaterialDispatch1"}
            //onChange={this.handleStandardTableChange}
            rowClassName={this.setRowClassName}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  this.setState({
                    superId:record.id,
                    rowId: record.id,
                    record,
                  })
                  const { dispatch } = this.props;
                  //表体
                  if(record.id){
                    const conditions = [
                      {
                        code:'DISTRIBUTION_ID',
                        exp:'=',
                        value:record.id,
                      }
                    ]
                    dispatch({
                      type:'MManage/fetchdispatchchild',
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
                    });
                  }
                },
                rowKey:record.id
              }
            }}
            pagination={false}
            title={() => {
              const menu = (
                <Menu>
                  <Menu.Item key="1">
                    <Button  onClick={this.handleCorpAdd}  type="link" >
                      自制
                    </Button>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Button onClick={this.handleXuanZe} type="link">
                      参照物料申请单
                    </Button>
                  </Menu.Item>
                </Menu>
              );
              return <Dropdown overlay={menu}>
                <Button>
                  选择 <Icon type="down" />
                </Button>
              </Dropdown>
            }}
          />

          <IneedCard on={OnIneed} datas={OnIneedData} data={compInfoData}/>
          <ModelTableSuperChild data={dataG} on={onG}/>

          <AddSelf on={OnAddSelf} data={OnSelfData} />

          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>

        <Card bordered={false} style={{marginTop:15}}>
          <div style={{marginTop:'-18px'}}>
            <NormalTable
              loading={fetchTable2Loading}
              data={childDataSource}
              columns={columns2}
              onChange={this.handleStandardTableChangeChild}
              classNameSaveColumns={"MaterialDispatch2"}
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

export default MaterialDispatch;
