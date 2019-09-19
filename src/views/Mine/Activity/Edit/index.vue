<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-uploader :before-read="beforeRead" :preview-image="true">
        <van-image v-if="activityForm.image" width="100%" height="230" :src="ossImageUrl(activityForm.image)" fit="cover"/>
        <img v-else src="../../../../assets/upload.png"  style="object-fit: cover; width: 100vw; height: 230px;"/>
      </van-uploader>

      <van-cell-group>
        <van-field label="标题" required v-model="activityForm.name" placeholder="请输入标题(不超过35字)" input-align="right" rows="1" type="textarea" autosize/>
        <van-field label="人数" required v-model="activityForm.count" placeholder="请输入人数" input-align="right"/>
        <van-field @click="showBeginTime = true" label="开始时间" required v-model="beginTime" placeholder="请选择开始时间" input-align="right" is-link disabled/>
        <van-field @click="showEndTime = true" label="结束时间" required v-model="endTime" placeholder="请选择结束时间" input-align="right" is-link disabled/>
        <van-field @click="showEnrollBeginTime = true" label="报名开始时间" required v-model="enrollBeginTime" placeholder="请选择报名开始时间" input-align="right" is-link disabled/>
        <van-field @click="showEnrollEndTime = true" label="报名截止时间" required v-model="enrollEndTime" placeholder="请选择报名截止时间" input-align="right" is-link disabled/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="详细地址" required v-model="activityForm.address" placeholder="请输入地址" input-align="right"/>
        <van-field label="活动分类" required v-model="activityForm.activityTypeId" placeholder="请选择活动分类" input-align="right" is-link disabled/>
        <van-field label="标签" required v-model="activityForm.tags" placeholder="请选择标签" input-align="right" is-link disabled/>
        <van-field label="活动详情" required v-model="activityForm.content" placeholder="请输入活动详情" input-align="right" rows="1" type="textarea" autosize/>
      </van-cell-group>

      <div style="margin-top: 10px; text-align: center">
        <span style="color: #999999; font-size: x-small">请选择以下身份创建活动</span>
      </div>

      <van-radio-group v-model="radio" style="padding: 10px 16px;">
        <van-radio name="1" checked-color="#00B261" icon-size="20" style="margin: 0;">
          <van-cell style="width: 80vw; border-radius: 5px">
            <span style="font-weight: bold;">个人预约</span><br>
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

    <van-popup v-model="showBeginTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime" @cancel="showBeginTime = false; beginTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.beginTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showEndTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime" @cancel="showBeginTime = false; endTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.endTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showEnrollBeginTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime" @cancel="showEnrollBeginTime = false; enrollBeginTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.enrollBeginTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>

    <van-popup v-model="showEnrollEndTime" position="bottom">
      <van-datetime-picker cancel-button-text="重置" @confirm="confirmBeginTime" @cancel="showEnrollEndTime = false; enrollEndTime = moment(today).format('YYYY-MM-DD HH:mm:SS');"
        v-model="activityForm.enrollEndTime"
        type="datetime"
        :min-date="today"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from '@/store/modules/user';
import moment from 'moment';
import { getActivityDetail, addActivity } from '@/api/activity';
import { getOrganization } from '@/api/space';

import { Image, Toast, Uploader, CellGroup, Field, Cell, RadioGroup, Radio, Icon, Divider, Button, Popup, DatetimePicker } from 'vant';
Vue.use(Image).use(Toast).use(Uploader).use(CellGroup).use(Field).use(Cell).use(RadioGroup).use(Radio).use(Icon).use(Divider).use(Button).use(Popup).use(DatetimePicker);

@Component({
  components: {}
})
export default class EditActivity extends Vue {
  public activityForm: any = {};
  public orgList: any = [];
  public activityId: any;
  public name: string = this.$store.state.user.name;
  public phone: string = this.$store.state.user.phone;
  public radio: string = '1';
  public showBeginTime: boolean = false;
  public showEndTime: boolean = false;
  public showEnrollBeginTime: boolean = false;
  public showEnrollEndTime: boolean = false;
  public today: Date = new Date();
  public beginTime: string = '';
  public endTime: string = '';
  public enrollBeginTime: string = '';
  public enrollEndTime: string = '';

  public created() {
    this.activityId = this.$route.query.activityId;
    this.fetchOrg();
    if (this.activityId) {
      this.fetchActivity();
    }
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

  private confirmBeginTime(value: any) {
    this.beginTime = moment(value).format('YYYY-MM-DD HH:mm:SS');
    this.activityForm.beginTime = this.beginTime;
    this.showBeginTime = false;
  }

  private toEditTicket() {
    addActivity(this.activityForm);
  }
}
</script>

<style>
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
</style>
