<template>
  <div>
    <van-list v-if="orderList.length !== 0" v-model="loading" :immediate-check="false" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div style="margin-top: -10px;overflow-y: auto; -webkit-overflow-scrolling: touch">
                    <div style="margin-top: 10px">
                        <van-checkbox-group ref="checkbox1" v-model="checked" checked-color="red">
                            <div v-for="(orderForm, index) in orderList" :key="orderForm.id">
                            <van-cell style="padding: 5px 16px; margin-top: 10px">
                                <van-checkbox slot="right-icon" :name="orderForm.id"/>
                                <template slot="title">
                                    <div style="width: 60vw">订单号: {{ orderForm.orderNumber }}</div>
                                </template>
                            </van-cell>
                                <van-card style="background-color: white; margin-top: 1px;">
                                    <div slot="title">
                                        <span style="float: right; width: 100%; font-weight: bold">
                                          {{orderForm.productName}}
                                        </span>
                                    </div>
                                    <div slot="desc">
                                        <div style="float: right; width: 100%; margin-top: 5px;">
                              <span style="color: #969799;">
                                <van-icon name="location-o" style="line-height: inherit; margin-right: 0px;"
                                          color="#00B261"/>
                                {{orderForm.address}}<br>
                                <van-icon name="clock-o" style="line-height: inherit; margin-right: 0px;"
                                          color="#00B261"/>
                                {{orderForm.purchaseBeginTime | dateFmt('YYYY.MM.DD HH:mm')}} -- {{orderForm.purchaseEndTime | dateFmt('YYYY.MM.DD HH:mm')}}
                                  <span style="color: #00B261; font-size: large;float: right;margin-bottom: 1px">
                                  ￥{{orderForm.amount }}<span>元</span>
                                </span>
                              </span>
                                        </div>
                                    </div>
                                </van-card>
                            </div>
                        </van-checkbox-group>
                    </div>
        </div>
        <div style="position: fixed; bottom: 0; height: 50px; background-color: white">
            <van-button type="default" plain hairline style="width: 30vw; margin: 0; padding: 0; height: 100%;"  @click="checkAll()">
                <van-icon name="checked" size="25" class="center"/>
                全选
            </van-button>
            <van-button type="default" plain hairline style="width: 30vw; margin: 0; padding: 0; height: 100%;" @click="toggleAll()">
                <van-icon name="checked" color="#9e9e9e" size="25" class="center"/>
                反选
            </van-button>
            <van-button type="danger" style="width: 40vw; margin: 0; padding: 0; height: 100%;" :disabled="checked.length ==0" @click="showInvoice = true">
                <span class="center van-icon">下一步</span>
            </van-button>
        </div>
        <van-popup v-model="showInvoice" position="bottom" style="max-height: 70%;">
            <div style="padding: 10px 16px;">
                <div style="font-weight: bold;">发票</div>
                <div style="font-size: smaller; margin-top: 20px;">发票类型</div>
                <van-radio-group v-model="invoiceForm.invoiceType" style="width: 100%;">
                    <van-radio name="1" v-if="invoiceList.indexOf('1') !== -1"
                               style="margin-right: 7px; height: 37px; float: left">
                        <template slot="icon">
                            <van-tag v-if="invoiceForm.invoiceType === '1'" color="rgba(193,255,182,.31)"
                                     text-color="#07c160" round size="medium">增值税普通发票（电子）
                            </van-tag>
                            <van-tag v-else color="#f3f3f3" text-color="#999999" round size="medium">增值税普通发票（电子）
                            </van-tag>
                        </template>
                    </van-radio>
                    <van-radio name="2" v-if="invoiceList.indexOf('2') !== -1"
                               style="margin-right: 7px; height: 37px; float: left">
                        <template slot="icon">
                            <van-tag v-if="invoiceForm.invoiceType === '2'" color="rgba(193,255,182,.31)"
                                     text-color="#07c160" round size="medium">增值税普通发票（纸质）
                            </van-tag>
                            <van-tag v-else color="#f3f3f3" text-color="#999999" round size="medium">增值税普通发票（纸质）
                            </van-tag>
                        </template>
                    </van-radio>
                    <van-radio name="3" v-if="invoiceList.indexOf('3') !== -1" style="margin-right: 7px; height: 37px; clear:both;">
                        <template slot="icon">
                            <van-tag v-if="invoiceForm.invoiceType === '3'" color="rgba(193,255,182,.31)"
                                     text-color="#07c160" round size="medium">增值税专用发票（纸质）
                            </van-tag>
                            <van-tag v-else color="#f3f3f3" text-color="#999999" round size="medium">增值税专用发票（纸质）
                            </van-tag>
                        </template>
                    </van-radio>
                </van-radio-group>
                <div style="font-size: x-small; color: #999999; margin-top: 10px; float: right">电子普通发票与纸质普通发票具备同等法律效力，可支持报销入账</div>

                <van-divider style="margin: 10px 0;"/>

                <div style="margin-top: 10px; font-size: smaller;">请选择个人或机构</div>
                <van-radio-group v-model="invoiceForm.type" style="width: 100%;">
                    <van-radio name="1" style="float: left; margin-right: 7px; height: 37px;">
                        <template slot="icon">
                            <van-tag v-if="invoiceForm.type === '1'" color="rgba(193,255,182,.31)" text-color="#07c160" round size="medium">个人</van-tag>
                            <van-tag v-else color="#f3f3f3" text-color="#999999" round size="medium">个人</van-tag>
                        </template>
                    </van-radio>
                    <van-radio name="2"  style="margin-right: 7px; height: 37px;">
                        <template slot="icon">
                            <van-tag v-if="invoiceForm.type === '2'" color="rgba(193,255,182,.31)" text-color="#07c160" round size="medium">单位</van-tag>
                            <van-tag v-else color="#f3f3f3" text-color="#999999" round size="medium">单位</van-tag>
                        </template>
                    </van-radio>
                </van-radio-group>
                <van-cell-group>
                    <van-field v-model="invoiceForm.title" :border="false" style="padding: 0;">
                        <span slot="label" style="font-size: smaller; color: #999999">发票抬头：</span>
                    </van-field>
                </van-cell-group>
                <van-cell-group v-if="invoiceForm.type == '2'" :border="false" style="margin-top: 5px;">
                    <van-field v-model="invoiceForm.invoiceNum" :border="false" style="padding: 0;">
                        <span slot="label" style="font-size: smaller; color: #999999">纳税人识别码：</span>
                    </van-field>
                    <van-cell-group :border="false" v-if="invoiceForm.invoiceType === '3'">
                        <van-divider style="margin: 10px 0;"/>
                        <van-field v-model="invoiceForm.companyPhone" :border="false" style="padding: 0;">
                            <span slot="label" style="font-size: smaller; color: #999999">公司电话：</span>
                        </van-field>
                        <van-field v-model="invoiceForm.companyAddress" :border="false" style="padding: 0;">
                            <span slot="label" style="font-size: smaller; color: #999999">公司地址：</span>
                        </van-field>
                        <van-field v-model="invoiceForm.bankName" :border="false" style="padding: 0;">
                            <span slot="label" style="font-size: smaller; color: #999999">开户银行：</span>
                        </van-field>
                        <van-field v-model="invoiceForm.bankAccount" :border="false" style="padding: 0;">
                            <span slot="label" style="font-size: smaller; color: #999999">银行卡号：</span>
                        </van-field>
                    </van-cell-group>
                </van-cell-group>

                <van-divider style="margin: 10px 0;"/>

                <div style="margin-top: 10px; font-size: smaller;">收票人信息</div>
                <van-cell-group :border="false" style="margin-top: 5px;">
                    <van-field v-model="invoiceForm.phone" :border="false" style="padding: 0;">
                        <span slot="label" style="font-size: smaller; color: #999999">收票人手机：</span>
                    </van-field>
                    <van-field v-model="invoiceForm.email" :border="false" style="padding: 0;">
                        <span slot="label" style="font-size: smaller; color: #999999">收票人邮箱：</span>
                    </van-field>
                    <van-field v-model="invoiceForm.name" v-if="invoiceForm.invoiceType == '2'" :border="false" style="padding: 0;">
                        <span slot="label" style="font-size: smaller; color: #999999">收票人姓名：</span>
                    </van-field>
                    <van-field v-model="invoiceForm.address" v-if="invoiceForm.invoiceType == '2'" :border="false" style="padding: 0;">
                        <span slot="label" style="font-size: smaller; color: #999999">收票人地址：</span>
                    </van-field>
                </van-cell-group>
            </div>

            <div style="text-align: center">
                <van-button @click="addInvoice()" round type="primary" style="margin: 15px 0; width: 90%;">确定</van-button>
            </div>
        </van-popup>

    </van-list>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import OrderCard from '@/components/OrderCard.vue';
