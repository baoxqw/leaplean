import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import './style.less'
import NotTreeTable from '@/pages/tool/TreeTable/NotTreeTable';
import { toTree } from '@/pages/tool/ToTree';
import styles from '../../Sysadmin/UserAdmin.less';
import { Table, Button,Checkbox, Input, message, Popconfirm,Form, Divider, DatePicker } from 'antd';
import isEqual from 'lodash/isEqual';
import NormalTable from '@/components/NormalTable';
import NotSelectTableRedis from '@/pages/tool/SelectTableRedis/NotSelectTableRedis';
@connect(({ bom,loading }) => ({
  bom,
  loading:loading.models.bom
}))
@Form.create()
class BomCadd extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      status:false,
      checked: true,
      TableWorkData:[],
      SelectWorkValue:[],
      selectedWorkRowKeys:[],
      WorkConditions:[],
      pageWork:{},
      version:0,

      TreeMaterialData:[], //存储左边树的数据
      MaterialConditions:[], //存储查询条件
      material_id:null, //存储立项人左边数点击时的id  分页时使用
      TableMaterialData:[], //存储表数据  格式{list: response.resData, pagination:{total: response.total}}
      SelectMaterialValue:[], //存储右表选中时时的name  初始进来时可以把获取到的name存入进来显示
      selectedMaterialRowKeys:[], //立项人  存储右表选中时的挣个对象  可以拿到id
      pageMaterial:{},
      materialcode:''
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let data = nextProps.data;
    if (data === undefined || !data){
      this.setState({
        data:[]
      });
      return
    }
    if(nextProps.data !== this.props.data){
      this.setState({
        data
      })
    }
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { bomCardAddDate,dispatch }  = this.props;
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `${data.length+1}`,
      materialBaseId: null,
      ucumId: null,
      sl: null,
      fsl: null,
      zpwz:null,
      shxs:null,
      zptqq:null,
      scq:null,
      cs:null,
      bn:null,
      materialcode:null,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
    if(typeof bomCardAddDate === 'function'){

      bomCardAddDate(newData)
    }

    //bomCardAddDate(newData)
  };

  remove(key,bomCardAddDate) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    if(typeof bomCardAddDate === 'function'){
      bomCardAddDate(newData)
    }
    // onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFChange(date,dateString, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = dateString;
      this.setState({ data: newData });
    }
  }
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(fieldName === "materialname"){
        target[fieldName] = e.materialname
        target["materialBaseId"] = e.selectedRowKeys
        target["ucumId"] = e.ucumId;
        target["ucumname"] = e.ucumname;
        target["materialcode"] = e.materialCode;
      }
      else {
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key,u) {
    const { bomCardAddDate,dispatch }  = this.props;
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if ( !target.materialBaseId
      ) {
        message.error('物料不能为空');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      if ( !target.sl
        ) {
          message.error('数量不能为空');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }
      delete target.isNew;

      this.toggleEditable(e, key);
      const { data } = this.state;

      if(typeof bomCardAddDate === 'function'){

        bomCardAddDate(data)
      }
      // const { onChange } = this.props;
      // onChange(data);

      bomCardAddDate(data)
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }


  cancelLick = (cancel)=>{
    if(typeof cancel === 'function'){
      cancel()
    }
  };


  render() {
    const { bomCardAddDate,dispatch }  = this.props;

    const { checked} = this.state

    const columns = [
      {
        title: '物料名称',
        dataIndex: 'materialname',
        key: 'materialname',
        render: (text, record) => {
          const on = {
            onOk:(selectedRowKeys,selectedRows)=>{
              if(!selectedRowKeys || !selectedRows){
                return
              }
              let ucumId = null;
              let ucumname = '';
              let materialCode = ''
              const nameList = selectedRows.map(item =>{
                ucumId = item.ucumId;
                ucumname = item.ucumName;
                materialCode = item.code
                return item.name
              });

              this.handleFieldChange({selectedRowKeys:selectedRowKeys[0],materialname:nameList[0],ucumId,ucumname,materialCode}, 'materialname', record.key)
            }, //模态框确定时触发
            onButtonEmpty:()=>{
              this.handleFieldChange({selectedRowKeys:null,materialname:"",ucumId:null,ucumname:"",materialCode:""}, 'materialname', record.key)
            }
          };
          const datas = {
            SelectValue:text, //框选中的集合
            selectedRowKeys:[record.materialBaseId], //右表选中的数据
            placeholder:'请选择物料',
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
            title:'物料选择',
            tableType: 'bom/fetchMataCon',
            treeType: 'bom/matype',
            treeCode:'invclId',
          }
          if (record.editable) {
            return <NotSelectTableRedis
              on={on}
              data={datas}
            />
          }
          return text;
        },
      },
      {
        title: '物料编码',
        dataIndex: 'materialcode',
        key: 'materialcode',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                disabled
                placeholder="物料编码"
              />
            );
          }
          return text;
        },
      },
      {
        title: '计量单位',
        dataIndex: 'ucumname',
        key: 'ucumname',

        render: (text, record) => {
          if (record.editable) {
            return <Input placeholder={"请选择物料"} disabled value={text}/>
          }
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'sl',
        key: 'sl',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type={"Number"}
                value={text}

                onChange={e => this.handleFieldChange(e, 'sl', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="数量"
              />
            );
          }
          return text;
        },
      },
      {
        title: '辅数量',
        dataIndex: 'fsl',
        key: 'fsl',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={"Number"}
                onChange={e => this.handleFieldChange(e, 'fsl', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="辅数量"
              />
            );
          }
          return text;
        },
      },
      {
        title: '装配位置',
        dataIndex: 'zpwz',
        key: 'zpwz',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={"Number"}
                onChange={e => this.handleFieldChange(e, 'zpwz', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="装配位置"
              />
            );
          }
          return text;
        },
      },
      {
        title: '损耗系数',
        dataIndex: 'shxs',
        key: 'shxs',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={"Number"}
                onChange={e => this.handleFieldChange(e, 'shxs', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="损耗系数"
              />
            );
          }
          return text;
        },
      },
      {
        title: '装配提前期',
        dataIndex: 'zptqq',
        key: 'zptqq',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={"Number"}
                onChange={e => this.handleFieldChange(e, 'zptqq', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="装配提前期"
              />
            );
          }
          return text;
        },
      },
      {
        title: '单件工艺定额',
        dataIndex: 'scq',
        key: 'scq',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={"Number"}
                onChange={e => this.handleFieldChange(e, 'scq', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="单件工艺定额"
              />
            );
          }
          return text;
        },
      },
      {
        title: '下料尺寸',
        dataIndex: 'cs',
        key: 'cs',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}

                onChange={e => this.handleFieldChange(e, 'cs', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="下料尺寸"
              />
            );
          }
          return text;
        },
      },
      {
        title: '毛坯可制数',
        dataIndex: 'bn',
        key: 'bn',

        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={"Number"}
                onChange={e => this.handleFieldChange(e, 'bn', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="毛坯可制数"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed:'right',
        dataIndex: 'caozuo',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key,bomCardAddDate)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,bomCardAddDate)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key,bomCardAddDate)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,bomCardAddDate)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;
    return (
      <div >
        <NormalTable
          style={{marginTop:'8px'}}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          disabled={status}
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增信息
        </Button>

      </div>
    );
  }
}

export default BomCadd;
