import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Select,
  Row,
  Modal,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Card,
  Checkbox,
  message,
  Radio,
  TreeSelect,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;

@connect(({ process,loading }) => ({
  process,
  loading:loading.models.process
}))
@Form.create()
class ProductProcessUpdate extends PureComponent {
  state = {
    TableWorkData:[],
    SelectWorkValue:[],
    selectedWorkRowKeys:[],
    WorkConditions:[],
    pageWork:{},


    TreeMaterialData:[], //存储左边树的数据
    MaterialConditions:[], //存储查询条件
    material_id:null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
    pageMaterial:{},
    aa:false,
  };

  componentDidMount(){

  }

  backClick =()=>{
    router.push('/productexecu/productprocess/list')
  }

  validate = ()=>{
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }
      const obj = {
        code:values.code,
        name:values.name,
        workcenterId:this.state.selectedWorkRowKeys[0],
        invbasdocId:this.state.selectedMaterialRowKeys[0],
        status:values.status,
        memo:values.memo
      };

      dispatch({
        type:'workline/add',
        payload:{
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res.errMsg === "成功"){
            message.success("添加成功",1,()=>{
              router.push("/platform/factory/workline")
            })
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

    const onWorkData = {
      TableData:this.state.TableWorkData,
      SelectValue:this.state.SelectWorkValue,
      selectedRowKeys:this.state.selectedWorkRowKeys,
      columns : [
        {
          title: '工作中心编号',
          dataIndex: 'code',
        },
        {
          title: '工作中心名称',
          dataIndex: 'name',
        }
      ],
      fetchList:[
        {label:'计量单位代码',code:'code',placeholder:'请输入计量单位代码'},
        {label:'计量单位名称',code:'name',placeholder:'请输入计量单位名称'},
      ],
      title:'计量单位',
      placeholder:'请选择计量单位',
    };
    const onWordOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'process/fetchUnit',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableWorkData:res,
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
          SelectWorkValue:nameList,
          selectedWorkRowKeys:selectedRowKeys,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { WorkConditions } = this.state;
        const param = {
          ...obj
        };
        this.setState({
          pageWork:param
        });
        if(WorkConditions.length){
          dispatch({
            type:'process/fetchUnit',
            payload:{
              conditions:WorkConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'bom/fetchUnit',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
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
            WorkConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'process/fetchUnit',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableWorkData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { pageWork } = this.state;
        this.setState({
          WorkConditions:[]
        });
        dispatch({
          type:'process/fetchUnit',
          payload:{
            ...pageWork
          },
          callback:(res)=>{
            this.setState({
              TableWorkData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectWorkValue:[],
          selectedWorkRowKeys:[],
        })
      }
    };

    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'process/matype',
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
          type:'process/fetchMata',
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
            type:'process/fetchMata',
            payload:obj,
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
        this.setState({
          pageMaterial:param
        })
        if(MaterialConditions.length){
          dispatch({
            type:'process/fetchMata',
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
          type:'process/fetchMata',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        this.setState({
          SelectMaterialValue:nameList,
          selectedMaterialRowKeys:selectedRowKeys,
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
            type:'process/fetchMata',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableMaterialData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { pageMaterial } = this.state;
        this.setState({
          MaterialConditions:[]
        })
        dispatch({
          type:'process/fetchMata',
          payload:{
            ...pageMaterial
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
          width:'11%'
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
          width:'11%'
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
          width:'11%'
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
          width:'11%'
        },
        {
          title: '计量单位',
          dataIndex: 'ucumName',
          key: 'ucumName',
          width:'11%'
        },
        {
          title: '物料简称',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
          width:'11%'
        },
        {
          title: '物料条形码',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
          width:'11%'
        },
        {
          title: '物料助记器',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
          width:'11%'
        },
        {
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
        },
      ],
      fetchList:[
        {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
        {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
      ],
      title:'物料选择'
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="生产过程管理">
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="订单编号">
                {getFieldDecorator('code',{
                  rules: [{required: true}]
                })(<Input placeholder="请输入订单编号" />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="订单名称">
                {getFieldDecorator('name',{
                  rules: [
                    {
                      required: true,
                    }
                  ]
                })(
                  <Input placeholder="请输入订单名称" />
                )}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="计量单位">
                {getFieldDecorator('workcenterName',{
                  rules: [{required: true}],
                  initialValue:this.state.selectedWorkRowKeys
                })(<ModelTable
                  data={onWorkData}
                  on={onWordOn}
                />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="物料编码">
                {getFieldDecorator('invbasdocName', {
                  rules: [
                    {
                      required: true,
                    }
                  ],
                  initialValue:this.state.selectedMaterialRowKeys
                })(<TreeTable
                  on={on}
                  data={datas}
                />)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="订单状态">
                {getFieldDecorator('status', {
                })(<Select style={{ width: '100%' }} placeholder="请选择状态">
                  <Option value="1">状态1</Option>
                  <Option value="2">状态2</Option>
                  <Option value="3">状态3</Option>
                </Select>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="订单数量">
                {getFieldDecorator('ordernum',{
                  rules: [{required: true}],
                })( <Input placeholder="请输入订单数量" type='number'/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="物料代码">
                {getFieldDecorator('macode', {
                  rules: [
                    {
                      required: true,
                    }
                  ],
                  initialValue:this.state.selectedMaterialRowKeys
                })(<Input placeholder="请输入物料代码" type='number'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="优先级">
                {getFieldDecorator('priority', {
                })(<Input placeholder="请输入优先级" type='number'/>)}
              </Form.Item>
            </Col>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
              <Form.Item label="产品描述">
                {getFieldDecorator('describe',{
                  rules: [{required: true}],
                })( <Input placeholder="请输入产品描述" />)}
              </Form.Item>
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
        </Card>
        <FooterToolbar >
          {/* {this.getErrorInfo()} */}
          <Button
            onClick={this.backClick}
          >
            取消
          </Button>
          <Button type="primary" onClick={this.validate} loading={loading}>
            提交
          </Button>

        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default ProductProcessUpdate;

