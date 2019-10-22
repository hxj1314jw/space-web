<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-uploader :before-read="beforeRead" :after-read="afterRead" :preview-image="true">
        <van-image v-if="activityForm.image" width="100%" height="230" :src="ossImageUrl(activityForm.image)" fit="cover"/>
        <img v-else src="../../../../assets/upload.png"  style="object-fit: cover; width: 100vw; height: 230px;"/>
      </van-uploader>

      <van-cell-group>
        <van-field label="标题" required v-model="activityForm.name" placeholder="请输入标题(不超过35字)" input-align="right" rows="1" type="textarea" autosize/>
        <van-field label="人数" type="number" required v-model="activityForm.count" placeholder="请输入人数" input-align="right"/>
        <van-field @click="showBeginTime = true" label="开始时间" required v-model="beginTime" placeholder="请选择开始时间" input-align="right" is-link disabled/>
        <van-field @click="showEndTime = true" label="结束时间" required v-model="endTime" placeholder="请选择结束时间" input-align="right" is-link disabled/>
        <van-field @click="showEnrollBeginTime = true" label="报名开始时间" required v-model="enrollBeginTime" placeholder="请选择报名开始时间" input-align="right" is-link disabled/>
        <van-field @click="showEnrollEndTime = true" label="报名截止时间" required v-model="enrollEndTime" placeholder="请选择报名截止时间" input-align="right" is-link disabled/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="详细地址" required v-model="activityForm.address" placeholder="请输入地址" input-align="right"/>
        <van-field @click="showType = true" label="活动分类" required v-model="activityType" placeholder="请选择活动分类" input-align="right" is-link disabled/>
        <van-field @click="showTags = true" label="标签" required v-model="tagText" placeholder="请选择标签" input-align="right" is-link disabled/>
        <van-field label="活动详情" @click="showContent = true" required is-link readonly/>
        <van-field label="选择订单" @click="showOrder = true" required is-link readonly/>
      </van-cell-group>

      <div style="margin-top: 10px; text-align: center">
        <span style="color: #999999; font-size: x-small">请选择以下身份创建活动</span>
      </div>

      <van-radio-group v-model="radio" style="padding: 10px 16px;">
        <van-radio name="1" checked-color="#00B261" icon-size="20" style="margin: 0;">
          <van-cell style="width: 80vw; border-radius: 5px">
            <span style="font-weight: bold;">个人创建</span><br>
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
                <van-icon slot="icon" name="phone-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
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
      <van-button @click="toEditTicket()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">下一步</span>
      </van-button>
    </div>

    <van-popup v-model="showOrder" position="bottom" style="min-height: 70%; max-height: 100%" :safe-area-inset-bottom="true">
      <div style="padding: 10px 16px;">
        <van-radio-group v-model="orderRadio">
          <template v-for="(order, index) in orderList">
            <van-radio :key="index" :name="order.id" checked-color="#00B261" icon-size="20" style="margin: 0; margin-top: 10px;">
              <div style="background-color: #f3f3f3; padding: 10px 16px; width: 70vw; border-radius: 5px;">
                <span style="font-weight: bold; font-size: small">
                  {{order.productName}}
                </span>
                <div style="color: #969799; font-size: x-small">
                  <van-icon name="location-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
                  {{order.address}}<br>
                  <van-icon name="clock-o" style="line-height: inherit; margin-right: 0px;" color="#00B261"/>
                  {{order.purchaseBeginTime | dateFmt('YYYY.MM.DD')}}<br>
                </div>
              </div>
            </van-radio>
          </template>
        </van-radio-group>
        <div v-if="orderList.length === 0" style="margin-top: 15px;">
          <span style="font-size: x-small; color: #969799;">
            温馨提示 :<br>
            提交活动审核前请确保您至少有一个可使用的活动场地
          </span>
        </div>
        <div v-if="orderList.length === 0" style="text-align: center;">
          <van-button @click="toActivitySpace()" type="primary" style="margin: 15px 0; width: 100%;">立即预约</van-button>
        </div>
      </div>   
    </van-popup>

    <van-popup v-model="showContent" position="bottom" style="min-height: 70%; max-height: 100%" :safe-area-inset-bottom="true">
      <VueQuillEditor @func="getActivityContent" :activityContent="activityForm.content"/>      
    </van-popup>

    <van-popup v-model="showType" position="bottom">
      <van-picker :columns="columns" @change="onChange" />
    </van-popup>

    <van-popup v-model="showBeginTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime" @cancel="showBeginTime = false; beginTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.beginTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showEndTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmEndTime" @cancel="showEndTime = false; endTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.endTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showEnrollBeginTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmEnrollBeginTime" @cancel="showEnrollBeginTime = false; enrollBeginTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.enrollBeginTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showEnrollEndTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmEnrollEndTime" @cancel="showEnrollEndTime = false; enrollEndTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.enrollEndTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showTags" position="bottom" style="min-height: 50%">
      <div style="padding: 10px 16px;">
        <template v-for="(tag, index) in tagList">
          <div :key="index">
            <van-field v-model="tagList[index]" center placeholder="请输入标签">
              <van-button @click="delTag(index)" icon="delete" slot="button" round size="mini" type="danger" />
            </van-field>
          </div>
        </template>
        <div v-if="tagList.length < 5" @click="addTag()" style="text-align: center; margin: 10px 0;">
          <span style="color: #00B261">+新增 </span>
          <span style="color: #999999; font-size: x-small">最多五个</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from '@/store/modules/user';
