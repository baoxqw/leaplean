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
class TestDevice extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data:props.data,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
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
      testEquipment: '',
      fragments: '',
      expected: '',
      indicator: '',
      humidity: '',
      testResults: '',
      absolute: '',
      despCoef: '',
      memo: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
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
      if (!target.testEquipment) {
        message.error('请填写测试设备');
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
        title: '测试设备',
        dataIndex: 'testEquipment',
        key: 'testEquipment',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'testEquipment', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="测试设备"
              />

            );
          }
          return text;
        },
      },
      {
        title: '片段数量',
        dataIndex: 'fragments',
        key: 'fragments',
        render: (text, record) => {
          if (record.editable) {
            return (
            <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'fragments', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="片段数量"
              />

            );
          }
          return text;
        },
      },
      {
        title: '预期号',
        dataIndex: 'expected',
        key: 'expected',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'expected', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="预期号"
              />

            );
          }
          return text;
        },
      },
      {
        title: '实测环境温度',
        dataIndex: 'indicator',
        key: 'indicator',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={'number'}
                onChange={e => this.handleFieldChange(e, 'indicator', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="实测环境温度"
              />

            );
          }
          return text;
        },
      },
      {
        title: '实测环境湿度',
        dataIndex: 'humidity',
        key: 'humidity',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                type={'number'}
                onChange={e => this.handleFieldChange(e, 'humidity', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="实测环境湿度"
              />

            );
          }
          return text;
        },
      },
      {
        title: '并测结果',
        dataIndex: 'testResults',
        key: 'testResults',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'testResults', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="并测结果"
              />

            );
          }
          return text;
        },
      },
      {
        title: '绝对',
        dataIndex: 'absolute',
        key: 'absolute',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'absolute', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="绝对"
              />

            );
          }
          return text;
        },
      },
      {
        title: '离散系数',
        dataIndex: 'despCoef',
        key: 'despCoef',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'despCoef', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="离散系数"
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
          新增测试设备
        </Button>
      </Fragment>
    );
  }
}

export default TestDevice;
