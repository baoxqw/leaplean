import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Cadd from './BomCard';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Checkbox,
  Button,
  Card,
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

@connect(({ bom,loading }) => ({
  bom,
  loading:loading.models.bom
}))
@Form.create()
class BomUpdate extends PureComponent {
  state = {
    TableWorkData:[],
    SelectWorkValue:[],
    selectedWorkRowKeys:[],
    WorkConditions:[],
    pageWork:{},
    version:null,

    TreeMaterialData:[], //存储左边树的数据
    MaterialConditions:[], //存储查询条件
    material_id:null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
    pageMaterial:{},

    bomlist:[],

    cardList:[],
    initData:{},
    isdefault:false,
    warnshow:false,
    obj:{},

    disabled:false
  };

  componentDidMount(){
    const { dispatch } = this.props
    const initData = this.props.location.state.record;
    if(!initData){
      return
    }
    this.setState({
      initData,
      disabled:initData.defaultFlag
    })
    //是否有默认版本
    dispatch({
      type:'bom/finddefault',
      payload:{
        reqData:{
          id:initData.materialBaseId
        }
      },
      callback:(res)=>{
        if(res.userDefineInt1 == 0){
          //没有默认版本
          this.setState({isdefault:false})
        }else{
          this.setState({isdefault:true})
        }
      }
    })
    //版本号
    dispatch({
      type:'bom/findversion',
      payload:{
        reqData:{
          id:initData.materialid
        }
      },
      callback:(res)=>{
        if(res.userObj){
          const a = res.userObj.version
          this.setState({version:a})
        }
      }
    })
    //表体数据
    if(initData.id){
      const conditions = [{
        code:'BOM_ID',
        exp:'=',
        value:initData.id+''
      }]
      dispatch({
        type:'bom/fetchchild',
        payload:{
          pageSize:10,
          pageIndex:0,
          conditions
        },
        callback:(res)=>{
          if(!res || res.length<0){
            return
          }
          let a = res
          a.map((item,i)=>{
            if(item.id){
              delete item.id;
            }
            item.key = i
            delete item.bomId
            item.bomId = initData.id
            delete item.editable;
            return item
          })
          this.setState({
            cardList:a
          })
        }
      })
    }

  }

