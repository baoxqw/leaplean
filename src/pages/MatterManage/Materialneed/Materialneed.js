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
  Icon,
  Select,
  message,
  Popconfirm,
  Upload,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import UpdateSelf from './UpdateSelf';
import IneedCard from '@/pages/MatterManage/Materialneed/IneedCard';
import moment from 'moment'


const FormItem = Form.Item;
const { Option } = Select;
@connect(({ MManage, loading }) => ({
  MManage,
  loading: loading.models.MManage,
  fetchTableLoading:loading.effects['MManage/fetchneed'],
}))
@Form.create()
class Materialneed extends PureComponent {
  state = {
    addVisible:false,
    updateVisible:false,
    updateSource:[],
    page:{
      pageSize:100000,
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

    visible:false,

    dis:false,

  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'MManage/fetchneed',
      payload:{
        ...page
      }
    })
  }

  //新建
  handleCorpAdd = () => {
    const { visible } = this.state;
    this.setState({
      visible:!visible
    })
    if(visible){
      this.setState({
        selectedRowKeys:[],
        selectedRows:[],
      })
    }
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
      type:'MManage/deleteneed',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'MManage/fetchneed',
              payload:{
                ...page
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
    const { page,selectedMaterialRowKeys} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code, name } = values;
      if(!code && !name){
        dispatch({
          type:'MManage/fetchneed',
          payload:{
            ...page
          }
        })
      }
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
            code:'MATERIAL_ID',
            exp:'=',
            value:selectedMaterialRowKeys[0]
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
          type:'MManage/fetchneed',
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
    })
    //清空后获取列表
    dispatch({
      type:'MManage/fetchneed',
      payload:{
        ...page
      }
    })
  };

  //编辑
  updataRoute = (e,record)=>{
    e.preventDefault();
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
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'MManage/fetchneed',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'MManage/fetchneed',
      payload: obj,
    });

  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      dispatch,
      loading
    } = this.props;

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

    return (
      <div>
        <Form onSubmit={(e)=>this.findList(e)} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={16}>
              <FormItem label='单据编号'>
                {getFieldDecorator('code')(<Input placeholder='请输入单据编号' />)}
              </FormItem>
            </Col>
            <Col md={8} sm={16}>
              <FormItem label='物料名称'>
                {getFieldDecorator('name')(
                  <TreeTable
                    on={on}
                    data={datas}
                  />
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
      </div>
    );
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  };

  onSave = ()=>{
    /*const { selectedRows,dis } = this.state;
    const { dispatch } = this.props;
    if(dis){
      return
    }
    this.setState({
      dis:true
    })
    dispatch({
      type:'MManage/generateA',
      payload:{
        reqData:{
          documentStatus:0,
          shippingStatus:0,
          claimDate:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      callback:(res)=>{
        if(res.errMsg === '成功'){
          const id = res.id;
          let arr = [];
          selectedRows.map(item =>{
            arr.push({
              applyId:id,
              pickerId:item.psnId,
              materialId:item.materialId,
              deptId:item.deptId,
              amount:item.amount
            })
            item.applyId = id;
          });

          dispatch({
            type:'MManage/generateB',
            payload:{
              reqDataList:arr
            },
            callback:(res)=>{
              if(res.errMsg === '成功'){
                message.success("成功",1.5,()=>{
                  this.setState({
                    dis:false,
                    visible:false,
                    selectedRowKeys:[],
                    selectedRows:[],
                  })
                })

                dispatch({
                  type:'MManage/addBaveDemand',
                  payload:{
                    reqDataList:selectedRows
                  },
                  callback:(response)=>{

                  }
                })

              }else{
                message.error("失败")
              }
            }
          })
        }else{
          message.error("失败")
        }
      }
    })*/
    this.setState({
      addVisible:true
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      fetchTableLoading,
      dispatch,
      MManage:{ dataneed },
    } = this.props;

    const { updateSource,page,selectedRowKeys,visible,selectedRows,dis } = this.state;
    const columns = [
      {
        title: '单据编号',
        dataIndex: 'code',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '生产订单编号',
        dataIndex: 'productCode',
      },
      {
        title: '数量',
        dataIndex: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: '部门',
        dataIndex: 'deptName',
      },
      {
        title: '申请人',
        dataIndex: 'psnName',
      },
      {
        title: '申请时间',
        dataIndex: 'applyTine',
      },
      {
        title: '是否申领',
        dataIndex: 'applyId',
        render:(text)=>{
          if(text){
            return '已申领'
          }
          return '未申领'
        }
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

    const OnUpdateData = {
      visible:this.state.updateVisible,
      record:updateSource
    }
    const OnUpdateSelf = {
      onSave:(obj,clear)=>{

        dispatch({
          type:'MManage/addneed',
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
                  type:'MManage/fetchneed',
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

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: record.applyId
      }),
    };


    const OnAddSelf = {
      onSave:(arr,clear)=>{
        dispatch({
          type:'MManage/generateA',
          payload:{
            reqData:{
              status:"初始状态",
              shippingStatus:0,
              claimDate:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          callback:(res)=>{
            if(res.errMsg === '成功'){
              const id = res.id;
              let arr2 = [];
              arr.map(item =>{
                arr2.push({
                  applyId:id,
                  pickerId:item.psnId,
                  materialId:item.materialId,
                  deptId:item.deptId,
                  amount:item.amount
                });
                item.applyId = id
              });
              dispatch({
                type:'MManage/generateB',
                payload:{
                  reqDataList:arr2
                },
                callback:(res)=>{
                  if(res.errMsg === '成功'){
                    message.success("成功",1.5,()=>{
                      clear();
                      this.setState({
                        dis:false,
                        visible:false,
                        addVisible:false,
                        selectedRowKeys:[],
                        selectedRows:[],
                      })
                      dispatch({
                        type:'MManage/addneedBatch',
                        payload:{
                          reqDataList:arr
                        },
                        callback:(res)=>{
                          if(res.errMsg === "成功"){
                            const { page } = this.state;
                            dispatch({
                              type:'MManage/fetchneed',
                              payload:{
                                ...page
                              }
                            })
                          }else{
                            message.error('编辑失败')
                          }
                        }
                      })
                    })
                  }else{
                    message.error("失败")
                  }
                }
              })
            }else{
              message.error("失败")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false,
          selectedRowKeys:[],
          selectedRows:[],
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addVisible
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={fetchTableLoading}
            data={dataneed}
            columns={columns}
            onChange={this.handleStandardTableChange}
            rowSelection={visible?rowSelection:null}
            pagination={false}
            classNameSaveColumns={"Materialneed"}
            title={() => <Row style={{display:'flex'}}>
              <Col>
                <Button onClick={ this.handleCorpAdd } type="primary" >
                  批量申领
                </Button>
              </Col>
              <Col style={{marginLeft:12,display:`${selectedRows.length?'':'none'}`}}>
                <Button  onClick={ this.onSave } disabled={dis} type="primary" >
                  确定
                </Button>
              </Col>
            </Row>}
          />
          <IneedCard on={OnAddSelf} datas={OnSelfData} data={selectedRows}/>
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Materialneed;
