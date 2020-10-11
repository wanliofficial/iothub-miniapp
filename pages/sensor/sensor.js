// pages/sensor/sensor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xAxis: 0,
    yAxis: 0,
    zAxis: 0,
    xAngularVelocity: 0,
    yAngularVelocity: 0,
    zAngularVelocity: 0,
    direction: 0,
    longitude: 0,
    latitude: 0,
    altitude: 0,
    speed: 0,
    systemInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.onAccelerometerChange(function (res) {
      console.log(res)
      _this.setData({
        xAxis: res.x,
        yAxis: res.y,
        zAxis: res.z
      });
    });
    wx.onCompassChange(function (res) {
      console.log(res);
      _this.setData({
        direction: res.direction
      });
    });
    wx.onGyroscopeChange(function (res) {
      console.log(res);
      _this.setData({
        xAngularVelocity: res.x,
        yAngularVelocity: res.y,
        zAngularVelocity: res.z
      });
    });
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success(res) {
        console.log(res);
        _this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          altitude: res.altitude,
          speed: res.speed
        });
      }
    });
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          systemInfo: res
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  startAcculerator: function() {
    wx.startAccelerometer({
      interval: 'ui'
    });
  },
  stopAcculerator: function() {
    wx.stopAccelerometer();
  },
  startCompass: function() {
    wx.startCompass();
  },
  stopCompass: function() {
    wx.stopCompass();
  },
  startGyro: function() {
    wx.startGyroscope();
  },
  stopGyro: function() {
    wx.stopGyroscope();
  },
  openCoordinate: function() {
    let _this = this;
    wx.openLocation({
      name: "Ruff",
      address: "上海市浦东新区纳贤路800号科海大厦1栋B座",
      latitude: _this.data.latitude,
      longitude: _this.data.longitude,
      scale: 18
    });
  },
  chooseCoordinate: function() {
    wx.chooseLocation({
      success(res){
        console.log(res);
        wx.showModal({
          title: '提示',
          showCancel: true,
          content: `地名：${res.name}，地址：${res.address}，经度：${res.longitude}，纬度：${res.latitude}`,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      },
      fail(err){
        wx.showModal({
          title: '提示',
          showCancel: true,
          content: err.errMsg,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        });
      },
      complete(res){

      }
    });
  },
  longShock: function() {
    wx.vibrateLong();
  },
  shortShock: function() {
    wx.vibrateShort();
  }
});