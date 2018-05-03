var app = getApp()
Page({
    data: {
        awardsList: {},
        animationData: {},
        btnDisabled: ''
    },
    gotoList: function () {
        wx.navigateTo({
            url: '../list/list'
        })
    },
    getLottery: function () {
        var that = this
        var awardIndex = Math.random() * 9 >>> 0;//中奖index(奖品中的index值)
        console.log(Math.random() * 6);
        // 获取奖品配置
        var awardsConfig = app.awardsConfig
        if (awardIndex < 2) awardsConfig.chance = false
        console.log(awardIndex)

        // 初始化 rotate
        var animationInit = wx.createAnimation({
            duration: 1
        })
        this.animationInit = animationInit;
        animationInit.rotate(0).step()
        this.setData({
            animationData: animationInit.export(),
            //btnDisabled: 'disabled'
        })

        // 旋转抽奖
        setTimeout(function () {
            var animationRun = wx.createAnimation({
                duration: 4000,
                timingFunction: 'ease'
            })
            that.animationRun = animationRun;
            //设置转几圈，并且在哪个角度停下来 6为奖品数量
            animationRun.rotate(360 * 8 - awardIndex * (360 / 6)).step()
            that.setData({
                animationData: animationRun.export()
            })
        }, 100)

        // 记录奖品
        var winAwards = wx.getStorageSync('winAwards') || { data: [] }
        winAwards.data.push(awardsConfig.awards[awardIndex].name + '1个')
        wx.setStorageSync('winAwards', winAwards)

        // 中奖提示
        setTimeout(function () {
            wx.showModal({
                title: '恭喜',
                content: '获得' + (awardsConfig.awards[awardIndex].name),
                showCancel: false
            })
            if (awardsConfig.chance) {
                that.setData({
                    btnDisabled: ''
                })
            }
        }, 4100);
    },
    onReady: function (e) {
        var that = this;
        //奖项配置 可设置多个奖项
        app.awardsConfig = {
            chance: true,
            awards: [
                { 'index': 0, 'name': '1元红包' },
                { 'index': 1, 'name': '5元话费' },
                { 'index': 2, 'name': '6元红包' },
                { 'index': 3, 'name': '8元红包' },
                { 'index': 4, 'name': '10元话费' },
                { 'index': 5, 'name': '10元红包' }
            ]
        }
        // 绘制转盘
        var awardsConfig = app.awardsConfig.awards,
            len = awardsConfig.length,//奖品数量
            rotateDeg = 360 / len / 2 + 90,
            html = [],
            turnNum = 1 / len  // 文字旋转 turn 值
        that.setData({btnDisabled: app.awardsConfig.chance ? '' : 'disabled'});
        //创建 canvas 绘图上下文（指定 canvasId
        var ctx = wx.createCanvasContext('lotteryCanvas');
        for (var i = 0; i < len; i++) {
            // 保存当前状态
            ctx.save();
            // 开始一条新路径
            ctx.beginPath();
            // 位移到圆心，下面需要围绕圆心旋转
            ctx.translate(150, 150);
            // 从(0, 0)坐标开始定义一条新的子路径
            ctx.moveTo(0, 0);
            // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
            ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
            // 绘制圆弧
            ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

            // 颜色间隔
            if (i % 2 == 0) {
                ctx.setFillStyle('#ffb820');
            } else {
                ctx.setFillStyle('#ffcb3f');
            }

            // 填充扇形
            ctx.fill();
            // 绘制边框
            ctx.setLineWidth(0.5);
            ctx.setStrokeStyle('#e4370e');
            ctx.stroke();

            // 恢复前一个状态
            ctx.restore();
            // 奖项列表 turn(CSS3角度属性)
            html.push({ turn: i * turnNum + 'turn', award: awardsConfig[i].name });
        }
        that.setData({awardsList: html});
        ctx.draw();
    }

})
