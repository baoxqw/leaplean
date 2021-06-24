import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  message,
  TreeSelect,
  Form,
  Input,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage
}))
@Form.create()
class AddStation extends PureComponent {
  state = {
    BStatus:false,
    TableAreaData:[],
    SelectAreaValue:[],
    selectedAreaRowKeys:[],
    AreaConditions:[],
    stateionName:'请选择派料单号',
  };


  onSave = (onSave)=>{
    const { form,selectedRows } = this.props;
    const { BStatus,selectedAreaRowKeys} = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      let as = false;
      let index = 0;
      for(let i = 0; i<selectedRows.length;i++){
        let count = selectedRows[i].amount - Number(values.amount)
        if(count < 0){
          as = true;
          index = i;
          break
        }
      }

      if(as){
        return message.error(`第${index+1}条的数量不能小于0`)
      }

      const obj = {
          tag:values.tag,
          amount:values.amount?Number(values.amount):null,
          stationId:selectedAreaRowKeys.length?selectedAreaRowKeys[0]:null,
          memo:values.memo
      };
      this.setState({
        BStatus:true
      })
      if(typeof onSave === 'function'){
        onSave(obj,this.clear);
      }
    })
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

  clear = (status)=> {
    const { form } = this.props;
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    form.resetFields();
    this.setState({
      BStatus:false,
      TableAreaData:[],
      SelectAreaValue:[],
      selectedAreaRowKeys:[],
      AreaConditions:[],

      selectedRowKeys:[]
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;
    const { stateionName } = this.state
    const onAreaData = {
      TableData:this.state.TableAreaData,
      SelectValue:this.state.SelectAreaValue,
      selectedRowKeys:this.state.selectedAreaRowKeys,
      columns : [
        {
          title: '工位编号',
          dataIndex: 'code',
        },
        {
          title: '工位名称',
          dataIndex: 'name',
        },
        {
          title: '区域',
          dataIndex: 'productionregionName',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'工位编号',code:'code',placeholder:'请输入工位编号'},
        {label:'工位名称',code:'name',placeholder:'请输入工位名称'},
      ],
      title:'工位',
      placeholder:'请选择工位',
    };
    const onAreaOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'MManage/fetchStation',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            this.setState({
              TableAreaData:res,
            })
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        let stateionName = ''

        const nameList = selectedRows.map(item =>{
          stateionName = item.name
          return item.code
        });
        onChange(nameList)
        this.setState({
          SelectAreaValue:nameList,
          selectedAreaRowKeys:selectedRowKeys,
          stateionName,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { WorkConditions } = this.state;
        const param = {
          ...obj
        };
        if(WorkConditions.length){
          dispatch({
            type:'MManage/fetchStation',
            payload:{
              conditions:WorkConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableAreaData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'MManage/fetchStation',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableAreaData:res,
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
            AreaConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'MManage/fetchStation',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableAreaData:res,
              })
            }
          })
        }else{
          this.setState({
            AreaConditions:[]
          });
          dispatch({
            type:'MManage/fetchStation',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableAreaData:res
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { pageWork } = this.state;
        this.setState({
          AreaConditions:[]
        });
        dispatch({
          type:'MManage/fetchStation',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableAreaData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectAreaValue:[],
          selectedAreaRowKeys:[],
        })
      }
    };

    return (
      <Modal
        title={"派料单"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="派料单号">
              {getFieldDecorator('code',{

              })( <Input placeholder="系统自动生成" disabled/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="工位">
              {getFieldDecorator('stationId',{
                rules: [{
                  required: true,
                  message:'请选择工位'
                }]
              })(
                <ModelTable
                on={onAreaOn}
                data={onAreaData}
                />
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="数量">
              {getFieldDecorator('amount',{
                rules: [{
                  required: true,
                  message:'请输入数量'
                }]
              })(
                <Input placeholder="请输入数量" type={'number'}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="位号">
              {getFieldDecorator('tag',{
              })(
                <Input placeholder="请输入位号"/>
              )}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>

          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default AddStation;

