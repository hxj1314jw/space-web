<template>
  <div>
    <div style="margin-top: -10px; padding-bottom: 30px;">
      <OrderCard :orderForm="orderForm"/>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="账单分期" @click="showList = true" is-link>
          第{{ finishedNum }}期 / 共{{ subOrderList.length }}期
        </van-cell>
        <van-cell v-if="isAble" title="发票" :value="invoiceText" is-link @click="showInvoice = true"/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="单价" :value="'￥' + orderForm.price" />
        <van-cell title="数量" :value="'x ' + orderForm.useNum" />
        <van-cell title="起租日期" :value="orderForm.purchaseBeginTime | dateFmt('YYYY-MM-DD HH:mm')" />
        <van-cell title="起租时长">
          <span>{{orderForm.rentNum}}</span>
          <span v-if="orderForm.chargeMethod === '1'">小时</span>
          <span v-if="orderForm.chargeMethod === '2'">日</span>
          <span v-if="orderForm.chargeMethod === '3'">月</span>
          <span v-if="orderForm.chargeMethod === '4'">年</span>
        </van-cell>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="计划支付时间" :value="orderForm.planDate | dateFmt('YYYY-MM-DD')" />
        <van-cell title="费用合计" :value="'￥' + orderForm.purchaseAmount" />
        <van-cell title="实收金额">
          <span style="color: #F76C6C">￥{{ orderForm.amountReceived }}</span>
        </van-cell>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-cell title="联系人" :value="orderForm.consumerName" />
        <van-cell title="联系方式" :value="orderForm.consumerPhone" />
      </van-cell-group>

      <van-cell-group v-if="agreement == 1" style="margin-top: 10px;">
        <van-cell title="协议" is-link :url="contactInfo"/>
        <van-field
          v-if="orderForm.orderStates === '1'"
          v-model="buyerInfo"
          type="text"
          label="乙方信息"
          placeholder="请输入乙方信息"
          input-align="right"
          required
        />
      </van-cell-group>

      <van-radio-group v-model="orderForm.payType" style="margin-top: 10px;" checked-color="#07c160">
        <van-cell-group>
          <van-cell title="在线支付" clickable @click="orderForm.payType = '1'">
            <van-radio slot="right-icon" name="1" />
          </van-cell>
          <van-cell title="线下支付" clickable @click="orderForm.payType = '2'">
            <van-radio slot="right-icon" name="2" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <div style="padding: 10px 16px; text-align: center">
        <span style="font-size: x-small; color: #969799;">
          下单时间：{{ orderForm.createDate }}
        </span>
      </div>

      <p v-if="isAble" style="width: 100vw; height: 50px; margin: 0;"></p>
    </div>

    <div v-if="isAble" style="position: fixed; bottom: 0; height: 50px;">
      <!-- <template>
        <van-button @click="cancelOrder()" type="default" plain hairline style="width: 40vw; margin: 0; padding: 0; height: 100%;">
          <span class="center van-icon">取消订单</span>
        </van-button>
        <van-button @click="payOrder()" :loading="loading" loading-text="支付中..."  type="primary" style="width: 60vw; margin: 0; padding: 0; height: 100%;">
          <span class="center van-icon">立即支付</span>
        </van-button>
      </template> -->
      <template>
        <van-button @click="payOrder()" :loading="loading" loading-text="支付中..."  type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
          <span class="center van-icon">立即支付</span>
        </van-button>
      </template>
    </div>

    <van-popup v-model="showList" position="bottom" style="max-height: 70%">
      <van-list>
        <template v-for="(order, index) in subOrderList">
          <van-cell :title="'第' + order.num + '期' + ' / ' + '共' + subOrderList.length + '期'" :key="index">
            <span v-if="order.states === '1'" style="color: #F76C6C">待支付</span>
            <span v-if="order.states === '2'" style="color: #23B36E;">已支付</span>
            <span v-if="order.states === '4'">已取消</span>
            <span v-if="order.states === '6'" style="color: #F76C6C">已过期</span>
          </van-cell>
        </template>
      </van-list>
    </van-popup>

    <van-popup v-model="showInvoice" position="bottom" style="max-height: 70%;">
      <div style="padding: 10px 16px;">
        <div style="font-weight: bold;">发票</div>
        <div style="font-size: smaller; margin-top: 20px;">发票类型</div>
        <van-radio-group v-model="invoiceForm.invoiceType" style="width: 100%;">
          <van-radio name="1" style="float: left; margin-right: 7px; height: 37px;" v-if="invoiceList.indexOf('1') >= 0">
            <template slot="icon">
              <van-tag v-if="invoiceForm.invoiceType === '1'" color="rgba(193,255,182,.31)" text-color="#07c160" round size="medium">电子普通发票</van-tag>
              <van-tag v-else round color="#f3f3f3" text-color="#999999" size="medium">电子普通发票</van-tag>
            </template>
          </van-radio>
          <van-radio name="2"  style="float: left; margin-right: 7px; height: 37px;" v-if="invoiceList.indexOf('2') >= 0">
            <template slot="icon">
              <van-tag v-if="invoiceForm.invoiceType === '2'" color="rgba(193,255,182,.31)" text-color="#07c160" round size="medium">增值税普通发票</van-tag>
              <van-tag v-else round color="#f3f3f3" text-color="#999999" size="medium">增值税普通发票</van-tag>
            </template>
          </van-radio>
          <van-radio name="3"  style="margin-right: 7px; height: 37px;" v-if="invoiceList.indexOf('3') >= 0">
            <template slot="icon">
              <van-tag v-if="invoiceForm.invoiceType === '3'" color="rgba(193,255,182,.31)" text-color="#07c160" round size="medium">增值税专用发票</van-tag>
              <van-tag v-else color="#f3f3f3" text-color="#999999" round size="medium">增值税专用发票</van-tag>
            </template>
          </van-radio>
        </van-radio-group>
        <div style="font-size: x-small; color: #999999; margin-top: 5px;">电子普通发票与纸质普通发票具备同等法律效力，可支持报销入账</div>

        <van-divider style="margin: 10px 0;"/>

        <div style="margin-top: 10px; font-size: smaller;">发票类型</div>
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
        <van-cell-group v-if="invoiceForm.type == '2'" :border="false" style="margin-top: 5px;">
          <van-field v-model="invoiceForm.title" :border="false" style="padding: 0;">
            <span slot="label" style="font-size: smaller; color: #999999">单位名称：</span>
          </van-field>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { getSubOrderList, cancelSubOrder, addInvoice, getOrderContact, orderSubPayEdit } from '@/api/mine';
