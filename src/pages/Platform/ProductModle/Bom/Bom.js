import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Cadd from './BomCard';
import SelectTableRedis from '@/pages/tool/SelectTableRedis';
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Divider,
  Button,
  Card,
  Tabs,
  Icon,
  Upload,
  message,
  Popconfirm,
  Checkbox,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Sysadmin/UserAdmin.less';
import './bom.less'
import router from 'umi/router';
import SelfAdd from './SelfAdd';
import CopySelfAdd from './CopySelfAdd';
import UpdateSelfAdd from './SelfUpdate';

const { TabPane } = Tabs;
const { TextArea } = Input;
const FormItem = Form.Item;

@connect(({ bom, loading }) => ({
  bom,
  loading: loading.models.bom,
  listLoading: loading.effects['bom/findbomlist'],
  childLoading: loading.effects['bom/fetchchild'],
  addLoading: loading.effects['bom/add'],
  MaterialLoading:loading.effects['bom/fetchMataCon'],
}))
@Form.create()
class Bom extends PureComponent {
  state = {
    defaultvisible: false,
    childData: [],
    recordData: {},
    superId: null,
    defaultId: null,
    record: {
      id: null
    },
    //历史变更详情
    detailed: false,
    HDHT: {},
    addCopy: {},
    cardList: [],
    TreeMaterialData: [], //存储左边树的数据
    MaterialConditions: [], //存储查询条件
    material_id: null, //存储立项人左边数点击时的id  分页时使用
    TableMaterialData: [], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
    SelectMaterialValue: [], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
    selectedMaterialRowKeys: [], //立项人  存储右表选中时的挣个对象  可以拿到id

    addShow: true,
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
    uploadvisible: false,
    fileList: [],
    deleteFileList: [],
    cardListChild: [],
    cardListAdd: [],
    addSelfVisible: false,
    addCopyVisible: false,
    updateSelfVisible: false,
    submitStatus: true,
    page: {
      pageSize: 10,
      pageIndex: 0
    },
    selectRecord: {},
    version:1,
  };

  bomCard = (res) => {
    const { dispatch } = this.props;
    res.map(item => {
      delete item.bomId
      item.bomId = this.state.superId
      delete item.editable;
      return item
    })
    dispatch({
      type: 'bom/subti',
      payload: {
        reqDataList: res
      },
      callback: (res) => {


      }
    })
    /*    let a = {}
        if(res){
          res.map(item=>{
            a.materialBaseId = item.materialBaseId
            a.sl = item.sl
            a.ucumId = item.ucumId
            a.fsl = item.fsl
            a.defaultFlag = item.defaultFlag?1:0

          })
        }
        this.setState({
          cardList:res
        })*/
  };

  handleAdd = (e) => {
    this.setState({
      addSelfVisible: true
    })
    /* const { selectedMaterialRowKeys, SelectMaterialValue, ucumname, ucumId } = this.state
     let d = {
       ucumId,
       ucumname,
       materialid: selectedMaterialRowKeys[0],
       materianame: SelectMaterialValue,
       copy: false,
     }
     e.preventDefault();
     router.push('/platform/productmodle/bom/add', { addCopy: d })*/
  };

  handleCorpAdd = (e) => {
    this.setState({
      addCopyVisible: true,
    })
    /* const { selectedMaterialRowKeys, SelectMaterialValue, ucumname, ucumId } = this.state
     let d = {
       ucumId,
       ucumname,
       materialid: selectedMaterialRowKeys[0],
       materianame: SelectMaterialValue,
       ...this.state.addCopy,
       copy: true,
     }
     e.preventDefault();
     router.push('/platform/productmodle/bom/add', { addCopy: d })*/
  };

  updataRoute = (e, record) => {
    this.setState({
      updateSelfVisible: true,
    })
    /*e.preventDefault();
    router.push('/platform/productmodle/bom/update', { record });*/
  };

  updataRouteChild = (e, record) => {
    e.preventDefault();
    const obj = {
      ...record,
      supId: this.state.superId,
    }
    router.push('/platform/productmodle/bom/bomchildupdate', { obj: obj });
  };

