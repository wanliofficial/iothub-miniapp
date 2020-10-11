const app = getApp();

Page({
    data: {},
    onLoad: function() {

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
    onShareAppMessage: function() {

    },
    getUserInfo (e) {
        app.globalData.userInfo = e.detail.userInfo
        if (e.detail.userInfo) wx.request({
            url: 'https://wanliwuhan.com/api/users/',
            header: { 'content-type': 'application/json' },
            method: 'POST',
            data: {
                openid: app.globalData.openid,
                session_key: app.globalData.session_key,
                nickName: app.globalData.userInfo.nickName,
                avatarUrl: app.globalData.userInfo.avatarUrl,
                gender: app.globalData.userInfo.gender,
                country: app.globalData.userInfo.country,
                province: app.globalData.userInfo.province,
                city: app.globalData.userInfo.city,
                language: app.globalData.userInfo.language
            },
            success (r) {
                if (r.statusCode == 200 && r.data.code == 200) {
                    wx.navigateTo({ url: '/pages/device/device' })
                }
            }
        })
    }
});