/** ιεΊζε΅ */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Modal, Input, Col, Select, Row, DatePicker,AutoComplete,message  } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import NormalTable from '@/components/NormalTable';
import router from 'umi/router';
import FooterToolbar from '@/components/FooterToolbar';
import momentt from '../../../EcProjectManagement/OngoingProject/OngoingProjectUpdateProject';
import moment from 'moment'
import { formatMessage, FormattedMessage } from 'umi/locale';

const Option = Select.Option;
function accAdd(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}
@connect(({ info, loading }) => ({
  info,
  loading: loading.models.info,
  data:info.data,
  projectDetail: info.projectDetail,
  projectDistributionList:info.projectDistributionList,
  projectFinanceList: info.projectFinanceList,
  projectHistoryList: info.projectHistoryList,
  projectLicenseList: info.projectLicenseList,
  projectShareholderList: info.projectShareholderList,
  projectTeamList: info.projectTeamList,
}))
@Form.create()
class DetailQuitInfo extends Component {

  state = {
    addFormVisible: false,
    id:null,
    postdetail_id:null,
    dataSource:{},
    exitedcapitalBTC:null,
    ticker:'',
    fundname:'',
    memo:'',
    tag:'',
    exitdate:'',
    createdate:'',
    amountinvested:'',
    amountleft:'',
    capitalinvestednative:'',
    amount:null, //ζ Ήζ?ε­ιε€ζ­ζ―ε¦ζΎη€Ίζ°ε’
    show:false,
    dataValue:{}  //ε±η€ΊζΆηζ°ζ?
  }

  columns = [
    { title: formatMessage({ id: 'validation.post-settime' }), dataIndex: 'exitdate' },
    { title: formatMessage({ id: 'validation.fundname' }), dataIndex: 'fund_name' },
    {
      title:formatMessage({ id: 'validation.Investmenttype' }),
      dataIndex: 'investtype',
      render:(text)=>{
        if(text === 1){
          return formatMessage({ id: 'validation.equity' })
        }
        if(text === 2){
          return 'Token'
        }
      }
    },
    { title: formatMessage({ id: 'validation.Withdrawprofit' }), dataIndex: 'exitedearningsbtc' },
    {
      title:formatMessage({ id: 'validation.update' }),
      render:(text)=> {
        return <a href="#" onClick={(e)=>this.onShow(e,text)}>{formatMessage({ id: 'validation.view' })}</a>
      }
    }
  ];


  onShow = (e,text)=>{
    e.preventDefault()
    const { id } = text;
    const { dispatch } = this.props;

    this.setState({
      show:true
    })
    dispatch({
      type:'info/query',
      payload:{
        reqData:{
          id:text.id
        }
      },
      callback:(res)=>{
  
        if(res.resData && res.resData.length){
          this.setState({
            dataValue:res.resData[0]
          })
        }
      }
    })

  }

  onCloseShow = ()=>{
    this.setState({
      show:false
    })
  }

  backClick = ()=>{
    router.push('/postmanagement/postmanagement/list');
  }
  componentDidMount() {
    const { dispatch,id,postdetail_id,amount } = this.props;

    dispatch({
      type:'info/find',
      payload:{
        reqData:{
          id:postdetail_id
        }
      }
    });
    this.setState({
      id: Number(id),
      postdetail_id,
      amount
    })
  }

