import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import {
    Row,
    Col,
    Form,
    Input,
    DatePicker,
    Divider,
    Button,
    Card,
    Tree,
    Checkbox,
    message,
    Popconfirm,
} from 'antd';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getParentKey, toTree } from '@/pages/tool/ToTree';
const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ PL, loading }) => ({
    PL,
    loading: loading.models.PL,
}))
@Form.create()
class ProgressLook extends PureComponent {
    state = {
        value: undefined,
        conditions: [],
        treeData: '',
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
        page: {},
        pageCount: '',
        total: 0,

        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
    }

    columns = [
        {
            title: '计划编号',
            dataIndex: 'code',
        },
        {
            title: '计划名称',
            dataIndex: 'name',
        },
        {
            title: '来源单据号',
            dataIndex: 'traceability',
        },
        {
            title: '工作令',
            dataIndex: 'workName',
        },
        {
            title: '状态',
            dataIndex: 'status',

        },
       
        {
            title: '是否完成',
            dataIndex: 'isOver',
            render: ((text, record) => {
                if (text) {
                    return <Checkbox checked={text} />
                } else {
                    return <Checkbox checked={text} />
                }
            })
        },

        {
            title: '计划开始日期',
            dataIndex: 'planStartDate',
        },
        {
            title: '计划完成日期',
            dataIndex: 'planEndDate',
        },
        {
            title: '下达人',
            dataIndex: 'releaseName',
        },
        {
            title: '下达日期',
            dataIndex: 'releaseDate',
        },
        {
            title: '操作',
            dataIndex: 'caozuo',
            width:'100'
        }
        // {
        //     title: '操作',
        //     dataIndex: 'caozuo',
        //     fixed: 'right',
        //     render: (text, record) => {
        //         return <Fragment>
        //             <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
        //                 <a href="#javascript:;">删除</a>
        //             </Popconfirm>
        //             <Divider type="vertical" />
        //             <a href="#javascript:;" onClick={(e) => this.updataRoute(record)}>编辑</a>
        //         </Fragment>
        //     }
        // },
    ];

    //删除
    handleDelete = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'WO/remove',
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
                    type: 'WO/fetch',
                    payload: obj
                })
            }
        })
    };

    onSelect = (selectedKeys, info) => {

        const { dispatch } = this.props;
        if (info.selectedNodes[0]) {
            this.setState({
                id: info.selectedNodes[0].props.dataRef.id,
                title: info.selectedNodes[0].props.dataRef.name,
                addState: true
            })
            const obj = {
                pageIndex: 0,
                pageSize: 10,
                id: info.selectedNodes[0].props.dataRef.id
            }
            dispatch({
                type: 'WO/fetch',
                payload: obj
            })
        } else {
            const objtt = {
                pageIndex: 0,
                pageSize: 10,
            }
            dispatch({
                type: 'WO/fetch',
                payload: objtt
            })
            this.setState({
                id: null,
                addState: false
            })

        }

    };

    handleBussiness = () => {
        router.push({ pathname: '/platform/industry/workorder/add', query: { addid: this.state.id, title: this.state.title } })
    };

    componentDidMount() {
        const { dispatch } = this.props;
        //  树的数据
        dispatch({
            type: 'PL/tree',
            payload: {},
            callback: (res) => {
                console.log('---res树', res)
                if (res) {
                    const a = toTree(res)
                    this.setState({
                        dataList: res,
                        valueList: a,
                        allvalue: a
                    })
                }
            }
        })
        //  表格的数据
        const object = {
            pageIndex: 0,
            pageSize: 10,
        }
        dispatch({
            type: 'PL/fetchTable',
            payload: object
        })
    }

    onChange = value => {
        this.setState({ value });
    };
    //查询
    handleSearch = (e) => {
        const { form, dispatch } = this.props
        e.preventDefault();
        form.validateFieldsAndScroll(async (err, values) => {
            const { code, name } = values;
            if (code || name) {
                let conditions = [];
                let codeObj = {};
                let nameObj = {};

                if (code) {
                    codeObj = {
                        code: 'code',
                        exp: 'like',
                        value: code
                    };
                    await conditions.push(codeObj)
                }
                if (name) {
                    nameObj = {
                        code: 'name',
                        exp: 'like',
                        value: name
                    };
                    await conditions.push(nameObj)
                }
                this.setState({
                    conditions
                })
                const obj = {
                    pageIndex: 0,
                    pageSize: 10,
                    conditions,
                };
                dispatch({
                    type: 'PL/fetchTable',
                    payload: obj
                })
            } else {
                this.setState({
                    conditions: []
                })
                dispatch({
                    type: 'PL/fetchTable',
                    payload: {
                        pageIndex: 0,
                        pageSize: 10,
                    }
                })
            }
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
                type: 'WO/fetch',
                payload: obj,
            });
            return
        }
        dispatch({
            type: 'WO/fetch',
            payload: obj
        })
    };
    //编辑
    handleUpdate = (e, record) => {
        e.preventDefault();
        router.push('/platform/industry/workorder/update', record)
    }
    //取消
    handleReset = () => {
        const { dispatch, form } = this.props;
        //清空输入框
        form.resetFields();
        this.setState({
            conditions: [],
            page: {
                pageIndex: 0,
                pageSize: 10,
            }
        })
        //清空后获取
        if (this.state.id) {
            dispatch({
                type: 'PL/fetchTable',
                payload: {
                    id: this.state.id,
                    pageIndex: 0,
                    pageSize: 10,
                }
            })
        } else {
            dispatch({
                type: 'PL/fetchTable',
                payload: {
                    pageIndex: 0,
                    pageSize: 10,
                }
            })
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
            return <TreeNode title={item.name} key={item.id} dataRef={item} />;
        });


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

    render() {
        const {
            PL: { datatable },
            form: { getFieldDecorator },
            loading
        } = this.props;

        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        console.log('----datatable', datatable)


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
                    <Card style={{ width: '25%', marginRight: '3%', boxSizing: 'border-box', overflow: 'hodden' }} bordered={false}>
                        {/*<div style={{overflow:'hidden',float:'right',marginTop:'3px'}}> {
              this.state.addState?<Button icon="plus" type="primary" onClick={this.handleBussiness}>
                新建
              </Button>:''
            }</div>*/}
                        <div style={{ overflow: 'hidden', borderBottom: '1px solid #f5f5f5', }}>
                            <h3 style={{ height: '50px', lineHeight: '40px', float: 'left' }}>工作令</h3>
                        </div>
                        <div >
                            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
                            <Tree
                                onExpand={this.onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onSelect={this.onSelect}
                            >
                                {loop(this.state.valueList)}
                            </Tree>
                        </div>

                    </Card>
                    <Card style={{ width: '70%', boxSizing: 'border-box', overflow: 'hodden' }} bordered={false}>
                        <Form onSubmit={this.handleSearch} layout="inline">
                            <Row gutter={{ xs: 24, sm: 24, md: 24 }}>
                                <Col md={24} sm={24}>
                                    <FormItem label='计划编码'>
                                        {getFieldDecorator('code')(<Input placeholder='计划编码' />)}
                                    </FormItem>

                                    <FormItem label='计划名称'>
                                        {getFieldDecorator('name')(<Input placeholder='计划名称' />)}
                                    </FormItem>

                                    <span style={{ display: 'inline-block', margin: '3px 0 15px 0', }}>
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
                            style={{ marginTop: '15px' }}
                            loading={loading}
                            data={datatable}
                            classNameSaveColumns={"progressLook1"}
                            columns={this.columns}
                            onChange={this.handleStandardTableChange}
                        />

                    </Card>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default ProgressLook;

