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
          if(res.errMsg === "成功"){
            message.success('编辑成功',1,()=>{
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
          title: '区域编号',
          dataIndex: 'code',
        },
        {
          title: '区域名称',
          dataIndex: 'name',
        },
        {
          title: '负责人',
          dataIndex: 'psnId',
        },
        {
          title: '生产线名称',
          dataIndex: 'productionlineId',
        },
      ],
      fetchList:[
        {label:'区域编号',code:'code',placeholder:'请输入区域编号'},
        {label:'区域名称',code:'name',placeholder:'请输入区域名称'},
      ],
      title:'区域',
      placeholder:'请选择区域',
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
      }, //查询时触发
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
      }, //清空时触发
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
          title: '生产线编号',
          dataIndex: 'code',
        },
        {
          title: '生产线名称',
          dataIndex: 'name',
        }
      ],
      fetchList:[
        {label:'生产线编号',code:'code',placeholder:'请输入生产线编号'},
        {label:'生产线名称',code:'name',placeholder:'请输入生产线名称'},
      ],
      title:'生产线',
      placeholder:'请选择生产线编码',
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
            type:'rout/fetchProduct',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableProductData:res,
              })
            }
          })
        }
      }, //查询时触发
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
      }, //清空时触发
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
          title: '工作单元类型编码',
          dataIndex: 'code',
        },
        {
          title: '工作单元类型名称',
          dataIndex: 'name',
        },
      ],
      fetchList:[
        {label:'工作单元类型编码',code:'code',placeholder:'请输入工作单元类型编码'},
        {label:'工作单元类型名称',code:'name',placeholder:'请输入工作单元类型名称'},
      ],
      title:'工作单元类型',
      placeholder:'请选择单元类型',
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
      }, //查询时触发
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
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectUnitValue:[],
          selectedUnitRowKeys:[],
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="工艺路线">
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工序编码">
                {getFieldDecorator('code',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.code?initData.code:''
                })(<Input placeholder="请输入工序编码"/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工序名称">
                {getFieldDecorator('name',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.name?initData.name:''
                })(<Input placeholder="请输入工序名称"/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="所属区域">
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
              <Form.Item label="生产线">
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
              <Form.Item label="工序号">
                {getFieldDecorator('vno', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.vno?initData.vno:''
                })(<Input placeholder="请输工序号"/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工作站名称">
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
              <Form.Item label="工作站类型">
                {getFieldDecorator('assignedtooperation',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.assignedtooperation
                })( <Select style={{ width: '100%' }} placeholder={"请选择工作站类型"}>
                  <Option value={0}>工作站类型</Option>
                  <Option value={1}>工作站 DIVISION_ID，PRODUCTIONLINE_ID</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="工作站数量">
                {getFieldDecorator('quantityofworkstations', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.quantityofworkstations?initData.quantityofworkstations:null
                })(<Input placeholder="请输入工作站数量" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="时间类型">
                {getFieldDecorator('timetype', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.timetype
                })(<Select style={{ width: '100%' }} placeholder={"请选择时间类型"}>
                  <Option value={"时"}>时</Option>
                  <Option value={"分"}>分</Option>
                  <Option value={"秒"}>秒</Option>
                </Select>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="准备时间">
                {getFieldDecorator('setuptime',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.setuptime?initData.setuptime:null
                })(<Input placeholder="请输入准备时间" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="生产时间">
                {getFieldDecorator('productiontime', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.productiontime?initData.productiontime:null
                })(<Input placeholder="请输入工作站数量" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="等待时间">
                {getFieldDecorator('waitingtime', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.waitingtime?initData.waitingtime:null
                })(<Input placeholder="请输入等待时间" type={"Number"}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="传输时间">
                {getFieldDecorator('transfertime',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.transfertime?initData.transfertime:null
                })(<Input placeholder="请输入传输时间" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="拆卸时间">
                {getFieldDecorator('disassemblytime', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.disassemblytime?initData.disassemblytime:null
                })(<Input placeholder="请输入拆卸时间" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="单位周期生产数量">
                {getFieldDecorator('productioninonecycle', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.productioninonecycle?initData.productioninonecycle:null
                })(<Input placeholder="请输入单位周期生产数量" type={"Number"}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="机器利用率">
                {getFieldDecorator('machineutilization',{
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.machineutilization?initData.machineutilization:null
                })(<Input placeholder="请输入机器利用率" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="人工利用率">
                {getFieldDecorator('laborutilization', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.laborutilization?initData.laborutilization:null
                })(<Input placeholder="请输入人工利用率" type={"Number"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="是否检测点">
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
              <Form.Item label="是否交接点">
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
              <Form.Item label="是否倒冲">
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
              <Form.Item label="是否计数点">
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
              <Form.Item label="是否并行工序">
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
              <Form.Item label="首检类型">
                {getFieldDecorator('checktype', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.checktype?initData.checktype:''
                })(<Input placeholder={"请输入首检类型"}/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="生效日期">
                {getFieldDecorator('effectdate', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.effectdate?moment(initData.effectdate):null
                })(<DatePicker  placeholder="请选择生效日期" style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="失效日期">
                {getFieldDecorator('invaliddate', {
                  rules: [{
                    required: true,
                  }],
                  initialValue:initData.invaliddate?moment(initData.invaliddate):null
                })(<DatePicker  placeholder="请选择失效日期" style={{ width: '100%' }}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label='工序描述'>
                {getFieldDecorator('description',{
                  initialValue:initData.description?initData.description:''
                })(
                  <TextArea rows={3} placeholder={"请输入工序描述"}/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <FooterToolbar >
          <Button
            onClick={this.backClick}
          >
            取消
          </Button>
          <Button type="primary" onClick={()=>this.validate()} >
            提交
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default RoutingChildUpdate;