  toggleForm = () => {
    const { expandForm } = this.state
    this.setState({ expandForm: !expandForm })
  };

  handleDelete = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    const { selectedMaterialRowKeys } = this.state
    dispatch({
      type: 'bom/delete',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res) {
          message.success("删除成功", 1, () => {
            this.setState({
              superId: null,
              rowId: null,
              addCopy: {},
              cardListChild:[]
            })
            if (selectedMaterialRowKeys[0]) {
              let conditions = [{
                code: 'MATERIAL_BASE_ID',
                exp: '=',
                value: selectedMaterialRowKeys[0]
              }]
              dispatch({
                type: 'bom/findbomlist',
                payload: {
                  pageIndex: 0,
                  pageSize: 1000,
                  conditions
                },
                callback: (res) => {
                  if (res) {
                    this.setState({
                      cardList: res,
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  }

  handleDeleteChlid = (record) => {
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'bom/deletechild',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        if (res) {
          message.success("删除成功", 1, () => {
            const conditions = [{
              code: 'BOM_ID',
              exp: '=',
              value: this.state.superId + ''
            }]
            dispatch({
              type: 'bom/fetchchild',
              payload: {
                conditions
              },
              callback: (res) => {
                this.setState({
                  childData: res
                })
              }
            })
          })
        }
      }
    })
  }

  //查询
  findList = () => {
    const { selectedMaterialRowKeys } = this.state
    const { dispatch } = this.props;
    if (selectedMaterialRowKeys[0]) {
      let conditions = [{
        code: 'MATERIAL_BASE_ID',
        exp: '=',
        value: selectedMaterialRowKeys[0]
      }]
      dispatch({
        type: 'bom/findbomlist',
        payload: {
          conditions
        },
        callback: (res) => {
          if (res) {
            this.setState({
              cardList: res,
            })
          }
        }
      })
    }
  }

  //取消
  handleFormReset = () => {
    const { form } = this.props;
    const { selectedMaterialRowKeys } = this.state
    //清空输入框
    form.resetFields();
    //清空后获取列表
    this.setState({
      selectedMaterialRowKeys: [],
      cardList: [],
      childData: [],
      SelectMaterialValue: [],
      addShow: true,
      superId: null,
      selectRecord: null
    })

  };

  uploadAdd = () => {
    const { dispatch } = this.props;
    const { page, superId } = this.state;
    dispatch({
      type: 'bom/fetchList',
      payload: {
        reqData: {
          bill_id: superId,
          type: 'technologybom'
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

  uploadOk = () => {
    const { dispatch } = this.props
    const { fileList, superId, deleteFileList } = this.state
    const formData = new FormData();
    if (fileList.length > 0) {
      fileList.forEach(file => {
        formData.append('files[]', file.originFileObj ? file.originFileObj : file);
        formData.append('type', 'technologybom');
        formData.append('parentpath', 'technologybom');
        formData.append('bill_id', superId);
      });
    }
    if (deleteFileList.length) {
      for (let i = 0; i < deleteFileList.length; i++) {
        dispatch({
          type: 'bom/deleteend',
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
      type: 'bom/upload',
      payload: formData,
      callback: (res) => {
        message.success('上传成功', 1.5, () => {
          this.setState({ uploadvisible: false })
        })
      }
    })

  }

  renderForm() {
    const {
      form: { getFieldDecorator },
      loading,
      MaterialLoading,
      dispatch
    } = this.props;
    const { expandForm, superId, cardList } = this.state
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
          selectRecord: selectedRows[0],
          addShow: false,
          cardListChild: [],
        })
        if (selectedRowKeys[0]) {
          let conditions = [{
            code: 'MATERIAL_BASE_ID',
            exp: '=',
            value: selectedRowKeys[0]
          }]
          dispatch({
            type: 'bom/findbomlist',
            payload: {
              conditions
            },
            callback: (res) => {
              this.setState({
                cardList: res,
              })
            }
          })

        }
      }, //模态框确定时触发
      onButtonEmpty: (onChange) => {
        const { form } = this.props;
        //清空输入框
        form.resetFields();
        onChange([])
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
      onGetCheckboxProps: (record) => {
        return { disabled: record.materialType === "采购件" }
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
        {label:'综合查询',code:'code',placeholder:'请输入查询内容'},
      ],
      title: '物料选择',
      tableType: 'bom/fetchMataCon',
      treeType: 'bom/matype',
      treeCode:'invclId',
      tableLoading:MaterialLoading,
    }
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={16}>
            <FormItem label='物料名称'>
              {getFieldDecorator('code')(<SelectTableRedis
                on={on}
                data={datas}
              />)}
            </FormItem>
          </Col>
          <Col md={8} sm={16}>

          </Col>
          {/* <Col md={8} sm={24}>
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  };

  defaultchege = (e, record) => {
    if (e.target.checked) {
      this.setState({
        defaultvisible: true,
        record
      })
    }
    const { cardList } = this.state;
    /*    cardList.list.map(item => {
          if(record.id === item.id){
            item.defaultFlag = e.target.checked
          }
          return item
        });*/
    this.setState({
      cardList,
      record
    })
  }

  handleOk = e => {
    const { dispatch } = this.props;
    const { fileList, rowId } = this.state;
    const formData = new FormData();
    if (fileList.length > 0) {
      fileList.forEach(file => {
        formData.append('files[]', file);
        formData.append('parentpath', 'contract');
        formData.append('bill_id', rowId);
      });
    } else {
      message.error('请先选择文件')
      return
    }
    dispatch({
      type: 'CMX/uploadList',
      payload: formData,
      callback: (res) => {
        message.success('上传成功', 1.5, () => {
          this.setState({
            uploadShow: false,
            fileList: [],
          });
        })
      }
    })
  };

  handleCancel = e => {
    this.setState({
      uploadShow: false,
    });
  };

  addChild = () => {
    router.push('/platform/productmodle/bom/bomchildadd', { id: this.state.superId });
  }

  copyaddChild = () => {
    router.push('/platform/productmodle/bom/add',);
  }

  detailed = (e, record) => {
    e.preventDefault();
    const { id } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'CMX/historyDetails',
      payload: {
        reqData: {
          id
        }
      },
      callback: (res) => {
        this.setState({
          detailed: true,
          HDHT: res
        })
      }
    });

  };

  callback = (key) => {

  };

  aa = (record) => {
    this.setState({
      defaultId: record.id,
      defaultvisible: true
    })
  }

  defaultOk = () => {
    const { record, selectedMaterialRowKeys } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'bom/default',
      payload: {
        reqData: {
          id: record.id
        }
      },
      callback: (res) => {
        if (res.errMsg === '成功') {
          message.success('默认版本已更改', 1.5, () => {
            if (selectedMaterialRowKeys[0]) {
              let conditions = [{
                code: 'MATERIAL_BASE_ID',
                exp: '=',
                value: selectedMaterialRowKeys[0]
              }]
              dispatch({
                type: 'bom/findbomlist',
                payload: {
                  conditions
                },
                callback: (res) => {
                  if (res) {
                    this.setState({
                      cardList: res,
                    })
                  }
                }
              })
            }
            this.setState({
              defaultvisible: false
            })
          })
        }
      }
    })
  }

  defaultCancel = () => {
    const { cardList, record } = this.state;
    cardList.map(item => {
      if (record.id === item.id) {
        item.defaultFlag = false
      }
      return item
    });
    this.setState({
      defaultvisible: false,
      cardList
    });
  }

  uploadCancel = () => {
    this.setState({
      uploadvisible: false,
      deleteFileList: [],
      fileList: [],
    })
  }

  bomCardAddDate = (res) => {
    const { cardListChild } = this.state
    let cardListChildStr = JSON.stringify(cardListChild)
    let resStr = JSON.stringify(res)
    let c = cardListChildStr === resStr
    this.setState({
      cardListAdd: res,
      submitStatus: c
    })
  };

  onTijiao = () => {
    const { cardListAdd, superId, conditions2 } = this.state;
    const { dispatch } = this.props;

    if (cardListAdd.length > 0) {
      cardListAdd.map((item) => {
        if (item.id) {
          delete item.id
        }
        delete item.bomId
        item.bomId = superId
        delete item.editable;
        return item
      })
    }
    //
    dispatch({
      type: 'bom/subti',
      payload: {
        reqDataList: cardListAdd,
        reqData: {
          bomId: superId
        }
      },
      callback: (res) => {
        if (res.errMsg === "成功") {
          message.success('成功', 1, () => {
            const conditions = [{
              code: 'BOM_ID',
              exp: '=',
              value: superId + ''
            }]
            dispatch({
              type: 'bom/fetchchild',
              payload: {
                pageSize: 10,
                pageIndex: 0,
                conditions
              },
              callback: (res) => {
                this.setState({
                  cardListAdd: [],
                  submitStatus: true
                })
              }
            })
          })


        } else {
          message.error("子表创建失败,请检查数据")
        }
      }
    })
  }

  render() {
    const {
      loading,
      listLoading,
      childLoading,
      bom: { data },
      dispatch,
      uploading,
      addLoading
    } = this.props;
    const { addCopyVisible, updateSelfVisible, superId, addSelfVisible, record, submitStatus,version,
      cardListAdd, fileList, cardList, childData, uploadvisible, cardListChild, selectRecord } = this.state;

    const columns = [
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
        title: '版本',
        dataIndex: 'version',

      },
      {
        title: '是否默认',
        dataIndex: 'defaultFlag',
        render: (text, record) => {
          if (text) {
            return <Checkbox checked={text} />
          } else {
            return <Checkbox checked={text} onChange={(e) => this.defaultchege(e, record)} />
          }

        }
      },
      {
        title: formatMessage({ id: 'validation.operation' }),
        dataIndex: 'caozuo',
        fixed: 'right',
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRoute(e, record)}>编辑</a>
            {/* <Divider type="vertical" />
            <a href="#javascript:;" disabled={record.defaultFlag} onClick={(e)=>this.aa(record)}>默认版本</a>*/}
          </Fragment>
        },
      },
    ];
    const information = [
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
        dataIndex: 'ucumName'
      },
      {
        title: '物料编码',
        dataIndex: 'materialBaseName'
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
        title: formatMessage({ id: 'validation.operation' }),
        render: (text, record) => {
          return <Fragment>
            <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDeleteChlid(record)}>
              <a href="#javascript:;">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#javascript:;" onClick={(e) => this.updataRouteChild(e, record)}>编辑</a>
          </Fragment>
        },
      },
    ];
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
    //子表新建
    const OnChild = {
      onOk: (res) => {
        if (res.length > 0) {
          res.map((item) => {
            if (item.id) {
              delete item.id
            }

            delete item.bomId
            item.bomId = superId
            delete item.editable;
            return item
          })
        }
        dispatch({
          type: 'bom/subti',
          payload: {
            reqDataList: res
          },
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success('新建成功')
            }
          }
        })
      },
    }
    // 主表新建
    const onSelf = {
      onSave: (obj, clear, is) => {
        dispatch({
          type: 'bom/add',
          payload: obj,
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
                clear();
                this.setState({
                  addSelfVisible: false
                });
                if (is) {
                  const { dispatch } = this.props
                  dispatch({
                    type: 'bom/default',
                    payload: {
                      reqData: {
                        id: res.id
                      }
                    },
                    callback: (res) => {
                      if (res.errMsg === '成功') {
                        const { selectedMaterialRowKeys } = this.state
                        const { dispatch } = this.props;
                        if (selectedMaterialRowKeys[0]) {
                          let conditions = [{
                            code: 'MATERIAL_BASE_ID',
                            exp: '=',
                            value: selectedMaterialRowKeys[0]
                          }]
                          dispatch({
                            type: 'bom/findbomlist',
                            payload: {
                              conditions
                            },
                            callback: (res) => {
                              if (res) {
                                this.setState({
                                  cardList: res,
                                })
                              }
                            }
                          })
                        }
                      }
                    }
                  })
                }
                const { selectedMaterialRowKeys } = this.state
                const { dispatch } = this.props;
                if (selectedMaterialRowKeys[0]) {
                  let conditions = [{
                    code: 'MATERIAL_BASE_ID',
                    exp: '=',
                    value: selectedMaterialRowKeys[0]
                  }]
                  dispatch({
                    type: 'bom/findbomlist',
                    payload: {
                      conditions
                    },
                    callback: (res) => {
                      if (res) {
                        this.setState({
                          cardList: res,
                        })
                      }
                    }
                  })
                }

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
          addSelfVisible: false
        })
      }
    }
    const { selectedMaterialRowKeys, SelectMaterialValue, ucumname, ucumId } = this.state
    const selfdata = {
      visible: addSelfVisible,
      record: selectRecord,
      loading:addLoading,

    }
    // 复制新建
    const onCopySelf = {
      onSave: (obj, clear, is) => {
        dispatch({
          type: 'bom/add',
          payload: obj,
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("新建成功", 1, () => {
                clear();
                this.setState({
                  addCopyVisible: false,
                  superId: null,
                  rowId: null,
                  addCopy: {}
                });
                if (is) {
                  const { dispatch } = this.props
                  dispatch({
                    type: 'bom/default',
                    payload: {
                      reqData: {
                        id: res.id
                      }
                    },
                    callback: (res) => {
                      if (res.errMsg === '成功') {
                        const { selectedMaterialRowKeys } = this.state
                        const { dispatch } = this.props;
                        if (selectedMaterialRowKeys[0]) {
                          let conditions = [{
                            code: 'MATERIAL_BASE_ID',
                            exp: '=',
                            value: selectedMaterialRowKeys[0]
                          }]
                          dispatch({
                            type: 'bom/findbomlist',
                            payload: {
                              conditions
                            },
                            callback: (res) => {
                              if (res) {
                                this.setState({
                                  cardList: res,
                                })
                              }
                            }
                          })
                        }
                      }
                    }
                  })
                }
                const { selectedMaterialRowKeys } = this.state
                const { dispatch } = this.props;
                if (selectedMaterialRowKeys[0]) {
                  let conditions = [{
                    code: 'MATERIAL_BASE_ID',
                    exp: '=',
                    value: selectedMaterialRowKeys[0]
                  }]
                  dispatch({
                    type: 'bom/findbomlist',
                    payload: {
                      conditions
                    },
                    callback: (res) => {
                      if (res) {
                        this.setState({
                          cardList: res,
                        })
                      }
                    }
                  })
                }

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
          addCopyVisible: false,

        })
      }
    }
    const selfCopydata = {
      visible: addCopyVisible,
      record: {
        ucumId,
        ucumname,
        materialid: selectedMaterialRowKeys[0],
        materianame: SelectMaterialValue,
        ...this.state.addCopy,

      },
      loading:addLoading
    }
    // 主表编辑
    const onUpdateSelf = {
      onSave: (obj, clear, is) => {
        dispatch({
          type: 'bom/add',
          payload: obj,
          callback: (res) => {
            if (res.errMsg === "成功") {
              message.success("编辑成功", 1, () => {
                clear();
                this.setState({
                  updateSelfVisible: false,
                  superId: null,
                  rowId: null,
                  addCopy: {}
                });
                if (is) {
                  const { dispatch } = this.props
                  dispatch({
                    type: 'bom/default',
                    payload: {
                      reqData: {
                        id: res.id
                      }
                    },
                    callback: (res) => {
                      if (res.errMsg === '成功') {
                        const { selectedMaterialRowKeys } = this.state
                        const { dispatch } = this.props;
                        if (selectedMaterialRowKeys[0]) {
                          let conditions = [{
                            code: 'MATERIAL_BASE_ID',
                            exp: '=',
                            value: selectedMaterialRowKeys[0]
                          }]
                          dispatch({
                            type: 'bom/findbomlist',
                            payload: {
                              conditions
                            },
                            callback: (res) => {
                              if (res) {
                                this.setState({
                                  cardList: res,
                                })
                              }
                            }
                          })
                        }
                      }
                    }
                  })
                }
                const { selectedMaterialRowKeys } = this.state
                const { dispatch } = this.props;
                if (selectedMaterialRowKeys[0]) {
                  let conditions = [{
                    code: 'MATERIAL_BASE_ID',
                    exp: '=',
                    value: selectedMaterialRowKeys[0]
                  }]
                  dispatch({
                    type: 'bom/findbomlist',
                    payload: {
                      conditions
                    },
                    callback: (res) => {
                      if (res) {
                        this.setState({
                          cardList: res,
                        })
                      }
                    }
                  })
                }

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
          updateSelfVisible: false,

        })
      }
    }
    const selfUpdatedata = {
      visible: updateSelfVisible,
      record: {
        ucumId,
        ucumname,
        materialid: selectedMaterialRowKeys[0],
        materianame: SelectMaterialValue,
        ...this.state.addCopy,

      },
      loading:addLoading
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.userAdminForm}>{this.renderForm()}</div>
          <NormalTable
            loading={listLoading}
            data={cardList}
            columns={columns}
            scroll={{ y: 260 }}
            classNameSaveColumns={"BomIndex5"}
            pagination={false}
            onRow={(record) => {
              return {
                onClick: () => {
                  this.setState({
                    superId: record.id,
                    rowId: record.id,
                    addCopy: record
                  })
                  const { dispatch } = this.props;
                  //表体
                  if (record.id) {
                    const conditions = [{
                      code: 'BOM_ID',
                      exp: '=',
                      value: record.id + ''
                    }]
                    dispatch({
                      type: 'bom/fetchchild',
                      payload: {
                        pageSize: 100000,
                        pageIndex: 0,
                        conditions
                      },
                      callback: (res) => {
                        console.log('表体',res)
                        let a = res
                        if (!res || res.length < 0) {
                          return
                        }
                        a.map((item, i) => {
                          item.key = i
                          delete item.bomId
                          item.bomId = record.id
                          delete item.editable;
                          return item
                        })
                        this.setState({
                          cardListChild: a
                        })
                      }
                    })
                  }
                },
                rowKey: record.id
              }
            }}
            //onChange={this.handleStandardTableChange}
            rowClassName={this.setRowClassName}
            title={() => <div >
              <Button icon="plus" disabled={this.state.addShow} onClick={this.handleAdd} type="primary" >
                新建
              </Button>
              <Button icon="plus" disabled={!this.state.superId} onClick={this.handleCorpAdd} type="primary" style={{ marginLeft: '12px' }}  >
                复制并新建
              </Button>
              <Button icon="plus" disabled={!this.state.superId} onClick={this.uploadAdd} type="primary" style={{ marginLeft: '12px' }}>
                上传附件
              </Button>
            </div>
            }
          />
          <Modal
            title="提示"
            visible={this.state.defaultvisible}
            onOk={this.defaultOk}
            onCancel={this.defaultCancel}
          >
            <b>
              当前物料已存在默认版本的BOM，继续保存将使原来的
              默认版本变为普通版本，是否继续？
            </b>
          </Modal>
        </Card>
        <SelfAdd on={onSelf} data={selfdata} />
        <CopySelfAdd on={onCopySelf} data={selfCopydata} />
        <UpdateSelfAdd on={onUpdateSelf} data={selfUpdatedata} />
        <Card bordered={false} style={{ marginTop: '15px' }}>
          <Tabs onChange={this.callback}>
            <TabPane tab="基本信息" key="1">
              <Cadd data={cardListChild} on={OnChild} loading={loading} bomCardAddDate={this.bomCardAddDate} />

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button type={'primary'} style={{ display: `${submitStatus ? 'none' : ''}` }} onClick={this.onTijiao}>提交</Button>
              </div>
              {/*<BomCard  data={childData} bomCard={this.bomCard}/>*/}
              {/* <NormalTable
                loading={childLoading}
                data={childData}
                columns={information}
              />*/}
            </TabPane>
            <TabPane tab="备料信息" key="2">

            </TabPane>
            <TabPane tab="控制信息" key="3">

            </TabPane>
          </Tabs>
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
      </PageHeaderWrapper>
    );
  }
}

export default Bom;
