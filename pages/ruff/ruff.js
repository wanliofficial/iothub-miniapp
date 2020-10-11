Page({
    data: {
        showUp: false,
        dataList: [
            {
                startTime: '2015.2',
                experience: 'Ruff 正式成立'
            },
            {
                startTime: '2016.4',
                experience: '经过两年打磨，Ruff 1.0 版本正式发布，荣获“微软创新峰会2016年具投资价值奖”'
            },
            {
                startTime: '2016.11',
                experience: '荣获 “GITC2016年度互联网最佳技术创新奖”；荣获 “2016TechCrunch China 创业大赛第一名”'
            },
            {
                startTime: '2017.1',
                experience: '平台的开发者数量超过 7000 人，成功入选微软加速器第一学院企业'
            },
            {
                startTime: '2017.2',
                experience: '百度天工成为 Ruff 合作伙伴'
            },
            {
                startTime: '2017.3',
                experience: 'Ruff Plant Insight 设备宝正式发布，帮助制造业提高生产效率'
            },
            {
                startTime: '2017.5',
                experience: '荣获 “Realseer 开发者大赛商业潜力奖”，荣获首届 “GE Predix Hackathon 最佳创新奖”'
            },
            {
                startTime: '2017.6',
                experience: '商业化三个月以来已经服务超过数十家付费客户，覆盖行业包括光伏、电力、能源管理、人造板、汽车零部件等领域'
            }
        ] 
    },
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
    changeUpDown: function() {
        this.setData({ showUp: !this.data.showUp })
    }
});