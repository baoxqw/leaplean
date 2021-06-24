import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
import Distribute from '@/pages/MatterManage/PieFeed/Distribute';


const FormItem = Form.Item;

@connect(({ MManage, loading }) => ({
  MManage,
  superLoading:loading.effects['MManage/fetchdispatch'],
  childLoading:loading.effects['MManage/fetchdispatchchild'],
}))
@Form.create()
class PieFeed extends PureComponent {
  state = {
    addChildVisible:false,
    updateVisible:false,
    updateChildVisible:false,
    updateSource:[],
    updateChildSource:{},
    page:{
      pageSize:1000000,
      pageIndex:0
    },
    conditions:[],
    selectedRowKeys:[],
    selectedRows:[],
    dataList:{},
    superId:null,
    rowId:null,
    record:{},

    addVisible:false,
    childDataSource:[],
    isRecive:true,

  }

  componentDidMount(){
    const { dispatch } = this.props;
    dispatch({
      type:'MManage/fetchdispatch',
      payload:{
        ...this.state.page
      },
      callback:(res)=>{
        this.setState({
          dataList:res
        })
      }
    })
  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code, time } = values;
      if(code || time){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};

        if(code){
          codeObj = {
            code:'code',
            exp:'=',
            value:code
          };
          conditions.push(codeObj)
        }
        if(time){
          nameObj = {
            code:'DOCUMENT_DATE',
            exp:'like',
            value:time.format('YYYY-MM-DD')
          };
          conditions.push(nameObj)
        }
        this.setState({
          conditions
        })
        const obj = {
          ...this.state.page,
          conditions,
        };
        dispatch({
          type:'MManage/fetchdispatch',
          payload:obj,
          callback:(res)=>{
            this.setState({
              dataList:res
            })
          }
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'MManage/fetchdispatch',
          payload:{
            ...this.state.page,
          },
          callback:(res)=>{
            this.setState({
              dataList:res
            })
          }
        })
      }
    })
  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[],
      dataList:{},
      record:{},
      superId:null,
    })
    //清空后获取列表
    dispatch({
      type:'MManage/fetchdispatch',
      payload:{
        ...this.state.page,
      },
      callback:(res)=>{
        this.setState({
          dataList:res
        })
      }
    })
  };

  //收料
  goodsReceive = ()=>{
    const { dispatch } = this.props
    const { record,conditions } = this.state
    let obj = {
      reqData:{
        ...record,
        status:'已收料',
      }
    }
    dispatch({
      type:'MManage/adddispatch',
      payload:obj,
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("收料成功",1,()=>{
           /* this.setState({
              conditions:[],
              dataList:{},
              record:{},
              superId:null,
            })*/
           this.setState({
             isRecive:true
           })
            const obj = {
              pageIndex:0,
              pageSize:10000,
              conditions,
            };
            dispatch({
              type:'MManage/fetchdispatch',
              payload:obj,
              callback:(res)=>{
                this.setState({
                  dataList:res
                })
              }
            })
          })
        }
      }
    })
  }

  //分料
  sprcFoods = ()=>{

  }

  //派发到工位
  dispatchStation = ()=>{
    this.setState({
      addVisible:true
    })
  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  handleStandardTableChangeChild = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { rowId } = this.state;

    const conditions = [
      {
        code:'DISTRIBUTION_ID',
        exp:'=',
        value:rowId,
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

  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({
      selectedRowKeys,selectedRows,
    });
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
            <Form.Item label="物料出库单">
              {getFieldDecorator('code',{
              })(
                <Input placeholder={'物料出库单'}/>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='单据时间'>
              {getFieldDecorator('time')(
                <DatePicker  style={{width:'100%'}}/>
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
      superLoading,
      childLoading,
      dispatch
    } = this.props;
    const { dataList,childDataSource,rowId,selectedRowKeys,selectedRows,addVisible, superId,record,isRecive } = this.state
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
        title: '',
        width:1,
        dataIndex: 'caozuo',
      }
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
        title: '',
        width:1,
        dataIndex: 'caozuo',
      }
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const OnAddSelf = {
      onSave:(arr,clear)=>{

        let sup = []

        arr.map(item =>{
          sup.push({
            distributionBId:item.id,
            stationId:item.stationId2,
            amount:Number(item.amounta),
            tag:item.tag,
            memo:item.memoa
          })
        })

        selectedRows.map((item)=>{
           arr.map(it =>{
             if(it.id === item.id){
               item.amount = it.amount - Number(it.amounta);
             }
           })
        });

        dispatch({
          type:"MManage/pailiaopiliang",
          payload:{
            reqDataList:sup
          },
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success("已完成",1,()=>{
                this.setState({
                  addVisible:false,
                  selectedRowKeys:[],
                  selectedRows:[],
                })
                clear()
                dispatch({
                  type:'MManage/adddispatchchildbatchadd',
                  payload:{
                    reqDataList:selectedRows
                  },
                  callback:(res2)=>{
                    const { superId } = this.state;
                    const conditions = [
                      {
                        code:'DISTRIBUTION_ID',
                        exp:'=',
                        value:superId
                      }
                    ]
                    dispatch({
                      type:'MManage/fetchdispatchchild',
                      payload:{
                        conditions,
                        pageIndex:0,
                        pageSize:1000000,
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
            loading={superLoading}
            data={dataList}
            columns={columns}
            pagination={false}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  this.setState({
                    rowId: record.id,
                    superId:record.id,
                    record,
                    selectedRowKeys:[],
                    selectedRows:[],
                  })
                  if(record.status === '初始状态'){
                    this.setState({
                      isRecive:false
                    })
                  }else{
                    this.setState({
                      isRecive:true
                    })
                  }
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
                },
                rowKey:record.id
              }
            }}
            classNameSaveColumns={"PieFeed1"}
            rowClassName={this.setRowClassName}
            title={() => <div>
              <Button onClick={this.goodsReceive} type="primary" disabled={isRecive}>
                收料
              </Button>
              <Button  onClick={this.sprcFoods} type="primary" disabled style={{marginLeft:'20px'}}>
                分料
              </Button>
            </div>}
          />
        </Card>
        <Card bordered={false} style={{marginTop:15}}>
          <div style={{marginTop:'-18px'}}>
            <NormalTable
              loading={childLoading}
              data={childDataSource}
              columns={columns2}
              rowSelection={record.status === 1 ?rowSelection:false}
              classNameSaveColumns={"PieFeed2"}
              onChange={this.handleStandardTableChangeChild}
              title={() =>            <Button onClick={this.dispatchStation} type="primary" disabled={!(record.status && selectedRowKeys.length)}>
                派发到工位
              </Button>
              }
            />
          </div>
          <Distribute on={OnAddSelf} datas={OnSelfData} data={selectedRows} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default PieFeed;
