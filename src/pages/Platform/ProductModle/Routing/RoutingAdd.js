import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import Cadd from './Cadd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Divider,
  Button,
  Card,
  Upload,
  Icon,
  Checkbox,
  message,
} from 'antd';
import router from 'umi/router';
import NormalTable from '@/components/NormalTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ rout, loading }) => ({
  rout,
  loading: loading.models.rout,
}))
@Form.create()
class RoutingAdd extends PureComponent {
  state = {
    materialBaseName:'',
    materialBaseId:null,

    ucumId:null,
    ucumname:'',

    version:'',

    routlist:[],

    cardList:[],

    initData:{
      defaultFlag:false
    },

    TreeOperationData:[],
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

    visible:false,
    userDefineInt1:0,

    values:{},
    fileList: [],
  };

  componentDidMount() {
    const initData = this.props.location.state.addCopy;
    const materialBaseName = this.props.location.state.SelectMaterialValue;
    const materialBaseId = this.props.location.state.selectedMaterialRowKeys[0];
    const { dispatch } = this.props;
    dispatch({
      type:'rout/isversion',
      payload:{
        reqData:{
          id:materialBaseId
        }
      },
      callback:(res)=>{
        this.setState({
          userDefineInt1:res.userDefineInt1,
        })
      }
    });

    let ucumname = this.props.location.state.ucumname;
    const ucumId = this.props.location.state.ucumId;
    const version = this.props.location.state.version;
    this.setState({
      initData,
      materialBaseName,
      materialBaseId,
      ucumname,
      ucumId,
      version
    });
    const status = this.props.location.state.status;
    if(status !== "ok"){
      return
    }
    const id = initData.id;
    const conditions = [{
      code:'technology_id',
      exp:'=',
      value:id+''
    }];
    dispatch({
      type:'rout/findChild',
      payload:{
        conditions
      },
      callback:(res)=>{
        if(!res.list || !res.list.length){
          return
        }
        this.setState({
          cardList:res.list,
        })
      }
    })

    const operationName = initData.operationname;
    const operationId = initData.operationId;

    ucumname = initData.ucumname;

    this.setState({
      SelectOperationValue:operationName,
      selectedOperationRowKeys:[operationId],
      ucumname
    })
  }

  backClick =()=>{
    router.push('/platform/productmodle/routing')
  }

  validate = () => {
    const { dispatch,form } = this.props;
    const { userDefineInt1,initData  } = this.state;
     form.validateFields((err, fieldsValue) => {
      if(err){
        return
      }
      const values = {
        reqData:{
          code:fieldsValue.code,
          name:fieldsValue.name,
          materialBaseId:this.state.materialBaseId,
          version:fieldsValue.version,
          state:fieldsValue.state,
          sl:fieldsValue.sl,
          templateFlag:fieldsValue.templateFlag?1:0,
          defaultFlag:this.state.initData.defaultFlag?1:0,
          ucumId:this.state.ucumId,
          operationId:this.state.selectedOperationRowKeys[0],
          description:fieldsValue.description,
        }
      };
      if(userDefineInt1 && initData.defaultFlag){
      this.setState({
        visible:true,
        values
      });
      return
    }
      dispatch({
      type:'rout/add',
      payload: values,
      callback:(res)=>{
        if(res.errMsg === "??????"){
          let { routlist } = this.state;
          if(this.state.initData.defaultFlag){
            dispatch({
              type:'rout/default',
              payload:{
                reqData:{
                  id:res.id
                }
              },
              callback:(res)=>{
                if(res.errMsg === "??????"){

                }
              }
            });
          }
          if(routlist.length){
            routlist.map(item=>{
              item.technologyId = res.id;
              if(item.id){
                delete item.id
              }
              return item
            });
            dispatch({
              type:'rout/addChild',
              payload:{
                reqDataList:routlist
              },
              callback:(res)=>{
                if(res.errMsg === "??????"){
                  message.success('????????????',1,()=>{
                    router.push('/platform/productmodle/routing');
                  });
                }else{
                  message.error("??????????????????,???????????????")
                  /*dispatch({
                    type: 'rout/delete',
                    payload:{
                      reqData:{
                        id:res.id
                      }
                    },
                    callback:(res)=>{
                      if(res.errMsg === "??????"){
                        message.error("??????????????????,???????????????")
                      }
                    }
                  })*/
                }
              }
            })
          }else{
            message.success('????????????',1,()=>{
              router.push('/platform/productmodle/routing');
            });
          }
        }
      }
    })
  })
  };


