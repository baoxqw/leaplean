import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Form, Input, Button, Card,Popconfirm,Divider,Select,message } from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import BPAdd from './BussinessPeopleAdd';
import BPUpdate from './BussinessPeopleUpdate';
import styles from '../../System/UserAdmin.less';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ BP, loading }) => ({
  BP,
  loading: loading.models.BP,
}))
@Form.create()
class BussinessPeople extends PureComponent {
  state = {
    submitId:false,
    addVisible:false,
    updateVisible:false,
    record:{},
    conditions:[],
    dataList:[],
    personId:null,

    TableData:[],
    SelectValue:[],
    selectedRowKeys:[],
  };

  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
      width:100,

    },
    {
      title:'合同签订时间',
      dataIndex:'signingdate',
      width:130,

    },
    {
      title:'合同验收时间',
      dataIndex:'acceptancedate'
    },
    {
      title: '客户类型',
      dataIndex: 'type'
    },
    {
      title: '合同内容',
      dataIndex: 'memo'
    },
    {
      title: '合同金额',
      dataIndex: 'contractamount'
    },
    {
      title: '额外费用',
      dataIndex: 'addcharges'
    },
    {
      title: '有效合同额',
      dataIndex: 'additionalcharges'
    },
    {
      title: '项目所在地',
      dataIndex: 'projectaddress'
    },
    {
      title: '付款情况',
      dataIndex: 'paymentsitustion'
    },
    {
      title: '余额',
      dataIndex: 'balance'
    },
    {
      title: '商务负责人',
      dataIndex: 'businessleader'
    },
    {
      title: 'p1',
      dataIndex: 'p1'
    },
    {
      title: 'p2',
      dataIndex: 'p2'
    },
    {
      title: 'p3',
      dataIndex: 'p3'
    },
    {
      title: 'p4',
      dataIndex: 'p4'
    },
    {
      title: 'p5',
      dataIndex: 'p5'
    },
    {
      title: 'p6',
      dataIndex: 'p6'
    },
    {
      title: 'p7',
      dataIndex: 'p7'
    },
    {
      title: '贡献合同额',
      dataIndex: 'cca'
    },
    {
      title: '项目状态',
      dataIndex: 'status',

    },
  ];

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const obj = {
      pageIndex: pagination.current-1,
      pageSize:10,
      conditions:this.state.conditions
    };
    this.setState({
      pageIndex:obj.pageIndex
    });
    /*dispatch({
      type: 'PostManagement/fetch',
      payload: obj,
    });*/
  };

  //查询
  handleSearch = (e) => {
    e.preventDefault();
    const { personId,selectedRowKeys } = this.state;
    if(!personId){
      message.error("人员不能为空");
      return
    }

    const { dispatch } = this.props;
    dispatch({
      type:'BP/fetch',
      payload:{
        reqData:{
          salesid:personId,
          projectid:selectedRowKeys[0]
        },
        pageIndex:0,
        pageSize:10
      }
    })
  };

  //取消
  handleFormReset = ()=>{
    const { dispatch,form} = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions:[]
    });
    //清空后获取列表
    dispatch({
      type:'PostManagement/fetch',
      payload:{
        pageIndex:this.state.pageIndex,
        pageSize:10,
      }
    });
  };

  handleBPAdd = ()=>{
    this.setState({
      addVisible:true
    })
  };

  update = (e,record)=>{
    e.preventDefault();
    this.setState({
      updateVisible:true,
      record
    })
  };

  onFocus = ()=>{
    const { dispatch } = this.props;
    dispatch({
      type:'BP/dataList',
      payload:{},
      callback:(res)=>{
        this.setState({
          dataList:res.resData
        })
      }
    })
  };

  onChangeSelect = (value)=>{
    this.setState({
      personId:value
    })
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { dataList } = this.state;

    const option = dataList.map(item =>{
      return <Option value={item.id} key={item.id}>{item.name}</Option>
    });

    const onClick = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'BP/fetchProject',
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
          return item.projectname
        });
        this.setState({
          SelectValue:nameList,
          selectedRowKeys
        })
      },
      handleTableChange:(obj)=>{

      }, //分页
      handleSearch:(values)=>{
        //点击查询调的方法 参数是个对象  就是输入框的值
        const { projectname,status,type } = values;
        if(projectname || status || type) {
          let conditions = [];
          let codeObj = {};
          let nameObj = {};
          let typeObj = {}

          if (projectname) {
            codeObj = {
              code: 'projectname',
              exp: 'like',
              value: projectname
            };
            conditions.push(codeObj)
          }
          if (status) {
            nameObj = {
              code: 'status',
              exp: 'like',
              value: status
            };
            conditions.push(nameObj)
          }
          if (type) {
            typeObj = {
              code: 'type',
              exp: 'like',
              value: type
            };
            conditions.push(typeObj)
          }
          this.setState({
            conditions
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type: 'BP/fetchProject',
            payload: obj,
            callback:(res)=>{
              if(res){
                this.setState({
                  TableData:res,
                })
              }
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        const { page } = this.state;
        this.setState({
          conditions:[]
        });
        dispatch({
          type: 'BP/fetchProject',
          payload: {
            ...page
          },
          callback:(res)=>{
            if(res){
              this.setState({
                TableData:res,
              })
            }
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
    const dataClick = {
      TableData:this.state.TableData,
      SelectValue:this.state.SelectValue,
      selectedRowKeys:this.state.selectedRowKeys,
      columns : [

        {
          title: '项目名称',
          dataIndex: 'projectname',

        },
        {
          title: '项目类型',
          dataIndex: 'type',

        },
        {
          title: '项目负责人',
          dataIndex: 'projectmanagerName',

        },
        {
          title:'负责部门',
          dataIndex: 'deptName',

        },
        {
          title:'申请单状态',
          dataIndex: 'status',
        },
      ],
      fetchList:[
        {label:'项目名称',code:'projectname',placeholder:'请输入项目名称'},
        {label:'申请单状态',code:'status',placeholder:'请输申请单状态'},
        {label:'项目类型',code:'type',type:()=>(<Select placeholder='请选择状态' style={{width:'180px'}}>
            <Option value="咨询类">咨询类</Option>
            <Option value="技术服务类">技术服务类</Option>
            <Option value="设备类">设备类</Option>
          </Select>)},
      ],
      title:'项目名称',
      placeholder:'请选择项目名称',
    };

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择人员">
              {getFieldDecorator('project_name')(

                <Select
                  onFocus={this.onFocus}
                  onChange={this.onChangeSelect}
                >
                  {option}
                </Select>
               )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label='选择项目'>
              {getFieldDecorator('project_per')(
                <ModelTable
                  on={onClick}
                  data={dataClick}
                />)}
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

  render() {
    const {
      BP:{ fetchData },
      loading,
    } = this.props;
    const { submitId,addVisible,updateVisible } = this.state;

    const addData = {
      visible:addVisible,
      submitId
    };
    const addOn = {
      onOk:(res)=>{

      },
      onCancel:()=>{
        this.setState({
          addVisible:false
        })
      }
    };

    const updateData = {
      visible:updateVisible
    };
    const updateOn = {
      onOk:(res)=>{

      },
      onCancel:()=>{
        this.setState({
          updateVisible:false
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div style={{marginTop:'15px'}}>
            <NormalTable
              rowKey="id"
              scroll={{ x: 1800 }}
              loading={loading}
              data={fetchData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>

          <BPAdd  data={addData} on={addOn}/>

          <BPUpdate  data={updateData} on={updateOn}/>

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default BussinessPeople;
