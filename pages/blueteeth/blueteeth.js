let currentIndex = 0;

Page({
    data: {
        list: [],
        name: null,
        deviceId: null,
        services: [],
        result: null,
        iconType: "info",
        connectedDevice: null,
        isMyslefShow: false,
        isLogoShow: false,
        isModalShow: false,
        inputValue: null,
        currentDeviceIndicate: [],
        currentDeviceNotify: [],
        currentDeviceRead: [],
        currentDeviceWrite: []
    },
    onLoad: function() {
        let _this = this;
        const SDKVersion = wx.getSystemInfoSync().SDKVersion || '1.0.0'
        const [MAJOR, MINOR, PATCH] = SDKVersion.split('.').map(Number)
        console.log(SDKVersion);
        console.log(MAJOR);
        console.log(MINOR);
        console.log(PATCH);

        const canIUse = apiName => {
            if (apiName === 'showModal.cancel') {
                return MAJOR >= 1 && MINOR >= 1;
            }
            return true;
        }

        wx.getBluetoothAdapterState({
            success(res) {
                wx.showLoading({
                    title: '玩命加载中......',
                });
                if (res.discovering) {
                    wx.showModal({
                        title: '提示',
                        content: '蓝牙正在搜索中，请稍后再试！',
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                            }
                        }
                    });
                    setTimeout(() => {
                        wx.stopBluetoothDevicesDiscovery({
                            success(res) {
                                console.log(res);
                                wx.closeBluetoothAdapter({
                                    success(res) {
                                        console.log(res);
                                        _this.openBlueteeth();
                                        _this.getFoundDevices();
                                    }
                                });
                            }
                        });
                    }, 15000);
                } else {
                    if (res.available) {
                        _this.openBlueteeth();
                        _this.getFoundDevices();
                    }
                }
            },
            fail(err) {
                wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
                if (err.errCode === 10000) _this.openBlueteeth();
            }
        });
    },
    onShow: function() {

    },
    onPullDownRefresh() {
        this.getFoundDevices();
    },
    openBlueteeth() {
        let _this = this;
        wx.openBluetoothAdapter({
            success: function(res) {
                console.log(res);
                wx.startBluetoothDevicesDiscovery({
                    services: [],
                    interval: 0,
                    success: function(res) {
                        console.log(res);
                    },
                    fail: function(err) {
                        wx.showModal({
                            title: '提示',
                            content: err.errMsg,
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定');
                                }
                            }
                        });
                    },
                    complete: function(res) {
                        console.log(res);
                    }
                });
                wx.onBluetoothDeviceFound((devices) => {
                    _this.getFoundDevices();
                    console.dir(devices);
                    if (devices.length) {
                        wx.vibrateShort();
                    }
                });
            },
            fail: function(err) {
                wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
            },
            complete: function(res) {
                console.log(res);
            }
        });
    },
    closeBlueteeth() {
        wx.stopBluetoothDevicesDiscovery({
            success(res) {
                console.log(res);
                wx.closeBluetoothAdapter({
                    success(res) {
                        console.log(res);
                    }
                });
            }
        });
    },
    getFoundDevices() {
        let _this = this;
        wx.getBluetoothDevices({
            success: function(res) {
                console.log(res);
                if (res.devices.length) {
                    _this.setData({
                        list: res.devices,
                        isLogoShow: false
                    });
                } else {
                    _this.setData({
                        isLogoShow: true
                    });
                }
                console.log(_this.data.list);
            },
            fail: function(err) {
                wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });

            },
            complete: function(res) {
                console.log(res);
                wx.hideLoading();
            }
        });
    },
    connectDevice(e) {
        wx.showLoading({
            title: '玩命加载中',
        });
        let _this = this;
        _this.setData({
            deviceId: e.currentTarget.dataset.id
        });
        /**
         * 监听设备的连接状态
         */
        wx.onBLEConnectionStateChange(function(res) {
            console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
        });
        /**
         * 连接设备
         */
        wx.createBLEConnection({
            deviceId: _this.data.deviceId,
            timeout: 60000,
            success: function(res) {
                console.log(res);
                /**
                 * 连接成功，后开始获取设备的服务列表
                 */
                wx.getBLEDeviceServices({ // 这里的 deviceId 需要在上面的 getBluetoothDevices中获取
                    deviceId: _this.data.deviceId,
                    success: function(res) {
                        console.log('device services:', res.services);
                        _this.setData({
                            services: res.services
                        });
                        let uuidList = res.services.map((v, i) => {
                            // 检测设备能力
                            _this.getDeviceAbility(_this.data.deviceId, v.uuid);
                            return v.uuid;
                        });

                        wx.getConnectedBluetoothDevices({
                            services: uuidList,
                            success(res) {
                                _this.setData({
                                    isMyslefShow: true,
                                    connectedDevice: res.devices[0]
                                });
                            },
                            fail(err) {
                                _this.setData({
                                    isMyslefShow: false
                                });
                                wx.showModal({
                                    title: '提示',
                                    content: err.errMsg,
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            console.log('用户点击确定');
                                        }
                                    }
                                });
                            },
                            complete(res) {
                                console.log(res);
                                wx.hideLoading();
                            }
                        });
                    }
                });
            },
            fail: function(err) {
                wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
            },
            complete: function(res) {
                console.log(res);
            }
        });
    },
    getDeviceAbility(deviceId, serviceId) { // 根据服务获取特征
        let _this = this;
        wx.getBLEDeviceCharacteristics({
            // 这里的 deviceId 需要在上面的 getBluetoothDevices
            deviceId: deviceId,
            // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
            serviceId: serviceId,
            success: function(res) {
                let len = res.characteristics.length;
                let indicateList = [],
                    notifyList = [],
                    readList = [],
                    writeList = [];
                for (var i = 0; i < res.characteristics.length; i++) {
                    if (res.characteristics[i].properties.indicate) {
                        indicateList.push({
                            deviceId: deviceId,
                            serviceId: serviceId,
                            characteristicId: res.characteristics[i].uuid
                        });
                        _this.notifyChange(deviceId, serviceId, res.characteristics[i].uuid);
                    }
                    if (res.characteristics[i].properties.notify) {
                        notifyList.push({
                            deviceId: deviceId,
                            serviceId: serviceId,
                            characteristicId: res.characteristics[i].uuid
                        });
                        _this.notifyChange(deviceId, serviceId, res.characteristics[i].uuid);
                    }
                    if (res.characteristics[i].properties.read) {
                        readList.push({
                            deviceId: deviceId,
                            serviceId: serviceId,
                            characteristicId: res.characteristics[i].uuid
                        });
                    }
                    if (res.characteristics[i].properties.write) {
                        writeList.push({
                            deviceId: deviceId,
                            serviceId: serviceId,
                            characteristicId: res.characteristics[i].uuid
                        });
                    }
                }

                indicateList = _this.data.currentDeviceIndicate.concat(indicateList);
                notifyList = _this.data.currentDeviceNotify.concat(notifyList);
                readList = _this.data.currentDeviceRead.concat(readList);
                writeList = _this.data.currentDeviceWrite.concat(writeList);

                _this.setData({
                    currentDeviceIndicate: indicateList,
                    currentDeviceNotify: notifyList,
                    currentDeviceRead: readList,
                    currentDeviceWrite: writeList
                });
            },
            fail: function(err) {
                wx.showModal({
                    title: '提示',
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
    notifyChange(deviceId, serviceId, characteristicId) {
        let _this = this;
        wx.notifyBLECharacteristicValueChange({
            deviceId: deviceId,
            serviceId: serviceId,
            characteristicId: characteristicId,
            state: true,
            success: function(res) {
                console.log('notifyBLECharacteristicValueChanged success', res);
                /**
                 * 回调获取 设备发过来的数据，监听低功耗蓝牙设备的特征值变化事件
                 */
                wx.onBLECharacteristicValueChange((res) => {
                    console.log('characteristic value comed:', res.value);
                    //{value: ArrayBuffer, deviceId: "D8:00:D2:4F:24:17", serviceId: "ba11f08c-5f14-0b0d-1080-007cbe238851-0x600000460240", characteristicId: "0000cd04-0000-1000-8000-00805f9b34fb-0x60800069fb80"}
                    const result = res.value;
                    const hex = _this.buf2hex(result);
                    console.log(hex);
                    _this.setData({ result: hex });
                });
            },
            fail: function(err) {
                wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定');
                        }
                    }
                });
            },
            complete: function(res) {
                console.log(res);
                wx.hideLoading();
            }
        });
    },
    /**
     * 发送 数据到设备中
     */
    sendInstruction() {
        let _this = this;
        let hex = this.data.inputValue;
        let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h) {
            return parseInt(h, 16);
        }));
        let buffer1 = typedArray.buffer;
        console.log(buffer1);
        wx.writeBLECharacteristicValue({
            deviceId: _this.data.currentDeviceWrite[currentIndex].deviceId,
            serviceId: _this.data.currentDeviceWrite[currentIndex].serviceId,
            characteristicId: _this.data.currentDeviceWrite[currentIndex].characteristicId,
            value: buffer1,
            success: function(res) {
                console.log(res);
                _this.setData({
                    result: res.errMsg
                });
            },
            fail: function(err) {
                if (currentIndex < _this.data.currentDeviceWrite.length - 1) {
                    currentIndex += 1;
                    _this.sendInstruction();
                } else {
                    wx.showModal({
                        title: '提示',
                        content: err.errMsg,
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                            }
                        }
                    });
                }
            },
            complete: function(res) {
                console.log(res);
            }
        });
    },
    openModal() {
        this.setData({
            isModalShow: true
        });
    },
    textInput(e) {
        console.log(e.detail.value);
    },
    textBlur(e) {
        this.setData({
            isModalShow: false,
            inputValue: e.detail.value
        });
        wx.showLoading({
            title: '发送中',
        });
    },
    buf2hex(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }
});