  handleOk = () => {
    const { values } = this.state;
    const { dispatch } = this.props;
    this.setState({
      visible:false,
    });
    dispatch({
      type:'rout/add',
      payload: values,
      callback:(res)=>{
        if(res.errMsg === "??????"){
          let { routlist } = this.state;
          if(this.state.initData.defaultFlag){
            dispatch({
              type:'rout/default',
              payload:{
                reqData:{
                  id:res.id
                }
              },
              callback:(res)=>{
                if(res.errMsg === "??????"){

                }
              }
            });
          }
          if(routlist.length){
            routlist.map(item=>{
              item.technologyId = res.id;
              if(item.id){
                delete item.id
              }
              return item
            });
            dispatch({
              type:'rout/addChild',
              payload:{
                reqDataList:routlist
              },
              callback:(res)=>{
                if(res.errMsg === "??????"){
                  message.success('????????????',1,()=>{
                    router.push('/platform/productmodle/routing');
                  });
                }else{
                  dispatch({
                    type: 'rout/delete',
                    payload:{
                      reqData:{
                        id:res.id
                      }
                    },
                    callback:(res)=>{
                      if(res.errMsg === "??????"){
                        message.error("??????????????????,???????????????")
                      }
                    }
                  })
                }
              }
            })
          }else{
            message.success('????????????',1,()=>{
              router.push('/platform/productmodle/routing');
            });
          }
        }
      }
    })
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      initData:{
        ...this.state.initData,
        defaultFlag:false
      }
    });
  };

  bomCard =(res)=>{
    if(res.length){
      res.map(item =>{
        if(item.quantityofworkstations){
          item.quantityofworkstations = Number(item.quantityofworkstations)
        }
        if(item.setuptime){
          item.setuptime = Number(item.setuptime)
        }
        if(item.productiontime){
          item.productiontime = Number(item.productiontime)
        }
        if(item.waitingtime){
          item.waitingtime = Number(item.waitingtime)
        }
        if(item.transfertime){
          item.transfertime = Number(item.transfertime)
        }
        if(item.disassemblytime){
          item.disassemblytime = Number(item.disassemblytime)
        }
        if(item.productioninonecycle){
          item.productioninonecycle = Number(item.productioninonecycle)
        }
        if(item.machineutilization){
          item.machineutilization = Number(item.machineutilization)
        }
        if(item.laborutilization){
          item.laborutilization = Number(item.laborutilization)
        }

        if(item.checkFlag){
          item.checkFlag = 1
        }else{
          item.checkFlag = 0
        }

        if(item.handoverFlag){
          item.handoverFlag = 1
        }else{
          item.handoverFlag = 0
        }

        if(item.backflushFlag){
          item.backflushFlag = 1
        }else{
          item.backflushFlag = 0
        }

        if(item.countFlag){
          item.countFlag = 1
        }else{
          item.countFlag = 0
        }

        if(item.parallelFlag){
          item.parallelFlag = 1
        }else{
          item.parallelFlag = 0
        }

        return item
      })
    }
    this.setState({
      routlist:res
    })
  };

  onChange = (e)=>{
    this.setState({
      initData:{
        ...this.state.initData,
        defaultFlag:e.target.checked
      }
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;
    const { version ,cardList,initData,fileList  } = this.state;

    const on = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'rout/newdata',
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
          type:'rout/fetchTable',
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
      }, //input????????????????????????????????????
      onSelectTree:(selectedKeys, info)=>{
        const { dispatch} = this.props;
        if(info.selectedNodes[0]){
          const obj = {
            pageIndex:0,
            pageSize:10,
            id:info.selectedNodes[0].props.dataRef.id
          }
          dispatch({
            type:'rout/fetchTable',
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
            type:'rout/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableOperationData:res,
                operation_id:obj.id
              })
            }
          })
        }
      }, //??????????????????
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { OperationConditions,operation_id } = this.state;
        const param = {
          id:operation_id,
          ...obj
        };
        if(OperationConditions.length){
          dispatch({
            type:'rout/fetchTable',
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
          type:'rout/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableOperationData:res,
            })
          }
        })
      }, //??????
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectOperationValue:nameList,
          selectedOperationRowKeys:selectedRowKeys,
        })
      }, //????????????????????????
      onCancel:()=>{

      },  //???????????????
      handleSearch:(values)=>{
        //???????????????????????? ??????????????????  ?????????????????????
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
            type:'rout/fetchTable',
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
            type:'rout/fetchTable',
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
      }, //???????????????
      handleReset:()=>{
        this.setState({
          OperationConditions:[]
        })
        dispatch({
          type:'rout/fetchTable',
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
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      }
    };
    const datas = {
      TreeData:this.state.TreeOperationData, //????????????
      TableData:this.state.TableOperationData, //????????????
      SelectValue:this.state.SelectOperationValue, //??????????????????
      selectedRowKeys:this.state.selectedOperationRowKeys, //?????????????????????
      placeholder:'???????????????',
      columns : [
        {
          title: '????????????',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '??????',
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
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
        {label:'????????????',code:'name',placeholder:'?????????????????????'},
      ],
      title:'????????????'
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false} title="????????????">
        <div style={{ padding: '0 24px', height: document.body.clientHeight / 1.5, overflow: "auto" }}>
          <Row gutter={16}>
            <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="????????????">
                  {getFieldDecorator('code',{
                    rules: [{
                      required: true,
                      message:'?????????????????????'
                    }],
                    initialValue: initData.code?initData.code:''
                  })(<Input placeholder="?????????????????????"/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="????????????">
                  {getFieldDecorator('name',{
                    rules: [{
                      required: true,
                      message:'?????????????????????'
                    }],
                    initialValue: initData.name?initData.name:''
                  })(<Input placeholder="?????????????????????"/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('materialBaseName', {
                    rules: [{
                      required: true,
                      message:'???????????????'
                    }],
                    initialValue:this.state.materialBaseName
                  })(<Input  disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('version',{
                    rules: [{
                      required: true,
                      message:'???????????????'
                    }],
                    initialValue: version?version:''
                  })(<Input placeholder="???????????????" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('state',{
                    rules: [{
                      required: true,
                      message:'???????????????'
                    }],
                    initialValue: initData.state
                  })( <Select style={{ width: '100%' }} placeholder={"???????????????"}>
                    <Option value={1}>??????</Option>
                    <Option value={2}>?????????</Option>
                    <Option value={3}>?????????</Option>
                  </Select>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????">
                  {getFieldDecorator('sl', {
                    rules: [{
                      required: true,
                      message:'???????????????'
                    }],
                    initialValue: initData.sl?initData.sl:''
                  })(<Input placeholder="???????????????" type="Number"/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1}} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="????????????">
                  {getFieldDecorator('templateFlag', {
                    valuePropName: 'checked',
                    initialValue:initData.templateFlag
                  })(<Checkbox />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="??????????????????">
                 <Checkbox onChange={this.onChange} checked={initData.defaultFlag}/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="????????????">
                  {getFieldDecorator('ucumName',{
                    rules: [{
                      required: true,
                      message:'?????????????????????'
                    }],
                    initialValue: this.state.ucumname
                  })(<Input  disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="?????????">
                  {getFieldDecorator('operationName',{
                    rules: [{
                      required: true,
                      message:'??????????????????'
                    }],
                  })(<TreeTable
                    on={on}
                    data={datas}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
           <Col lg={{ span: 22, offset: 1 }} md={{ span: 22, offset: 1 }} sm={24}>
                <Form.Item label='????????????'>
                  {getFieldDecorator('description',{
                    initialValue: initData.description?initData.description:''
                  })(
                    <TextArea rows={4} placeholder={"?????????????????????"}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div>
            <Cadd  data={cardList} loading={loading} bomCard={this.bomCard}/>
          </div>
        </Card>


        <Modal
          title={"??????"}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>????????????????????????????????????BOM??????????????????????????????
            ????????????????????????????????????????????????</p>
        </Modal>

        <FooterToolbar >
          {/* {this.getErrorInfo()} */}
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



export default RoutingAdd;