  okHandle = (handleFormVisible) => {
    const { form,dispatch } = this.props;
    const { dataSource,postdetail_id } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      if(!dataSource.ticker){
        message.error(formatMessage({ id: 'validation.Cannotbeempty' }));
        return
      }
      if(!dataSource.exitedcapitalBTC){
        message.error(formatMessage({ id: 'validation.Exitamountcannotbeempty' }));
        return
      }
      if(!this.state.exitdate){
        message.error(formatMessage({ id: 'validation.Exittimecannotbeempty' }));
        return
      }
      if(!dataSource.exit_quantity){
        message.error(formatMessage({ id: 'validation.Thenumberofexitscannotbeempty' }));
        return
      }
      if(!dataSource.exchangerate){
        message.error(formatMessage({ id: 'validation.Theoriginalexchangeratecannotbeempty' }));
        return
      }if(!dataSource.exchangerate2){
        message.error(formatMessage({ id: 'validation.Exitratecannotbeempty' }));
        return
      }
      if(!dataSource.Survival){
        message.error(formatMessage({ id: 'validation.Projectcurrencyrealtimeinventorycannotbeempty' }));
        return
      }
      if(!dataSource.amountleft){
        message.error(formatMessage({ id: 'validation.Theremainingquantitycannotbeempty' }));
        return
      }
      if(!dataSource.exitedearningsBTC){
        message.error(formatMessage({ id: 'validation.Exitprofitcannotbeempty' }));
        return
      }
      if(!dataSource.netvalueBTC){
        message.error(formatMessage({ id: 'validation.Netvaluecannotbeempty' }));
        return
      }
      if(!dataSource.value){
        message.error(formatMessage({ id: 'validation.Valuecannotbeempty' }));
        return
      }
      if(!dataSource.carryrate){
        message.error(formatMessage({ id: 'validation.Excessratecannotbeempty' }));
        return
      }
      if(!dataSource.carry){
        message.error(formatMessage({ id: 'validation.Excessamountcannotbeempty' }));
        return
      }
      if(!dataSource.carryleadrate){
        message.error(formatMessage({ id: 'validation.carryleadratiocannotbeempty' }));
        return
      }
      if(!dataSource.carrylead){
        message.error(formatMessage({ id: 'validation.Carryleadamountcannotbeempty' }));
        return
      }
      if(!dataSource.carrydescrate){
        message.error(formatMessage({ id: 'validation.Carrydescratiocannotbeempty' }));
        return
      }
      if(!dataSource.carrydesc){
        message.error(formatMessage({ id: 'validation.Carrydescamountcannotbeempty' }));
        return
      }
      if(!dataSource.carrypartners){
        message.error(formatMessage({ id: 'validation.Cooperationexcessamountcannotbeempty' }));
        return
      }
      if(!dataSource.contributiontoearnings){
        message.error(formatMessage({ id: 'validation.Revenuecontributioncannotbeempty' }));
        return
      }
      if(!values.original_institution){
        message.error(formatMessage({ id: 'validation.Theoriginalinstitutioncannotbeempty' }));
        return
      }
      if(!values.out_mechanism){
        message.error(formatMessage({ id: 'validation.Exitagencycannotbeempty' }));
        return
      }
      if(!values.original_currency){
        message.error(formatMessage({ id: 'validation.Originalcurrencycannotbeempty' }));
        return
      }
      const obj = {
        reqData:{
          exitdate:this.state.exitdate+'',
          exitmount:dataSource.exit_quantity+'',
          exitcurrency:dataSource.exitcurrency+'',
          exchangerate2:dataSource.exchangerate2+'',
          exchangerate:dataSource.exchangerate+'',
          amountleft:dataSource.amountleft+'',
          exitedcapitalBTC:dataSource.exitedcapitalBTC+'',
          exitedearningsBTC:dataSource.exitedearningsBTC+'',
          //PriceBTC:Number(dataSource.PriceBTC),  ζ²‘ζθΏδΈͺε­ζ?΅
          netvalueBTC:dataSource.netvalueBTC+'', //εδ»·εΌ
          value:dataSource.value+'', //δ»·εΌ
          carryrate:dataSource.carryrate+'',
          carry:dataSource.carry + '',
          carryleadrate:dataSource.carryleadrate+'',
          carrylead:dataSource.carrylead+'',
          carrydescrate:dataSource.carrydescrate+'',
          carrydesc:dataSource.carrydesc+'',
          carrypartners:dataSource.carrypartners+'',
          contributiontoearnings:dataSource.contributiontoearnings+'', //ζΆηθ΄‘η?
          project_id:this.state.id+'',
          postdetail_id:this.state.postdetail_id+'',
          memo:values.memo+'', //ε€ζ³¨
          original_institution:values.original_institution+'', //εε§ζΊζ
          out_mechanism:values.out_mechanism+'', //ιεΊζΊζ
          original_currency:values.original_currency+'', //εε§εΈη§
          ticker:values.ticker+'',
        }
      };

      const postdetail_id = this.state.postdetail_id;
      dispatch({
        type:'info/add',
        payload: obj,
        callback:(res)=>{
          if(res){
            message.success(formatMessage({ id: 'validation.Addedsuccessfully' }),1.5,()=>{
              const { updata } = this.props;
              handleFormVisible();
              dispatch({
                type:'info/find',
                payload:{
                  reqData:{
                    id:postdetail_id
                  }
                }
              })
              updata()
            });
          }
        }
      })
    })
  };

  handleFormVisible = () => {
    const { dispatch } = this.props;

    dispatch({
      type:'info/fetch',
      payload:{
        reqData:{
          id:this.state.id
        }
      },
      callback:(res)=>{

        if(res[0]){
          const ticker = res[0].ticker || '';
          const fund_name = res[0].fund_name || '';
          const tag = res[0].tag || '';
          const memo = res[0].memo || '';
          const noofshare = res[0].noofshare || '';
          const amountinvested = res[0].amountinvested || '';
          const amountleft = res[0].amountleft || '';
          const capitalinvestednative = res[0].capitalinvestednative || '';
          const createdate = res[0].createdate || '';
          this.setState({
            dataSource:{
              ...res[0],
              ticker,
              fund_name,
              tag,
              memo,
              noofshare,
            },
            ticker,
            fund_name,
            capitalinvestednative,
            tag,
            memo,
            createdate,
            amountinvested,
            amountleft,
          });
        }
      }
    });
    this.setState({ addFormVisible: !this.state.addFormVisible });
  };

  onTicker = e =>{
    const { form } = this.props;
    const ticker = this.state.ticker;
    if(ticker){
      this.setState({
        dataSource:{
          ticker:e.target.value,
          fund_name:this.state.fund_name,
          capitalinvestednative:this.state.capitalinvestednative,
          memo:this.state.memo,
          tag:this.state.tag,
          amountleft:this.state.amountleft,
          amountinvested:this.state.amountinvested
        },
        ticker:e.target.value,
        exitdate:this.state.exitdate
      });
      form.resetFields();
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        ticker: e.target.value
      },
      ticker:e.target.value,
    })
  };

  // εε§εΈ
  onShuru = (value)=>{
    const { dispatch } = this.props;
    if(this.state.dataSource.ticker && this.state.dataSource.original_institution){
      const Survival = this.state.dataSource.Survival || 0;
      switch (this.state.dataSource.original_institution) {
        case 'coinmarketcap':
          dispatch({
            type:'info/coinmarketcap',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase(),
              convert:value.toUpperCase()
            },
            callback:(res)=>{
              if(res.status.error_code === 400){
                message.error(formatMessage({ id: 'validation.Coinmarketcapdoesnotquerythevalue' }));
                /* const original_institution = this.state.dataSource.original_institution || '';
                 const exitcurrency = this.state.dataSource.exitcurrency || '';
                 const out_mechanism = this.state.dataSource.out_mechanism || '';
                 this.setState({
                   dataSource:{
                     ticker:this.state.dataSource.ticker,
                     original_currency:e.target.value,
                     original_institution,
                     exitcurrency,
                     out_mechanism,
                     fundname:this.state.fundname,
                     capitalinvestednative:this.state.capitalinvestednative,
                     memo:this.state.memo,
                     tag:this.state.tag,
                   }
                 });*/
                return
              }
              if(res.data[this.state.dataSource.ticker.toUpperCase()].quote[value.toUpperCase()].price){
                const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    original_currency: value,
                    exchangerate:Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[value.toUpperCase()].price).toFixed(4),
                    netvalueBTC:(Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[value.toUpperCase()].price) * Survival).toFixed(4),
                    original:(Number(capitalinvestednative)*Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[value.toUpperCase()].price)).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'huobi':
          dispatch({
            type:'info/huobi',
            payload: {
              symbol:this.state.dataSource.ticker.toLowerCase()+value.toLowerCase(),
            },
            callback:(res)=>{
              if(res.status === 'error'){
                message.error(formatMessage({ id: 'validation.Didnotgetthecomparisonvaluewithhuobi' }));
                /*const original_institution = this.state.dataSource.original_institution || '';
                const exitcurrency = this.state.dataSource.exitcurrency || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_currency:e.target.value,
                    original_institution,
                    exitcurrency,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.tick.data[0].price){
                const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    original_currency: value,
                    exchangerate:Number(res.tick.data[0].price).toFixed(4),
                    netvalueBTC:(Number(res.tick.data[0].price) * Survival).toFixed(4),
                    original:(Number(capitalinvestednative)*Number(res.tick.data[0].price)).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'binance':
          dispatch({
            type:'info/binance',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase()+this.state.dataSource.original_currency.toUpperCase(),
            },
            callback:(res)=>{
              if(res.code === -1121){
                message.error(formatMessage({ id: 'validation.Noreturnvalue' }));
                /* const original_institution = this.state.dataSource.original_institution || '';
                 const exitcurrency = this.state.dataSource.exitcurrency || '';
                 const out_mechanism = this.state.dataSource.out_mechanism || '';
                 this.setState({
                   dataSource:{
                     ticker:this.state.dataSource.ticker,
                     original_currency:e.target.value,
                     original_institution,
                     exitcurrency,
                     out_mechanism,
                     fundname:this.state.fundname,
                     capitalinvestednative:this.state.capitalinvestednative,
                     memo:this.state.memo,
                     tag:this.state.tag,
                   }
                 });*/
                return
              }
              if(res.price){
                const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    original_currency: value,
                    exchangerate:Number(res.price).toFixed(4),
                    netvalueBTC:(Number(res.price) * Survival).toFixed(4),
                    original:(Number(capitalinvestednative)*Number(res.price)).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'okex':
          dispatch({
            type:'info/okex',
            payload: {
              symbol:value.toUpperCase(),
              ticker:this.state.dataSource.ticker.toUpperCase()
            },
            callback:(res)=>{
              if(res.code === 30032){
                message.error(formatMessage({ id: 'validation.Nocomparisonvaluesrelatedtookexwerefound' }));
                /*const original_institution = this.state.dataSource.original_institution || '';
                const exitcurrency = this.state.dataSource.exitcurrency || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_currency:e.target.value,
                    original_institution,
                    exitcurrency,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.last){
                const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    original_currency: value,
                    exchangerate:Number(res.last).toFixed(4),
                    netvalueBTC:(Number(res.last) * Survival).toFixed(4),
                    original:(Number(capitalinvestednative)*Number(res.last)).toFixed(4)
                  }
                })
              }
            }
          });
          break;
      }
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        original_currency: value
      }
    });
  }
  // εε§ζΊζ
  onOriginal = value =>{
    const { dispatch } = this.props;
    if(this.state.dataSource.ticker && this.state.dataSource.original_currency){
      const Survival = this.state.dataSource.Survival || 0;
      switch (value) {
        case 'coinmarketcap':
          dispatch({
            type:'info/coinmarketcap',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase(),
              convert:this.state.dataSource.original_currency.toUpperCase()
            },
            callback:(res)=>{
        
              if(res.status.error_code === 400){
                message.error("coinmarketcapζ²‘ζζ₯θ―’ε°εΌ");
                /*const original_currency = this.state.dataSource.original_institution || '';
                const exitcurrency = this.state.dataSource.exitcurrency || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution:e.target.value,
                    original_currency,
                    exitcurrency,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.data[this.state.dataSource.ticker.toUpperCase()].quote[this.state.dataSource.original_currency.toUpperCase()].price){
                const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    original_institution: value,
                    exchangerate:Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[this.state.dataSource.original_currency.toUpperCase()].price).toFixed(4),
                    netvalueBTC:(Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[this.state.dataSource.original_currency.toUpperCase()].price) * Survival).toFixed(4),
                    original:(Number(capitalinvestednative)*Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[this.state.dataSource.original_currency.toUpperCase()].price)).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'huobi':
          dispatch({
            type:'info/huobi',
            payload: {
              symbol:this.state.dataSource.ticker.toLowerCase()+this.state.dataSource.original_currency.toLowerCase(),
            },
            callback:(res)=>{
              if(res.status === 'error'){
                message.error("ζ²‘ζθ·εε°δΈhuobiηε―Ήζ―εΌ");
                /*const original_currency = this.state.dataSource.original_institution || '';
                const exitcurrency = this.state.dataSource.exitcurrency || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution:e.target.value,
                    original_currency,
                    exitcurrency,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(!res.tick.data){
                message.error("δΈε­ε¨")
                return
              }
              const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
              this.setState({
                dataSource:{
                  ...this.state.dataSource,
                  original_institution: value,
                  exchangerate:Number(res.tick.data[0].price).toFixed(4),
                  netvalueBTC:(Number(res.tick.data[0].price) * Survival).toFixed(4),
                  original:capitalinvestednative * Number(res.tick.data[0].price).toFixed(4),
                }
              });
            }
          });
          break;
        case 'binance':
          dispatch({
            type:'info/binance',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase()+this.state.dataSource.original_currency.toUpperCase(),
            },
            callback:(res)=>{
              if(res.code === -1121){
                message.error("ζ²‘ζθΏεεΌ");
                /*const original_currency = this.state.dataSource.original_institution || '';
                const exitcurrency = this.state.dataSource.exitcurrency || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution:e.target.value,
                    original_currency,
                    exitcurrency,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.price){
                const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    original_institution: value,
                    exchangerate:Number(res.price).toFixed(4),
                    netvalueBTC:(Number(res.price) * Survival).toFixed(4),
                    original:(Number(capitalinvestednative)*Number(res.price)).toFixed(4)
                  }
                });
                return
              }
            }
          });
          break;
        case 'okex':
          dispatch({
            type:'info/okex',
            payload: {
              symbol:this.state.dataSource.original_currency.toUpperCase(),
              ticker:this.state.dataSource.ticker.toUpperCase()
            },
            callback:(res)=>{
              if(res.code === 30032){
                message.error("ζ²‘ζζ₯θ―’ε°δΈokexζε³ηε―Ήζ―εΌ");
                /*const original_currency = this.state.dataSource.original_institution || '';
                const exitcurrency = this.state.dataSource.exitcurrency || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution:e.target.value,
                    original_currency,
                    exitcurrency,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.last){
                const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0;
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    original_institution: value,
                    exchangerate:Number(res.last).toFixed(4),
                    netvalueBTC:(Number(res.last) * Survival).toFixed(4),
                    original:(Number(capitalinvestednative)*Number(res.last)).toFixed(4)
                  }
                });
              }
            }
          });
          break;
      }
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        original_institution: value
      }
    })
  };


  // ιεΊεΈη§
  onTuichu = value =>{
    const { dispatch } = this.props;
    if(this.state.dataSource.ticker && this.state.dataSource.out_mechanism){
      switch (this.state.dataSource.out_mechanism) {
        case 'coinmarketcap':
          dispatch({
            type:'info/coinmarketcap',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase(),
              convert:value.toUpperCase()
            },
            callback:(res)=>{
              if(res.status.error_code === 400){
                message.error(formatMessage({ id: 'validation.Coinmarketcapdoesnotquerythevalue' }));
                /*const original_currency = this.state.dataSource.original_currency || '';
                const original_institution = this.state.dataSource.original_institution || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution,
                    original_currency,
                    exitcurrency:e.target.value,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.data[this.state.dataSource.ticker.toUpperCase()].quote[value.toUpperCase()].price){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    exitcurrency: value,
                    exchangerate2:Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[value.toUpperCase()].price).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'huobi':
          dispatch({
            type:'info/huobi',
            payload: {
              symbol:this.state.dataSource.ticker.toLowerCase() + value.toLowerCase(),
            },
            callback:(res)=>{
              if(res.status === 'error'){
                message.error(formatMessage({ id: 'validation.Didnotgetthecomparisonvaluewithhuobi' }));
                /*const original_currency = this.state.dataSource.original_currency || '';
                const original_institution = this.state.dataSource.original_institution || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution,
                    original_currency,
                    exitcurrency:e.target.value,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.tick.data[0].price){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    exitcurrency: value,
                    exchangerate2:Number(res.tick.data[0].price).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'binance':
          dispatch({
            type:'info/binance',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase()+value.toUpperCase(),
            },
            callback:(res)=>{
              if(res.code === -1121){
                message.error(formatMessage({ id: 'validation.Noreturnvalue' }));
                /*const original_currency = this.state.dataSource.original_currency || '';
                const original_institution = this.state.dataSource.original_institution || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution,
                    original_currency,
                    exitcurrency:e.target.value,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.price){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    exitcurrency: value,
                    exchangerate2:Number(res.price).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'okex':
          dispatch({
            type:'info/okex',
            payload: {
              symbol:this.state.dataSource.original_currency.toUpperCase(),
              ticker:this.state.dataSource.ticker.toUpperCase()
            },
            callback:(res)=>{
              if(res.code === 30032){
                message.error(formatMessage({ id: 'validation.Nocomparisonvaluesrelatedtookexwerefound' }));
                /*const original_currency = this.state.dataSource.original_currency || '';
                const original_institution = this.state.dataSource.original_institution || '';
                const out_mechanism = this.state.dataSource.out_mechanism || '';
                this.setState({
                  dataSource:{
                    ticker:this.state.dataSource.ticker,
                    original_institution,
                    original_currency,
                    exitcurrency:e.target.value,
                    out_mechanism,
                    fundname:this.state.fundname,
                    capitalinvestednative:this.state.capitalinvestednative,
                    memo:this.state.memo,
                    tag:this.state.tag,
                  }
                });*/
                return
              }
              if(res.last){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    exitcurrency: value,
                    exchangerate2:Number(res.last).toFixed(4)
                  }
                })
              }
            }
          });
          break;
      }
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        exitcurrency: value
      }
    })
  }
  // ιεΊζΊζ
  onMechanism = (value)=>{
    const { dispatch } = this.props;
    if(this.state.dataSource.ticker && this.state.dataSource.exitcurrency){
      switch (value) {
        case 'coinmarketcap':
          dispatch({
            type:'info/coinmarketcap',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase(),
              convert:this.state.dataSource.exitcurrency.toUpperCase()
            },
            callback:(res)=>{
              if(res.status.error_code === 400){
                message.error(formatMessage({ id: 'validation.Coinmarketcapdoesnotquerythevalue' }),1.5,()=>{
                  const original_currency = this.state.dataSource.original_currency || '';
                  const original_institution = this.state.dataSource.original_institution || '';
                  const exitcurrency = this.state.dataSource.exitcurrency || '';
                  this.setState({
                    dataSource:{
                      ticker:this.state.dataSource.ticker,
                      original_institution,
                      original_currency,
                      exitcurrency,
                      out_mechanism:value,
                      fundname:this.state.fundname,
                      capitalinvestednative:this.state.capitalinvestednative,
                      memo:this.state.memo,
                      tag:this.state.tag,
                    }
                  });
                });
                return
              }
              if(res.data[this.state.dataSource.ticker.toUpperCase()].quote[this.state.dataSource.exitcurrency.toUpperCase()].price){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    out_mechanism: value,
                    exchangerate2:Number(res.data[this.state.dataSource.ticker.toUpperCase()].quote[this.state.dataSource.exitcurrency.toUpperCase()].price).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'huobi':
          dispatch({
            type:'info/huobi',
            payload: {
              symbol:this.state.dataSource.ticker.toLowerCase()+this.state.dataSource.exitcurrency.toLowerCase(),
            },
            callback:(res)=>{
              if(res.status === 'error'){
                message.error(formatMessage({ id: 'validation.Didnotgetthecomparisonvaluewithhuobi' }),1.5,()=>{
                  const original_currency = this.state.dataSource.original_currency || '';
                  const original_institution = this.state.dataSource.original_institution || '';
                  const exitcurrency = this.state.dataSource.exitcurrency || '';
                  this.setState({
                    dataSource:{
                      ticker:this.state.dataSource.ticker,
                      original_institution,
                      original_currency,
                      exitcurrency,
                      out_mechanism:value,
                      fundname:this.state.fundname,
                      capitalinvestednative:this.state.capitalinvestednative,
                      memo:this.state.memo,
                      tag:this.state.tag,
                    }
                  });
                });
                return
              }
              if(res.tick.data[0].price){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    out_mechanism: value,
                    exchangerate2:Number(res.tick.data[0].price).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'binance':
          dispatch({
            type:'info/binance',
            payload: {
              symbol:this.state.dataSource.ticker.toUpperCase()+this.state.dataSource.exitcurrency.toUpperCase(),
            },
            callback:(res)=>{
              if(res.code === -1121){
                message.error(formatMessage({ id: 'validation.Noreturnvalue' }),1.5,()=>{
                  const original_currency = this.state.dataSource.original_currency || '';
                  const original_institution = this.state.dataSource.original_institution || '';
                  const exitcurrency = this.state.dataSource.exitcurrency || '';
                  this.setState({
                    dataSource:{
                      ticker:this.state.dataSource.ticker,
                      original_institution,
                      original_currency,
                      exitcurrency,
                      out_mechanism:value,
                      fundname:this.state.fundname,
                      capitalinvestednative:this.state.capitalinvestednative,
                      memo:this.state.memo,
                      tag:this.state.tag,
                    }
                  });
                });
                return
              }
              if(res.price){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    out_mechanism: value,
                    exchangerate2:Number(res.price).toFixed(4)
                  }
                })
              }
            }
          });
          break;
        case 'okex':
          dispatch({
            type:'info/okex',
            payload: {
              symbol:this.state.dataSource.exitcurrency.toUpperCase(),
              ticker:this.state.dataSource.ticker.toUpperCase()
            },
            callback:(res)=>{
              if(res.code === 30032){
                message.error(formatMessage({ id: 'validation.Nocomparisonvaluesrelatedtookexwerefound' }),1.5,()=>{
                  const original_currency = this.state.dataSource.original_currency || '';
                  const original_institution = this.state.dataSource.original_institution || '';
                  const exitcurrency = this.state.dataSource.exitcurrency || '';
                  this.setState({
                    dataSource:{
                      ticker:this.state.dataSource.ticker,
                      original_institution,
                      original_currency,
                      exitcurrency,
                      out_mechanism:value,
                      fundname:this.state.fundname,
                      capitalinvestednative:this.state.capitalinvestednative,
                      memo:this.state.memo,
                      tag:this.state.tag,
                    }
                  });
                });
                return
              }
              if(res.last){
                this.setState({
                  dataSource:{
                    ...this.state.dataSource,
                    out_mechanism: value,
                    exchangerate2:Number(res.last).toFixed(4)
                  }
                })
              }
            }
          });
          break;
      }
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        out_mechanism: value
      }
    })
  };


  //εε§ζ°ι
  onOriginalQuantity = e =>{
    if(!e.target.value){
      this.setState({
        dataSource:{
          ...this.state.dataSource,
          amountinvested: Number(e.target.value).toFixed(4),
          Survival:0,
          netvalueBTC:0,
          value:0,
        }
      });
      return
    }
    const exit_quantity = this.state.dataSource.exit_quantity || 0;
    const exchangerate = this.state.dataSource.exchangerate || 0;
    const Survival = Number(e.target.value) - Number(exit_quantity);
    const exitedcapitalBTC = this.state.dataSource.exitedcapitalBTC || 0; //ιεΊιι’
    const netvalueBTC = (exchangerate * Survival);
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        amountinvested: Number(e.target.value).toFixed(4),
        Survival,
        netvalueBTC:netvalueBTC.toFixed(4),
        value: (Number(exitedcapitalBTC)+ netvalueBTC).toFixed(4),
      }
    });
  }
  //ιεΊζ°ι
  onExitQuantity = e =>{
    if(!e.target.value){
      this.setState({
        dataSource:{
          ...this.state.dataSource,
          exit_quantity: Number(e.target.value).toFixed(4),
          Survival:0,
          netvalueBTC:0,
          exitedcapitalBTC:0,
          value:0,
          exitedearningsBTC:0,
          carry:0,
          carrylead:0,
          carrydesc: 0,
          carrypartners: 0,
          contributiontoearnings:0
        }
      });
      return
    }
    const amountleft = this.state.amountleft || 0;
    const exchangerate = this.state.dataSource.exchangerate || 0;
    let Survival = amountleft - Number(e.target.value);
    const exchangerate2 = this.state.dataSource.exchangerate2 || 0; // ιεΊζ±η
    let exitedcapitalBTC = (Number(exchangerate2) * Number(e.target.value)); // ιεΊιι’
    if (exitedcapitalBTC.toString().split(".")[1] && exitedcapitalBTC.toString().split(".")[1].length && exitedcapitalBTC.toString().split(".")[1].length >= 4){
      exitedcapitalBTC = exitedcapitalBTC.toFixed(4)
    }
    const netvalueBTC = exchangerate * Survival; //εδ»·εΌ
    const value = Number(exitedcapitalBTC) + Number(netvalueBTC); //δ»·εΌ
    const original = this.state.dataSource.original || 0; //εε§ζθ΅ι’
    const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0; //εε§ζθ΅ιι’
    const exitedearningsBTC = exitedcapitalBTC - Number(capitalinvestednative); //ιεΊθ·ε©
    const carryrate = this.state.dataSource.carryrate || 0; //θΆι’ζ―η
    const carryleadrate = this.state.dataSource.carryleadrate || 0; //carry leadζ―η
    const carrydescrate = this.state.dataSource.carrydescrate || 0; //carry descζ―η
    const carry = exitedearningsBTC * carryrate; //θΆι’ιι’
    const carrylead = exitedearningsBTC * carryleadrate; //carry leadιι’
    const carrydesc = exitedearningsBTC * carrydescrate; ///carry descιι’
    const carrypartners = carry - carrylead - carrydesc; //εδ½
    const contributiontoearnings = value - Number(original); //ζΆηθ΄‘η?

    this.setState({
      dataSource:{
        ...this.state.dataSource,
        exit_quantity: Number(e.target.value).toFixed(4),
        Survival:Survival.toFixed(4),
        netvalueBTC:netvalueBTC.toFixed(4),
        exitedcapitalBTC,
        value:value.toFixed(4),
        exitedearningsBTC,
        carry,
        carrylead,
        carrydesc,
        carrypartners,
        contributiontoearnings:contributiontoearnings.toFixed(4)
      },
      exitedcapitalBTC
    });
  }
  onExitBlur = ()=>{
    const amountleft = this.state.amountleft || 0
    const exit_quantity = this.state.dataSource.exit_quantity

    if (Number(exit_quantity) > Number(amountleft)){
      message.error("ιεΊζ°ιδΈε―ε°δΊεε§ζ°ι",1.5,()=>{
        this.setState({
          dataSource:{
            ...this.state.dataSource,
            exit_quantity: 0,
            Survival:0,
            netvalueBTC:0,
            exitedcapitalBTC:0,
            value:0,
            exitedearningsBTC:0,
            carry:0,
            carrylead:0,
            carrydesc: 0,
            carrypartners: 0,
            contributiontoearnings:0,
            capitalinvestednative:0
          }
        });
      })
    }
  }

  //ιεΊιι’
  onBlurEx = (e)=>{
    if(!e.target.value){
      this.setState({
        dataSource: {
          ...this.state.dataSource,
          exitedcapitalBTC: 0,
          value: 0,
          exitedearningsBTC: 0,
          carry: 0,
          carrylead: 0,
          carrydesc: 0,
          carrypartners: 0
        }
      });
      return
    }
    const mes = Number(e.target.value);
    const netvalueBTC = this.state.dataSource.netvalueBTC || 0; //εδ»·εΌ
    const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0; //εε§ζθ΅ιι’
    const carryrate = this.state.dataSource.carryrate || 0; //θΆι’ζ―η
    const carryleadrate = this.state.dataSource.carryleadrate || 0; //carry leadζ―η
    const carrydescrate = this.state.dataSource.carrydescrate || 0; //carry descζ―η
    const carry = mes * carryrate; //θΆι’ιι’
    const carrylead = mes * carryleadrate; //carry leadιι’
    const carrydesc = mes * carrydescrate; ///carry descιι’
    const exitedearningsBTC = mes - Number(capitalinvestednative); //ιεΊθ·ε©
    const exitedcapitalBTC = this.state.exitedcapitalBTC || 0
    const value = Number(exitedcapitalBTC) + Number(netvalueBTC); //δ»·εΌ
    const original = this.state.dataSource.original || 0; //εε§ζθ΅ι’
    const contributiontoearnings = value - Number(original); //ζΆηθ΄‘η?

    if(exitedearningsBTC>0){
      this.setState({
        dataSource:{
          ...this.state.dataSource,
          exitedcapitalBTC: Number(mes),
          value: (Number(netvalueBTC) + Number(mes)),
          exitedearningsBTC:  (Number(mes) - Number(capitalinvestednative)).toFixed(4),
          carry:carry.toFixed(4),
          carrylead:carrylead.toFixed(4),
          carrydesc:carrydesc.toFixed(4),
          carrypartners: (carry - carrylead - carrydesc),
          contributiontoearnings:contributiontoearnings.toFixed(4)
        }
      });
      return
    }else{
      this.setState({
        dataSource:{
          ...this.state.dataSource,
          exitedcapitalBTC: Number(mes),
          value: (Number(netvalueBTC) + Number(mes)).toFixed(4),
          exitedearningsBTC: 0,
          carry:0,
          carrylead:0,
          carrydesc:0,
          carrypartners: 0,
          contributiontoearnings:0
        }
      });
    }


  };
  bull = (e)=>{
    const exitedcapitalBTC = Number(this.state.exitedcapitalBTC);
    const BTC1 = exitedcapitalBTC + exitedcapitalBTC * 0.05;
    const BTC2 = exitedcapitalBTC - exitedcapitalBTC * 0.05;
    const netvalueBTC = this.state.dataSource.netvalueBTC || 0; //εδ»·εΌ
    const capitalinvestednative = this.state.dataSource.capitalinvestednative || 0; //εε§ζθ΅ιι’
    const carryrate = this.state.dataSource.carryrate || 0; //θΆι’ζ―η
    const carryleadrate = this.state.dataSource.carryleadrate || 0; //carry leadζ―η
    const carrydescrate = this.state.dataSource.carrydescrate || 0; //carry descζ―η
    if(Number(e.target.value)>BTC1 || Number(e.target.value)<BTC2)
      message.error("ιεΊιι’θΎε₯δΈθ½θΆεΊζ­£θ΄5%",1.5,()=>{
        const carry0 = exitedcapitalBTC * carryrate;
        const carrylead0 = exitedcapitalBTC * carryleadrate;
        const carrydesc0 = exitedcapitalBTC * carrydescrate;
        this.setState({
          dataSource: {
            ...this.state.dataSource,
            exitedcapitalBTC,
            value: Number(exitedcapitalBTC) + Number(netvalueBTC),
            exitedearningsBTC: Number(exitedcapitalBTC) - Number(capitalinvestednative),
            carry:carry0,
            carrylead:carrylead0,
            carrydesc: carrydesc0,
            carrypartners: carry0 - carrylead0 - carrydesc0
          }
        });
      });
  }

  // εε§ζθ΅ιι’
  onSubscriptionamount = e =>{
    const exitedcapitalBTC =  this.state.dataSource.exitedcapitalBTC || 0; //ιεΊιι’
    const capitalinvestednative = (Number(e.target.value)).toFixed(4);
    const exchangerate = this.state.dataSource.exchangerate || 0;
    const carryrate = this.state.dataSource.carryrate || 0;
    let exitedearningsBTC = this.state.dataSource.exitedearningsBTC || 0; //ιεΊθ·ε©
    const carryleadrate = this.state.dataSource.carryleadrate || 0; //carry leadζ―η
    const carrydescrate = this.state.dataSource.carrydescrate || 0; //carry descζ―η
    const value = this.state.dataSource.value || 0; // δ»·εΌ
    const original = this.state.dataSource.original || 0; // εε§ζθ΅ι’
    const exitedearningsBTC2 = exitedcapitalBTC - Number(e.target.value);
    if(exitedearningsBTC2>0){
      exitedearningsBTC = exitedearningsBTC2;
    }else{
      message.error("ιεΊθ·ε©δΈθ½δΈΊθ΄ζ°",1.5,()=>{
        this.setState({
          dataSource:{
            ...this.state.dataSource,
            capitalinvestednative,
            exitedearningsBTC:0,
            original:0,
            carry:0,
            carrylead:0,
            carrydesc:0,
            contributiontoearnings:0
          }
        })
      });
      return
    }
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        capitalinvestednative,
        exitedearningsBTC,
        original: (capitalinvestednative * exchangerate).toFixed(4),
        carry:(carryrate * exitedearningsBTC).toFixed(4),
        carrylead:(exitedearningsBTC * carryleadrate).toFixed(4),
        carrydesc:(exitedearningsBTC * carrydescrate).toFixed(4),
        contributiontoearnings:(Number(value) - Number(original)).toFixed(4)
      }
    })
  };


  // θΆι’ζ―η
  onCarryrate = (e)=>{
    const exitedearningsBTC = this.state.dataSource.exitedearningsBTC || 0; //ιεΊθ·ε©
    const carrylead = this.state.dataSource.carrylead || 0; //carry leadιι’
    const carrydesc = this.state.dataSource.carrydesc || 0; //carry descιι’
    const carry = (exitedearningsBTC * Number(e.target.value)); //θΆι’ιι’
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        carryrate: Number(e.target.value),
        carry:carry.toFixed(4),
        carrypartners: (Number(carry) - Number(carrylead)-Number(carrydesc)).toFixed(4)
      }
    });
  }

  //carry leadζ―η
  onCarryLeadRate = (e)=>{
    const exitedearningsBTC = this.state.dataSource.exitedearningsBTC || 0; //ιεΊθ·ε©
    const carry = this.state.dataSource.carry || 0; //θΆι’ιι’
    const carrylead = (exitedearningsBTC * Number(e.target.value)); //carry leadιι’
    const carrydesc = this.state.dataSource.carrydesc || 0; //carry descιι’
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        carryleadrate: Number(e.target.value),
        carrylead:carrylead.toFixed(4),
        carrypartners: (Number(carry)-Number(carrylead)-Number(carrydesc)).toFixed(4)
      }
    });
  }

  //carry descζ―η
  onCarryDescrate = (e)=>{
    const exitedearningsBTC = this.state.dataSource.exitedearningsBTC || 0; //ιεΊθ·ε©
    const carry = this.state.dataSource.carry || 0; //θΆι’ιι’
    const carrylead = this.state.dataSource.carrylead || 0; //carry leadιι’
    const carrydesc = (exitedearningsBTC * Number(e.target.value)); //carry descιι’
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        carrydescrate: Number(e.target.value),
        carrydesc:carrydesc.toFixed(4),
        carrypartners: (Number(carry)-Number(carrylead)-Number(carrydesc)).toFixed(4)
      }
    });
  };

  //εδΌδΊΊ
  onPartner = e =>{
    this.setState({
      dataSource:{
        ...this.state.dataSource,
        partner:e.target.value
      }
    });
  }

  onChangeData =(date, dateString)=>{
    this.setState({exitdate:date.format('YYYY-MM-DD')})
  }

  render() {
    const {
      loading,
      form,
      data,
      projectDetail,  // ι‘Ήη?θ―¦ζ
      projectDistributionList, // ι‘Ήη?εεεε
      projectFinanceList, // ι‘Ήη?θ΄’ε‘ζΈε
      projectHistoryList, // ι‘Ήη?εε²εθ‘¨
      projectLicenseList, // ι‘Ήη?θ?Έε―θ―ζΈε
      projectShareholderList, // ι‘Ήη?θ‘δΈεε
      projectTeamList, // ι‘Ήη?ε’ιεε
      info:{ dataLists }
    } = this.props;
    const getFieldDecorator = form.getFieldDecorator;
    const { addFormVisible,dataSource,amount,dataValue } = this.state;
    const dataList = [
      'USD','usdt','BTC','NEO','GAS','ETH'
    ];

    return (
      <Card title={formatMessage({ id: 'validation.exitstatus' })} bordered={false}>
        <div>
          {
            amount >=1?<Button icon="plus" type="primary" onClick={this.handleFormVisible}>{formatMessage({ id: 'validation.new' })}</Button>:''
          }
        </div>
        <NormalTable
          loading={loading}
          data={dataLists}
          columns={this.columns}
          style={{marginTop:12}}
          footer={(currentPageData)=>{
            if(!currentPageData || !currentPageData.length) return
            let count = 0;
            for(let i=0;i<currentPageData.length;i++){
              if(currentPageData[i].exitedearningsbtc){
                count = accAdd(currentPageData[i].exitedearningsbtc,count)
              }
            }

            return (<div style={{display:'flex'}}>
              <div style={{fontWeigh:'bold',fontSize:'16px',width:'35%'}}>{formatMessage({ id: 'validation.total' })}:</div>
              <div style={{textAlign:'center',width:'65%'}}>{count}</div>
            </div>)
          }}
        />

        <Modal
          destroyOnClose
          title={formatMessage({ id: 'validation.Newexitstatus' })}
          visible={addFormVisible}
          onOk={()=>this.okHandle(this.handleFormVisible)}
          onCancel={() => this.handleFormVisible()}
          width='80%'
        >
          <Form
            layout="vertical"

          >
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.fundname' })}>
                  {getFieldDecorator('fund_name', {
                    initialValue: dataSource.fund_name?dataSource.fund_name:'',
                  })(<Input disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.post-settime' })}>
                  {getFieldDecorator('exitdate', {
                    initialValue:this.state.createdate?moment(this.state.createdate) : null,
                    rules: [{ required: true }],
                  })(<DatePicker style={{ width: '100%' }} onChange={(date, dateString)=>this.onChangeData(date, dateString)}   placeholder="ιεΊζΆι΄"/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='TAG'>
                  {getFieldDecorator('tag', {
                    initialValue: dataSource.tag ? dataSource.tag:''
                  })(<Input disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='ticker'>
                  {getFieldDecorator('ticker', {
                    initialValue: dataSource.ticker ? dataSource.ticker:''
                  })(<Input placeholder={formatMessage({ id: 'validation.Inputfirst' })} onBlur={e=>this.onTicker(e)}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalcurrency' })}>
                  {getFieldDecorator('original_currency', {
                    initialValue:dataSource.original_currency?dataSource.original_currency:'',
                    rules: [{ required: true }],
                  })(
                    <AutoComplete
                      dataSource={dataList}
                      style={{ width: 200 }}
                      disabled={!dataSource.ticker}
                      onBlur={(value, option) => this.onShuru(value, option)}
                      placeholder={formatMessage({ id: 'validation.Inputcurrency' })}
                      filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalinstitution' })}>
                  {getFieldDecorator('original_institution',{
                    initialValue:dataSource.original_institution?dataSource.original_institution:'',
                    rules: [{ required: true }],
                  })(
                    <Select placeholder={formatMessage({ id: 'validation.Originalinstitution' })} onSelect={(value)=>this.onOriginal(value)} disabled={!dataSource.ticker}>
                      <Option value="coinmarketcap">Coinmarketcap</Option>
                      <Option value="huobi">Huobi</Option>
                      <Option value="binance">Binance</Option>
                      <Option value="okex">OKEX</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalexchangerate' })}>
                  {getFieldDecorator('exchangerate', {
                    initialValue:dataSource.exchangerate?dataSource.exchangerate:''
                  })(<Input placeholder={formatMessage({ id: 'validation.Calculated' })} disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitcurrency' })}>
                  {getFieldDecorator('exitcurrency',{
                    initialValue:dataSource.exitcurrency?dataSource.exitcurrency:'',
                    rules: [{ required: true }],
                  })(
                    <AutoComplete
                      dataSource={dataList}
                      style={{ width: 200 }}
                      onBlur={(value, option) => this.onTuichu(value, option)}
                      placeholder={formatMessage({ id: 'validation.Inputcurrency' })}
                      disabled={!dataSource.ticker}
                      filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitagency' })}>
                  {getFieldDecorator('out_mechanism',{
                    initialValue:dataSource.out_mechanism?dataSource.out_mechanism:'',
                    rules: [{ required: true }],
                  })(
                    <Select placeholder={formatMessage({ id: 'validation.Exitagency' })} onSelect={(value)=>this.onMechanism(value)} disabled={!dataSource.ticker}>
                      <Option value="coinmarketcap">Coinmarketcap</Option>
                      <Option value="huobi">Huobi</Option>
                      <Option value="binance">Binance</Option>
                      <Option value="okex">OKEX</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitrate' })}>
                  {getFieldDecorator('exchangerate2', {
                    initialValue: dataSource.exchangerate2?dataSource.exchangerate2:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Calculated' })} disabled />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Theremainingamount' })}>
                  {getFieldDecorator('amountleft',{
                    initialValue: dataSource.amountleft?dataSource.amountleft:'',
                    rules: [{ required: true }],
                  })(
                    <Input placeholder={formatMessage({ id: 'validation.Theremainingamount' })} type='number' disabled={true} onChange={(e)=> this.onOriginalQuantity(e)}/>
                  )}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Numberofexits' })}>
                  {getFieldDecorator('exit_quantity',{
                    initialValue: dataSource.exit_quantity ? dataSource.exit_quantity: '',
                    rules: [{ required: true }],
                  })(
                    <Input placeholder={formatMessage({ id: 'validation.Numberofexits' })} type='number' onChange={(e)=> this.onExitQuantity(e)} disabled={!dataSource.exchangerate2} onBlur={this.onExitBlur}/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.projectcurrencyrealtimestock' })}>
                  {getFieldDecorator('Survival', {
                    initialValue: dataSource.Survival ? dataSource.Survival:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Remainingquantitynumberofexits' })} disabled /*onFocus={e=>this.onAmountLeft(e)}*/ type='number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalquantity' })}>
                  {getFieldDecorator('amountinvested',{
                    initialValue: dataSource.amountinvested?dataSource.amountinvested:'',
                    rules: [{ required: true }],
                  })(
                    <Input placeholder={formatMessage({ id: 'validation.Originalquantity' })} type='number' disabled={true} onChange={(e)=> this.onOriginalQuantity(e)}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitamount' })}>
                  <Input placeholder={formatMessage({ id: 'validation.NumberofexitsExitrate' })} value={dataSource.exitedcapitalBTC?dataSource.exitedcapitalBTC:''} disabled={!this.state.dataSource.exitedcapitalBTC}  onChange={(e)=>this.onBlurEx(e)} onBlur={(e)=>this.bull(e)} type='number'/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Netvalue' })}>
                  {getFieldDecorator('netvalueBTC', {
                    initialValue: dataSource.netvalueBTC?dataSource.netvalueBTC:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Projectcurrencyrealtimestockoriginalexchangeratenetvalue' })} disabled /*onFocus={()=>this.onNetvalueBTC()}*/ type='number'/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.value' })}>
                  {getFieldDecorator('value', {
                    initialValue: dataSource.value?dataSource.value:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Exitamountnetvalue' })} disabled /*onFocus={()=>this.onValue()}*/ type='number'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalinvestmentamount' })}>
                  {getFieldDecorator('capitalinvestednative', {
                    initialValue:dataSource.capitalinvestednative?dataSource.capitalinvestednative:'',
                    rules: [{ required: true }],
                  })(<Input placeholder={formatMessage({ id: 'validation.Originalinvestmentamount' })} onChange={e=>this.onSubscriptionamount(e)} type='number' disabled={true}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Withdrawprofit' })}>
                  {getFieldDecorator('exitedearningsBTC',{
                    initialValue: dataSource.exitedearningsBTC?dataSource.exitedearningsBTC:''
                  })(
                    <Input placeholder={formatMessage({ id: 'validation.ExitAmountOriginalInvestmentAmount' })} disabled type='number'/>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalinvestmentquota' })}>
                  {getFieldDecorator('original',{
                    initialValue: dataSource.original?dataSource.original:''
                  })(
                    <Input placeholder={formatMessage({ id: 'validation.Originalinvestmentamountoriginalexchangerate' })} type='number' disabled/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Excessratio' })}>
                  {getFieldDecorator('carryrate', {
                    initialValue: dataSource.carryrate?dataSource.carryrate:'',
                    rules: [{ required: true }],
                  })(<Input placeholder={formatMessage({ id: 'validation.Excessratio' })} type='number' onChange={(e)=>this.onCarryrate(e)}/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Excessamount' })}>
                  {getFieldDecorator('carry', {
                    initialValue: dataSource.carry?dataSource.carry:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.ExcessrateExitprofit' })} type='number' disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carryleadratio' })}>
                  {getFieldDecorator('carryleadrate', {
                    rules: [{ required: true }],
                    initialValue: dataSource.carryleadrate?dataSource.carryleadrate:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Carryleadratio' })}  type='number' onChange={(e)=>this.onCarryLeadRate(e)}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carryleadamount' })}>
                  {getFieldDecorator('carrylead', {
                    initialValue: dataSource.carrylead ? dataSource.carrylead: '',
                  })(<Input placeholder={formatMessage({ id: 'validation.Carryleadratiowithdrawprofit' })} type='number' disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carrydescratio' })}>
                  {getFieldDecorator('carrydescrate', {
                    rules: [{ required: true }],
                    initialValue: dataSource.carrydescrate?dataSource.carrydescrate:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Carrydescratio' })} type='number' onChange={(e)=>this.onCarryDescrate(e)}/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carrydescamount' })}>
                  {getFieldDecorator('carrydesc', {
                    initialValue: dataSource.carrydesc?dataSource.carrydesc:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Carrydescratiowithdrawprofit' })} type='number' disabled/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Cooperationexcessamount' })}>
                  {getFieldDecorator('carrypartners', {
                    initialValue: dataSource.carrypartners?dataSource.carrypartners:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Excessamountcarryleadamountcarrydescamount' })} type='number' disabled/>)}
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Incomecontribution' })}>
                  {getFieldDecorator('contributiontoearnings', {
                    initialValue: dataSource.contributiontoearnings?dataSource.contributiontoearnings:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Valueoriginalinvestmentamount' })} disabled/>)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Primarypartner' })}>
                  {getFieldDecorator('partner', {
                    initialValue: dataSource.partner?dataSource.partner:'',
                  })(<Input placeholder={formatMessage({ id: 'validation.Primarypartner' })}  onChange={e=>this.onPartner(e)}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label={formatMessage({ id: 'form.title.memo' })} >
                  {getFieldDecorator('memo', {
                    initialValue: dataSource.memo?dataSource.memo:'',
                  })(<TextArea placeholder={formatMessage({ id: 'form.title.memo' })}/>)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>


        <Modal
          destroyOnClose
          title="ζ°ε’ιεΊζε΅"
          visible={this.state.show}
          onCancel={() => this.onCloseShow()}
          width='80%'
        >
          <Form
            layout="vertical"

          >
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.fundname' })}>
                  <Input disabled value={dataValue.fund_name}/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.post-settime' })}>
                  <DatePicker style={{ width: '100%' }} value={moment(dataValue.exitdate)} disabled/>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label='TAG'>
                  <Input value={dataValue.tag} disabled/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label='ticker'>
                  <Input disabled value={dataValue.ticker}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalcurrency' })}>
                    <Input disabled/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalinstitution' })}>
                    <Select placeholder="εε§ζΊζ" disabled>
                      <Option value="coinmarketcap">Coinmarketcap</Option>
                      <Option value="huobi">Huobi</Option>
                      <Option value="binance">Binance</Option>
                      <Option value="okex">OKEX</Option>
                    </Select>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalexchangerate' })}>
                  <Input value={dataValue.exchangerate} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitcurrency' })}>
                  <Input disabled value={dataValue.exitcurrency}/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitagency' })}>
                    <Select placeholder={formatMessage({ id: 'validation.Exitagency' })} disabled>
                      <Option value="coinmarketcap">Coinmarketcap</Option>
                      <Option value="huobi">Huobi</Option>
                      <Option value="binance">Binance</Option>
                      <Option value="okex">OKEX</Option>
                    </Select>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitrate' })}>
                 <Input value={dataValue.exchangerate2} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Theremainingamount' })}>
                    <Input  disabled value={dataValue.amountleft}/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Numberofexits' })}>
                    <Input disabled value={dataValue.exit_quantity}/>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.projectcurrencyrealtimestock' })}>
                 <Input disabled value={dataValue.Survival}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalquantity' })}>
                    <Input disabled value={dataValue.amountinvested}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Exitamount' })}>
                  <Input value={dataValue.exitedcapitalBTC?dataValue.exitedcapitalBTC:''} disabled />
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Netvalue' })}>
                  <Input  disabled value={dataValue.netvalueBTC}/>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.value' })}>
                 <Input  disabled value={dataValue.value}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={18}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalinvestmentamount' })}>
                  <Input   disabled value={dataValue.capitalinvestednative}/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Withdrawprofit' })}>
                    <Input  disabled value={dataValue.exitedearningsBTC}/>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Originalinvestmentquota' })}>
                  <Input  disabled value={dataValue.original}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Excessratio' })}>
                  <Input value={dataValue.carryrate} disabled/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Excessamount' })}>
                 <Input disabled value={dataValue.carry}/>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carryleadratio' })}>
                  <Input value={dataValue.carryleadrate} disabled/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carryleadamount' })}>
                  <Input disabled value={dataValue.carrylead}/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carrydescratio' })}>
                  <Input disabled value={dataValue.carrydescrate}/>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Carrydescamount' })}>
                  <Input  disabled value={dataValue.carrydesc}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Cooperationexcessamount' })}>
                  <Input  disabled value={dataValue.carrypartners}/>
                </Form.Item>
              </Col>
              <Col lg={{ span: 6, offset: 2 }} md={{ span: 10, offset: 1 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Incomecontribution' })}>
                 <Input disabled value={dataValue.contributiontoearnings}/>
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 3 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={formatMessage({ id: 'validation.Primarypartner' })}>
                  <Input disabled value={dataValue.partner}/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={{ span: 6, offset: 1 }} md={{ span: 10, offset: 1 }} sm={24}>

              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label={formatMessage({ id: 'form.title.memo' })}>
                  <TextArea  value={dataValue.memo}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <FooterToolbar style={{ width: '100%' }}>
          <Button
            onClick={this.backClick}
          >{formatMessage({ id: 'validation.return' })}
          </Button>
        </FooterToolbar>
      </Card>
    );
  }
}

export default DetailQuitInfo;
