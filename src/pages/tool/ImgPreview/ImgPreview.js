import './style.less'
import React from 'react'
import config from '@/config'
import {message} from 'antd'

export default class ImgPreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      screenHeight: 0,
      screenWidth: 0,
      ratio: 1,
      angle: 0,
      defaultWidth: 'auto',
      defaultHeight: 'auto',
      imgSrc: '',
      posTop: 0,
      posLeft: 0,
      isAlwaysCenterZoom: false, // 是否总是中心缩放
      isAlwaysShowRatioTips: false, // 是否总是显示缩放倍数信息,默认点击按钮缩放时才显示
      flags: false,
      isDraged: false,
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: ''
    }
    this.percent = 100
  }

  componentDidMount() {
    this.setState({
      screenWidth: window.screen.availWidth,
      screenHeight: window.screen.availHeight,
      ratio: 1,
      angle: 0
    }, () => {
      this.getImgSize()
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      imgSrc: nextProps.src,
      isAlwaysCenterZoom: nextProps.isAlwaysCenterZoom,
      isAlwaysShowRatioTips: nextProps.isAlwaysShowRatioTips
    }, () => {
      this.getImgSize()
    })
  }

  // 获取预览图片的默认宽高和位置
  getImgSize = () => {
    let { ratio, isDraged, isAlwaysCenterZoom } = this.state
    let posTop = 0
    let posLeft = 0
    // 图片原始宽高
    let originWidth = this.originImgEl.width
    let originHeight = this.originImgEl.height
    // 默认最大宽高
    let maxDefaultWidth = 540
    let maxDefaultHeight = 320
    // 默认展示宽高
    let defaultWidth = 0
    let defaultHeight = 0
    if (originWidth > maxDefaultWidth || originHeight > maxDefaultHeight) {
      if (originWidth / originHeight > maxDefaultWidth / maxDefaultHeight) {
        defaultWidth = maxDefaultWidth
        defaultHeight = Math.round(originHeight * (maxDefaultHeight / maxDefaultWidth))
        posTop = (defaultHeight * ratio / 2) * -1
        posLeft = (defaultWidth * ratio / 2) * -1
      } else {
        defaultWidth = Math.round(maxDefaultHeight * (originWidth / originHeight))
        defaultHeight = maxDefaultHeight
        posTop = (defaultHeight * ratio / 2) * -1
        posLeft = (defaultWidth * ratio / 2) * -1
      }
    } else {
      defaultWidth = originWidth
      defaultHeight = originHeight
      posTop = (defaultWidth * ratio / 2) * -1
      posLeft = (defaultHeight * ratio / 2) * -1
    }

    if (isAlwaysCenterZoom) {
      this.setState({
        posTop: posTop,
        posLeft: posLeft,
        defaultWidth: defaultWidth * ratio,
        defaultHeight: defaultHeight * ratio
      })
    } else {
      // 若拖拽改变过位置,则在缩放操作时不改变当前位置
      if (isDraged) {
        this.setState({
          defaultWidth: defaultWidth * ratio,
          defaultHeight: defaultHeight * ratio
        })
      } else {
        this.setState({
          posTop: posTop,
          posLeft: posLeft,
          defaultWidth: defaultWidth * ratio,
          defaultHeight: defaultHeight * ratio
        })
      }
    }
  }

  // 下载
  download = () => {
    window.open(config.apiHost + '/downloadFromOss?key=' + this.props.picKey)
  }

  // 放大
  scaleBig = (type = 'click') => {
    let { ratio, isAlwaysShowRatioTips } = this.state
    ratio += 0.15
    this.percent += 15
    this.setState({
      ratio: ratio
    }, () => {
      this.getImgSize()
    })
    if (isAlwaysShowRatioTips) {
      message.info(`缩放比例:${this.percent}%`, 0.2)
    } else {
      if (type === 'click') {
        message.info(`缩放比例:${this.percent}%`, 0.2)
      }
    }
  }

  // 缩小
  scaleSmall = (type = 'click') => {
    let { ratio, isAlwaysShowRatioTips } = this.state
    ratio -= 0.15
    if (ratio <= 0.1) {
      ratio = 0.1
    }
    if (this.percent - 15 > 0) {
      this.percent -= 15
    }
    this.setState({
      ratio: ratio
    }, () => {
      this.getImgSize()
    })
    if (isAlwaysShowRatioTips) {
      message.info(`缩放比例:${this.percent}%`, 0.2)
    } else {
      if (type === 'click') {
        message.info(`缩放比例:${this.percent}%`, 0.2)
      }
    }
  }

  // 滚轮缩放
  wheelScale = (e) => {
    e.preventDefault()
    if (e.deltaY > 0) {
      this.scaleBig('wheel')
    } else {
      this.scaleSmall('wheel')
    }
  }

  // 旋转
  retate = () => {
    let { angle } = this.state
    angle += 90
    this.setState({
      angle: angle
    })
  }

  // 按下获取当前数据
  mouseDown = (event) => {
    let touch
    if (event.touches) {
      touch = event.touches[0]
    } else {
      touch = event
    }
    let position = {
      x: touch.clientX,
      y: touch.clientY
    }
    this.setState({
      flags: true,
      position: position,
      dx: this.imgEl.offsetLeft,
      dy: this.imgEl.offsetTop
    })
  }

  mouseMove = (event) => {
    let { dx, dy, position, flags } = this.state
    if (flags) {
      event.preventDefault()
      let touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.setState({
        isDraged: true,
        nx: touch.clientX - position.x,
        ny: touch.clientY - position.y,
        xPum: dx + touch.clientX - position.x,
        yPum: dy + touch.clientY - position.y
      }, () => {
        this.imgEl.style.left = this.state.xPum + 'px'
        this.imgEl.style.top = this.state.yPum + 'px'
      })
    }
  }

  mouseUp = () => {
    this.setState({
      flags: false
    })
  }

  mouseOut = () => {
    this.setState({
      flags: false
    })
  }

  // 关闭预览
  closePreview = () => {
    let { onClose } = this.props
    this.setState({
      ratio: 1,
      angle: 0,
      defaultWidth: 'auto',
      defaultHeight: 'auto',
      imgSrc: '',
      posTop: 0,
      posLeft: 0,
      flags: false,
      isDraged: false,
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: ''
    }, () => {
      this.getImgSize()
      this.percent = 100
      onClose()
    })
  }

  render() {
    let { screenWidth, screenHeight, posLeft, posTop, angle, imgSrc } = this.state
    let { visible } = this.props
    return (
      <div className={'preview-wrapper' + (visible ? ' show' : ' hide')}
           style={{ width: screenWidth, height: screenHeight }}>
        <i onClick={() => {
          this.closePreview()
        }} className='iconfont icon-icon-test31'></i>
        <div className='img-container'>
          <img className='image'
               width={this.state.defaultWidth}
               height={this.state.defaultHeight}
               onWheel={this.wheelScale}
               style={{ transform: `rotate(${angle}deg)`, top: posTop, left: posLeft }}
               onMouseDown={this.mouseDown}
               onMouseMove={this.mouseMove}
               onMouseUp={this.mouseUp}
               onMouseOut={this.mouseOut}
               draggable='false'
               src={imgSrc} ref={(img) => {
            this.imgEl = img
          }} alt="预览图片"/>
        </div>
        <img className='origin-image' src={imgSrc} ref={(originImg) => {
          this.originImgEl = originImg
        }} alt="预览图片"/>
        <div className='operate-con'>
          <div onClick={this.download} className='operate-btn'>
            <i className='iconfont icon-icon-test10'></i>
            <span>下载</span>
          </div>
          <div onClick={() => {
            this.scaleBig('click')
          }} className='operate-btn'>
            <i className='iconfont icon-icon-test33'></i>
            <span>放大</span>
          </div>
          <div onClick={() => {
            this.scaleSmall('click')
          }} className='operate-btn'>
            <i className='iconfont icon-icon-test35'></i>
            <span>缩小</span>
          </div>
          <div onClick={this.retate} className='operate-btn'>
            <i className='iconfont icon-icon-test34'></i>
            <span>旋转</span>
          </div>
        </div>
      </div>
    )
  }
}