// onLoad时初始化蓝牙适配器
// 点击蓝牙图标开始搜索蓝牙设备，并把搜索到的符合条件的设备渲染到页面上
// 点击蓝牙设备列表，连接该蓝牙设备
// 连接另一个蓝牙设备时，需要再次调用wx.createBLEConnection方法
// 对连接到的两个设备分别进行write和notify操作

// 1、初始化蓝牙适配器并做兼容处理

// if (wx.openBluetoothAdapter) {// 兼容处理，判断该微信版本是否支持蓝牙API
//     // 初始化蓝牙适配器
//     wx.openBluetoothAdapter({
//         success: function (res) {
//             console.log('初始化蓝牙适配器成功！' + JSON.stringify(res))
//         }
//     })
// } else {
//     // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
//     wx.showModal({
//         title: '提示',
//         content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
//     })
// }

// 2、搜索蓝牙设备

// //搜索附近蓝牙设备
// wx.startBluetoothDevicesDiscovery({
//     services: ['FFF0’],//如果这里传入该数组，那么根据该 uuid 列表，只搜索发出广播包有这个主服务的蓝牙设备，该参数不是必传参数
//     success: function (res) {
//             console.log('搜索设备' + JSON.stringify(res))
//         }
// })


// 3、获取已发现的设备

