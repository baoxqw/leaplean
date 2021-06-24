import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Select,
  Button,
  Card,
  message,
  Progress,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import XLSX from 'xlsx';
import ExportJsonExcel from 'js-export-excel';
import './tableBg.less';
import { toTreeSpecify } from '@/pages/tool/ToTree';

const { Option } = Select;

@connect(({ DI, loading }) => ({
  DI,
  loading: loading.models.DI,
}))
@Form.create()

class DateIn extends PureComponent {
  state = {
    inputFileName: '未选择任何文件',
    isStart: false,
    selectValue: null,
    progressLoad: 0,
    progressStatus: 'exception',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { page } = this.state;

    dispatch({
      type: 'modelType/fetchPrepare',
      payload: {
        ...page,
      },
    });
  }

  //合同
  columnsContract = [
    {
      title: '合同编码',
      dataIndex: 'billcode',
    },
    {
      title: '合同名称',
      dataIndex: 'billname',

    },
    {
      title: '合同类型',
      dataIndex: 'type',
    },
    {
      title: '合同状态',
      dataIndex: 'status',
    },
    {
      title: '版本号',
      dataIndex: 'version',

    },
    {
      title: '签约日期',
      dataIndex: 'signdate',

    },
    {
      title: '签约地址',
      dataIndex: 'signplace',
    },
    {
      title: '调试完成日期',
      dataIndex: 'planValidateTime',

    },
    {
      title: '质保期',
      dataIndex: 'planTeminateTime',

    },
    {
      title: '客户',
      dataIndex: 'custname',
    },
    {
      title: '经办部门',
      dataIndex: 'deptname',
    },
    {
      title: '经办人员',
      dataIndex: 'operatorname',
    },
    {
      title: '合同金额',
      dataIndex: 'contractmny',
    },
    {
      title: '合同所在省份',
      dataIndex: 'vdef1',
    },
    {
      title: '额外费用',
      dataIndex: 'additionalcharges',
    },
    {
      title: '有效合同额',
      dataIndex: 'eca',
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },

  ];
  //客商
  columnsManage = [
    {
      title: '客户编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '客商类型',
      dataIndex: 'custtype',
      key: 'custtype',
    },
    {
      title: '所属地区',
      dataIndex: 'areaclid',
      key: 'areaclid',
    },
    {
      title: '简称',
      dataIndex: 'shortname',
      key: 'shortname',
    },
    {
      title: '职务',
      dataIndex: 'website',
      key: 'website',
    },
    {
      title: '联系人及电话',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '传真',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '法人姓名',
      dataIndex: 'respsnname',
      key: 'respsnname',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '邮编',
      dataIndex: 'zipcode',
      key: 'zipcode',
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'uscc',
      key: 'uscc',
    },
    {
      title: '等级',
      dataIndex: 'custlevel',
      key: 'custlevel',
    },
    {
      title: '银行名称',
      dataIndex: 'bankname',
      key: 'bankname',
    },
    {
      title: '银行账号',
      dataIndex: 'bankaccount',
      key: 'bankaccount',
    },
    {
      title: '注册资本',
      dataIndex: 'regmoney',
      key: 'regmoney',
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
  ];
  //物料
  columnsMaterial = [
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
      title: '物料分类',
      dataIndex: 'invclName',
      key: 'invclName',

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

  ];
  //BOM
  columnsBom = [
    {
      title: '图幅',
      dataIndex: 'pictureFrame',
    },
    {
      title: '代号',
      dataIndex: 'drawing',
    },
    {
      title: '物料名称',
      dataIndex: 'materialName',
    },
    {
      title: '材料',
      dataIndex: 'material',
    },
    {
      title: '所属装配图代号',
      dataIndex: 'assemblyCode',
    },
    {
      title: '所属装配图数量',
      dataIndex: 'assemblyNumber',
    },
    {
      title: '总数',
      dataIndex: 'total',
    },
    {
      title: '页码',
      dataIndex: 'pageNumber',
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
    {
      title: '物料编码',
      dataIndex: 'materialCode',
    },
    {
      title: '生产类型',
      dataIndex: 'productType',
    },
    {
      title: '原材料编码',
      dataIndex: 'rawMaterialCode',
    },
    {
      title: '工艺定额',
      dataIndex: 'processQuota',
    },
  ];
  //导出模板
  daoChuMuBan = () => {
    const { selectValue } = this.state;
    let name = '';
    switch (selectValue) {
      case 1:
        name = '合同模板';
        break;
      case 2:
        name = '客商模板';
        break;
      case 3:
        name = '物料模板';
        break;
      case 4:
        name = 'BOM模板';
        break;
      default:
        name: '模板';
    }
    let useColumns = [];
    switch (selectValue) {
      case 1:
        useColumns = this.columnsContract;
        break;
      case 2:
        useColumns = this.columnsManage;
        break;
      case 3:
        useColumns = this.columnsMaterial;
        break;
      case 4:
        useColumns = this.columnsBom;
        break;
      default:
        useColumns: [];
    }
    let option = {};

    let arr = []; //保存ke
    useColumns.map(item => {
      if (item.dataIndex === 'version' || item.dataIndex === 'status' || item.dataIndex === 'caozuo') {

      } else {
        arr.push(item.title);
      }
    });

    option.fileName = name;
    option.datas = [
      {
        sheetData: [],
        sheetName: 'sheet',
        sheetFilter: arr,
        sheetHeader: arr,
      },
    ];

    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  onChange = (value) => {
    if (value) {
      this.setState({
        isStart: true,
      });
    } else {
      this.setState({
        isStart: false,
      });
    }
    this.setState({ selectValue: value });
  };
  //导入
  importExcel = (file) => {

    // 获取上传的文件对象
    const { files } = file.target;
    if (files.length) {
      this.setState({
        inputFileName: files[0].name,
      });
    } else {
      this.setState({
        inputFileName: '未选择任何文件',
      });
    }

    // 通过FileReader对象读取文件
    const fileReader = new FileReader();

    fileReader.onload = event => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = []; // 存储获取到的数据

        // if(!data.length){
        //     this.endInterval();
        //     return message.error("无数据导入")
        // }
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            //break; // 如果只取第一张表，就取消注释这行
          }
        }
        //data = data.filter(item=> '序号' in item);
        const { selectValue } = this.state;
        const { dispatch } = this.props;

        this.setIntervalStart();

        if (selectValue === 1) {
          let content = [];
          data.map(item => {
            let obj = {};
            if ('合同编码' in item) {
              obj.billcode = item['合同编码'].toString();
            } else {
              obj.billcode = null;
            }

            if ('合同名称' in item) {
              obj.billname = item['合同名称'].toString();
            } else {
              obj.billname = null;
            }

            if ('合同类型' in item) {
              obj.type = item['合同类型'].toString();
            } else {
              obj.type = null;
            }

            if ('合同状态' in item) {
              obj.status = item['合同状态'].toString();
            } else {
              obj.status = '初始状态';
            }

            if ('签约日期' in item) {
              obj.signdate = item['签约日期'].toString();
            } else {
              obj.signdate = null;
            }

            if ('签约地址' in item) {
              obj.signplace = item['签约地址'].toString();
            } else {
              obj.signplace = null;
            }

            if ('调试完成日期' in item) {
              obj.planValidateTime = item['调试完成日期'].toString();
            } else {
              obj.planValidateTime = null;
            }

            if ('质保期' in item) {
              obj.planTeminateTime = item['质保期'].toString();
            } else {
              obj.planTeminateTime = null;
            }

            if ('客户' in item) {
              obj.custName = item['客户'].toString();
            } else {
              obj.custName = null;
            }

            if ('经办部门' in item) {
              obj.deptName = item['经办部门'].toString();
            } else {
              obj.deptName = null;
            }

            if ('经办人员' in item) {
              obj.operatorName = item['经办人员'].toString();
            } else {
              obj.operatorName = null;
            }

            if ('合同金额' in item) {
              obj.contractmny = item['合同金额'];
            } else {
              obj.contractmny = null;
            }

            if ('额外费用' in item) {
              obj.additionalcharges = item['额外费用'];
            } else {
              obj.additionalcharges = null;
            }

            if ('有效合同额' in item) {
              obj.eca = item['有效合同额'];
            } else if (item['合同金额'] && item['额外费用']) {
              obj.eca = Number(item['合同金额']) - Number(item['额外费用']);
            } else {

              obj.eca = null;
            }

            if ('合同所在省份' in item) {
              obj.vdef1 = item['合同所在省份'];
            } else {
              obj.vdef1 = null;
            }
            content.push(obj);

          });

          if (content.length >= 2) {
            for (let i = 0; i < content.length; i++) {
              if (!content[i + 1]) {
                break;
              }
              if (content[i].billcode === content[i + 1].billcode) {
                return message.error(`合同编码重复-${content[i].billcode}`);
              }
              if (content[i].billname === content[i + 1].billname) {
                return message.error(`合同名称重复-${content[i].billname}`);
              }

            }
          }
          dispatch({
            type: 'DI/addfile',
            payload: {
              reqDataList: content,
            },
            callback: (res) => {
              if (res.errCode === '0') {
                message.success('导入成功');
                this.setState({
                  progressStatus: 'active',
                });
              } else {
                message.error(res.userObj.msg ? res.userObj.msg : '');
                this.setState({
                  progressStatus: 'exception',
                });
              }
            },
          });
        } else if (selectValue === 2) {
          let content = [];
          data.map(item => {
            let obj = {};

            if ('客户编码' in item) {
              obj.code = item['客户编码'].toString();
            } else {
              obj.code = null;
            }

            if ('客户名称' in item) {
              obj.name = item['客户名称'].toString();
            } else {
              obj.name = null;
            }

            if ('所属地区' in item) {
              obj.areaclid = item['所属地区'];
            } else {
              obj.areaclid = this.state.id;
            }

            if ('简称' in item) {
              obj.shortname = item['简称'].toString();
            } else {
              obj.shortname = null;
            }

            if ('客商类型' in item) {
              obj.custtype = item['客商类型'].toString();
            } else {
              obj.custtype = '2';
            }

            if ('职务' in item) {
              obj.website = item['职务'].toString();
            } else {
              obj.website = null;
            }

            if ('联系人及电话' in item) {
              obj.contact = item['联系人及电话'].toString();
            } else {
              obj.contact = null;
            }

            if ('传真' in item) {
              obj.phone = item['传真'].toString();
            } else {
              obj.phone = null;
            }

            if ('法人姓名' in item) {
              obj.respsnname = item['法人姓名'].toString();
            } else {
              obj.respsnname = null;
            }

            if ('地址' in item) {
              obj.address = item['地址'].toString();
            } else {
              obj.address = null;
            }

            if ('邮编' in item) {
              obj.zipcode = item['邮编'].toString();
            } else {
              obj.zipcode = null;
            }

            if ('统一社会信用代码' in item) {
              obj.uscc = item['统一社会信用代码'].toString();
            } else {
              obj.uscc = null;
            }

            if ('等级' in item) {
              obj.custlevel = item['等级'].toString();
            } else {
              obj.custlevel = null;
            }

            if ('银行名称' in item) {
              obj.bankname = item['银行名称'].toString();
            } else {
              obj.bankname = null;
            }

            if ('银行账号' in item) {
              obj.bankaccount = item['银行账号'].toString();
            } else {
              obj.bankaccount = null;
            }

            if ('注册资本' in item) {
              obj.regmoney = item['注册资本'];
            } else {
              obj.regmoney = null;
            }

            if ('备注' in item) {
              obj.memo = item['备注'].toString();
            } else {
              obj.memo = null;
            }

            content.push(obj);
          });
          if (content.length >= 2) {
            for (let i = 0; i < content.length; i++) {
              if (!content[i + 1]) {
                break;
              }
              if (content[i].code === content[i + 1].code) {
                return message.error(`客户编码重复-${content[i].code}`);
              }
              if (content[i].name === content[i + 1].name) {
                return message.error(`客户名称重复-${content[i].name}`);
              }

            }
          }
          dispatch({
            type: 'DI/addfilekehu',
            payload: {
              reqDataList: content,
            },
            callback: (res) => {
              if (res.errCode === '0') {
                message.success('导入成功');
                this.setState({
                  progressStatus: 'active',
                });
              } else {
                message.error(res.userObj.msg ? res.userObj.msg : '');
                this.setState({
                  progressStatus: 'exception',
                });
              }
            },
          });
        } else if (selectValue === 3) {
          let content = [];
          data.map(item => {
            let obj = {
              list: [],
              pagination: {
                total: 0,
                current: 1,

              },
            };

            if ('物料编码' in item) {
              obj.code = item['物料编码'].toString();
            } else {
              obj.code = null;
            }

            if ('物料名称' in item) {
              obj.name = item['物料名称'].toString();
            } else {
              obj.name = null;
            }

            if ('物料分类' in item) {
              obj.invclName = item['物料分类'].toString();
            } else {
              obj.invclName = null;
            }

            if ('型号' in item) {
              obj.model = item['型号'].toString();
            } else {
              obj.model = null;
            }

            if ('计量单位' in item) {
              obj.ucumName = item['计量单位'].toString();
            } else {
              obj.ucumName = null;
            }

            if ('物料简称' in item) {
              obj.materialshortname = item['物料简称'].toString();
            } else {
              obj.materialshortname = null;
            }

            if ('物料条码' in item) {
              obj.materialbarcode = item['物料条码'].toString();
            } else {
              obj.materialbarcode = null;
            }

            if ('物料助记码' in item) {
              obj.materialmnecode = item['物料助记码'].toString();
            } else {
              obj.materialmnecode = null;
            }

            if ('图号' in item) {
              obj.graphid = item['图号'].toString();
            } else {
              obj.graphid = null;
            }

            if ('物料类型' in item) {
              obj.materialType = item['物料类型'].toString();
            } else {
              obj.materialType = null;
            }

            if ('委外类型' in item) {
              obj.outsourcingType = item['委外类型'].toString();
            } else {
              obj.outsourcingType = null;
            }

            if ('物料形态' in item) {
              obj.materialForm = item['物料形态'].toString();
            } else {
              obj.materialForm = null;
            }

            if ('规格' in item) {
              obj.spec = item['规格'].toString();
            } else {
              obj.spec = null;
            }

            if ('备注' in item) {
              obj.memo = item['备注'].toString();
            } else {
              obj.memo = null;
            }

            content.push(obj);
          });

          if (content.length >= 2) {
            for (let i = 0; i < content.length; i++) {
              if (!content[i + 1]) {
                break;
              }
              if (content[i].code === content[i + 1].code) {
                return message.error(`物料编码重复-${content[i].code}`);
              }
            }
          }
          let status = false;
          let statusData = '';

          content.map((item) => {
            if (item.materialType === '制造件') {
              if (!item.graphid) {
                status = true;
                statusData = item.name + '是制造件,图号不能为空';
              }
            }
          });

          if (status) {
            return message.error(statusData, 2);
          }

          dispatch({
            type: 'DI/addList',
            payload: {
              reqDataList: content,
            },
            callback: (res) => {
              console.log('--返回', res);
              this.endInterval();
              if (res.errCode === '0') {
                message.success('导入成功');
                this.setState({
                  progressStatus: 'active',
                  progressLoad: 100,
                });
              } else {
                message.error(res.userObj.msg ? res.userObj.msg : '');
                this.setState({
                  progressStatus: 'exception',
                });
              }
            },
          });
        } else if (selectValue === 4) {
          let content = [];
          data.map(item => {
            let obj = {};

            if ('图幅' in item) {
              obj.pictureFrame = item['图幅'].toString();
            } else {
              obj.pictureFrame = null;
            }

            if ('代号' in item) {
              obj.drawing = item['代号'].toString();
            } else {
              obj.drawing = null;
            }

            if ('物料名称' in item) {
              obj.materialName = item['物料名称'].toString();
            } else {
              obj.materialName = null;
            }

            if ('材料' in item) {
              obj.material = item['材料'].toString();
            } else {
              obj.material = null;
            }

            if ('所属装配图代号' in item) {
              obj.assemblyCode = item['所属装配图代号'].toString();
            } else {
              obj.assemblyCode = null;
            }

            if ('所属装配图数量' in item) {
              obj.assemblyNumber = Number(item['所属装配图数量']);
            } else {
              obj.assemblyNumber = null;
            }

            if ('总数' in item) {
              obj.total = Number(item['总数']);
            } else {
              obj.total = null;
            }

            if ('页码' in item) {
              obj.pageNumber = item['页码'].toString();
            } else {
              obj.pageNumber = null;
            }

            if ('备注' in item) {
              obj.memo = item['备注'].toString();
            } else {
              obj.memo = null;
            }

            if ('物料编码' in item) {
              obj.materialCode = item['物料编码'].toString();
            } else {
              obj.materialCode = null;
            }

            if ('生产类型' in item) {
              obj.productType = item['生产类型'].toString();
            } else {
              obj.productType = null;
            }

            if ('原材料编码' in item) {
              obj.rawMaterialCode = item['原材料编码'].toString();
            } else {
              obj.rawMaterialCode = null;
            }

            if ('工艺定额' in item) {
              obj.processQuota = Number(item['工艺定额']);
            } else {
              obj.processQuota = null;
            }
            content.push(obj);
          });
          console.log('ccc', content);
          const treeData = toTreeSpecify(content, 'drawing', 'assemblyCode');
          console.log('treeData1111', treeData);
          if (content.length >= 2) {
            for (let i = 0; i < content.length; i++) {
              if (!content[i + 1]) {
                break;
              }
              if(content[i].materialCode == null || content[i+1].materialCode == null){
                return message.error("存在物料编码为空的项");
              }
              if(content[i].drawing == null || content[i+1].drawing == null){
                return message.error("存在代号为空的项");
              }
              if (content[i].drawing === content[i + 1].drawing) {
                return message.error(`代号重复-${content[i].code}`);
              }
            }
          }
          dispatch({
            type: 'DI/addListBOm',
            payload: {
              reqDataList: treeData,
            },
            callback: (res) => {
              console.log('--返回', res);
              this.endInterval();
              if (res.errCode === '0') {
                message.success('导入成功');
                this.setState({
                  progressStatus: 'active',
                  progressLoad: 100,
                });
              } else {
                message.error(res.userObj.msg ? res.userObj.msg : '');
                this.setState({
                  progressStatus: 'exception',
                });
              }
            },
          });

        }
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        this.endInterval();
        return message.error('文件错误');
      }
    };

