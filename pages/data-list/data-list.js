const app = getApp();
const Util = require("../../utils/util.js");

Page({
    data: {
        operations: [],
        edcs: [],
        prev0: null,
        next0: null,
        current0: 1,
        count0: null,
        prev1: null,
        next1: null,
        current1: 1,
        count1: null,
        productName: app.globalData.device.product_name,
        deviceName: app.globalData.device.device_name
    },
    onLoad: function(opts) {
        if (opts.hasOwnProperty('productName') && opts.hasOwnProperty('deviceName')) {
            this.setData({ productName: opts.productName, deviceName: opts.deviceName })
        }
        this.fetchOperationsData({ limit: 15, page: this.data.current0 })
        this.fetchEDCData({ limit: 15, page: this.data.current1 })
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
    fetchOperationsData({ limit, page }) {
        const _this = this
        wx.showLoading({ title: 'Loading...' })
        wx.request({
            url: `https://wanliwuhan.com/api/data/${app.globalData.device.product_name}/${app.globalData.device.device_name}/operation`,
            method: 'GET',
            header: { 'content-type': 'application/json' },
            data: {
                "limit": limit,
                "page": page
            },
            success (res) {
                if (res.data.code == 200) _this.setData({
                    operations: res.data.data.map(item => {
                        item.load1 = item.load1.toFixed(2)
                        item.load5 = item.load5.toFixed(2)
                        item.load15 = item.load15.toFixed(2)
                        item.time = Util.formatTime(new Date(Date.parse(item.time)))
                        return item
                    }),
                    current0: res.data.page,
                    count0: res.data.count
                })
            },
            complete () {
                wx.hideLoading()
            }
        })
    },
    fetchEDCData({ limit, page }) {
        const _this = this
        wx.showLoading({ title: 'Loading...' })
        wx.request({
            url: `https://wanliwuhan.com/api/data/${app.globalData.device.product_name}/${app.globalData.device.device_name}/edc`,
            method: 'GET',
            header: { 'content-type': 'application/json' },
            data: {
                "limit": limit,
                "page": page
            },
            success (res) {
                if (res.data.code == 200) _this.setData({
                    edcs: res.data.data.map(item => {
                        item.time = Util.formatTime(new Date(Date.parse(item.time)))
                        return item
                    }),
                    current1: res.data.page,
                    count1: res.data.count
                })
            },
            complete () {
                wx.hideLoading()
            }
        })
    },
    getPrevPageData0 () {
        if (this.data.current0 > 1) this.setData({ current0: this.data.current0 - 1 })
        else this.setData({ current0: 1 })
        this.fetchEDCData({ limit: 15, page: this.data.current0 })
    },
    getNextPageData0 () {
        if (this.data.current0 < this.data.count0) this.setData({ current0: this.data.current0 + 1 })
        else this.setData({ current0: this.data.count0 })
        this.fetchEDCData({ limit: 15, page: this.data.current0 })
    },
    getPrevPageData1 () {
        if (this.data.current1 > 1) this.setData({ current1: this.data.current1 - 1 })
        else this.setData({ current1: 1 })
        this.fetchOperationsData({ limit: 15, page: this.data.current1 })
        
    },
    getNextPageData1 () {
        if (this.data.current1 < this.data.count1) this.setData({ current1: this.data.current1 + 1 })
        else this.setData({ current0: this.data.count1 })
        this.fetchOperationsData({ limit: 15, page: this.data.current1 })
    }
});