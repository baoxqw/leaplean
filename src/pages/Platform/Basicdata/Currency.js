import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
  InputNumber,
} from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CurrencyTableForm from './CurrencyTableForm';

import styles from '../System/UserAdmin.less';

const currencyTableData = [
  {
    key: '1',
    name: '人民币',
    abbreviation: 'RMB',
    exchangerate: '1',
  },
  {
    key: '2',
    name: '美元',
    abbreviation: 'USD',
    exchangerate: '6.99',
  },
  {
    key: '3',
    name: '日元',
    abbreviation: 'JPY',
    exchangerate: '0.15',
  },
];

@Form.create()
class Currencys extends PureComponent {
  state = {
    width: '100%',
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(null),
  };
  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width, editorState } = this.state;

    return (
      <PageHeaderWrapper>
        <Card title="币种" className={styles.card} bordered={false}>
          {getFieldDecorator('currency', {
            initialValue: currencyTableData,
          })(<CurrencyTableForm />)}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Currencys;
