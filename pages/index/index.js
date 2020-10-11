const app = getApp();

Page({
    data: {},
    onLoad: function() {},
    onShareAppMessage: function() {
        return {
            title: '软件定义硬件-RUFF',
            path: '/pages/index/index'
        }
    }
});