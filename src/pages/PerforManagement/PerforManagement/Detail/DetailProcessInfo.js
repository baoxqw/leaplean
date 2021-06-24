/** 过程查看 */
import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { Card, Form, Input, Upload, Button, Icon } from 'antd';


const fileList = [{
  uid: '-1',
  name: 'xxx.png',
  status: 'done',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}, {
  uid: '-2',
  name: 'yyy.png',
  status: 'done',
  url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
}];

const props = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'picture',
  defaultFileList: [...fileList],
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

@connect(({ PostManagement, loading }) => ({
  PostManagement,
  loading: loading.effects['PostManagement/fetchDetailProcessInfo'],
}))
@Form.create()
class DetailProcessInfo extends Component {
  validate () {
    const {form} = this.props
    form.validateFields((err, fieldsValue) => {

    })
  }
  render() {
    return (
      <Card title={formatMessage({ id: 'validation.processview' })} bordered={false}>
        <Form layout="vertical" >
          <Form.Item {...formItemLayout} label={`${formatMessage({ id: 'validation.corporatefinance' })}:`}>
            <Input placeholder={formatMessage({ id: 'validation.pleaseentertheamount' })} />
          </Form.Item>
          <Form.Item {...formItemLayout} label={`${formatMessage({ id: 'validation.time' })}:`}>
            <Input placeholder={formatMessage({ id: 'validation.memo.required' })} />
          </Form.Item>
        </Form>
        <Upload {...props}>
          <Button>
            <Icon type="upload" /> {formatMessage({ id: 'validation.uploadfiles' })}
          </Button>
        </Upload>

        <Button onClick={()=>this.validate()}>{formatMessage({ id: 'form.submit' })}</Button>
        <Button>{formatMessage({ id: 'validation.cancle' })}</Button>
      </Card>
    );
  }
}

export default DetailProcessInfo;
