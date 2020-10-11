const app = getApp();

Page({
    data: {
        list: [],
        text: '数据拉取中',
        rpxRatio: 1
    },
    onLoad () {
        const _this = this;

        //设置rpxRatio
        wx.getSystemInfo({
            success(res) {
                _this.setData({ rpxRatio: res.screenWidth / 750 });
            }
        });
    },
    onReady () {},
    onShow () {
        this.getDeviceInfo();
    },
    onHide () {},
    onUnload () {},
    onPullDownRefresh () {},
    onReachBottom () {},
    onShareAppMessage () {},
    onListClick (e) {
        const params = e.currentTarget.dataset
        app.globalData.device = params.device

        console.log(app.globalData.userInfo)

        if (app.globalData.userInfo) {
            wx.navigateTo({
                url: '/pages/device/device',
                success (res) {
                    console.log(res)
                }
            })
        } else {
            app.globalData.redirect = '/pages/device/device'
            wx.navigateTo({
                url: '/pages/login/login',
                success (res) {
                    console.log(res)
                }
            })
        }
    },
    getDeviceInfo() {
        let _this = this;
        wx.showLoading({ title: '加载中' });
        wx.request({
            url: 'https://wanliwuhan.com/api/device/list',
            header: { 'content-type': 'application/json' },
            success(res) {
                if (res.data.code == 200) {
                    if (res.data.data.length) _this.setData({ list: res.data.data });
                    else _this.setData({ text: '暂无数据' });
                } else wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                });
            },
            fail(err) {
                wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        }
                    }
                });
            },
            complete() {
                wx.hideLoading();
            }
        });
    }
});