import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import './style.less'
import styles from '../../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';
import TreeTable from '@/pages/tool/TreeTable/TreeTable';
import { toTree } from '@/pages/tool/ToTree';
import { Table, Button,Checkbox, Input, message, Popconfirm,Form, Divider, DatePicker } from 'antd';
import isEqual from 'lodash/isEqual';
import FooterToolbar from '@/components/FooterToolbar';
import moment from '../../Platform/ProductModle/Routing/Cadd';
import momentt from 'moment'
@connect(({ MP,loading }) => ({
  MP,
  loading:loading.models.MP
}))
@Form.create()
class MaintenancePlanChild extends PureComponent {
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

    };
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    
    let onData = nextProps.onData
    const { data , status} = onData
    if (data === undefined || !data){
      this.setState({
        data:[],
        status:false
      });
      return
    }
    if(nextProps.onData.data !== this.props.data){
      this.setState({
        data,
        status
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
      maintainAnnal:'',
      maintainDate:'',
      eligible:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChild }= this.props
    const { onOk}= onChild
    // const { onChange } = this.props;  
    const newData = data.filter(item => item.key !== key);
    onOk(newData)
    this.setState({ data: newData });
   /* if(typeof bomCard === 'function'){
      bomCard(newData)
    }*/
    // onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(fieldName === 'eligible'){
        target[fieldName] = e.target.checked
      }else if(fieldName === 'maintainDate'){
        target[fieldName] = e?e.format('YYYY-MM-DD'):''
      }
      else{
        target[fieldName] = e.target.value;
      }

      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    const { onChild }= this.props
    const { onOk}= onChild
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
      if ( !target.maintainDate
      ) {
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
      onOk(data);
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

  cancleSave = ()=>{
    const { on }= this.props
    const { onCancle}= on
    onCancle()
    this.setState({data:[]})
  }

  render() {
    const { onChild,dispatch,loading}= this.props
    const { status } = this.state
    const { onOk,onCancle}= onChild
    const visible = true
    const columns = [
      {
        title: '保养时间',
        dataIndex: 'maintainDate',
        render: (text, record) => {
          if (record.editable) {
            return (
              <DatePicker
                value={text?momentt(text):null}
                onChange={e => this.handleFieldChange(e, 'maintainDate', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="保养时间"
              />
            );
          }
          return text;
        },
      },
      {
        title: '保养记录',
        dataIndex: 'maintainAnnal',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'maintainAnnal', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="保养记录"
              />
            );
          }
          return text;
        },
      },
      {
        title: '是否合格',
        dataIndex: 'eligible',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Checkbox
                checked={text}
                valuePropName="checked"
                onChange={e => this.handleFieldChange(e, 'eligible', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return<Checkbox checked={text}/>;
        },
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'caozuo',
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
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { data } = this.state;
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
          disabled={!status}
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增信息
        </Button>
       {/* <FooterToolbar >
          <Button onClick={this.cancleSave}  style={{marginRight:'20px'}} disabled={visible ?0:1}>
            取消22
          </Button>
          <Button onClick={()=>this.okSave()} type="primary" disabled={visible ?0:1}>
            保存22
          </Button>
        </FooterToolbar>*/}
      </div>
    );
  }
}

export default MaintenancePlanChild;
