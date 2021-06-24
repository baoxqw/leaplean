import React, { PureComponent, Fragment } from 'react';
import './style.less'
import NotModelTable from '@/pages/tool/ModelTable/NotModelTable';
import { connect } from 'dva';
import styles from '@/pages/Platform/Sysadmin/UserAdmin.less';
import { Table, Button, Input, message, Popconfirm,Form, Divider,  } from 'antd';

@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage
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
      value: props.value,

      TableAreaData:[],
      SelectAreaValue:[],
      selectedAreaRowKeys:[],
      AreaConditions:[],
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
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `${data.length+1}`,
      stationName:'',
      stationId:null,
      amount:null,
      tag:"",
      memo:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key,bomCard) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    if(typeof bomCard === 'function'){
      bomCard(newData)
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
      if(fieldName === "batch"){
        target["batch"] = e.target.value
      }
      else  if(fieldName === "unit"){
        target["unit"] = e.target.value
      }
      else  if(fieldName === "mny"){
        target["mny"] = e.target.value
      }
      else  if(fieldName === "stationName"){
        target["stationId"] = e.stationId
        target["stationName"] = e.stationName
        this.setState({
          SelectAreaValue:e.stationName,
          selectedAreaRowKeys:[e.stationId]
        })
      }
      else {
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key,bomCard) {
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
      let status = false;
      if(target)
      if ( !target.stationId) {
        message.error('请填写完整信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;

      this.toggleEditable(e, key);
      const { data } = this.state;
      if(typeof bomCard === 'function'){
        bomCard(data)
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

  render() {
    const { bomCard,dispatch }  = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return <Input placeholder={"序号"} disabled value={text}/>
          }
          return text;
        },
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        key: 'materialName',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return <Input placeholder={"物料名称"} disabled value={text}/>
          }
          return text;
        },
      },
      {
        title: '数量(参考)',
        dataIndex: 'amounta',
        key: 'amounta',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type={"Number"}
                value={text}
                disabled
                placeholder="数量"
              />
            );
          }
          return text;
        },
      },
      {
        title: '批次',
        dataIndex: 'batchName',
        key: 'batchName',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                placeholder="请输入批次"
              />
            );
          }
          return text;
        },
      },
      {
        title: '单价',
        dataIndex: 'unit',
        key: 'unit',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                disabled
                type={"Number"}
                placeholder="请输入单价"
              />
            );
          }
          return text;
        },
      },
      {
        title: '金额',
        dataIndex: 'mny',
        key: 'mny',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                type={"Number"}
                placeholder="请输入金额"
              />
            );
          }
          return text;
        },
      },
      {
        title: '货位',
        dataIndex: 'cargo',
        key: 'cargo',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                type={"Number"}
                placeholder="装配提前期"
              />
            );
          }
          return text;
        },
      },
      {
        title: '工位',
        dataIndex: 'stationName',
        key: 'stationName',
        width:60,
        render: (text, record) => {
          const onAreaData = {
            TableData:this.state.TableAreaData,
            SelectValue:this.state.SelectAreaValue,
            selectedRowKeys:this.state.selectedAreaRowKeys,
            columns:[
              {
                title: '工位编号',
                dataIndex: 'code',
              },
              {
                title: '工位名称',
                dataIndex: 'name',
              },
              {
                title: '区域',
                dataIndex: 'productionregionName',
              },
              {
                title: '',
                width:1,
                dataIndex: 'caozuo',
              }
            ],
            fetchList:[
              {label:'工位编号',code:'code',placeholder:'请输入工位编号'},
              {label:'工位名称',code:'name',placeholder:'请输入工位名称'},
            ],
            title:'工位',
            placeholder:'请选择工位',
          };
          const onAreaOn = {
            onIconClick:()=>{
              const { dispatch } = this.props;
              dispatch({
                type:'MManage/fetchStation',
                payload:{
                  reqData:{
                    pageIndex:0,
                    pageSize:10
                  }
                },
                callback:(res)=>{
                 
                  this.setState({
                    TableAreaData:res,
                  })
                }
              })
            },
            onOk:(selectedRowKeys,selectedRows)=>{
              if(!selectedRowKeys || !selectedRows){
                return
              }
              const nameList = selectedRows.map(item =>{
                return item.name
              });
              this.handleFieldChange({stationName:nameList[0],stationId:selectedRowKeys[0]}, 'stationName', record.key)
            },
            handleTableChange:(obj)=>{
              const { dispatch } = this.props;
              const { WorkConditions } = this.state;
              const param = {
                ...obj
              };
              if(WorkConditions.length){
                dispatch({
                  type:'MManage/fetchStation',
                  payload:{
                    conditions:WorkConditions,
                    ...obj,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableAreaData:res,
                    })
                  }
                });
                return
              }
              dispatch({
                type:'MManage/fetchStation',
                payload:param,
                callback:(res)=>{
                  this.setState({
                    TableAreaData:res,
                  })
                }
              })
            }, //分页
            handleSearch:(values)=>{
              const { code, name } = values;
              if(code || name){
                let conditions = [];
                let codeObj = {};
                let nameObj = {};

                if(code){
                  codeObj = {
                    code:'code',
                    exp:'like',
                    value:code
                  };
                  conditions.push(codeObj)
                }
                if(name){
                  nameObj = {
                    code:'name',
                    exp:'like',
                    value:name
                  };
                  conditions.push(nameObj)
                }
                this.setState({
                  AreaConditions:conditions,
                });
                const obj = {
                  pageIndex:0,
                  pageSize:10,
                  conditions,
                };
                dispatch({
                  type:'MManage/fetchStation',
                  payload:obj,
                  callback:(res)=>{
                    this.setState({
                      TableAreaData:res,
                    })
                  }
                })
              }else{
                this.setState({
                  AreaConditions:[]
                });
                dispatch({
                  type:'MManage/fetchStation',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableAreaData:res
                    })
                  }
                })
              }
            }, //查询时触发
            handleReset:()=>{
              const { pageWork } = this.state;
              this.setState({
                AreaConditions:[]
              });
              dispatch({
                type:'MManage/fetchStation',
                payload:{
                  pageIndex:0,
                  pageSize:10,
                },
                callback:(res)=>{
                  this.setState({
                    TableAreaData:res,
                  })
                }
              })
            }, //清空时触发
            onButtonEmpty:()=>{
              this.setState({
                SelectAreaValue:[],
                selectedAreaRowKeys:[],
              })
            }
          };
          if (record.editable) {
            return (
              <NotModelTable
                on={onAreaOn}
                data={onAreaData}
              />
            );
          }
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type={'Number'}
                value={text}
                onChange={e => this.handleFieldChange(e, 'amount', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入数量"
              />
            );
          }
          return text;
        },
      },
      {
        title: '位号',
        dataIndex: 'tag',
        key: 'tag',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'tag', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入位号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo',
        width:60,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'memo', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入备注"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'caozuo',
        width:60,
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key,bomCard)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,bomCard)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key,bomCard)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,bomCard)}>
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
        <Table
          style={{marginTop:'8px'}}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
          scroll={{x:columns.length*60}}
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
