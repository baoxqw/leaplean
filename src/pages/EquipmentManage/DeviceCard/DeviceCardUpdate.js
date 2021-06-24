import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Select,
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Divider ,
  Button,
  Checkbox,
  Card,
  message,
  Radio,
  TreeSelect,
  Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';
import moment from 'moment'
const { TextArea } = Input;
const { Option } = Select;
const { TreeNode } = TreeSelect;

@connect(({ DC,loading }) => ({
  DC,
  loading:loading.models.DC
}))
@Form.create()
class DeviceCardUpdate extends PureComponent {
  state = {
    initData:{},

    equipmentclId:[], //设备类别
    equipmentclTreeValue:[],

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


    departmentId:[],   //部门id
    departmentTreeValue:[],

  };

  componentDidMount() {
    const initData = this.props.location.state;
    const { equipmentclId,equipmentstatusId,deptId,psndocId } = initData;
    this.setState({
      equipmentclId,
      selectedStatusRowKeys:[equipmentstatusId],
      selectedStatusValue:initData.equipmentstatusName,
      departmentId:deptId,
      selectedPersonRowKeys:[psndocId],
      selectedPersonValue:initData.psndocName,
      initData
    })
  }

  backClick =()=>{
    router.push('/equipmentmanage/devicecard/list')
  }

