import React, { PureComponent ,Fragment} from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import storage from '@/utils/storage';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Row,
  Col,
  Table,
  Tooltip,
  AutoComplete,
  Upload,
  message,
  Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
// import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';
function onSelect(value) {
  
}
function onSelect1(value) {

}
const FormItem = Form.Item;
const Dragger = Upload.Dragger;

const props = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      
    }
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  },
};

@connect(({ audit,loading }) => ({
  audit,
  loading: loading.models.audit,
  datavale:audit.datasource,
  // submitting: loading.effects['form/submitProjectAddForm'],
}))

@Form.create()
class DetailAuditreportInfo extends PureComponent {
  pmdatasource = ['anne', 'jack', 'jone'];
  companydatasource = ['companyA', 'companyB', 'companyC'];
  state = {
    project_id:1,
    project_status:'FILL',
    fileList:[],
    uploading: false,
    datasource:[],
    mem:'',
    pageIndex:0,
  }
  columns = [
    {
      title: formatMessage({ id: 'validation.serialnumber' }),
      dataIndex: 'key',
    },
    {
      title: formatMessage({ id: 'form.title.memo' }),
      dataIndex: 'memo',
      render:(item,record)=>{
        return  <a href={`https://www.leapingtech.net/nien-0.0.1-SNAPSHOT${record.path}/${record.name}`} download>{item}</a>
      }
    },
    {
      title: formatMessage({ id: 'validation.uploader' }),
      dataIndex: 'upuser',
    },

    {
      title:formatMessage({ id: 'validation.operation' }),
      render: (text, record) => (
        <Fragment>
          <Popconfirm title={formatMessage({ id: 'validation.confirmdelete' })} onConfirm={() => this.handleDelete(record)}>
            <a href="javascript:;">{formatMessage({ id: 'validation.delete' })}</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];
  backClick = ()=>{
    router.push('/postmanagement/postmanagement/list');
  }
  //点击删除
  handleDelete = (record)=>{
    const { dispatch } = this.props;
    const { pageIndex } = this.state;
    dispatch({
      type: 'audit/attachmentdel',
      payload: {
        id: record.id,
        pageIndex
      },
      callback:(res)=>{
        // location.reload()
        let u = window.location.href;
        let index = u .lastIndexOf("\/");
        let b  = u .substring(index + 1, u.length);
        const str = {
          reqData:{
            bill_id:b,
            type:'audit',
            pageIndex:0,
            pageSize:10
          }
        }
        dispatch({
          type: 'audit/queryattchment',
          payload: str,
          callback:(res)=>{
            this.setState({datasource:res})
          }
        })
      }
    })
    // location.reload()
  };
  componentDidMount(){
    const { dispatch} = this.props;
    let u = window.location.href;
    let index = u .lastIndexOf("\/");
    let b  = u .substring(index + 1, u.length);
    this.setState({project_id:b})
    const str = {
      reqData:{
        bill_id:b,
        type:'audit',
        pageIndex:0,
        pageSize:10
      }
    }
    dispatch({
      type: 'audit/queryattchment',
      payload: str,
      callback:(res)=>{
        this.setState({datasource:res})
      }
    })
  }
  //分页
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    const obj = {
      bill_id:this.state.project_id,
      type:'audit',
      pageIndex: pagination.current-1,
      pageSize: pagination.pageSize,
    };
    this.setState({
      pageIndex:obj.pageIndex
    })
    dispatch({
      type: 'audit/queryattchment',
      payload: obj,
    });
  };
  handleDel = e => {
    const { dispatch,form} = this.props;
    const { fileList } = this.state;
    form.resetFields();
    this.setState({
      fileList: [],
    });
  }
  handleUpload = e => {
    const { dispatch,form} = this.props;
    const { fileList } = this.state;
    const user = storage.get("userinfo");
    const corp_id = user.corp.id;
    var mem = '';
    this.props.form.validateFields((err, values) => {
      mem = values.memo;
      this.setState({mem:values.memo})
    });
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
      formData.append('type', 'business');
      formData.append('parentpath', 'audit');
      formData.append('status', '');
      formData.append('corp_id', corp_id);
      formData.append('project_id',this.state.project_id);
      formData.append('memo',mem);
      formData.append('project_status','');
    });

    this.setState({
      uploading: true,
      fileList: []
    });

    dispatch({
      type: 'audit/submitProjectAddForm',
      payload: formData,
      callback: () => {

        message.success(`${formatMessage({ id: 'validation.uploadsuccess' })}`)
        form.resetFields();
        this.setState({
          uploading: false,
          fileList: []
        });
        const str = {
          reqData:{
            bill_id:this.state.project_id,
            type:'audit',
            pageIndex:this.state.pageIndex,
            pageSize:10
          }
        }
        dispatch({
          type: 'audit/queryattchment',
          payload: str,
          callback:(res)=>{
            this.setState({datasource:res})
          }
        })

      }
    });
  };
  render() {
    const {
      submitting ,
      loading,
      audit: { datasource },
    } = this.props;

    const { uploading, fileList } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    // const form = this.props.fundproject.message;
    const props = {
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        /*dispatch({
          type: 'formManage/beforeupload',
          payload: file,
        });*/
        return false;
      },
      fileList,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
        <GridContent>
          <Row gutter={24}>
            <Col style={{marginBottom:'40px'}}>
              <Card title={formatMessage({ id: 'validation.quarterlyreport' })} bordered={false}>
                <Form onSubmit={this.handleSubmit}  style={{ marginTop: 8 ,marginLeft:0}}>
                  <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.memo" />}>
                    {getFieldDecorator('memo')(
                      <TextArea style={{ width: '100%', marginLight: '-3%' }} placeholder={formatMessage({ id: 'validation.memo.required' })} />
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label={formatMessage({ id: 'validation.file' })}>
                    {getFieldDecorator('file')(
                      <div>
                        <Upload {...props}>
                          <Button style={{ width: '200px',marginBottom:'28%' }}>
                            <Icon type="upload" /> {formatMessage({ id: 'valid.select.file' })}
                          </Button>
                        </Upload>
                        <Button
                          type="plus"
                          onClick={this.handleUpload}
                          // disabled={fileList.length === 0}
                          loading={uploading}
                          style={{ marginTop: 16 ,background:'#52c41a',color:"#fff"}}
                        >
                          {uploading ? formatMessage({ id: 'valid.new.upload' }) : formatMessage({ id: 'form.submit' })}
                        </Button>
                        <Button
                          onClick={this.handleDel}
                          style={{marginLeft:'20px'}}
                        >{formatMessage({ id: 'validation.cancle' })}</Button>
                      </div>
                    )}
                  </FormItem>
                </Form>
              </Card>

            </Col>
            <Col >
              <Card title={formatMessage({ id: 'validation.attachmentlist' })} bordered={false}>
                <Table
                  style={{ marginBottom: 16 }}
                  // data={columdata}
                  loading={loading}
                  dataSource={datasource}
                  columns={this.columns}
                  onChange={this.handleStandardTableChange}
                />
              </Card>
            </Col>
          </Row>
          <FooterToolbar style={{ width: '100%' }}>
            <Button
              onClick={this.backClick}
            >{formatMessage({ id: 'validation.return' })}
            </Button>
          </FooterToolbar>
        </GridContent>
    );
  }
}

export default DetailAuditreportInfo;
