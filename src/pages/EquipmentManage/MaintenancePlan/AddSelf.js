import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import {
  Select,
  Row,
  Modal,
  Col,
  DatePicker,
  Form,
  Input,
  Checkbox,
  TreeSelect,
} from 'antd';

import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';

const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;
@connect(({ MP,loading }) => ({
  MP,
  loading:loading.models.MP
}))
@Form.create()
class AddSelf extends PureComponent {
  state = {
    BStatus:false,
    TableStatusData:[],
    SelectStatusValue:[],
    selectedStatusRowKeys:[],
    StatusConditions:[],

    TreePersonData:[], //制单人--存储左边树的数据
    PersonConditions:[], //存储查询条件
    person_id:null, //存储立项人左边数点击时的id  分页时使用
    TablePersonData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectPersonValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedPersonRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id


    departmentId:[],
    departmentTreeValue:[],

    deviceCode:'',
    deviceName:'',

  };

  onSave = (onSave)=>{
    const { form } = this.props;
    const { BStatus,selectedPersonRowKeys,selectedStatusRowKeys  } = this.state;
    if(BStatus){
      return
    }
    form.validateFields((err,values)=>{
      if(err){
        return
      }
      const obj = {
        reqData:{
          code:values.code,
          name:values.name,
          equipmentId:selectedStatusRowKeys.length?selectedStatusRowKeys[0]:null,
          mptype:values.mptype,
          startdate:values.startdate?values.startdate.format('YYYY-MM-DD'):'',
          enddate:values.enddate?values.enddate.format('YYYY-MM-DD'):'',
          deptId:this.state.departmentId,
          psndocId:selectedPersonRowKeys.length?selectedPersonRowKeys[0]:null,
          num:values.num?Number(values.num):null,
          memo:values.memo,
        }
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
      BStatus:false,
      TableStatusData:[],
      SelectStatusValue:[],
      selectedStatusRowKeys:[],
      StatusConditions:[],

      TreePersonData:[], //制单人--存储左边树的数据
      PersonConditions:[], //存储查询条件
      person_id:null, //存储立项人左边数点击时的id  分页时使用
      TablePersonData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectPersonValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedPersonRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id


      departmentId:[],
      departmentTreeValue:[],
      initData:{},
    })
  }

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'MP/newdata',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        const a = toTree(res.resData);
        this.setState({
          departmentTreeValue:a
        })
      }
    });
  }

  onChangDepartment = (value, label, extra)=>{
    
    this.setState({
      departmentId:value
    })
  };

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

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      data,
      on
    } = this.props;

    const { visible } = data;
    const { onSave,onCancel } = on;

    const onStatusData = {
      TableData:this.state.TableStatusData,
      SelectValue:this.state.SelectStatusValue,
      selectedRowKeys:this.state.selectedStatusRowKeys,
      columns : [
        {
          title: '设备编号',
          dataIndex: 'code',
        },
        {
          title: '设备名称',
          dataIndex: 'name',
        },
        {
          title: '设备类别',
          dataIndex: 'equipmentclname',
        },
        {
          title: '设备状态',
          dataIndex: 'equipmentstatusName',
        },
        {
          title: '规格',
          dataIndex: 'spec',
        },
        {
          title: '型号',
          dataIndex: 'model',
        },
        {
          title: '制造商',
          dataIndex: 'manufacturer',
        },
        {
          title: '使用部门',
          dataIndex: 'deptName',
        },
        {
          title: '责任人',
          dataIndex: 'psndocName',
        },
        {
          title: '开始使用日期',
          dataIndex: 'startUsedDate',
        },
        {
          title: '是否特种设备',
          dataIndex: 'specialflag',
          render: (text, record) => {
            if(text){
              return '是'
            }else{
              return '否'
            }
          }
        },
        {
          title: '电子标签',
          dataIndex: 'electroniclabel',
        },
        {
          title: '',
          width:1,
          dataIndex: 's',
        },
      ],
      fetchList:[
        {label:'设备编码',code:'code',placeholder:'请输入设备编码'},
        {label:'设备名称',code:'name',placeholder:'请输入设备名称'},
      ],
      title:'设备卡片',
      placeholder:'请选择设备卡片',
    };
    const onStatus = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'MP/fetchStatus',
          payload:{
            reqData:{
              pageIndex:0,
              pageSize:10
            }
          },
          callback:(res)=>{
            this.setState({
              TableStatusData:res,
            })
          }
        })
      },
      onOk:(selectedRowKeys,selectedRows,onChange)=>{
        if(!selectedRowKeys || !selectedRows){
          return
        }
        let deviceCode = ''
        let deviceName = ''
        const nameList = selectedRows.map(item =>{
          deviceCode = item.code
          deviceName = item.name
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectStatusValue:nameList,
          selectedStatusRowKeys:selectedRowKeys,
          deviceCode,
          deviceName,
        })
      },
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { statusConditions } = this.state;
        const param = {
          ...obj
        };
        if(statusConditions.length){
          dispatch({
            type:'MP/fetchStatus',
            payload:{
              conditions:statusConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TableStatusData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'MP/fetchStatus',
          payload:param,
          callback:(res)=>{
            this.setState({
              TableStatusData:res,
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
            statusConditions:conditions,
          });
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'MP/fetchStatus',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TableStatusData:res,
              })
            }
          })
        }else{
          this.setState({
            statusConditions:[],
          });
          dispatch({
            type:'MP/fetchStatus',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TableStatusData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          statusConditions:[]
        });
        dispatch({
          type:'MP/fetchStatus',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TableStatusData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectStatusValue:[],
          selectedStatusRowKeys:[],
        })
      }
    };

    const personDatas = {
      TreeData:this.state.TreePersonData, //树的数据
      TableData:this.state.TablePersonData, //表的数据
      SelectValue:this.state.SelectPersonValue, //框选中的集合
      selectedRowKeys:this.state.selectedPersonRowKeys, //右表选中的数据
      placeholder:'请选择负责人',
      columns :[
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
          dataIndex: 'operation',
          width:1
        },
      ],
      fetchList:[
        {label:'人员编码',code:'code',placeholder:'请输入人员编码'},
        {label:'人员名称',code:'name',placeholder:'请输入人员名称'},
      ],
      title:'负责人选择'
    }
    const personOn = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'MP/newdata',
          payload: {
            reqData:{}
          },
          callback:(res)=>{
            const a = toTree(res.resData);
            this.setState({
              TreePersonData:a
            })
          }
        });
        dispatch({
          type:'MP/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
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
            type:'MP/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
                person_id:obj.id
              })
            }
          })
        }else{
          dispatch({
            type:'MP/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
                person_id:null
              })
            }
          })
        }
      }, //点击左边的树
      handleTableChange:(obj)=>{
        const { dispatch } = this.props;
        const { PersonConditions,person_id } = this.state;
        const param = {
          id:person_id,
          ...obj
        };
        if(PersonConditions.length){
          dispatch({
            type:'MP/fetchTable',
            payload:{
              conditions:PersonConditions,
              ...obj,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          });
          return
        }
        dispatch({
          type:'MP/fetchTable',
          payload:param,
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
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
          SelectPersonValue:nameList,
          selectedPersonRowKeys:selectedRowKeys,
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
            PersonConditions:conditions
          })
          const obj = {
            pageIndex:0,
            pageSize:10,
            conditions,
          };
          dispatch({
            type:'MP/fetchTable',
            payload:obj,
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }else{
          this.setState({
            PersonConditions:[]
          })
          dispatch({
            type:'MP/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
              })
            }
          })
        }
      }, //查询时触发
      handleReset:()=>{
        this.setState({
          PersonConditions:[]
        })
        dispatch({
          type:'MP/fetchTable',
          payload:{
            pageIndex:0,
            pageSize:10,
          },
          callback:(res)=>{
            this.setState({
              TablePersonData:res,
            })
          }
        })
      }, //清空时触发
      onButtonEmpty:()=>{
        this.setState({
          SelectPersonValue:[],
          selectedPersonRowKeys:[],
        })
      }
    };


    return (
      <Modal
        title={"新建"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

            <Form.Item label="设备卡片">
              {getFieldDecorator('equipmentId',{
                rules: [{required: true,message:'请选择设备卡片'}],
              })(<ModelTable
                on={onStatus}
                data={onStatusData}
              />)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="设备编号">
              {getFieldDecorator('code',{
                initialValue:this.state.deviceCode,
              })(<Input placeholder="请输入设备编号" disabled/>)}
            </Form.Item>

          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
            <Form.Item label="设备名称">
              {getFieldDecorator('name',{
                initialValue:this.state.deviceName,
              })(<Input placeholder="请输入设备名称" disabled/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="维修计划类型">
              {getFieldDecorator('mptype', {
                rules: [{required: true,message:"请选择维修计划类型"}],
              })(<Select style={{width:'100%'}} placeholder={'请选择维修计划类型'}>
                <Option value={0}>一级保养计划</Option>
                <Option value={1}>二级保养计划</Option>
                <Option value={2}>三级保养计划</Option>
                <Option value={3}>点检计划</Option>
              </Select>)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="计划开始日期">
              {getFieldDecorator('startdate', {
              })(<DatePicker placeholder="请选择开始使用日期" style={{width:'100%'}}/>)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
            <Form.Item label="计划结束日期">
              {getFieldDecorator('enddate', {
              })(<DatePicker placeholder="请选择计划结束日期" style={{width:'100%'}}/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="发起部门">
              {getFieldDecorator('deptName', {
              })(<TreeSelect
                treeDefaultExpandAll
                style={{ width: '100%' }}
                onFocus={this.onFocusDepartment}
                onChange={this.onChangDepartment}
                placeholder="请选择负责部门"
              >
                {this.renderTreeNodes(this.state.departmentTreeValue)}
              </TreeSelect >)}
            </Form.Item>
          </Col>
          <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
            <Form.Item label="发起人">
              {getFieldDecorator('psndocId', {
              })(<TreeTable
                on={personOn}
                data={personDatas}
              />)}
            </Form.Item>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
            <Form.Item label="维修数量">
              {getFieldDecorator('num', {
              })(<Input placeholder="请输入维修数量"/>)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col lg={22} md={22} sm={22}>
            <Form.Item label="备注">
              {getFieldDecorator('memo', {
              })(<TextArea rows={3} />)}
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default AddSelf;

