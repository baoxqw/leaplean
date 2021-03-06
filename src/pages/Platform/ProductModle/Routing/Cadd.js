import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import NotModelTable from '@/pages/tool/ModelTable/NotModelTable';
import styles from '../../Sysadmin/UserAdmin.less';
import { Table, DatePicker,Checkbox,Upload,Icon,Modal,
  Input, message,Button, Popconfirm,Form, Divider, Select } from 'antd';
import moment from 'moment'
import NormalTable from '@/components/NormalTable';
import ModelTable from '@/pages/tool/ModelTable/ModelTable';

const { Option } = Select;
@connect(({ rout, loading }) => ({
  rout,
  loading: loading.models.rout,
}))
@Form.create()
class Cadd extends PureComponent {
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
      TableWorkData:[],
      SelectWorkValue:[],
      selectedWorkRowKeys:[],
      WorkConditions:[],
      pageWork:{},
      version:0,

      TableRegionData:[],
      SelectRegionValue:[],
      selectedRegionRowKeys:[],
      RegionConditions:[],
      pageRegion:{},


      TableProductData:[],
      SelectProductValue:[],
      selectedProductRowKeys:[],
      ProductConditions:[],
      pageProduct:{},


      TableUnitData:[],
      SelectUnitValue:[],
      selectedUnitRowKeys:[],
      UnitConditions:[],
      pageUnit:{},

      TableProcessData:[],
      SelectProcessValue:[],
      selectedProcessRowKeys:[],
      ProcessConditions:[],
      pageProcess:{},
      fileid:null,
      fileList: [
      ],
      uploadmodale:false,
      newdataList:[],

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
      // ???????????????????????????????????????
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const { bomCard } = this.props
    const newData = data.map(item => ({ ...item }));
    let count = 10;
    if(data.length){
      count = (data.length+1) * 10
    }
    newData.push({
      key: `${this.index}`,
      vno:count + '',
      name:'',
      code:'',
      uploadfile:[],
      divisionId:null,
      productionlineId:null,
      workstationtypeId:null,
      assignedtooperation:null,
      quantityofworkstations:null,
      timetype:'',
      setuptime:null,
      productiontime:null,
      waitingtime:null,
      transfertime:null,
      disassemblytime:null,
      productioninonecycle:null,
      machineutilization:null,
      laborutilization:null,
      checkFlag:0,
      handoverFlag:0,
      backflushFlag:0,
      countFlag:0,
      parallelFlag:0,
      checktype:'',
      effectdate:null,
      invaliddate:null,
      description:'',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
    if(typeof bomCard === 'function'){
      bomCard(newData)
    }
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

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if(fieldName === 'workstationtypename'){
        target[fieldName] = e.workstationtypename
        target["workstationtypeId"] = e.selectedRowKeys;
      }else
      if(fieldName === 'productionlinename'){
        target[fieldName] = e.productionlinename
        target["productionlineId"] = e.selectedRowKeys;
      }else
      if(fieldName === 'divisionname'){
        target[fieldName] = e.divisionname
        target["divisionId"] = e.selectedRowKeys;
      }else
      if(fieldName === 'checkFlag'){
        target[fieldName] = e.target.checked
      }else
      if(fieldName === 'handoverFlag'){
        target[fieldName] = e.target.checked
      }else
      if(fieldName === 'backflushFlag'){
        target[fieldName] = e.target.checked
      }else
      if(fieldName === 'countFlag'){
        target[fieldName] = e.target.checked
      }else
      if(fieldName === 'parallelFlag'){
        target[fieldName] = e.target.checked
      }else
      if(fieldName === 'assignedtooperation'){
        target[fieldName] = e
      }else
      if(fieldName === 'timetype'){
        target[fieldName] = e
      }else
      if(fieldName === 'effectdate'){
        target[fieldName] = e?e.format('YYYY-MM-DD'):''
      }else
      if(fieldName === 'invaliddate'){
        target[fieldName] = e?e.format('YYYY-MM-DD'):''
      }else{
        target[fieldName] = e.target.value;
      }
      this.setState({ data: newData });
    }
  }

