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
      title: '??????????????????',
      dataIndex: 'code',

    },
    {
      title: '??????????????????',
      dataIndex: 'name',

    },
    {
      title: '????????????',
      dataIndex: 'materialname',

    },
    {
      title: '????????????',
      dataIndex: 'materialcode',

    },
    {
      title: '??????',
      dataIndex: 'version',

    },
    {
      title: '??????',
      dataIndex: 'state',

      render: (text) => {
        if (text === 1) {
          return "??????"
        }
        if (text === 2) {
          return "?????????"
        }
        if (text === 3) {
          return "?????????"
        }
      }
    },
    {
      title: '??????',
      dataIndex: 'sl',

    },
    {
      title: '????????????',
      dataIndex: 'templateFlag',
      render: (text) => {
        return <Checkbox checked={text} disabled={!text} />
      }
    },
    {
      title: '??????????????????',
      dataIndex: 'defaultFlag',
      render: (text, record) => {
        if (text) {
          return <Checkbox checked={text} />
        }
        return <Checkbox checked={text} onChange={(e) => this.onChange(e, record)} />
      }
    },
    {
      title: '????????????',
      dataIndex: 'ucumname',

    },
    {
      title: '?????????',
      dataIndex: 'operationId',

    },
    {
      title: formatMessage({ id: 'validation.operation' }),
      dataIndex: 'caozuo',
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="????????????????" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">??????</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a href="#javascript:;" onClick={(e) => this.update(e, record)}>??????</a>
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

  //????????????
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
        if (res.errMsg === "??????") {
          message.success("????????????", 1, () => {
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

  //??????
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
      }, //????????????????????????
      onButtonEmpty: (onChange) => {
        onChange([])
        const { form } = this.props;
        //???????????????
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
      SelectValue: this.state.SelectMaterialValue, //??????????????????
      selectedRowKeys: this.state.selectedMaterialRowKeys, //?????????????????????
      placeholder: '???????????????',
      columns: [
        {
          title: '????????????',
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: '????????????',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '??????',
          dataIndex: 'spec',
          key: 'spec',
        },
        {
          title: '??????',
          dataIndex: 'model',
          key: 'model',
        },
        {
          title: '????????????',
          dataIndex: 'ucumName',
          key: 'ucumName',
        },
        {
          title: '????????????',
          dataIndex: 'materialshortname',
          key: 'materialshortname',
        },
        {
          title: '???????????????',
          dataIndex: 'materialbarcode',
          key: 'materialbarcode',
        },
        {
          title: '???????????????',
          dataIndex: 'materialmnecode',
          key: 'materialmnecode',
        },
        {
          title: '??????',
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
        {label:'????????????',code:'code',placeholder:'?????????????????????'},
      ],
      title: '????????????',
      tableType: 'rout/fetchMata',
      treeType: 'rout/matype',
      tableLoading:MaterialLoading
    }

    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='????????????'>
              {getFieldDecorator('code', {

              })(
                <SelectTableRedis
                  on={on}
                  data={datas}
                />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            {/*<FormItem label='??????????????????'>
              {getFieldDecorator('name')(<Input placeholder='???????????????????????????' />)}
            </FormItem>*/}
          </Col>
          {/*  <Col md={8} sm={24}>
            <span>
              <Button type="primary" onClick={this.findList}>
                ??????
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
               ??????
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
        if (res.errMsg === "??????") {
          message.success("????????????", 1, () => {
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
          message.error("????????????")
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
        message.success('????????????', 1.5, () => {
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
        if (res.errMsg === "??????") {
          message.success('????????????', 1.5, () => {
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
          message.error("??????????????????,???????????????")
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
            if (res.errMsg === "??????") {
              message.success("????????????", 1, () => {
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
                      if (res.errMsg === '??????') {
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
              message.error("????????????")
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
            if (res.errMsg === "??????") {
              message.success("????????????", 1, () => {
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
                      if (res.errMsg === '??????') {
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
              message.error("????????????")
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
            if (res.errMsg === "??????") {
              message.success("????????????", 1, () => {
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
                      if (res.errMsg === '??????') {
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
              message.error("????????????")
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
                ??????
              </Button>
              <Button icon="plus" disabled={!this.state.superId} onClick={this.handleCorpAdd} type="primary" style={{ marginLeft: '12px' }}>
                ???????????????
              </Button>
              <Button icon="plus" disabled={!this.state.superId} onClick={this.uploadAdd} type="primary" style={{ marginLeft: '12px' }}>
                ????????????
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
            <Button type={'primary'} style={{ display: `${submitStatus ? 'none' : ''}` }} onClick={this.onTijiao}>??????</Button>
          </div>
        </Card>

        <Modal
          title={"????????????"}
          visible={uploadvisible}
          onOk={this.uploadOk}
          onCancel={this.uploadCancel}
        >
          <Upload {...props} >
            <Button >
              <Icon type="upload" /> ????????????
            </Button>
          </Upload>
        </Modal>
        <Modal
          title={"??????"}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>????????????????????????????????????BOM??????????????????????????????
            ????????????????????????????????????????????????</p>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Routing;
