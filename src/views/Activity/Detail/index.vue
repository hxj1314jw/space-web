<template>
    <div>
        <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
            <van-image style="margin: 0; padding: 0" width="100%" height="230" fit="cover"
                       :src="ossImageUrl(activityForm.image)"/>
            <van-cell-group>
                <van-cell style="padding: 15px; margin: 0;">
                    <h3 style="margin: 0;">
                        <van-tag v-if="activityForm.hotStatus" color="#fff7e8" text-color="#ffb11a">优选</van-tag>
                        {{activityForm.name}}
                    </h3>
                    <div style="margin-top: 7px;">
                        <span style="color: #00B261; font-size: large; font-weight: bold">￥{{activityForm.price}} 起</span>
                        <span style="color: #999999; font-size: x-small; margin-left: 10px;">门票剩余总数: {{surplus}}张</span>
                    </div>
                </van-cell>
                <van-cell title="活动时间: " :value="activityDate">
                    <van-icon slot="icon" name="clock-o" style="line-height: inherit; margin-right: 7px;"
                              color="#00B261"/>
                </van-cell>
                <van-cell @click="toMap()" title="地理位置: " :value="activityForm.address" is-link>
                    <van-icon slot="icon" name="location-o" style="line-height: inherit; margin-right: 7px;"
                              color="#00B261"/>
                </van-cell>
            </van-cell-group>

            <van-cell-group style="margin-top: 10px; ">
                <van-cell style="padding: 10px 15px; margin: 0;">
                    <van-image v-if="activityForm.userType === '1'" style="float: left" round width="5rem" height="5rem"
                               :src="ossImageUrl(activityForm.avatar)"/>
                    <van-image v-else style="float: left" round width="5rem" height="5rem"
                               :src="ossImageUrl(activityForm.orgLogo)"/>
                    <span class="publish-name">
            <span v-if="activityForm.userType === '1'" style="font-size: large;">{{activityForm.publisherName}}</span>
            <span v-else style="font-size: large;">{{activityForm.orgName}}</span><br>
            <span style="color: #999999; font-size: small;">{{ activityForm.tags}}</span>
          </span>
                </van-cell>
            </van-cell-group>

            <van-cell-group style="margin-top: 10px; ">
                <van-cell style="padding: 15px; margin: 0;">
                    <span style="color: #666666" v-html="activityForm.content"/>
                </van-cell>
            </van-cell-group>
        </div>

        <div style="position: fixed; bottom: 0; height: 50px;">
            <van-button type="default" to="/home" plain hairline
                        style="width: 20vw; margin: 0; padding: 0; height: 100%;">
                <van-icon name="wap-home" size="25" class="center"/>
            </van-button>
            <van-button type="default" @click="collect()" plain hairline
                        style="width: 20vw; margin: 0; padding: 0; height: 100%;">
                <van-icon v-if="isCollect" name="star" color="#ffb11a" size="25" class="center"/>
                <van-icon v-else name="star-o" size="25" class="center"/>
            </van-button>
            <van-button v-if="activityForm.status === '6' || activityForm.status === '2'" @click="chooseTicket()"
                        type="primary" style="width: 60vw; margin: 0; padding: 0; height: 100%;">
                <span class="center van-icon">立即报名</span>
            </van-button>
            <van-button v-else-if="activityForm.status === '1'" @click="chooseTicket()" type="danger"
                        style="width: 60vw; margin: 0; padding: 0; height: 100%;">
                <span class="center van-icon">等待报名</span>
            </van-button>
            <van-button v-else type="danger" style="width: 60vw; margin: 0; padding: 0; height: 100%;" :disabled="true">
                <span class="center van-icon">报名截止</span>
            </van-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {UserModule} from '@/store/modules/user';
    import moment from 'moment';
    import {getActivityDetail, getActivitySurplus, collectActivity, deleteCollectActivity} from '@/api/activity';
    import {wxChatShare} from '@/utils/wxShare';


    import {Image, Dialog, Field, Toast, Cell, CellGroup, Tag, Button, Icon} from 'vant';

    Vue.use(Image).use(Field).use(Toast).use(Cell).use(CellGroup).use(Dialog).use(Tag).use(Button).use(Icon);

    @Component({
        components: {}
    })
    export default class ActivityDetail extends Vue {
        public surplus: number = 0;
        public activityForm: any = {};
        public activityDate: string = '';
        public isCollect: boolean = false;

        public created() {
            this.fetchActivity();
            this.fetchSurplus();
        }

        private fetchActivity() {
            Toast.loading({
                mask: true,
                forbidClick: true,
                message: '加载中...'
            });
            getActivityDetail({id: this.$route.params.id}).then((res: any) => {
                this.activityForm = res.data.data.activityDetail;
                this.isCollect = res.data.data.isCollect;
                document.title = this.activityForm.name;
                this.activityDate = moment(this.activityForm.beginTime).format("MM.DD HH:mm") + ' - ' + moment(this.activityForm.endTime).format("MM.DD HH:mm");
                Toast.clear();
                this.settingShare();
            });
        }

        private settingShare() {
            let tags = '';
            if (this.activityForm.tags) {
                tags = '【' + this.activityForm.tags + '】';
            } else if (this.activityForm.activityName) {
                tags = '【' + this.activityForm.activityName + '】';
            }
            const param = {
                url: window.location.href.split('#')[0], // 当前页面url
                title: this.activityForm.name, // 分享数据配置 主标题
                desc: tags + '我在' + this.activityForm.zoneName + '发现了一个不错的活动，赶紧来看看吧。', // 分享数据配置 副标题
                link: process.env.VUE_APP_URL + '/activity/detail/' + this.activityForm.id + '?zoneId=' + this.activityForm.zoneId, // 分享数据配置
                imgUrl: this.activityForm.image, // 分享数据配置 －－ 全路径
                type: "link", // 分享类型,music、video或link，不填默认为link
                dataUrl: " ", // 如果type是music或video，则要提供数据链接，默认为空
            };
            wxChatShare(param);
        }

        private fetchSurplus() {
            getActivitySurplus({activityId: this.$route.params.id}).then((res: any) => {
                this.surplus = res.data.data;
            });
        }

        private toMap() {
            window.location.href = 'https://m.amap.com/search/mapview/keywords=' + this.activityForm.address;
        }

        private collect() {
            UserModule.SetToUrl(`/activity/detail/${this.$route.params.id}`);
            if (!this.isCollect) {
                collectActivity({
                    productId: this.$route.params.id,
                    type: 2
                }).then(() => {
                    Toast({
                        message: '收藏成功',
                        icon: 'star',
                        duration: 1000
                    });
                });
            } else {
                deleteCollectActivity({
                    productId: this.$route.params.id,
                    type: 2
                });
            }
            this.isCollect = !this.isCollect;
        }

        private chooseTicket() {
            this.$router.push(`/activity/ticket/${this.$route.params.id}`);
        }
    }
</script>

<style>
    .publish-name {
        position: absolute;
        top: 50%;
        transform: translate(15px, -50%);
        font-size: 150%;
    }

    .center {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    img {
        max-width: 100%;
        object-fit: contain;
    }
</style>
