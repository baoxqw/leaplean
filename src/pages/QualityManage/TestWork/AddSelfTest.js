import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Modal,
  Checkbox,
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
import styles from '../../System/UserAdmin.less';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ overtask, loading }) => ({
  overtask,
  loading: loading.models.overtask,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class AddSelfOver extends PureComponent {
  state = {
    TableProductData:[],//工序名称
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],
  };

  componentDidMount(){
    const { dispatch } = this.props;
    const { page } = this.state;
  }

  handleOk = (onOk) =>{
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
     const obj = {
       ...values,
       requestDate:values.requestDate?values.requestDate.format('YYYY-MM-DD'):''
     }
      onOk(obj)
    })
  }
  handleCancel  =(onCancel)=>{
    const { form } = this.props;
    //清空输入框
    form.resetFields();
    onCancel()
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch,
      on,
      data
    } = this.props;
    const { visible } = data
    const { onOk,onCancel } = on

    const onProductData = {
      TableData:this.state.TableProductData,
      SelectValue:this.state.SelectProductValue,
      selectedRowKeys:this.state.selectedProductRowKeys,
      columns : [
        {
          title: '工序编号',
          dataIndex: 'code',
        },
        {
          title: '工序名称',
          dataIndex: 'name',
        },
        {
          title: '工作站数量',
          dataIndex: 'quantityofworkstations',
        },
        {
          title:'首检类型',
          dataIndex: 'checktype',
        },
        {
          title:'是否检验点',
          dataIndex: 'checkFlag',
          render:(text,record)=>{
            return <Checkbox checked={text}/>
          }
        },
        {
          title:'是否交接点',
          dataIndex: 'handoverFlag',
          render:(text,record)=>{
            return <Checkbox checked={text}/>
          }
        },
        {
          title:'是否计数点',
          dataIndex: 'countFlag',
          render:(text,record)=>{
            return <Checkbox checked={text}/>
          }
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'工序编号',code:'code',placeholder:'请输入工序编号'},
        {label:'工序名称',code:'name',placeholder:'请输入工序名称'},
      ],
      title:'工序类型',
      placeholder:'请选择工序名称',
    };
    const onProductOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'testwork/fetchProduct',
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
            type:'testwork/fetchProduct',
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
          type:'testwork/fetchProduct',
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
            type:'testwork/fetchProduct',
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
            type:'testwork/fetchProduct',
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
          type:'testwork/fetchProduct',
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
          title="试验任务新建"
          destroyOnClose
          centered
          visible={visible}
          width={"80%"}
          onCancel={()=>this.handleCancel(onCancel)}
          onOk={()=>this.handleOk(onOk)}
        >
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='单据编码'>
                  {getFieldDecorator('billcode',{
                  })(<Input placeholder='系统自动生成' disabled/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='生产订单号'>
                  {getFieldDecorator('production',{
                  })(<Input placeholder='请输入生产订单号'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='加工序号'>
                  {getFieldDecorator('processing',{
                  })(<Input placeholder='请输入加工序号'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
               {/* <FormItem label='工序名称'>
                  {getFieldDecorator('processName',{
                  })(
                    <ModelTable
                    data={onProductData}
                    on={onProductOn}
                  />
                  )}
                </FormItem>*/}
                <FormItem label='工序名称'>
                  {getFieldDecorator('processName',{
                  })(
                    <Input placeholder='请输入工序名称'/>
                  )}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='产品编码'>
                  {getFieldDecorator('productId',{
                  })(<Input placeholder='请输入产品编码'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工作令'>
                  {getFieldDecorator('workId',{
                  })(<Input placeholder='请输入工作令'/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <FormItem label='备注'>
                  {getFieldDecorator('memo',{
                  })(<TextArea rows={3} placeholder='请输入备注'/>)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
    );
  }
}

export default AddSelfOver;
