/*基于antd table的虚拟滚动组件*/
import React, { PureComponent, Fragment } from 'react';
import {  Select, Checkbox, Tooltip, Button,message,Divider,Spin  } from 'antd';
import styles from '@/components/NormalTable/index.less';
import ReactDragListView from 'react-drag-listview';
import storage from '@/utils/storage';
import { InfinityTable as Table } from 'antd-table-infinity';
import 'antd-table-infinity/index.css';

class index extends PureComponent {
  constructor(props) {
    super(props);
    const columns = this.process(props);
    this.state = {
      selectedRowKeys: [],
      columns,
      open: false,
      check: {}
    };
  }

  process = (props)=>{
    let { columns, len = 150 } = props;
    const { classNameSaveColumns } = this.props;
    if(classNameSaveColumns){
      const dataColumns = storage.get(classNameSaveColumns)
      if(dataColumns && dataColumns.length){
        columns.sort((a,b)=>{
          return dataColumns.indexOf(a.dataIndex) - dataColumns.indexOf(b.dataIndex);
        });
      }
    }
    let coplyColumns = [];
    if (columns.length) {
      columns = columns.map((item, index) => {
        item.sort = index;
        if (!item.width) {
          item.width = len;
        }
        if (!('render' in item)) {
          item.render = text => <Tooltip title={text}>
            <div style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              width: len - 20
            }}>{text}</div>
          </Tooltip>
        }

        item.check = false;
        if (item.dataIndex === 'caozuo') {
          item = {
            ...item,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              const options = coplyColumns.map((ite, index) => {
                if (index === coplyColumns.length - 1) {
                  return
                }

                return <Option key={index}>
                  <Checkbox onChange={(e) => this.onChange(e, ite)} defaultChecked={true} /> {ite.title}
                  {
                    index === coplyColumns.length -2 && "onReset" in item?<div style={{marginTop:16}}>
                      <Button type="primary" onClick={ ()=>{
                        if(item.onReset && typeof item.onReset === 'function'){
                          return item.onReset()
                        }
                        return null
                      }}>
                        重置查询
                      </Button>
                    </div>:null
                  }
                </Option>
              });
              return <Select
                style={{ width: 120, margin: 10 }}
                value={this.state.columns.length - 1}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                open={this.state.open}
              >
                {options}
              </Select>
            },
            onFilterDropdownVisibleChange: (visible) => {
              this.setState({
                open: visible
              })
              return {
                filterDropdownVisible: visible
              }
            }
          }
        } else {
          item = {
            ...item,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
              return <div>
                <div style={{ padding: 8 }}>
                  <Checkbox onChange={(e) => this.onChangeCheck(e, item, coplyColumns[index])} checked={item.check}>锁定</Checkbox>
                </div>
                {
                  'search' in item && typeof item.search === 'function'?
                    <div>
                      <Divider style={{margin:0,padding:0}}/>
                      {item.search()}
                    </div>
                    :''
                }
              </div>
            },
          }
        }
        return item
      });
      coplyColumns = [...columns];
    }
    return columns;
  }

  onChangeCheck = (e, data, cdata) => {
    const { columns } = this.state;
    columns.map((item) => {
      if (item.dataIndex === data.dataIndex) {
        if (e.target.checked === true) {
          item.fixed = 'left';
          item.check = true;
          item.sort = - (columns.length - item.sort);
        } else {
          item.fixed = '';
          item.check = false;
          item.sort = columns.length - Math.abs(item.sort)
        }
      }
    })

    columns.sort((a, b) => {
      return a.sort - b.sort
    });

    this.setState({
      columns: [...columns]
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  onChange = (e, item) => {
    const { columns } = this.state;
    const { onClickColumns } = this.props;
    if (e.target.checked) {
      columns.push(item);
      columns.sort((a, b) => {
        return a.sort - b.sort
      });
    } else {
      columns.map((ite, i) => {
        if (ite.sort === item.sort) {
          columns.splice(i, 1)
        }
      });
    }
    if (typeof onClickColumns === 'function') {
      onClickColumns([...columns])
    }
    this.setState({
      columns: [...columns]
    })
  };

  onFocus = () => {
    this.setState({
      open: true
    })
  };

  onBlur = () => {
    this.setState({
      open: false
    })
  };

  render() {
    const { columns } = this.state;
    const { data = {}, rowKey, len = 180,classNameSaveColumns,nodeSelector = "th",total, ...rest } = this.props;

    if(columns.length){
      columns.map((item,index) =>{
        if(item.dataIndex !== "caozuo"){
          if(!('sorter' in item)){

            item.sorter = (a,b)=> {
              //汉字
              if(a[item.dataIndex] && b[item.dataIndex]){
                if(a[item.dataIndex].charCodeAt() > 255 && b[item.dataIndex].charCodeAt() > 255){
                  return a[item.dataIndex].localeCompare(b[item.dataIndex])
                }
              }

              //数值
              if(typeof a[item.dataIndex] === 'number' && typeof b[item.dataIndex] === 'number'){
                return a[item.dataIndex] - b[item.dataIndex]
              }

              //字符串
              if(typeof a[item.dataIndex] === 'string' && typeof b[item.dataIndex] === 'string'){
                if((isNaN(a[item.dataIndex])&&!isNaN(Date.parse(a[item.dataIndex]))) &&  (isNaN(b[item.dataIndex])&&!isNaN(Date.parse(b[item.dataIndex]))) ){
                  return new Date(a[item.dataIndex]) -  new Date(b[item.dataIndex])
                }
                return a[item.dataIndex].localeCompare(b[item.dataIndex])
              }
            }
          }
        }
      })
    }

    const { list = [], pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    if (!rest.scroll) {
      rest.scroll = {};
      let cun = 0;
      let length = columns.length;

      columns.map(item => {
        if (item.width !== len) {
          cun = item.width + cun;
          length = length - 1;
        }
      });
      rest.scroll.x = cun + length * len
      rest.scroll.y = 280
    } else {
      if (!rest.scroll.x) {
        rest.scroll = {
          ...rest.scroll
        };
        let cun = 0;
        let length = columns.length;
        columns.map(item => {
          if (item.width !== len) {
            cun = item.width + cun;
            length = length - 1;
          }
        });
        rest.scroll.x = cun + length * len
      }
    }

    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const { rowSelection,isNodeSelector = false } = that.props;
        if(isNodeSelector){
          return
        }
        if(rowSelection && 'selectedRowKeys' in rowSelection){
          if(fromIndex === 0 || toIndex === 0){
            return
          }
          fromIndex = fromIndex - 1;
          toIndex = toIndex - 1;
        }
        const columns = [...that.state.columns];
        const item = columns.splice(fromIndex, 1)[0];
        columns.splice(toIndex, 0, item);
        const sortArr = columns.map(item =>{
          if(item && item.dataIndex){
            return item.dataIndex
          }
        })
        if(classNameSaveColumns){
          storage.set(classNameSaveColumns,sortArr)
        }
        that.setState({
          columns
        });
      },
      nodeSelector
    };

    if(pagination){
      if(!('showTotal' in pagination)){
        pagination.showTotal = (total)=><span style={{fontSize:14,position:'relative',bottom:-5}}>共 <span style={{fontWeight:'bold'}}>{total}</span> 条</span>
      }
    }

    return (
      <div className={styles.standardTable}>
        <ReactDragListView.DragColumn {...this.dragProps}>
          <Table
            rowKey={rowKey || 'key'}
            dataSource={list}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            total={total}
            {...rest}
            columns={columns}
          />
        </ReactDragListView.DragColumn>
      </div>
    );
  }
}

export default index;
