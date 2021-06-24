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
  Select,
  message,
  Popconfirm,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import AddSelf from '@/pages/QualityManage/OverdueTask/AddSelfOver';
import AddChild from '@/pages/QualityManage/OverdueTask/AddChildOver';
import UpdateSelf from '@/pages/QualityManage/OverdueTask/UpdateSelfOver';
import UpdateChild from '@/pages/QualityManage/OverdueTask/UpdateChildOver';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';


import './tableSureBg.less'
const FormItem = Form.Item;

@connect(({ overtask, loading }) => ({
  overtask,
  loading: loading.models.overtask,
  loadingChild: loading.effects['overtask/childFetch'],
  loadingSuper: loading.effects['overtask/fetch'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class OverdueTask extends PureComponent {
  state = {
    addVisible:false,
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    page:{
      pageSize:10000,
      pageIndex:0
    },
    superId:null,
    rowId:null,
    conditions:[],
    childData:[],
    superData:{},
    updateSource:{},
    updateChildSource:{},

    TreeMaterialData:[],
    MaterialConditions:[],
    material_id:null,
    TableMaterialData:[],
    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'overtask/fetch',
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

  handleChilddd = () => {
    this.setState({
      addChildVisible:true
    })
  };

  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'overtask/deleteSelf',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'overtask/fetch',
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
    const { page,superId } = this.state;
    dispatch({
      type:'overtask/deleteChild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'overtask/childFetch',
              payload:{
                obj,
                conditions:[{
                  code:'OVERDUE_RETEST_ID',
                  exp:'=',
                  value:superId,
                }]
              },
              callback:(res)=>{
                if(res.list){
                  this.setState({childData:res})
                }else{
                  this.setState({childData:{}})
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
    const { page,selectedMaterialRowKeys} = this.state;
    form.validateFieldsAndScroll((err, values) => {
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
          type:'overtask/fetch',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[],
        });
        dispatch({
          type:'overtask/fetch',
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
      type:'overtask/fetch',
      payload:{
        ...page
      }
    });
  };

  //编辑
  updataRoute = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateSource:record,
      updateVisible:true,
    })
  }

  updataChildRoute = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateChildSource:record,
      updateChildVisible:true,
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { superId} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    dispatch({
      type:'overtask/childFetch',
      payload:{
        obj,
        conditions:[{
          code:'OVERDUE_RETEST_ID',
          exp:'=',
          value:superId,
        }]
      },
      callback:(res)=>{
        if(res.list){
          this.setState({childData:res})
        }else{
          this.setState({childData:{}})
        }
      }
    })
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

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
          type: 'overtask/matype',
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
          type: 'overtask/fetchMata',
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
            type: 'overtask/fetchMata',
            payload: obj,
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
              })
            }
          })
        } else {
          dispatch({
            type: 'overtask/fetchMata',
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
            type: 'overtask/fetchMata',
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
          type: 'overtask/fetchMata',
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
            type: 'overtask/findbomlist',
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
              type: 'overtask/fetchMata',
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
              type: 'overtask/fetchMata',
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
              type: 'overtask/fetchMata',
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
              type: 'overtask/fetchMata',
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
            type: 'overtask/fetchMata',
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
            type: 'overtask/fetchMata',
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
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      loadingChild,
      loadingSuper,
      dispatch,
      overtask:{data},
    } = this.props;
    const { updateSource,updateVisible,superId,childData,updateChildSource,updateChildVisible } = this.state;
    const columns = [
      {
        title: '单据编号',
        dataIndex: 'billcode',
      },
      {
        title: '送检人',
        dataIndex: 'senderName',
      },
      {
        title: '物料',
        dataIndex: 'materialName',
      },
      {
        title: '预期',
        dataIndex: 'expected',
      },
      {
        title: '批号数量',
        dataIndex: 'lotNumber',
        sorter: (a, b) => a.lotNumber - b.lotNumber,
      },
      {
        title: '复验号',
        dataIndex: 'recheckNumber',
      },
      {
        title: '样本编号',
        dataIndex: 'sampleNumber',
      },
      {
        title: '请求日期',
        dataIndex: 'requestDate',
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
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const childColumns = [
      {
        title: '序号',
        dataIndex: 'number',
      },
      {
        title: '试样名称',
        dataIndex: 'sampleName',
      },
      {
        title: '测试项目',
        dataIndex: 'testProject',
      },
      {
        title: '测试标准',
        dataIndex: 'standardTest',
      },
      {
        title: '指标要求',
        dataIndex: 'target',
      },
      {
        title: '测试温度',
        dataIndex: 'testTemperature',
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
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleChildDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataChildRoute(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const OnAddSelf = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'overtask/addself',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('已完成',1.5,()=>{
                clear()
                this.setState({addVisible:false})
                const { page } = this.state;
                dispatch({
                  type:'overtask/fetch',
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
          type:'overtask/addself',
          payload:{
            reqData:{
              id:this.state.updateSource.id,
              ...obj
            }
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('已完成',1.5,()=>{
                clear();
                this.setState({updateVisible:false})
                const { page } = this.state;
                dispatch({
                  type:'overtask/fetch',
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
    };

    const OnAddChild ={
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        if(obj){
            obj.overdueRetestId = superId
        }
        dispatch({
          type:'overtask/addchild',
          payload:{
            reqData:{
              ...obj
            }
          },
          callback:(res)=>{
  
            if(res.errMsg === "成功"){
              message.success('已完成',1.5,()=>{
                clear();
                this.setState({addChildVisible:false})
                dispatch({
                  type:'overtask/childFetch',
                  payload:{
                    obj,
                    conditions:[{
                      code:'OVERDUE_RETEST_ID',
                      exp:'=',
                      value:superId,
                    }]
                  },
                  callback:(res)=>{
                    if(res.list){
                      this.setState({childData:res})
                    }else{
                      this.setState({childData:{}})
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
        if(obj){
          obj.overdueRetestId = superId
          if(obj.testTemperature){
            obj.number = Number(obj.testTemperature)
          }
        }
        dispatch({
          type:'overtask/addchild',
          payload:{
            reqData:{
              id:updateChildSource.id,
              ...obj
            }
          },
          callback:(res)=>{
 
            if(res.errMsg === "成功"){
              message.success('已完成',1.5,()=>{
                clear();
                this.setState({updateChildVisible:false})
                dispatch({
                  type:'overtask/childFetch',
                  payload:{
                    obj,
                    conditions:[{
                      code:'OVERDUE_RETEST_ID',
                      exp:'=',
                      value:superId,
                    }]
                  },
                  callback:(res)=>{
                    if(res.list){
                      this.setState({childData:res})
                    }else{
                      this.setState({childData:{}})
                    }
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
          <NormalTable
            loading={loadingSuper}
            data={data}
            columns={columns}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  const { dispatch } = this.props;
                  const { page } = this.state;
                  dispatch({
                    type:'overtask/childFetch',
                    payload:{
                      pageIndex:0,
                      pageSize:10,
                      conditions:[{
                        code:'OVERDUE_RETEST_ID',
                        exp:'=',
                        value:record.id
                      }]
                    },
                    callback:(res)=>{
                      if(res.list){
                        this.setState({childData:res})
                      }else{
                        this.setState({childData:{}})
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
            scroll={{y:260}}
            //onChange={this.handleStandardTableChange}
            classNameSaveColumns={"OverdueTask1"}
            pagination={false}
            title={() =><div>
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
              loading={loadingChild}
              data={childData}
              columns={childColumns}
              onChange={this.handleStandardTableChange}
              classNameSaveColumns={"OverdueTask2"}
              title={() => <Button icon="plus" onClick={this.handleChilddd} type="primary" disabled={superId?0:1}>
                新建
              </Button>}
            />
          </div>
          <AddChild on={OnAddChild} data={OnAddData} />
          <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OverdueTask;
