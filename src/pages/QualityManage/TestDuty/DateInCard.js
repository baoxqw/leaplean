import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import NotTreeTable from '@/pages/tool/TreeTable/NotTreeTable';
import { toTree } from '@/pages/tool/ToTree';
import styles from '../../System/UserAdmin.less';
import NormalTable from '@/components/NormalTable';
import { Table, Button,Checkbox, Input, Modal,
  message, Popconfirm,Form, Divider, DatePicker } from 'antd';
import isEqual from 'lodash/isEqual';
@connect(({ testduty,loading }) => ({
  testduty,
  loading:loading.models.testduty
}))
@Form.create()
class DateInCard extends PureComponent {
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
      number:null,
      code:null,
      blank:null,
      isQualified:false,
      isComplete:false,
      memo:null,
      superId:null,
      rowId:null,
      superData:{},
      visible:false
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
        data:[],
        visible:nextProps.data.visible
      });
      return
    }
    if(nextProps.data !== this.props.data){
      nextProps.data.map((item,index)=>{
        item.key = index
      })
      this.setState({
        data: nextProps.data,
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
      number:null,
      code:null,
      blank:null,
      isQualified:false,
      isComplete:false,
      memo:null,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key,onOk) {
    const { data } = this.state;
    // const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onOk(newData);
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
      if(fieldName === "isQualified"){
        target[fieldName] = e.target.checked
      }else
      if(fieldName === "isComplete"){
        target[fieldName] = e.target.checked
      }
      else {
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key,onOk) {
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
      if ( !target.code || !target.blank
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
      if(typeof onOk === 'function'){
        onOk(data)
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

  findChild = (e,record,onFindChild)=>{
    e.preventDefault();
    const { dispatch } = this.props;
    const { data } = this.state;
    data.map(item =>{
      if(item.id === record.id){
        item.color = true
      }else{
        item.color = false
      }
    })
    dispatch({
      type:'testduty/fetchproject',
      payload:{
        conditions:[{
          code:'INSPECTION_SAMPLE_ID',
          exp:'=',
          value:record.id
        }]
      }
    })
    onFindChild(record)
    this.setState({
      data:[...data]
    })
  }



  render() {
    const {
      on,
      loading
    }  = this.props;
    const { data } = this.state;

    const { bomCard,onFindChild }  = this.props;

    const columns = [
      {
        title: '序列号',
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type={"Number"}
                value={text}
                onChange={e => this.handleFieldChange(e, 'number', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="序列号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '产品编号',
        dataIndex: 'code',
        key: 'code',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type={"Number"}
                value={text}
                onChange={e => this.handleFieldChange(e, 'code', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="产品编号"
              />
            );
          }
          return text;
        },
      },
      {
        title: '毛坯编码',
        dataIndex: 'blank',
        key: 'blank',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                type={"Number"}
                value={text}
                onChange={e => this.handleFieldChange(e, 'blank', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="毛坯编码"
              />
            );
          }
          return text;
        },
      },
      {
        title: '是否合格',
        dataIndex: 'isQualified',
        key: 'isQualified',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Checkbox
               checked={text}
               onChange={e => this.handleFieldChange(e, 'isQualified', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
            />
            );
          }
          return <Checkbox checked={text}/>;
        },
      },
      {
        title: '是否完全',
        dataIndex: 'isComplete',
        key: 'isComplete',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Checkbox
                checked={text}
                onChange={e => this.handleFieldChange(e, 'isComplete', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
              />
            );
          }
          return <Checkbox checked={text}/>;
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
                //type={"Number"}
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
        width:150,
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
              <Divider type="vertical" />
              <a style={{color:`${record.color?'#60c3ee':''}`}} onClick={e => this.findChild(e,record,onFindChild)}>查询</a>
            </span>
          );
        },
      },
    ];

    return (
      <div>
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

export default DateInCard;
