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
    Card,
    Spin,
    Tree,
    message, Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getParentKey, toTree, toTreeMaterial } from '@/pages/tool/ToTree';
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;
@connect(({ PE, loading }) => ({
    PE,
    loading: loading.models.PE,
    loadingRight: loading.effects['PE/findRight'] || loading.effects['PE/findRightPlan'] || loading.effects['PE/findRightTask'] || loading.effects['PE/findRightAll']
}))
@Form.create()
class ProjectExecu extends PureComponent {
    state = {
        value: undefined,
        conditions: [],
        treeData: '',
        isdisabled: true,
        valueList: [],
        allvalue: [],
        dataList: [], //原始数据1
        pid: null,
        id: null,
        initData: [],
        addtreeData: null,
        adddata: false,
        addState: false,
        page: {},
        pageCount: '',
        total: 0,

        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        selectedKeys: [],
        spinStatus: true,
        selectedRows: {},
        dataRight: [],


    }
    columns = [
        {
            title: '项目计划编号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '任务编号',
            dataIndex: 'taskCode',
            key: 'taskCode'
        },
        {
            title: '物料编码',
            dataIndex: 'materialCode',
            key: 'materialCode',
        },
        {
            title: '物料名称',
            dataIndex: 'materialName',
            key: 'materialName',
        },
        {
            title: '生产数量',
            dataIndex: 'netDemandNum',
            key: 'netDemandNum',

        },
        {
            title: '图号',
            dataIndex: 'graphid',
            key: 'graphid',
        },
        {
            title: '计划开始日期',
            dataIndex: 'planStartDate',
            key: 'planStartDate',
        },
        {
            title: '计划完成日期',
            dataIndex: 'planEndDate',
            key: 'planEndDate',
        },
        {
            title: '项目状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '任务类型',
            dataIndex: 'taskType',
            key: 'taskType',

        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            render: (text, record) =>
                <Fragment>
                    <a href="#javascript:;" onClick={(e) => this.handleUpdate(e, record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
                        <a href="#javascript:;">删除</a>
                    </Popconfirm>
                </Fragment>
        },
    ];

    componentDidMount() {
        const { dispatch } = this.props;
        //  树的数据
        dispatch({
            type: 'PE/tree',
            payload: {},
            callback: (res) => {
                if (res) {
                    const a = toTree(res)
                    this.setState({
                        dataList: res,
                        valueList: a,
                        allvalue: a
                    })
                }
                this.setState({
                    spinStatus: false
                })
            }
        })
        //  表格的数据
        const object = {
            pageIndex: 0,
            pageSize: 10000000,
        }
        dispatch({
            type: 'PE/findRightAll',
            payload: {
                ...object,
                conditions: [{
                    code: 'MERGE_ID',
                    exp: '=',
                    value: 0,
                }],
            },
            callback: (res) => {
                this.setState({
                    dataRight: res
                })
            }
        });
    }
    //删除
    handleDelete = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'businessadmin/remove',
            payload: {
                reqData: {
                    id: record.id
                }
            },
            callback: (res) => {
                message.success('删除成功')
                const obj = {
                    pageIndex: 0,
                    pageSize: 10,
                    id: this.state.id
                }
                dispatch({
                    type: 'businessadmin/fetch',
                    payload: obj
                })
            }
        })
    };

    handleBussiness = () => {
        router.push({ pathname: '/platform/basicdata/businessadmin/businessnew', query: { addid: this.state.id, title: this.state.title } })
    };


    onChange = value => {

        this.setState({ value });
    };
    //查询
    handleSearch = (e) => {
        const { PE: { data }, form } = this.props;
        console.log('data', data)
        const value = form.getFieldValue("code");
        const arr = JSON.parse(JSON.stringify(data))
        const list = arr.filter((item) => {
            for (let key in item) {
                if (item[key] && item[key].toString().indexOf(value) !== -1) {
                    return item;
                }
            }
        })
        this.setState({
            dataRight: list
        })
    };
    //分页
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { conditions } = this.state;
        const obj = {
            pageIndex: pagination.current - 1,
            pageSize: pagination.pageSize,
            id: this.state.id
        };
        this.setState({
            page: obj
        })
        if (conditions.length) {
            const obj = {
                pageIndex: pagination.current - 1,
                pageSize: pagination.pageSize,
                conditions
            };
            dispatch({
                type: 'businessadmin/fetch',
                payload: obj,
            });
            return
        }
        dispatch({
            type: 'businessadmin/fetch',
            payload: obj
        })
    };
    //编辑
    handleUpdate = (e, record) => {
        e.preventDefault();
        router.push('/platform/basicdata/businessadmin/businessupdate', record)
    }
    //取消
    handleReset = () => {
        const { dispatch, form, PE: { data } } = this.props;
        //清空输入框
        form.resetFields();
        const arr = JSON.parse(JSON.stringify(data))
        this.setState({
            dataRight: arr
        })
    };

    onChangeSearch = e => {
        const value = e.target.value;
        const { valueList, dataList } = this.state;
        if (!value) {
            this.setState({ expandedKeys: [] })
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
    //树
    onLoadData = treeNode =>
        new Promise(resolve => {
            console.log("treeNode", treeNode)
            if (treeNode.props.children) {
                resolve();
                return;
            }
            const { dispatch } = this.props;
            const { productNoticeId, queryType, materialId, id, productId } = treeNode.props.dataRef;
            if (queryType) {
                console.log("queryType", queryType)
                switch (queryType) {
                    case '来源':
                        dispatch({
                            type: 'PE/findChild',
                            payload: {
                                reqData: {
                                  productNoticeId
                                }
                            },
                            callback: (res) => {
                                if (res.length) {
                                    treeNode.props.dataRef.children = res;
                                    resolve();
                                } else {
                                    resolve();
                                }
                            }
                        })
                        break;
                    case '计划':
                        dispatch({
                            type: 'PE/TaskCode',
                            payload: {
                                reqData: {
                                    materialId,
                                    planId: id,
                                    productId
                                }
                            },
                            callback: (res) => {
                                if (res.length) {
                                    const data = toTreeMaterial(res)
                                    console.log("data", data)
                                    treeNode.props.dataRef.children = data;
                                    resolve();
                                } else {
                                    resolve();
                                }
                            }
                        })
                        break;
                    case '任务':
                        resolve();
                        break;

                }
            }
        });

    onSelect = (selectedKeys, info) => {
        const { dispatch } = this.props;
        this.setState({
            selectedKeys,
        })
        if (info.selectedNodes[0]) {
            const { productNoticeId, queryType, id, materialId, productId, planId } = info.selectedNodes[0].props.dataRef;
            if (queryType) {
                switch (queryType) {
                    case '来源':
                        dispatch({
                            type: 'PE/findRight',
                            payload: {
                                reqData: {
                                  productNoticeId
                                }
                            },
                            callback: (res) => {
                                this.setState({
                                    dataRight: res
                                })
                            }
                        });
                        break;
                    case '计划':
                        dispatch({
                            type: 'PE/findRightPlan',
                            payload: {
                                reqData: {
                                    planId: id
                                }
                            },
                            callback: (res) => {
                                this.setState({
                                    dataRight: res
                                })
                            }
                        });
                        break;
                    case '任务':
                        dispatch({
                            type: 'PE/findRightTask',
                            payload: {
                                reqData: {
                                    materialId,
                                    planId,
                                    productId
                                }
                            },
                            callback: (res) => {
                                this.setState({
                                    dataRight: res
                                })
                            }
                        });
                        break;
                }
            }
        } else {
            const object = {
                pageIndex: 0,
                pageSize: 10000000,
            }
            dispatch({
                type: 'PE/findRightAll',
                payload: {
                    ...object,
                    conditions: [{
                        code: 'MERGE_ID',
                        exp: '=',
                        value: 0,
                    }],
                },
                callback: (res) => {
                    this.setState({
                        dataRight: res
                    })
                }
            });
        }
    };

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={item.newCode} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={item.newCode} dataRef={item} />;
        });

    render() {
        const {
            PE: { data },
            form: { getFieldDecorator },
            loading,
            loadingRight
        } = this.props;
        const { searchValue, spinStatus, dataRight, expandedKeys, autoExpandParent, selectedKeys, valueList } = this.state;
        console.log('dataRight', dataRight)
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
            <PageHeaderWrapper>
                <div style={{ display: 'flex' }}>
                    <Card title='项目执行情况查询'
                        style={{ width: '30.5%', marginRight: '1.5%', boxSizing: 'border-box', overflow: 'hodden' }}
                        bordered={false}>
                        <div style={{ overflow: 'hidden', float: 'right', marginTop: '3px' }}> {
                            this.state.addState ? <Button icon="plus" type="primary" onClick={this.handleBussiness}>
                                新建
              </Button> : ''
                        }</div>
                        {
                            spinStatus ? <Spin style={{ width: '100%', textAlign: 'center', lineHeight: "100px" }} /> : <div >
                                {/* <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} /> */}
                                <Tree
                                    loadData={this.onLoadData}
                                    onSelect={this.onSelect}
                                    selectedKeys={selectedKeys}
                                >
                                    {this.renderTreeNodes(valueList)}
                                </Tree>
                            </div>
                        }


                    </Card>
                    <Card
                        style={{ width: '68%', boxSizing: 'border-box', overflow: 'hodden' }}
                        bordered={false}>
                        <Form layout="inline">
                            <Row gutter={{ xs: 24, sm: 24, md: 24 }}>
                                <Col md={24} sm={24}>
                                    <FormItem label='综合查询'>
                                        {getFieldDecorator('code')(<Input placeholder='请输入条件' />)}
                                    </FormItem>
                                    <span style={{ display: 'inline-block', margin: '3px 0 15px 0', }}>
                                        <Button type="primary" onClick={this.handleSearch}>
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
                            style={{ marginTop: '9px' }}
                            loading={loadingRight}
                            dataSource={dataRight}
                            columns={this.columns}
                            onChange={this.handleStandardTableChange}
                            pagination={false}
                        />
                        <div style={{ textAlign: 'right', padding: 12 }}>
                            <span style={{ fontSize: 14, position: 'relative', bottom: -5 }}>共 <span style={{ fontWeight: 'bold' }}>{dataRight.length}</span> 条</span>
                        </div>

                    </Card>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default ProjectExecu;

