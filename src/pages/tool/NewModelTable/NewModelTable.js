/*下拉name的table模态框 受控组件*/
import React, { Fragment, PureComponent } from 'react';
import NormalTable from '@/components/NormalTable';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Icon,
  Row,
  Modal,
  Col
} from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ }) => ({
}))
@Form.create()
class NewModelTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
      conditions: [],
      page: {
        pageIndex: 0,
        pageSize: 10
      },

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
    return {};
  }

  // 同意
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
      conditions: [],
      page: {
        pageIndex: 0,
        pageSize: 10
      },

      selectData: [],

      data: {},

      expandForm: false
    })
    if (typeof onCancel === 'function') {
      onCancel(onChange)
    }
  }
  // 点击input弹出
  onIconClick = (setTableData) => {
    const { data: { selectedRowKeys, tableType, tableConditions = [] } } = this.state;
    if (tableConditions.length) {
      this.setState({
        conditions: tableConditions
      })
    }
    const { dispatch } = this.props;
    this.setState({
      visible: true,
      selectedRowKeys
    });
    if (tableType) {
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
    const { page, data: { tableType }, conditions = [] } = this.state;
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
          selectedKeys: [],
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
    const { data: { tableType }, conditions } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page: obj
    })
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
      pageSize: 10000000
    };
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

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({ expandForm: !expandForm })
  };

  render() {
    const {
      loading,
      form,
      form: { getFieldDecorator },
      on,
      value
    } = this.props;

    const {
      onOk,
      onCancel,
      onButtonEmpty,
      onGetCheckboxProps,
      setTableData,
      onSetSearch
    } = on;

    const { data, selectData, expandForm, selectedRowKeys } = this.state;

    let {
      TableData,
      placeholder,
      columns,
      title,
      fetchList = [],
      disabled = false,
      width = "100%",
      classNameSaveColumns,
      zIndex = 1050,
      type = "radio",
      modelWidth = '76%',
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
        <Select
          suffixIcon={<Icon type="unordered-list" onClick={() => this.onIconClick(setTableData)} />}
          style={{ width }}
          value={value}
          //open={false}
          placeholder={placeholder}
          disabled={disabled}
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
        <div>
          <Modal
            zIndex={zIndex}
            title={title}
            width={modelWidth}
            centered
            destroyOnClose
            visible={this.state.visible}
            onOk={() => this.handleOk(onOk)}
            onCancel={() => this.handleCancel(onCancel)}
            footer={[<Button onClick={() => this.onButtonEmptyClick(onButtonEmpty)} key={1} style={{ float: 'left', display: `${this.state.selectedRowKeys ? this.state.selectedRowKeys[0] ? "inline" : "none" : "none"}` }}>清除选中项</Button>, <Button key={2} onClick={() => this.handleCancel(onCancel)}>取消</Button>, <Button type="primary" key={3} onClick={() => this.handleOk(onOk)}>确定</Button>]}
          >
            <Card bordered style={{ height: `${window.innerHeight > 960 ? 760 : window.innerHeight / 1.5}px` }}>
              <Form onSubmit={(e) => this.onHandleSearch(e, setTableData)} layout="inline">
                {
                  funcQuery(fetchList)
                }
              </Form>
              <NormalTable
                style={{ marginTop: '12px' }}
                loading={tableLoading}
                data={TableData}
                scroll={{ y: window.screen.height >= 900 ? window.innerHeight / 2.5 : window.innerHeight / 3 }}
                columns={columns}
                rowSelection={rowSelection}
                classNameSaveColumns={classNameSaveColumns}
                onChange={(pagination) => this.handleTableChange(pagination, setTableData)}
              />
            </Card>
          </Modal>
        </div>
      </div>
    );
  }
}

export default NewModelTable;