  backClick =()=>{
    router.push('/platform/productmodle/bom/list')
  }
  defaultOk = ()=>{
    const { form,dispatch } = this.props;
    const { cardList,isdefault,obj} = this.state
    let tableid;
    this.setState({warnshow:false})
    dispatch({
      type:'bom/add',
      payload:{
        reqData:{
          ...obj
        }
      },
      callback:(res)=>{

        if(res.errMsg === "成功"){
          if(this.state.initData.defaultFlag){
            dispatch({
              type:'bom/default',
              payload:{
                reqData:{
                  id:this.state.initData.id
                }
              },
            })
          }
          tableid = res.id
          if(cardList.length>0){
            cardList.map((item)=>{
              delete item.bomId;
              item.bomId = this.state.initData.id;
              delete item.editable;
              return item
            })
            dispatch({
              type:'bom/subti',
              payload:{
                reqDataList:cardList
              },
              callback:(res)=>{
                if(res.errMsg === "成功"){
                  router.push('/platform/productmodle/bom/list')
                  return
                }else{
                  dispatch({
                    type:'bom/delete',
                    payload:{
                      reqData:{
                        id:this.state.initData.id,
                      }
                    },
                    callback:(res)=>{
                      router.push('/platform/productmodle/bom/list')
                    }
                  })
                }

              }
            })
          }else{
            router.push('/platform/productmodle/bom/list')
          }

        }else{
          message.error('失败')
        }
        /*if(res.errMsg === "成功"){
          message.success("添加成功",1,()=>{
            router.push("/platform/productmodle/bom/list")
          })
        }*/
      }
    })
  }
  defaultCancle = ()=>{
    this.setState({
      warnshow: false,
      initData:{
        ...this.state.initData,
        defaultFlag:false
      }
    });
  }
  validate = ()=>{
    const { form,dispatch } = this.props;
    const { cardList,isdefault} = this.state
    let tableid;
    form.validateFieldsAndScroll((err, values) => {
     if(err){
       return
     }
      const obj = {
        ...values,
        id:this.state.initData.id,
        ucumId:this.state.initData.ucumId,
        materialBaseId:this.state.initData.materialBaseId,
        defaultFlag:this.state.initData.defaultFlag?1:0,
      };
      this.setState({obj})
      if(!this.state.disabled){
        if(this.state.initData.defaultFlag && isdefault){
          this.setState({
            warnshow:true
          })
          return
        }
      }

      dispatch({
        type:'bom/add',
        payload:{
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{

          if(res.errMsg === "成功"){
            if(this.state.initData.defaultFlag){
              dispatch({
                type:'bom/default',
                payload:{
                  reqData:{
                    id:this.state.initData.id
                  }
                },
              })
            }
            tableid = res.id
            if(cardList.length>0){
              cardList.map((item)=>{
                delete item.bomId;
                item.bomId = this.state.initData.id;
                delete item.editable;
                return item
              })
              dispatch({
                type:'bom/subti',
                payload:{
                  reqDataList:cardList
                },
                callback:(res)=>{
                  if(res.errMsg === "成功"){
                    router.push('/platform/productmodle/bom/list')
                    return
                  }else{
                    dispatch({
                      type:'bom/delete',
                      payload:{
                        reqData:{
                          id:this.state.initData.id,
                        }
                      },
                      callback:(res)=>{
                        router.push('/platform/productmodle/bom/list')
                      }
                    })
                  }

                }
              })
            }else{
              router.push('/platform/productmodle/bom/list')
            }

          }else{
            message.error('失败')
          }
          /*if(res.errMsg === "成功"){
            message.success("添加成功",1,()=>{
              router.push("/platform/productmodle/bom/list")
            })
          }*/
        }
      })
    })
  }

  bomCard =(res)=>{
    this.setState({cardList:res})
  };
  onChange = (e)=>{
    const { isdefault } = this.state;
    this.setState({
      initData:{
        ...this.state.initData,
        defaultFlag:e.target.checked
      }
    })
  };


  render(state, callback) {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;
    const { version ,cardList,initData} = this.state
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
          type:'bom/fetchUnit',
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
            type:'bom/fetchUnit',
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
            type:'bom/fetchUnit',
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
          type:'bom/fetchUnit',
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
          type:'bom/matype',
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
          type:'bom/fetchMata',
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
            type:'bom/fetchMata',
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
            type:'bom/fetchMata',
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
          type:'bom/fetchMata',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableMaterialData:res,
            })
          }
        })
      }, //分页
      onOk:(selectedRowKeys,selectedRows)=>{
        const { dispatch } = this.props
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
        //版本号
        if(selectedRowKeys[0]){
          dispatch({
            type:'bom/findversion',
            payload:{
              reqData:{
                id:selectedRowKeys[0]
              }
            },
            callback:(res)=>{
              if(res.userObj){
                const a = res.userObj.version
                this.setState({version:a})
              }
            }
          })
        }
        //bom列表
        if(selectedRowKeys[0]){
          let conditions = [{
            code:'MATERIAL_BASE_ID',
            exp:'=',
            value:selectedRowKeys[0]
          }]
          dispatch({
            type:'bom/findbomlist',
            payload:{
              pageIndex:0,
              pageSize:1000,
              conditions
            },
            callback:(res)=>{
              if(res){
                this.setState({
                  cardList: res,
                })
              }

            }
          })
        }
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
            type:'bom/fetchMata',
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
          type:'bom/fetchMata',
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
      ],
      fetchList:[
        {label:'物料编码',code:'code',placeholder:'请输入物料编码'},
        {label:'物料名称',code:'name',placeholder:'请输入物料名称'},
      ],
      title:'物料选择'
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="BOM">
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="数量">
                  {getFieldDecorator('sl',{
                    initialValue:initData.sl?initData.sl:'',
                    rules: [{required: true}]
                  })(<Input placeholder="请输入数量" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="副数量">
                  {getFieldDecorator('fsl', {
                    initialValue:initData.fsl?initData.fsl:'',
                  })(<Input placeholder="请输入副数量" />)}
                </Form.Item>

              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="物料名称">
                  {getFieldDecorator('materialBaseId', {
                    initialValue:initData.materialname?initData.materialname:''
                  })(<Input disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="计量单位">
                  {getFieldDecorator('ucumId',{
                    initialValue:initData.ucumname?initData.ucumname:''
                  })(<Input disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="换算率">
                  {getFieldDecorator('hsl',{
                     initialValue:initData.hsl?initData.hsl:'',
                    rules: [
                      {
                        required: true,
                      }
                    ]
                  })(
                    <Input placeholder="请输入换算率" />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="是否默认版本">
                  <Checkbox disabled={this.state.disabled == 1 ?true:false} onChange={this.onChange} checked={initData.defaultFlag}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="版本号">
                  {getFieldDecorator('version',{
                    initialValue:version,
                    rules: [{required: true}]
                  })(<Input placeholder="请输入数量" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
             <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo', {
                     initialValue:initData.memo?initData.memo:'',
                  })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Modal
            title="提示"
            visible={this.state.warnshow}
            onOk={this.defaultOk}
            onCancel={this.defaultCancle}
          >
            <b>
              当前物料已存在默认版本的BOM，继续保存将使原来的
              默认版本变为普通版本，是否继续？
            </b>
          </Modal>
         
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

export default BomUpdate;

