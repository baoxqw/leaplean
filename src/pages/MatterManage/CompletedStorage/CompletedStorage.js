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
  Checkbox,
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';
import AddChild from './AddChild';
import UpdateChild from './UpdateChild';

const FormItem = Form.Item;

@connect(({ MManage, loading }) => ({
  MManage,
  loading: loading.models.MManage,
  fetchTableLoading:loading.effects['MManage/fetchstorage'],
  fetchTable2Loading:loading.effects['MManage/fetchstoragechild'],
}))
@Form.create()
class CompletedStorage extends PureComponent {
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
    TreeMaterialData:[],
    MaterialConditions:[],
    material_id:null,
    TableMaterialData:[],
    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],

    selectedRowKeys:[],
    selectedRows:[],

    TableProductData:[],//仓库
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],


  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MManage/fetchstorage',
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
      type:'MManage/deletestorage',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        this.setState({
          superId:null
        })
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'MManage/fetchstorage',
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
      type:'MManage/deletestoragechild',
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
                code:'WAREHOUSING_ID',
                exp:'=',
                value:superId,
              }
            ]
            dispatch({
              type:'MManage/fetchstoragechild',
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
    const { page,selectedProductRowKeys} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code, warehouseId } = values;
      if(!code && !warehouseId){
        dispatch({
          type:'MManage/fetchstorage',
          payload:{
            ...page
          }
        })
      }
      if(code || warehouseId){
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
        if(warehouseId){
          nameObj = {
            code:'WAREHOUSE_ID',
            exp:'=',
            value:selectedProductRowKeys[0]
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
          type:'MManage/fetchstorage',
          payload:obj,
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
      conditions:[],
      TreeMaterialData:[],
      MaterialConditions:[],
      material_id:null,
      TableMaterialData:[],
      SelectMaterialValue:[],
      selectedMaterialRowKeys:[],
      TableProductData:[],//仓库
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],

    })
    //清空后获取列表
    dispatch({
      type:'MManage/fetchstorage',
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
        type:'MManage/fetchstorage',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'MManage/fetchstorage',
      payload: obj,
    });

  };

  handleStandardTableChangeChild = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superId } = this.state;

    const conditions = [
      {
        code:'WAREHOUSING_ID',
        exp:'=',
        value:superId,
      }
    ]
    dispatch({
      type:'MManage/fetchstoragechild',
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

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,

    } = this.props;
    const { selectedRows,dis } = this.state;

    const onProductData = {
      TableData:this.state.TableProductData,
      SelectValue:this.state.SelectProductValue,
      selectedRowKeys:this.state.selectedProductRowKeys,
      columns : [
        {
          title: '仓库编号',
          dataIndex: 'code',
        },
        {
          title: '仓库名称',
          dataIndex: 'name',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'仓库编号',code:'code',placeholder:'请输入仓库编号'},
        {label:'仓库名称',code:'name',placeholder:'请输入仓库名称'},
      ],
      title:'仓库',
      placeholder:'请选择仓库',
    };
    const onProductOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'MManage/fetchstorefile',
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
            type:'MManage/fetchstorefile',
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
          type:'MManage/fetchstorefile',
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
            type:'MManage/fetchstorefile',
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
            type:'MManage/fetchstorefile',
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
          type:'MManage/fetchstorefile',
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

    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='单据编号'>
              {getFieldDecorator('code')(<Input placeholder='请输入单据编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label="仓库">
              {getFieldDecorator('warehouseId', {
              })(<ModelTable
                data={onProductData}
                on={onProductOn}
              />)}
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
      MManage:{ datastorage }
    } = this.props;

    const { updateSource,page,childDataSource,superId,record,updateChildSource} = this.state;

    const columns = [
      {
        title: '单据编号',
        dataIndex: 'code',
      },
      {
        title: '单据状态',
        dataIndex: 'status',
        render:((text,record)=>{
          if(text === 0){
            return '初始状态'
          }
        })
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
        title: '管库员',
        dataIndex: 'psnName',
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '备注',
        dataIndex: 'memo',
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
        title: '货位',
        dataIndex: 'cargoName',
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
          type:'MManage/addstorage',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'MManage/fetchstorage',
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
          type:'MManage/addstorage',
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
                  type:'MManage/fetchstorage',
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
            warehousingId:record.id,
            ...obj
          }
        }
        dispatch({
          type:'MManage/addstoragechild',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addChildVisible:false})
                clear()
                const conditions = [
                  {
                    code:'WAREHOUSING_ID',
                    exp:'=',
                    value:superId,
                  }
                ]
                dispatch({
                  type:'MManage/fetchstoragechild',
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
                     wareId:res.id,
                     materialId:obj.materialId,
                     serialId:obj.batchId,
                     locationId:obj.cargoId,
                     amount:obj.amount,
                     tupdatetime:new Date(),
                     warehouseId:record.warehouseId,
                  }
                }
                //现存量新建
                dispatch({
                  type:'MManage/addsavenew',
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
            warehousingId:superId,
            ...obj
          }
        }
        dispatch({
          type:'MManage/addstoragechild',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("编辑成功",1,()=>{
                this.setState({updateChildVisible:false})
                clear()
                const conditions = [
                  {
                    code:'WAREHOUSING_ID',
                    exp:'=',
                    value:superId,
                  }
                ]
                dispatch({
                  type:'MManage/fetchstoragechild',
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

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={fetchTableLoading}
            data={datastorage}
            columns={columns}
            scroll={{y:200}}
            //onChange={this.handleStandardTableChange}
            classNameSaveColumns={"CompletedStorage1"}
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
                        code:'WAREHOUSING_ID',
                        exp:'=',
                        value:record.id,
                      }
                    ]
                    dispatch({
                      type:'MManage/fetchstoragechild',
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
            title={() => <div>
              <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
                新建
              </Button>
            </div>}
          />
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
              classNameSaveColumns={"CompletedStorage2"}
              title={() =>  <Button
                icon="plus"
                disabled={!superId}
                onClick={this.handleCorpAddChild}
                type="primary"
              >新建</Button>}
            />
          </div>
          <AddChild on={OnAddChild} data={OnChildData} />
          <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CompletedStorage;
