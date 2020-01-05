<template>
    <div>
        <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch;">
            <div style="padding: 10px 16px;">
                <van-steps :active="1" style="background-color: #F3F3F3">
                    <van-step>选择空间</van-step>
                    <van-step>填写订单</van-step>
                    <van-step>交易完成</van-step>
                </van-steps>
            </div>
            <template v-if="productInfo.type ==='2' || productInfo.type ==='4'|| productInfo.type ==='5' ">
                <div style="display: flex; justify-content: flex-end">
                    <van-tag type="success">可预定</van-tag>
                    <van-tag>已预定</van-tag>
                </div>
                <van-tabs v-model="queryDate" @click="onClick" color="#1ab84d">
                    <van-tab v-for="(item,index) in timeSec" :key="index" :title="item.day" :name="item.date">
                        <van-row v-if="intervalList && intervalList.length > 0" gutter="15" style="margin: 30px 16px">
                            <van-col v-for="(item,index)  in intervalList" :key="index" span="8">
                                <div class="time" :class="{time_disabled: item.type === '1'}">
                                    {{item.beginHour}}-{{item.endHour}}
                                </div>
                            </van-col>
                        </van-row>
                        <van-row v-else style="margin: 30px 16px; text-align: center; color: #333333; font-size: 14px;">
                            {{item.day}}全时段可预定
                        </van-row>
                    </van-tab>
                </van-tabs>
            </template>
            <van-cell-group>
                <van-cell>
                    <template slot="title">
                        <span>价格</span>
                    </template>
                    <template>
                        <span style="color: #00B261; font-size: larger;">￥{{price}}/{{charge}}</span>
                    </template>
                </van-cell>
                <van-field v-if="productInfo.timeType === '0'" label="起租时间" @click="showBeginTime = true"
                           :value="beginTime | dateFmt('YYYY-MM-DD HH:mm')" :is-link="true" disabled="true"
                           input-align="right" error-message-align="right" :error-message="beginTimeErrMsg"/>
                <van-cell v-if="productInfo.timeType === '0'">
                    <span slot="title">租用时长（{{charge}}）</span>
                    <van-stepper v-model="rentNum" min="1" integer @change="countNum()"/>
                </van-cell>
                <van-radio-group v-else v-model="radioTime">
                    <van-cell-group>
                        <van-cell v-for="(item,index) in productInfo.timeSection" :key=index
                                  :title="`${item.begin}-${item.end}`" clickable
                                  @click="selectRadio(item,index)">
                            <van-radio slot="right-icon" :name="index" checked-color="#07c160"/>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
                <van-cell>
                    <template slot="title">
                        <span>剩余数量</span>
                    </template>
                    <template>
                        <span>{{surplusNum}}</span>个可预订
                    </template>
                </van-cell>
                <van-cell v-if="this.productInfo.counts >1">
                    <template slot="title">
                        <span>数量</span>
                    </template>
                    <template>
                        <van-stepper v-model="useNum" min="1" integer/>
                    </template>
                </van-cell>
            </van-cell-group>

            <div style="margin-top: 10px; text-align: center">
                <span style="color: #999999; font-size: x-small">请选择以下身份进行预定</span>
            </div>

            <van-radio-group v-model="radio" style="padding: 10px 16px;">
                <van-radio name="1" checked-color="#00B261" icon-size="20" style="margin: 0;">
                    <van-cell style="width: 80vw; border-radius: 5px">
                        <span style="font-weight: bold;">个人</span><br>
                        <span style="color: #999999; font-size: smaller;">
                <van-icon slot="icon" name="user-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                姓名：{{ name }}
              </span><br>
                        <span style="color: #999999; font-size: smaller;">
                <van-icon slot="icon" name="phone-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                手机：{{ phone }}
              </span><br>
                        <van-divider dashed :hairline="false" style="margin: 3px;"/>
                        <span style="color: #999999; font-size: x-small;">备注：无</span>
                    </van-cell>
                    <div style="float: left; left: -10px;" class="ticket-circle"/>
                    <div style="float: right; right: -10px;" class="ticket-circle"/>
                </van-radio>

                <template v-for="(org, index) in orgList">
                    <van-radio :key="index" :name="org.id" checked-color="#00B261" icon-size="20" style="margin: 0;">
                        <van-cell style="width: 80vw; border-radius: 5px">
                            <span style="font-weight: bold;">机构 | {{ org.name }}</span><br>
                            <span style="color: #999999; font-size: smaller;">
                  <van-icon slot="icon" name="user-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
                  类型：{{ org.institutionType }}
                </span><br>
                            <span style="color: #999999; font-size: smaller;">
                  <van-icon slot="icon" name="phone-o" style="line-height: inherit; margin-right: 3px;"
                            color="#00B261"/>
                  手机：{{ org.companyPhone }}
                </span><br>
                            <van-divider dashed :hairline="false" style="margin: 3px;"/>
                            <span style="color: #999999; font-size: x-small;">备注：{{ org.institutionDescribe || '无' }}</span>
                        </van-cell>
                        <div style="float: left; left: -10px;" class="ticket-circle"/>
                        <div style="float: right; right: -10px;" class="ticket-circle"/>
                    </van-radio>
                </template>
            </van-radio-group>
        </div>

        <div style="position: fixed; bottom: 0; height: 50px;">
            <van-button @click="reserve()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
                <span class="center van-icon">立即下单</span>
            </van-button>
        </div>

        <van-popup v-model="showBeginTime" position="bottom">
            <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime"
                                 @cancel="showBeginTime = false; beginTime = today;"
                                 v-model="beginTime"
                                 type="datetime"
                                 :min-date="today"
                                 :filter="filter"
            />
        </van-popup>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from "vue-property-decorator";
    import {getOrganization, getProductInfo} from '@/api/space';
    import {addOrder, getNextSevenData, getInterval, surplus} from '@/api/mine';
    import {initChargeMethod} from '../../../../utils/zone';

    import {
        Step,
        Steps,
        Cell,
        CellGroup,
        Field,
        RadioGroup,
        Radio,
        Icon,
        Divider,
        Button,
        Popup,
        DatetimePicker,
        Toast,
        Notify,
        Stepper,
        Tab, Tabs, Tag, List, Row, Col
    } from 'vant';
    import moment from "moment";

    Vue.use(Step).use(Steps).use(Cell).use(CellGroup).use(RadioGroup).use(Radio).use(Icon)
        .use(Divider).use(Button).use(Popup).use(DatetimePicker).use(Field).use(Toast)
        .use(Notify).use(Stepper).use(Tab).use(Tabs).use(Tag).use(List).use(Row).use(Col);

    @Component({
        components: {}
    })
    export default class StationSpaceOrder extends Vue {
        public orgList: any = [];
        public radio: string = '1';
        public beginTimeErrMsg: string = '';
        public useNum: number = 1;
        public rentNum: number = 1;
        public name: string = this.$store.state.user.name;
        public phone: string = this.$store.state.user.phone;
        public showBeginTime: boolean = false;
        public isValid: boolean = false;
        public today: Date = new Date();
        public beginTime: Date = new Date();
        public timeSec: any = [];
        public intervalList: any = [];
        public loading: boolean = false;
        public finished: boolean = false;
        public queryDate: string = '';
        public productInfo: any = {};
        public selectTime: any = {};
        public radioTime: number = 0;
        public charge: string = '';
        public startDate: number = 0;
        public surplusNum: number = 0;
        public price: number = 0;

        public created() {
            const date = moment(moment(new Date()).format('YYYY-MM-DD HH')).add(1, "hours").toDate();
            this.today = date;
            this.beginTime = date;
            this.getProductInfo();
            this.fetchOrg();

        }

        private filter(type: any, options: any) {
            if (type === 'minute') {
                return options.filter((option: number) => option % 60 === 0);
            }
            return options;
        }

        private getProductInfo() {
            getProductInfo({id: this.$route.params.id}).then((res: any) => {
                this.productInfo = res.data.data;
                this.getCharge();
                this.price = this.productInfo.price;
                if (this.productInfo.priceStates === '1') {
                    this.price = this.productInfo.activityPrice;
                }
                if (this.productInfo.timeSection) {
                    this.selectTime = this.productInfo.timeSection[0];
                    this.price = this.productInfo.timeSection[0].price;
                }
                this.timeSection();
            });
        }

        private getCharge() {
            const chargeMethod = this.productInfo.chargeMethod;
            this.charge = initChargeMethod(chargeMethod);
        }

        @Watch("beginTime")
        private onBeginTimeChanged(newVal: boolean, oldVal: boolean) {
            this.onBeginTimeFocusOut();
        }

        private onBeginTimeFocusOut() {
            const beginTime: number = this.productInfo.timeType === '0' ? this.beginTime.getTime() : moment(`${this.queryDate} ${this.selectTime.begin}`).unix() * 1000;
            if (beginTime <= new Date().getTime()) {
                this.beginTimeErrMsg = "起租时间不能早于或等于当前时间";
                this.$notify({type: 'danger', message: '起租时间不能早于或等于当前时间'});
                return false;
            } else {
                this.beginTimeErrMsg = "";
                return true;
            }

        }

        private selectRadio(item: any, index: number) {
            this.radioTime = index;
            this.selectTime = item;
            if (item.price) {
                this.price = item.price;
            } else {
                this.price = this.productInfo.price;
            }
            this.countNum();

        }

        private validate() {
            if (this.onBeginTimeFocusOut()) {
                this.isValid = true;
            } else {
                this.isValid = false;
            }
        }

        private async fetchOrg() {
            Toast.loading({
                mask: true,
                forbidClick: true,
                message: '加载中...'
            });
            const res = await getOrganization({
                audit: 2
            });
            this.orgList = res.data.data;
            Toast.clear();
        }

        private async reserve() {
            await this.validate();
            if (this.isValid && this.radio) {
                if (this.name === 'null' || !this.name) {
                    Notify({
                        message: '请先完善个人信息',
                        duration: 2500,
                        background: '#F76C6C'
                    });
                } else {
                    if (this.radio === '1') {
                        addOrder({
                            consumerName: this.name,
                            consumerPhone: this.phone,
                            productType: this.$route.query.type,
                            purchaseMethod: '1',
                            timePrice: this.price,
                            rentNum: this.productInfo.timeType === '0' ? this.rentNum : moment.duration(moment(`${this.queryDate} ${this.selectTime.end}`).diff(moment(`${this.queryDate} ${this.selectTime.begin}`))).hours(),
                            startDate: this.productInfo.timeType === '0' ? this.beginTime.getTime() : moment(`${this.queryDate} ${this.selectTime.begin}`).unix() * 1000,
                            useNum: this.useNum,
                            zoneProductId: this.$route.params.id
                        }).then((res: any) => {
                            this.$router.push({
                                path: `/mine/order/detail/${res.data.data}`,
                                query: {
                                    status: '0'
                                }
                            });
                        });
                    } else {

                        addOrder({
                            orgId: this.radio,
                            productType: this.$route.query.type,
                            purchaseMethod: '2',
                            rentNum: this.productInfo.timeType === '0' ? this.rentNum : moment.duration(moment(`${this.queryDate} ${this.selectTime.end}`).diff(moment(`${this.queryDate} ${this.selectTime.begin}`))).hours(),
                            startDate: this.productInfo.timeType === '0' ? this.beginTime.getTime() : moment(`${this.queryDate} ${this.selectTime.begin}`).unix() * 1000,
                            useNum: this.useNum,
                            timePrice: this.price,
                            zoneProductId: this.$route.params.id
                        }).then((res: any) => {
                            this.$router.push({
                                path: `/mine/order/detail/${res.data.data}`,
                                query: {
                                    status: '0'
                                }
                            });
                        });
                    }
                }
            } else {
                this.onBeginTimeFocusOut();
            }
        }

        /**
         * 剩余数量
         */
        private getSurplus() {
            surplus({
                startDate: this.startDate,
                rentNum: this.rentNum,
                zoneProductId: this.productInfo.id
            }).then((res: any) => {
                console.log(res.data.data);
                this.surplusNum = res.data.data;
            });
        }

        private countNum() {
            this.rentNum = this.productInfo.timeType === '0' ? this.rentNum : moment.duration(moment(`${this.queryDate} ${this.selectTime.end}`).diff(moment(`${this.queryDate} ${this.selectTime.begin}`))).hours();
            this.startDate = this.productInfo.timeType === '0' ? this.beginTime.getTime() : moment(`${this.queryDate} ${this.selectTime.begin}`).unix() * 1000;
            this.getSurplus();
        }

        private onLoad() {
            this.loading = true;
            this.interval("");
        }

        private confirmBeginTime(value: any) {
            this.beginTime = value;
            this.countNum();
            this.showBeginTime = false;
        }

        private async timeSection() {
            const res = await getNextSevenData();
            this.timeSec = res.data.data;
            this.interval(this.timeSec[0].date);
        }

        private async interval(value: any) {
            this.queryDate = value;
            const res = await getInterval({
                id: this.$route.params.id,
                type: this.$route.query.type,
                date: value
            });
            this.intervalList = res.data.data;
            this.countNum();
        }

        private onClick() {
            this.interval(this.queryDate);
        }
    }
</script>

<style>
    .van-step--horizontal .van-step__circle-container {
        background-color: #F3F3F3;
    }

    .van-field--disabled .van-field__control {
        color: rgb(70, 70, 70);
    }

    .ticket-circle {
        width: 20px;
        height: 20px;
        background-color: #F3F3F3;
        border-radius: 50%;
        position: relative;
        bottom: 47px;
    }

    .time {
        background-color: #1ab84d;
        color: white;
        text-align: center;
        padding: 1px 3px;
        margin-bottom: 5px;
        border-radius: 4px;
    }

    .time_disabled {
        background-color: #969799;
    }

</style>
