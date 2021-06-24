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
  Tree,
  message, Popconfirm, Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { toTree, getParentKey } from '@/pages/tool/ToTree';
import XLSX from 'xlsx';
import ExportJsonExcel from 'js-export-excel';
import './tableBg.less';
import MaterialAdd from '@/pages/Platform/Basicdata/Material/MaterialAdd';
import MaterialUpdate from '@/pages/Platform/Basicdata/Material/MaterialUpdate';
import IntegratedQuery from '@/pages/tool/prompt/IntegratedQuery';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const { TreeNode } = Tree;
const Search = Input.Search;

@connect(({ material, loading }) => ({
  material,
  queryLoading: loading.effects['material/fetch'],
  addLoading: loading.effects['material/add'],
}))
@Form.create()
class Material extends PureComponent {
  state = {
    addVisible: false,
    updateVisible: false,
    record: {},
    valueList: [],
    dataList: [],
    info: {},
    conditions: [],
    page: {
      pageIndex: 0,
      pageSize: 10,
    },
    query: '',
    selectedKeys: [],
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    inputFileName: '未选择任何文件',
  };

  columns = [
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
      title: '物料分类',
      dataIndex: 'invclName',
      key: 'invclName',

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
      title: '生产厂家',
      dataIndex: 'factoryName',
      key: 'factoryName',
    },
    {
      title: '封装模式',
      dataIndex: 'packageForm',
      key: 'packageForm',
    },
    {
      title: '质量等级',
      dataIndex: 'qualityLevel',
      key: 'qualityLevel',
    },
    {
      title: '总规范/标准代号',
      dataIndex: 'norm',
      key: 'norm',
    },
    {
      title: '操作',
      dataIndex: 'caozuo',
      fixed: 'right',
      render: (text, record) =>
        <Fragment>
          <a href="#javascript:;" onClick={(e) => this.handleUpdate(e, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record)}>
            <a href="#javascript:;">删除</a>
          </Popconfirm>
        </Fragment>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;
    dispatch({
      type: 'material/matype',
      payload: {
        reqData: {},
      },
      callback: (res) => {
        if (res.resData) {
          const a = toTree(res.resData);
          this.setState({
            dataList: res.resData,
            valueList: a,
          });
        }
      },
    });
    //表格数据
    dispatch({
      type: 'material/fetch',
      payload: {
        ...page,
      },
    });
  }