import moment from 'moment';
import VueQuillEditor from '@/components/VueQuillEditor.vue';
import { getActivityDetail, addActivity, addActivityImage, getActivityTypeList, editActivity } from '@/api/activity';
import { getOrganization } from '@/api/space';
import { getOrderList } from '@/api/mine';

import { Image, Toast, Uploader, CellGroup, Field, Cell, RadioGroup, Radio, Icon, Divider, Button, Popup, DatetimePicker, Picker, Notify } from 'vant';
Vue.use(Image).use(Toast).use(Uploader).use(CellGroup).use(Field).use(Cell).use(RadioGroup).use(Radio).use(Icon).use(Divider).use(Button).use(Popup).use(DatetimePicker).use(Picker).use(Notify);

@Component({
  components: {
    VueQuillEditor
  }
})
export default class EditActivity extends Vue {
  public activityForm: any = {
    image: ''
  };
  public orgList: any = [];
  public typeList: any = [];
  public columns: any = [];
  public orderList: any = [];
  public tagList: any = ['活动', '办公', '聚会'];
  public activityId: any;
  public name: string = this.$store.state.user.name;
  public phone: string = this.$store.state.user.phone;
  public showBeginTime: boolean = false;
  public showEndTime: boolean = false;
  public showEnrollBeginTime: boolean = false;
  public showEnrollEndTime: boolean = false;
  public showType: boolean = false;
  public showTags: boolean = false;
  public showContent: boolean = false;
  public showOrder: boolean = false;
  public today: Date = new Date();
  public radio: string = '1';
  public orderRadio: string = '';
  public tagText: string = this.tagList.join(',');
  public activityType: string = '';
  public beginTime: string = '';
  public endTime: string = '';
  public enrollBeginTime: string = '';
  public enrollEndTime: string = '';

  public created() {
    this.activityId = this.$route.query.activityId;
    this.fetchOrg();
    this.fetchActivityType();
    this.fetchOrder();
    if (this.activityId) {
      this.fetchActivity();
    }
  }

  @Watch("tagList")
  private onTagListChanged(newVal: boolean, oldVal: boolean) {
    this.tagText = this.tagList.join(',');
  }

  private getActivityContent(content: any) {
    this.activityForm.content = content;
    this.showContent = false;
  }

  private addTag() {
    if (this.tagList[this.tagList.length - 1] || this.tagList.length === 0) {
      this.tagList.push('');
    }
  }

  private delTag(index: number) {
    this.tagList.splice(index, 1);
  }