import NoData from '@/components/NoData.vue';
import { getOrderList, addInvoice, invoiceList } from '@/api/mine';
import { getZoneDetail } from '@/api/home';
import {List, Tab, Tabs, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Divider, Field, Popup, CellGroup} from 'vant';
Vue.use(List).use(Tab).use(Tabs).use(Checkbox).use(CheckboxGroup).use(RadioGroup).use(Radio).use(Tag).use(Divider).use(Field).use(Popup).use(CellGroup);

@Component({
  components: {
    NoData,
    OrderCard
  }
})
export default class MineOrder extends Vue {
    public orderList: any = [];
    public states: string = '';
    public orderStates: string = '';
    public activeName: string = 'all';
    public total: number = 0;
    public page: number = 1;
    public size: number = Math.ceil(window.screen.availHeight / 100);
    public loading: boolean = false;
    public finished: boolean = false;
    public checked: any = [];
    public invoiceForm: any = {};
    public invoiceList: string = '';
    public invoiceText: string = '请选择发票类型';
    public showInvoice: boolean = false;
    public checkFlag: boolean = true;

    public created() {
        this.fetchOrder();
        this.getInvoice();
    }

    private async fetchOrder(refresh?: boolean) {
        const vm: any = this;
        vm.$toast.loading({
            mask: true,
            forbidClick: true,
            message: "加载中..."
        });
        const res: any = await getOrderList({
            page: this.page,
            size: this.size,
            payStates: '2',
            amount: 0
        });
        this.loading = false;
        this.total = Number(res.data.data.total);
        if (refresh) {
            this.orderList.splice(0, this.total);
        }
        for (const item of res.data.data.rows) {
            this.orderList.push(item);
        }
        if (this.orderList.length < this.size || this.orderList.length === this.total) {
            this.finished = true;
        }
        vm.$toast.clear();
    }