  //查询
  handleSearch = (e) => {
    const { form, dispatch } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { code } = values;
      dispatch({
        type: 'material/fetch',
        payload: {
          reqData: {
            value: code,
          },
          pageIndex: 0,
          pageSize: 10,
        },
      });
      this.setState({
        query: code,
        page: {
          pageIndex: 0,
          pageSize: 10,
        },
      });
    });
  };
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
      },
      query: '',
      expandedKeys: [],
      selectedKeys: [],
    });
    dispatch({
      type: 'material/fetch',
      payload: {
        pageIndex: 0,
        pageSize: 10,
      },
    });
  };
  //编辑
  handleUpdate = (e, record) => {
    e.preventDefault();
    this.setState({
      record,
      updateVisible: true,
    });
  };
  //新建
  handleModalVisible = () => {
    this.setState({
      addVisible: true,
    });
  };
  //删除
  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'material/delete',
      payload: {
        reqData: {
          id: record.id,
        },
      },
      callback: (res) => {
        if (res.errCode === '0') {
          message.success('删除成功', 1.5, () => {
            const { query, page,conditions } = this.state;
            dispatch({
              type: 'material/fetch',
              payload: {
                ...page,
                reqData: {
                  value: query,
                },
                conditions
              },
            });
          });
        } else {
          message.error('删除失败');
        }
      },
    });
  };

  onSelect = (selectedKeys, info) => {
    const { dispatch } = this.props;
    this.setState({
      selectedKeys,
    });
    const obj = {
      pageIndex: 0,
      pageSize: 10,
    };
    if (info.selectedNodes[0]) {
      console.log("info",info.selectedNodes[0].props.dataRef)
      this.setState({
        info: info.selectedNodes[0].props.dataRef,
        conditions: [{
          code: 'INVCL_ID',
          exp: '=',
          value: info.selectedNodes[0].props.dataRef.id,
        }],
      });
      obj.conditions = [{
        code: 'INVCL_ID',
        exp: '=',
        value: info.selectedNodes[0].props.dataRef.id,
      }];
    } else {
      this.setState({
        conditions: [],
        info: {},
      });
    }
    dispatch({
      type: 'material/fetch',
      payload: obj,
    });
  };
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { conditions, query } = this.state;
    const obj = {
      pageIndex: pagination.current - 1,
      pageSize: pagination.pageSize,
      reqData: {
        value: query,
      },
    };
    if (conditions.length) {
      obj.conditions = conditions;
    }
    dispatch({
      type: 'material/fetch',
      payload: obj,
    });
    this.setState({
      page: obj,
    });
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

  daoChuMuBan = () => {
    let option = {};

    let arr = ['物料编码', '物料名称', '物料分类', '规格', '型号', '计量单位', '物料简称', '物料条码', '物料助记器', '图号', '物料类型', '委外类型', '物料形态', '备注']; //保存ke

    option.fileName = '物料模板';
    option.datas = [
      {
        sheetData: [],
        sheetName: 'sheet',
        sheetFilter: arr,
        sheetHeader: arr,
      },
    ];

    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();

  };

  importExcel = (file) => {

    // 获取上传的文件对象
    const { files } = file.target;
    if (files.length) {
      this.setState({
        inputFileName: files[0].name,
      });
    } else {
      this.setState({
        inputFileName: '未选择任何文件',
      });
    }

    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = event => {

      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []; // 存储获取到的数据
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            //break; // 如果只取第一张表，就取消注释这行
          }
        }
        //data = data.filter(item=> '序号' in item);

        let content = [];
        data.map(item => {
          let obj = {
            list: [],
            pagination: {
              total: 0,
              current: 1,

            },
          };

          if ('物料编码' in item) {
            obj.code = item['物料编码'].toString();
          } else {
            obj.code = null;
          }

          if ('物料名称' in item) {
            obj.name = item['物料名称'].toString();
          } else {
            obj.name = null;
          }

          if ('物料分类' in item) {
            obj.invclName = item['物料分类'].toString();
          } else {
            obj.invclName = null;
          }

          if ('型号' in item) {
            obj.model = item['型号'].toString();
          } else {
            obj.model = null;
          }

          if ('计量单位' in item) {
            obj.ucumName = item['计量单位'].toString();
          } else {
            obj.ucumName = null;
          }

          if ('物料简称' in item) {
            obj.materialshortname = item['物料简称'].toString();
          } else {
            obj.materialshortname = null;
          }

          if ('物料条码' in item) {
            obj.materialbarcode = item['物料条码'].toString();
          } else {
            obj.materialbarcode = null;
          }

          if ('物料助记码' in item) {
            obj.materialmnecode = item['物料助记码'].toString();
          } else {
            obj.materialmnecode = null;
          }

          if ('图号' in item) {
            obj.graphid = item['图号'].toString();
          } else {
            obj.graphid = null;
          }

          if ('物料类型' in item) {
            obj.materialType = item['物料类型'].toString();
          } else {
            obj.materialType = null;
          }

          if ('委外类型' in item) {
            obj.outsourcingType = item['委外类型'].toString();
          } else {
            obj.outsourcingType = null;
          }

          if ('物料形态' in item) {
            obj.materialForm = item['物料形态'].toString();
          } else {
            obj.materialForm = null;
          }

          if ('规格' in item) {
            obj.spec = item['规格'].toString();
          } else {
            obj.spec = null;
          }

          if ('备注' in item) {
            obj.memo = item['备注'].toString();
          } else {
            obj.memo = null;
          }

          content.push(obj);
        });

        if (content.length >= 2) {
          for (let i = 0; i < content.length; i++) {
            if (!content[i + 1]) {
              break;
            }
            if (content[i].code === content[i + 1].code) {
              return message.error(`物料编码重复-${content[i].code}`);
            }
          }
        }

        let status = false;
        let statusData = '';

        content.map((item) => {
          if (item.materialType === '制造件') {
            if (!item.graphid) {
              status = true;
              statusData = item.name + '是制造件,图号不能为空';
            }
          }
        });

        if (status) {
          return message.error(statusData, 2);
        }

        const { dispatch } = this.props;
        dispatch({
          type: 'material/addList',
          payload: {
            reqDataList: content,
          },
          callback: (res) => {
            if (res.errCode === '0') {
              return message.success('导入成功', 1.2, () => {
                const { query,page,conditions } = this.state;
                dispatch({
                  type: 'material/fetch',
                  payload: {
                    ...page,
                    conditions,
                    reqData:{
                      value:query
                    }
                  },
                });
              });
            } else {
              return message.error(res.userObj.msg ? res.userObj.msg : '');
            }
          },
        });
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件错误');
        return;
      }
    };
    // 以二进制方式打开文件
    if (files && files.length) {
      fileReader.readAsBinaryString(files[0]);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      material: { data },
      queryLoading,
      dispatch,
      addLoading
    } = this.props;
    const { searchValue, expandedKeys, autoExpandParent,selectedKeys,addVisible,updateVisible,record,conditions,query,page,info } = this.state;

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

    const OnAdd = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'material/add',
          payload:obj,
          callback:(res)=>{
            if(res.errCode === "0"){
              message.success("新建成功",1,()=>{
                this.setState({addVisible:false})
                clear()
                dispatch({
                  type:'material/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value:query
                    },
                    conditions
                  }
                })
              })
            }else{
              message.error("新建失败",1.5,()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          addVisible:false
        })
      }
    }
    const OnData = {
      visible:addVisible,
      record:info,
      loading:addLoading
    }

    const OnUpdate = {
      onOk:(obj,clear)=>{
        dispatch({
          type:'material/add',
          payload:obj,
          callback:(res)=>{
            if(res.errCode === "0"){
              message.success("编辑成功",1,()=>{
                this.setState({
                  updateVisible:false,
                  record: {}
                })
                clear()
                dispatch({
                  type:'material/fetch',
                  payload:{
                    ...page,
                    reqData:{
                      value:query
                    },
                    conditions
                  }
                })
              })
            }else{
              message.error("编辑失败",1.5,()=>{
                clear(1);
              })
            }
          }
        })
      },
      onCancel:(clear)=>{
        clear();
        this.setState({
          updateVisible:false,
          record: {}
        })
      }
    }
    const OnDataUpdate = {
      visible:updateVisible,
      record,
      loading:addLoading
    }

    return (
      <PageHeaderWrapper>
        <div style={{ display: 'flex' }}>
          <Card style={{ width: '25%', marginRight: '3%', boxSizing: 'border-box', overflow: 'hodden' }}
                bordered={false}>
            <div style={{ overflow: 'hidden', float: 'right', marginTop: '3px' }}> {
              selectedKeys.length ? <Button icon="plus" type="primary" onClick={this.handleModalVisible}>
                新建
              </Button> : ''
            }</div>
            <div style={{ overflow: 'hidden', borderBottom: '1px solid #f5f5f5' }}>
              <h3 style={{ height: '50px', lineHeight: '40px', float: 'left' }}>物料分类</h3>
            </div>
            <div>
              <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChangeSearch} />
              <Tree
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                selectedKeys={selectedKeys}
                onSelect={this.onSelect}
              >
                {loop(this.state.valueList)}
              </Tree>
            </div>
          </Card>
          <Card style={{ width: '75%', boxSizing: 'border-box', overflow: 'hodden' }}
                bordered={false}
                >
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={16}>
                <Col md={14} sm={16}>
                  <FormItem label='综合查询'>
                    {getFieldDecorator('code')(<Input placeholder='请输入查询条件' suffix={
                      <Tooltip title={IntegratedQuery.Material}>
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                      </Tooltip>
                    }/>)}
                  </FormItem>
                </Col>
                <Col md={10} sm={16}>
                  <span>
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
            <div style={{ marginTop: 12 }}>
              <NormalTable
                loading={queryLoading}
                data={data}
                columns={this.columns}
                classNameSaveColumns={'materialIndex1'}
                onChange={this.handleStandardTableChange}
              />
            </div>

            <MaterialAdd on={OnAdd} data={OnData}/>
            <MaterialUpdate on={OnUpdate} data={OnDataUpdate}/>
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default Material;

