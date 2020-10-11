// pages/wifi/wifi.js
Page({
    data: {
        isModalShow: false,
        isStopWifiBtnShow: false,
        wifiInfo: null,
        wifiTips: '您还没有搜索WIFI呦~',
        wifiList: [],
        wifiError: null,
        iconType: 'info',
        system: '', //版本号
        platform: '', //系统 android
        ssid: '', //wifi帐号(必填)
        bssid: '', //设备号 自动获取
        password: '', //无线网密码(必填)
        networkType: null
    },
    onLoad(opts) {
        let _this = this;
        //检测手机型号
        wx.getSystemInfo({
            success: function(res) {
                let system = '';
                if (res.platform == 'android') system = parseInt(res.system.substr(8));
                if (res.platform == 'ios') system = parseInt(res.system.substr(4));
                if (res.platform == 'android' && system < 6) {
                    _this.setData({ wifiError: '手机版本暂时不支持', iconType: 'warn' });
                    return false;
                }
                if (res.platform == 'ios' && system < 11) {
                    _this.setData({ wifiError: '手机版本暂时不支持', iconType: 'warn' });
                    return false;
                }
                _this.setData({ platform: res.platform });
            }
        });
        wx.getNetworkType({
            success(res) {
                _this.setData({
                    networkType: res.networkType
                });
            }
        });
        wx.onNetworkStatusChange((res) => {
            if (res.isConnected) _this.setData({
                networkType: res.networkType
            });
            wx.vibrateShort();
            wx.showToast({
                title: '网络发生改变',
                icon: 'success',
                duration: 1000
            });
        });
    },
    onUnload() {
        this.setData({
            wifiError: null,
            iconType: 'info'
        });
    },
    start(e) {
        this.startWifi(this);
    },
    startWifi(_this) { //初始化 Wi-Fi 模块。
        wx.startWifi({
            success: function() {
                _this.getList(_this);
                wx.getConnectedWifi({
                    success: res => {
                        let tmp = {
                            level: Math.floor(res.wifi.signalStrength / 25)
                        };
                        Object.assign(tmp, res.wifi);
                        _this.setData({
                            wifiInfo: tmp
                        });
                    },
                    fail: err => {
                        wx.showToast({
                            title: err.errMsg,
                            icon: 'none',
                            duration: 1000
                        });
                    }
                });
            },
            fail: function(res) {
                _this.setData({ wifiError: res.errMsg, iconType: 'warn' });
            }
        });
    },
    getList(_this) {
        //安卓执行方法
        if (_this.data.platform == 'android') {
            //请求获取 Wi-Fi 列表
            wx.getWifiList({
                success: function(res) {
                    //安卓执行方法
                    _this.androidList(_this);
                },
                fail: function(res) {
                    _this.setData({ wifiError: res.errMsg, iconType: 'cancel' });
                }
            })
        }
        //IOS执行方法
        if (_this.data.platform == 'ios') {
            _this.iosList(_this);
        }
    },
    androidList(_this) {
        //监听获取到 Wi-Fi 列表数据
        wx.onGetWifiList((res) => { //获取列表
            if (res.wifiList.length) {
                //循环找出信号最好的那一个
                let wifiList = res.wifiList;
                for (let i = 0; i < wifiList.length; i++) {
                    Object.assign(wifiList[i], { level: Math.floor(wifiList[i]['signalStrength'] / 25) });
                }
                _this.setData({
                    wifiList: wifiList
                });
            } else {
                _this.setData({ wifiError: '未查询到设置的wifi', iconType: 'info' });
            }
        });
    },
    iosList(_this) {
        _this.setData({ wifiError: 'IOS暂不支持', iconType: 'warn' });
    },
    connect() {
        if (this.data.password) {
            this.connected(this);
        } else {
            wx.showToast({
                title: '密码未填写！',
                icon: 'none',
                duration: 1000
            });
        }
    },
    connected(_this) {
        wx.connectWifi({
            SSID: _this.data.ssid,
            BSSID: _this.data.bssid,
            password: _this.data.password,
            success: (res) => {
                _this.setData({ wifiError: 'wifi连接成功', iconType: 'success', isStopWifiBtnShow: true });
            },
            fail: (res) => {
                _this.setData({ wifiError: res.errMsg, iconType: 'cancel' });
            },
            complete: res => {
                setTimeout(() => {
                    _this.setData({
                        isModalShow: false
                    });
                }, 1000);
            }
        });
    },
    accountInput(e) {
        this.setData({
            ssid: e.detail.value
        });
    },
    passwordInput(e) {
        this.setData({
            password: e.detail.value
        });
    },
    selectWifi(e) {
        let _this = this;
        wx.showModal({
            title: '提示',
            content: '确认连接' + e.currentTarget.dataset.ssid,
            success(res) {
                if (res.confirm) {
                    _this.setData({
                        isModalShow: true,
                        ssid: e.currentTarget.dataset.ssid,
                        bssid: e.currentTarget.dataset.bssid
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        });
    },
    stop() {
        wx.stopWifi({
            success(res) {
                wx.showToast({
                    title: '已关闭WIFI',
                    icon: 'none',
                    duration: 1000
                });
                console.log(res.errMsg)
            }
        });
    }
});