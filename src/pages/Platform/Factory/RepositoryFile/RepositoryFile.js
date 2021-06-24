import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  Checkbox,
  Tree,
  message, Popconfirm,
} from 'antd';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
import NewModelTable from '@/pages/tool/NewModelTable/NewModelTable';
import NewTreeTable from '@/pages/tool/NewTreeTable/NewTreeTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import QuickDefinition from '@/pages/Platform/Factory/RepositoryFile/QuickDefinition';
const Search = Input.Search;
const { TreeNode } = Tree;

@connect(({ areaadmin,RFile, loading }) => ({
  areaadmin,
  RFile,
  loading: loading.models.areaadmin,
}))
@Form.create()
class RepositoryFile extends PureComponent {
  state = {
    value: undefined,
    treeData:'',
    isdisabled:true,
    valueList:[],

    dataList:[], //原始数据

    initData:[],
    addtreeData:null,
    adddata:false,

    status:'',

    node:{},

    cloneNode:{},

    addStatus:true,
    updateStatus:true,
    deleteStatus:true,
    fastStatus:false,
    visible:false,
    allvalue:[],

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    seal:0,

    TreeOperationData:[],//保管员
    OperationConditions:[],
    operation_id:null,
    TableOperationData:[],
    SelectOperationValue:[],
    selectedOperationRowKeys:[],

    page:{
      pageIndex:0,
      pageSize:100000
    },


    record:{}
  }

  onSelect = (selectedKeys, info) => {
    if(info.selectedNodes[0]){
      const node = info.selectedNodes[0].props.dataRef;
      if('warehouseId' in node){
        node.type = '库位';
        this.setState({
          node,
          isdisabled:true,
          cloneNode:node,
          selectedOperationRowKeys:[node.psnId],
          fastStatus:false,
          addStatus:false,
          updateStatus:false,
          deleteStatus:false,
        })
      }else{
        node.type = '仓库';
        this.setState({
          record:node,
          addStatus:false,
          node:{},
          fastStatus:false,
          isdisabled:true,
          deleteStatus:true,
          updateStatus:true,
          seal:0,
          TreeOperationData:[],//保管员
          OperationConditions:[],
          operation_id:null,
          TableOperationData:[],
          SelectOperationValue:[],
          selectedOperationRowKeys:[],
        })
      }
    }else{
      this.setState({
        node:{},
        fastStatus:false,
        isdisabled:true,
        addStatus:true,
        deleteStatus:true,
        updateStatus:true,
        seal:0,
        TreeOperationData:[],//保管员
        OperationConditions:[],
        operation_id:null,
        TableOperationData:[],
        SelectOperationValue:[],
        selectedOperationRowKeys:[],
      })
    }
  };

  componentDidMount(){

    const { page} = this.state;
    /*dispatch({
      type: 'RFile/findrespository',
      payload: {
        ...page
      },
      callback:(res)=>{
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            dataList:res.resData,
            valueList: a,
          })
        }
      }
    })*/
    this.query();
  }


  query = ()=>{
    const { page } = this.state;
    const { dispatch} = this.props;
    this.setState({
      valueList:[]
    })
    dispatch({
      type: 'RFile/fetchstore',
      payload: {
        ...page
      },
      callback:(res)=>{
        if (res && res.list){
          const a = toTree(res.list);
          this.setState({
            dataList:res.list,
            valueList: a,
          })
        }
      }
    })
  }

  onChanged = (value,label, extra) => {
    this.setState({
      node:{
        ...this.state.node,
        pid:value,
      }
    });
  };

  onFocusValue = ()=>{
    const { dispatch } = this.props;
    const { page,node } = this.state;
    dispatch({
      type: 'RFile/findrespository',
      payload: {
        ...page,
        conditions:[{
          code:'WAREHOUSE_ID',
          exp:'=',
          value:node.warehouseId
        }]
      },
      callback:(res)=>{
       
        if (res.resData){
          const a = toTree(res.resData);
          this.setState({
            allvalue:a
          })
        }
      }
    })
  }

