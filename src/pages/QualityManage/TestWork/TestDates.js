import React, { PureComponent, Fragment } from 'react';
import { Table, Button, AutoComplete,Input, Form,message,DatePicker, Popconfirm, Divider } from 'antd';
import isEqual from 'lodash/isEqual';
import storage from '@/utils/storage';
import styles from './style.less';
import NormalTable from '@/components/NormalTable';
import moment from 'moment';
import { connect } from 'dva';
const Option = AutoComplete.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
@connect(({ testwork, loading }) => ({
  testwork,
  loading: loading.models.testwork,
}))
@Form.create()
class TestDates extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      data:props.data,
      loading: false,
      value: props.value,
    };
  }

/*  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.data,
      value: nextProps.data,
    };
  }*/
  UNSAFE_componentWillReceiveProps(nextProps,preState){
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.data,
      value: nextProps.data,
    };
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
      key: `NEW_TEMP_ID_${this.index}`,
      type: '',
      memo: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key,record) {
    const { data } = this.state;
    const { on } = this.props;
    const { onOk,onRemove } = on
    const d = data.filter(item => item.key === key);
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onRemove(d);
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
        target[fieldName] = e.target.value;
        this.setState({ data: newData });
      }
  }
  handleNChange(value,option, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = option.props.children;
      target['license_id'] = Number(value);
      this.setState({ data: newData });
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
      if (!target.type) {
        message.error('请填写测试类型');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;

      const { on } = this.props;
      const { onOk } = on
      onOk(data)
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
    const {
      dispatch,
      on
    } = this.props;
    const { onOk } = on
    const userinfo = storage.get("userinfo");
    const corpId = userinfo.corp.id;

    const columns = [
      {
        title: '测试类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'type', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="测试类型"
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
                value={text}
                onChange={e => this.handleFieldChange(e, 'memo', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="备注"
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
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,record)}>
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
      <Fragment>
        <NormalTable
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
          新增测试类型
        </Button>
      </Fragment>
    );
  }
}

export default TestDates;
