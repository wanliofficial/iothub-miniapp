Page({
    data: {
        markers: [{
            id: 0,
            latitude: 31.184171,
            longitude: 121.611291,
            width: 50,
            height: 50
        }],
        imgList: [
            'https://statics.wanliwuhan.com/images/ruff/ruff-01.jpg',
            'https://statics.wanliwuhan.com/images/20190206/wechat-public-account.gif',
            'https://statics.wanliwuhan.com/images/20190206/wechat-service-account.jpg',
            'https://statics.wanliwuhan.com/images/20190206/ruff-weibo.jpg'
        ]
    },
    onLoad: function(n) {

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
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId)
    },
    wxAccountLoad(e) {
        console.log(e.detail)
    },
    wxAccountError(e) {
        console.log(e.detail)
    },
    viewImg(e) {
        console.log(e);
        this.previewImg(e.currentTarget.dataset.url);
    },
    previewImg(img) {
        wx.previewImage({
            current: img,
            urls: this.data.imgList
        });
    }
});