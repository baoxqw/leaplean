import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Modal, Checkbox, Button, Icon,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import CustomFind from '@/pages/tool/CustomizeFind';

const FormItem = Form.Item;

@connect(({ area,loading }) => ({
  area,
  loading:loading.models.area,
  addLoading:loading.effects['area/add'],
}))
@Form.create()
class Finds extends PureComponent {
  state = {
    TableProductData:[],
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],


    TreeOperationData:[],
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

    expandForm:true,

    arrList:[],
    columns:[]
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.data.status !== this.props.data.status){
      // 

      const { data:{ columns } } = nextProps;

      this.setState({
        columns
      })
    }
  }

  onSave = (onSave)=>{
    const { form } = this.props;
    const { selectedProductRowKeys,selectedOperationRowKeys,BStatus } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        code:values.code,
        name:values.name,
        productionlineId:selectedProductRowKeys.length?selectedProductRowKeys[0]:null,
        psnId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
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
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    const { form } = this.props;
    form.resetFields();
    this.setState({
      TableProductData:[],
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],


      TreeOperationData:[],
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],
      BStatus:false
    })
  }

  toggleForm = () =>{
    const { expandForm } = this.state
    this.setState({expandForm:!expandForm})
  };



  findList = (e,findList)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { selectedProductRowKeys,selectedOperationRowKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { code, name,psnName,productionlineName } = values;

      if(code || name || psnName || productionlineName){
        let conditions = [];
        let codeObj = {};
        let nameObj = {};
        let psnNameObj = {};
        let prodNameObj = {};

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

        if(psnName && psnName.length){
          psnNameObj = {
            code:'PSN_ID',
            exp:'=',
            value:selectedOperationRowKeys[0]
          };
          conditions.push(psnNameObj)
        }
        if(productionlineName && productionlineName.length){
          prodNameObj = {
            code:'PRODUCTIONLINE_ID',
            exp:'=',
            value:selectedProductRowKeys[0]
          };
          conditions.push(prodNameObj)
        }
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'area/fetch',
          payload:obj,
        })
        if(typeof findList === 'function'){
          findList(conditions)
        }
      }else{
        dispatch({
          type:'area/fetch',
          payload:{
            pageIndex:0,
            pageSize:10
          }
        })
        if(typeof findList === 'function'){
          findList([])
        }
      }
    })
  }

  //??????
  handleFormReset = (handleFormReset)=>{
    const { dispatch,form} = this.props;
    this.clear();
    form.resetFields();
    //?????????????????????
    dispatch({
      type:'area/fetch',
      payload:{
        pageIndex:0,
        pageSize:10,
      }
    });
    if(typeof handleFormReset === 'function'){
      handleFormReset([])
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      data,
      on,
    } = this.props;

    let { columns } = data;

    const { onOk,findList,handleFormReset } = on;

    const { expandForm } = this.state;

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
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'???????????????',code:'code',placeholder:'????????????????????????'},
        {label:'???????????????',code:'name',placeholder:'????????????????????????'},
      ],
      title:'?????????',
      placeholder:'??????????????????',
    };
    const onProductOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'area/fetchProduct',
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
            type:'area/fetchProduct',
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
          type:'area/fetchProduct',
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
            type:'area/fetchProduct',
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
            type:'area/fetchProduct',
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
      }, //???????????????
      handleReset:()=>{
        this.setState({
          ProductConditions:[]
        });
        dispatch({
          type:'area/fetchProduct',
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
      }, //???????????????
      onButtonEmpty:()=>{
        this.setState({
          SelectProductValue:[],
          selectedProductRowKeys:[],
        })
      }
    };

    const ons = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'area/newdata',
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
          type:'area/fetchTable',
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
            type:'area/fetchTable',
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
            type:'area/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableOperationData:res,
                operation_id:null
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
            type:'area/fetchTable',
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
          type:'area/fetchTable',
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
        onChange(nameList);
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
            type:'area/fetchTable',
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
            type:'area/fetchTable',
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
          type:'area/fetchTable',
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

    //??????????????????Input
    const result = [];
    let arrList = [];
    let aList = [];
    if(columns.length){
      aList = columns.filter(item =>{
        return item.disabled
      })

      for(let i=0;i<aList.length;i+=3){
        result.push(aList.slice(i,i+3));
      }

      arrList = result.map((item,index) =>{
        return <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{marginTop:8}}>
          {
            item.map((it,i)=>{

              let c = <Form.Item label={it.title}>
                {getFieldDecorator(`${it.dataIndex}`,{
                })(<Input placeholder={`?????????${it.title}`}/>)}
              </Form.Item>

              if(it.dataIndex === "psnName"){
                c = <Form.Item label={it.title}>
                  {getFieldDecorator(`${it.dataIndex}`,{
                  })(<TreeTable
                    on={ons}
                    data={datas}
                  />)}
                </Form.Item>
              }

              if(it.dataIndex === "productionlineName"){
                c = <Form.Item label={it.title}>
                  {getFieldDecorator(`${it.dataIndex}`,{
                  })(<ModelTable
                    data={onProductData}
                    on={onProductOn}
                  />)}
                </Form.Item>
              }

              return <Col md={8} sm={16}>
                {c}
              </Col>
            })
          }
        </Row>
      })
    }

    //???Input??????6??? ??????????????????
    const style = {
      marginTop:8
    };
    if(arrList.length > 3){
      style.height = 170;
      style.overflow = "auto";
    }

    //????????????????????????
    const onZ = {
      onOk:(res)=>{
        onOk(res || [])
      }, //?????????????????????
    }
    const dataZ = {
      title: '?????????', //???????????????
      columns, //???????????????
    }

    //
    return (
      <Form onSubmit={(e)=>this.findList(e,findList)} layout="inline">
        {expandForm? <div style={{marginTop:8}}>
          {arrList}
        </div>:''}
        <Row style={{marginTop:8}}>
          <span>
              <Button type="primary" htmlType="submit">
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={()=>this.handleFormReset(handleFormReset)}>
               ??????
              </Button>
            </span>
          <span style={{marginLeft:8}}>
              <CustomFind on={onZ} data={dataZ}/>
            </span>
          {
            expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              ??????
              <Icon type="up" />
            </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              ??????
              <Icon type="down" />
            </a>
          }
        </Row>
      </Form>
    );
  }
}

export default Finds;

