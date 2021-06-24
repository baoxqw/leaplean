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
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';

import router from 'umi/router';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@connect(({ testduty, loading }) => ({
  testduty,
  loading: loading.models.testduty,
  //addloading: loading.effects['workcenter/add'],
  //updateloading: loading.effects['workcenter/update']
}))
@Form.create()
class AddSelfDuty extends PureComponent {
  state = {
    TreeMaterialData:[], //存储左边树的数据
    MaterialConditions:[], //存储查询条件
    material_id:null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id

    addShow:true,
    TableData:[],
    SelectValue:'',
    selectedRowKeys:[],
    Jpage:{},
    Jconditions:[],

    TablePData:[],
    SelectPValue:'',
    selectedPRowKeys:[],
    Pconditions:[],
    Ppage:{},
    Pperson_id:null,

    matername:'',
  };

  handleOk = (onOk) =>{
    const { form } = this.props;
    const { selectedMaterialRowKeys } = this.state
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
     const obj = {
       ...values,
       status:'初始状态',
       materialId:selectedMaterialRowKeys[0]?selectedMaterialRowKeys[0]:'',
     }
      onOk(obj,this.clear)
    })
  }

  handleCancel  =(onCancel)=>{
    onCancel(this.clear)
  }

  clear = () =>{ //在这里面写清除
    const { form } = this.props;
    //清空输入框
    form.resetFields();

    // state 清空  这里state本来就是空的 在复杂的情况下会有
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      on,
      data
    } = this.props;
    const { visible } = data
    const { onOk,onCancel } = on

    const onMater = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'testduty/matype',
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
          type:'testduty/fetchMata',
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
            type:'testduty/fetchMata',
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
            type:'testduty/fetchMata',
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
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { MaterialConditions,material_id } = this.state;
        const param = {
          id:material_id,
          ...obj
        };
        if(MaterialConditions.length){
          dispatch({
            type:'testduty/fetchMata',
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
          type:'testduty/fetchMata',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys.length || !selectedRows.length){
          return
        }
        let ucumId = null;
        let ucumname = '';
        let matername = ''
        const nameList = selectedRows.map(item =>{
          ucumId = item.ucumId;
          ucumname = item.ucumname;
          matername = item.name
          return item.code
        });
        onChange(nameList);
        this.setState({
          SelectMaterialValue:nameList,
          ucumId,
          ucumname,
          matername,
          selectedMaterialRowKeys:selectedRowKeys,
          addShow:false,
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
            MaterialConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'testduty/fetchMata',
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
            type:'testduty/fetchMata',
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
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          MaterialConditions:[]
        })
        dispatch({
          type:'testduty/fetchMata',
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
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectMaterialValue:[],
          selectedMaterialRowKeys:[],
        })
      },
      onAdd:(form)=>{
        const on = {
          onIconClick:()=>{
            const { dispatch } = this.props;
            dispatch({
              type:'testduty/fetchUcum',
              payload:{
                reqData:{
                  pageIndex:0,
                  pageSize:10
                }
              },
              callback:(res)=>{
                if(res){
                  this.setState({
                    TableData:res,
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
              SelectValue:nameList,
              selectedRowKeys:selectedRowKeys,
            })
          },
          handleTableChange:(obj)=>{
            const { dispatch } = this.props;
            const { Jconditions } = this.state;
            const param = {
              ...obj
            };
            this.setState({
              Jpage:param
            });
            if(Jconditions.length){
              dispatch({
                type:'testduty/fetchUcum',
                payload:{
                  conditions:Jconditions,
                  ...obj,
                },
                callback:(res)=>{
                  this.setState({
                    TableData:res,
                  })
                }
              });
              return
            }
            dispatch({
              type:'testduty/fetchUcum',
              payload:param,
              callback:(res)=>{
                this.setState({
                  TableData:res,
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
                Jconditions:conditions,
              });
              const obj = {
                conditions,
              };
              dispatch({
                type:'testduty/fetchUcum',
                payload:obj,
                callback:(res)=>{
                  this.setState({
                    TableData:res,
                  })
                }
              })
            }
          }, //查询时触发
          handleReset:()=>{
            const { Jpage } = this.state;
            this.setState({
              Jconditions:[]
            });
            dispatch({
              type:'testduty/fetchUcum',
              payload:{
                ...Jpage
              },
              callback:(res)=>{
                this.setState({
                  TableData:res,
                })
              }
            })
          }, //清空时触发
          onButtonEmpty:()=>{
            this.setState({
              SelectValue:[],
              selectedRowKeys:[],
            })
          }
        };
        const onData = {
          TableData:this.state.TableData,
          SelectValue:this.state.SelectValue,
          selectedRowKeys:this.state.selectedRowKeys,
          columns :[
            {
              title: '编码',
              dataIndex: 'code',
            },
            {
              title: '名称',
              dataIndex: 'name',
            },
            {
              title: '所属量纲',
              dataIndex: 'dimension',
            },
            {
              title: '是否基本计量单位',
              dataIndex: 'basecodeflag',
              render:(text)=>{
                return <Checkbox checked={text}/>
              }
            },
            {
              title: '换算率（与量纲基本单位）',
              dataIndex: 'conversionrate',
            },
            {
              title: '操作',
              dataIndex: 'caozuo',
            }
          ],
          fetchList:[
            {label:'编码',code:'code',placeholder:'请输入区域编号'},
            {label:'名称',code:'name',placeholder:'请输入区域名称'},
          ],
          title:'计量单位',
          placeholder:'请选择计量单位',
        };
        return <Form layout="vertical" >
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料编码'>
                {form.getFieldDecorator('code', {
                  rules: [{
                    required: true,
                    message:'请输入物料编码'
                  }],
                })(<Input placeholder='请输入物料编码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料名称'>
                {form.getFieldDecorator('name', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入物料名称' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='规格'>
                {form.getFieldDecorator('spec', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入规格' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='型号'>
                {form.getFieldDecorator('model', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入型号' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='计量单位'>
                {form.getFieldDecorator('ucumId', {
                  rules: [{ required: true }],
                })(<ModelTable
                  data={onData}
                  on={on}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料简称'>
                {form.getFieldDecorator('materialshortname', {
                  rules: [
                    { required: true }
                  ]
                })(<Input placeholder='请输入物料简称' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料条码'>
                {form.getFieldDecorator('materialbarcode', {
                  rules: [{ required: true}],
                })(<Input placeholder='请输入物料条码'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='物料助记码'>
                {form.getFieldDecorator('materialmnecode', {
                  rules: [{ required: true }],
                })(<Input placeholder='请输入物料助记码' />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label='图号'>
                {form.getFieldDecorator('graphid', {
                  rules: [
                    { required: true},
                  ],
                })(<Input placeholder='图号' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
              <Form.Item label="备注">
                {form.getFieldDecorator('memo',{
                })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      },
      onAddOk:(values)=>{
        const { selectedRowKeys,material_id } = this.state;
        const { code,name,spec,model,materialshortname,materialbarcode,materialmnecode,graphid,memo} = values;
        const { dispatch } = this.props;
        return new Promise((resolve, reject) => {
          dispatch({
            type:'testduty/addWuLiao',
            payload:{
              reqData:{
                invclId:material_id,
                code,
                name,
                spec,
                model,
                materialshortname,
                materialbarcode,
                materialmnecode,
                graphid,
                memo,
                ucumId:selectedRowKeys[0]
              }
            },
            callback:(res)=>{
              if(res.errMsg === "成功"){
                dispatch({
                  type:'testduty/fetchMata',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                    id:material_id
                  },
                  callback:(res)=>{
                    this.setState({
                      TableMaterialData:res,
                      TableData:[],
                      SelectValue:'',
                      selectedRowKeys:[],
                      Jpage:{},
                      Jconditions:[]
                    })
                    resolve()
                  }
                })
              }else{
                reject()
              }
            }
          })
        })
      },
      onAddCancel:()=>{
        this.setState({
          TableData:[],
          SelectValue:'',
          selectedRowKeys:[],
          Jpage:{},
          Jconditions:[]
        })
      }
    };
    const datasMater = {
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
      add:false
    }

    return (
        <Modal
          title="新建"
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
                <FormItem label='单据编号'>
                  {getFieldDecorator('billcode',{
                  })(<Input placeholder='系统自动生成' disabled/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='检验状态'>
                  {getFieldDecorator('state',{
                  })(<Input placeholder='检验状态' disabled/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='物料编码'>
                  {getFieldDecorator('materialId',{
                  })(<TreeTable
                    on={onMater}
                    data={datasMater}
                  />)}
                </FormItem>
              {/*  <FormItem label='物料编码'>
                  {getFieldDecorator('materialId',{
                  })(<Input placeholder='物料编码' />)}
                </FormItem>*/}
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='物料名称'>
                  {getFieldDecorator('matername',{
                    //initialValue:this.state.matername
                  })(<Input placeholder='选择物料编码，自动带出' disabled/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='型号'>
                  {getFieldDecorator('modelId',{
                  })(<Input placeholder='型号' />)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工作令'>
                  {getFieldDecorator('workId',{
                  })(<Input placeholder='工作令' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工序号'>
                  {getFieldDecorator('number',{
                  })(<Input placeholder='工序号'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工序名称'>
                  {getFieldDecorator('processName',{
                  })(<Input placeholder='工序名称' />)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='送审人员'>
                  {getFieldDecorator('submitPsnId',{
                  })(<Input placeholder='送审人员' />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='检验人员'>
                  {getFieldDecorator('inspectorsId',{
                  })(<Input placeholder='检验人员'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='完工数量'>
                  {getFieldDecorator('completed',{
                  })(<Input placeholder='完工数量' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='合格数量'>
                  {getFieldDecorator('qualified',{
                  })(<Input placeholder='合格数量' type={'number'}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='不合格数量'>
                  {getFieldDecorator('noQualified',{
                  })(<Input placeholder='请输入不合格数量' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='派工单号'>
                  {getFieldDecorator('dispatchNumber',{
                  })(<Input placeholder='请输入派工单号' type={'number'}/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='生产订单号'>
                  {getFieldDecorator('productionNumber',{
                  })(<Input placeholder='请输入生产订单号' type={'number'}/>)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='质量要求'>
                  {getFieldDecorator('requorements',{
                  })(<Input placeholder='请输入质量要求'/>)}
                </FormItem>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <FormItem label='工艺路线'>
                  {getFieldDecorator('craftId',{
                  })(<Input placeholder='请输入工艺路线'/>)}
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

export default AddSelfDuty;