  onChange = value => {
    
    this.setState({ value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch,form } = this.props;
    const { status,node,selectedOperationRowKeys,page,record } = this.state;
   
    if(!status){
      message.error("请选择操作方式")
      return
    }
    form.validateFieldsAndScroll((err, values) => {
      if(err){
        return
      }

      let reqData;
      if(status === '新建'){
        reqData = {
          pid:node.type === "库位" ? node.id:0,
          ...values,
          psnId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
          volume:Number(values.volume),
          seal:values.seal?1:0,
          warehouseId:node.type === "库位" ?node.warehouseId:record.id
        }
       
      }else if(status === '编辑'){
        reqData = {
          pid:node.pid,
          id:node.id,
          ...values,
          psnId:selectedOperationRowKeys.length?selectedOperationRowKeys[0]:null,
          volume:Number(values.volume),
          seal:values.seal?1:0,
          warehouseId:node.warehouseId
        }
      }
      dispatch({
        type:'RFile/addData',
        payload:{
          reqData:{
            ...reqData,
          }
        },
        callback:(res)=>{
          if(res.errMsg === "成功"){
            message.success(`${status === '新建'?'新建成功':'编辑成功'}`,1.5,()=>{
              this.setState({
                seal:0,
                node:{},

                TreeOperationData:[],//保管员
                OperationConditions:[],
                operation_id:null,
                TableOperationData:[],
                SelectOperationValue:[],
                selectedOperationRowKeys:[],

                fastStatus:false,
                isdisabled:true,
                addStatus:true,
                deleteStatus:true,
                updateStatus:true,
              })
              form.resetFields();
              this.query();
            })
          }
        }
      })
    });
  };

  //编辑
  handleUpdate = e =>{
    const { node } = this.state;
    if(!node.id){
      message.error("请选择节点");
      return
    }
    this.setState({
      status:'编辑',
      isdisabled:false,
      addStatus:true,
      deleteStatus:true,
      fastStatus:true
    })
  }

  handleFast = e =>{
    this.setState({
      visible:true
    })
  }

  //新建
  handleModalVisible = () =>{
    this.setState({
      isdisabled:false,
      seal:0,
      status:'新建',
      node:{
        id:this.state.node.id,
        pname:this.state.node.name,
        pid:this.state.node.pid,
        type:this.state.node.type,
        warehouseId:this.state.node.warehouseId
      },
      TreeOperationData:[],//保管员
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],
      updateStatus:true,
      deleteStatus:true,
      fastStatus:true
    })
  }

  handleRemove = e =>{
    const { dispatch,form} = this.props;
    const { node,page } = this.state;
    if(!node.id){
      message.error("请选择数据");
      return
    }
    dispatch({
      type: 'RFile/removenewdata',
      payload: {
        reqData:{
          id:node.id,
        }
      },
      callback:(res)=>{
        if(res){
          message.success("删除成功",1,()=>{
            this.query();
            this.setState({
              node:{},
              fastStatus:false,
              isdisabled:true,
              addStatus:true,
              deleteStatus:true,
              updateStatus:true,
              seal:0,
              TreeOperationData:[],//保管员
              OperationConditions:[],
              operation_id:null,
              TableOperationData:[],
              SelectOperationValue:[],
              selectedOperationRowKeys:[],
            })
          })
        }else{
          message.error('删除失败')
        }
      }
    })
  }

