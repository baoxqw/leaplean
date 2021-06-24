import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import styles from '../../Sysadmin/UserAdmin.less';
import { Table, Button,Checkbox, Input, message, Popconfirm,Form, Divider } from 'antd';
import NormalTable from '@/components/NormalTable';
import NotSelectTableRedis from '@/pages/tool/SelectTableRedis/NotSelectTableRedis';

@connect(({ workline,loading }) => ({
  workline,
  loading:loading.models.bom
}))
@Form.create()
class WorkCard extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
      value: props.value,
      status:false,
      checked: true,
      version:0,

      SelectMaterialValue:[],
      selectedMaterialRowKeys:[],
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
      materialId: null,
      materialCode:"",
      materialName:[],
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key,bomCardAddDate) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    const deleteData = data.filter(item => item.key === key);
    this.setState({ data: newData });
    if(typeof bomCardAddDate === 'function'){
      bomCardAddDate(deleteData,'delete')
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
      if(fieldName === "materialName"){
        target[fieldName] = e.materialName
        target["materialId"] = e.selectedRowKeys
        target["materialCode"] = e.materialCode;
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
      if ( !target.materialId
      ) {
        message.error('物料不能为空');
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
        bomCardAddDate(target,'save')
      }
      // const { onChange } = this.props;
      // onChange(data);
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
    const { bomCardAddDate,status }  = this.props;

    const columns = [
      {
        title: '存货名称',
        dataIndex: 'materialName',
        key: 'materialName',
        render: (text, record) => {
          const on = {
            onOk:(selectedRowKeys,selectedRows)=>{
              if(!selectedRowKeys || !selectedRows){
                return
              }
              let materialCode = ''
              const nameList = selectedRows.map(item =>{
                materialCode = item.code
                return item.name
              });
              this.handleFieldChange({selectedRowKeys:selectedRowKeys[0],materialName:nameList[0],materialCode}, 'materialName', record.key)
            }, //模态框确定时触发
            onButtonEmpty:()=>{
              this.handleFieldChange({selectedRowKeys:null,materialName:[],materialCode:""}, 'materialName', record.key)
            },
            onGetCheckboxProps: (record) => {
              return { disabled: record.materialForm === "原材料" }
            },
          };
          const datas = {
            SelectValue:text, //框选中的集合
            selectedRowKeys:[record.materialId], //右表选中的数据
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
            tableType: 'workline/fetchMata',
            treeType: 'workline/matype',
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
        title: '存货编码',
        dataIndex: 'materialCode',
        key: 'materialCode',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                disabled
                placeholder="货存编码"
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

export default WorkCard;