    private onLoad() {
        this.loading = true;
        this.page++;
        this.fetchOrder();
    }

    private getInvoice() {
        getZoneDetail({id: this.$route.params.id}).then((res: any) => {
            this.invoiceList = res.data.data.invoices;
        });
        invoiceList().then((res: any) => {
            this.invoiceForm = res.data.data;
        });
    }

    private checkAll() {
        const check: any = this.$refs.checkbox1;
        check.toggleAll(true);
    }

    private toggleAll() {
        const check: any = this.$refs.checkbox1;
        check.toggleAll();
    }
    @Watch("invoiceForm.invoiceType")
    private onInvoiceTypeChanged(newVal: boolean, oldVal: boolean) {
        switch (this.invoiceForm.invoiceType) {
            case '1':
                this.invoiceText = '电子普通发票';
                break;
            case '2':
                this.invoiceText = '增值税普通发票';
                break;
            case '3':
                this.invoiceText = '增值税专用发票';
                this.invoiceForm.type = '2';
                break;
            default:
                this.invoiceText = '请选择发票类型';
                break;
        }
    }

    @Watch("invoiceForm.type")
    private onTypeChanged(newVal: boolean, oldVal: boolean) {
        switch (this.invoiceForm.type) {
            case '1':
                if (this.invoiceForm.invoiceType === '3') {
                    this.invoiceForm.type = '2';
                }
                break;
            default:
                break;
        }
    }

    private addInvoice() {
        this.invoiceForm.orderId = this.checked.join(',');
        addInvoice(this.invoiceForm).then(() => {
            this.showInvoice = false;
            this.fetchOrder(true);
        });
    }

}
</script>

<style>
    .van-card__content{
        min-height: 0px;
    }
</style>