import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  TreeSelect ,
  Button,
  Card,
  TextArea,
  Checkbox,
  InputNumber,
  Tree,
  Icon,
  Tooltip,
  Modal,
  message, Popconfirm,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import storage from '@/utils/storage'

class ReworkManage extends PureComponent {
  state = {

  }


  componentDidMount(){

  }

  render() {
    const {

    } = this.props;

    return (
      <PageHeaderWrapper>
        <div style={{display:'flex'}}>
          <Card style={{ flex:'1',marginRight:'3%',boxSizing:'border-box',overflow:'hodden' }} bordered={false}>
            <div>
              11
            </div>
          </Card>

        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ReworkManage;
;
