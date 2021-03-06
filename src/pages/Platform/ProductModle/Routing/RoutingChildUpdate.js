import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  Checkbox,
  message,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import router from 'umi/router';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import moment from 'moment'

const { TextArea } = Input;
const { Option } = Select;

@connect(({ rout, loading }) => ({
  rout,
  loading: loading.models.rout,
}))
@Form.create()
class RoutingChildUpdate extends PureComponent {
  state = {
    technologyId:null,
    initData:{},

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
  };

  componentDidMount() {
    const superId = this.props.location.state.superId;
    const initData = this.props.location.state.record;
    if(!initData || !superId){
      return
    }
    const divisionId = initData.divisionId;
    const productionlineId = initData.productionlineId;
    const workstationtypeId = initData.workstationtypeId;

    this.setState({
      initData,
      technologyId:superId,
      selectedRegionRowKeys:[divisionId],
      selectedProductRowKeys:[productionlineId],
      selectedUnitRowKeys:[workstationtypeId]
    })
  }

  backClick =()=>{
    router.push('/platform/productmodle/routing/list')
  };

  validate = () => {
    const { dispatch,form } = this.props;
    const { technologyId,initData } = this.state;
    form.validateFields((err, fieldsValue) => {
      if(err){
        return
      }
      const values = {
        reqData:{
          id:initData.id,
          technologyId,
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
        }
      };

      dispatch({
        type:'rout/childadd',
        payload: values,
        callback:(res)=>{
          if(res.errMsg === "??????"){
            message.success('????????????',1,()=>{
              router.push('/platform/productmodle/routing/list');
            });
          }
        }
      })
    })

  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;

    const { initData } = this.state;

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
      onOk:(selectedRowKeys,selectedRows)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }

        const nameList = selectedRows.map(item =>{
          return item.name
        });
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
      onOk:(selectedRowKeys,selectedRows)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }

        const nameList = selectedRows.map(item =>{
          return item.name
        });
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
      onOk:(selectedRowKeys,selectedRows)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }

        const nameList = selectedRows.map(item =>{
          return item.name
        });
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
      <PageHeaderWrapper>
        <Card bordered={false} title="????????????">
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('code',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.code?initData.code:''
                })(<Input placeholder="?????????????????????"/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('name',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.name?initData.name:''
                })(<Input placeholder="?????????????????????"/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('divisionId',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:1
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
                {getFieldDecorator('productionlineId',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:1
                })(<ModelTable
                  data={onProductData}
                  on={onProductOn}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="?????????">
                {getFieldDecorator('vno', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.vno?initData.vno:''
                })(<Input placeholder="???????????????"/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="???????????????">
                {getFieldDecorator('workstationtypeId', {
                  initialValue:1
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
                  initialValue:initData.assignedtooperation
                })( <Select style={{ width: '100%' }} placeholder={"????????????????????????"}>
                  <Option value={0}>???????????????</Option>
                  <Option value={1}>????????? DIVISION_ID???PRODUCTIONLINE_ID</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="???????????????">
                {getFieldDecorator('quantityofworkstations', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.quantityofworkstations?initData.quantityofworkstations:null
                })(<Input placeholder="????????????????????????" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('timetype', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.timetype
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
                  initialValue:initData.setuptime?initData.setuptime:null
                })(<Input placeholder="?????????????????????" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('productiontime', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.productiontime?initData.productiontime:null
                })(<Input placeholder="????????????????????????" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('waitingtime', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.waitingtime?initData.waitingtime:null
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
                  initialValue:initData.transfertime?initData.transfertime:null
                })(<Input placeholder="?????????????????????" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('disassemblytime', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.disassemblytime?initData.disassemblytime:null
                })(<Input placeholder="?????????????????????" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????????????????">
                {getFieldDecorator('productioninonecycle', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.productioninonecycle?initData.productioninonecycle:null
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
                  initialValue:initData.machineutilization?initData.machineutilization:null
                })(<Input placeholder="????????????????????????" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="???????????????">
                {getFieldDecorator('laborutilization', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.laborutilization?initData.laborutilization:null
                })(<Input placeholder="????????????????????????" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="???????????????">
                {getFieldDecorator('checkFlag', {
                  rules: [{
                    required: true,
                  }],
                  valuePropName: 'checked',
                  initialValue:initData.checkFlag
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
                  valuePropName: 'checked',
                  initialValue:initData.handoverFlag
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('backflushFlag', {
                  rules: [{
                    required: true,
                  }],
                  valuePropName: 'checked',
                  initialValue:initData.backflushFlag
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="???????????????">
                {getFieldDecorator('countFlag', {
                  rules: [{
                    required: true,
                  }],
                  valuePropName: 'checked',
                  initialValue:initData.countFlag
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
                  valuePropName: 'checked',
                  initialValue:initData.parallelFlag
                })(<Checkbox />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('checktype', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.checktype?initData.checktype:''
                })(<Input placeholder={"?????????????????????"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="????????????">
                {getFieldDecorator('effectdate', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.effectdate?moment(initData.effectdate):null
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
                  initialValue:initData.invaliddate?moment(initData.invaliddate):null
                })(<DatePicker  placeholder="?????????????????????" style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label='????????????'>
                {getFieldDecorator('description',{
                  initialValue:initData.description?initData.description:''
                })(
                  <TextArea rows={3} placeholder={"?????????????????????"}/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <FooterToolbar >
          <Button
            onClick={this.backClick}
          >
            ??????
          </Button>
          <Button type="primary" onClick={()=>this.validate()} >
            ??????
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default RoutingChildUpdate;

