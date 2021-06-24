import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NormalTable from '@/components/NormalTable';
import { formatMessage, FormattedMessage } from 'umi/locale';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import NewModelTable from '@/pages/tool/NewModelTable/NewModelTable';
import NewTreeTable from '@/pages/tool/NewTreeTable/NewTreeTable';
import SelectTableRedis from '@/pages/tool/SelectTableRedis'
import { toTree } from '@/pages/tool/ToTree';
import './mo.less'
import {
  Table,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Divider,
  Checkbox,
  Button,
  Card,
  Tabs,
  TextArea,
  Tree,
  Modal,
  message, Popconfirm,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import '../Bom/bom.less'

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TreeNode } = Tree;

@connect(({ minfor, loading }) => ({
  minfor,
  loading: loading.models.minfor,
  BomLoading: loading.effects['minfor/fetchbomtree'],
  BomChildLoading: loading.effects['minfor/fetchbomchild'],
  RoutLoading: loading.effects['minfor/findrouttable'],
  RoutChildLoading: loading.effects['minfor/findroutChild'],
}))
@Form.create()
class MateraInfor extends PureComponent {
  state = {
    allversion: [],

    TreeMaterialData: [],
    MaterialConditions: [],
    material_id: null,
    TableMaterialData: [],
    SelectMaterialValue: [],
    selectedMaterialRowKeys: [],
    pageMaterial: {},

    selectedKeysMaterid: null,

    tabKey: '0',

    childBomData: [],
    bomTable: [],
    rowId: null,
    routId: null,
    routTable: [],
    childRoutTable: [],
    valueList: [],

    conditions: [],

    selectedBomKeys: [],
    selectedRoutKeys: [],

    dataBomList: [],
    dataRoutList: [],
    page: {
      pageIndex: 0,
      pageSize: 10
    }
  }

