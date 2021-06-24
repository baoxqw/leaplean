import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Modal,
  message,
  Form,
  Table, Button, Input,  Popconfirm, Divider,
} from 'antd';
import NormalTable from '@/components/NormalTable';
import NotModelTable from '@/pages/tool/ModelTable/NotModelTable';
import styles from '@/pages/Platform/Sysadmin/UserAdmin.less';

@connect(({ MManage,loading }) => ({
  MManage,
  loading:loading.models.MManage
}))
@Form.create()
class Distribute extends PureComponent {
  cacheOriginData = {};

  state = {
    BStatus:false,
    data:[],
    dataRows:[]
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data){
      this.setState({
        data:nextProps.data
      })
    }
  }

  onSave = (onSave)=>{
    let { BStatus,dataRows } = this.state;
    if(BStatus){
      return
    }
    this.setState({
      BStatus:true
    });
    dataRows = dataRows.filter(item =>{
      if('stationId' in item){
        return item
      }
    });

    if(!dataRows.length){
      this.setState({
        BStatus:false
      });
      return message.error("请填写数据后提交")
    }


    if(typeof onSave === 'function'){
      onSave(dataRows,this.clear);
    }
  };

  handleCancel = (onCancel)=>{
    if(typeof onCancel === 'function'){
      onCancel(this.clear)
    }
  };

  clear = (status)=> {
    const { form } = this.props;
    if(status){
      this.setState({
        BStatus:false
      })
      return
    }
    form.resetFields();
    this.setState({
      BStatus:false,
      data:[],
      dataRows:[]
    })
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
      stationName2:'',
      stationId2:null,
      amounta:null,
      tag:"",
      memoa:'',
      amount:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key,onUpdateData) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    if(typeof onUpdateData === 'function'){
      onUpdateData(newData)
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

  handleFieldChange(e, fieldName, key,am) {
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
      else  if(fieldName === "stationName2"){
        target["stationId2"] = e.stationId
        target["stationName2"] = e.stationName
        this.setState({
          SelectAreaValue:e.stationName,
          selectedAreaRowKeys:[e.stationId]
        })
      }else  if(fieldName === "amounta"){
        target["amounta"] = e.target.value;
        target["amount"] = am;
      }
      else {
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key,onUpdateData) {
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
      if(target)
        if ( !target.stationId || !target.amounta || (target.amount - Number(target.amounta) < 0)) {
          if(target.amount - Number(target.amounta) < 0){
            message.error('该条数量不能为负');
          }else{
            message.error('请填写完整信息。');
          }
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }

      delete target.isNew;

      this.toggleEditable(e, key);
      const { data } = this.state;
      if(typeof onUpdateData === 'function'){
        onUpdateData(data)
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

  onUpdateData = (res)=>{
    this.setState({
      dataRows:res
    })
  };

  render() {
    const {
      form: { getFieldDecorator },
      dispatch,
      datas,
      on,
    } = this.props;

    const { visible } = datas;
    const { onSave,onCancel } = on;

    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
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
        render: (text, record) => {
          if (record.editable) {
            return <Input placeholder={"物料名称"} disabled value={text}/>
          }
          return text;
        },
      },
      {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount',
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
        dataIndex: 'cargoName',
        key: 'cargoName',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                placeholder="货位"
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
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                placeholder="工位"
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
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                disabled
                value={text}
                placeholder="备注"
              />
            );
          }
          return text;
        },
      },
      {
        title: '工位',
        dataIndex: 'stationName2',
        key: 'stationName2',
        render: (text, record) => {
          const onAreaData = {
            TableData:this.state.TableAreaData,
            SelectValue:text,
            selectedRowKeys:[record.stationId2],
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
              this.handleFieldChange({stationName:nameList[0],stationId:selectedRowKeys[0]}, 'stationName2', record.key)
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
        dataIndex: 'amounta',
        key: 'amounta',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type={'Number'}
                value={text}
                onChange={e => this.handleFieldChange(e, 'amounta', record.key,record.amount)}
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
        dataIndex: 'memoa',
        key: 'memoa',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'memoa', record.key)}
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
        fixed:'right',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key,this.onUpdateData)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,this.onUpdateData)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key,this.onUpdateData)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,this.onUpdateData)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Modal
        title={"派料单"}
        visible={visible}
        width='80%'
        destroyOnClose
        centered
        onOk={()=>this.onSave(onSave)}
        onCancel={()=>this.handleCancel(onCancel)}
      >
        <div >
          <NormalTable
            style={{marginTop:'8px'}}
            loading={loading}
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName={record => (record.editable ? styles.editable : '')}
            scroll={{x:columns.length*80}}
          />
          {/*<Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.newMember}
            icon="plus"
          >
            新增信息
          </Button>*/}

        </div>
      </Modal>
    );
  }
}

export default Distribute;

