import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  message,
  Divider,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Platform/Sysadmin/UserAdmin.less';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';
import DetailLook from './DetailLook';
import storage from '@/utils/storage';
import AddSelf from './AddSelf';

const FormItem = Form.Item;

@connect(({ QI, loading }) => ({
  QI,
  loading: loading.models.QI,
  loadingSuper: loading.effects['QI/fetch'],
  InitiateApproval: loading.effects['QI/subapprove'] ||  loading.effects['QI/subapprove2'],
  MaterialLoading: loading.effects['QI/fetchMata'],
}))
@Form.create()
class QualitIssuesList extends PureComponent {
  state = {
    rowId: null,
    SelectMaterialValue: [],
    selectedMaterialRowKeys: [],
    record: {},
    checkOk: false,
    detailVisible: false,
    processStatus: false,
    addVisible:false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'QI/fetch',
      payload: {
        ...page,
      },
    });
    const userinfo = storage.get('userinfo');
    if (userinfo && userinfo.roleList) {
      const roleList = userinfo.roleList;
      roleList.map((item, index) => {
        if (item.roleName === '质量技术部' || item.roleName === '公司管理员') {
          this.setState({ checkOk: true });
        }
      });
    }
  }

  //新建
  handleCorpAdd = () => {
    this.setState({
      addVisible: true,
    });
  };

  handleChilddd = () => {
    this.setState({
      addChildVisible: true,
    });
  };

  //删除
  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'testS/deleteSelf',
      payload: {
        reqData: {
          id,
        },
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('删除成功', 1, () => {
            dispatch({
              type: 'testS/fetch',
              payload: {
                ...page,
              },
            });
          });
        }
      },
    });
  };

  handleChildDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { page, superId } = this.state;
    dispatch({
      type: 'testS/deleteChild',
      payload: {
        reqData: {
          id,
        },
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('删除成功', 1, () => {
            dispatch({
              type: 'testS/childFetch',
              payload: {
                conditions: [{
                  code: 'QA_EXAMINE_ID',
                  exp: '=',
                  value: superId,
                }],
              },
              callback: (res) => {
                if (res && res.resData && res.resData.length) {
                  this.setState({
                    childData: res.resData,
                  });
                }
              },
            });
          });
        }
      },
    });
  };

  //查询
  findList = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { page, selectedMaterialRowKeys } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      const { name } = values;
      if (name) {
        let conditions = [];
        let nameObj = {};

        if (name) {
          nameObj = {
            code: 'MATERIAL_ID',
            exp: '=',
            value: selectedMaterialRowKeys[0],
          };
          conditions.push(nameObj);
        }
        this.setState({
          conditions,
        });
        const obj = {
          pageIndex: 0,
          pageSize: 10,
          conditions,
        };
        dispatch({
          type: 'issues/fetch',
          payload: obj,
        });
      } else {
        this.setState({
          conditions: [],
        });
        dispatch({
          type: 'issues/fetch',
          payload: {
            ...page,
          },
        });
      }
    });

  };

  //取消
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    const { page } = this.state;
    //清空输入框
    form.resetFields();
    this.setState({
      conditions: [],
    });
    //清空后获取列表
    dispatch({
      type: 'testS/fetch',
      payload: {
        ...page,
      },
    });
  };

  //审核
  checkRoute = () => {
    const { checkOk, page, record } = this.state;
    const { dispatch } = this.props;
    if (checkOk) {
      switch (record.status) {
        case '初始状态':
          dispatch({
            type: 'QI/subapprove',
            payload: {
              reqData: {
                title: '待审批',
                billCode: '问题物料',
                billType: '初始状态',
                billId: record.id,
                auditType: 'QA_INIT',
                messageType: 0,
                receiverId: 73,
                jump: 0,
              },
            },
            callback: (res) => {
              console.log('---结果', res);
              if (res.errMsg === '成功') {
                message.success('提交成功', 1, () => {
                  dispatch({
                    type: 'QI/fetch',
                    payload: {
                      ...page,
                    },
                  });
                  this.setState({
                    processStatus:false
                  })
                });
              } else {
                message.error('提交失败');
              }
            },
          });
          break;
        case '报废':
          console.log('QA_SCRAPPED');
          dispatch({
            type: 'QI/subapprove2',
            payload: {
              reqData: {
                title: '待审批',
                billCode: '报废物料',
                billType: record.status,
                billId: record.id,
                auditType: 'QA_SCRAPPED',
                messageType: 1,
                receiverId: 73,
                jump: 0,
                processId: record.processId,
              },
            },
            callback: (res) => {
              console.log('---结果', res);
              if (res.errMsg === '成功') {
                message.success('提交成功', 1, () => {
                  dispatch({
                    type: 'QI/fetch',
                    payload: {
                      ...page,
                    },
                  });
                  this.setState({
                    processStatus:false
                  })
                });
              } else {
                message.error('提交失败');
              }
            },
          });
          break;
      }
    } else {
      message.error('该角色没有权限', 1.5);
    }
  };

  //查看
  lookDetail = () => {
    const { record } = this.state
    this.setState({
      detailVisible:true
    });
  };


  updataChildRoute = (record) => {
    this.setState({
      updateChildSource: record,
      updateChildVisible: true,
    });
  };

  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions, superId } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,

    };
    if (conditions) {
      const param = {
        ...obj,
        conditions,
      };
      dispatch({
        type: 'issues/fetch',
        payload: param,
      });
      return;
    }
    this.setState({
      page: obj,
    });
    dispatch({
      type: 'issues/fetch',
      payload: {
        ...obj,
      },
    });
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
      MaterialLoading,
      InitiateApproval
    } = this.props;
    const { rowId, processStatus } = this.state;

    const on = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys.length || !selectedRows.length) {
          return;
        }
        const nameList = selectedRows.map(item => {
          return item.name;
        });
        onChange(nameList);
        this.setState({
          SelectMaterialValue: nameList,
          selectedMaterialRowKeys: selectedRowKeys,
        });
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        const { form } = this.props;
        //清空输入框
        form.resetFields();
        onChange([]);
        this.setState({
          SelectMaterialValue: [],
          selectedMaterialRowKeys: [],
          material_id: null,
          cardList: [],
          childData: [],
          addShow: true,
          superId: null,
          cardListChild: [],
          cardListAdd: [],
        });
      },
    };
    const datas = {
      SelectValue: this.state.SelectMaterialValue, //框选中的集合
      selectedRowKeys: this.state.selectedMaterialRowKeys, //右表选中的数据
      placeholder: '请选择物料',
      columns: [
        {
          title: '物料编码',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '规格',
          dataIndex: 'spec',
          key: 'spec',
        },
        {
          title: '型号',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '计量单位',
          dataIndex: 'ucumName',
          key: 'ucumName',
        },
        {
          title: '物料简称',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
        },
        {
          title: '物料条形码',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
        },
        {
          title: '物料助记器',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
        },
        {

          title: '物料类型',
          dataIndex: 'materialType',
          key: 'materialType',
        },
        {

          title: '委外类型',
          dataIndex: 'outsourcingType',
          key: 'outsourcingType',
        },
        {
          title: '物料形态',
          dataIndex: 'materialForm',
          key: 'materialForm',
        },
        {
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
        },
        {
          title: '',
          width: 100,
          dataIndex: 'caozuo',
        },
      ],
      fetchList: [
        { label: '综合查询', code: 'code', placeholder: '请输入查询内容' },
      ],
      title: '物料选择',
      tableType: 'issues/fetchMata',
      treeType: 'issues/matype',
      treeCode: 'invclId',
      tableLoading: MaterialLoading,
    };

    return (
      <Form onSubmit={(e) => this.findList(e)} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='物料名称'>
              {getFieldDecorator('name')(
                <SelectTableRedis
                  on={on}
                  data={datas}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>

          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                取消
              </Button>
            </span>
          </Col>
        </Row>

        <div style={{ marginTop: 12 }}>
          <Button onClick={this.handleCorpAdd} style={{ marginRight: 12 }} type="primary">
            新建
          </Button>
          <Button disabled={!processStatus} loading={InitiateApproval} onClick={this.checkRoute} type="primary">
            发起审批
          </Button>
          <Button disabled={!rowId} onClick={this.lookDetail} type="primary" style={{ marginLeft: 12 }}>
            查看流程
          </Button>
        </div>
      </Form>
    );
  }

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      loadingSuper,
      loading,
      QI: { data },
    } = this.props;
    const { detailVisible, record } = this.state;

    const columns = [
      {
        title: '物料名称',
        dataIndex: 'materialName',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '质量等级',
        dataIndex: 'qualityLevel',
      },
      {
        title: '材料费',
        dataIndex: 'materialFee',
      },
      {
        title: '人工费',
        dataIndex: 'laborCost',
      },
      {
        title: '外协费',
        dataIndex: 'outsourcingFee',
      },
      {
        title: '批次',
        dataIndex: 'prodserial',
      },
      {
        title: '型号',
        dataIndex: 'model',
      },
      {
        title: '工艺名称',
        dataIndex: 'processplanName',
      },
      {
        title: '工艺步骤',
        dataIndex: 'processplanCode',
      },
      {
        title: '产品编号',
        dataIndex: 'cardnum',
      },
      {
        title: '问题原因',
        dataIndex: 'causes',
      },
      {
        title: '确认标志',
        dataIndex: 'mark',
        render: ((text, record) => {
          if (text === 1) {
            return '确认';
          } else if (text === 0) {
            return '未确认';
          }
        }),
      },
      {
        title: '',
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
            return <Fragment>
              <a href="#javascript:;" onClick={(e) => this.lookDetail(e, record)}>查看</a>
              <Divider type="vertical" />
              {
                record.status !== '初始状态' && record.status !== "报废"?
                  <span style={{ color: '#999' }}>提交审核</span>
                  :<a href="#javascript:;" onClick={(e) => this.checkRoute(e, record)}>提交审核</a>
              }
            </Fragment>

      },
        width:100
      },

    ];

    const detailDates = {
      record,
      visible: detailVisible,
    };
    const detailOn = {
      onCancel: () => {
        this.setState({
          detailVisible: false,
        });
      },
    };

    const OnAddSelf = {
      onSave:(obj,clear)=>{
        /*dispatch({
          type:'QI/add',
          payload:obj,
          callback:(res)=>{
            if(res.errMsg === '成功'){
              message.success('新建成功',1,()=>{
                this.setState({
                  addVisible:false
                })
                clear()
                dispatch({
                  type:'BLibrary/fetch',
                  payload:{
                    ...page
                  }
                })
              })
            }else{
              clear(1)
              message.error("新建失败")
            }
          }
        })*/
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }
    const OnSelfData = {
      visible:this.state.addVisible,
      loading:loading
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <div style={{ marginTop: '12px' }}>
            <NormalTable
              loading={loadingSuper}
              data={data}
              columns={columns}
              onRow={(record) => {
                return {
                  onClick: () => {
                    if (record.status === '初始状态' || record.status === '报废') {
                      this.setState({
                        processStatus: true,
                      });
                    } else {
                      this.setState({
                        processStatus: false,
                      });
                    }

                    this.setState({
                      rowId: record.id,
                      record,
                    });
                  },
                  rowKey: record.id,
                };
              }}
              rowClassName={this.setRowClassName}
              classNameSaveColumns={'QualitIssues'}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <DetailLook data={detailDates} on={detailOn} />
          <AddSelf on={OnAddSelf} data={OnSelfData} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default QualitIssuesList;
