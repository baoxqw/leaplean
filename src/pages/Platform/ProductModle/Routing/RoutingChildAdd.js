import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Modal,
  Checkbox,
  message,
} from 'antd';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';



const { TextArea } = Input;
const { Option } = Select;

@connect(({ rout, loading }) => ({
  rout,
  loading: loading.models.rout,
}))
@Form.create()
class RoutingChildAdd extends PureComponent {
  state = {
    TableRegionData:[],
    SelectRegionValue:[],
    selectedRegionRowKeys:[],
    RegionConditions:[],
    pageRegion:{},


    TableProductData:[],
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],
    pageProduct:{},


    TableUnitData:[],
    SelectUnitValue:[],
    selectedUnitRowKeys:[],
    UnitConditions:[],
    pageUnit:{},

    BStatus:false
  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus } = this.state;
    const { data:{superId} } = this.props;
    if(BStatus){
      return
    }
    form.validateFields((err,fieldsValue)=>{
      if(err){
        return
      }
      const obj = {
        technologyId:superId,
        code:fieldsValue.code,
        name:fieldsValue.name,
        divisionId:this.state.selectedRegionRowKeys[0],
        productionlineId:this.state.selectedProductRowKeys[0],
        vno:fieldsValue.vno,
        workstationtypeId:this.state.selectedUnitRowKeys[0],
        assignedtooperation:fieldsValue.assignedtooperation,
        quantityofworkstations:fieldsValue.quantityofworkstations?Number(fieldsValue.quantityofworkstations):null,
        timetype:fieldsValue.timetype,
        setuptime:fieldsValue.setuptime?Number(fieldsValue.setuptime):null,
        productiontime:fieldsValue.productiontime?Number(fieldsValue.productiontime):null,
        waitingtime:fieldsValue.waitingtime?Number(fieldsValue.waitingtime):null,
        transfertime:fieldsValue.transfertime?Number(fieldsValue.transfertime):null,
        disassemblytime:fieldsValue.disassemblytime?Number(fieldsValue.disassemblytime):null,
        productioninonecycle:fieldsValue.disassemblytime?Number(fieldsValue.productioninonecycle):null,
        machineutilization:fieldsValue.machineutilization?Number(fieldsValue.machineutilization):null,
        laborutilization:fieldsValue.laborutilization?Number(fieldsValue.laborutilization):null,
        checkFlag:fieldsValue.checkFlag?1:0,
        handoverFlag:fieldsValue.handoverFlag?1:0,
        backflushFlag:fieldsValue.backflushFlag?1:0,
        countFlag:fieldsValue.countFlag?1:0,
        parallelFlag:fieldsValue.parallelFlag?1:0,
        checktype:fieldsValue.checktype,
        effectdate:fieldsValue.effectdate.format('YYYY-MM-DD'),
        invaliddate:fieldsValue.invaliddate.format('YYYY-MM-DD'),
        description:fieldsValue.description,
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
      TableRegionData:[],
      SelectRegionValue:[],
      selectedRegionRowKeys:[],
      RegionConditions:[],
      pageRegion:{},


      TableProductData:[],
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],
      pageProduct:{},


      TableUnitData:[],
      SelectUnitValue:[],
      selectedUnitRowKeys:[],
      UnitConditions:[],
      pageUnit:{},

      BStatus:false
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      data,
      on,
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;

    const onRegionData = {
      TableData:this.state.TableRegionData,
      SelectValue:this.state.SelectRegionValue,
      selectedRowKeys:this.state.selectedRegionRowKeys,
      columns : [
        {
          title: '????????????',
          dataIndex: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
        },
        {
          title: '?????????',
          dataIndex: 'psnId',
        },
        {
          title: '???????????????',
          dataIndex: 'productionlineId',
        },
      ],
      fetchList:[
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
        {label:'????????????',code:'name',placeholder:'?????????????????????'},
      ],
      title:'??????',
      placeholder:'???????????????',
    };
    const onRegionOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'rout/fetchRegion',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableRegionData:res,
              })
            }
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
          SelectRegionValue:nameList,
          selectedRegionRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { RegionConditions } = this.state;
        const param = {
          ...obj
        };
        this.setState({
          pageRegion:param
        });
        if(RegionConditions.length){
          dispatch({
            type:'rout/fetchRegion',
            payload:{
              conditions:RegionConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableRegionData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'rout/fetchRegion',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableRegionData:res,
            })
          }
        })
      }, //??????
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
            RegionConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'rout/fetchRegion',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableRegionData:res,
              })
            }
          })
        }
      }, //???????????????
      handleReset:()=>{
        const { pageRegion } = this.state;
        this.setState({
          RegionConditions:[]
        });
        dispatch({
          type:'rout/fetchRegion',
          payload:{
            ...pageRegion
          },
          callback:(res)=>{
            this.setState({
              TableRegionData:res,
            })
          }
        })
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectRegionValue:[],
          selectedRegionRowKeys:[],
        })
      }
    };

    const onProductData = {
      TableData:this.state.TableProductData,
      SelectValue:this.state.SelectProductValue,
      selectedRowKeys:this.state.selectedProductRowKeys,
      columns : [
        {
          title: '???????????????',
          dataIndex: 'code',
        },
        {
          title: '???????????????',
          dataIndex: 'name',
        }
      ],
      fetchList:[
        {label:'???????????????',code:'code',placeholder:'????????????????????????'},
        {label:'???????????????',code:'name',placeholder:'????????????????????????'},
      ],
      title:'?????????',
      placeholder:'????????????????????????',
    };
    const onProductOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'rout/fetchProduct',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableProductData:res,
              })
            }
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
        this.setState({
          pageWork:param
        });
        if(ProductConditions.length){
          dispatch({
            type:'rout/fetchProduct',
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
          type:'rout/fetchProduct',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableProductData:res,
            })
          }
        })
      }, //??????
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
            type:'rout/fetchProduct',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableProductData:res,
              })
            }
          })
        }
      }, //???????????????
      handleReset:()=>{
        const { pageWork } = this.state;
        this.setState({
          ProductConditions:[]
        });
        dispatch({
          type:'rout/fetchProduct',
          payload:{
            ...pageWork
          },
          callback:(res)=>{
            this.setState({
              TableProductData:res,
            })
          }
        })
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectProductValue:[],
          selectedProductRowKeys:[],
        })
      }
    };

    const onUnitData = {
      TableData:this.state.TableUnitData,
      SelectValue:this.state.SelectUnitValue,
      selectedRowKeys:this.state.selectedUnitRowKeys,
      columns : [
        {
          title: '????????????????????????',
          dataIndex: 'code',
        },
        {
          title: '????????????????????????',
          dataIndex: 'name',
        },
      ],
      fetchList:[
        {label:'????????????????????????',code:'code',placeholder:'?????????????????????????????????'},
        {label:'????????????????????????',code:'name',placeholder:'?????????????????????????????????'},
      ],
      title:'??????????????????',
      placeholder:'?????????????????????',
    };
    const onUnitOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'rout/fetchUnit',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableUnitData:res,
              })
            }
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
          SelectUnitValue:nameList,
          selectedUnitRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { UnitConditions } = this.state;
        const param = {
          ...obj
        };
        this.setState({
          pageUnit:param
        });
        if(UnitConditions.length){
          dispatch({
            type:'rout/fetchUnit',
            payload:{
              conditions:UnitConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableUnitData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'rout/fetchUnit',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableUnitData:res,
            })
          }
        })
      }, //??????
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
            UnitConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'rout/fetchUnit',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableUnitData:res,
              })
            }
          })
        }
      }, //???????????????
      handleReset:()=>{
        const { pageUnit } = this.state;
        this.setState({
          UnitConditions:[]
        });
        dispatch({
          type:'rout/fetchUnit',
          payload:{
            ...pageUnit
          },
          callback:(res)=>{
            this.setState({
              TableUnitData:res,
            })
          }
        })
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectUnitValue:[],
          selectedUnitRowKeys:[],
        })
      }
    };

    return (
      <Modal
        title={"??????"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('code',{
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????"/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('name',{
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????"/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('divisionName',{
                rules: [{
                  required: true,
                }],
              })(<ModelTable
                data={onRegionData}
                on={onRegionOn}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="?????????">
              {getFieldDecorator('productionlineName',{
                rules: [{
                  required: true,
                }],
              })(<ModelTable
                data={onProductData}
                on={onProductOn}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="?????????">
              {getFieldDecorator('vno', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="???????????????"/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('workstationtypeId', {
              })(<ModelTable
                data={onUnitData}
                on={onUnitOn}
              />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('assignedtooperation',{
                rules: [{
                  required: true,
                }],
              })( <Select style={{ width: '100%' }} placeholder={"????????????????????????"}>
                <Option value={0}>???????????????</Option>
                <Option value={1}>????????? DIVISION_ID???PRODUCTIONLINE_ID</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('quantityofworkstations', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="????????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('timetype', {
                rules: [{
                  required: true,
                }],
              })(<Select style={{ width: '100%' }} placeholder={"?????????????????????"}>
                <Option value={"???"}>???</Option>
                <Option value={"???"}>???</Option>
                <Option value={"???"}>???</Option>
              </Select>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('setuptime',{
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('productiontime', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('waitingtime', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('transfertime',{
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('disassemblytime', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????????????????">
              {getFieldDecorator('productioninonecycle', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="?????????????????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('machineutilization',{
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="????????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('laborutilization', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder="????????????????????????" type={"Number"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('checkFlag', {
                rules: [{
                  required: true,
                }],
              })(<Checkbox />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('handoverFlag',{
                rules: [{
                  required: true,
                }],
              })(<Checkbox />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('backflushFlag', {
                rules: [{
                  required: true,
                }],
              })(<Checkbox />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="???????????????">
              {getFieldDecorator('countFlag', {
                rules: [{
                  required: true,
                }],
              })(<Checkbox />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="??????????????????">
              {getFieldDecorator('parallelFlag',{
                rules: [{
                  required: true,
                }],
              })(<Checkbox />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('checktype', {
                rules: [{
                  required: true,
                }],
              })(<Input placeholder={"?????????????????????"}/>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('effectdate', {
                rules: [{
                  required: true,
                }],
              })(<DatePicker  placeholder="?????????????????????" style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="????????????">
              {getFieldDecorator('invaliddate', {
                rules: [{
                  required: true,
                }],
              })(<DatePicker  placeholder="?????????????????????" style={{ width: '100%' }}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
         <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
            <Form.Item label='????????????'>
              {getFieldDecorator('description',{
              })(
                <TextArea rows={4} placeholder={"?????????????????????"}/>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default RoutingChildAdd;

