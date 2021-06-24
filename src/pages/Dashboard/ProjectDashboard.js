import React, { PureComponent, useState } from 'react';
import {
  Card,
  Tabs,
  Tooltip,
  Divider,
  Button,
  Form,
  Progress,
  Table,
  Icon,
  Row,
  Col,
  Modal,
  List,
  TreeSelect,
  Empty,
  message,
  Spin,
} from 'antd';
import {
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Bar } from '@/components/Charts';
import { connect } from 'dva';
import storage from '@/utils/storage'
import Context from '@/layouts/MenuContext';
import router from 'umi/router';
import Link from 'umi/link';
import TableModelTable from '@/pages/tool/TableModelTable';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TreeNode } = TreeSelect;

@connect(({ projectDashboard, user, menu, loading }) => ({
  projectDashboard,
  ...user,
  ...menu,
  loading: loading.models.projectDashboard,
}))
@Form.create()
class ProjectDashboard extends PureComponent {
  state = {
    TableWorkData: [],
    SelectWorkValue: [],
    selectedWorkRowKeys: [],
    WorkConditions: [],
    pageWork: {},
    allvalue: [
      {
        name: '001',
        id: '001',
        key: '003'
      },
      {
        name: '002',
        id: '002',
        key: '002'
      }
    ],
    chartvalue: [
      {
        name: '001',
        id: '001',
        key: '003'
      },
      {
        name: '002',
        id: '002',
        key: '002'
      }
    ],
    navigations: [],
    selectname: [],
    selectpath: [],
    modalShow: false,
    spinLoading: true,
    dataList:[],
    adminStatus:false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const userinfo = storage.get("userinfo");
    const userid = userinfo.id;
    const roleList = userinfo.roleList;
    let status = false;
    if(roleList && roleList.length){
      roleList.forEach((item)=>{
        if(item.roleCode === "corpadmin"){
          status = true;
        }
      })
    }

    //订单
    dispatch({
      type: 'projectDashboard/queryOrderProduct',
      payload: {
        pageSize:10000000,
        pageIndex:0
      },
      callback: (res) => {
        this.setState({
          dataList:res.list
        })
      }
    })

    //快捷导航列表
    dispatch({
      type: 'user/userFetchFind',
      payload: { id: userid },
      callback: (res) => {
        if (res.resData && res.resData.length) {
          let arr = [];
          res.resData.forEach((item)=>{
            arr.push(status?item.url:item.urlId)
          })
          this.setState({
            navigations: res.resData,
            selectpath:arr
          })
        } else {
          this.setState({
            navigations: []
          })
        }
        this.setState({
          spinLoading: false,
          adminStatus:status
        })
      }
    })
  }

