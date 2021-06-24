import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Icon,
  Row,
  Tree,
  Modal,
  Col,
  Spin
} from 'antd';
import { getParentKey } from "@/pages/tool/ToTree";

const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ }) => ({
}))
@Form.create()
class index extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],

      expandedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      info: {},

      page: {
        pageSize: 10,
        pageIndex: 0
      },

      data: {},

      selectData: {
        list:[]
      },

      blur:true,

      queryValue:'',

      conditions:[],

      loading:false
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const { data } = nextProps;
    if (data !== preState.data) {
      return {
        data
      };
    }
    return null;
  }

  //同意
  handleOk = (onOk) => {
    const { selectedRowKeys, selectedRows } = this.state;
    const { onChange } = this.props;
    if (!selectedRows.length) {
      this.setState({
        visible: false,
      });
      return
    }
    if (typeof onOk === 'function') {
      onOk(selectedRowKeys, selectedRows, onChange);
      this.handleCancel()
    }
  };
  // 取消
  handleCancel = (onCancel) => {
    const { form, onChange } = this.props;
    form.resetFields();
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],

      expandedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,

      info: {},

      page: {
        pageSize: 10,
        pageIndex: 0
      },

      data: {},

      selectData: {
        list:[]
      },

      blur:true,

      queryValue:'',

      conditions:[]

    })
    if (typeof onCancel === 'function') {
      onCancel(onChange)
    }
  }

  // 点击input弹出
  onIconClick = (setTreeData, setTableData) => {
    const { data: { treeType, tableType, selectedRowKeys, tableConditions = [] } } = this.state;
    this.setState({
      visible: true,
      selectedRowKeys
    });
    if (treeType && tableType) {
      const { dispatch } = this.props;
      dispatch({
        type: treeType,
        payload: {
          reqData: {},
          pageIndex: 0,
          pageSize: 1000000
        },
        callback: (res1) => {
          if (typeof setTreeData === 'function') {
            setTreeData(res1);
          }
          let obj = {
            pageIndex: 0,
            pageSize: 10,
          }
          if (tableConditions.length) {
            obj.conditions = tableConditions
          }
          dispatch({
            type: tableType,
            payload: {
              ...obj
            },
            callback: (res2) => {
              if (typeof setTableData === 'function') {
                setTableData(res2);
              }
            }
          })
        }
      });
    }
  };
  //点击左侧树查询
  onSelect = (selectedKeys, info, setTableData) => {
    const { data: { tableType,tableConditions=[],treeCode="" },queryValue } = this.state;
    const { dispatch } = this.props;
    this.setState({
      info,
      selectedKeys
    })
    if (info.selectedNodes[0]) {
      let conditions = [{
        code:treeCode,
        exp:"=",
        value:info.selectedNodes[0].props.dataRef.id
      }];
      if (tableConditions.length) {
        conditions = conditions.concat(tableConditions)
      }
      let payload = {
        pageIndex: 0,
        pageSize: 10,
        conditions,
        reqData:{
          value:queryValue
        }
      };
      dispatch({
        type: tableType,
        payload,
        callback: (res) => {
          this.setState({
            conditions
          })
          if (typeof setTableData === 'function') {
            setTableData(res);
          }
        }
      })
    } else {
      this.setState({
        conditions: []
      })
      let payload = {
        pageIndex: 0,
        pageSize: 10,
        reqData:{
          value:queryValue
        }
      };
      if (tableConditions.length) {
        payload.conditions = tableConditions;
      }
      dispatch({
        type: tableType,
        payload,
        callback: (res) => {
          if (typeof setTableData === 'function') {
            setTableData(res);
          }
        }
      })
    }
  };
  //查询
  onHandleSearch = (e, setTableData) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    let { page, data: { tableType,tableConditions=[] }, conditions = [] } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      let payload = {
        reqData:{
          value:values.code
        },
        ...page
      };
      if(tableConditions.length){
        conditions = conditions.concat(tableConditions);
      }
      if(conditions.length){
        payload.conditions = conditions;
      }
      this.setState({
        queryValue:values.code
      });
      dispatch({
        type: tableType,
        payload,
        callback: (res) => {
          if (typeof setTableData === 'function') {
            setTableData(res);
          }
        }
      })
    })
  }
  //取消查询
  onHandleReset = (setTableData) => {
    const { form, dispatch } = this.props;
    const { data: { tableType, tableConditions = [] } } = this.state;
    let obj = {
      reqData:{
        value:''
      },
      pageIndex: 0,
      pageSize: 10,
    }
    if (tableConditions.length) {
      obj.conditions = tableConditions
    }
    dispatch({
      type: tableType,
      payload: {
        ...obj
      },
      callback: (res) => {
        form.resetFields();
        this.setState({
          page: {
            pageSize: 10,
            pageIndex: 0
          },
          treeId: null,
          selectedKeys: [],
          expandedKeys: [],
          queryValue:'',
          conditions:[]
        })
        if (typeof setTableData === 'function') {
          setTableData(res)
        }
      }
    })
  }
  //分页
  handleTableChange = (pagination, setTableData) => {
    const { dispatch } = this.props;
    let {  data: { tableType,tableConditions=[] }, queryValue,conditions } = this.state;
    const obj = {
      reqData:{
        value:queryValue
      },
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page: {
        pageIndex: pagination.current - 1,
        pageSize: pagination.pageSize,
      }
    })
    if (tableConditions.length) {
      conditions = conditions.concat(tableConditions);
    }
    if(conditions.length){
      obj.conditions = conditions
    }
    dispatch({
      type: tableType,
      payload: {
        ...obj,
      },
      callback: (res) => {
        if (typeof setTableData === 'function') {
          setTableData(res);
        }
      }
    });
  }
  //清空选中项
  onButtonEmptyClick = (onButtonEmpty) => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    const { onChange } = this.props;
    if (typeof onButtonEmpty === 'function') {
      onButtonEmpty(onChange);
    }
  }

  //input获得焦点时查询全部数据
  onFocusSelect = (setTableData) => {
    const { data: { tableType, tableConditions = [],selectedRowKeys } } = this.state;
    const { dispatch } = this.props;
    this.setState({
      blur:true,
      selectedRowKeys,
      loading:true
    })
    let obj = {
      pageIndex: 0,
      pageSize: 10000000,
    }
    if (tableConditions.length) {
      obj.conditions = tableConditions
    }
    dispatch({
      type: tableType,
      payload: {
        reqData:{
          value:''
        },
        pageIndex:0,
        pageSize:1000000
      },
      callback: (res) => {
        this.setState({
          selectData:res,
          loading:false
        });
        if(typeof setTableData === 'function'){
          setTableData(res)
        }
      }
    })
  }

  onChangeSearch = e => {
    const value = e.target.value;
    const { data: { TreeData } } = this.props;
    if (!value) {
      this.setState({ expandedKeys: [] })
      return
    }
    const expandedKeys = TreeData
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, TreeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    const strExpandedKeys = expandedKeys.map(item => {
      return item + ''
    });
    this.setState({
      expandedKeys: strExpandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode defaultExpandAll title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  onSelectChangeTo = (selectedRowKeys, selectedRows) => {
    const { onChange,on:{onOk} } = this.props;
    if (typeof onOk === 'function') {
      this.setState({
        selectedRowKeys,
        selectedRows
      })
      onOk(selectedRowKeys, selectedRows, onChange);
    }
  };

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({ expandForm: !expandForm })
  };

  onSearchSelect = (value)=>{
    const { data:{ TableData },blur } = this.state;
    if(!value && !blur){
      return;
    }
    const dataList = TableData.list.filter((item)=>{
      for(let key in item){
        if(item[key] && item[key].toString().indexOf(value) !== -1){
          return item;
        }
      }
    })
    this.setState({
      selectData:{
        list:dataList
      }
    })
  }

  onBlurSelect=()=>{
    this.setState({
      blur:false
    })
  }

  render() {
    const {
      form,
      form: { getFieldDecorator },
      disabled = false,
      style,
      on,
      value
    } = this.props;

    const { data,loading, selectData, selectedRowKeys, searchValue, expandedKeys, autoExpandParent, selectedKeys } = this.state;

    const {
      onOk,
      onCancel,
      onButtonEmpty,
      onGetCheckboxProps,
      setTableData,
      setTreeData,
    } = on;

    let {
      TreeData = [],
      TableData = [],
      placeholder,
      columns = [],
      title,
      fetchList = [],
      width = "100%",
      classNameSaveColumns,
      zIndex = 1050,
      type = "radio",
      modelWidth = '76%',
      search = 'name'
    } = data;

    const rowSelectionSelect = {
      selectedRowKeys,
      onChange: this.onSelectChangeTo,
      type,
      getCheckboxProps: record => {
        if (typeof onGetCheckboxProps === 'function') {
          return onGetCheckboxProps(record)
        }
      }
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      type,
      getCheckboxProps: record => {
        if (typeof onGetCheckboxProps === 'function') {
          return onGetCheckboxProps(record)
        }
      }
    };

    if (TableData && TableData.list) {
      TableData.list.map(item => {
        item.key = item.id;
        return item
      })
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
        return <TreeNode key={item.id} title={name} dataRef={item} />;
      });

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }} >
          <Select
            disabled={disabled}
            suffixIcon={<Icon type="unordered-list" onClick={() => this.onIconClick(setTreeData, setTableData)} />}
            style={{ width, ...style }}
            value={value}
            placeholder={placeholder}
            showSearch
            onFocus={()=>this.onFocusSelect(setTableData)}
            dropdownStyle={{width:'32%'}}
            dropdownMatchSelectWidth={false}
            dropdownRender={(menu )=>{
              return <div style={{overflow: 'auto',padding:12}} onMouseDown={e => {
                e.preventDefault();
              }}>
                <Spin spinning={loading}>
                  <NormalTable
                    loading={loading}
                    scroll={{ y: window.innerHeight / 3 }}
                    data={selectData}
                    columns={columns}
                    rowSelection={rowSelectionSelect}
                    pagination={false}
                  />
                </Spin>
              </div>
            }}
            onSearch={(value)=>this.onSearchSelect(value)}
            onBlur={this.onBlurSelect}
          >
          </Select>
        </div>
        <div>
          <Modal
            zIndex={zIndex}
            title={title}
            destroyOnClose
            visible={this.state.visible}
            centered
            width={modelWidth}
            onOk={() => this.handleOk(onOk)}
            onCancel={() => this.handleCancel(onCancel)}
            footer={[<Button key={1} onClick={() => this.onButtonEmptyClick(onButtonEmpty)} style={{ float: 'left', display: `${this.state.selectedRowKeys[0] ? "inline" : "none"}` }}>清除选中项</Button>,
              <Button key={2} onClick={() => this.handleCancel(onCancel)}>取消</Button>,
              <Button type="primary" key={3} onClick={() => this.handleOk(onOk)}>确定</Button>]}
          >
            <div style={{ display: 'flex', height: `${window.innerHeight > 960 ? 760 : window.innerHeight / 1.5}px` }}>
              <Card style={{ width: '22%', overflow: 'auto' }} bordered>
                <div >
                  <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
                  <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                    autoExpandParent={autoExpandParent}
                    onSelect={(selectedKeys, info) => this.onSelect(selectedKeys, info, setTableData)}
                  >
                    {loop(TreeData)}
                  </Tree>
                </div>
              </Card>
              <Card style={{ width: '78%', overflowY: 'auto' }} bordered>
                <Form onSubmit={(e) => this.onHandleSearch(e, setTableData)} layout="inline">
                  <Row gutter={16}>
                    {
                      fetchList.map((item, index) => {
                        return (<Col md={14} sm={16} key={index}>
                          <FormItem label={item.label}>
                            {getFieldDecorator(item.code)(item.type ? item.type(form) : <Input placeholder={item.placeholder} />)}
                          </FormItem>
                        </Col>)
                      })
                    }
                    <Col md={10} sm={16} style={{ marginTop: 4 }}>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button style={{ marginLeft: 8 }} onClick={() => this.onHandleReset(setTableData)}>
                        取消
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <NormalTable
                  style={{ marginTop: '15px' }}
                  loading={loading}
                  scroll={{ y: window.screen.height >= 900 ? window.innerHeight / 2.5 : window.innerHeight / 3 }}
                  data={TableData}
                  columns={columns}
                  classNameSaveColumns={classNameSaveColumns}
                  rowSelection={rowSelection}
                  onChange={(pagination) => this.handleTableChange(pagination, setTableData)}
                />
              </Card>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default index;