// wx.getBluetoothDevices({
//     success: function (res) {
//         // console.log('发现设备' + JSON.stringify(res.devices))
//     }
// })

// 4、连接蓝牙

// wx.createBLEConnection({
//     deviceId: deviceId,    // 蓝牙设备的ID，需要从wx.getBluetoothDevices中的成功回调函数res.devices中获取，设备列表渲染在页面后，我直接拿的是e.currentTarget.id
//     success: function () {
//         that.setData({
//             deviceId: deviceId,
//         })
//     }
//     fail: function () {
//         wx.showToast({
//             title: '连接失败',
//         })
//     }
// })

// 5、获取连接设备的service服务

// wx.getBLEDeviceServices({
//     deviceId: that.data.deviceId,    // 蓝牙设备的ID，与wx.createBLEConnection中的deviceId相同
//     success: function (res) {
//         console.log('获取service!!成功');
//         var services = res.services;
//         for (var i = 0; i < services.length; i++) {
//             var UUID = services[i].uuid.substring(0, 8)
//             // console.log(UUID)
//             if (UUID == "0000FFF0") {    // 遍历services，获取到匹配的UUID
//                 that.setData({
//                     servicesId: services[i].uuid,
//                 })
//             }
//         }
//     }
// })

// 6、获取连接设备的characteristics特征值

