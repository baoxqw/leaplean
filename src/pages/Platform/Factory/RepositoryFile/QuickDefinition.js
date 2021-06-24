import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  Form,
  Input,
  message
} from 'antd';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';

@connect(({ areaadmin,RFile, loading }) => ({
  areaadmin,
  RFile,
  loading: loading.models.areaadmin,
}))
@Form.create()
class QuickDefinition extends PureComponent {
  state = {
    BStatus:false,
    TableProductData:[],//仓库
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus,selectedProductRowKeys } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const { name1,name11,name2,name22,name3,name33,name4,name44 } = values;
      if(name3 || name33 || name4 || name44){
        if(!name2 || !name22){
          this.setState({
            BStatus:false
          })
          return message.error("请输入完整第二维度")
        }
        if(!name3 || !name33){
          this.setState({
            BStatus:false
          })
          return message.error("请输入完整第三维度")
        }
      }
      const obj = {
        name1,
        name11:name11?Number(name11):null,
        name2,
        name22:name22?Number(name22):null,
        name3,
        name33:name33?Number(name33):null,
        name4,
        name44:name44?Number(name44):null,
        warehouseId:selectedProductRowKeys.length?selectedProductRowKeys[0]:null
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
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      BStatus:false,
      TableProductData:[],//仓库
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],
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
          type:'RFile/fetchstore',
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
            type:'RFile/fetchstore',
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
          type:'RFile/fetchstore',
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
            type:'RFile/fetchstore',
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
            type:'RFile/fetchstore',
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
          type:'RFile/fetchstore',
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
      <Modal
        title={"快速定义"}
        visible={visible}
        width='40%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row style={{display:'flex',justifyContent:'center'}}>
          <Col style={{width:'50%'}}>
            <Form.Item label="仓库">
              {getFieldDecorator('warehouseName', {
                rules: [{
                  required: true,
                  message:'请输选择仓库'
                }]
              })(<ModelTable
                data={onProductData}
                on={onProductOn}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{display:'flex',justifyContent:'space-around'}}>
          <Col>
            <Form.Item label="第一维名称">
              {getFieldDecorator('name1',{
                rules: [{
                  required: true,
                  message:'第一维名称不能为空'
                }]
              })(<Input placeholder="请输入第一维名称" />)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="第一维数量">
              {getFieldDecorator('name11',{
                rules: [{
                  required: true,
                  message:'第一维数量不能为空'
                }]
              })(<Input placeholder="请输入第一维数量" type={'Number'} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{display:'flex',justifyContent:'space-around'}}>
          <Col>
            <Form.Item label="第二维名称">
              {getFieldDecorator('name2',{
              })(<Input placeholder="请输入第二维名称"  />)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="第二维数量">
              {getFieldDecorator('name22',{
              })(<Input placeholder="请输入第二维数量" type={'Number'} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{display:'flex',justifyContent:'space-around'}}>
          <Col>
            <Form.Item label="第三维名称">
              {getFieldDecorator('name3',{
              })(<Input placeholder="请输入第三维名称" />)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="第三维数量">
              {getFieldDecorator('name33',{
              })(<Input placeholder="请输入第三维数量" type={'Number'} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row style={{display:'flex',justifyContent:'space-around'}}>
          <Col>
            <Form.Item label="第四维名称">
              {getFieldDecorator('name4',{
              })(<Input placeholder="请输入第四维名称"/>)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="第四维数量">
              {getFieldDecorator('name44',{
              })(<Input placeholder="请输入第四维数量" type={'Number'} />)}
            </Form.Item>
          </Col>
        </Row>

      </Modal>
    );
  }
}

export default QuickDefinition;