  columns = [
    {
      title: '物料编码',
      dataIndex: 'materialcode',

    },
    {
      title: '物料名称',
      dataIndex: 'materialname',

    },
    {
      title: '计量单位',
      dataIndex: 'ucumname',

    },
    {
      title: '数量',
      dataIndex: 'sl',

    },
    {
      title: '辅数量',
      dataIndex: 'fsl',

    },
    {
      title: '是否默认',
      dataIndex: 'defaultFlag',
      render: (text, record) => {
        if (text == 0) {
          return <Checkbox />
        } else if (text == 1) {
          return <Checkbox checked />
        }
      }
    },
    {
      title: '',
      dataIndex: 'caozuo',
      width: 1
    },
  ];
  columns2 = [
    {
      title: '工艺路线编码',
      dataIndex: 'code',

    },
    {
      title: '工艺路线名称',
      dataIndex: 'name',

    },
    {
      title: '物料编码',
      dataIndex: 'materialname',

    },
    {
      title: '版本',
      dataIndex: 'version',

    },
    {
      title: '状态',
      dataIndex: 'state',

      render: (text) => {
        if (text === 1) {
          return "初稿"
        }
        if (text === 2) {
          return "已审核"
        }
        if (text === 3) {
          return "已拒绝"
        }
      }
    },
    {
      title: '是否默认版本',
      dataIndex: 'defaultFlag',
      render: (text) => {
        if (text === 1) {
          return <Checkbox checked />
        } else if (text === 0) {
          return <Checkbox />
        }
      }
    },
    {
      title: '计量单位',
      dataIndex: 'ucumname',

    },
    {
      title: '创建人',
      dataIndex: 'operationId',

    },
    {
      title: '',
      dataIndex: 'caozuo',
      width: 1
    },
  ];
  columns3 = [
    {
      title: '物料编码',
      dataIndex: 'materialcode',

    },
    {
      title: '物料名称',
      dataIndex: 'materialname',

    },
    {
      title: '数量',
      dataIndex: 'sl',

    },
    {
      title: '辅数量',
      dataIndex: 'fsl',

    },
    {
      title: '计量单位',
      dataIndex: 'ucumname',

    },
    {
      title: '装配提前期',
      dataIndex: 'zptqq',

    },
    {
      title: '换算率',
      dataIndex: 'hsl',

    },
    {
      title: '装配位置',
      dataIndex: 'zpwz',

    },
    {
      title: '',
      dataIndex: 'caozuo',
      width: 1
    },
  ];
  columns4 = [
    {
      title: '工序编码',
      dataIndex: 'code',

    },
    {
      title: '工序名称',
      dataIndex: 'name',

    },
    {
      title: '所属区域',
      dataIndex: 'divisionId',

    },
    {
      title: '生产线',
      dataIndex: 'productionlineId',

    },
    {
      title: '工序号',
      dataIndex: 'vno',

    },
    {
      title: '工作站名称',
      dataIndex: 'workstationtypeId',

    },
    {
      title: '工作站类型',
      dataIndex: 'assignedtooperation',

    },
    {
      title: '工作站数量',
      dataIndex: 'quantityofworkstations',

    },
    {
      title: '时间类型',
      dataIndex: 'timetype',

    },
    {
      title: '准备时间',
      dataIndex: 'setuptime',

    },
    {
      title: '生产时间',
      dataIndex: 'productiontime',

    },
    {
      title: '等待时间',
      dataIndex: 'waitingtime',

    },
    {
      title: '传输时间',
      dataIndex: 'transfertime',

    },
    {
      title: '拆卸时间',
      dataIndex: 'disassemblytime',

    },
    {
      title: '单位周期生产数量',
      dataIndex: 'productioninonecycle',

    },
    {
      title: '机器利用率',
      dataIndex: 'machineutilization',

    }, {
      title: '人工利用率',
      dataIndex: 'laborutilization',

    },
    {
      title: '是否检测点',
      dataIndex: 'checkFlag',
      render: (text) => {
        if (text === 1) {
          return <Checkbox checked />
        } else if (text === 0) {
          return <Checkbox />
        }
      }
    }, {
      title: '是否交接点',
      dataIndex: 'handoverFlag',
      render: (text) => {
        if (text === 1) {
          return <Checkbox checked />
        } else if (text === 0) {
          return <Checkbox />
        }
      }
    }, {
      title: '是否倒冲',
      dataIndex: 'backflushFlag',
      render: (text) => {
        if (text === 1) {
          return <Checkbox checked />
        } else if (text === 0) {
          return <Checkbox />
        }
      }
    }, {
      title: '是否计数点',
      dataIndex: 'countFlag',
      render: (text) => {
        if (text === 1) {
          return <Checkbox checked />
        } else if (text === 0) {
          return <Checkbox />
        }
      }
    }, {
      title: '是否并行工序',
      dataIndex: 'parallelFlag',
      render: (text) => {
        if (text === 1) {
          return <Checkbox checked />
        } else if (text === 0) {
          return <Checkbox />
        }
      }
    },
    {
      title: '首检类型',
      dataIndex: 'checktype',

    },
    {
      title: '生效日期',
      dataIndex: 'effectdate',

    },
    {
      title: '失效日期',
      dataIndex: 'invaliddate',

    },
    {
      title: '',
      dataIndex: 'caozuo',
      width: 1
    },
  ];

