import React, { PureComponent, useState,Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Divider,
  Button,
  Card,
  Select,
  Tabs,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import NormalTable from '@/components/NormalTable';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import AssignTeamModle from '@/pages/ProductExecu/WorkPlan/AssignTeamModle';
import UpdateSuper from '@/pages/ProductExecu/WorkPlan/UpdateSuper';
import UpdateChildRoot from '@/pages/ProductExecu/WorkPlan/UpdateChild';
import './style.less'
const { TabPane } = Tabs;
const FormItem = Form.Item;

@connect(({ workplan,loading }) => ({
  workplan,
  loading:loading.models.workplan,
  fetchTableLoading:loading.effects['workplan/fetchtable'],
  fetchTable2Loading:loading.effects['workplan/fetchtable2'],
}))
@Form.create()
class WorkPlan extends PureComponent {
  state = {
    TreeMaterialData:[],
    MaterialConditions:[],
    material_id:null,
    TableMaterialData:[],
    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],

    ucumname:'',
    ucumId:'',
    childTable:[],
    selectedRowKeys: [],
    selectedRows: [],
    assignTeam:false,
    addTeamVisible:false,
    superData:[],
    childDataSource:[],
    updateSuperVisible:false,
    updateSuperData:{},
    updateChildData:{},
    updateChildVisible:false,
    materialSelectedRows:[],

    expandForm:false
  };

  componentDidMount(){
    const { dispatch } = this.props
    dispatch({
      type:'workplan/fetchtable',
      payload:{
        pageIndex:0,
        pageSize:1000
      },
      callback:(res)=>{
        this.setState({superData:res})
      }
    })

   /* let conditions = [{
      code:'PROCESSSTATUS',
      exp:'=',
      value:1
    }]
    dispatch({
      type:'workplan/fetchtable2',
      payload:{
        conditions,
        pageIndex:0,
        pageSize:10000,
      },
      callback:(res)=>{
        if(res.length){
          this.setState({childDataSource:res})
        }else{
          this.setState({childDataSource:[]})
        }

      }
    });*/

  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page,selectedMaterialRowKeys } = this.state;
  
    form.validateFieldsAndScroll((err, values) => {
      this.setState({
        childDataSource:[]
      })
      if(selectedMaterialRowKeys.length){
          dispatch({
            type:'workplan/fetchtable',
            payload:{
              pageSize:10000,
              reqData:{
                MATERIAL_BASE_ID:selectedMaterialRowKeys[0]
              }
            },
            callback:(res)=>{
              this.setState({superData:res})
            }
          });
          /*
          dispatch({
            type:'workplan/fetchtable2',
            payload:{
              pageSize:10000,
              reqData:{
                MATERIAL_BASE_ID:selectedMaterialRowKeys[0]
              }
            },
            callback:(res)=>{
              this.setState({childDataSource:res})
            }
          });*/
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
      page:{
        pageSize:10,
        pageIndex:0
      },
      SelectMaterialValue:[],
      selectedMaterialRowKeys:[],
      superData:[],
      childDataSource:[]
    })
    //清空后获取列表
    dispatch({
      type:'workplan/fetchtable',
      payload:{
        pageIndex:0,
        pageSize:10000
      },
      callback:(res)=>{
        this.setState({superData:res})
      }
    })
    /*
    dispatch({
      type:'workplan/fetchtable2',
      payload:{
        pageSize:10000,
      },
      callback:(res)=>{
        this.setState({childDataSource:res})
      }
    });*/
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      dispatch
    } = this.props;

    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'workplan/matype',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreeMaterialData:a
            })
          }
        });
        dispatch({
          type:'workplan/fetchMata',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //input聚焦时调用的接口获取信息
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'workplan/fetchMata',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
                material_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'workplan/fetchMata',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
                material_id:obj.id
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { MaterialConditions,material_id } = this.state;
        const param = {
          id:material_id,
          ...obj
        };
        if(MaterialConditions.length){
          dispatch({
            type:'workplan/fetchMata',
            payload:{
              conditions:MaterialConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'workplan/fetchMata',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys.length || !selectedRows.length){
          return
        }
        let ucumId = null;
        let ucumname = '';
        const nameList = selectedRows.map(item =>{
          ucumId = item.ucumId;
          ucumname = item.ucumname;
          return item.name
        });
        onChange(nameList)
        const { dispatch } = this.props;
        this.setState({
          SelectMaterialValue:nameList,
          selectedMaterialRowKeys:selectedRowKeys,
          ucumId,
          ucumname,
        })
      /*  let conditions = [{
          code:'PROCESSSTATUS',
          exp:'=',
          value:0
        }]
        dispatch({
          type:'workplan/fetchtable',
          payload:{
            conditions,
            pageSize:10000,
            reqData:{
              MATERIAL_BASE_ID:selectedRowKeys[0]
            }
          },
          callback:(res)=>{
            this.setState({superData:res})
          }
        });
        let conditions2 = [{
          code:'PROCESSSTATUS',
          exp:'=',
          value:1
        }]
        dispatch({
          type:'workplan/fetchtable2',
          payload:{
            conditions:conditions2,
            pageSize:10000,
            reqData:{
              MATERIAL_BASE_ID:selectedRowKeys[0]
            }
          },
          callback:(res)=>{
            this.setState({childDataSource:res})
          }
        });*/
      }, //模态框确定时触发
      onCancel:()=>{

      },  //取消时触发
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
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
            MaterialConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'workplan/fetchMata',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
              })
            }
          })
        }else{
          this.setState({
            MaterialConditions:[]
          })
          dispatch({
            type:'workplan/fetchMata',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          MaterialConditions:[]
        })
        dispatch({
          type:'workplan/fetchMata',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        const { form} = this.props;
        //清空输入框
        form.resetFields();
        this.setState({
          SelectMaterialValue:[],
          selectedMaterialRowKeys:[],
          superData:[],
          childDataSource:[]
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
      title:'物料选择'
    }

    return (
      <Form  layout="inline" onSubmit={(e)=>this.findList(e)}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='物料编码'>
              {getFieldDecorator('code',{
              })(
                <TreeTable
                  on={on}
                  data={datas}
                />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/*<FormItem label='工艺路线名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入工艺路线名称' />)}
            </FormItem>*/}
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
        <div style={{margin:'20px'}}></div>
        {/* <div style={{marginBottom:'20px'}}>
          <Button icon="plus" disabled={!this.state.selectedMaterialRowKeys[0]}  onClick={this.handleAdd} type="primary" >
            新建
          </Button>
          <Button icon="plus" disabled={!this.state.superId} onClick={this.handleCorpAdd} type="primary" style={{marginLeft:'12px'}}>
            复制并新建
          </Button>
          <Button icon="plus" disabled={!this.state.childId} onClick={this.uploadAdd} type="primary" style={{marginLeft:'12px'}}>
            上传附件
          </Button>
        </div>*/}
      </Form>

    );
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
    const { childDataSource } = this.state
    let minArray = []
    childDataSource.map((item)=>{
      minArray.push(Number(item.processplanCode))
    })
    let endMin = Math.min.apply(Math,minArray);
    let processplanCodeArray = []
    selectedRows.map((item)=>{
      processplanCodeArray.push(Number(item.processplanCode))
    })
    let min = Math.min.apply(Math,processplanCodeArray);
    this.setState({ selectedRowKeys,selectedRows });

      if(min === endMin && selectedRowKeys.length){
        this.setState({
          assignTeam:true
        })
      }else{
        this.setState({
          assignTeam:false
        })
      }


  };

  addTeam = ()=>{
    this.setState({addTeamVisible:true})
  }

  update = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateSuperVisible:true,
      updateSuperData:record
    })
  }

  updateChild = (e,record)=>{
    e.preventDefault()
    this.setState({
      updateChildVisible:true,
      updateChildData:record
    })
  }

  handleDelete = (record)=>{
    const { id } = record
    const { dispatch } = this.props
    dispatch({
      type:'workplan/deleteSuper',
      payload:{
        reqData:{
          id:id
        }
      },
      callback:(res)=>{
        if(res.errCode === '0'){
          message.success('删除成功',1.5,()=>{
            dispatch({
              type:'workplan/fetchtable',
              payload:{
                pageSize:10000,
              },
              callback:(res)=>{
                this.setState({superData:res})
              }
            });
          })
        }
      }
    })
  }

  handleDeleteChild = (record)=>{
    const { id } = record
    const { dispatch } = this.props
    dispatch({
      type:'workplan/deleteSuper',
      payload:{
        reqData:{
          id:id
        }
      },
      callback:(res)=>{
        if(res.errCode === '0'){
          message.success('删除成功',1.5,()=>{
            dispatch({
              type:'workplan/fetchtable',
              payload:{
                pageSize:10000,
              },
              callback:(res)=>{
                this.setState({childDataSource:res})
              }
            });
          })
        }
      }
    })
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  render() {
    const {
      loading,
      dispatch,
      fetchTableLoading,
      fetchTable2Loading
     // workplan:{data}
    } = this.props;
    const columns  = [
      {
        title: '订单编号',
        dataIndex: 'productorderCode',
      },
      {
        title: '生产序号',
        dataIndex: 'prodserial',
      },
      {
        title: '物料名称',
        dataIndex: 'materialBaseName',
      },
       {
        title: '物料编码',
        dataIndex: 'materialBaseCode',
      },
      {
        title: '卡号',
        dataIndex: 'cardnum',
      },
      {
        title: '工艺路线完成标志',
        dataIndex: 'gylxFlag',
      },
      {
        title: '电装元器件完成标记',
        dataIndex: 'dzFlag',
      },
      {
        title: '装配零部件完成标记',
        dataIndex: 'zpFlag',
      },
      {
        title: '完工标记',
        dataIndex: 'endFlag',
      },
      {
        title: '成品入库单ID',
        dataIndex: 'stockinId',
      },
      {
        title: '生产状态',
        dataIndex: 'status',
      },
      {
        title: '检验单号',
        dataIndex: 'testformId',
      },
      {
        title: '合格数量',
        dataIndex: 'qulifiednum',
        sorter: (a, b) => a.qulifiednum - b.qulifiednum,
      },
      {
        title: '送验数量',
        dataIndex: 'testnum',
        sorter: (a, b) => a.testnum - b.testnum,
      },
      {
        title: '检验日期',
        dataIndex: 'testdate',
      },
      {
        title: '检验结果',
        dataIndex: 'checkresult',
      },
      {
        title: '入库日期',
        dataIndex: 'stockindate',
      },
      {
        title: '投产数量',
        dataIndex: 'productnum',
        sorter: (a, b) => a.productnum - b.productnum,
      },
      {
        title: '完工数量',
        dataIndex: 'finishnum',
        sorter: (a, b) => a.finishnum - b.finishnum,
      },
      {
        title: '待利用数量',
        dataIndex: 'unusednum',
        sorter: (a, b) => a.unusednum - b.unusednum,
      },
      {
        title: '报废数量',
        dataIndex: 'scrappednum',
        sorter: (a, b) => a.scrappednum - b.scrappednum,
      },
      {
        title: '完工日期',
        dataIndex: 'finishdate',
      },
      {
        title: '制单日期',
        dataIndex: 'makedate',
      },
      {
        title: '制单人',
        dataIndex: 'operatorId',
      },
      {
        title: '计划开始日期',
        dataIndex: 'planstarttime',
      },
      {
        title: '计划结束日期',
        dataIndex: 'planendtime',
      },
      {
        title: '生产方法',
        dataIndex: 'producemethod',
      },
      {
        title: '生产模式',
        dataIndex: 'producemode',
        render:(text)=>{
          if(text === 0){
            return "序列化"
          }
          if(text === 1){
            return "批次化"
          }
          if(text === 2){
            return "批次序列化"
          }
        }
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'key',
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e)=>this.update(e,record)}>编辑</a>
          </Fragment>
        ),
      },
    ]

    const columns2 = [
      {
        title: '工艺工序',
        dataIndex: 'processplanCode',
      },
      {
        title: '工艺过程卡',
        dataIndex: 'techprocesscardId',
      },
      {
        title: '工作中心',
        dataIndex: 'workcenterId',
      },
      {
        title: '班组长',
        dataIndex: 'teamLeaderName',
      },
      {
        title: '投产数量',
        dataIndex: 'productnum',
        sorter: (a, b) => a.productnum - b.productnum,
      },
      {
        title: '合格数量',
        dataIndex: 'qualifiednum',
        sorter: (a, b) => a.qualifiednum - b.qualifiednum,
      },
      {
        title: '不合格数量',
        dataIndex: 'unqualifiednum',
        sorter: (a, b) => a.unqualifiednum - b.unqualifiednum,
      },
      {
        title: '加工工时',
        dataIndex: 'manhour',
        sorter: (a, b) => a.manhour - b.manhour,
      },
      {
        title: '准备工时',
        dataIndex: 'preparehour',
        sorter: (a, b) => a.preparehour - b.preparehour,
      },
      {
        title: '实际工时',
        dataIndex: 'actualhour',
        sorter: (a, b) => a.actualhour - b.actualhour,
      },
      {
        title: '加工人',
        dataIndex: 'processpsnId',
      },
      {
        title: '加工日期',
        dataIndex: 'processdate',
      },
      {
        title: '检验人',
        dataIndex: 'checkpsnId',
      },
      {
        title: '检验日期',
        dataIndex: 'checkdate',
      },
      {
        title: '检验结果',
        dataIndex: 'checkresult',
      },
      {
        title: '检验单',
        dataIndex: 'checkbillId',
      },
      {
        title: '首检人',
        dataIndex: 'firstcheckpsnId',
      },
      {
        title: '完工标记',
        dataIndex: 'finishmark',
      },
      {
        title: '首检日期',
        dataIndex: 'firstcheckdate',
      },
      {
        title: '检验结果',
        dataIndex: 'firstcheckresult',
      },
      {
        title: '互检人',
        dataIndex: 'eachothercheckpsnId',
      },
      {
        title: '互检日期',
        dataIndex: 'eachothercheckdate',
      },
      {
        title: '检验数量',
        dataIndex: 'checknum',
        sorter: (a, b) => a.checknum - b.checknum,
      },
      {
        title: '报废数量',
        dataIndex: 'scrapnum',
        sorter: (a, b) => a.scrapnum - b.scrapnum,
      },
      {
        title: '工序状态',
        dataIndex: 'processstatus',
        render:(text,record)=>{
          switch(text){
            case 0:
              return '未下达';
              break;
            case 1:
              return '已下达班组';
              break;
            case 2:
              return '已派工';
              break;
            case 3:
              return '开始生产'
              break;
            case 4:
              return '结束生产';
              break;
            case 5:
              return '取消生产';
              break;
            case 6:
              return '暂停生产';
              break;
            case 7:
              return '取消暂停';
              break;
          }
        }
      },
      {
        title: '负责人',
        dataIndex: 'principalpsnId',
      },
      {
        title: '制单日期',
        dataIndex: 'billdate',
      },
      {
        title: '派工单',
        dataIndex: 'assignjobId',
      },
      {
        title: '计划开工时间',
        dataIndex: 'planstarttime',
      },
      {
        title: '计划完工时间',
        dataIndex: 'planendtime',
      },
      {
        title: '实际开工时间',
        dataIndex: 'actstarttime',
      },
      {
        title: '实际完工时间',
        dataIndex: 'actendtime',
      },
      {
        title: '上次实际开工时间',
        dataIndex: 'actstarttimerecently',
      },
      {
        title: '备注',
        dataIndex: 'memo',
      },
      {
        title:'',
        width:1,
        dataIndex:'caozuo'
      }
      /*{
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'key',
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChild(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e)=>this.updateChild(e,record)}>编辑</a>
          </Fragment>
        ),
      },*/
    ]

    const {  selectedMaterialRowKeys,selectedRowKeys,superData,superId,updateChildData,updateSuperData,selectedRows,childDataSource } = this.state;

    const rowSelection = {
      selectedRowKeys,
      getCheckboxProps: record => ({
        disabled: record.processstatus > 0, // Column configuration not to be checked
      }),
      onChange: this.onSelectChange,
    };

    //主表编辑
    const onSuper = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'workplan/updateSuper',
          payload:{
            ...obj
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('成功',1.5,()=>{
                this.setState({
                  updateSuperVisible:false,
                })
                clear();

                dispatch({
                  type:'workplan/fetchtable',
                  payload:{
                    pageSize:10000,
                  },
                  callback:(res)=>{
                    this.setState({superData:res})
                  }
                });
              })
            }else{
              clear(1)
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear()
        this.setState({
          updateSuperVisible:false,
        })
      }
    }
    const superDataSource = {
      record:updateSuperData,
      visible: this.state.updateSuperVisible,
    }
    //班组
    const onAssign = {
      onOk:(arr,clear)=>{
        let a = []
        selectedRows.map((item)=>{
            a.push({
              processplanId:item.id,
              teamId:arr[0].id,
              materialBaseId:item.materialBaseId
            })
          item.processstatus = 1
          item.type = 1;
        })

        dispatch({
          type:'workplan/addteamsource',
          payload:{
            reqDataList:a
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              this.setState({
                addTeamVisible:false
              })
              clear();
              //改子表状态
              dispatch({
                type:'workplan/setStatus',
                payload:{
                  reqDataList:selectedRows
                },
                callback:(res)=>{
                  if(res.errMsg === "成功"){
                    message.success('成功',1.5,()=>{
                      this.setState({
                        selectedRowKeys:[],
                        selectedRows:[],
                      })
                      let conditions = [
                        {
                        code:'PROCESSSTATUS',
                        exp:'<=',
                        value:1
                        },
                        {
                          code:'TECHPROCESSCARD_ID',
                          exp:'=',
                          value:superId,
                        }
                      ]
                      dispatch({
                        type:'workplan/fetchtable2',
                        payload:{
                          conditions,
                          pageIndex:0,
                          pageSize:10000,
                        },
                        callback:(res)=>{
                          if(res.length){
                            this.setState({childDataSource:res})
                          }else{
                            this.setState({childDataSource:[]})
                          }

                        }
                      });
                    })

                  }
                }
              })
             /* //改主表状态
              dispatch({
                type:'workplan/changeSuper',
                payload:{
                  reqDataList:selectedRows
                },
                callback:(res)=>{
                  if(res.errMsg === "成功"){
                    dispatch({
                      type:'workplan/fetchtable',
                      payload:{
                        pageSize:10000,
                      },
                      callback:(res)=>{
                        this.setState({superData:res})
                      }
                    });
                  /!*  message.success('成功',1.5,()=>{

                    })*!/
                  }
                }
              })*/
            }else{
              clear(1)
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({addTeamVisible:false})
      }
    }
    const AssignData = {
      visible:this.state.addTeamVisible
    }
    //子表编辑
    const onChild = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'workplan/updateSuper',
          payload:{
            ...obj,
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('成功',1.5,()=>{
                clear()
                this.setState({ updateChildVisible:false,})
                dispatch({
                  type:'workplan/fetchtable',
                  payload:{
                    pageSize:10000,
                    reqData:{
                      MATERIAL_BASE_ID:this.state.selectedMaterialRowKeys[0]
                    }
                  },
                  callback:(res)=>{
                    this.setState({childDataSource:res})
                  }
                });
              })
            }else{
              clear(1)
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateChildVisible:false,
        })
      }
    }
    const childData = {
      record:updateChildData,
      visible: this.state.updateChildVisible,
    }
    console.log('---superData',superData)
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            data={{list:superData}}
            loading={fetchTableLoading}
            columns={columns}
            scroll={{ y: 260}}
            classNameSaveColumns={"WorkPlan1"}
            pagination={false}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  this.setState({
                    superId:record.id,
                    rowId: record.id,
                  })
                  const { dispatch } = this.props;
                  //表体
                  if(record.id){
                    const conditions = [
                      {
                        code:'TECHPROCESSCARD_ID',
                        exp:'=',
                        value:record.id,
                      }
                    ]
                    dispatch({
                      type:'workplan/fetchtable2',
                      payload:{
                        conditions,
                        pageIndex:0,
                        pageSize:10000,
                      },
                      callback:(res)=>{
                        if(res.length){
                          this.setState({childDataSource:res})
                        }else{
                          this.setState({childDataSource:[]})
                        }

                      }
                    });
                  }
                },
                rowKey:record.id
              }
            }}
            rowClassName={this.setRowClassName}
          />
          <UpdateSuper on={onSuper} data={superDataSource}/>
        </Card>
        <Card bordered={false} style={{marginTop:'15px'}}>
          <div>
            <Button  type="primary" disabled={!this.state.assignTeam} onClick={this.addTeam}>
              下达到班组
            </Button>
            <Button style={{marginLeft:20}}  type="primary" >
              工序计划拆分
            </Button>
            <Button style={{marginLeft:20}}  type="primary" >
              工序计划合并
            </Button>
          </div>
          <AssignTeamModle on={onAssign} data={AssignData}/>
          <Tabs defaultActiveKey="1">
            <TabPane tab="工序计划" key="1">
              <NormalTable
                rowSelection={rowSelection}
                data={{list:childDataSource}}
                loading={fetchTable2Loading}
                scroll={{ y: 260}}
                classNameSaveColumns={"WorkPlan2"}
                columns={columns2}
                pagination={false}
              />
              <UpdateChildRoot on={onChild} data={childData}/>
            </TabPane>
            <TabPane tab="元器件装配表" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="自制件装配表" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WorkPlan;

