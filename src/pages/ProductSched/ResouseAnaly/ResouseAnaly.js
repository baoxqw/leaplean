import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Gantt from 'react-gantt-antd-nien'
import 'react-gantt-antd-nien/lib/css/style.css'
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
  List,
  Avatar
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../System/UserAdmin.less';
import moment from 'moment'

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ PSched, loading }) => ({
  PSched,
  loading: loading.models.PSched,
}))
@Form.create()
class ResouseAnaly extends PureComponent {
  state = {
    addVisible:false,
    updateVisible:false,
    updateSource:[],
    page:{
      pageSize:10,
      pageIndex:0
    },
    conditions:[],
    listData:[],

    expandForm:false,
    select:false,
    start:moment(new Date()).format('YYYY') + '-01-01',
    end:moment(new Date()).format('YYYY') + '-12-31',

    TreeOperationData:[],//人员
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

    TableProductData:[],//班组
    SelectProductValue:[],
    selectedProductRowKeys:[],
    ProductConditions:[],

    selectData:null,
  };

  componentDidMount(){
   /* const { dispatch } = this.props;
    const { conditions } = this.state;
    dispatch({
      type:'PSched/fetch',
      payload:{
        pageSize:1000000,
        pageIndex:0,
        conditions:[{
          code:'PLANSTARTTIME',
          exp:'>=',
          value:'2019-01-01'
        },
          {
            code:'PLANENDTIME',
            exp:'<=',
            value:'2019-10-01'
          }
        ]
      },
      callback:(res)=>{
        const arr = [];
        res.map(item=>{
          const arrr = []
          item.data.map(it=>{
            if(it.planstarttime){
              arrr.push({
                id : it.id,
                title : it.processplanName,
                start : new Date(it.planstarttime),
                end : new Date(it.planendtime),
              })
            }
          })
          arr.push({
            id:item.id,
            title:item.name,
            tasks:arrr,
            isOpen: false
          })
        })
        this.setState({
          listData:arr
        })
      }
    })*/
  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible:true
    })
  };

  handleOk = e =>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          code:values.codesadd,
          name:values.namesadd,
        }
      }
      dispatch({
        type:'workcenter/add',
        payload:obj,
        callback:(res)=>{
          this.setState({
            addVisible:false
          })
          dispatch({
            type:'workcenter/fetch',
            payload:{
              ...page
            }
          })

        }
      })
    })
  }

  handleCancel  =()=>{
    this.setState({
      addVisible:false
    })
  }

  //删除
  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'workcenter/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res.errMsg === "成功"){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'workcenter/fetch',
              payload:{
                ...page
              }
            })
          })
        }
      }
    })
  }

  //查询
  findList = (e)=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    const { selectData,selectedProductRowKeys,selectedOperationRowKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { code, closeoutdate } = values;
      if(code || closeoutdate){
        let conditions = [];
        let codeObj = {};
        let startObj = {};
        let endObj = {};
        if(code){
          codeObj = {
            code:'code',
            exp:'like',
            value:code
          };
          conditions.push(codeObj)
        }
        if(closeoutdate){
          startObj = {
            code:'PLANSTARTTIME',
            exp:'>=',
            value:closeoutdate[0].format('YYYY-MM-DD')
          };
          conditions.push(startObj)
        }
        if(closeoutdate){
          endObj = {
            code:'PLANENDTIME',
            exp:'<=',
            value:closeoutdate[1].format('YYYY-MM-DD')
          };
          conditions.push(endObj)
        }
        this.setState({
          conditions,
          start:closeoutdate[0].format('YYYY-MM-DD'),
          end:closeoutdate[1].format('YYYY-MM-DD')
        })
        const obj = {
          pageIndex:0,
          pageSize:1000000,
          conditions,
          reqData:{}
        };
        switch (selectData) {
          case 0:
            if(selectedProductRowKeys.length){
              obj.reqData.teamId = selectedProductRowKeys[0]
            }
            dispatch({
              type:'PSched/fetchTeam',
              payload:{
                ...obj
              },
              callback:(res)=>{
                const arr = [];
                res.map(item=>{
                  const arrr = []
                  item.data.map(it=>{
                    if(it.planstarttime){
                      arrr.push({
                        id:it.id,
                        title : it.processplanName,
                        start :  new Date(it.planstarttime),
                        end : new Date(it.planendtime),
                      })
                    }
                  })
                  arr.push({
                    id:item.id,
                    title:item.name,
                    tasks:arrr,
                    isOpen: false
                  })
                })
                this.setState({
                  listData:arr
                })
              }
            })
            break;
          case 1:
            if(selectedOperationRowKeys.length){
              obj.reqData.psnId = selectedOperationRowKeys[0]
            }
            dispatch({
              type:'PSched/fetchPsndoc',
              payload:{
                ...obj
              },
              callback:(res)=>{
                const arr = [];
                res.map(item=>{
                  const arrr = []
                  item.data.map(it=>{
                    if(it.planstarttime){
                      arrr.push({
                        id:it.id,
                        title : it.processplanName,
                        start :  new Date(it.planstarttime),
                        end : new Date(it.planendtime),
                      })
                    }
                  })
                  arr.push({
                    id:item.id,
                    title:item.name,
                    tasks:arrr,
                    isOpen: false
                  })
                })
                this.setState({
                  listData:arr
                })
              }
            })
            break;
          case 2:
            break
        }
      }
    })
  }

  //取消
  handleFormReset = ()=>{
    const { dispatch,form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      expandForm:false,
      select:false,
      start:moment(new Date()).format('YYYY') + '-01-01',
      end:moment(new Date()).format('YYYY') + '-12-31',

      TreeOperationData:[],//人员
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],

      TableProductData:[],//班组
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],

      listData:[],
      selectData:null,
    })
  };

  //编辑
  updataRoute = (record)=>{
    this.setState({
      updateSource:record,
      updateVisible:true,
    })
  }

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions} = this.state;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,

    };
    if(conditions){
      const param = {
        ...obj,
        conditions
      };
      dispatch({
        type:'workcenter/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'workcenter/fetch',
      payload: obj,
    });

  };

  toggleForm = ()=>{
    const { expandForm } = this.state
    this.setState({
      expandForm:!expandForm
    })
  }

  onChange = (value)=>{
    const { dispatch } = this.props;
  /*  if(value === 1){
      dispatch({
        type:'PSched/newdata',
        payload: {
          reqData:{}
        },
        callback:(res)=>{
          const a = toTree(res.resData);
          this.setState({
            TreeOperationData:a,
            personVisible:true,
          })
        }
      });
      dispatch({
        type:'PSched/fetchTable',
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
      this.setState({
        teamVisible:false,
      })
    }else if(value === 0){
      dispatch({
        type:'PSched/fetchProduct',
        payload:{
          reqData:{
            pageIndex:0,
            pageSize:10
          }
        },
        callback:(res)=>{
          this.setState({
            TableProductData:res,
            teamVisible:true,
            personVisible:false,
          })
        }
      })
    }*/

    this.setState({
      selectData:value,
      expandForm:true
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;
    const { expandForm,selectData } = this.state;

    const onProductData = {
      TableData:this.state.TableProductData,
      SelectValue:this.state.SelectProductValue,
      selectedRowKeys:this.state.selectedProductRowKeys,
      columns : [
        {
          title: '班组编号',
          dataIndex: 'code',
        },
        {
          title: '班组名称',
          dataIndex: 'name',
        },
        {
          title: '班组长',
          dataIndex: 'teamLeaderName',
        },
        {
          title: '部门',
          dataIndex: 'deptName',
        },
        {
          title: '状态',
          dataIndex: 'status',
        },
        {
          title: '备注',
          dataIndex: 'memo',
        },
        {
          title: '',
          width:1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'班组编号',code:'code',placeholder:'请输入班组编号'},
        {label:'班组名称',code:'name',placeholder:'请输入班组名称'},
      ],
      title:'班组',
      placeholder:'请选择班组',
    };
    const onProductOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'PSched/fetchProduct',
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
      onCancel:()=>{
        this.setState({
          teamVisible:false,
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
            type:'PSched/fetchProduct',
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
          type:'PSched/fetchProduct',
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
            type:'PSched/fetchProduct',
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
            type:'PSched/fetchProduct',
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
          type:'PSched/fetchProduct',
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
      onButtonEmpty:(onChange)=>{
        onChange([]);
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
          type:'PSched/newdata',
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
          type:'PSched/fetchTable',
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
            type:'PSched/fetchTable',
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
            type:'PSched/fetchTable',
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
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { OperationConditions,operation_id } = this.state;
        const param = {
          id:operation_id,
          ...obj
        };
        if(OperationConditions.length){
          dispatch({
            type:'PSched/fetchTable',
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
          type:'PSched/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableOperationData:res,
            })
          }
        })
      }, //分页
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
            OperationConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'PSched/fetchTable',
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
            type:'PSched/fetchTable',
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
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          OperationConditions:[]
        })
        dispatch({
          type:'PSched/fetchTable',
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
      }, //清空时触发
      onButtonEmpty:(onChange)=>{
        onChange([]);
        this.setState({
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      }
    };
    const datas = {
      TreeData:this.state.TreeOperationData, //树的数据
      TableData:this.state.TableOperationData, //表的数据
      SelectValue:this.state.SelectOperationValue, //框选中的集合
      selectedRowKeys:this.state.selectedOperationRowKeys, //右表选中的数据
      placeholder:'请选择人员',
      columns : [
        {
          title: '人员编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '人员名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '部门',
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
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'人员姓名',code:'name',placeholder:'请输入人员姓名'},
      ],
      title:'选择人员',
    }

    const func = (count)=>{
      switch (count) {
        case 0:
          return <Form.Item label="选择班组" style={{marginLeft:10}}>
            {getFieldDecorator('teamName', {
            })(<ModelTable
              data={onProductData}
              on={onProductOn}
            />)}
          </Form.Item>
        case 1:
          return <Form.Item label="选择工人" style={{marginLeft:10}}>
            {getFieldDecorator('psnName',{
            })(<TreeTable
              on={ons}
              data={datas}
            />)}
          </Form.Item>
        case 2:
          return
      }
    }

    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='资源类型'>
              {getFieldDecorator('type',{
                rules: [{
                  required: true,
                  message:'资源类型必选'
                }],
              })(
                <Select
                  placeholder="请选择资源类型"
                  style={{ width: '100%' }}
                  onChange={this.onChange}>
                  <Option value={0}>班组</Option>
                  <Option value={1}>工人</Option>
                  <Option value={2}>设备</Option>
                </Select>
              )}
            </FormItem>
           {/* <Form.Item label="班组">
              {getFieldDecorator('productionlineId', {
              })(<ModelTable
                data={onProductData}
                on={onProductOn}
              />)}
            </Form.Item>*/}
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='时间段'>
              {getFieldDecorator('closeoutdate',{
                rules: [{
                  required: true,
                  message:'时间段必选'
                }],
              })(
                <RangePicker  style={{width:'100%',marginLeft:'10px'}}/>
                )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
             {/* {
                expandForm?<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起
                  <Icon type="up" />
                </a>:<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开
                  <Icon type="down" />
                </a>
              }*/}
            </span>
          </Col>
        </Row>
        {expandForm?<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            {
              func(selectData)
            }
          </Col>
        </Row>:''}
      </Form>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      PSched:{data}
    } = this.props;
    const { listData,start,end } = this.state;

    const dataList = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },

    ];
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdmin}>
            <div className={styles.userAdminForm}>{this.renderForm()}</div>
            <div className={styles.userAdminOperator}></div>
          </div>
            {/*<Card  style={{width:'25%'}}>*/}
              {/*<List*/}
                {/*itemLayout="horizontal"*/}
                {/*dataSource={dataList}*/}
                {/*renderItem={item => (*/}
                  {/*<List.Item>*/}
                    {/*<List.Item.Meta*/}
                      {/*title={<a href="https://ant.design">{item.title}</a>}*/}
                      {/*description="Ant Design, a design language for background applications, is refined by Ant UED Team"*/}
                    {/*/>*/}
                  {/*</List.Item>*/}
                {/*)}*/}
              {/*/>*/}
            {/*</Card>*/}
            <Card >
              <Gantt
                start={new Date(start)}
                end={new Date(end)}
                now={new Date()}
                zoom={1}
                projects={listData}
                enableSticky
                scrollToNow
              />
            </Card>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ResouseAnaly;
