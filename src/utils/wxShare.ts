import axios from 'axios';
import {isWxBrowser} from '@/utils/commonUtils';
// import {wx} from 'weixin-js-sdk';
const wx = require('weixin-js-sdk');

export function wxChatShare(param: any) {
    if (!isWxBrowser()) {
        return;
    }
    const url = param.url;
    axios.get("/wx/sdk", { params: { url: url} }).then((res: any) => {
            const code = res.code;
            if (code === 200) {
                // 接口返回配置信息
                wx.config({
                    debug: false,
                    appId: res.data.appId,
                    timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                    signature: res.data.signature, // 必填，签名
                    jsApiList: [ // 用的方法都要加进来
                        'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'
                    ]
                });
                wx.ready(function () {
                    //分享到朋友圈

                    wx.updateTimelineShareData({
                        title: param.title, // 分享标题
                        link: param.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: param.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                            console.log("分享到朋友圈成功返回的信息为:", res);
                        }
                    })

                    wx.onMenuShareTimeline({
                        title: param.title, // 分享标题
                        link: param.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: param.imgUrl, // 分享图标
                        success: function () {
                            // 用户点击了分享后执行的回调函数
                        },
                    })

                    //分享给朋友

                    wx.updateAppMessageShareData({
                        title: param.title, // 分享标题
                        desc: param.desc, // 分享描述
                        link: param.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: param.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                            console.log("分享到朋友圈成功返回的信息为:", res);
                        }
                    })
                    wx.onMenuShareAppMessage({
                        title: param.title, // 分享标题
                        desc: param.desc, // 分享描述
                        link: param.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: param.imgUrl, // 分享图标
                        type: param.type, // 分享类型,music、video或link，不填默认为link
                        dataUrl: param.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户点击了分享后执行的回调函数
                        }
                    });
                    wx.onMenuShareQQ({
                        title: param.title, // 分享标题
                        desc: param.desc, // 分享描述
                        link: param.link, // 分享链接
                        imgUrl: param.imgUrl, // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });
                wx.error(function (res: any) {
                    console.log('验证失败返回的信息:', res);
                });
            } else {
                console.log(res.data.message);
            }
        })
}
