import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Divider ,
  Button,
  Card,
  Select,
  message,
  Popconfirm,
  TreeSelect,
  Checkbox,
} from 'antd';
import { toTree } from '@/pages/tool/ToTree';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddChild from '@/pages/Platform/Basicdata/Calendar/AddChildCale';
import UpdateChild from '@/pages/Platform/Basicdata/Calendar/UpdateChildCale';
import AddSelf from '@/pages/Platform/Basicdata/Calendar/AddSelfCale';
import styles from '../../Sysadmin/UserAdmin.less';
import router from 'umi/router';
import { isDateIntersection } from '@/pages/tool/Time';

import moment from 'moment';
import './tableSureBg.less'
const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ calendar, loading }) => ({
  calendar,
  loading: loading.models.calendar,
}))
@Form.create()

class Calendar extends PureComponent {

  state = {
    page:{
      pageSize:10,
      pageIndex:0
    },
    typeValue:[],
    workRule:[],
    holidayclId:null,
    workcalendruleId:null,
    departmentTreeValue:[],
    conditions:[],
    visible:false,
    detailVisible:false,
    open:false,
    superId:null,
    rowId:null,
    addChildVisible:false,
    addVisible:false,
    updateVisible:false,
    childData:[],
    childDataSource:{},
    superData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/calendarFetch',
      payload:{
        reqData:{
          pageIndex:0,
          pageSize:10
        }
      }
    })
  }
  //假期类别
  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/fetchType',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if(res.resData){
          const a = toTree(res.resData);
          this.setState({
            typeValue:a
          })
        }
      }
    });
  }

  onChangDepartment=(value, label, extra)=>{
    this.setState({
      holidayclId:value
    })
  }
  //日历规则
  onFocusWork = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'calendar/fetchWork',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        if(res.resData){
          const a = toTree(res.resData);
          this.setState({
            workRule:a
          })
        }

      }
    });
  }

  onChangWork =(value, label, extra)=>{
    this.setState({
      workcalendruleId:value
    })
  }
  handleCorpAdd = () => {
    router.push('/platform/basicdata/calendar/costomize');
  };

  updataRoute = (e,record) => {
    e.preventDefault();
    router.push('/platform/basicdata/calendar/updata',record);
  };
  addCalendar = ()=>{
    this.setState({addVisible:true})
  }
  updataRouteChild = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateVisible:true,
      childDataSource:record,
    })
  }
  handleOk = e=>{
    e.preventDefault();
    const { form,dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      const obj = {
        reqData:{
          code:values.workcode,
          name:values.workname,
          begindate:values.begindate?values.begindate.format('YYYY-MM-DD'):'',
          yearstartdate:values.yearstartdate?values.yearstartdate.format('YYYY-MM-DD'):'',
          enddate:values.enddate?values.enddate.format('YYYY-MM-DD'):'',
          isdefaultcalendar:values.isdefaultcalendar?1:0,
          ffirstweekday:values.ffirstweekday,
        }
      }
      dispatch({
        type:'calendar/detailAdd',
        payload:obj,
        callback:(res)=>{
          dispatch({
            type:'calendar/calendarFetch',
            payload:{
              reqData:{
                pageIndex:0,
                pageSize:10
              }
            }
          })
        }
      })
      /* dispatch({
         type:'calendar/detailBir',
         payload:obj,
         callback:(res)=>{

         }
       })*/
    })
    this.setState({visible:false})
  }
  handleCancel = ()=>{
    this.setState({visible:false})
  }


  handleDelete = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type:'calendar/delete',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'calendar/calendarFetch',
              payload:{
                ...page
              }
            })
          })
        }
      }
    })
  }
  handleDeleteChild = (record)=>{
    const { id } = record;
    const { dispatch } = this.props;
    const { page,superId } = this.state;
    dispatch({
      type:'calendar/deleteChild',
      payload:{
        reqData:{
          id
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            dispatch({
              type:'calendar/childFetch',
              payload:{
                conditions:[{
                  code:'WORKCALENDAR_ID',
                  exp:'=',
                  value:superId
                }]
              },
              callback:(res)=>{
                if(res && res.resData && res.resData.length) {
                  this.setState({
                    childData: res.resData
                  })
                }else{
                  this.setState({
                    childData: []
                  })
                }
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
    const { page } = this.state;
    form.validateFieldsAndScroll((err, values) => {
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
          conditions
        })
        const obj = {
          pageIndex:0,
          pageSize:10,
          conditions,
        };
        dispatch({
          type:'station/fetch',
          payload:obj,
        })
      }else{
        this.setState({
          conditions:[]
        })
        dispatch({
          type:'station/fetch',
          payload:{
            pageIndex:0,
            pageSize:10,
          }
        })
      }
    })

  }
  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    const { page } = this.state;
    //清空输入框
    this.setState({
      conditions:[]
    })
    form.resetFields();
    //清空后获取列表
    dispatch({
      type:'station/fetch',
      payload:{
        ...page
      }
    });
  };
  handleChilddd = () => {
    this.setState({
      addChildVisible:true
    })
  };
  handleAdd = ()=>{
    router.push("/platform/basicdata/calendar/add")
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });
  renderTreeNodesWork = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode value={item.id} title={item.name}  key={item.id}>
            {this.renderTreeNodesWork(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode value={item.id} title={item.name}  key={item.id} />;
    });
  renderForm() {
    const {
      form: { getFieldDecorator },
      loading
    } = this.props;
    const options = [];
    for (let i = 2006; i < 2026; i += 1) {
      options.push(
        <Select.Option key={i} value={i} >
          {i}
        </Select.Option>,
      );
    }
    return (
      <Form onSubmit={(e)=>this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='编码'>
              {getFieldDecorator('code')(<Input placeholder='请输入编码' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>
            <FormItem label='名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入名称' />)}
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  handleStandardTableChange = (pagination) => {
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
        type:'station/fetch',
        payload: param,
      });
      return
    }
    this.setState({
      page:obj
    });
    dispatch({
      type:'station/fetch',
      payload: obj,
    });

  };
  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }
  render() {
    const {
      loading,
      calendar:{ tableList,data },
      dispatch
    } = this.props;
    const { superId,superData,addVisible,childData,childDataSource } = this.state
    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
        
      },
      {
        title: '名称',
        dataIndex: 'name',
       
      },
      {
        title: '假日年度',
        dataIndex: 'holidayyear',
        
      },
      {
        title: '工作日历年度起始日',
        dataIndex: 'yearstartdate',
        
      },
      {
        title: '起始日',
        dataIndex: 'begindate',
       
      },
      {
        title: '结束日',
        dataIndex: 'enddate',
        
      },
      {
        title: '是否默认日历',
        dataIndex: 'isdefaultcalendar',
        render:(text,record)=>{
          if(text == '1'){
            return <Checkbox checked={true}/>
          }else{
            return <Checkbox checked={false}/>
          }
        }
      },
      {
        title: '启用状态',
        dataIndex: 'enablestate',
        render:(text, record)=>{
          if(text === 1){
            return '未启用'
          }
          if(text === 2){
            return '已启用'
          }
          if(text === 3){
            return '已停用'
          }
        }
      },
      {
        title: '假期类别',
        dataIndex: 'holidayclName',
        
      },
      {
        title: '日历规则',
        dataIndex: 'workcalendruleName',
        
      },
      {
        title: '每周起始日',
        dataIndex: 'ffirstweekday',
       
        render:(text, record)=>{
          if(text === 1){
            return '日'
          }
          if(text === 2){
            return '一'
          }
          if(text === 3){
            return '二'
          }
          if(text === 4){
            return '三'
          }
          if(text === 5){
            return '四'
          }
          if(text === 6){
            return '五'
          }
          if(text === 7){
            return '六'
          }
        }
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRoute(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ]
    const childColumns = [
      {
        title: '日历规则',
        dataIndex: 'workcalendruleName',
        
      },
      {
        title: '日历起始日',
        dataIndex: 'begindate',
        
      },
      {
        title: '日历结束日',
        dataIndex: 'enddate',
        
      },
      {
        title: '假日类型',
        dataIndex: 'holidayclId',
       
        render:(text,record)=>{
          if(text == '0'){
            return '工作日'
          }else if(text == '1'){
            return '公休日'
          }else{
            return '节假日'
          }
        }
      },
      {
        title:'操作',
        dataIndex: 'caozuo',
        sort:2,
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChild(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;"  onClick={(e)=>this.updataRouteChild(e,record)}>编辑</a>
          </Fragment>
        }
      },
    ];
    const OnAddSelf = {
      onOk:(obj,clear)=>{
        const object = {
          reqData:{
            code:obj.workcode,
            name:obj.workname,
            begindate:obj.begindate?obj.begindate.format('YYYY-MM-DD'):'',
            yearstartdate:obj.yearstartdate?obj.yearstartdate.format('YYYY-MM-DD'):'',
            enddate:obj.enddate?obj.enddate.format('YYYY-MM-DD'):'',
            isdefaultcalendar:obj.isdefaultcalendar?1:0,
            ffirstweekday:obj.ffirstweekday,
          }
        }
        dispatch({
          type:'calendar/detailAdd',
          payload:object,
          callback:(res)=>{
            if(res.errMsg === "成功"){
              message.success('新建成功',1.5,()=>{
                clear()
                this.setState({
                  addVisible:false
                })
                dispatch({
                  type:'calendar/calendarFetch',
                  payload:{
                    reqData:{
                      pageIndex:0,
                      pageSize:10
                    }
                  }
                })
              })
            }else{
              message.error("新建失败")
            }

          }
        })

      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addVisible
    }

    const OnAddChild ={
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        const bool = isDateIntersection(superData.begindate,superData.enddate,obj.begindate,obj.enddate)
        if(bool){
          let a = {
            reqData:{
              begindate:obj.begindate,
              enddate:obj.enddate,
              code:superData.code,
              ffirstweekday:superData.ffirstweekday,
              holidayclId:superData.holidayclId,
              holidayyear:superData.holidayyear,
              isdefaultcalendar:superData.isdefaultcalendar,
              id:superData.id,
              name:superData.name,
              workcalendruleId:superData.workcalendruleId,
              yearstartdate:superData.yearstartdate,
            }
          }
          dispatch({
            type:'calendar/detailAdd',
            payload:a,
            callback:(res)=>{
              if(res.errMsg === "成功"){
                message.success('原日历已覆盖',1.5,()=>{
                  clear()
                  this.setState({
                    addVisible:false
                  })
                  dispatch({
                    type:'calendar/calendarFetch',
                    payload:{
                      reqData:{
                        pageIndex:0,
                        pageSize:10
                      }
                    }
                  })
                })
              }else{
                message.error("新建失败")
              }

            }
          })
        }
         dispatch({
           type:'calendar/addchild',
           payload:{
             reqData:{
             workcalendarId:superId,
               ...obj
             }
           },
           callback:(res)=>{
             //掉列表
             if(res.errMsg === "成功"){
               message.success('新建成功',1.5,()=>{
                 clear();
                 this.setState({addChildVisible:false})
                 dispatch({
                   type:'calendar/childFetch',
                   payload:{
                     conditions:[{
                       code:'WORKCALENDAR_ID',
                       exp:'=',
                       value:superId
                     }]
                   },
                   callback:(res)=>{
                     if(res && res.resData && res.resData.length) {
                       this.setState({
                         childData: res.resData
                       })
                     }else{
                       this.setState({
                         childData: []
                       })
                     }
                   }
                 })
               });
             }else{
               message.error("新建失败")
             }
           }
         })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addChildVisible:false
        })
      }
    }
    const OnAddData = {
      visible:this.state.addChildVisible,
      record:superData
    }

    const OnUpdateChild ={
      onOk:(obj,clear)=>{
        const { superId } = this.state;
        const bool = isDateIntersection(superData.begindate,superData.enddate,obj.begindate,obj.enddate)
        if(bool){
          let a = {
            reqData:{
              begindate:obj.begindate,
              enddate:obj.enddate,
              code:superData.code,
              ffirstweekday:superData.ffirstweekday,
              holidayclId:superData.holidayclId,
              holidayyear:superData.holidayyear,
              isdefaultcalendar:superData.isdefaultcalendar,
              id:superData.id,
              name:superData.name,
              workcalendruleId:superData.workcalendruleId,
              yearstartdate:superData.yearstartdate,
            }
          }
          dispatch({
            type:'calendar/detailAdd',
            payload:a,
            callback:(res)=>{
              if(res.errMsg === "成功"){
                message.success('原日历已覆盖',1.5,()=>{
                  clear()
                  this.setState({
                    addVisible:false
                  })
                  dispatch({
                    type:'calendar/calendarFetch',
                    payload:{
                      reqData:{
                        pageIndex:0,
                        pageSize:10
                      }
                    }
                  })
                })
              }else{
                message.error("新建失败")
              }

            }
          })
        }
         dispatch({
           type:'calendar/addchild',
           payload:{
             reqData:{
             id:childDataSource.id,
             workcalendarId:superId,
               ...obj
             }
           },
           callback:(res)=>{
             if(res.errMsg === "成功"){
               message.success('编辑成功',1.5,()=>{
                 clear();
                 this.setState({updateVisible:false})
                 dispatch({
                   type:'calendar/childFetch',
                   payload:{
                     conditions:[{
                       code:'WORKCALENDAR_ID',
                       exp:'=',
                       value:superId
                     }]
                   },
                   callback:(res)=>{
                     if(res && res.resData && res.resData.length) {
                       this.setState({
                         childData: res.resData
                       })
                     }else{
                       this.setState({
                         childData: []
                       })
                     }
                   }
                 })
               });
             }else{
               message.error("新建失败")
             }
           }
         })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false
        })
      }
    }
    const OnUpdateChildData = {
      visible:this.state.updateVisible,
      record:childDataSource
    }
    // 
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={loading}
            data={data}
            columns={columns}
            onRow={(record )=>{
              return {
                onClick:()=>{
                  const { dispatch } = this.props;
                  const { page } = this.state;
                  dispatch({
                    type:'calendar/childFetch',
                    payload:{
                      conditions:[{
                        code:'WORKCALENDAR_ID',
                        exp:'=',
                        value:record.id
                      }]
                    },
                    callback:(res)=>{
                      if(res && res.resData && res.resData.length) {
                        this.setState({
                          childData: res.resData
                        })
                      }else{
                        this.setState({
                          childData: []
                        })
                      }
                    }
                  })
                  this.setState({
                    superId:record.id,
                    rowId: record.id,
                    superData:record
                  })
                },
                rowKey:record.id
              }
            }}
            rowClassName={this.setRowClassName}
            classNameSaveColumns = {"calendar5"}
            onChange={this.handleStandardTableChange}
            title={() =>  <div>
              <Button onClick={this.addCalendar} type="primary" icon="plus" >
                新建
              </Button>
            </div>
            }
          />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
        </Card>
        <Card bodyStyle={{paddingTop:'6px'}} bordered={false} style={{marginTop:'20px'}}>

          <NormalTable
            loading={loading}
            dataSource={childData}
            columns={childColumns}
            pagination={false}
            classNameSaveColumns = {"calendar6"}
            title={() =>  <div>
              <Button icon="plus" onClick={this.handleChilddd} type="primary" disabled={superId?0:1}>
                生成工作日历明细
              </Button>
            </div>
            }
          />
          <AddChild on={OnAddChild} data={OnAddData} />
          <UpdateChild on={OnUpdateChild} data={OnUpdateChildData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Calendar;