  //查询
  bomhandleSearch = () => {
    const { form, dispatch } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (err) { return }
      const { bomname, version } = values;
      let conditions = [];
      let codeObj = {};
      let nameObj = {};
      if (bomname) {
        codeObj = {
          code: 'MATERIAL_BASE_ID',
          exp: '=',
          value: this.state.selectedMaterialRowKeys[0]
        };
        conditions.push(codeObj)
      }
      if (version) {
        nameObj = {
          code: 'version',
          exp: '=',
          value: version
        };
        conditions.push(nameObj)
      }
      this.setState({
        conditions
      })
      dispatch({
        type: 'minfor/fetchbomtree',
        payload: {
          pageIndex: 0,
          pageSize: 100000,
          conditions
        },
        callback: (res) => {
          const a = toTree(res);
          this.setState({
            valueList: a,
            dataBomList: res
          })
        }
      })
      dispatch({
        type: 'minfor/findrouttable',
        payload: {
          pageIndex: 0,
          pageSize: 100000,
          conditions
        },
        callback: (res) => {
          const a = toTree(res);
          this.setState({
            routTable: a
          })
        }
      })
    })
  };

  //取消
  bomhandleReset = () => {
    const { dispatch, form } = this.props;
    //清空输入框
    form.resetFields();
    this.setState({
      allversion: [],

      TreeMaterialData: [],
      MaterialConditions: [],
      material_id: null,
      TableMaterialData: [],
      SelectMaterialValue: [],
      selectedMaterialRowKeys: [],
      pageMaterial: {},

      selectedKeysMaterid: null,

      tabKey: '0',

      childBomData: [],
      bomTable: [],
      rowId: null,
      routId: null,
      routTable: [],
      childRoutTable: [],
      valueList: [],

      conditions: [],

      selectedBomKeys: [],
      selectedRoutKeys: []
    });
  };

  tabChange = (key) => {
    const { conditions } = this.state;
    const { dispatch } = this.props;
    if (key === '0') {
      if (conditions.length) {
        dispatch({
          type: 'minfor/findrouttable',
          payload: {
            pageIndex: 0,
            pageSize: 100000,
            conditions
          },
          callback: (res) => {
            const a = toTree(res);
            this.setState({
              routTable: a,
            })
          }
        })
      }
      this.setState({
        childBomData: [],
        rowId: null,
        selectedBomKeys: []
      })
    }
    if (key === '1') {
      if (conditions.length) {
        dispatch({
          type: 'minfor/fetchbomtree',
          payload: {
            pageIndex: 0,
            pageSize: 100000,
            conditions
          },
          callback: (res) => {
            const a = toTree(res);
            this.setState({
              valueList: a,
            })
          }
        })
      }
      this.setState({
        childRoutTable: [],
        routId: null,
        selectedRoutKeys: []
      })
    }
    this.setState({
      tabKey: key
    });
  }

  tabchildcallback = (key) => {

  }

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  routsetRowClassName = (record) => {
    return record.id === this.state.routId ? 'clickRowStyl' : '';
  };

  onSelectBom = (selectedKeys, info) => {
    const { dispatch } = this.props;
    this.setState({
      selectedBomKeys: selectedKeys,
    })
    if (info.selectedNodes[0]) {
      const { id, materialBaseId } = info.selectedNodes[0].props.dataRef;
      if ('bomId' in info.selectedNodes[0].props.dataRef) {
        const conditions = [{
          code: 'MATERIAL_BASE_ID',
          exp: '=',
          value: materialBaseId
        },{
          code: 'DEFAULT_FLAG',
          exp: '=',
          value: 1
        }]
        dispatch({
          type: 'minfor/fetchbomtree',
          payload: {
            pageIndex: 0,
            pageSize: 100000,
            conditions
          },
          callback: (res) => {
            this.setState({
              dataBomList: res,
              childBomData: []
            })
          }
        })
      } else {
        const conditions = [{
          code: 'id',
          exp: '=',
          value: id
        }];
        dispatch({
          type: 'minfor/fetchbomtree',
          payload: {
            conditions
          },
          callback: (res) => {
            this.setState({
              dataBomList: res,
              childBomData: []
            })
          }
        });
      }
    } else {
      this.setState({
        dataBomList: [],
        childBomData: [],
        rowId: null
      })
    }
  };

  onLoadDataBom = treeNode =>
    new Promise(resolve => {
      if (treeNode.children) {
        resolve();
        return;
      }
      const { dispatch } = this.props;
      const { id, materialBaseId } = treeNode.props.dataRef;
      if ('bomId' in treeNode.props.dataRef) {
        const conditions = [{
          code: 'MATERIAL_BASE_ID',
          exp: '=',
          value: materialBaseId
        }, {
          code: 'DEFAULT_FLAG',
          exp: '=',
          value: 1
        }]
        dispatch({
          type: 'minfor/fetchbomtree',
          payload: {
            pageIndex: 0,
            pageSize: 1000000,
            conditions
          },
          callback: (res) => {

            if (res.length) {
              const data = res[0];
              const conditions = [{
                code: 'BOM_ID',
                exp: '=',
                value: data.id
              }]
              dispatch({
                type: 'minfor/fetchbomchild',
                payload: {
                  pageSize: 1000000,
                  pageIndex: 0,
                  conditions
                },
                callback: (res) => {
                  res.map(item => {
                    item.key = 'bom' + item.id
                    item.name = item.materialname
                  });
                  treeNode.props.dataRef.children = res;
                  resolve();
                }
              });
            } else {
              resolve();
            }
          }
        })
      } else {
        const conditions = [{
          code: 'BOM_ID',
          exp: '=',
          value: id
        }]
        dispatch({
          type: 'minfor/fetchbomchild',
          payload: {
            pageSize: 1000000,
            pageIndex: 0,
            conditions
          },
          callback: (res) => {

            res.map(item => {
              item.key = 'bom' + item.id
              item.name = item.materialname
            });
            treeNode.props.dataRef.children = res;
            resolve();
          }
        });
      }
    });

  onSelectRout = (selectedKeys, info) => {
    this.setState({
      selectedRoutKeys: selectedKeys,
    })
    if (info.selectedNodes[0]) {
      const { id, key } = info.selectedNodes[0].props.dataRef;
      if (typeof key === 'number') {
        const { dispatch } = this.props;
        const conditions = [{
          code: 'technology_id',
          exp: '=',
          value: id
        }]
        dispatch({
          type: 'minfor/findroutChild',
          payload: {
            pageSize: 100000,
            pageIndex: 0,
            conditions
          },
          callback: (res) => {
            this.setState({
              childRoutTable: res,
              routId: id,
            })
          }
        });
      } else {
        this.setState({
          childRoutTable: [],
          routId: null,
        })
      }

    } else {
      this.setState({
        childRoutTable: [],
        routId: null,
      })
    }
  };

  onLoadDataRout = treeNode =>
    new Promise(resolve => {
      if (treeNode.children) {
        resolve();
        return;
      }
      const { dispatch } = this.props;
      const { id } = treeNode.props.dataRef;
      const conditions = [{
        code: 'technology_id',
        exp: '=',
        value: id
      }]
      dispatch({
        type: 'minfor/findroutChild',
        payload: {
          pageSize: 100000,
          pageIndex: 0,
          conditions
        },
        callback: (res) => {
          treeNode.props.dataRef.children = res;
          resolve();
        }
      });
    });

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.name} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.name} dataRef={item} />;
    });

  render() {
    const {
      form: { getFieldDecorator },
      minfor: { bomlist, routlist },
      BomLoading,
      BomChildLoading,
      RoutLoading,
      RoutChildLoading,
      dispatch
    } = this.props;

    const { childBomData, childRoutTable, valueList, tabKey, routTable, selectedBomKeys, selectedRoutKeys, dataBomList } = this.state

    const on = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys || !selectedRows) {
          return
        }
        const nameList = selectedRows.map(item => {
          return item.name
        });
        onChange(nameList)
        this.setState({
          SelectMaterialValue: nameList,
          selectedMaterialRowKeys: selectedRowKeys,
          bomtable: [],
          routTable: [],
          valueList: [],
          dataList: [],
          allversion: [],
        })
        const { dispatch } = this.props
        let conditionsqq = [{
          code: 'MATERIAL_BASE_ID',
          exp: '=',
          value: selectedRowKeys[0]
        }]
        //取版本号数据
        dispatch({
          type: 'minfor/fetchbomall',
          payload: {
            pageIndex: 0,
            pageSize: 1000000,
            conditions: conditionsqq
          },
          callback: (res) => {
            console.log('--版本',res)
            this.setState({ allversion: res })
          }
        })
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([])
        this.setState({
          SelectMaterialValue: [],
          selectedMaterialRowKeys: [],
        })
      }
    };
    const datas = {
      SelectValue: this.state.SelectMaterialValue, //框选中的集合
      selectedRowKeys: this.state.selectedMaterialRowKeys, //右表选中的数据
      placeholder: '请选择物料',
      columns: [
        {
          title: '工作令编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '工作令名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '型号类部件号',
          dataIndex: 'modelNumber',
          key: 'modelNumber',
        },
        {
          title: '经费来源',
          dataIndex: 'sourceOfFunding',
          key: 'sourceOfFunding',
        },
        {
          title: '开始时间',
          dataIndex: 'startDate',
          key: 'startDate',
        },
        {
          title: '终止时间',
          dataIndex: 'endDate',
          key: 'endDate',
        },
        {
          title: '停止标志',
          dataIndex: 'stopSign',
          key: 'stopSign',
        },
        {
          title: '申请人',
          dataIndex: 'applicantName',
          key: 'applicantName',
        },
        {
          title: '申请部门',
          dataIndex: 'deptName',
          key: 'deptName',
        },
        {
          title: '延期使用日期',
          dataIndex: 'extension',
          key: 'extension',
        },
        {
          title: '单据状态',
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: '工作令描述',
          dataIndex: 'description',
          key: 'description',
        },
        {
          title: '研制状态',
          dataIndex: 'developmentName',
          key: 'developmentName',
        },
        {
          title: '',
          width: 1,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '物料选择',
      tableType: 'minfor/fetchMataCon',
      treeType: 'minfor/matype',
      treeCode:'invclId'
    }

    const Option = (data) => data.map((item) => {
      return <Option value={item.version} key={item.id}>{item.version}</Option>
    });

    const childDelete = (list) => {
      let arr = JSON.stringify(list);
      arr = JSON.parse(arr);
      arr.map(item => {
        if (item.children) {
          delete item.children
        }
      })
      return arr
    }

    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex' }}>
          <Card style={{ width: '25%', marginRight: '1.5%', boxSizing: 'border-box', overflow: 'hodden' }} bordered={false}>
            <div style={{ overflow: 'hidden', borderBottom: '1px solid #f5f5f5', }}>
              <h3 style={{ height: '50px', lineHeight: '30px', float: 'left' }}>物料结构信息</h3>
            </div>
            <div style={{ marginTop: '20px' }}>
              {
                tabKey === '0' ? <Tree
                  loadData={this.onLoadDataBom}
                  onSelect={this.onSelectBom}
                  selectedKeys={selectedBomKeys}
                >
                  {this.renderTreeNodes(valueList)}
                </Tree> : ''
              }
              {
                tabKey === '1' ? <Tree
                  loadData={this.onLoadDataRout}
                  onSelect={this.onSelectRout}
                  selectedKeys={selectedRoutKeys}
                >
                  {this.renderTreeNodes(routTable)}
                </Tree> : ''
              }
            </div>
          </Card>
          <div title="" style={{ width: '73.5%', boxSizing: 'border-box', overflow: 'hodden' }}>
            <Card bordered={false} style={{ width: '100%', boxSizing: 'border-box', overflow: 'hodden' }} className={'mcard'}>
              <Form layout="inline">
                <Row gutter={{ xs: 24, sm: 24, md: 24 }}>
                  <Col md={24} sm={24}>
                    <Form.Item label="物料">
                      {getFieldDecorator('bomname', {
                        rules: [{
                          required: true,
                          message: '物料'
                        }],
                      })(<SelectTableRedis
                        on={on}
                        data={datas}
                      />)}
                    </Form.Item>
                    <FormItem label='版本'>
                      {getFieldDecorator('version', {
                        rules: [{
                          required: true,
                          message: '版本'
                        }],
                      })(<Select placeholder={'请选择版本'}>
                        {
                          Option(this.state.allversion)
                        }
                      </Select>)}
                    </FormItem>
                    <span style={{ display: 'inline-block', margin: '3px 0 15px 0', }}>
                      <Button type="primary" onClick={this.bomhandleSearch}>
                        查询
                    </Button>
                      <Button style={{ marginLeft: 8 }} onClick={this.bomhandleReset}>
                        取消
                    </Button>
                    </span>
                  </Col>
                </Row>
              </Form>
              <Tabs activeKey={tabKey} onChange={this.tabChange}>
                <TabPane tab="BOM" key={'0'}>
                  <NormalTable
                    loading={BomLoading}
                    classNameSaveColumns={"materialInfo5"}
                    dataSource={childDelete(dataBomList)}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          this.setState({
                            rowId: record.id,
                            selectedBomKeys: [`${record.id}`]
                          })
                          const { dispatch } = this.props;
                          const conditions = [{
                            code: 'BOM_ID',
                            exp: '=',
                            value: record.id + ''
                          }]
                          dispatch({
                            type: 'minfor/fetchbomchild',
                            payload: {
                              pageSize: 100000,
                              pageIndex: 0,
                              conditions
                            },
                            callback: (res) => {
                              this.setState({
                                childBomData: res
                              })
                            }
                          })
                        },
                        rowKey: record.id
                      }
                    }}
                    pagination={false}
                    columns={this.columns}
                    rowClassName={this.setRowClassName}
                    scroll={{ y: 240 }}
                  />
                </TabPane>
                <TabPane tab="工艺路线" key={'1'}>
                  <NormalTable
                    loading={RoutLoading}
                    classNameSaveColumns={"materialInfo9"}
                    dataSource={childDelete(routTable)}
                    pagination={false}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          const { dispatch } = this.props;
                          const conditions = [{
                            code: 'technology_id',
                            exp: '=',
                            value: record.id + ''
                          }];
                          dispatch({
                            type: 'minfor/findroutChild',
                            payload: {
                              pageSize: 100000,
                              pageIndex: 0,
                              conditions
                            },
                            callback: (res) => {
                              this.setState({
                                childRoutTable: res,
                                routId: record.id,
                                selectedRoutKeys: [`${record.id}`]
                              })
                            }
                          })
                        },
                        rowKey: record.id
                      }
                    }}
                    columns={this.columns2}
                    rowClassName={this.routsetRowClassName}
                    scroll={{ y: 240 }}
                  />
                </TabPane>
              </Tabs>
            </Card>
            <Card bordered={false} style={{ marginTop: '15px' }}>
              {
                tabKey === '0' ? <Tabs onChange={this.tabchildcallback}>
                  <TabPane tab="基本信息" key="1">
                    <NormalTable
                      dataSource={childBomData}
                      pagination={false}
                      classNameSaveColumns={"materialInfo6"}
                      columns={this.columns3}
                      loading={BomChildLoading}
                      scroll={{ y: 240 }}
                    />
                  </TabPane>
                  <TabPane tab="备料信息" key="2">

                  </TabPane>
                  <TabPane tab="控制信息" key="3">

                  </TabPane>
                </Tabs> : <NormalTable
                    dataSource={childRoutTable}
                    scroll={{ y: 240 }}
                    columns={this.columns4}
                    classNameSaveColumns={"materialInfo8"}
                    pagination={false}
                    loading={RoutChildLoading}
                  />
              }
            </Card>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default MateraInfor;

