//app.js
App({
    onLaunch () {
        this.checkNewVersion();

        const _this = this;

        wx.getLocation({
            type: 'wgs84',
            success (res) {
                _this.globalData.location = res
            },
            fail (err) {
                console.log(err)
            }
        });

        wx.getUserInfo({
            success: function(res) {
                _this.globalData.userInfo = res.userInfo
            }
        });

        wx.login({
            success (res) {
                if (res.code) {
                    wx.request({
                        url: 'https://wanliwuhan.com/api/users/openid',
                        header: { 'content-type': 'application/json' },
                        method: 'POST',
                        data: { code: res.code },
                        success (r) {
                            if (r.data.code == 200) {
                                _this.globalData.openid = r.data.data.openid
                                _this.globalData.session_key = r.data.data.session_key
                            }
                        }
                    })
                } else {
                    console.log(res.errMsg)
                }
            }
        });
    },
    checkNewVersion () { // 检查版本更新
        // 获取小程序更新机制兼容
        if (wx.canIUse("getUpdateManager")) {
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function(res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(function() {
                        wx.showModal({
                            title: "更新提示",
                            content: "新版本已经准备好，是否重启应用？",
                            success: function(res) {
                                if (res.confirm) {
                                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                    updateManager.applyUpdate();
                                }
                            }
                        });
                    });
                    updateManager.onUpdateFailed(function() {
                        // 新的版本下载失败
                        wx.showModal({
                            title: "已经有新版本了哟~",
                            content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
                        });
                    });
                }
            });
        } else {
            wx.showModal({
                title: "提示",
                content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
            });
        }
    },
    globalData: {
        userInfo: null,
        openid: null,
        session_key: null,
        device: {},
        location: {
            latitude: 23.099994,
            longitude: 113.324520
        },
        redirect: null
    }
});