  cancled = ()=>{
    const { form} = this.props;
    if(this.state.isdisabled){
      return
    };
    form.resetFields();
    this.setState({
      node:this.state.cloneNode,
      isdisabled:true,
      addStatus:false,
      updateStatus:false,
      deleteStatus:false,
      TreeOperationData:[],//保管员
      OperationConditions:[],
      operation_id:null,
      TableOperationData:[],
      SelectOperationValue:[],
      selectedOperationRowKeys:[],
      seal:0,
      fastStatus:false
    })
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} dataRef={item}/>;
    });

  yy = data =>
    data.map(item => {
      const { TreeNode } = TreeSelect;
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} value ={item.id} dataRef={item}>
            {this.yy(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode  title={item.name} key={item.id} value ={item.id} dataRef={item} />;
    });

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChangeSearch = e => {
    const value = e.target.value;
    const { valueList,dataList } = this.state;
    if(!value){
      this.setState({expandedKeys:[]});
      return
    }
    const expandedKeys = dataList
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, valueList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const strExpandedKeys = expandedKeys.map(item =>{
      return item + ''
    });
    this.setState({
      expandedKeys:strExpandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };


  onLoadDataBom = treeNode =>
    new Promise(resolve => {
      if (treeNode.children) {
        resolve();
        return;
      }
      const { dispatch } = this.props;
      const dataRef = treeNode.props.dataRef;
      const { id } = dataRef;
      let conditions = [];
      if('warehouseId' in dataRef){
        conditions = [{
          code:'PID',
          exp:'=',
          value:id
        }]
      }else{
        conditions = [{
          code:'WAREHOUSE_ID',
          exp:'=',
          value:id
        },
          {
            code:'PID',
            exp:'=',
            value:0
          }
        ]
      }
      dispatch({
        type:'RFile/findrespository',
        payload:{
          ...this.state.page,
          conditions
        },
        callback:(res)=>{
          
          if(!res.resData){
            resolve();
            return;
          }
          res.resData.map(item=>{
            item.key = 'C' + item.id;
          });
          treeNode.props.dataRef.children  = res.resData
          this.setState({
            valueList:[...this.state.valueList]
          })
          resolve();
        }
      });
    });

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      loading,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span:6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset:12,
        },
        sm: {
          span: 16,
          offset:14,
        },
      },
    };
    const { node,isdisabled,expandedKeys,autoExpandParent,searchValue,seal,fastStatus } = this.state;

    const ons = {
      setTreeData:(treeData)=>{
        
        const  tree = toTree(treeData.resData);
        this.setState({
          TreeOperationData:tree,
        })
      }, //设置tree的树值
      setTableData:(res)=>{
        this.setState({
          TableOperationData:res,
        })
      }, //设置table的表值
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
      onButtonEmpty:()=>{
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
      tableType:'RFile/fetchTable',
      treeType:'RFile/newdata',
    }


    const onQuick = {
      onSave:(res,clear)=>{
        dispatch({
          type:'RFile/quickAdd',
          payload:{
            reqData:{
              ...res
            }
          },
          callback:(data)=>{
            if(data.errMsg === "成功"){
              message.success("成功",1.5,()=>{
                clear();
                this.setState({
                  visible:false
                })
                const { page} = this.state;
                dispatch({
                  type: 'RFile/fetchstore',
                  payload: {
                    ...page
                  },
                  callback:(res)=>{
                    if (res && res.list){
                      const a = toTree(res.list);
                      this.setState({
                        dataList:res.list,
                        valueList: a,
                      })
                    }
                  }
                })
              })
            }else{
              clear(1)
              message.error("失败")
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear()
        this.setState({
          visible:false
        })
      }
    }
    const  dataQuick = {
      visible:this.state.visible
    }

    const loop = data =>
      data.map(item => {
        const index = item.name.indexOf(searchValue);
        const beforeStr = item.name.substr(0, index);
        const afterStr = item.name.substr(index + searchValue.length);
        const name =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.name}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.id} title={name} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.id} title={name} dataRef={item}/>;
      });

    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card bodyStyle={{paddingTop:'16px'}} style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div>
              {
                this.state.addStatus?<Button icon="plus" disabled type="primary" >
                  新建
                </Button>:<Popconfirm title={node.id?"是否创建当前项子节点":"新建节点"} onConfirm={() => this.handleModalVisible()}>
                  <Button icon="plus" disabled={this.state.addStatus} type="primary" >
                    新建
                  </Button>
                </Popconfirm>
              }
              <Button style={{marginLeft:'20px'}} disabled={this.state.fastStatus} onClick={() => this.handleFast(true)}>
                快速定义
              </Button>
              <Button style={{marginLeft:'20px'}} disabled={this.state.updateStatus} onClick={() => this.handleUpdate(true)}>
                编辑
              </Button>
              {
                this.state.deleteStatus?<Button disabled style={{marginLeft:'20px'}}  >
                  刪除
                </Button>:<Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleRemove()}>
                  <Button  style={{marginLeft:'20px'}}  >
                    刪除
                  </Button>
                </Popconfirm>
              }
            </div>
            <div style={{marginTop:'20px'}}>
              <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
              {
                this.state.valueList.length?<Tree
                  onSelect={this.onSelect}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  loadData={this.onLoadDataBom}
                >
                  {loop(this.state.valueList)}
                </Tree>:''
              }
            </div>

            <QuickDefinition on={onQuick} data={dataQuick}/>
          </Card>
          <Card title="库位档案" style={{ flex:'1',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <Form {...formItemLayout} layout="vertical"  onSubmit={this.handleSubmit}>
              <Form.Item label="库位编码：">
                {getFieldDecorator('code', {
                  initialValue:node.code?node.code:'',
                  rules: [
                    {
                      required: true,
                      message: '请填写库位编码',
                    },
                  ],
                })(<Input placeholder='请填写库位编码' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="库位名称：">
                {getFieldDecorator('name', {
                  initialValue:node.name?node.name:'',
                  rules: [
                    {
                      required: true,
                      message: '请填写库位名称',
                    },
                  ],
                })(<Input placeholder='请填写库位名称' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item label="上级分类：">
                {getFieldDecorator('pname', {
                  initialValue:node.pname?node.pname:''
                })(<TreeSelect
                  treeDefaultExpandAll
                  onChange={this.onChanged}
                  onFocus={this.onFocusValue}
                  placeholder='上级分类'
                  disabled={isdisabled}>
                  {this.yy(this.state.allvalue)}
                </TreeSelect>)}
              </Form.Item>
              <Form.Item label="保管员">
                {getFieldDecorator('psnId',{
                  initialValue:node.psnName,
                  rules: [{
                    required: true,
                    message:'请选择保管员'
                  }],
                })(<NewTreeTable
                  disabled={isdisabled}
                  on={ons}
                  data={datas}
                />)}
              </Form.Item>
              <Form.Item label="库位容积：">
                {getFieldDecorator('volume', {
                  initialValue:node.volume?node.volume:''
                })(<Input placeholder='库位容积' type={'number'} disabled={isdisabled}/>)}
              </Form.Item> <Form.Item label='是否封存'>
              {getFieldDecorator('seal', {
                initialValue:node.seal,
                valuePropName:"checked"
              })(<Checkbox disabled={isdisabled}/>)}
            </Form.Item>

              <Form.Item label="备注：">
                {getFieldDecorator('memo', {
                  initialValue:node.memo?node.memo:''
                })(<Input placeholder='备注' disabled={isdisabled}/>)}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isdisabled}
                  style={{marginRight:'20px'}}>
                  提交
                </Button>
                <Button
                  disabled={isdisabled}
                  onClick={this.cancled}
                >
                  取消
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default RepositoryFile;