  yy = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item}>
            {this.yy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item} />;
    });

  chartyy = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item}>
            {this.chartyy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} dataRef={item} />;
    });

  //便捷导航弹出框
  addNavigation = () => {
    this.setState({
      modalShow: true
    })
  }

  cancelShow = () => {
    this.setState({
      modalShow: false
    })
  }

  setNavigations = () => {
    const userinfo = storage.get("userinfo")
    const userid = userinfo.id;
    const { navigations, selectname, selectpath,adminStatus } = this.state
    const { dispatch } = this.props
    let a = []
    selectpath.forEach((item, index) => {
      a.push({
        urlId:item,
        url:item,
        name:selectname[index]
      })
    })
    this.setState({
      spinLoading: true
    })
    dispatch({
      type: 'user/menuData',
      payload: {
        reqDataList: a
      },
      callback: (res) => {
        if (res.errCode === '0') {
          message.success('创建成功', 1.5, () => {
            //快捷导航列表
            dispatch({
              type: 'user/userFetchFind',
              payload: { id: userid },
              callback: (res) => {
                if (res.resData && res.resData.length) {
                  let arr = [];
                  res.resData.forEach((item)=>{
                    arr.push(adminStatus?item.url:item.urlId)
                  })
                  this.setState({
                    navigations: res.resData,
                    selectpath:arr,
                  })
                } else {
                  this.setState({
                    navigations: [],
                  })
                }
                this.setState({
                  spinLoading: false,
                })
              }
            })
            this.setState({
              modalShow: false
            })
          })
        } else {
          message.error('创建失败')
        }
      }
    })
  }

  handleTreeSelectChange = (selectedKeys, info) => {
    this.setState({
      selectpath: selectedKeys,
      selectname: info
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      loading
    } = this.props;
    const { navigations, adminStatus,dataList, spinLoading, selectpath, modalShow } = this.state;

    const onWorkData = {
      SelectValue: this.state.SelectWorkValue,
      selectedRowKeys: this.state.selectedWorkRowKeys,
      columns: [
        {
          title: '生产线编号',
          dataIndex: 'code',
        },
        {
          title: '生产线名称',
          dataIndex: 'name',
        },
        {
          title: '工作中心名称',
          dataIndex: 'workcenterName',
        },
        {
          title: '状态',
          dataIndex: 'status',

        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        }
      ],
      fetchList:[
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '生产线',
      placeholder: '请选择生产线',
      tableType: 'projectDashboard/fetchWork',
      width:150
    };
    const onWordOn = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectWorkValue: nameList,
          selectedWorkRowKeys: selectedRowKeys,
        })
        dispatch({
          type:"projectDashboard/ppProductOrder",
          payload:{
            reqData:{
              productionlineId:selectedRows[0].id
            }
          },
          callback:(res)=>{
            this.setState({
              dataList:res.list
            })
          }
        })
      },
      onButtonEmpty: (onChange) => {
        onChange([])
        dispatch({
          type: 'projectDashboard/queryOrderProduct',
          payload: {
            pageSize:10000000,
            pageIndex:0
          },
          callback: (res) => {
            this.setState({
              dataList:res.list
            })
          }
        })
        this.setState({
          SelectWorkValue: [],
          selectedWorkRowKeys: [],
        })
      },
    };

    const cardData = (list)=>{
      const initial = list.filter(item =>{
        return item.orderStatus === '初始状态'
      })
      const issue = list.filter(item =>{
        return item.orderStatus === '已发料'
      })
      const cancel = list.filter(item =>{
        return item.orderStatus === '已取消'
      })
      return [{
        key:'initial',
        name:'未开工订单',
        num:initial.length,
        status:'初始状态'
      },{
        key:'issue',
        name:'已发料订单',
        num:issue.length,
        status:'已发料'
      },{
        key:'cancel',
        name:'已取消订单',
        num:cancel.length,
        status:'已取消'
      }]
    }

    const workdata = [
      {
        name: '已开工工序任务',
        num: "560",
        id: 0,
        key: 0,
      },
      {
        name: '未开工工序任务',
        num: "260",
        id: 1,
        key: 1,
      },
      {
        name: '暂停中工序任务',
        num: "560",
        id: 2,
        key: 2,
      },
      {
        name: '延期订单',
        num: "290",
        id: 3,
        key: 3,
      },
      {
        name: '延期订单',
        num: "290",
        id: 4,
        key: 4,
      },
      {
        name: '延期订单',
        num: "290",
        id: 5,
        key: 5,
      },
      {
        name: '延期订单',
        num: "290",
        id: 6,
        key: 6,
      },
      {
        name: '延期订单',
        num: "290",
        id: 7,
        key: 8,
      },
    ]
    const columns = [
      {
        title: '需求数量',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '完成数量',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '完成进度',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '图表',
        dataIndex: 'infof',
        key: 'infof',
        render: (text, record) => {
          return <Tooltip title="3 done / 3 in progress / 4 to do">
            <Progress percent={text} showInfo={false} strokeColor={'rgb(201, 45, 40)'} />
          </Tooltip>

        }
      },
    ];
    const dataSource = [
      {
        key: 19,
        id: 1,
        name: '123',
        age: 32,
        address: '40%',
        infof: 40
      },
      {
        key: 28,
        id: 2,
        name: '234432',
        age: 42,
        address: '20%',
        infof: 20
      },
    ];
    const chartdata = [
      {
        id: '1',
        key: 1,
        name: '车',
        count: 59,
      },
      {
        id: '2',
        key: 2,
        name: '洗',
        count: 49,
      },
      {
        id: '3',
        key: 3,
        name: '模',
        count: 99,
      },
      {
        id: '5',
        key: 5,
        name: '装配',
        count: 43,
      },
      {
        id: '4',
        key: 4,
        name: '固化',
        count: 85,
      },
      {
        id: '7',
        key: 7,
        name: '刨',
        count: 35,
      },
    ]

    const color = (data) => {
      if (data.item.id == 0) {
        return '#47C951'
      } else if (data.item.id == 1) {
        return '#fed710'
      } else if (data.item.id == 2) {
        return '#bbbbbb'
      }
      else {
        return '#e96734'
      }
    }
    const colorTwo = (data) => {
      if (data.item.id == 0) {
        return '#47C951'
      } else if (data.item.id == 1) {
        return '#fed710'
      } else if (data.item.id == 2) {
        return '#bbbbbb'
      }
      else {
        return '#e96734'
      }
    }
    //快捷导航
    const margin = isNegative => {
      const value = 16;
      return {
        margin: `${isNegative ? -value : value}px`,
      };
    };

    const formatMenuData = data => {
      console.log("data",data)
      const result = data.map(({ id,name, path, children }) => {
        const formatedItem = {
          title: name,
          name,
          value: adminStatus?path:id,
          key: adminStatus?path:id,
        };

        if (children && children.length) {

          formatedItem.children = formatMenuData(children);
        }

        return formatedItem;

      });
      return result;
    };

    function go(value) {
      router.push(value)
    }

    return (
      <div style={{padding:12}}>
       {/* 快捷导航 */}
       <Card bordered={false} >
          <p style={{ width: '100%' }}>
            <UnorderedListOutlined style={{ color: '#c92d28' }} />
            <b style={{ marginLeft: '10px', fontSize: '15px' }}>快速开始  便捷导航</b>
            <Button onClick={this.addNavigation} type='primary' style={{ marginLeft: '10px' }}>
              添加
            </Button>
          </p>
          <Modal
            title='添加导航'
            visible={modalShow}
            onOk={this.setNavigations}
            destroyOnClose
            width='60%'
            onCancel={this.cancelShow}
          >
            <Context.Consumer>
              {({ menuData }) => (
                <TreeSelect
                  value={selectpath}
                  treeData={formatMenuData(menuData)}
                  style={{ width: '90%',marginLeft:'5%' }}
                  treeCheckable
                  onChange={this.handleTreeSelectChange}
                  placeholder={"请选择快捷导航"}
                />
              )}
            </Context.Consumer>
          </Modal>
          <Row style={margin(true)}>
            <p style={{ height: '10px' }}></p>
            {
              spinLoading ? <div style={{ textAlign: 'center', }}>
                <Spin />
              </div> : <Row style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%', justifyContent: 'flexStart', paddingLeft: "20px" }}>
                  {navigations.map((item, index) => (
                    <Tooltip title={item.name} key={index}>
                      <div
                        style={{ marginRight: '10px',cursor: 'pointer', height: '35px', width: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                         onClick={() => go(item.url)}>
                        {item.name}
                      </div>
                    </Tooltip>

                  ))}

                </Row>
            }

          </Row>
        </Card>
        {/* 选择生产线 */}
        <Card bordered={false} style={{ marginTop: '15px' }}>
          <Form layout='inline'>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={16}>
                <FormItem label="选择生产线">
                  {getFieldDecorator('workcenterName', {
                  })(<TableModelTable
                    data={onWorkData}
                    on={onWordOn}
                  />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* 订单概览 */}
        <Card bordered={false} style={{ marginTop: '15px' }}>
          <p>
            <Icon type="code" style={{ color: '#c92d28' }} />
            <b style={{ marginLeft: '10px', fontSize: '15px' }}>订单概览</b>
          </p>
          <List
            grid={{ gutter: 16, column: 8 }}
            dataSource={cardData(dataList)}
            renderItem={item => (
              <List.Item key={item.key}>
                <Link
                  key={item.key}
                  to={{
                    pathname:"/planmanagement/productorder/list",
                    query:{
                      conditions:item.status
                    }
                  }}
                >
                  <Card style={{ textAlign: 'center', width: '110px', height: '110px' }}>
                    <h2 style={{ color: color({ item }) }}>{item.num}</h2>
                    <p style={{ fontSize: '12px' }}>{item.name}</p>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        </Card>
        {/* 订单工序生产进度 */}
        <div style={{ display: 'flex', marginTop: "15px" }}>
          <Card bordered={false} style={{ width: '49.4%', marginRight: '0.6%' }}>
            <p style={{ width: '100%' }}>
              <Icon type="project" style={{ color: '#c92d28' }} />
              <b style={{ marginLeft: '10px', fontSize: '15px' }}>订单工序生产进度</b>
            </p>
            <div style={{ display: 'flex' }}>
              <TreeSelect
                style={{ width: '50%', marginBottom: '20px', }}
                treeDefaultExpandAll
                // onChange={this.onChanged}
                // onFocus={this.onFocusValue}
                placeholder='请选择工序'
              // disabled={isdisabled}>
              >
                {this.yy(this.state.allvalue)}
              </TreeSelect>
              <div style={{ width: '50%', boxSizing: 'border-box', padding: '0 0 0 47px' }}>
                <p >
                  <b style={{ display: 'inline-block', height: '8px', width: '20px', background: '#c92d28', borderRadius: "4px", marginRight: '6px' }}></b>
                  完成数量


                <b style={{ marginLeft:'12px',display: 'inline-block', height: '8px', width: '20px', background: '#d9d9d9', borderRadius: "4px", marginRight: '6px' }}></b>
                  需求数量
                  </p>
              </div>
            </div>

            <Table columns={columns} dataSource={dataSource} />
          </Card>
          <Card bordered={false} style={{ width: '49.4%', marginLeft: '0.6%', }}>
            <p style={{ width: '100%' }}>
              <Icon type="profile" style={{ color: '#c92d28' }} />
              <b style={{ marginLeft: '10px', fontSize: '15px' }}>订单进度</b>
            </p>
            <TreeSelect
              style={{ width: '200px', marginBottom: '20px', }}
              treeDefaultExpandAll
              // onChange={this.onChanged}
              // onFocus={this.onFocusValue}
              placeholder='请选择订单'
            // disabled={isdisabled}>
            >
              {this.chartyy(this.state.chartvalue)}
            </TreeSelect>
            <Bar
              height={300}
              data={chartdata.map(({ name, count }) => ({ x: name, y: count }))}
            />
          </Card>

        </div>
        {/* 工序任务概览 */}
        <Card bordered={false} style={{ marginTop: '15px' }}>
          <p>
            <Icon type="layout" style={{ color: '#c92d28' }} />
            <b style={{ marginLeft: '10px', fontSize: '15px' }}>工序任务概览</b>
          </p>
          <List
            grid={{ gutter: 16, column: 8 }}
            dataSource={workdata}
            renderItem={item => (
              <List.Item>
                <Card style={{ textAlign: 'center', width: '110px', height: '110px' }}>
                  <h2 style={{ color: colorTwo({ item }) }}>{item.num}</h2>
                  <p style={{ fontSize: '12px' }}>{item.name}</p>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </div >
    );
  }
}

export default ProjectDashboard;



