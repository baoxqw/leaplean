import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Divider,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  Icon,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import NormalTable from '@/components/NormalTable';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';
import { toTree } from '@/pages/tool/ToTree';
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;

@connect(({ MManage, loading }) => ({
  MManage,
  loading: loading.models.MManage,
  fetchTableLoading:loading.effects['MManage/fetchapproval'],
  fetchTable2Loading:loading.effects['MManage/fetchapprovalchild'],
  fetchRedisLoading:loading.effects['MManage/fetchStockRedis'],
}))
@Form.create()
class ExistingStock extends PureComponent {
  state = {
    addVisible:false,
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    updateSource:[],
    updateChildSource:{},
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[],
    TreeMaterialData:[],
    MaterialConditions:[],
    material_id:null,
    TableMaterialData:[],
    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],

    selectedRowKeys:[],
    selectedRows:[],
    departmentId:[],//库位档案
    departmentTreeValue:[],
    departmentName:'',

    TableProductData:[],//仓库
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],
    expandForm:false,

    dataList:[]
  }

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MManage/fetchstock',
      payload:{
        ...page
      }
    })
  }

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'MManage/findlocation',
      payload: {
        reqData:{}
      },
      callback:(res)=>{

        const a = toTree(res.resData);
        this.setState({
          departmentTreeValue:a
        })
      }
    });
  }

  onChangDepartment = (value, label, extra)=>{
    this.setState({
      departmentId:value
    })
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page,departmentId,selectedMaterialRowKeys,selectedProductRowKeys} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const { serial, name,warehouseId } = values;
      if(serial || name || warehouseId){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};
        let wareObj = {}

        if(serial){
          codeObj = {
            code:'serial',
            exp:'=',
            value:serial
          };
          conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'MATERIAL_ID',
            exp:'=',
            value:selectedMaterialRowKeys[0]
          };
          conditions.push(nameObj)
        }
        if(warehouseId){
          wareObj = {
            code:'WAREHOUSE_ID',
            exp:'=',
            value:selectedProductRowKeys[0]
          };
          conditions.push(wareObj)
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
          type:'MManage/fetchstock',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'MManage/fetchstock',
          payload:{
            pageIndex:0,
            pageSize:10
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
      conditions:[],
      TreeMaterialData:[],
      MaterialConditions:[],
      material_id:null,
      TableMaterialData:[],
      SelectMaterialValue:[],
      selectedMaterialRowKeys:[],
      departmentId:[],//库位档案
      departmentTreeValue:[],
      departmentName:'',
      TableProductData:[],//仓库
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],
    })
    //清空后获取列表
    dispatch({
      type:'MManage/fetchstock',
      payload:{
        pageIndex:0,
        pageSize:10
      }
    });
  };

  toggleForm = () =>{
    const { expandForm } = this.state
    this.setState({expandForm:!expandForm})
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,

    } = this.props;
    const { selectedRows,page,expandForm } = this.state;
    const on = {
      onIconClick: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'MManage/matype',
          payload: {
            reqData: {}
          },
          callback: (res) => {
            const a = toTree(res.resData);
            this.setState({
              TreeMaterialData: a
            })
          }
        });
        dispatch({
          type: 'MManage/fetchMata',
          payload: {
            pageIndex: 0,
            pageSize: 10,
          },
          callback: (res) => {
            this.setState({
              TableMaterialData: res,
            })
          }
        })
        this.setState({
          cardListChild: [],
          superId: null,
          rowId: null,
          addCopy: {}
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree: (selectedKeys, info) => {
        const { dispatch } = this.props;
        const { page } = this.state

        if (info.selectedNodes[0]) {
          this.setState({
            material_id: info.selectedNodes[0].props.dataRef.id
          })
          const obj = {
            pageIndex: 0,
            pageSize: 10,
            id: info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type: 'MManage/fetchMata',
            payload: obj,
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
              })
            }
          })
        } else {
          dispatch({
            type: 'MManage/fetchMata',
            payload: {
              pageIndex: 0,
              pageSize: 10,
            },
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
                material_id: null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange: (obj) => {
        const { dispatch } = this.props;
        const { MaterialConditions, material_id } = this.state;
        const param = {
          id: material_id,
          ...obj
        };
        if (MaterialConditions.length) {
          dispatch({
            type: 'MManage/fetchMata',
            payload: {
              conditions: MaterialConditions,
              ...obj,
            },
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
              })
            }
          });
          return
        }
        dispatch({
          type: 'MManage/fetchMata',
          payload: param,
          callback: (res) => {
            this.setState({
              TableMaterialData: res,
            })
          }
        })
      }, //分页
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys.length || !selectedRows.length) {
          return
        }
        let ucumId = null;
        let ucumname = '';
        const nameList = selectedRows.map(item => {
          ucumId = item.ucumId;
          ucumname = item.ucumName;
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectMaterialValue: nameList,
          ucumId,
          ucumname,
          selectedMaterialRowKeys: selectedRowKeys,
          addShow: false,
        })
        if (selectedRowKeys[0]) {
          let conditions = [{
            code: 'MATERIAL_BASE_ID',
            exp: '=',
            value: selectedRowKeys[0]
          }]
          dispatch({
            type: 'MManage/findbomlist',
            payload: {
              conditions
            },
            callback: (res) => {
              if (res) {
                this.setState({
                  cardList: res,
                })
              }
            }
          })
        }
      }, //模态框确定时触发
      onCancel: () => {

      },  //取消时触发
      handleSearch: (values) => {
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { material_id } = this.state
        const { code, name } = values;
        if(material_id){
          if (code || name) {
            let conditions = [];
            let codeObj = {};
            let nameObj = {};

            if (code) {
              codeObj = {
                code: 'code',
                exp: 'like',
                value: code
              };
              conditions.push(codeObj)
            }
            if (name) {
              nameObj = {
                code: 'name',
                exp: 'like',
                value: name
              };
              conditions.push(nameObj)
            }
            this.setState({
              MaterialConditions: conditions
            })
            const obj = {
              pageIndex: 0,
              pageSize: 10,
              id:material_id,
              conditions,
            };
            dispatch({
              type: 'MManage/fetchMata',
              payload: obj,
              callback: (res) => {
                this.setState({
                  TableMaterialData: res,
                })
              }
            })
          } else {
            this.setState({
              MaterialConditions: []
            })
            dispatch({
              type: 'MManage/fetchMata',
              payload: {
                pageIndex: 0,
                pageSize: 10,
                id:material_id,
              },
              callback: (res) => {
                this.setState({
                  TableMaterialData: res,
                })
              }
            })
          }
        }else{
          if (code || name) {
            let conditions = [];
            let codeObj = {};
            let nameObj = {};

            if (code) {
              codeObj = {
                code: 'code',
                exp: 'like',
                value: code
              };
              conditions.push(codeObj)
            }
            if (name) {
              nameObj = {
                code: 'name',
                exp: 'like',
                value: name
              };
              conditions.push(nameObj)
            }
            this.setState({
              MaterialConditions: conditions
            })
            const obj = {
              pageIndex: 0,
              pageSize: 10,

              conditions,
            };
            dispatch({
              type: 'MManage/fetchMata',
              payload: obj,
              callback: (res) => {
                this.setState({
                  TableMaterialData: res,
                })
              }
            })
          } else {
            this.setState({
              MaterialConditions: []
            })
            dispatch({
              type: 'MManage/fetchMata',
              payload: {
                pageIndex: 0,
                pageSize: 10,

              },
              callback: (res) => {
                this.setState({
                  TableMaterialData: res,
                })
              }
            })
          }
        }

      }, //查询时触发
      handleReset: () => {
        const { material_id } = this.state
        this.setState({
          MaterialConditions: []
        })
        if(material_id){
          dispatch({
            type: 'MManage/fetchMata',
            payload: {
              pageIndex: 0,
              pageSize: 10,
              id:material_id,
            },
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
              })
            }
          })
        }else{
          dispatch({
            type: 'MManage/fetchMata',
            payload: {
              pageIndex: 0,
              pageSize: 10,
            },
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
              })
            }
          })
        }

      }, //清空时触发
      onButtonEmpty: () => {
        const { form } = this.props;
        //清空输入框
        form.resetFields();
        this.setState({
          SelectMaterialValue: [],
          selectedMaterialRowKeys: [],
          material_id:null,
          cardList: [],
          childData: [],
          addShow: true,
          superId: null,
          cardListChild: [],
          cardListAdd: [],
        })
      },
      onGetCheckboxProps:(record)=>{
        return {disabled:record.materialType === "采购件"}
      }
    };
    const datas = {
      TreeData:this.state.TreeMaterialData, //树的数据
      TableData:this.state.TableMaterialData, //表的数据
      SelectValue:this.state.SelectMaterialValue, //框选中的集合
      selectedRowKeys:this.state.selectedMaterialRowKeys, //右表选中的数据
      placeholder:'请选择物料',
      columns : [
        {
          title: '物料编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '计量单位',
          dataIndex: 'ucumName',
          key: 'ucumName',
        },
        {
          title: '物料简称',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
        },
        {
          title: '物料条形码',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
        },
        {
          title: '物料助记器',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
        },
        {
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
        },
        {
          title: '',
          dataIndex: 'caozuo',
          width:1,
        },
      ],
      fetchList:[
        {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
        {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
      ],
      title:'物料选择'
    }

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
            <FormItem label='物料名称'>
              {getFieldDecorator('name',{
                rules: [{
                  required: true,
                  message:'请选择物料名称'
                }]
              })(
                <TreeTable
                  on={on}
                  data={datas}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='批次号'>
              {getFieldDecorator('serial')(
                <Input placeholder={'请输入批次号'}/>
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
              {
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }
            </span>
          </Col>
        </Row>
         {expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label="仓库名称">
              {getFieldDecorator('warehouseId', {
                initialValue:this.state.SelectProductValue,
              })(<ModelTable
                data={onProductData}
                on={onProductOn}
              />)}
            </FormItem>
          </Col>
        </Row>:''}
        {/*<div>
          <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
            新建
          </Button>
        </div>*/}
      </Form>
    );
  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };

  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MManage/deletestock',
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
              type:'MManage/fetchstock',
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

  //编辑
  updataRoute = (record)=>{
    this.setState({
      updateSource:record,
      updateVisible:true,
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
    this.setState({
      page:obj
    });
    if(conditions.length){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'MManage/fetchstock',
        payload: param,
      });
      return
    }
    dispatch({
      type:'MManage/fetchstock',
      payload: obj,
    });
  };

  render() {
    const {
      loading,
      MManage:{ datastock,redisExitData },
      dispatch,
      fetchRedisLoading
    } = this.props;
    const { page ,updateSource,dataList} = this.state

    const columns = [
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '批次号',
        dataIndex: 'serialId',
      },
      {
        title: '数量',
        dataIndex: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      /*{
        title: '借入量',
        dataIndex: 'nnum1',
      },
      {
        title: '借出量',
        dataIndex: 'nnum2',
      },*/
      {
        title: '上次更新时间',
        dataIndex: 'tupdatetime',
      },
      {
        title: '库位档案',
        dataIndex: 'locationName',
      },
      {
        title: '仓库名称',
        dataIndex: 'warehouseName',
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
          {/*  <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(record)}>编辑</a>*/}
          </Fragment>
        }
      },
    ];

   /* const columns2 = [
      {
        title: '物料编码',
        dataIndex: 'invcode',
      },
      {
        title: '物料名称',
        dataIndex: 'invname',
      },
      {
        title: '库存组织名称',
        dataIndex: 'bodyname',
      },
      {
        title: '库存组织主键',
        dataIndex: 'ccalbodyid',
      },
      {
        title: '存货基本主键',
        dataIndex: 'cinventoryid',
      },
      {
        title: '仓库主键',
        dataIndex: 'cwarehouseid',
      },
      {
        title: '冻结数量',
        dataIndex: 'freezenum',
      },
      {
        title: '冻结毛重数量',
        dataIndex: 'nfreezegrossnum',
      },
      {
        title: '结存毛重数量',
        dataIndex: 'ngrossnum',
      },
      {
        title: '结存数量',
        dataIndex: 'num',
      },
      {
        title: '公司编码',
        dataIndex: 'pk_corp',
      },
      {
        title: '存货档案主键',
        dataIndex: 'pk_invbasdoc',
      },
      {
        title: '仓库名称',
        dataIndex: 'storname',
      },
      {
        title: '批次号',
        dataIndex: 'vbatchcode',
      },
      {
        title: '',
        dataIndex: 'caozuo',
        width:100
      }
    ];*/

    const OnAddSelf = {
      onSave:(obj,clear)=>{
        dispatch({
          type:'MManage/addstock',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'MManage/fetchstock',
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
          type:'MManage/addstock',
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
                  type:'MManage/fetchstock',
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

    return (
      <PageHeaderWrapper>
          <Card bordered={false}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div style={{marginTop:'12px'}}>
              <NormalTable
                loading={loading}
                data={datastock}
                columns={columns}
                // scroll={{y:260}}
                classNameSaveColumns={"ExistingStock"}
                onChange={this.handleStandardTableChange}
                //rowClassName={this.setRowClassName}
                /* onRow={(record )=>{
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
                             /!* if(res.length){
                                this.setState({childDataSource:res})
                              }else{
                                this.setState({childDataSource:[]})
                              }*!/

                           }
                         });
                       }
                     },
                     rowKey:record.id
                   }
                 }}*/
              />
            </div>
            <AddSelf on={OnAddSelf} data={OnSelfData} />
            <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
          </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ExistingStock;
