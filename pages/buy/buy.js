Page({
    data: {
        imgList: [
            'https://statics.wanliwuhan.com/images/ruff/ruff-dev-board.png',
            'https://statics.wanliwuhan.com/images/ruff/ruff-dev-board-pins.png',
            'https://statics.wanliwuhan.com/images/ruff/ruff-taobao-store.jpg'
        ],
        inventory: [{
            head: ["内容", "数量"],
            body: [
                ["开发板", "1"],
                ["Micro USB 线", "1"],
                ["铜柱", "4"],
                ["螺丝", "4"],
                ["贴纸", "1"]
            ]
        }],
        gifts: [{
            head: ["内容", "数量"],
            body: [
                ["杜邦线", 40],
                ["蜂鸣器", 1],
                ["LCD 模块", 1],
                ["LED 模块", 1],
                ["大按键模块", 2],
                ["声音传感器", 1],
                ["光照传感器", 1],
                ["继电器模块", 1],
                ["温湿度传感器", 1],
                ["红外发送模块", 1],
                ["红外接收模块", 1]
            ]
        }],
        pilotlamp: [{
            head: ["LED", "状态", "作用"],
            body: [
                ["红色 LED", "常亮", "系统正在启动（约30秒）"],
                ["红色 LED", "闪烁", "等待用户的 WiFi 配置信息"],
                ["蓝色 LED", "闪烁", "接收到用户 WiFi 配置信息，正在尝试连接路由器。（约10秒）"],
                ["蓝色 LED", "常亮", "成功连接网络"],
                ["绿色 LED", "常亮", "AP 已经启动"]
            ]
        }],
        buttons: [{
            head: ["按键", "作用"],
            body: [
                ["HRESET", "复位按键，按下后开发板重启"],
                ["RESET", "恢复出厂设置按键， 长按5秒以上会恢复出厂的配置"]
            ]
        }],
        p1List: [{
            head: ["管脚号", "丝印名称", "作用"],
            body: [
                ["1", "AN3", "模拟输入3通道"],
                ["2", "AN4", "模拟输入4通道"],
                ["3", "AN2", "模拟输入2通道"],
                ["4", "AN5", "模拟输入5通道"],
                ["5", "AN1", "模拟输入1通道"],
                ["6", "AN6", "模拟输入6通道"],
                ["7", "AN0", "模拟输入0通道"],
                ["8", "AN7", "模拟输入7通道"],
                ["9", "GND", "地"],
                ["10", "GND", "地"],
                ["11", "5V0", "5.0V电源"],
                ["12", "5V0", "5.0V电源"],
                ["13", "G14", "通用输入输出14；0V或者3.3V"],
                ["14", "SCLK", "SPI总线的时钟线"],
                ["15", "G13", "通用输入输出13；0V或者3.3V"],
                ["16", "MOSI", "SPI总线的输出数据线"],
                ["17", "G12", "通用输入输出12；0V或者3.3V"],
                ["18", "MISO", "SPI总线的输入数据线"],
                ["19", "G11", "通用输入输出11；0V或者3.3V"],
                ["20", "CS1", "SPI总线的1号片选线"],
                ["21", "GND", "地"],
                ["22", "GND", "地"],
                ["23", "3V3", "3.3V电源"],
                ["24", "3V3", "3.3V电源"],
                ["25", "NC", "没有使用"],
                ["26", "AN7", "UART总线的请求发送线"],
                ["27", "NC", "没有使用"],
                ["28", "AN7", "UART总线的请求发送线"],
                ["29", "NC", "没有使用"],
                ["30", "AN7", "UART总线的请求发送线"],
                ["31", "NC", "没有使用"],
                ["32", "AN7", "UART总线的请求发送线"],
                ["33", "NC", "没有使用"],
                ["34", "GND", "地"],
                ["35", "NC", "没有使用"],
                ["36", "3V3", "3.3V电源"],
                ["37", "P3", "PWM3通道"],
                ["38", "PWM4", "PWM4通道"],
                ["39", "P2", "PWM2通道"],
                ["40", "PWM5", "PWM5通道"],
                ["41", "P1", "PWM1通道"],
                ["42", "PWM6", "PWM6通道"],
                ["43", "P0", "PWM0通道"],
                ["44", "PWM7", "PWM7通道"],
                ["45", "GND", "地"],
                ["46", "GND", "地"]
            ]
        }],
        p2List: [{
            head: ["管脚号", "丝印名称", "作用"],
            body: [
                ["1", "DAT", "1-WIRE总线的数据线"],
                ["2", "IO0", "扩展输入输出0；0V或者3.3V"],
                ["3", "GND", "地"],
                ["4", "IO1", "扩展输入输出1；0V或者3.3V"],
                ["5", "3V3", "3.3V电源"],
                ["6", "IO2", "扩展输入输出2；0V或者3.3V"],
                ["7", "L_R", "红色led控制脚"],
                ["8", "IO3", "扩展输入输出3；0V或者3.3V"],
                ["9", "L_G", "绿色led控制脚"],
                ["10", "IO4", "扩展输入输出4；0V或者3.3V"],
                ["11", "L_B", "蓝色led控制脚"],
                ["12", "IO5", "扩展输入输出5；0V或者3.3V"],
                ["13", "GND", "地"],
                ["14", "IO6", "扩展输入输出6；0V或者3.3V"],
                ["15", "3V3", "3.3V电源"],
                ["16", "IO7", "扩展输入输出7；0V或者3.3V"],
                ["17", "SCL", "I2C总线的时钟线"],
                ["18", "IO8", "扩展输入输出8；0V或者3.3V"],
                ["19", "SDA", "I2C总线的数据线"],
                ["20", "IO9", "扩展输入输出9；0V或者3.3V"],
                ["21", "GND", "地"],
                ["22", "IO10", "扩展输入输出10；0V或者3.3V"],
                ["23", "3V3", "3.3V电源"],
                ["24", "IO11", "扩展输入输出11；0V或者3.3V"],
                ["25", "SCL", "I2C总线的时钟线"],
                ["26", "IO12", "扩展输入输出12；0V或者3.3V"],
                ["27", "SDA", "I2C总线的数据线"],
                ["28", "IO13", "扩展输入输出13；0V或者3.3V"],
                ["29", "GND", "地"],
                ["30", "IO14", "扩展输入输出14；0V或者3.3V"],
                ["31", "3V3", "3.3V电源"],
                ["32", "IO15", "扩展输入输出15；0V或者3.3V"],
                ["33", "SCL", "I2C总线的时钟线"],
                ["34", "GND", "地"],
                ["35", "SDA", "I2C总线的数据线"],
                ["36", "3V3", "3.3V电源"],
                ["37", "GND", "地"],
                ["38", "G26", "通用输入输出26；0V或者3.3V"],
                ["39", "3V3", "3.3V电源"],
                ["40", "G18", "通用输入输出18；0V或者3.3V"],
                ["41", "B_P", "电源按钮"],
                ["42", "NC", "没有使用"],
                ["43", "B_F", "自定义功能按钮"],
                ["44", "NC", "没有使用"],
                ["45", "B_R", "复位按钮"],
                ["46", "NC", "没有使用"]
            ]
        }],
        tpl: [{
            attrs: {
                class: 'ruff-table'
            },
            children: [{
                attrs: {
                    class: 'ruff-table-thead'
                },
                children: [{
                    attrs: {
                        class: 'ruff-table-tr'
                    },
                    children: [{
                        attrs: {
                            class: 'ruff-table-th'
                        },
                        children: [{
                            type: 'text',
                            text: ''
                        }],
                        name: 'th',
                        type: 'node'
                    }],
                    name: 'tr',
                    type: 'node'
                }],
                name: 'thead',
                type: 'node'
            }, {
                attrs: {
                    class: 'ruff-table-tbody'
                },
                children: [{
                    attrs: {
                        class: 'ruff-table-tr'
                    },
                    children: [{
                        attrs: {
                            class: 'ruff-table-td'
                        },
                        children: [{
                            type: 'text',
                            text: ''
                        }],
                        name: 'td',
                        type: 'node'
                    }],
                    name: 'tr',
                    type: 'node'
                }],
                name: 'tbody',
                type: 'node'
            }],
            name: 'table',
            type: 'node'
        }]
    },
    onLoad: function(n) {
        this.setData({
            inventory: this.create(this.data.inventory[0].head, this.data.inventory[0].body),
            gifts: this.create(this.data.gifts[0].head, this.data.gifts[0].body),
            pilotlamp: this.create(this.data.pilotlamp[0].head, this.data.pilotlamp[0].body),
            buttons: this.create(this.data.buttons[0].head, this.data.buttons[0].body),
            p1List: this.create(this.data.p1List[0].head, this.data.p1List[0].body),
            p2List: this.create(this.data.p2List[0].head, this.data.p2List[0].body)
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
    previewImg(e) {
        let img = e.currentTarget.dataset.url;
        wx.previewImage({
            current: img,
            urls: this.data.imgList
        });
    },
    create: function(head, body) {
        let obj = [{
            attrs: {
                class: 'ruff-table'
            },
            children: [{
                attrs: {
                    class: 'ruff-table-thead'
                },
                children: [{
                    attrs: {
                        class: 'ruff-table-tr'
                    },
                    children: [{
                        attrs: {
                            class: 'ruff-table-th'
                        },
                        children: [{
                            type: 'text',
                            text: ''
                        }],
                        name: 'th',
                        type: 'node'
                    }],
                    name: 'tr',
                    type: 'node'
                }],
                name: 'thead',
                type: 'node'
            }, {
                attrs: {
                    class: 'ruff-table-tbody'
                },
                children: [{
                    attrs: {
                        class: 'ruff-table-tr'
                    },
                    children: [{
                        attrs: {
                            class: 'ruff-table-td'
                        },
                        children: [{
                            type: 'text',
                            text: ''
                        }],
                        name: 'td',
                        type: 'node'
                    }],
                    name: 'tr',
                    type: 'node'
                }],
                name: 'tbody',
                type: 'node'
            }],
            name: 'table',
            type: 'node'
        }], tmp = [];
        head.forEach(item => {
            tmp.push({
                attrs: {
                    class: 'ruff-table-th'
                },
                children: [{
                    type: 'text',
                    text: item
                }],
                name: 'th',
                type: 'node'
            });
        });
        obj[0].children[0].children[0].children = tmp;
        tmp = [];
        body.forEach(item => {
            tmp.push({
                attrs: {
                    class: 'ruff-table-tr'
                },
                children: [{
                    attrs: {
                        class: 'ruff-table-td'
                    },
                    children: [{
                        type: 'text',
                        text: item[0]
                    }],
                    name: 'td',
                    type: 'node'
                }, {
                    attrs: {
                        class: 'ruff-table-td'
                    },
                    children: [{
                        type: 'text',
                        text: item[1]
                    }],
                    name: 'td',
                    type: 'node'
                }, {
                    attrs: {
                        class: 'ruff-table-td'
                    },
                    children: [{
                        type: 'text',
                        text: item[2]
                    }],
                    name: 'td',
                    type: 'node'
                }],
                name: 'tr',
                type: 'node'
            });
        });
        obj[0].children[1].children = tmp;
        return obj;
    }
});