import { getZoneDetail } from '@/api/home';
import OrderCard from '@/components/OrderCard.vue';

import { Toast, Cell, CellGroup, Button, List, Popup, Dialog, RadioGroup, Radio, Tag, Divider, Field } from 'vant';
Vue.use(Toast).use(Cell).use(CellGroup).use(Button).use(List).use(Popup).use(Dialog).use(RadioGroup).use(Radio).use(Tag).use(Divider).use(Field);

@Component({
  components: {
    OrderCard
  }
})
export default class SubOrderDetail extends Vue {
  @Prop() public isAble: any;
  public subOrderList: any = [];
  public orderForm: any = {};
  public invoiceForm: any = {
    invoiceType: '',
    type: '',
    address: '',
    bankAccount: '',
    bankName: '',
    companyAddress: '',
    companyPhone: '',
    email: '',
    invoiceNum: '',
    name: '',
    orderId: '',
    phone: '',
    title: ''
  };
  public invoiceList: string = '';
  public invoiceText: string = '请选择发票类型';
  public buyerInfo: string = this.$store.state.user.name;
  public finishedNum: number = 1;
  public showList: boolean = false;
  public showInvoice: boolean = false;
  public loading: boolean = false;
  public agreement: any = 0;
  public contactInfo: string = '';

  public created() {
    this.invoiceForm.orderId = this.$route.params.id;
    this.fetchSubOrder();
    this.getOrderContact();
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

  private getOrderContact() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: "加载中..."
    });
    getOrderContact({orderId: vm.invoiceForm.orderId, secondParty: vm.$store.state.user.name}).then((res: any) => {
      vm.contactInfo = res.data.data;
      vm.getInvoice();
      vm.$toast.clear();
    });
  }

  private getInvoice() {
    getZoneDetail({id: this.$route.params.id}).then((res: any) => {
      this.invoiceList = res.data.data.invoices;
      this.agreement = res.data.data.agreement;
      // this.invoiceList = '1,2'
    });
  }


  private async fetchSubOrder() {
    this.finishedNum = 1;
    const res = await getSubOrderList({
      orderId: this.$route.params.id,
      orderType: 1
    });
    this.subOrderList = res.data.data.rows;
    let unPaidNum: number = res.data.data.total - 1;
    this.subOrderList.forEach((item: any, index: number) => {
      if (item.updateDate) {
        this.finishedNum++;
      } else {
        unPaidNum = index;
      }
    });
    if (this.finishedNum > res.data.data.total) {
      this.finishedNum = res.data.data.total;
    }
    this.orderForm = this.subOrderList[unPaidNum];
  }

  private addInvoice() {
    addInvoice(this.invoiceForm).then(() => {
      this.showInvoice = false;
    });
  }

  private cancelOrder() {
    Dialog.confirm({
      message: '订单取消后将不可恢复，确认吗？',
      confirmButtonColor: '#00B261'
    }).then(() => {
      cancelSubOrder({
        orderId: this.orderForm.id
      }).then(() => {
        this.fetchSubOrder();
      });
    }).catch(() => {
      // on cancel
    });
  }

  private payOrder() {
    this.loading = true;
    if (this.orderForm.payType === '1') {
      const zoneId: any = this.$route.query.zoneId;
      const callback = encodeURIComponent(process.env.VUE_APP_URL + '/mine/order/success');
      window.location.href = process.env.VUE_APP_WX_PAY + `?callbackUrl=${callback}&orderId=${this.orderForm.id}&payType=1&zoneId=${zoneId}`;
    } else {
      orderSubPayEdit({orderId: this.$route.params.id}).then(() => {
        this.isAble = false;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    }

  }
}
</script>

<style>
.van-tag--round {
  padding: 5px 10px;
}
</style>
