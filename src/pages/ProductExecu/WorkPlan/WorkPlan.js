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

  //??????
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

  //??????
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    const { page } = this.state;
    //???????????????
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
    //?????????????????????
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
      }, //input????????????????????????????????????
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
      }, //??????????????????
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
      }, //??????
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
      }, //????????????????????????
      onCancel:()=>{

      },  //???????????????
      handleSearch:(values)=>{
        //???????????????????????? ??????????????????  ?????????????????????
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
      }, //???????????????
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
      }, //???????????????
      onButtonEmpty:()=>{
        const { form} = this.props;
        //???????????????
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
      TreeData:this.state.TreeMaterialData, //????????????
      TableData:this.state.TableMaterialData, //????????????
      SelectValue:this.state.SelectMaterialValue, //??????????????????
      selectedRowKeys:this.state.selectedMaterialRowKeys, //?????????????????????
      placeholder:'???????????????',
      columns : [
        {
          title: '????????????',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '??????',
          dataIndex: 'spec',
          key: 'spec',
        },
        {
          title: '??????',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '????????????',
          dataIndex: 'ucumName',
          key: 'ucumName',
        },
        {
          title: '????????????',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
        },
        {
          title: '???????????????',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
        },
        {
          title: '???????????????',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
        },
        {
          title: '??????',
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
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
        {label:'????????????',code:'name',placeholder:'?????????????????????'},
      ],
      title:'????????????'
    }

    return (
      <Form  layout="inline" onSubmit={(e)=>this.findList(e)}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='????????????'>
              {getFieldDecorator('code',{
              })(
                <TreeTable
                  on={on}
                  data={datas}
                />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/*<FormItem label='??????????????????'>
              {getFieldDecorator('name')(<Input placeholder='???????????????????????????' />)}
            </FormItem>*/}
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               ??????
              </Button>
            </span>
          </Col>
        </Row>
        <div style={{margin:'20px'}}></div>
        {/* <div style={{marginBottom:'20px'}}>
          <Button icon="plus" disabled={!this.state.selectedMaterialRowKeys[0]}  onClick={this.handleAdd} type="primary" >
            ??????
          </Button>
          <Button icon="plus" disabled={!this.state.superId} onClick={this.handleCorpAdd} type="primary" style={{marginLeft:'12px'}}>
            ???????????????
          </Button>
          <Button icon="plus" disabled={!this.state.childId} onClick={this.uploadAdd} type="primary" style={{marginLeft:'12px'}}>
            ????????????
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
          message.success('????????????',1.5,()=>{
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
          message.success('????????????',1.5,()=>{
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
        title: '????????????',
        dataIndex: 'productorderCode',
      },
      {
        title: '????????????',
        dataIndex: 'prodserial',
      },
      {
        title: '????????????',
        dataIndex: 'materialBaseName',
      },
       {
        title: '????????????',
        dataIndex: 'materialBaseCode',
      },
      {
        title: '??????',
        dataIndex: 'cardnum',
      },
      {
        title: '????????????????????????',
        dataIndex: 'gylxFlag',
      },
      {
        title: '???????????????????????????',
        dataIndex: 'dzFlag',
      },
      {
        title: '???????????????????????????',
        dataIndex: 'zpFlag',
      },
      {
        title: '????????????',
        dataIndex: 'endFlag',
      },
      {
        title: '???????????????ID',
        dataIndex: 'stockinId',
      },
      {
        title: '????????????',
        dataIndex: 'status',
      },
      {
        title: '????????????',
        dataIndex: 'testformId',
      },
      {
        title: '????????????',
        dataIndex: 'qulifiednum',
        sorter: (a, b) => a.qulifiednum - b.qulifiednum,
      },
      {
        title: '????????????',
        dataIndex: 'testnum',
        sorter: (a, b) => a.testnum - b.testnum,
      },
      {
        title: '????????????',
        dataIndex: 'testdate',
      },
      {
        title: '????????????',
        dataIndex: 'checkresult',
      },
      {
        title: '????????????',
        dataIndex: 'stockindate',
      },
      {
        title: '????????????',
        dataIndex: 'productnum',
        sorter: (a, b) => a.productnum - b.productnum,
      },
      {
        title: '????????????',
        dataIndex: 'finishnum',
        sorter: (a, b) => a.finishnum - b.finishnum,
      },
      {
        title: '???????????????',
        dataIndex: 'unusednum',
        sorter: (a, b) => a.unusednum - b.unusednum,
      },
      {
        title: '????????????',
        dataIndex: 'scrappednum',
        sorter: (a, b) => a.scrappednum - b.scrappednum,
      },
      {
        title: '????????????',
        dataIndex: 'finishdate',
      },
      {
        title: '????????????',
        dataIndex: 'makedate',
      },
      {
        title: '?????????',
        dataIndex: 'operatorId',
      },
      {
        title: '??????????????????',
        dataIndex: 'planstarttime',
      },
      {
        title: '??????????????????',
        dataIndex: 'planendtime',
      },
      {
        title: '????????????',
        dataIndex: 'producemethod',
      },
      {
        title: '????????????',
        dataIndex: 'producemode',
        render:(text)=>{
          if(text === 0){
            return "?????????"
          }
          if(text === 1){
            return "?????????"
          }
          if(text === 2){
            return "???????????????"
          }
        }
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'key',
        fixed:'right',
        render: (text, record) => (
          <Fragment>
            <Popconfirm title="????????????????" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e)=>this.update(e,record)}>??????</a>
          </Fragment>
        ),
      },
    ]

    const columns2 = [
      {
        title: '????????????',
        dataIndex: 'processplanCode',
      },
      {
        title: '???????????????',
        dataIndex: 'techprocesscardId',
      },
      {
        title: '????????????',
        dataIndex: 'workcenterId',
      },
      {
        title: '?????????',
        dataIndex: 'teamLeaderName',
      },
      {
        title: '????????????',
        dataIndex: 'productnum',
        sorter: (a, b) => a.productnum - b.productnum,
      },
      {
        title: '????????????',
        dataIndex: 'qualifiednum',
        sorter: (a, b) => a.qualifiednum - b.qualifiednum,
      },
      {
        title: '???????????????',
        dataIndex: 'unqualifiednum',
        sorter: (a, b) => a.unqualifiednum - b.unqualifiednum,
      },
      {
        title: '????????????',
        dataIndex: 'manhour',
        sorter: (a, b) => a.manhour - b.manhour,
      },
      {
        title: '????????????',
        dataIndex: 'preparehour',
        sorter: (a, b) => a.preparehour - b.preparehour,
      },
      {
        title: '????????????',
        dataIndex: 'actualhour',
        sorter: (a, b) => a.actualhour - b.actualhour,
      },
      {
        title: '?????????',
        dataIndex: 'processpsnId',
      },
      {
        title: '????????????',
        dataIndex: 'processdate',
      },
      {
        title: '?????????',
        dataIndex: 'checkpsnId',
      },
      {
        title: '????????????',
        dataIndex: 'checkdate',
      },
      {
        title: '????????????',
        dataIndex: 'checkresult',
      },
      {
        title: '?????????',
        dataIndex: 'checkbillId',
      },
      {
        title: '?????????',
        dataIndex: 'firstcheckpsnId',
      },
      {
        title: '????????????',
        dataIndex: 'finishmark',
      },
      {
        title: '????????????',
        dataIndex: 'firstcheckdate',
      },
      {
        title: '????????????',
        dataIndex: 'firstcheckresult',
      },
      {
        title: '?????????',
        dataIndex: 'eachothercheckpsnId',
      },
      {
        title: '????????????',
        dataIndex: 'eachothercheckdate',
      },
      {
        title: '????????????',
        dataIndex: 'checknum',
        sorter: (a, b) => a.checknum - b.checknum,
      },
      {
        title: '????????????',
        dataIndex: 'scrapnum',
        sorter: (a, b) => a.scrapnum - b.scrapnum,
      },
      {
        title: '????????????',
        dataIndex: 'processstatus',
        render:(text,record)=>{
          switch(text){
            case 0:
              return '?????????';
              break;
            case 1:
              return '???????????????';
              break;
            case 2:
              return '?????????';
              break;
            case 3:
              return '????????????'
              break;
            case 4:
              return '????????????';
              break;
            case 5:
              return '????????????';
              break;
            case 6:
              return '????????????';
              break;
            case 7:
              return '????????????';
              break;
          }
        }
      },
      {
        title: '?????????',
        dataIndex: 'principalpsnId',
      },
      {
        title: '????????????',
        dataIndex: 'billdate',
      },
      {
        title: '?????????',
        dataIndex: 'assignjobId',
      },
      {
        title: '??????????????????',
        dataIndex: 'planstarttime',
      },
      {
        title: '??????????????????',
        dataIndex: 'planendtime',
      },
      {
        title: '??????????????????',
        dataIndex: 'actstarttime',
      },
      {
        title: '??????????????????',
        dataIndex: 'actendtime',
      },
      {
        title: '????????????????????????',
        dataIndex: 'actstarttimerecently',
      },
      {
        title: '??????',
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
            <Popconfirm title="????????????????" onConfirm={() => this.handleDeleteChild(record)}>
              <a href="#javascript:;">??????</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e)=>this.updateChild(e,record)}>??????</a>
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

    //????????????
    const onSuper = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'workplan/updateSuper',
          payload:{
            ...obj
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('??????',1.5,()=>{
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
    //??????
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
              //???????????????
              dispatch({
                type:'workplan/setStatus',
                payload:{
                  reqDataList:selectedRows
                },
                callback:(res)=>{
                  if(res.errMsg === "??????"){
                    message.success('??????',1.5,()=>{
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
             /* //???????????????
              dispatch({
                type:'workplan/changeSuper',
                payload:{
                  reqDataList:selectedRows
                },
                callback:(res)=>{
                  if(res.errMsg === "??????"){
                    dispatch({
                      type:'workplan/fetchtable',
                      payload:{
                        pageSize:10000,
                      },
                      callback:(res)=>{
                        this.setState({superData:res})
                      }
                    });
                  /!*  message.success('??????',1.5,()=>{

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
    //????????????
    const onChild = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'workplan/updateSuper',
          payload:{
            ...obj,
          },
          callback:(res)=>{
            if(res.errCode === '0'){
              message.success('??????',1.5,()=>{
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
                  //??????
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
              ???????????????
            </Button>
            <Button style={{marginLeft:20}}  type="primary" >
              ??????????????????
            </Button>
            <Button style={{marginLeft:20}}  type="primary" >
              ??????????????????
            </Button>
          </div>
          <AssignTeamModle on={onAssign} data={AssignData}/>
          <Tabs defaultActiveKey="1">
            <TabPane tab="????????????" key="1">
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
            <TabPane tab="??????????????????" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="??????????????????" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WorkPlan;