  private fetchActivity() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    getActivityDetail({id: this.$route.query.activityId}).then((res: any) => {
      this.activityForm = res.data.data.activityDetail;
      this.beginTime = this.activityForm.beginTime;
      this.endTime = this.activityForm.endTime;
      this.enrollBeginTime = this.activityForm.enrollBeginTime;
      this.enrollEndTime = this.activityForm.enrollEndTime;
      document.title = this.activityForm.name;
      Toast.clear();
    });
  }

  private async fetchOrder() {
    const res = await getOrderList({page: 1, size: 100, states: '2,3', orderType: '2'});
    this.orderList = res.data.data.rows;
  }

  private async fetchActivityType() {
    const res = await getActivityTypeList();
    this.typeList = res.data.data;
    for (const item of res.data.data) {
      this.columns.push(item.name);
    }
    this.activityType = this.columns[0];
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

  private beforeRead(file: any) {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return true;
    } else {
      return false;
    }
  }

  private async afterRead(file: any) {
    const data = new FormData();
    data.append('file', file.file);
    const res = await addActivityImage(data);
    this.activityForm.image = res.data.data.url;
  }

  private toActivitySpace() {
    this.$router.push({
      path: '/space',
      query: {
        type: '5'
      }
    });
  }

  private onChange(picker: any, value: any, index: any) {
    this.activityType = value;
  }

  private confirmBeginTime(value: any) {
    this.beginTime = moment(value).format('YYYY-MM-DD HH:mm:SS');
    this.activityForm.beginTime = moment(value).valueOf();
    this.showBeginTime = false;
  }

  private confirmEndTime(value: any) {
    this.endTime = moment(value).format('YYYY-MM-DD HH:mm:SS');
    this.activityForm.endTime = moment(value).valueOf();
    this.showEndTime = false;
  }

  private confirmEnrollBeginTime(value: any) {
    this.enrollBeginTime = moment(value).format('YYYY-MM-DD HH:mm:SS');
    this.activityForm.enrollBeginTime = moment(value).valueOf();
    this.showEnrollBeginTime = false;
  }

  private confirmEnrollEndTime(value: any) {
    this.enrollEndTime = moment(value).format('YYYY-MM-DD HH:mm:SS');
    this.activityForm.enrollEndTime = moment(value).valueOf();
    this.showEnrollEndTime = false;
  }

  private toTimeZone() {
    this.activityForm.beginTime = moment(this.beginTime).valueOf();
    this.activityForm.endTime = moment(this.endTime).valueOf();
    this.activityForm.enrollBeginTime = moment(this.enrollBeginTime).valueOf();
    this.activityForm.enrollEndTime = moment(this.enrollEndTime).valueOf();
  }

  private toEditTicket() {
    for (const item of this.typeList) {
      if (item.name === this.activityType) {
        this.activityForm.activityTypeId = item.id;
        break;
      }
    }
    if (this.radio !== '1') {
      this.activityForm.userType = '2';
      this.activityForm.orgId = this.radio;
    } else {
      this.activityForm.userType = '1';
    }
    this.activityForm.addType = 2;
    this.activityForm.publisherName = this.name;
    this.activityForm.publisherPhone = this.phone;
    this.activityForm.orderId = this.orderRadio;
    this.toTimeZone();
    this.activityForm.tags = this.tagText;
    if (this.$route.query.activityId) {
      editActivity(this.activityForm).then((res: any) => {
        if (res.data.code === 500) {
          Notify({ type: 'danger', message: res.data.message });
        } else {
          this.$router.push(`/mine/activity/ticket/edit/${this.$route.query.activityId}`);
        }
      }).catch((err: any) => {
        Notify({ type: 'danger', message: err.response.data.message });
      });
    } else {
      addActivity(this.activityForm).then((res: any) => {
        if (res.data.code === 500) {
          Notify({ type: 'danger', message: res.data.message });
        } else {
          this.$router.push(`/mine/activity/ticket/edit/${res.data.data}`);
        }
      }).catch((err: any) => {
        Notify({ type: 'danger', message: err.response.data.message });
      });
    }
  }
}
</script>

<style>
.van-field__control:disabled {
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
.order-shadow {
  -moz-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border-radius: 4px
}
</style>
