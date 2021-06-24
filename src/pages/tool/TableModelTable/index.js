/*后台分页的组件   select下拉的table是获取全部数据前台分页*/
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

      selectData:{
        list:[],
        pagination:{
          total:0
        }
      },

      blur:false,

      queryValue:'',

      loading:false,

      index:0
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

      blur:true,

      queryValue:'',

      loading:false

    })
    if (typeof onCancel === 'function') {
      onCancel(onChange)
    }
  }

  filterData = ({value="",pageIndex = 0,pageSize = 10})=>new Promise(resolve => {
    const { data:{ tableConditions = [],tableType },dispatch } = this.props;
    let obj = {
      pageIndex,
      pageSize,
      reqData:{},
      conditions:[]
    }
    if(tableConditions.length){
      obj.conditions = obj.conditions.concat(tableConditions);
    }
    if(value){
      obj.reqData.value = value
    }
    dispatch({
      type: tableType,
      payload: {
        ...obj
      },
      callback: (res) => {
        resolve(res)
      }
    })
  })

  // 点击input弹出
  onIconClick = async () => {
    const { data: { tableType, selectedRowKeys } } = this.state;
    this.setState({
      visible: true,
      selectedRowKeys
    });
    if (tableType) {
      const res = await this.filterData({})
      this.setState({
        tableData:res
      })
    }
  };
  //查询
  onHandleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields( async (err, values) => {
      if (err) return;
      const res = await this.filterData({
        value:values.code
      })
      this.setState({
        tableData:res,
        queryValue:values.code
      })
    })
  }
  //取消查询
  onHandleReset = async () => {
    const { page } = this.state;
    const { form } = this.props;
    form.resetFields("code");
    const res = await this.filterData({pageSize:page.pageSize});
    this.setState({
      tableData:res,
      expandedKeys: [],
      selectedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      page:{
        pageIndex:0,
        pageSize:page.pageSize
      },
      queryValue:''
    })
  }
  //分页
  handleTableChange = async (pagination) => {
    const {  queryValue } = this.state;
    const res = await this.filterData({
      value:queryValue,
      pageIndex:pagination.current - 1,
      pageSize:pagination.pageSize
    })
    this.setState({
      tableData:res,
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

  //input获得焦点时查询数据
  onFocusSelect = async () => {
    const { data: { selectedRowKeys } } = this.state;
    this.setState({
      blur:true,
      selectedRowKeys,
      loading:true
    })
    const res = await this.filterData({pageSize:10000000})
    this.setState({
      tableData:res,
      selectData:res,
      loading:false
    });
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

  filterDataQian = (dataList,value)=>{
    const { data:{ tableConditions = [] } } = this.props;
    let list = JSON.stringify(dataList.list);
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
    if(value){
      list = list.filter((item)=>{
        for(let key in item){
          if(item[key] && item[key].toString().indexOf(value) !== -1){
            return item;
          }
        }
      })
    }
    return {
      list,
      pagination: {
        total: list.length
      },
    };
  }

  onSearchSelect = (value)=>{
    const { blur,tableData } = this.state;
    if(!value && !blur){
      return;
    }
    const res = this.filterDataQian(tableData,value)
    this.setState({
      selectData:res
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

      selectData:{
        list:[],
        pagination:{
          total:0
        }
      },

      queryValue:'',
    })
  }

  //回滚到底部的事件回调
  onFetchTable = async(p,onFetchTable)=>{
    if(typeof onFetchTable === 'function'){
      onFetchTable();
    }
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

    const { data,loading, selectData,tableData, selectedRowKeys, searchValue, expandedKeys, autoExpandParent, selectedKeys } = this.state;

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
      pageSize=30,
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

    if (tableData && tableData.list) {
      tableData.list.map(item => {
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
              return <div style={{padding:12}} onMouseDown={e => {
                e.preventDefault();
              }}>
                <Spin spinning={loading}>
                  <InfinityTable
                    loading={loading}
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
            <Card bordered style={{ height: `${window.innerHeight > 960 ? 760 : window.innerHeight / 1.5}px` }}>
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
                style={{ marginTop: '12px' }}
                loading={tableLoading}
                data={tableData}
                scroll={{ y: window.screen.height >= 900 ? window.innerHeight / 2.5 : window.innerHeight / 3 }}
                columns={columns}
                rowSelection={rowSelection}
                classNameSaveColumns={classNameSaveColumns}
                onChange={(pagination) => this.handleTableChange(pagination)}
              />
            </Card>
          </Modal>
        </div>
      </div>
    );
  }
}

export default index;
