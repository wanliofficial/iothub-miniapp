import { connect } from '../../libs/mqtt.min';
import { guid } from '../../utils/util';
import uCharts from '../../libs/u-charts.min';

const app = getApp();

let client = null;
const uuid = guid();

let canvaGauge5 = null, canvaGauge10 = null, canvaGauge15 = null, canvaLineA = null;

Page({
    data: {
        onlineCount: 1,
        currentIndex: 0,
        device: null,
        name: null,
        token: null,
        list: [],
        text: '数据拉取中',
        cWidth: 0,
        cHeight: 0,
        chartData: {
            categories: [{ value: 0.2, color: '#2fc25b' }, { value: 0.8, color: '#f04864' }, { value: 1, color: '#1890ff' }],
            series: [{ name: '5分钟负载', data: 0.85 }, { name: '10分钟负载', data: 0.64 }, { name: '15分钟负载', data: 0.53 }]
        },
        chartData2: {
            categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
            series: [{
                name: '成交量A',
                data: [35, 20, 25, 37, 4, 20],
                color: '#000000'
            }, {
                name: '成交量B',
                data: [70, 40, 65, 100, 44, 68]
            }, {
                name: '成交量C',
                data: [100, 80, 95, 150, 112, 132]
            }]
        },
        msgList: [
            { url: "url", title: "此处显示来自设备的消息" },
            { url: "url", title: "设备状况实时直播网址，长按复制下面网站粘贴到PC浏览器中观看，第三方免费平台延时可能会比较高，请耐心等待！" }
        ],
        location: app.globalData.location,
        markers: [{ id: 0, latitude: 23.099994, longitude: 113.324520 }],
        switchActive: 0,
        cSwitchActive: 0,
        dSwitchActive: 0,
        fSwitchActive: 0,
        myColors: [{ percent: 50, color: '#67C23A' }, { percent: 80, color: '#E6A23C' }, { percent: 100, color: '#F56C6C' }],
        humidity: 0,
        temperature: 0,
        illuminance: 0,
        soundText: '',
        lcdTextValue: '',
        colorData: {
            //基础色相，即左侧色盘右上顶点的颜色，由右侧的色相条控制
            hueData: {
                colorStopRed: 255,
                colorStopGreen: 0,
                colorStopBlue: 0,
            },
            //选择点的信息（左侧色盘上的小圆点，即你选择的颜色）
            pickerData: {
                x: 0, //选择点x轴偏移量
                y: 480, //选择点y轴偏移量
                red: 0, 
                green: 0,
                blue: 0, 
                hex: '#000000'
            },
            //色相控制条的位置
            barY: 0
        },
        rpxRatio: 1
    },
    onLoad () {
        if (!app.globalData.userInfo) {
            app.globalData.redirect = '/pages/device/device'
            wx.navigateTo({
                url: '/pages/login/login',
                success (res) {
                    console.log(res)
                }
            })
        }

        if (!app.globalData.device) return wx.navigateTo({ url: '/pages/device-list/index' })
        this.fetchToken()
    },
    onReady () {},
    onShow () {},
    onHide () {},
    onUnload () {
        if (client) client.end()
    },
    onPullDownRefresh () {},
    onReachBottom () {},
    onShareAppMessage () {},
    fetchToken () {
        const _this = this
        wx.showLoading({ title: 'Loading...' })
        wx.request({
            url: 'https://wanliwuhan.com/api/token',
            method: 'POST',
            header: { 'content-type': 'application/json' },
            success (res) {
                if (res.data.code == 200) {
                    _this.setData({
                        name: res.data.data.name,
                        token: res.data.data.token,
                        device: app.globalData.device,
                        cWidth: wx.getSystemInfoSync().windowWidth,
                        cHeight: 500 / 750 * wx.getSystemInfoSync().windowWidth,
                        list: ['总览'].concat(app.globalData.device.modules.map(item => item.name)),
                        markers: [{ id: 0, latitude: Number(app.globalData.device.location.point.y), longitude: Number(app.globalData.device.location.point.x) }]
                    })
                    _this.renderCharts()
                    _this.initConnect()
                }
            },
            fail (err) {
                console.log(err)
            },
            complete () {
                wx.hideLoading()
            }
        })
    },
    initConnect () {
        const _this = this;
        client = connect('wxs://wanliwuhan.com/mqtt', {
            clientId: uuid,
            connectTimeout: 4000,
            username: this.data.name,
            password: this.data.token
        });

        client.on('connect', () => {
            client.subscribe(`cmd_res/${app.globalData.device.product_name}/${app.globalData.device.device_name}/+/+/+`, err => {
                if (err) console.log(err)
            });
            client.subscribe(`upload_data/${app.globalData.device.product_name}/${app.globalData.device.device_name}/+/+`, err => {
                if (err) console.log(err)
            });
            client.subscribe(`update_status/${app.globalData.device.product_name}/${app.globalData.device.device_name}/+`, err => {
                if (err) console.log(err)
            });
        });

        client.on('reconnect', error => {
            console.log(error)
        });
          
        client.on('message', (topic, message) => {
            _this.onMessage(topic, message.toString());
        });

        client.on('error', error => {
            console.log(error)
        });

        client.on('close', res => {
            console.log(res)
        });
    },
    onMessage (topic, message) {
        topic = topic.split("/");
        message = JSON.parse(message);

        if (topic[0] === "update_status") {
            if (message.hasOwnProperty('buzzer')) this.setData({ dSwitchActive: message.buzzer ? true: false });
            else if (message.hasOwnProperty('relay')) this.setData({ fSwitchActive: message.relay ? true: false });
            else if (message.hasOwnProperty('sound')) this.setData({ soundText: message.sound });
        }
        else if (topic[0] === "upload_data") {
            if (topic[3] === "system-edc") this.setData({ humidity: message.humidity, illuminance: message.illuminance, temperature: message.temperature });
        }
        else console.log(message)
    },
    onSwitchChange () { // LED开关
        const _this = this
        if (this.data.switchActive === 0) {
            wx.showLoading({ title: 'Loading...' })
            wx.request({
                url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                data: {
                    "command": "remote-control",
                    "data": JSON.stringify({ "type": "TURN_ON_LED", "platform": "weixin", "uuid": uuid })
                },
                success (res) {
                    console.log(res.statusCode)
                    _this.setData({ switchActive: 1 })
                },
                complete () {
                    wx.hideLoading()
                }
            })
        } else {
            wx.showLoading({ title: 'Loading...' })
            wx.request({
                url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                data: {
                    "command": "remote-control",
                    "data": JSON.stringify({ "type": "TURN_OFF_LED", "platform": "weixin", "uuid": uuid })
                },
                success (res) {
                    console.log(res.statusCode)
                    _this.setData({ switchActive: 0 })
                },
                complete () {
                    wx.hideLoading()
                }
            })
        }
    },
    onCSwitchChange () {
        if (this.data.cSwitchActive === 0) this.setData({ cSwitchActive: 1 })
        else this.setData({ cSwitchActive: 0 })
    },
    onDSwitchChange () { // 蜂鸣器开关
        const _this = this
        if (this.data.dSwitchActive === 0) {
            wx.showLoading({ title: 'Loading...' })
            wx.request({
                url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                data: {
                    "command": "remote-control",
                    "data": JSON.stringify({ "type": "TURN_ON_BUZZER", "platform": "weixin", "uuid": uuid })
                },
                success (res) {
                    console.log(res.statusCode)
                    _this.setData({ dSwitchActive: 1 })
                },
                complete () {
                    wx.hideLoading()
                }
            })
        } else {
            wx.showLoading({ title: 'Loading...' })
            wx.request({
                url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                data: {
                    "command": "remote-control",
                    "data": JSON.stringify({ "type": "TURN_OFF_BUZZER", "platform": "weixin", "uuid": uuid })
                },
                success (res) {
                    console.log(res.statusCode)
                    _this.setData({ dSwitchActive: 0 })
                },
                complete () {
                    wx.hideLoading()
                }
            })
        }
    },
    onFSwitchChange () { // 继电器开关
        const _this = this
        if (this.data.fSwitchActive === 0) {
            wx.showLoading({ title: 'Loading...' })
            wx.request({
                url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                data: {
                    "command": "remote-control",
                    "data": JSON.stringify({ "type": "TURN_ON_RELAY", "platform": "weixin", "uuid": uuid })
                },
                success (res) {
                    console.log(res.statusCode)
                    _this.setData({ fSwitchActive: 1 })
                },
                complete () {
                    wx.hideLoading()
                }
            })
        } else {
            wx.showLoading({ title: 'Loading...' })
            wx.request({
                url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
                method: 'POST',
                header: { 'content-type': 'application/json' },
                data: {
                    "command": "remote-control",
                    "data": JSON.stringify({ "type": "TURN_OFF_RELAY", "platform": "weixin", "uuid": uuid })
                },
                success (res) {
                    console.log(res.statusCode)
                    _this.setData({ fSwitchActive: 0 })
                },
                complete () {
                    wx.hideLoading()
                }
            })
        }
    },
    onColorChange(e) { //选择改色时触发（在左侧色盘触摸或者切换右侧色相条），返回的信息在e.detail.colorData中
        const _this = this;
        this.setData({ colorData: e.detail.colorData }); // LED颜色改变
        const color = e.detail.colorData.pickerData
        // console.log(color)
        wx.request({
            url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            data: {
                "command": "remote-control",
                "data": JSON.stringify({ "type": "SET_LED_COLOR", "value": [color.red, color.green, color.blue], "platform": "weixin", "uuid": uuid })
            },
            success (res) {
                console.log(res.statusCode)
                _this.setData({ dSwitchActive: 1 })
            },
            complete () {
                wx.hideLoading()
            }
        })
    },
    bindKeyInput(e) {
        this.setData({ lcdTextValue: e.detail.value });
    },
    bindPrintScreen() {
        if (/.*[\u4e00-\u9fa5]+.*$/.test(this.data.lcdTextValue)) return wx.showModal({
            title: '提示',
            content: 'LCD的屏幕暂不支持显示中文，请输入字母或者数字！',
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        });
        else if (this.data.lcdTextValue == null) return wx.showModal({
            title: '提示',
            content: '打印内容不能为空',
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        })
        else if (this.data.lcdTextValue.length > 30 || this.data.lcdTextValue.length == 0) return wx.showModal({
            title: '提示',
            content: '打印内容长度超过30个字符，多余的会被截取；也不能为空字符，否则无法显示',
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
            }
        });

        wx.showLoading({ title: 'Loading...' })
        wx.request({
            url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            data: {
                "command": "remote-control",
                "data": JSON.stringify({ "type": "SET_SCREEN_TEXT", "platform": "weixin", "uuid": uuid, "value": this.data.lcdTextValue })
            },
            success (res) {
                console.log(res.statusCode)
            },
            complete () {
                wx.hideLoading()
            }
        })
    },
    bindClearScreen() {
        const _this = this;
        wx.showLoading({ title: 'Loading...' })
        wx.request({
            url: `https://wanliwuhan.com/api/device/${app.globalData.device.product_name}/${app.globalData.device.device_name}/command`,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            data: {
                "command": "remote-control",
                "data": JSON.stringify({ "type": "SET_SCREEN_NULL", "platform": "weixin", "uuid": uuid })
            },
            success (res) {
                console.log(res.statusCode)
                _this.setData({ lcdTextValue: null })
            },
            complete () {
                wx.hideLoading()
            }
        })
    },
    renderCharts () {
        canvaGauge5 = new uCharts({
            $this: this,
            canvasId: 'canvaGauge5',
            type: 'gauge',
            fontSize: 11,
            legend: false,
            title: {
                name: (this.data.device.operation.loadavg[0] * 100).toFixed(2) + '%',
                color: this.data.chartData.categories[1].color,
                fontSize: 25,
                offsetY: 50,
            },
            subtitle: {
                name: this.data.chartData.series[0].name,
                color: '#666666',
                fontSize: 15,
                offsetY: -50,
            },
            extra: {
                gauge: {
                    type: 'default',
                    width: 15,//仪表盘背景的宽度
                    startAngle: 0.75,
                    endAngle: 0.25,
                    startNumber: 0,
                    endNumber: 100,
                    splitLine: {
                        fixRadius: 0,
                        splitNumber: 10,
                        width: 15,//仪表盘背景的宽度
                        color:'#FFFFFF',
                        childNumber: 5,
                        childWidth: 15*0.4,//仪表盘背景的宽度
                    },
                    pointer: {
                        width: 15*0.8,//指针宽度
                        color:'auto'
                    }
                }
            },
            background: '#FFFFFF',
            pixelRatio: 1,
            categories: this.data.chartData.categories,
            series: [{ name: '5分钟负载', data: Math.floor(this.data.device.operation.loadavg[0] * 100) / 100 }],
            animation: true,
            width: this.data.cWidth,
            height: this.data.cHeight,
            dataLabel: true
        });
        canvaGauge10 = new uCharts({
            $this: this,
            canvasId: 'canvaGauge10',
            type: 'gauge',
            fontSize: 11,
            legend: false,
            title: {
                name: (this.data.device.operation.loadavg[1] * 100).toFixed(2) + '%',
                color: this.data.chartData.categories[1].color,
                fontSize: 25,
                offsetY: 50,
            },
            subtitle: {
                name: this.data.chartData.series[1].name,
                color: '#666666',
                fontSize: 15,
                offsetY: -50,
            },
            extra: {
                gauge: {
                    type: 'default',
                    width: 15,//仪表盘背景的宽度
                    startAngle: 0.75,
                    endAngle: 0.25,
                    startNumber: 0,
                    endNumber: 100,
                    splitLine: {
                        fixRadius: 0,
                        splitNumber: 10,
                        width: 15,//仪表盘背景的宽度
                        color:'#FFFFFF',
                        childNumber: 5,
                        childWidth: 15*0.4,//仪表盘背景的宽度
                    },
                    pointer: {
                        width: 15*0.8,//指针宽度
                        color:'auto'
                    }
                }
            },
            background: '#FFFFFF',
            pixelRatio: 1,
            categories: this.data.chartData.categories,
            series: [{ name: '10分钟负载', data: Math.floor(this.data.device.operation.loadavg[1] * 100) / 100 }],
            animation: true,
            width: this.data.cWidth,
            height: this.data.cHeight,
            dataLabel: true
        });
        canvaGauge15 = new uCharts({
            $this: this,
            canvasId: 'canvaGauge15',
            type: 'gauge',
            fontSize: 11,
            legend: false,
            title: {
                name: (this.data.device.operation.loadavg[2] * 100).toFixed(2) + '%',
                color: this.data.chartData.categories[1].color,
                fontSize: 25,
                offsetY: 50,
            },
            subtitle: {
                name: this.data.chartData.series[2].name,
                color: '#666666',
                fontSize: 15,
                offsetY: -50,
            },
            extra: {
                gauge:{
                    type: 'default',
                    width: 15,//仪表盘背景的宽度
                    startAngle: 0.75,
                    endAngle: 0.25,
                    startNumber: 0,
                    endNumber: 100,
                    splitLine: {
                        fixRadius: 0,
                        splitNumber: 10,
                        width: 15,//仪表盘背景的宽度
                        color:'#FFFFFF',
                        childNumber:5,
                        childWidth: 15*0.4,//仪表盘背景的宽度
                    },
                    pointer: {
                        width: 15*0.8,//指针宽度
                        color:'auto'
                    }
                }
            },
            background: '#FFFFFF',
            pixelRatio: 1,
            categories: this.data.chartData.categories,
            series: [{ name: '15分钟负载', data: Math.floor(this.data.device.operation.loadavg[2] * 100) / 100 }],
            animation: true,
            width: this.data.cWidth,
            height: this.data.cHeight,
            dataLabel: true
        });
        canvaLineA = new uCharts({
            $this: this,
            canvasId: 'canvasLineA',
            type: 'line',
            fontSize: 11,
            legend: { show: true },
            dataLabel: false,
            dataPointShape: true,
            background: '#FFFFFF',
            pixelRatio: 1,
            categories: this.data.chartData2.categories,
            series: this.data.chartData2.series,
            animation: true,
            // enableScroll: true,
            xAxis: {
                type: 'grid',
                gridColor: '#CCCCCC',
                gridType: 'dash',
                dashLength: 8
            },
            yAxis: {
                gridType: 'dash',
                gridColor: '#CCCCCC',
                dashLength: 8,
                splitNumber: 5,
                min: 10,
                max: 180,
                format: val => val.toFixed(0) + '元'
            },
            width: this.data.cWidth,
            height: this.data.cHeight,
            extra: {
                line: {
                    type: 'straight'
                }
            }
        });
    },
    onQueryData () {
        wx.navigateTo({ url: '/pages/data-list/data-list' })
    },
    onTabsClick (e) {
        let dataset = e.detail.currentTarget.dataset
        if (dataset.index == 0) this.renderCharts()
        this.setData({ currentIndex: dataset.index })
    }
});