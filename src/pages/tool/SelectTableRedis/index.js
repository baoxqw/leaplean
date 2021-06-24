/*基于redis数据的select table模态框 受控组件*/
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
  Spin, Tooltip,
} from 'antd';
import { getParentKey } from "@/pages/tool/ToTree";
import { toTree } from '@/pages/tool/ToTree';
import InfinityTable from '@/pages/tool/InfinityTable'
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

      tableData:{
        list:[],
        pagination:{
          total:0
        }
      },

      selectData: {
        list:[],
        pagination:{
          total:0
        }
      },

      treeData:[],

      blur:false,

      queryValue:'',

      treeId:null,

      loading:false,
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

      tableData:{
        list:[],
        pagination:{
          total:0
        }
      },

      selectData: {
        list:[],
        pagination:{
          total:0
        }
      },

      treeData:[],

      blur:true,

      queryValue:'',

      treeId:null,

      loading:false

    })
    if (typeof onCancel === 'function') {
      onCancel(onChange)
    }
  }

  filterData = (dataList,value,treeId,pageIndex = 0,pageSize = 10,bool=false)=>{
    const { data:{ tableConditions = [],treeCode } } = this.props;
    let list = JSON.stringify(dataList);
    list = JSON.parse(list);
    if(tableConditions.length){
      list = list.filter((item)=>{
        let arr = [];
        tableConditions.map(it =>{
          if(item[it.code] === it.value){
            arr.push(1);
          }else{
            arr.push(0);
          }
        })
        if(arr.indexOf(0) === -1){
          return item;
        }
      })
    }
    if(treeId){
      list = list.filter((item)=>{
        if(item[treeCode] === treeId){
          return item;
        }
      })
    }
    if(value){
      list = list.filter((item)=>{
        for(let key in item){
          if(item[key] && item[key].toString().indexOf(value) !== -1){
            return item;
          }
        }
      })
    }
    const arr = list.slice(pageIndex * pageSize,pageSize * ( pageIndex + 1))
    return {
      list:bool?list:arr,
      pagination: {
        total: list.length,
        current: pageIndex + 1
      },
    };
  }

  // 点击input弹出
  onIconClick = () => {
    const { data: { treeType, tableType, selectedRowKeys } } = this.state;
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
          const tree = toTree(res1.resData);
          this.setState({
            treeData:tree
          })
          dispatch({
            type: tableType,
            payload: {},
            callback: (res2) => {
              const selectData = this.filterData(res2.list,"",null)
              this.setState({
                selectData,
                tableData:res2
              });
            }
          })
        }
      });
    }
  };
  //点击左侧树查询
  onSelect = (selectedKeys, info) => {
    const { queryValue,tableData } = this.state;
    this.setState({
      info,
      selectedKeys,
    })
    if (info.selectedNodes[0]) {
      const selectData = this.filterData(tableData.list,queryValue,info.selectedNodes[0].props.dataRef.id)
      this.setState({
        treeId:info.selectedNodes[0].props.dataRef.id,
        selectData
      })
    } else {
      const selectData = this.filterData(tableData.list,queryValue,null)
      this.setState({
        treeId:null,
        selectData
      })
    }
  };
  //查询
  onHandleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    const { tableData,treeId } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      const selectData = this.filterData(tableData.list,values.code,treeId)
      this.setState({
        queryValue:values.code,
        selectData
      });
    })
  }
  //取消查询
  onHandleReset = () => {
    const { tableData,page } = this.state;
    const { form } = this.props;
    form.resetFields("code");
    const selectData = this.filterData(tableData.list,"",null,0,page.pageSize)
    this.setState({
      selectData,
      queryValue:'',
      treeId:null,
      expandedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      page:{
        pageIndex:0,
        pageSize:page.pageSize
      }
    })
  }
  //分页
  handleTableChange = (pagination) => {
    const {  tableData,queryValue,treeId } = this.state;
    const selectData = this.filterData(tableData.list,queryValue,treeId,pagination.current - 1,pagination.pageSize)
    this.setState({
      selectData,
      page:{
        pageIndex:pagination.current - 1,
        pageSize:pagination.pageSize
      }
    })
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
  onFocusSelect = () => {
    const { data: { tableType,selectedRowKeys } } = this.state;
    const { dispatch } = this.props;
    this.setState({
      blur:true,
      selectedRowKeys,
      loading:true
    })
    dispatch({
      type: tableType,
      payload: {},
      callback: (res) => {
        const selectData = this.filterData(res.list,"",null,0,10,true)
        this.setState({
          selectData,
          tableData:res,
          loading:false
        });
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
    const { tableData,blur } = this.state;
    if(!value && !blur){
      return;
    }
    const selectData = this.filterData(tableData.list,value,null,0,10,true)
    this.setState({
      selectData
    })
  }

  onBlurSelect =()=>{
    this.setState({
      blur:false,

      tableData:{
        list:[],
        pagination:{
          total:0
        }
      },

      selectData: {
        list:[],
        pagination:{
          total:0
        }
      },

      queryValue:'',
    })
  }

  //回滚到底部的事件回调
  onFetchTable = (onFetchTable)=>{
    if(typeof onFetchTable === 'function'){
      onFetchTable();
    }
  }

  loadMoreContent = () => (
    <div
      style={{
        textAlign: 'center',
        paddingTop: 40,
        paddingBottom: 40,
        border: '1px solid #e8e8e8',
      }}
    >
      <Spin tip="Loading..."/>
    </div>
  );

  render() {
    const {
      form,
      form: { getFieldDecorator },
      disabled = false,
      style,
      on,
      value
    } = this.props;

    const { data,loading, treeData,selectData, selectedRowKeys, searchValue, expandedKeys, autoExpandParent, selectedKeys } = this.state;

    const {
      onOk,
      onCancel,
      onButtonEmpty,
      onGetCheckboxProps,
      onFetchTable,
    } = on;

    let {
      placeholder,
      columns = [],
      title,
      fetchList = [],
      width = "100%",
      classNameSaveColumns,
      zIndex = 1050,
      type = "radio",
      modelWidth = '76%',
      pageSize = 30,
      tableLoading = false
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

    if (selectData && selectData.list) {
      selectData.list.map(item => {
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
            suffixIcon={<Icon type="unordered-list" onClick={() => this.onIconClick()} />}
            style={{ width, ...style }}
            value={value}
            placeholder={placeholder}
            showSearch
            onFocus={()=>this.onFocusSelect()}
            dropdownStyle={{width:'32%'}}
            dropdownMatchSelectWidth={false}
            dropdownRender={(menu )=>{
              return <div style={{overflow: 'auto',padding:12}} onMouseDown={e => {
                e.preventDefault();
              }}>
                <Spin spinning={loading}>
                  <InfinityTable
                    scroll={{
                      y:window.innerHeight/3
                    }}
                    dataSource={selectData.list}
                    columns={columns}
                    rowSelection={rowSelectionSelect}
                    total={selectData.pagination.total}
                    pageSize={pageSize}
                    onFetch={()=>this.onFetchTable(onFetchTable)}
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
            footer={[<Button key={1} onClick={() => this.onButtonEmptyClick(onButtonEmpty)} style={{ float: 'left', display: `${this.state.selectedRowKeys.length ? "inline" : "none"}` }}>清除选中项</Button>,
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
                    onSelect={(selectedKeys, info) => this.onSelect(selectedKeys, info)}
                  >
                    {loop(treeData)}
                  </Tree>
                </div>
              </Card>
              <Card style={{ width: '78%', overflowY: 'auto' }} bordered>
                <Form onSubmit={(e) => this.onHandleSearch(e)} layout="inline">
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
                      <Button style={{ marginLeft: 8 }} onClick={() => this.onHandleReset()}>
                        取消
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <NormalTable
                  style={{ marginTop: '15px' }}
                  loading={tableLoading}
                  scroll={{ y: window.screen.height >= 900 ? window.innerHeight / 2.5 : window.innerHeight / 3 }}
                  data={selectData}
                  columns={columns}
                  classNameSaveColumns={classNameSaveColumns}
                  rowSelection={rowSelection}
                  onChange={(pagination) => this.handleTableChange(pagination)}
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
