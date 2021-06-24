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
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ EMA, loading }) => ({
  EMA,
  loading: loading.models.EMA,
}))
@Form.create()
class AddSelfProduct extends PureComponent {
  state = {
    TableHitchData:[],//故障类型
    SelectHitchValue:[],
    selectedHitchRowKeys:[],
    HitchConditions:[],

    TreeOperationData:[],//人员
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    const {selectedHitchRowKeys,selectedOperationRowKeys } = this.state
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
     const obj ={
       deviceId:values.deviceId,
       application:values.application?values.application.format('YYYY-MM-DD'):null,
       faultTypeId:selectedHitchRowKeys.length?selectedHitchRowKeys[0]:null,
       personId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
       memo:values.memo,
       serviceId:values.serviceId,
     }
      onOk(obj)
    })
  }

  handleCancel  =(onCancle)=>{
    const { form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      TableHitchData:[],//故障类型
      SelectHitchValue:[],
      selectedHitchRowKeys:[],
      HitchConditions:[],

      TreeOperationData:[],//人员
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],

    })
    onCancle()
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data,
      dispatch,
    } = this.props;
    const { visible } = data
    const { onOk,onCancle } = on
    const onHitchData = {
      TableData:this.state.TableHitchData,
      SelectValue:this.state.SelectHitchValue,
      selectedRowKeys:this.state.selectedHitchRowKeys,
      columns : [
        {
          title: '故障类型编号',
          dataIndex: 'code',
        },
        {
          title: '故障类型名称',
          dataIndex: 'name',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'故障类型编号',code:'code',placeholder:'请输入故障类型编号'},
        {label:'故障类型名称',code:'name',placeholder:'请输入故障类型名称'},
      ],
      title:'故障类型',
      placeholder:'请选择故障类型名称',
    };
    const onHitchOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'EMA/fetchHitch',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            this.setState({
              TableHitchData:res,
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
        onChange(nameList)
        this.setState({
          SelectHitchValue:nameList,
          selectedHitchRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { HitchConditions } = this.state;
        const param = {
          ...obj
        };
        if(HitchConditions.length){
          dispatch({
            type:'EMA/fetchHitch',
            payload:{
              conditions:HitchConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableHitchData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'EMA/fetchHitch',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableHitchData:res,
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
            HitchConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'EMA/fetchHitch',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableHitchData:res,
              })
            }
          })
        }else{
          this.setState({
            HitchConditions:[]
          });
          dispatch({
            type:'EMA/fetchHitch',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableHitchData:res
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { pageWork } = this.state;
        this.setState({
          HitchConditions:[]
        });
        dispatch({
          type:'EMA/fetchHitch',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableHitchData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectHitchValue:[],
          selectedHitchRowKeys:[],
        })
      }
    };

    const ons = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'EMA/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreeOperationData:a
            })
          }
        });
        dispatch({
          type:'EMA/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableOperationData:res,
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
            type:'EMA/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableOperationData:res,
                operation_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'EMA/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableOperationData:res,
                operation_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { OperationConditions,operation_id } = this.state;
        const param = {
          id:operation_id,
          ...obj
        };
        if(OperationConditions.length){
          dispatch({
            type:'EMA/fetchTable',
            payload:{
              conditions:OperationConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableOperationData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'EMA/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableOperationData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectOperationValue:nameList,
          selectedOperationRowKeys:selectedRowKeys,
        })
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
            OperationConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'EMA/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableOperationData:res,
              })
            }
          })
        }else{
          this.setState({
            OperationConditions:[]
          })
          dispatch({
            type:'EMA/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableOperationData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          OperationConditions:[]
        })
        dispatch({
          type:'EMA/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableOperationData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      }
    };
    const datas = {
      TreeData:this.state.TreeOperationData, //树的数据
      TableData:this.state.TableOperationData, //表的数据
      SelectValue:this.state.SelectOperationValue, //框选中的集合
      selectedRowKeys:this.state.selectedOperationRowKeys, //右表选中的数据
      placeholder:'请选择人员',
      columns : [
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '部门',
          dataIndex: 'deptname',
          key: 'deptname',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'人员姓名',code:'name',placeholder:'请输入人员姓名'},
      ],
      title:'物料人员'
    }

    return (
        <Modal
          title="新建"
          destroyOnClose
          centered
          visible={visible}
          width='80%'
          onCancel={()=>this.handleCancel(onCancle)}
          onOk={()=>this.handleOk(onOk)}
        >
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='单据编号'>
                  {getFieldDecorator('billcode', {
                  })(<Input placeholder="单据编号自动生成" disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='申请时间'>
                  {getFieldDecorator('application', {
                  })( <DatePicker format="YYYY-MM-DD"
                                  style={{width:'100%'}}
                                  placeholder={'请选择时间'}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='所属设备'>
                  {getFieldDecorator('deviceId', {
                    rules: [
                      {
                        required: true,
                        message:'请输入所属设备'
                      }
                    ],
                  })(<Input placeholder="请输入所属设备" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='维修人员'>
                  {getFieldDecorator('serviceId', {
                    rules: [
                      {
                        required: true,
                        message:'请选择维修人员'
                      }
                    ],
                  })(<Input placeholder="维修人员" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='故障类型'>
                  {getFieldDecorator('faultTypeId', {
                    rules: [
                      {
                        required: true,
                        message:'请选择故障类型'
                      }
                    ],
                  })( <ModelTable
                    data={onHitchData}
                    on={onHitchOn}
                  />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="申请人">
                  {getFieldDecorator('personId',{
                    rules: [{
                      required: true,
                      message:'请选择申请人'
                    }],
                  })(<TreeTable
                    on={ons}
                    data={datas}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label='故障描述'>
                  {getFieldDecorator('memo', {
                  })(<TextArea  rows={3} placeholder="请输入故障描述" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default AddSelfProduct;
