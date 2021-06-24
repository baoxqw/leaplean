/*下拉name的select table模态框 受控组件*/
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
  message
} from 'antd';
import { getParentKey } from "@/pages/tool/ToTree";
const { Option } = Select;
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ }) => ({
}))
@Form.create()
class NewTreeTable extends PureComponent {
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

      conditions: [],

      treeId: null,

      data: {},

      selectData: [],

      expandForm: false
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

      conditions: [],

      treeId: null,

      data: {},

      selectData: [],

      expandForm: false,

    })
    if (typeof onCancel === 'function') {
      onCancel(onChange)
    }
  }

  // 点击input弹出
  onIconClick = (setTreeData, setTableData) => {
    const { data: { treeType, tableType, selectedRowKeys, tableConditions = [] } } = this.state;
    if (tableConditions.length) {
      this.setState({
        conditions: tableConditions
      })
    }
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
    const { data: { tableType }, conditions } = this.state;
    const { dispatch } = this.props;
    this.setState({
      info,
      selectedKeys
    })
    if (info.selectedNodes[0]) {
      this.setState({
        treeId: info.selectedNodes[0].props.dataRef.id
      });
      let payload = {
        pageIndex: 0,
        pageSize: 10,
        id: info.selectedNodes[0].props.dataRef.id
      };
      if (conditions.length) {
        payload.conditions = conditions;
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
    } else {
      this.setState({
        treeId: null
      })
      let payload = {
        pageIndex: 0,
        pageSize: 10,
      };
      if (conditions.length) {
        payload.conditions = conditions;
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
    const { page, data: { tableType }, treeId, conditions = [] } = this.state;
    form.validateFields((err, values) => {
      if (err) return;
      for (let key in values) {
        if (values[key]) {
          conditions.push({
            code: key,
            exp: 'like',
            value: values[key]
          })
        }
      }

      this.setState({
        conditions: [...conditions]
      });
      let payload = {
        conditions,
        ...page
      };
      if (treeId) {
        payload.id = treeId
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
    })
  }
  //取消查询
  onHandleReset = (setTableData) => {
    const { form, dispatch } = this.props;
    const { data: { tableType, tableConditions = [] } } = this.state;
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
      callback: (res) => {
        form.resetFields();
        this.setState({
          page: {
            pageSize: 10,
            pageIndex: 0
          },
          conditions: tableConditions,
          treeId: null,
          selectedKeys: [],
          expandedKeys: [],
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
    const { treeId, data: { tableType }, conditions } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page: {
        pageIndex: pagination.current - 1,
        pageSize: pagination.pageSize,
      }
    })
    if (treeId) {
      obj.id = treeId;
    }
    if (conditions.length) {
      dispatch({
        type: tableType,
        payload: {
          conditions,
          ...obj,
        },
        callback: (res) => {
          if (typeof setTableData === 'function') {
            setTableData(res);
          }
        }
      });
      return
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
  onFocusSelect = () => {
    const { data: { tableType, tableConditions = [] } } = this.state;
    const { dispatch } = this.props;
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
        ...obj
      },
      callback: (res) => {
        if (res && res.list) {
          this.setState({
            selectData: res.list
          })
        } else {
          this.setState({
            selectData: []
          })
        }
      }
    })
  }

  onSelectInput = (value, option, onSetSearch) => {
    const { data: { search = 'name' } } = this.state;
    const { props: { item } } = option;
    const { onChange } = this.props;
    if (typeof onSetSearch === 'function') {
      onSetSearch(Number(value), item[search], onChange, item)
    }
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

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({ expandForm: !expandForm })
  };

  render() {
    const {
      form,
      form: { getFieldDecorator },
      loading,
      disabled = false,
      style,
      on,
      value
    } = this.props;

    const { data, selectData, expandForm, selectedRowKeys, searchValue, expandedKeys, autoExpandParent, selectedKeys } = this.state;

    const {
      onOk,
      onCancel,
      onButtonEmpty,
      onGetCheckboxProps,
      setTableData,
      setTreeData,
      onSetSearch
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
      modelWidth = '81%',
      search = 'name',
      tableLoading = false
    } = data;

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

    const children = (data) => {
      if (!data || !data.length) {
        return;
      }
      return data.map((item) => {
        return <Option key={item.id} item={item}>{item[search]}</Option>
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

    const funcQuery = (fetchList = []) => {
      if (!fetchList.length) {
        return
      }

      const arr = [];
      fetchList.map((item, index) => {
        arr.push(<Col md={8} sm={16} key={index}>
          <FormItem label={item.label}>
            {getFieldDecorator(item.code)(item.type ? item.type(form) : <Input placeholder={item.placeholder} />)}
          </FormItem>
        </Col>)
      })
      const c = <Col key={arr.length + 1} md={8} sm={16} style={{ marginTop: 4 }}>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={() => this.onHandleReset(setTableData)}>
          取消
        </Button>
        {
          arr.length >= 3 ? expandForm ? <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            收起
            <Icon type="up" />
          </a> : <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开
            <Icon type="down" />
            </a> : null
        }
      </Col>
      if (arr.length <= 2) {
        arr.push(c)
      } else {
        arr.splice(2, 0, c)
      }
      const group = [];
      for (let i = 0; i < arr.length; i += 3) {
        group.push(arr.slice(i, i + 3));
      }
      return group.map((item, index) => {
        if (expandForm) {
          return <Row key={index} gutter={{ md: 8, lg: 24, xl: 48 }}>
            {
              item.map(it => {
                return it
              })
            }
          </Row>
        } else {
          if (index === 0) {
            return <Row key={index} gutter={{ md: 8, lg: 24, xl: 48 }}>
              {
                item.map(it => {
                  return it
                })
              }
            </Row>
          }
        }
      })
    }

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            disabled={disabled}
            suffixIcon={<Icon type="unordered-list" onClick={() => this.onIconClick(setTreeData, setTableData)} />}
            style={{ width, ...style }}
            value={value}
            //open={false}
            placeholder={placeholder}
            showSearch
            onFocus={this.onFocusSelect}
            onSelect={(value, option) => this.onSelectInput(value, option, onSetSearch)}
            filterOption={(inputValue, option) => {
              const { props: { item } } = option;
              if (item[search] && typeof item[search] === 'string') {
                return item[search].indexOf(inputValue) !== -1
              } else {
                return false
              }
            }}
          >
            {selectData && selectData.length ? children(selectData) : []}
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
                    onSelect={(selectedKeys, info) => this.onSelect(selectedKeys, info, setTableData)}
                  >
                    {loop(TreeData)}
                  </Tree>
                </div>
              </Card>
              <Card style={{ width: '78%', overflowY: expandForm ? 'scroll' : 'hidden', overflowX: 'hidden' }} bordered>
                <Form onSubmit={(e) => this.onHandleSearch(e, setTableData)} layout="inline">
                  {
                    funcQuery(fetchList)
                  }
                </Form>
                <NormalTable
                  style={{ marginTop: '15px' }}
                  loading={tableLoading}
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

export default NewTreeTable;
