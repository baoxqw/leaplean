import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Checkbox  } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from '../style.less';
class Cadd extends PureComponent {
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
    };
  }

  /*static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.data.list, preState.value)) {
      return null;
    }
    return {
      data: nextProps.data.list,
      value: nextProps.value,
    };
  }*/

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
      key: `${this.index}`,
      code: '',
      name: '',
      scope: '',
      isdimension: false,
      conversionrate:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
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
      target[fieldName] = e.target.value;
      if(fieldName === 'isdimension'){
        target[fieldName] = e.target.checked;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
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
      if (!target.code || !target.name || !target.scope  || !target.conversionrate) {
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

  validate = (onOk)=>{
    const { data } = this.state;
    if(typeof onOk === 'function'){
      onOk(data)
    }
  };

  cancelLick = (cancel)=>{
    if(typeof cancel === 'function'){
      cancel()
    }
  };


  render() {
    const { onAdd }  = this.props;
    const { onOk,cancel } = onAdd;

    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
        width:'16%',
        render: (text, record) => {
          if (record.editable) {
            return <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'code', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="请输入编码"
            />
          }
          return text;
        },
      },
      {
        title: '名称',
        dataIndex: 'name',
        width:'16%',
        key: 'name',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: '所属量纲',
        dataIndex: 'scope',
        width:'16%',
        key: 'scope',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'scope', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入所属量纲"
              />
            );
          }
          return text;
        },
      },
      {
        title: '是否量纲基本单位',
        dataIndex: 'isdimension',
        width:'16%',
        key: 'isdimension',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Checkbox
                checked={text}
                onChange={e => this.handleFieldChange(e, 'isdimension', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          if(record.isdimension){
            return "是";
          }
          return "否"
        },
      },
      {
        title: '换算率（与量纲基本单位）',
        dataIndex: 'conversionrate',
        key: 'conversionrate',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type="Number"
                value={text}
                onChange={e => this.handleFieldChange(e, 'conversionrate', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入换算率"
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
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增信息
        </Button>
        <div style={{display:'flex',justifyContent:'flex-end',margin:'20px'}}>
          <Button onClick={()=>this.cancelLick(cancel)} >
            取消
          </Button>
          <Button type='primary' style={{marginLeft:'20px'}} onClick={()=>this.validate(onOk)} >
            提交
          </Button>
        </div>
      </div>
    );
  }
}

export default Cadd;