    fileReader.onprogress = (event) => {
      this.setState({
        progressLoad: (event.loaded / event.total) * 100 / 2,
      });
    };
    // 以二进制方式打开文件
    if (files && files.length) {
      fileReader.readAsBinaryString(files[0]);
    }
  };

  setIntervalStart = () => {
    this.startInterval = setInterval(() => {
      const { progressLoad } = this.state;
      if (progressLoad === 99) {
        this.endInterval();
      }
      this.setState({
        progressLoad: progressLoad + 1,
      });
    }, 50);
  };

  endInterval = () => {

    clearInterval(this.startInterval);
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      //modelType:{ datapre },
      dispatch,
    } = this.props;
    const { isStart, inputFileName, progressLoad, progressStatus } = this.state;
    /* if(progressStatus === 'exception'){
        this.setState({
         progressLoad:30
        })
     }else{
         this.setState({
             progressLoad:progressSum
         })
     }*/

    if (inputFileName === '未选择任何文件') {
      this.setState({
        progressStatus: 'exception',
        progressSum: 0,
        progressLoad: 0,
      });
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '10px' }}>选择类型:</div>
              <div>
                <Select
                  style={{ width: '200px' }}
                  onSelect={this.onChange}
                  placeholder={'请选择类型'}>
                  {/* <Option value={1}>合同</Option>
                                    <Option value={2}>客商</Option> */}
                  <Option value={3}>物料</Option>
                  <Option value={4}>BOM</Option>
                </Select>
              </div>

            </div>
            <div style={{ marginLeft: '18px', width: '80px' }}>
              <Button
                onClick={this.daoChuMuBan}
                type='primary' disabled={!isStart}>导出模板</Button>
            </div>
            <div style={{ width: '130px' }}>
              <a
                disabled={!isStart}
                style={{ color: `${isStart}?red:blue` }}
                className="fileddd">导入模板
                <input
                  type="file"
                  style={{ marginLeft: '20px' }}
                  accept='.xlsx, .xls'
                  onChange={(e) => {
                    this.importExcel(e);
                  }}
                />
              </a>
              <span style={{
                margin: '4px 0 0 30px',
                width: '100px',
                display: 'block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}>{this.state.inputFileName}</span>
              <span style={{ marginLeft: '20px' }}>
                                <Progress
                                  strokeColor={'#F5222D'}
                                  // showInfo={false}
                                  status={progressStatus}
                                  percent={progressLoad}
                                  steps={100} />
                            </span>

            </div>

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DateIn;
