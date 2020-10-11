let aidlist = [];

Page({
    data: {
        stopBtnShow: false,
        nfc: false,
        aidList: ['F222222222']
    },
    onLoad: function(n) {
        let _this = this;
        wx.getHCEState({
            success(res) {
                if (res.errCode === 0) _this.setData({
                    nfc: true
                });
            }
        });
        wx.onHCEMessage(res => {
            if (res.messageType === 1) {
                const buffer = new ArrayBuffer(1);
                const dataView = new DataView(buffer);
                dataView.setUint8(0, 0);
                console.log(buffer);
                wx.sendHCEMessage({
                    data: buffer,
                    success: res => {
                        console.log('sendHCEMessage' + res);
                    },
                    fail: err => {
                        wx.showToast({
                            title: err.errMsg,
                            duration: 2000
                        });
                    }
                });
            }
        });
    },
    onReady: function() {

    },
    onShow: function() {

    },
    onHide: function() {

    },
    onUnload: function() {

    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    startNFC() {
        let _this = this;
        wx.startHCE({
            aid_list: this.data.aidList,
            success: res => {
                if (res.errCode === 0) {
                    _this.setData({
                        stopBtnShow: true
                    });
                }
                wx.showToast({
                    title: 'NFC已打开',
                    duration: 2000
                });
            },
            fail: err => {
                wx.showModal({
                    title: '打开出错',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
            }
        });
    },
    stopNFC() {
        let _this = this;
        wx.stopHCE({
            success: res => {
                _this.setData({
                    stopBtnShow: true
                });
                wx.showToast({
                    title: 'NFC已关闭',
                    duration: 2000
                });
            },
            fail: err => {
                wx.showModal({
                    title: '关闭出错',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
            }
        });
    },
    aidInput(e) {
        let list = e.detail.value;
        list = list.split(',');
        aidlist = list;
    },
    aidBlur() {
        this.setData({
            aidList: aidlist
        });
        console.log(this.data.aidList)
    }
});