  saveRow(e, key,bomCard) {
    e.persist();
    this.setState({
      loading: true,
      // fileList:[]
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      // target.fileList = this.state.fileList
      if ( !target.code  ) {
        message.error('????????????????????????');
        e.target.focus();
        this.setState({
          loading: false,
        });
        // return;
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
      title: '?????????',
      dataIndex: 'vno',
      key: 'vno',
      width:'150px',
    
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'vno', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="??????????????????"
            />
          );
        }
        return text;
      },
    },
     {
      title: '????????????',
      dataIndex: 'name',
      key: 'name',
      
      width:'150px',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'name', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="?????????????????????"
            />
          );
        }
        return text;
      },
    },
     {
      title: '????????????',
      dataIndex: 'code',
      key: 'code',
      
      width:'150px',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'code', record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="?????????????????????"
            />
          );
        }
        return text;
      },
    },
     {
     title: '?????????',
     dataIndex: 'productionlinename',
     key: 'productionlinename',
     width:'150px',
    
     render: (text, record) => {
       const onProductData = {
         TableData:this.state.TableProductData,
         SelectValue:text,
         selectedRowKeys:[record.productionlineId],
         columns : [
           {
             title: '???????????????',
             dataIndex: 'code',
           },
           {
             title: '???????????????',
             dataIndex: 'name',
           },
           {
             title:'',
             width:1,
             dataIndex:'caozuo'
           }
         ],
         fetchList:[
           {label:'???????????????',code:'code',placeholder:'????????????????????????'},
           {label:'???????????????',code:'name',placeholder:'????????????????????????'},
         ],
         title:'?????????',
         placeholder:'????????????????????????',
       };
       const onProductOn = {
         onIconClick:()=>{
           const { dispatch } = this.props;
           dispatch({
             type:'rout/fetchProduct',
             payload:{
               pageIndex:0,
               pageSize:10
             },
             callback:(res)=>{
               this.setState({
                 TableProductData:res,
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
           this.handleFieldChange({selectedRowKeys:selectedRowKeys[0],productionlinename:nameList}, 'productionlinename', record.key)
         },
         handleTableChange:(obj)=>{
           const { dispatch } = this.props;
           const { ProductConditions } = this.state;
           const param = {
             ...obj
           };
           if(ProductConditions.length){
             dispatch({
               type:'rout/fetchProduct',
               payload:{
                 conditions:ProductConditions,
                 ...obj,
               },
               callback:(res)=>{
                 this.setState({
                   TableProductData:res,
                 })
               }
             });
             return
           }
           dispatch({
             type:'rout/fetchProduct',
             payload:param,
             callback:(res)=>{
               this.setState({
                 TableProductData:res,
               })
             }
           })
         }, //??????
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
               ProductConditions:conditions,
             });
             const obj = {
               pageIndex:0,
               pageSize:10,
               conditions,
             };
             dispatch({
               type:'rout/fetchProduct',
               payload:obj,
               callback:(res)=>{
                 this.setState({
                   TableProductData:res,
                 })
               }
             })
           }else{
             this.setState({
               ProductConditions:[],
             });
             dispatch({
               type:'rout/fetchProduct',
               payload:{
                 pageIndex:0,
                 pageSize:10,
               },
               callback:(res)=>{
                 this.setState({
                   TableProductData:res,
                 })
               }
             })
           }
         }, //???????????????
         handleReset:()=>{
           this.setState({
             ProductConditions:[]
           });
           dispatch({
             type:'rout/fetchProduct',
             payload:{
               pageIndex:0,
               pageSize:10,
             },
             callback:(res)=>{
               this.setState({
                 TableProductData:res,
               })
             }
           })
         }, //???????????????
         onButtonEmpty:()=>{
           this.setState({
             SelectProductValue:[],
             selectedProductRowKeys:[],
           })
         }
       };
       if (record.editable) {
         return <NotModelTable
           data={onProductData}
           on={onProductOn}
         />
       }
       return text;
     },
   },
     {
       title: '???????????????',
       dataIndex: 'workstationtypename',
       key: 'workstationtypename',
       width:'150px',
     
       render: (text, record) => {
         const onUnitData = {
           TableData:this.state.TableUnitData,
           SelectValue:text,
           selectedRowKeys:[record.workstationtypeId],
           columns : [
             {
               title: '????????????????????????',
               dataIndex: 'code',
             },
             {
               title: '????????????????????????',
               dataIndex: 'name',
             },
             {
               title:'',
               width:1,
               dataIndex:'caozuo'
             }
           ],
           fetchList:[
             {label:'????????????????????????',code:'code',placeholder:'?????????????????????????????????'},
             {label:'????????????????????????',code:'name',placeholder:'?????????????????????????????????'},
           ],
           title:'??????????????????',
           placeholder:'?????????????????????',
         };
         const onUnitOn = {
           onIconClick:()=>{
             const { dispatch } = this.props;
             dispatch({
               type:'rout/fetchUnit',
               payload:{
                 pageIndex:0,
                 pageSize:10
               },
               callback:(res)=>{
                 this.setState({
                   TableUnitData:res,
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
             this.handleFieldChange({selectedRowKeys:selectedRowKeys[0],workstationtypename:nameList}, 'workstationtypename', record.key)
           },
           handleTableChange:(obj)=>{
             const { dispatch } = this.props;
             const { UnitConditions } = this.state;
             const param = {
               ...obj
             };
             if(UnitConditions.length){
               dispatch({
                 type:'rout/fetchUnit',
                 payload:{
                   conditions:UnitConditions,
                   ...obj,
                 },
                 callback:(res)=>{
                   this.setState({
                     TableUnitData:res,
                   })
                 }
               });
               return
             }
             dispatch({
               type:'rout/fetchUnit',
               payload:param,
               callback:(res)=>{
                 this.setState({
                   TableUnitData:res,
                 })
               }
             })
           }, //??????
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
                 UnitConditions:conditions,
               });
               const obj = {
                 pageIndex:0,
                 pageSize:10,
                 conditions,
               };
               dispatch({
                 type:'rout/fetchUnit',
                 payload:obj,
                 callback:(res)=>{
                   this.setState({
                     TableUnitData:res,
                   })
                 }
               })
             }else{
               this.setState({
                 UnitConditions:[],
               });
               dispatch({
                 type:'rout/fetchUnit',
                 payload:{
                   pageIndex:0,
                   pageSize:10,
                 },
                 callback:(res)=>{
                   this.setState({
                     TableUnitData:res,
                   })
                 }
               })
             }
           }, //???????????????
           handleReset:()=>{
             this.setState({
               UnitConditions:[]
             });
             dispatch({
               type:'rout/fetchUnit',
               payload:{
                 pageIndex:0,
                 pageSize:10,
               },
               callback:(res)=>{
                 this.setState({
                   TableUnitData:res,
                 })
               }
             })
           }, //???????????????
           onButtonEmpty:()=>{
             this.setState({
               SelectUnitValue:[],
               selectedUnitRowKeys:[],
             })
           }
         };
         if (record.editable) {
           return <NotModelTable
             data={onUnitData}
             on={onUnitOn}
           />
         }
         return text;
       },
     },
     {
       title: '???????????????',
       dataIndex: 'assignedtooperation',
       key: 'assignedtooperation',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Select
               style={{ width: '100%' }}
               placeholder={"???????????????"}
               onChange={e => this.handleFieldChange(e, 'assignedtooperation', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               value={text}
             >
               <Option value={0}>???????????????</Option>
               <Option value={1}>????????? DIVISION_ID???PRODUCTIONLINE_ID????????????</Option>
             </Select>
           );
         }
         return text;
       },
     },
     {
       title: '???????????????',
       dataIndex: 'quantityofworkstations',
       key: 'quantityofworkstations',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'quantityofworkstations', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="????????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'timetype',
       key: 'timetype',
       width:'150px',
      
       render: (text, record) => {
         if (record.editable) {
           return (
             <Select
               style={{ width: '100%' }}
               placeholder={"???????????????"}
               onChange={e => this.handleFieldChange(e, 'timetype', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               value={text}
             >
               <Option value={"???"}>???</Option>
               <Option value={"???"}>???</Option>
               <Option value={"???"}>???</Option>
             </Select>
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'setuptime',
       key: 'setuptime',
       width:'150px',
       
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'setuptime', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'productiontime',
       key: 'productiontime',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'productiontime', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'waitingtime',
       key: 'waitingtime',
       
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'waitingtime', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'transfertime',
       key: 'transfertime',
       
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'transfertime', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'disassemblytime',
       key: 'disassemblytime',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'disassemblytime', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????????????????',
       dataIndex: 'productioninonecycle',
       key: 'productioninonecycle',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'productioninonecycle', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '???????????????',
       dataIndex: 'machineutilization',
       key: 'machineutilization',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'machineutilization', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="????????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '???????????????',
       dataIndex: 'laborutilization',
       key: 'laborutilization',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               type={"Number"}
               value={text}
               onChange={e => this.handleFieldChange(e, 'laborutilization', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="????????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '???????????????',
       dataIndex: 'checkFlag',
       key: 'checkFlag',
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Checkbox
               checked={text}
               onChange={e => this.handleFieldChange(e, 'checkFlag', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
             />
           );
         }
         return  <Checkbox checked={text}/>;
       },
     },
     {
       title: '???????????????',
       dataIndex: 'handoverFlag',
       key: 'handoverFlag',
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Checkbox
               checked={text}
               onChange={e => this.handleFieldChange(e, 'handoverFlag', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
             />
           );
         }
         return  <Checkbox checked={text}/>;
       },
     },
     {
       title: '????????????',
       dataIndex: 'backflushFlag',
       key: 'backflushFlag',
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Checkbox
               checked={text}
               onChange={e => this.handleFieldChange(e, 'backflushFlag', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
             />
           );
         }
         return  <Checkbox checked={text}/>;
       },
     },
     {
       title: '???????????????',
       dataIndex: 'countFlag',
       key: 'countFlag',
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Checkbox
               checked={text}
               onChange={e => this.handleFieldChange(e, 'countFlag', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
             />
           );
         }
         return  <Checkbox checked={text}/>;
       },
     },
     {
       title: '??????????????????',
       dataIndex: 'parallelFlag',
       key: 'parallelFlag',
       
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Checkbox
               checked={text}
               onChange={e => this.handleFieldChange(e, 'parallelFlag', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
             />
           );
         }
         return  <Checkbox checked={text}/>;
       },
     },
     {
       title: '????????????',
       dataIndex: 'checktype',
       key: 'checktype',
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               value={text}
               onChange={e => this.handleFieldChange(e, 'checktype', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'effectdate',
       key: 'effectdate',
       
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <DatePicker
               value={text?moment(text):null}
               onChange={e => this.handleFieldChange(e, 'effectdate', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'invaliddate',
       key: 'invaliddate',
       
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <DatePicker
               value={text?moment(text):null}
               onChange={e => this.handleFieldChange(e, 'invaliddate', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
       title: '????????????',
       dataIndex: 'description',
       key: 'description',
      
       width:'150px',
       render: (text, record) => {
         if (record.editable) {
           return (
             <Input
               value={text}
               onChange={e => this.handleFieldChange(e, 'description', record.key)}
               onKeyPress={e => this.handleKeyPress(e, record.key)}
               placeholder="?????????????????????"
             />
           );
         }
         return text;
       },
     },
     {
        title: '????????????',
        dataIndex: 'divisionname',
        key: 'divisionname',
       
        width:'150px',
        render: (text, record) => {
          const onRegionData = {
            TableData:this.state.TableRegionData,
            SelectValue:text,
            selectedRowKeys:[record.divisionId],
            columns : [
              {
                title: '????????????',
                dataIndex: 'code',
              },
              {
                title: '????????????',
                dataIndex: 'name',
              },
              {
                title: '?????????',
                dataIndex: 'psnId',
              },
              {
                title: '???????????????',
                dataIndex: 'productionlineId',
              },
              {
                title: '',
                dataIndex: 'caozuo',
                width:1
              },
            ],
            fetchList:[
              {label:'????????????',code:'code',placeholder:'?????????????????????'},
              {label:'????????????',code:'name',placeholder:'?????????????????????'},
            ],
            title:'??????',
            placeholder:'???????????????',
          };
          const onRegionOn = {
            onIconClick:()=>{
              const { dispatch } = this.props;
              dispatch({
                type:'rout/fetchRegion',
                payload:{
                  pageIndex:0,
                  pageSize:10
                },
                callback:(res)=>{
                  this.setState({
                    TableRegionData:res,
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
              this.handleFieldChange({selectedRowKeys:selectedRowKeys[0],divisionname:nameList}, 'divisionname', record.key)
            },
            handleTableChange:(obj)=>{
              const { dispatch } = this.props;
              const { RegionConditions } = this.state;
              const param = {
                ...obj
              };
              if(RegionConditions.length){
                dispatch({
                  type:'rout/fetchRegion',
                  payload:{
                    conditions:RegionConditions,
                    ...obj,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableRegionData:res,
                    })
                  }
                });
                return
              }
              dispatch({
                type:'rout/fetchRegion',
                payload:param,
                callback:(res)=>{
                  this.setState({
                    TableRegionData:res,
                  })
                }
              })
            }, //??????
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
                  RegionConditions:conditions,
                });
                const obj = {
                  pageIndex:0,
                  pageSize:10,
                  conditions,
                };
                dispatch({
                  type:'rout/fetchRegion',
                  payload:obj,
                  callback:(res)=>{
                    this.setState({
                      TableRegionData:res,
                    })
                  }
                })
              }else{
                this.setState({
                  RegionConditions:[],
                });
                dispatch({
                  type:'rout/fetchRegion',
                  payload:{
                    pageIndex:0,
                    pageSize:10,
                  },
                  callback:(res)=>{
                    this.setState({
                      TableRegionData:res,
                    })
                  }
                })
              }
            }, //???????????????
            handleReset:()=>{
              this.setState({
                RegionConditions:[]
              });
              dispatch({
                type:'rout/fetchRegion',
                payload:{
                  pageIndex:0,
                  pageSize:10,
                },
                callback:(res)=>{
                  this.setState({
                    TableRegionData:res,
                  })
                }
              })
            }, //???????????????
            onButtonEmpty:()=>{
              this.setState({
                SelectRegionValue:[],
                selectedRegionRowKeys:[],
              })
            }
          };
          if (record.editable) {
            return <NotModelTable
              data={onRegionData}
              on={onRegionOn}
            />
          }
          return text;
        },
      },
      {
        title: '??????',
        key: 'action',
        dataIndex: 'caozuo',
        fixed: 'right',
        width:'150px',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key,bomCard)}>??????</a>
                  <Divider type="vertical" />
                  <Popconfirm title="????????????????????????" onConfirm={() => this.remove(record.key,bomCard)}>
                    <a>??????</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key,bomCard)}>??????</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>??????</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>??????</a>
              <Divider type="vertical" />
              <Popconfirm title="????????????????????????" onConfirm={() => this.remove(record.key,bomCard)}>
                <a>??????</a>
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
          scroll={{ x: columns.length * 150}}
          loading={loading}
          columns={columns}
         // classNameSaveColumns={"RoutIndex6"}
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
          ????????????
        </Button>

      </div>
    );
  }
}

export default Cadd;