// wx.getBLEDeviceCharacteristics({
//     deviceId: that.data.deviceId,    // 所连接的蓝牙设备的ID
//     serviceId: that.data.servicesId,    //wx.getBLEDeviceServices接口中获取的servicesId
//     success: function (res) {
//         //console.log('获取characteristics成功');
//         // console.log('characteristics: ' + JSON.stringify(res.characteristics))//控制台打印特征值
//         //判断是不是FFF6或FFF4服务 写入
//         for (var i = 0; i < res.characteristics.length; i++) {
//             var UUID = res.characteristics[i].uuid.substring(0, 8)
//             // console.log(UUID)
//             if (UUID == "0000FFF6") {    //可能每家公司的服务设定的不一样，仅供参考
//                 that.setData({
//                     writeServicweId: that.data.servicesId,
//                     writeCharacteristicsId: res.characteristics[i].uuid
//                 })
//             } else if (UUID == "0000FFF4") {
//                 that.setData({
//                     notifyServicweId: that.data.servicesId,
//                     notifyCharacteristicsId: res.characteristics[i].uuid
//                 })
//             }
//         }
//     },
//     fail: function () {
//         console.log('获取连接设备的特征值失败')
//     }
// })

// 7、发送消息

// wx.writeBLECharacteristicValue({
//     deviceId: that.data.deviceId,
//     serviceId: that.data.writeServicweId,
//     characteristicId: that.data.writeCharacteristicsId,
//     value: value, //buffer
//     success: function () {
//         console.log('发送消息成功')
//     },
//     fail: function () {
//         console.log('发送失败')
//     }
// })

// 8、接收消息，启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。

// wx.notifyBLECharacteristicValueChange({
//     state: true, // 启用 notify 功能
//     deviceId: that.data.deviceId,
//     serviceId: that.data.notifyServicweId,
//     characteristicId: that.data.notifyCharacteristicsId,
//     success: function (res) {
//         console.log('notifyBLECharacteristicValueChange success', res.errMsg)
//     },
//     fail: function () {
//         console.log('启用 notify 失败');
//     },
// })

// //ArrayBuffer转为string的方法
// function ab2hex(buffer) {
//     var hexArr = Array.prototype.map.call(
//         new Uint8Array(buffer),
//         function (bit) {
//             return ('00' + bit.toString(16)).slice(-2)
//         })
//     return hexArr.join('');
// }

// //wx.notifyBLECharacteristicValueChange启动订阅特征值变化，但是需要在此方法中读取特征值的变化
// wx.onBLECharacteristicValueChange(function (res) {
//     var value = ab2hex(res.value); //由于res.value是ArrayBuffer,不能直接在控制台打印，在这里转为了string
//     //console.log(value)
// })


// 9、断开蓝牙连接

// wx.closeBLEConnection({
//     deviceId: that.data.deviceId,
//     success: function (res) {
//         console.log(res)
//     }
// })