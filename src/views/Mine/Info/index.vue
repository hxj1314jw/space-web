<template>
  <div>
    <van-cell-group>
      <van-cell style="padding: 0px; margin: 0; position: relative;">
        <div style="position: absolute; top: 50%; transform: translate(16px, -50%);">头像</div>
        <van-uploader style="float: right; margin-top: 10px; margin-right: 10px; margin-bottom: 0;" :before-read="beforeRead" :after-read="afterRead" :preview-image="true">
          <van-image round width="3rem" height="3rem" :src="ossImageUrl(userForm.avatar)" fit="cover"/>
        </van-uploader>
      </van-cell>
    </van-cell-group>

    <van-cell-group style="margin-top: 10px;">
      <van-field label="用户名" input-align="right" v-model="userForm.name" placeholder="请输入用户名" />
      <van-cell @click="showSex = true" title="性别" :value="userForm.sex" is-link/>
      <van-cell @click="showBirth = true" title="生日" :value="birthText" is-link/>
    </van-cell-group>

    <van-cell-group style="margin-top: 10px;">
      <van-field label="手机" input-align="right" v-model="userForm.phone" placeholder="请输入手机" disabled/>
      <van-field label="邮箱" input-align="right" v-model="userForm.email" placeholder="请输入邮箱" />
      <van-field label="QQ" input-align="right" v-model="userForm.qqInfo" placeholder="请输入QQ" />
      <van-field label="微信" input-align="right" v-model="userForm.wxInfo" placeholder="请输入微信" />
    </van-cell-group>

    <van-button
      type="primary"
      @click="saveInfo()"
      style="margin: 15px 0; width: 95vw; margin-left: 2.5vw"
    >保存</van-button>

    <van-popup v-model="showSex" position="bottom">
      <van-picker :columns="columns" @change="onChange" />
    </van-popup>

    <van-popup v-model="showBirth" position="bottom">
      <van-datetime-picker
        v-model="birthday"
        @confirm="confirmBirth()"
        @cancel="showBirth = false"
        type="date"
        :max-date="today"
        :min-date="minDate"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { getUserInfo } from '@/api/user';
import { updateAvatar, editUserInfo } from '@/api/mine';
import { UserModule } from '@/store/modules/user';
import moment from 'moment';
import { Cell, CellGroup, Button, Image, Grid, GridItem, Uploader, Field, Picker, Popup, DatetimePicker, Toast } from 'vant';
import { setName } from '../../../utils/auth';
Vue.use(Cell).use(CellGroup).use(Button).use(Image).use(Grid).use(GridItem).use(Uploader).use(Field).use(Picker).use(Popup).use(DatetimePicker).use(Toast);

@Component({
  components: {}
})
export default class MineInfo extends Vue {
  public userForm: any = {};
  public birthText: string = '请选择生日';
  public columns: any = ['保密', '男', '女'];
  public showSex: boolean = false;
  public showBirth: boolean = false;
  public today: Date = new Date();
  public birthday: Date = new Date();
  public minDate: Date = new Date(this.today.getFullYear() - 50, this.today.getMonth(), this.today.getDate());

  public created() {
    this.fetchInfo();
  }

  private async fetchInfo() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: "加载中..."
    });
    const res: any = await getUserInfo();
    this.userForm = res.data.data;
    if (!this.userForm.sex) {
      this.userForm.sex = '保密';
    }
    if (this.userForm.birthday) {
      this.birthText = this.userForm.birthday;
    }
    vm.$toast.clear();
  }

  private onChange(picker: any, value: any, index: any) {
    this.userForm.sex = value;
  }

  private saveInfo() {
    this.userForm.birthday = moment(this.birthday).format('YYYY-MM-DD');
    editUserInfo(this.userForm).then(() => {
      this.fetchInfo().then(() => {
        UserModule.SetUserInfo(this.userForm.name);
        Toast({
          message: '修改成功',
          icon: 'success',
          duration: 1000
        });
      });
    });
  }

  private beforeRead(file: any) {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return true;
    } else {
      return false;
    }
  }

  private confirmBirth() {
    this.birthText = moment(this.birthday).format('YYYY-MM-DD');
    this.showBirth = false;
  }

  private async afterRead(file: any) {
    const data = new FormData();
    data.append('file', file.file);
    const res = await updateAvatar(data);
    const url = res.data.data.url;
    await editUserInfo({
      avatar: url,
      id: this.userForm.id
    });
    this.fetchInfo();
  }
}
</script>
