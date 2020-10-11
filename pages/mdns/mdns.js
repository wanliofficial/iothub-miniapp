// 服务发现事件的list（也就是解析成功）
let serviceList = [];
// 服务解析失败事件的list
let resolveFailList = [];

Page({
    data: {
        lists: [],
        tips: "暂未发现设备",
        resolveFailList: []
    },
    onLoad: function(n) {
        this.onLocalService();
        this.offLocalService();
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
    /**
     * 开始搜索
     */
    startDiscovery: function() {
        let that = this;
        serviceList = [];
        resolveFailList = [];
        wx.startLocalServiceDiscovery({
            serviceType: '_http._tcp.',
            success: function(res) {
                console.log(res);
            },
            fail: function(err) {
                console.log(err);
            },
            complete: function(res) {
                console.log(res);
                that.showTips('搜索完成', 'success');
            }
        });
    },
    /**
     * stopDiscovery
     */
    stopDiscovery: function() {
        let that = this;
        wx.stopLocalServiceDiscovery({
            success: function() {
                that.showTips('停止搜索成功', 'success');
                serviceList = []
                resolveFailList = []
                that.setData({
                    lists: [],
                    resolveFailList: []
                });
            },
            fail: function() {
                that.showTips('停止搜索失败，请重试！');
            },
            complete: function() {
                console.log('stopDiscovery complete')
            }
        });
    },
    /**
     * 提示方法
     */
    showTips: function(title = '出错啦', icon = 'none') {
        wx.showToast({
            title: title,
            icon: icon,
            duration: 2000
        })
    },
    /**
     * 监听方法合集
     */
    onLocalService: function() {
        let that = this;
        // 监听服务发现事件
        wx.onLocalServiceFound(function(obj) {
            console.log(obj);
            serviceList.forEach(function() {

            });
            serviceList.push(obj);

            that.setData({
                tips: serviceList.length > 0 ? '' : that.data.tips,
                lists: serviceList
            });
        });

        // 监听服务解析失败事件
        wx.onLocalServiceResolveFail(function(obj) {
            resolveFailList.push(obj);
            that.setData({
                resolveFailList: resolveFailList
            });
        });

        // 监听服务离开
        wx.onLocalServiceLost(function(obj) {
            that.showTips('有服务离开啦');
            console.log(obj);
        });

        // 监听搜索停止
        wx.onLocalServiceDiscoveryStop(function(obj) {
            console.log('监听到搜索停止事件');
        });
    },

    /**
     * offLocalService
     */
    offLocalService: function() {
        // 取消监听服务发现事件
        wx.offLocalServiceFound(function() {
            console.log('取消监听服务发现事件 成功');
        });

        // 取消监听服务解析失败事件
        wx.offLocalServiceResolveFail(function() {
            console.log('取消监听 mDNS 服务解析失败的事件 成功');
        });

        // 取消监听服务离开
        wx.offLocalServiceLost(function() {
            console.log('取消监听服务离开事件 成功');
        });

        // 取消监听搜索停止
        wx.offLocalServiceDiscoveryStop(function() {
            console.log('取消监听 mDNS 服务停止搜索的事件 成功');
        });
    }
});