import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  Model,
  Select,
  Button,
  Card,
  Upload,
  Icon,
  Divider,
  Checkbox,
  Radio,
  Tooltip,
  Modal,
  message,
  Switch,
  Popconfirm,
  Transfer,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import NewModelTable from '@/pages/tool/NewModelTable/NewModelTable';
import NewTreeTable from '@/pages/tool/NewTreeTable/NewTreeTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import './tableBg.less'
import styles from '../../Sysadmin/UserAdmin.less';
import { toTree } from '@/pages/tool/ToTree';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import SuperAdd from '@/pages/Platform/ProductModle/Routing/SuperAdd';
import CopySuperAdd from '@/pages/Platform/ProductModle/Routing/CopySuperAdd';
import SuperUpdate from '@/pages/Platform/ProductModle/Routing/SuperUpdate';
import Cadd from '@/pages/Platform/ProductModle/Routing/Cadd';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';
import RoutCard from './RoutCard'

const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ rout, loading }) => ({
  rout,
  loading: loading.models.rout,
  fetchLoading: loading.effects['rout/materialId'],
  childLoading: loading.effects['rout/findChild'],
  MaterialLoading:loading.effects['rout/fetchMata'],
}))
@Form.create()

class Routing extends PureComponent {
  state = {
    conditions: [],
    superId: null,
    rowId: null,
    childTable: [],
    childVisible: false,
    deleteFileList: [],
    dataList: [],

    TreeMaterialData: [],
    MaterialConditions: [],
    material_id: null,
    TableMaterialData: [],
    SelectMaterialValue: [],
    selectedMaterialRowKeys: [],
    pageMaterial: {},

    TableData: [],
    SelectValue: '',
    selectedRowKeys: [],
    Jpage: {},
    Jconditions: [],
    TablePData: [],
    SelectPValue: '',
    selectedPRowKeys: [],
    Pconditions: [],
    Ppage: {},
    Pperson_id: null,

    ucumname: '',
    ucumId: '',

    version: '',
    visible: false,

    fileList: [],
    record: {},
    childId: null,
    submitStatus: true,


    page: {
      pageSize: 1000000,
      pageIndex: 0
    },
    addVisible: false,
    updateVisible: false,
    updateRecord: {},
    copyVisible: false,
    addCopy: {},
    addChildVisible: false,
    updateChildVisible: false,
    updateChildRecord: {},
    conditions2: [],
    routlist: [],
    selectRecord: {}
  };

