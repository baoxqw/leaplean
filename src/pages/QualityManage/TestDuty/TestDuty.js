import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Checkbox,
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
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from '@/pages/QualityManage/TestDuty/AddSelfDuty';
import UpdateSelf from '@/pages/QualityManage/TestDuty/UpdateSelfDuty';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import router from 'umi/router';
import './tableSureBg.less'
import TestDutyChildAdd from '@/pages/QualityManage/TestDuty/TestDutyChildAdd';
import TestDutyChildUpdate from '@/pages/QualityManage/TestDuty/TestDutyChildUpdate';

const FormItem = Form.Item;

@connect(({ testduty, loading }) => ({
  testduty,
  loadingSuper: loading.effects['testduty/fetch'],
  loadingChild: loading.effects['testduty/childFetch'],
}))
@Form.create()
class TestDuty extends PureComponent {
  state = {
    TreeMaterialData:[], //存储左边树的数据
    MaterialConditions:[], //存储查询条件
    material_id:null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id

    addShow:true,
    TableData:[],
    SelectValue:'',
    selectedRowKeys:[],
    Jpage:{},
    Jconditions:[],

    addVisible:false,
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    updateSource:[],
    page:{
      pageSize:100000,
      pageIndex:0
    },
    superId:null,
    rowId:null,
    conditions:[],
    childData:[],
    superData:{},

    updateChildSource:{},
  };
  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'testduty/fetch',
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

  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'testduty/deleteSelf',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'testduty/fetch',
              payload:{
                ...page
              }
            })
          })
        }
      }
    })
  }
  handleChildDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { superId } = this.state;
    dispatch({
      type:'testduty/deleteChild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'testduty/childFetch',
              payload:{
                conditions:[{
                  code:'INSPECTION_ID',
                  exp:'=',
                  value:superId
                }]
              },
              callback:(res)=>{
                if(res && res.resData && res.resData.length) {
                  this.setState({
                    childData: res.resData
                  })
                }else{
                  this.setState({
                    childData: []
                  })
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
    const { page,selectedMaterialRowKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code, name } = values;
      if(code || name){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'billcode',
            exp:'like',
            value:code
          };
          conditions.push(codeObj)
        }
        if(name){
          nameObj = {
            code:'MATERIAL_ID',
            exp:'=',
            value:selectedMaterialRowKeys.length?selectedMaterialRowKeys[0]:null
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
          type:'testduty/fetch',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'testduty/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
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
      type:'testduty/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    });
  };
  //编辑
  updataRoute = (record)=>{
    this.setState({
      updateSource:record,
      updateVisible:true,
    })
  }

  updataChildRoute = (e,record)=>{
    e.preventDefault()
    router.push('/qualitymanage/testduty/datein',{record});
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
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'testduty/fetch',
        payload: param,
      });
      return
    }
    dispatch({
      type:'testduty/fetch',
      payload: obj,
    });

  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch 
    } = this.props;
    const { superId } = this.state
 
    const on = {
      onIconClick: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'testduty/matype',
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
          type: 'testduty/fetchMata',
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
            type: 'testduty/fetchMata',
            payload: obj,
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
              })
            }
          })
        } else {
          dispatch({
            type: 'testduty/fetchMata',
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
            type: 'testduty/fetchMata',
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
          type: 'testduty/fetchMata',
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
            type: 'testduty/findbomlist',
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
              type: 'testduty/fetchMata',
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
              type: 'testduty/fetchMata',
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
              type: 'testduty/fetchMata',
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
              type: 'testduty/fetchMata',
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
            type: 'testduty/fetchMata',
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
            type: 'testduty/fetchMata',
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
      title:'物料选择',
    }
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='单据编号'>
              {getFieldDecorator('code')(<Input placeholder='请输入单据编号' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
           <FormItem label='物料名称'>
              {getFieldDecorator('name')(<TreeTable
                on={on}
                data={datas}
              />)}
            </FormItem>
            {/* <FormItem label='物料编码'>
              {getFieldDecorator('name')(<Input placeholder='请输入物料编码' />)}
            </FormItem> */}
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

        <div>
         {/* <Button icon="plus" onClick={this.handleCorpAdd} type="primary" >
            新建
          </Button>*/}
        </div>
      </Form>
    );
  }

  onChildAddV = ()=>{
    this.setState({
      addChildVisible:true
    })
  }

  onChildUpdate = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateChildVisible:true,
      updateChildSource:record
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      loadingSuper,
      loadingChild,
      dispatch,
      testduty:{data},
    } = this.props;
    const { updateSource,updateVisible,superId,childData,updateChildSource,updateChildVisible } = this.state;

    const columns = [
      {
        title: '单据编号',
        dataIndex: 'billcode',
      },
      {
        title: '检验状态',
        dataIndex: 'status',
        render: (text, record) => {
          if(text === 0){
            return "待检验"
          }
          if(text === 1){
            return "检验通过"
          }
          if(text === 2){
            return "检验不通过"
          }
        }
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '工序号',
        dataIndex: 'number',
      },
      {
        title: '型号',
        dataIndex: 'modelId',
      },
      {
        title: '工作令',
        dataIndex: 'workName',
      },
      {
        title: '工序',
        dataIndex: 'processName',
      },
      {
        title: '送审人员',
        dataIndex: 'submitPsnId',
      },
      {
        title: '检验人员',
        dataIndex: 'inspectorsId',
      },
      {
        title: '完工数量',
        dataIndex: 'completed',
      },
      {
        title: '合格数量',
        dataIndex: 'qualified',
      },
      {
        title: '不合格数量',
        dataIndex: 'noQualified',
      },
      {
        title: '派工单号',
        dataIndex: 'dispatchId',
      },
      {
        title: '生产订单号',
        dataIndex: 'productionCode',
      },
      {
        title: '质量要求',
        dataIndex: 'requorements',
      },
      {
        title: '工艺路线',
        dataIndex: 'craftName',
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
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const childColumns = [
      {
        title: '湿度',
        dataIndex: 'ambientHumidity',
      },
      {
        title: '环境温度',
        dataIndex: 'ambientTemperature',
      },
      {
        title: '是否默认环境温度',
        dataIndex: 'isAmt',
        render:(text)=>{
          return <Checkbox checked={text == 0?false:true}></Checkbox>
        }
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleChildDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.onChildUpdate(e,record)}>编辑</a>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataChildRoute(e,record)}>录入</a>
          </Fragment>
        }
      },
    ];

    const OnAddSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'testduty/addself',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('新建成功',1.5,()=>{
                clear();
                this.setState({addVisible:false})
                const { page } = this.state;
                dispatch({
                  type:'testduty/fetch',
                  payload:{
                    ...page
                  }
                })
              });
            }else{
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
    }
    const OnSelfData = {
      visible:this.state.addVisible
    }

    const OnUpdateSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'testduty/addself',
          payload:{
            reqData:{
              id:this.state.updateSource.id,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('编辑成功',1.5,()=>{
                clear();
                this.setState({updateVisible:false})
                const { page } = this.state;
                dispatch({
                  type:'testduty/fetch',
                  payload:{
                    ...page
                  }
                })
              });
            }else{
              message.error("编辑失败")
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
    const OnUpdateData= {
      visible:updateVisible,
      record:updateSource
    }

    const OnAddChild ={
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        dispatch({
          type:'testduty/addbook',
          payload:{
            reqData:{
              inspectionId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('新建成功',1.5,()=>{
                clear();
                this.setState({addChildVisible:false})
                dispatch({
                  type:'testduty/childFetch',
                  payload:{
                    conditions:[{
                      code:'INSPECTION_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{
                    if(res && res.resData && res.resData.length) {
                      this.setState({
                        childData: res.resData
                      })
                    }else{
                      this.setState({
                        childData: []
                      })
                    }
                  }
                })
              });
            }else{
              message.error("新建失败")
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
    const OnAddData = {
      visible:this.state.addChildVisible
    }

    const OnUpdateChild ={
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        dispatch({
          type:'testduty/addbook',
          payload:{
            reqData:{
              inspectionId:superId,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('编辑成功',1.5,()=>{
                clear();
                this.setState({updateChildVisible:false})
                dispatch({
                  type:'testduty/childFetch',
                  payload:{
                    conditions:[{
                      code:'INSPECTION_ID',
                      exp:'=',
                      value:superId
                    }]
                  },
                  callback:(res)=>{
                    if(res && res.resData && res.resData.length) {
                      this.setState({
                        childData: res.resData
                      })
                    }else{
                      this.setState({
                        childData: []
                      })
                    }
                  }
                })
              });
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
    const OnUpdateChildData = {
      visible:updateChildVisible,
      record:updateChildSource,
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div style={{marginTop:'12px'}}>
            <NormalTable
              loading={loadingSuper}
              data={data}
              columns={columns}
              scroll={{ y: 260}}
              pagination={false}
              onRow={(record )=>{
                return {
                  onClick:()=>{
                    const { dispatch } = this.props;
                    const { page } = this.state;
                    dispatch({
                      type:'testduty/childFetch',
                      payload:{
                        conditions:[{
                          code:'INSPECTION_ID',
                          exp:'=',
                          value:record.id
                        }]
                      },
                      callback:(res)=>{
                        if(res && res.resData && res.resData.length) {
                          this.setState({
                            childData: res.resData
                          })
                        }else{
                          this.setState({
                            childData: []
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
              classNameSaveColumns={"TestDuty1"}
              //onChange={this.handleStandardTableChange}
            />
          </div>

          <AddSelf on={OnAddSelf} data={OnSelfData} />
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateData} />
        </Card>
        <Card bordered={false} style={{marginTop:15}}>
          <div style={{marginTop:'-18px'}}>
            <NormalTable
              loading={loadingChild}
              dataSource={childData}
              columns={childColumns}
              classNameSaveColumns={"TestDuty2"}
              //onChange={this.handleStandardTableChangeChild}
              pagination={false}
              title={() =>             <Button icon="plus" onClick={this.onChildAddV} type="primary" disabled={superId?0:1}>
                新建
              </Button>
              }
            />
          </div>
          <TestDutyChildAdd on={OnAddChild} data={OnAddData}/>
          <TestDutyChildUpdate on={OnUpdateChild} data={OnUpdateChildData}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TestDuty;
