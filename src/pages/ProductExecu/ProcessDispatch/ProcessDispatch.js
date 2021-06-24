import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';
import {
  Row,
  message,
  Col,
  Form,
  Button,
  Card,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import './bom.less'
import UserOrDevice from '@/pages/tool/UserOrDevice';
import { groupBy } from '@/pages/tool/Group';

const FormItem = Form.Item;

@connect(({ PDS, loading }) => ({
  PDS,
  loading: loading.models.PDS,
  listLoading:loading.effects['PDS/findprocess'],
  childLoading:loading.effects['PDS/findprocessChild'],
}))
@Form.create()
class ProcessDispatch extends PureComponent {
  state = {
    TreeMaterialData:[],
    MaterialConditions:[],
    material_id:null,
    TableMaterialData:[],
    SelectMaterialValue:[],
    selectedMaterialRowKeys:[],

    select:false,
    isRelease:false,
    release:false,


    selectedRowKeys:[],
    selectedRows:[],

    superDataList:[],

    page:{
      pageIndex:0,
      pageSize:10000
    },
    page2:{
      pageIndex:0,
      pageSize:10
    }
  };

  componentDidMount(){
    const { dispatch } = this.props
    let conditions = [{
      code:'PROCESSSTATUS',
      exp:'=',
      value:1
    }]
    dispatch({
      type:'PDS/findprocess',
      payload:{
        conditions:conditions,
        ...this.state.page,
      },
      callback:(res)=>{
        if(res && res.list){
          this.setState({
            superDataList:res.list,
          })
        }else{
          this.setState({
            superDataList:[],
          })
        }
      }
    });

    let conditions2 = [{
      code:'PROCESSSTATUS',
      exp:'=',
      value:2
    }]
    dispatch({
      type:'PDS/findprocessChild',
      payload:{
        conditions:conditions2,
        ...this.state.page,
      },
      callback:(res)=>{

      }
    });
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { selectedMaterialRowKeys } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page:obj
    })
    let conditions2 = [{
      code:'PROCESSSTATUS',
      exp:'=',
      value:1
    }]
    dispatch({
      type:'PDS/findprocess',
      payload:{
        conditions:conditions2,
        ...obj,
        reqData:{
          Mid:selectedMaterialRowKeys[0]
        }
      },
      callback:(res)=>{
        if(res && res.list){
          this.setState({
            superDataList:res.list,
          })
        }else{
          this.setState({
            superDataList:[],
          })
        }
      }
    });
  };

  handleStandardTableChangeChild = (pagination) => {
    const { dispatch } = this.props;
    const { selectedMaterialRowKeys } = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page2:obj
    })
    let conditions2 = [{
      code:'PROCESSSTATUS',
      exp:'=',
      value:2
    }]
    if(selectedMaterialRowKeys.length){
      dispatch({
        type:'PDS/findprocessChild',
        payload:{
          conditions:conditions2,
          obj,
          reqData:{
            Mid:selectedMaterialRowKeys[0]
          }
        },
        callback:(res)=>{

        }
      });
    }else{
      dispatch({
        type:'PDS/findprocessChild',
        payload:{
          conditions:conditions2,
          obj,
        },
        callback:(res)=>{

        }
      });
    }

  };

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page,selectedMaterialRowKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if(selectedMaterialRowKeys.length){
        let conditions = [{
          code:'PROCESSSTATUS',
          exp:'=',
          value:1
        }]
        dispatch({
          type:'PDS/findprocess',
          payload:{
            conditions:conditions,
            pageSize:10,
            pageIndex:0,
            reqData:{
              Mid:selectedMaterialRowKeys[0]
            }
          },
          callback:(res)=>{
            if(res && res.list){
              this.setState({
                superDataList:res.list,
              })
            }else{
              this.setState({
                superDataList:[],
              })
            }
          }
        });

        let conditions2 = [{
          code:'PROCESSSTATUS',
          exp:'=',
          value:2
        }]
        dispatch({
          type:'PDS/findprocessChild',
          payload:{
            conditions:conditions2,
            ...this.state.page,
            reqData:{
              Mid:selectedMaterialRowKeys[0]
            }
          },
          callback:(res)=>{

          }
        });

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
      superData:[],
      childDataSource:[],
      SelectMaterialValue:[],
      selectedMaterialRowKeys:[],
      superDataList:[],
    })
    //清空后获取列表
    let conditions = [{
      code:'PROCESSSTATUS',
      exp:'=',
      value:1
    }]
    dispatch({
      type:'PDS/findprocess',
      payload:{
        conditions:conditions,
        ...this.state.page,
      },
      callback:(res)=>{
        if(res && res.list){
          this.setState({
            superDataList:res.list,
          })
        }else{
          this.setState({
            superDataList:[],
          })
        }
      }
    });

    let conditions2 = [{
      code:'PROCESSSTATUS',
      exp:'=',
      value:2
    }]
    dispatch({
      type:'PDS/findprocessChild',
      payload:{
        conditions:conditions2,
        ...this.state.page,
      },
      callback:(res)=>{

      }
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;

    const on = {
      onIconClick: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'PDS/matype',
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
          type: 'PDS/fetchMata',
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
            type: 'PDS/fetchMata',
            payload: obj,
            callback: (res) => {
              this.setState({
                TableMaterialData: res,
              })
            }
          })
        } else {
          dispatch({
            type: 'PDS/fetchMata',
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
            type: 'PDS/fetchMata',
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
          type: 'PDS/fetchMata',
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
            type: 'PDS/findbomlist',
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
              type: 'PDS/fetchMata',
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
              type: 'PDS/fetchMata',
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
              type: 'PDS/fetchMata',
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
              type: 'PDS/fetchMata',
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
            type: 'PDS/fetchMata',
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
            type: 'PDS/fetchMata',
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
          width:1,
          dataIndex: 'caozuo',
        },
      ],
      fetchList:[
        {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
        {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
      ],
      title:'物料选择',
    }
    return (
      <Form  layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='物料编码'>
              {getFieldDecorator('code')(<TreeTable
                on={on}
                data={datas}
              />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>

          </Col>
           <Col md={8} sm={24}>
            <span>
              <Button type="primary" onClick={this.findList}>
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

  onDesignated = ()=>{
    this.setState({
      release:true
    })
  }

  onRelease = ()=>{
    this.setState({
      select:true
    })
  }

  onSelectChange = (selectedRowKeys,selectedRows) => {
/*    const { superDataList } = this.state

    let minArray = []
    superDataList.map((item)=>{
      minArray.push(Number(item.processplanCode))
    })
    let endMin = Math.min.apply(Math,minArray);
    let processplanCodeArray = []
    selectedRows.map((item)=>{
      processplanCodeArray.push(Number(item.processplanCode))
    })
    let min = Math.min.apply(Math,processplanCodeArray);*/
    this.setState({
      selectedRowKeys,selectedRows,
      isRelease:true,
    });

    /*if(min === endMin && selectedRowKeys.length){
      this.setState({
        isRelease:true,
      })
    }else{
      this.setState({
        isRelease:false,
        release:false,
      })
    }*/
  };

  render() {
    const {
      loading,
      PDS:{dataChild},
      listLoading,
      childLoading
    } = this.props;

    const columns = [
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
          if(text === 1){
            return '已下达班组'
          }
          if(text === 2){
            return '已派工'
          }
          return '未下达班组'
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
        title: '操作',
        dataIndex: 'caozuo',
        /*  fixed:'right',
          render: (text, record) => (
            <Fragment>
              <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChild(record)}>
                <a href="#javascript:;">删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href="#javascript:;" onClick={(e)=>this.updateChild(e,record)}>编辑</a>
            </Fragment>
          ),*/
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
          if(text === 1){
            return '已下达班组'
          }
          if(text === 2){
            return '已派工'
          }
          return '未下达班组'
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
        title: '操作',
        dataIndex: 'caozuo',
        /*  fixed:'right',
          render: (text, record) => (
            <Fragment>
              <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChild(record)}>
                <a href="#javascript:;">删除</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href="#javascript:;" onClick={(e)=>this.updateChild(e,record)}>编辑</a>
            </Fragment>
          ),*/
      },
    ]

    const { superDataList,selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const dataUser = {
      visible:this.state.select,
      title:"请选择下达人员或设备"
    };

    const onUser = {
      onOk:(arr,qinChu)=>{
        if(!arr.length){
          return message.error("请选择后再确认",1.5,()=>{
            qinChu()
          })
        }
        let { selectedRows } = this.state;
        const { dispatch } = this.props;

        const sorted = groupBy (selectedRows, function (item) {
          return [item.techprocesscardId];//按照name进行分组
        });

        sorted.map(item =>{
          item.sort((a,b)=>{
            return Number(a.processplanCode) - Number(b.processplanCode)
          })
        });

        /*sorted.map(item=>{
          item.map((ite,index)=>{
            if(index === 0){
              ite.stepStatus = 1
            }else{
              ite.stepStatus = 0
            }
          })
        })*/

        let req = [];
        arr.map(item =>{
          selectedRows.map(it =>{
            it.processstatus = 2;
            it.portionStatus = 1;
            req.push({
              processplanId:it.id,
              psndocId:item.id,
              materialBaseId:it.materialBaseId,
              techprocesscardId:it.techprocesscardId,
              status: it.stepStatus,
            })
          })
        });

        dispatch({
          type:'PDS/Processperson',
          payload:{
            reqDataList:req
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("下达成功",1.3,()=>{
                dispatch({
                  type:'PDS/setStatus',
                  payload:{
                    reqDataList:selectedRows
                  },
                  callback:(res)=>{
                    if(res.errMsg === "成功"){
                      qinChu();
                      this.setState({
                        select:false,
                        release:false,
                        isRelease:false,
                        selectedRowKeys:[],
                        selectedRows:[],
                      })

                      const { selectedMaterialRowKeys } = this.state;
                      let conditions = [{
                        code:'PROCESSSTATUS',
                        exp:'=',
                        value:1
                      }]
                      dispatch({
                        type:'PDS/findprocess',
                        payload:{
                          conditions:conditions,
                          ...this.state.page,
                        },
                        callback:(res)=>{
                          if(res && res.list){
                            this.setState({
                              superDataList:res.list,
                            })
                          }else{
                            this.setState({
                              superDataList:[],
                            })
                          }

                        }
                      });

                      let conditions2 = [{
                        code:'PROCESSSTATUS',
                        exp:'=',
                        value:2
                      }]
                      dispatch({
                        type:'PDS/findprocessChild',
                        payload:{
                          conditions:conditions2,
                          ...this.state.page,
                        },
                        callback:(res)=>{

                        }
                      });

                    }else{
                      qinChu(1);
                    }
                  }
                })
              })
            }else{
              qinChu(1);
            }
          }
        })
      },
      onCancel:(qinChu)=>{
        qinChu();
        this.setState({
          select:false
        })
      }
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            //loading={listLoading}
            dataSource={superDataList}
            columns={columns}
            pagination={false}
            scroll={{ y: 260}}
            classNameSaveColumns={"ProcessDispatch1"}
            // onChange={this.handleStandardTableChange}
            rowSelection={rowSelection}
            title={() => <div>
              <Button disabled={!this.state.release} onClick={this.onRelease} type="primary" >
                下达
              </Button>
              <Button  disabled={!this.state.isRelease} onClick={this.onDesignated} type="primary" style={{marginLeft:'20px'}}  >
                指定加工人或设备
              </Button>
            </div>}
          />
          <UserOrDevice data={dataUser} on={onUser}/>
        </Card>
        <Card bordered={false} title={"已派工"} style={{marginTop:'15px'}}>
          <NormalTable
            data={dataChild}
            //loading={childLoading}
            scroll={{ y: 260}}
            columns={columns2}
            onChange={this.handleStandardTableChangeChild}
            classNameSaveColumns={"ProcessDispatch2"}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProcessDispatch;