  columns = [
    {
      title: '工艺路线编码',
      dataIndex: 'code',

    },
    {
      title: '工艺路线名称',
      dataIndex: 'name',

    },
    {
      title: '物料名称',
      dataIndex: 'materialname',

    },
    {
      title: '物料编码',
      dataIndex: 'materialcode',

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
      title: '数量',
      dataIndex: 'sl',

    },
    {
      title: '是否模板',
      dataIndex: 'templateFlag',
      render: (text) => {
        return <Checkbox checked={text} disabled={!text} />
      }
    },
    {
      title: '是否默认版本',
      dataIndex: 'defaultFlag',
      render: (text, record) => {
        if (text) {
          return <Checkbox checked={text} />
        }
        return <Checkbox checked={text} onChange={(e) => this.onChange(e, record)} />
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
      title: formatMessage({ id: 'validation.operation' }),
      dataIndex: 'caozuo',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.update(e, record)}>编辑</a>
        </Fragment>
      ),
    },
  ];

  onChange = (e, record) => {
    if (e.target.checked) {
      this.setState({
        visible: true,
        record
      })
    }
    const { dataList } = this.state;
    dataList.list.map(item => {
      if (record.id === item.id) {
        item.defaultFlag = e.target.checked
      }
      return item
    });
    this.setState({
      dataList,
      record
    })
  };

  //点击删除
  handleDelete = (record) => {
    const { dispatch } = this.props;
    const { page, selectedMaterialRowKeys } = this.state;
    dispatch({
      type: 'rout/delete',
      payload: {
        reqData: {
          id: record.id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("删除成功", 1, () => {
            this.setState({
              childTable: [],
              superId: null,
              rowId: null,
              addCopy: {}
            })
            dispatch({
              type: 'rout/materialId',
              payload: {
                conditions: [{
                  code: 'MATERIAL_BASE_ID',
                  exp: '=',
                  value: selectedMaterialRowKeys[0]
                }],
                ...page
              }
            })
          })
        }
      }
    })
  };

  //编辑
  update = (e, record) => {
    e.preventDefault();
    this.setState({
      updateVisible: true,
      updateRecord: record,
    })
  };

  handleCorpAdd = () => {
    this.setState({
      copyVisible: true
    })
  }

  uploadAdd = () => {
    const { dispatch } = this.props;
    const { page, superId } = this.state;
    dispatch({
      type: 'rout/fetchList',
      payload: {
        reqData: {
          bill_id: superId,
          type: 'technologyrout'
        }
      },
      callback: (res) => {
        this.setState({
          fileList: res
        })
      }
    });
    this.setState({
      uploadvisible: true,
    })
  }

  handleAdd = () => {
    this.setState({
      addVisible: true
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      dispatch,
      MaterialLoading
    } = this.props;

    const on = {
      onOk: (selectedRowKeys, selectedRows, onChange) => {
        if (!selectedRowKeys.length || !selectedRows.length) {
          return
        }
        let ucumId = null;
        let ucumname = '';
        let selectRecord = null
        const nameList = selectedRows.map(item => {
          ucumId = item.ucumId;
          ucumname = item.ucumName;
          return item.name
        });
        onChange(nameList);
        this.setState({
          SelectMaterialValue: nameList,
          ucumId,
          ucumname,
          selectedMaterialRowKeys: selectedRowKeys,
          addShow: false,
          selectRecord: selectedRows[0],
        })
        if (selectedRowKeys[0]) {
          let conditions = [{
            code: 'MATERIAL_BASE_ID',
            exp: '=',
            value: selectedRowKeys[0]
          }]
          dispatch({
            type: 'rout/materialId',
            payload: {
              pageIndex: 0,
              pageSize: 100000,
              conditions
            },

          })

        }
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        onChange([])
        const { form } = this.props;
        //清空输入框
        form.resetFields();
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
        })
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
          title: '图号',
          dataIndex: 'graphid',
          key: 'graphid',
        },
        {
          title: '',
          width: 1,
          dataIndex: 'caozuo',
        }
      ],
      fetchList: [
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '物料选择',
      tableType: 'rout/fetchMata',
      treeType: 'rout/matype',
      tableLoading:MaterialLoading
    }

    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='物料编码'>
              {getFieldDecorator('code', {

              })(
                <SelectTableRedis
                  on={on}
                  data={datas}
                />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/*<FormItem label='工艺路线名称'>
              {getFieldDecorator('name')(<Input placeholder='请输入工艺路线名称' />)}
            </FormItem>*/}
          </Col>
          {/*  <Col md={8} sm={24}>
            <span>
              <Button type="primary" onClick={this.findList}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               取消
              </Button>
            </span>
          </Col>*/}
        </Row>
      </Form>

    );
  }

  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { superId, conditions } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      page: obj
    });
    dispatch({
      type: 'rout/materialId',
      payload: {
        conditions,
        ...obj
      }
    })
  };

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { record } = this.state;
    dispatch({
      type: 'rout/default',
      payload: {
        reqData: {
          id: record.id
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success("设置成功", 1, () => {
            this.setState({
              visible: false,
            });
            const { selectedMaterialRowKeys } = this.state;
            const conditions = [{
              code: 'MATERIAL_BASE_ID',
              exp: '=',
              value: selectedMaterialRowKeys[0]
            }];
            dispatch({
              type: 'rout/materialId',
              payload: {
                conditions
              },
              callback: (res) => {
                this.setState({
                  dataList: res
                })
              }
            });
          })
        } else {
          message.error("设置失败")
        }
      }
    });
  };

  handleCancel = () => {
    const { dataList, record } = this.state;
    dataList.list.map(item => {
      if (record.id === item.id) {
        item.defaultFlag = false
      }
      return item
    });
    this.setState({
      visible: false,
      dataList
    });
  };

  uploadOk = () => {
    const { dispatch } = this.props
    const { fileList, superId, deleteFileList } = this.state
    const formData = new FormData();
    if (fileList.length > 0) {
      fileList.forEach(file => {
        formData.append('files[]', file.originFileObj ? file.originFileObj : file);
        formData.append('type', 'technologyrout');
        formData.append('parentpath', 'technologyrout');
        formData.append('bill_id', superId);
      });
    }
    if (deleteFileList.length) {
      for (let i = 0; i < deleteFileList.length; i++) {
        dispatch({
          type: 'rout/deleteend',
          payload: {
            reqData: {
              id: deleteFileList[i].id
            }
          },
          callback: (res) => {

          }
        })
      }
    }
    dispatch({
      type: 'rout/upload',
      payload: formData,
      callback: (res) => {
        message.success('上传成功', 1.5, () => {
          this.setState({ uploadvisible: false })
        })
      }
    })

  }

  uploadCancel = () => {
    this.setState({
      uploadvisible: false,
      deleteFileList: [],
      fileList: [],
    })
  }

  bomCard = (res) => {
    const { childTable } = this.state
    let childTableStr = JSON.stringify(childTable)
    let resStr = JSON.stringify(res)
    let c = childTableStr === resStr

    this.setState({
      cardListAdd: res,
      submitStatus: c
    })
    if (res.length) {
      res.map(item => {
        if (item.quantityofworkstations) {
          item.quantityofworkstations = Number(item.quantityofworkstations)
        }
        if (item.setuptime) {
          item.setuptime = Number(item.setuptime)
        }
        if (item.productiontime) {
          item.productiontime = Number(item.productiontime)
        }
        if (item.waitingtime) {
          item.waitingtime = Number(item.waitingtime)
        }
        if (item.transfertime) {
          item.transfertime = Number(item.transfertime)
        }
        if (item.disassemblytime) {
          item.disassemblytime = Number(item.disassemblytime)
        }
        if (item.productioninonecycle) {
          item.productioninonecycle = Number(item.productioninonecycle)
        }
        if (item.machineutilization) {
          item.machineutilization = Number(item.machineutilization)
        }
        if (item.laborutilization) {
          item.laborutilization = Number(item.laborutilization)
        }

        if (item.checkFlag) {
          item.checkFlag = 1
        } else {
          item.checkFlag = 0
        }

        if (item.handoverFlag) {
          item.handoverFlag = 1
        } else {
          item.handoverFlag = 0
        }

        if (item.backflushFlag) {
          item.backflushFlag = 1
        } else {
          item.backflushFlag = 0
        }

        if (item.countFlag) {
          item.countFlag = 1
        } else {
          item.countFlag = 0
        }

        if (item.parallelFlag) {
          item.parallelFlag = 1
        } else {
          item.parallelFlag = 0
        }

        return item
      })
    }
    this.setState({
      routlist: res
    })
  };

  onTijiao = () => {
    const { routlist, superId, conditions2 } = this.state;
    const { dispatch } = this.props;
    routlist.map(item => {
      item.technologyId = superId;
      if (item.id) {
        delete item.id
      }
      return item
    });
    dispatch({
      type: 'rout/addChild',
      payload: {
        reqDataList: routlist,
        reqData: {
          routId: superId
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success('提交成功', 1.5, () => {
            dispatch({
              type: 'rout/findChild',
              payload: {
                conditions: conditions2
              },
              callback: (res) => {
                this.setState({
                  routlist: [],
                  submitStatus: true,
                })
              }
            })
          });
        } else {
          message.error("子表创建失败,请检查数据")
        }
      }
    })
  }

  render() {
    const {
      fetchLoading,
      childLoading,
      MaterialLoading,
      rout: { fetchData },
      dispatch
    } = this.props;
    const { selectRecord, routlist, updateVisible, submitStatus, updateRecord, addCopy, copyVisible, childTable,
      page, conditions, fileList, addVisible, uploadvisible, selectedMaterialRowKeys } = this.state;
    const props = {
      onRemove: file => {
        if (file.id) {
          this.setState({
            deleteFileList: [...this.state.deleteFileList, file]
          })
        }
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    const AddData = {
      visible: addVisible,
      record: selectRecord,
      //  {
      //   materialBaseName:this.state.SelectMaterialValue[0],
      //   materialBaseId:this.state.selectedMaterialRowKeys[0],
      //   ucumname:this.state.ucumname,
      //   ucumId:this.state.ucumId,
      //   version:this.state.version
      // }
    };

    const AddOn = {
      onSave: (obj, clear, is) => {
        dispatch({
          type: 'rout/add',
          payload: {
            reqData: {
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
                clear();
                this.setState({
                  addVisible: false,
                });
                if (is) {
                  dispatch({
                    type: 'rout/default',
                    payload: {
                      reqData: {
                        id: res.id
                      }
                    },
                    callback: (res) => {
                      if (res.errMsg === '成功') {
                        dispatch({
                          type: 'rout/materialId',
                          payload: {
                            conditions,
                            ...page
                          }
                        })
                      }
                    }
                  });
                }
                dispatch({
                  type: 'rout/materialId',
                  payload: {
                    conditions: [{
                      code: 'MATERIAL_BASE_ID',
                      exp: '=',
                      value: selectedMaterialRowKeys[0]
                    }],
                    ...page
                  }
                })
              })
            } else {
              clear(1);
              message.error("新建失败")
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          addVisible: false
        })
      }
    };

    const cAddData = {
      visible: copyVisible,
      record: {
        materialBaseName: this.state.SelectMaterialValue[0],
        materialBaseId: this.state.selectedMaterialRowKeys[0],
        ucumname: this.state.ucumname,
        ucumId: this.state.ucumId,
        version: this.state.version
      },
      addCopy
    };

    const cAddOn = {
      onSave: (obj, clear, is) => {
        dispatch({
          type: 'rout/add',
          payload: {
            reqData: {
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
                clear();
                this.setState({
                  copyVisible: false,
                  superId: null,
                  rowId: null,
                  addCopy: {}
                });
                if (is) {
                  dispatch({
                    type: 'rout/default',
                    payload: {
                      reqData: {
                        id: res.id
                      }
                    },
                    callback: (res) => {
                      if (res.errMsg === '成功') {
                        dispatch({
                          type: 'rout/materialId',
                          payload: {
                            conditions,
                            ...page
                          },
                        })
                      }
                    }
                  });
                }
                dispatch({
                  type: 'rout/materialId',
                  payload: {
                    conditions: [{
                      code: 'MATERIAL_BASE_ID',
                      exp: '=',
                      value: selectedMaterialRowKeys[0]
                    }],
                    ...page
                  }
                })
              })
            } else {
              clear(1);
              message.error("新建失败")
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          copyVisible: false
        })
      }
    };

    const UpdateData = {
      visible: updateVisible,
      record: updateRecord
    };

    const UpdateOn = {
      onSave: (obj, clear, is) => {
        dispatch({
          type: 'rout/add',
          payload: {
            reqData: {
              ...obj
            }
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("编辑成功", 1, () => {
                clear();
                this.setState({
                  updateVisible: false,
                  copyVisible: false,
                  superId: null,
                  rowId: null,
                  addCopy: {}
                });
                if (is) {
                  dispatch({
                    type: 'rout/default',
                    payload: {
                      reqData: {
                        id: obj.id
                      }
                    },
                    callback: (res) => {
                      if (res.errMsg === '成功') {
                        dispatch({
                          type: 'rout/materialId',
                          payload: {
                            conditions,
                            ...page
                          }
                        })
                      }
                    }
                  });
                }
                dispatch({
                  type: 'rout/materialId',
                  payload: {
                    conditions: [{
                      code: 'MATERIAL_BASE_ID',
                      exp: '=',
                      value: selectedMaterialRowKeys[0]
                    }],
                    ...page
                  },
                })
              })
            } else {
              clear(1);
              message.error("更新失败")
            }
          }
        })
      },
      onCancel: (clear) => {
        clear();
        this.setState({
          updateVisible: false,
          updateRecord: {}
        })
      }
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            data={fetchData}
            loading={fetchLoading}
            columns={this.columns}
            classNameSaveColumns={"RoutIndex5"}
            onChange={this.handleStandardTableChange}
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
                    type: 'rout/findChild',
                    payload: {
                      conditions
                    },
                    callback: (res) => {
                      this.setState({
                        childTable: res,
                        conditions2: conditions
                      })
                    }
                  })
                  this.setState({
                    superId: record.id,
                    rowId: record.id,
                    addCopy: record
                  });
                },
                rowKey: record.id
              }
            }}
            rowClassName={this.setRowClassName}
            title={() => <div >
              <Button icon="plus" disabled={!this.state.selectedMaterialRowKeys[0]} onClick={this.handleAdd} type="primary" >
                新建
              </Button>
              <Button icon="plus" disabled={!this.state.superId} onClick={this.handleCorpAdd} type="primary" style={{ marginLeft: '12px' }}>
                复制并新建
              </Button>
              <Button icon="plus" disabled={!this.state.superId} onClick={this.uploadAdd} type="primary" style={{ marginLeft: '12px' }}>
                上传附件
              </Button>
            </div>
            }
          />

          <SuperAdd on={AddOn} data={AddData} />

          <CopySuperAdd on={cAddOn} data={cAddData} />

          <SuperUpdate on={UpdateOn} data={UpdateData} />
        </Card>

        <Card bordered={false} style={{ marginTop: '15px' }}>
          <Cadd data={childTable} loading={childLoading} bomCard={this.bomCard} />
          {/* <RoutCard data={childTable} loading={childLoading} bomCard={ this.bomCard }/> */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type={'primary'} style={{ display: `${submitStatus ? 'none' : ''}` }} onClick={this.onTijiao}>提交</Button>
          </div>
        </Card>

        <Modal
          title={"上传附件"}
          visible={uploadvisible}
          onOk={this.uploadOk}
          onCancel={this.uploadCancel}
        >
          <Upload {...props} >
            <Button >
              <Icon type="upload" /> 上传附件
            </Button>
          </Upload>
        </Modal>
        <Modal
          title={"询问"}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>当前物料已存在默认版本的BOM，继续保存将使原来的
            默认版本变为普通版本，是否继续？</p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Routing;
