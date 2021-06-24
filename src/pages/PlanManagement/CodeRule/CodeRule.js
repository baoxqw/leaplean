import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import {
  Row,
  Col,
  Form,
  Input,
  Divider,
  Button,
  Checkbox,
  Card,
  Tree,
  message, Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
import AddSelf from './AddSelf';
import UpdateSelf from './UpdateSelf';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ CR, loading }) => ({
  CR,
  loading: loading.models.CR,
}))
@Form.create()
class CodeRule extends PureComponent {
  state = {
    value: undefined,
    conditions: [],
    isdisabled: true,
    valueList: [],
    allvalue: [],
    dataList: [], //原始数据
    pid: null,
    id: null,
    initData: [],
    addtreeData: null,
    adddata: false,
    addState: false,
    page: {
      pageIndex: 0,
      pageSize: 10,
    },
    pageCount: '',
    total: 0,

    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    treeData: [
      { title: '项目计划', key: '0' },
      { title: '任务管理', key: '1' },
      { title: '生产订单', key: '2' },
    ],
    addVisible: false,
    updateVisible: false,
    record: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'CR/fetch',
      payload: page,
    });

  }

  //新建
  handleBussiness = () => {
    this.setState({
      addVisible: true,
    });
  };

  //删除
  handleDelete = (record) => {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'CR/remove',
      payload: {
        reqData: {
          id: record.id,
        },
      },
      callback: (res) => {
        message.success('删除成功');
        dispatch({
          type: 'CR/fetch',
          payload: {
            conditions: [{
              code: 'NAME',
              exp: '=',
              value: this.state.title,
            }],
            page,
          },
        });
      },
    });
  };

  //选择
  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    const { page } = this.state;
    if (info.selectedNodes[0]) {
      this.setState({
        title: info.selectedNodes[0].props.title,
        addState: true,
      });
      dispatch({
        type: 'CR/fetch',
        payload: {
          conditions: [{
            code: 'NAME',
            exp: '=',
            value: info.selectedNodes[0].props.title,
          }],
          page,
        },
      });
    } else {
      this.setState({
        title: null,
        addState: false,
      });
      dispatch({
        type: 'CR/fetch',
        payload: page,
      });
    }
  };

  onChange = value => {

    this.setState({ value });
  };

  //查询
  handleSearch = (e) => {
    const { form, dispatch } = this.props;
    const { page } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const { name } = values;
      if (name) {
        let conditions = [];

        let nameObj = {};

        if (name) {
          nameObj = {
            code: 'NAME',
            exp: 'like',
            value: name,
          };
          conditions.push(nameObj);
        }
        this.setState({
          conditions,
        });
        const obj = {
          ...page,
          conditions,
        };
        dispatch({
          type: 'CR/fetch',
          payload: obj,
        });
      } else {
        this.setState({
          conditions: [],
        });
        dispatch({
          type: 'CR/fetch',
          payload: {
            pageIndex: 0,
            pageSize: 10,
          },
        });
      }
    });
  };

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page: obj,
    });

    if (conditions.length) {
      let aa = {
        code: 'NAME',
        exp: '=',
        value: this.state.title,
      };
      conditions.push(aa);
      const obj = {
        pageIndex: pagination.current - 1,
        pageSize: pagination.pageSize,
        conditions,
      };
      dispatch({
        type: 'CR/fetch',
        payload: obj,
      });
      return;
    }
    dispatch({
      type: 'CR/fetch',
      payload: obj,
    });
  };

  //编辑
  handleUpdate = (e, record) => {
    e.preventDefault();
    this.setState({
      updateVisible: true,
      record,
    });
  };

  //取消
  handleReset = () => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions: [],
      page: {
        pageIndex: 0,
        pageSize: 10,
      },
    });
    //清空后获取
    if (this.state.title) {
      dispatch({
        type: 'CR/fetch',
        payload: {
          conditions: [{
            code: 'NAME',
            exp: '=',
            value: this.state.title,
          }],
          ...page,
        },
      });
    } else {
      dispatch({
        type: 'CR/fetch',
        payload: page,
      });
    }


  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item}/>;
    });

  onChangeSearch = e => {
    const value = e.target.value;
    const { valueList, dataList } = this.state;
    if (!value) {
      this.setState({ expandedKeys: [] });
      return;
    }
    const expandedKeys = dataList
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, valueList);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    const strExpandedKeys = expandedKeys.map(item => {
      return item + '';
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


  render() {
    const {
      CR: { data },
      form: { getFieldDecorator },
      dispatch,
      loading,
    } = this.props;

    const { searchValue } = this.state;

    const columns = [
      {
        title: '规则名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '前缀',
        dataIndex: 'prefixStr',
        key: 'prefixStr',
      },
      {
        title: '前缀内容',
        dataIndex: 'prefixContent',
        key: 'prefixContent',
      },
      {
        title: '前缀随机位数',
        dataIndex: 'prefixDigits',
        key: 'prefixDigits',
      },
      {
        title: '中间',
        dataIndex: 'middleStr',
        key: 'middleStr',
      },
      {
        title: '中间内容',
        dataIndex: 'middleContent',
        key: 'middleContent',
      },
      {
        title: '中间随机位数',
        dataIndex: 'middleDigits',
        key: 'middleDigits',
      },
      {
        title: '后缀',
        dataIndex: 'suffixStr',
        key: 'suffixStr',
      },
      {
        title: '后缀内容',
        dataIndex: 'suffixContent',
        key: 'suffixContent',
      },
      {
        title: '后缀机位数',
        dataIndex: 'suffixDigits',
        key: 'suffixDigits',
      },
      {
        title: '流水号位数',
        dataIndex: 'suffixSerial',
        key: 'suffixSerial',
      },
      {
        title: '可编辑',
        dataIndex: 'editable',
        key: 'editable',
        render: (text, record) => {
          return <Checkbox checked={text}/>;
        },
      },
      {
        title: '默认',
        dataIndex: 'def',
        key: 'def',
        render: (text, record) => {
          return <Checkbox checked={text}/>;
        },
      },
      {
        title: '操作',
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) =>
          <Fragment>
            <a href="#javascript:;" onClick={(e) => this.handleUpdate(e, record)}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
          </Fragment>,
      },
    ];

    const OnAddSelf = {
      onOk: (obj, clear) => {
  
        dispatch({
          type: 'CR/addself',
          payload: obj,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('新建成功', 1.5, () => {
                clear();
                this.setState({
                  addVisible: false,
                });
                const { page } = this.state;
                if (this.state.title) {
                  dispatch({
                    type: 'CR/fetch',
                    payload: {
                      conditions: [{
                        code: 'NAME',
                        exp: '=',
                        value: this.state.title,
                      }],
                      ...page,
                    },
                  });
                }
              });
            } else {
              message.error('新建失败',2,()=>{
                clear(1)
              });
            }
          },
        });
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          addVisible: false,
        });
      },
    };
    const OnSelfData = {
      visible: this.state.addVisible,
      title: this.state.title,
    };
    const OnUpdateSelf = {
      onOk: (obj, clear) => {
        dispatch({
          type: 'CR/addself',
          payload: obj,
          callback: (res) => {
            if (res.errCode === '0') {
              message.success('编辑成功', 1.5, () => {
                clear();
                this.setState({
                  updateVisible: false,
                  record: {},
                });
                const { page } = this.state;
                if (this.state.title) {
                  dispatch({
                    type: 'CR/fetch',
                    payload: {
                      conditions: [{
                        code: 'NAME',
                        exp: '=',
                        value: this.state.title,
                      }],
                      ...page,
                    },
                  });
                }else{
                  dispatch({
                    type: 'CR/fetch',
                    payload: page,
                  });              
                }
              });
            } else {
              message.error('编辑失败',2,()=>{
                clear(1);
              });
            }
          },
        });

      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateVisible: false,
        });
      },
    };
    const OnUpdateSelfData = {
      visible: this.state.updateVisible,
      record: this.state.record,
    };

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
        <div style={{ display: 'flex' }}>
          <Card
            style={{ width: '25%', marginRight: '3%', boxSizing: 'border-box', overflow: 'hodden' }}
            bordered={false}>
            <div style={{ overflow: 'hidden', float: 'right', marginTop: '3px' }}> {
              this.state.addState ? <Button icon="plus" type="primary" onClick={this.handleBussiness}>
                新建
              </Button> : ''
            }</div>
            <div style={{ overflow: 'hidden', borderBottom: '1px solid #f5f5f5' }}>
              <h3 style={{ height: '50px', lineHeight: '40px', float: 'left' }}>编码规则</h3>
            </div>
            <div>

              {/* <Tree
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={this.onSelect}
              >
                {loop(this.state.valueList)}
              </Tree> */}
              <Tree
                onSelect={this.onSelect}
                treeData={this.state.treeData}/>
            </div>

          </Card>
          <Card
            style={{ width: '70%', boxSizing: 'border-box', overflow: 'hodden' }}
            bordered={false}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ xs: 24, sm: 24, md: 24 }}>
                <Col md={24} sm={24}>
                  <FormItem label='规则名称'>
                    {getFieldDecorator('name')(<Input placeholder='规则名称'/>)}
                  </FormItem>

                  <span style={{ display: 'inline-block', margin: '3px 0 15px 0' }}>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                        <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                            取消
                                        </Button>
                                    </span>
                </Col>
              </Row>
            </Form>
            <NormalTable
              style={{ marginTop: '8px' }}
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />

          </Card>
          <AddSelf on={OnAddSelf} data={OnSelfData}/>
          <UpdateSelf on={OnUpdateSelf} data={OnUpdateSelfData}/>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CodeRule;