  validate = ()=>{
    const { form,dispatch } = this.props;
    const { initData } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      /*if(!values.code || !values.name){
        return
      }
      if(!this.state.equipmentclId){
        return message.error("请选择设备分类")
      }
      if(!this.state.selectedStatusRowKeys.length){
        return message.error("请选择设备状态")
      }
      if(!this.state.departmentId){
        return message.error("请选择部门")
      }
      if(!this.state.selectedPersonRowKeys.length){
        return message.error("请选择负责人")
      }*/
      if(err){return}
      const obj = {
        id:initData.id,
        code:values.code,
        name:values.name,
        equipmentclId:this.state.equipmentclId,
        equipmentstatusId:this.state.selectedStatusRowKeys[0],
        spec:values.name,
        model:values.model,
        manufacturer:values.manufacturer,
        deptId:this.state.departmentId,
        psndocId:this.state.selectedPersonRowKeys[0],
        startUsedDate:values.startUsedDate?values.startUsedDate.format('YYYY-MM-DD'):'',
        specialflag:values.specialflag?1:0,
        electroniclabel:values.electroniclabel,
        memo:values.memo,
      };
      dispatch({
        type:'DC/addDC',
        payload:{
          reqData:{
            ...obj
          }
        },
        callback:(res)=>{
          if(res.errMsg === "成功"){
            message.success("更新成功",1,()=>{
              router.push("/equipmentmanage/devicecard/list")
            })
          }
        }
      })
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

  onFocusDepartment = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'DC/newdata',
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

  onFocusEquipmentcl = () =>{
    const { dispatch } = this.props;
    dispatch({
      type:'DC/fetchEC',
      payload: {
        reqData:{}
      },
      callback:(res)=>{
        const a = toTree(res.resData);
        this.setState({
          equipmentclTreeValue:a
        })
      }
    });
  }

  onChangEquipmentcl = (value, label, extra)=>{
    this.setState({
      equipmentclId:value
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      dispatch
    } = this.props;
    const { initData } = this.state;

    const onStatusData = {
      TableData:this.state.TableStatusData,
      SelectValue:this.state.SelectStatusValue,
      selectedRowKeys:this.state.selectedStatusRowKeys,
      columns : [
        {
          title: '状态编码',
          dataIndex: 'code',
        },
        {
          title: '状态名称',
          dataIndex: 'name',
        },
        {
          title: '状态分类',
          dataIndex: 'type',
          render:(text,record)=>{
            if(text === 1){
              return '在用'
            }else if(text === 2){
              return '闲置'
            }else if(text === 3){
              return '封存'
            }else if(text === 4){
              return '报废'
            }else if(text === 5){
              return '处置'
            }
          }
        },
        {
          title: '是否启用',
          dataIndex: 'basecodeflag',
          render:(text,record)=>{
            if(text == 0){
              return <Checkbox/>
            }else if(text == 1){
              return <Checkbox checked/>
            }
          }
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
        {label:'状态编码',code:'code',placeholder:'请输入状态编码'},
        {label:'状态名称',code:'name',placeholder:'请输入状态名称'},
      ],
      title:'设备状态',
      placeholder:'请选择设备状态',
    };
    const onStatus = {
      onIconClick:()=>{
        const { dispatch } = this.props;
        dispatch({
          type:'DC/fetchStatus',
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
        const nameList = selectedRows.map(item =>{
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectStatusValue:nameList,
          selectedStatusRowKeys:selectedRowKeys,
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
            type:'DC/fetchStatus',
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
          type:'DC/fetchStatus',
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
            type:'DC/fetchStatus',
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
            type:'DC/fetchStatus',
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
        const { pageStatus } = this.state;
        this.setState({
          statusConditions:[]
        });
        dispatch({
          type:'DC/fetchStatus',
          payload:{
            ...pageStatus
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
          width:1,
          dataIndex: 'caozuo',
        }
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
          type:'DC/newdata',
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
          type:'DC/fetchTable',
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
            type:'DC/fetchTable',
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
            type:'DC/fetchTable',
            payload:{
              pageIndex:0,
              pageSize:10,
            },
            callback:(res)=>{
              this.setState({
                TablePersonData:res,
                person_id:obj.id
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
            type:'DC/fetchTable',
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
          type:'DC/fetchTable',
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
            type:'DC/fetchTable',
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
            type:'DC/fetchTable',
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
          type:'DC/fetchTable',
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
      <PageHeaderWrapper>
        <Card bordered={false} title="设备卡片">
          <Form>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="设备编号">
                  {getFieldDecorator('code',{
                    rules: [{required: true,message:'设备编号'}],
                    initialValue:initData.code?initData.code:''
                  })(<Input placeholder="请输入设备编号" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="设备名称">
                  {getFieldDecorator('name',{
                    rules: [{required: true,message:'设备名称'}],
                    initialValue:initData.name
                  })(<Input placeholder="请输入设备名称" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="设备类别">
                  {getFieldDecorator('equipmentclName',{
                    rules: [{required: true,message:'设备类别'}],
                  })(<TreeSelect
                    treeDefaultExpandAll
                    style={{ width: '100%' }}
                    onFocus={this.onFocusEquipmentcl}
                    onChange={this.onChangEquipmentcl}
                    placeholder="请选择设备类别"
                  >
                    {this.renderTreeNodes(this.state.equipmentclTreeValue)}
                  </TreeSelect >)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="设备状态">
                  {getFieldDecorator('equipmentstatusName', {
                    rules: [{required: true,message:'设备状态'}],
                    initialValue:this.state.selectedStatusValue
                  })(<ModelTable
                    on={onStatus}
                    data={onStatusData}
                  />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="规格">
                  {getFieldDecorator('spec', {
                    initialValue:initData.spec
                  })(<Input placeholder="请输入规格" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="型号">
                  {getFieldDecorator('model', {
                    initialValue:initData.model
                  })(<Input placeholder="请输入型号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="制造商">
                  {getFieldDecorator('manufacturer', {
                    initialValue:initData.manufacturer
                  })(<Input placeholder="请输入制造商" />)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="使用部门">
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
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="责任人">
                  {getFieldDecorator('psndocName', {
                    initialValue:this.state.selectedPersonValue
                  })(<TreeTable
                    on={personOn}
                    data={personDatas}
                  />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="开始使用日期">
                  {getFieldDecorator('startUsedDate', {
                    initialValue:initData.startUsedDate?moment(initData.startUsedDate):null
                  })(<DatePicker placeholder="请输入开始使用日期" style={{width:'100%'}}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label="是否特种设备">
                  {getFieldDecorator('specialflag', {
                    valuePropName: 'checked',
                    initialValue:initData.specialflag
                  })(<Checkbox />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="电子标签">
                  {getFieldDecorator('electroniclabel', {
                    initialValue:initData.electroniclabel
                  })(<Input placeholder="请输入电子标签" /> )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={22} md={22} sm={22}>
                <Form.Item label="备注">
                  {getFieldDecorator('memo', {
                    initialValue:initData.memo
                  })(<TextArea rows={3} placeholder={'请输入备注'}/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
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

export default DeviceCardUpdate;

