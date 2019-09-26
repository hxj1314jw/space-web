<template>
  <div>
    <van-nav-bar v-if="!isWeixin" @click-left="onClickLeft" :left-arrow="true" title="登陆"
      style="font-weight: 700; background-color: #F3F3F3; width: 100vw; position: fixed; top: 0;"/>

    <div class="login-form" :style="isWeixin ? 'top: 0;' : 'top: 46px;'">
      <div style="margin: 20px; font-size: x-large">登陆 / 注册</div>
      <van-cell-group>
        <van-field
          v-model="phone"
          required
          clearable
          label="手机"
          placeholder="请输入手机号"
          type="tel"
          :error-message="phoneErrMsg"
        />
        <van-field v-model="code" label="验证码" placeholder="请输入验证码" required autocomplete :error-message="codeErrMsg" type="number" maxlength="6">
          <van-button slot="button" plain size="small" type="primary" :disabled="disabled" @click="getCode()">
            发送验证码 <span v-if="disabled === true">({{second}}s)</span>
          </van-button>
        </van-field>
      </van-cell-group>

      <van-button type="primary" style="margin-left: 2.5vw; width: 95vw; margin-top: 15px;" @click.prevent="login()">登陆</van-button>

      <div style="margin-top: 10px; text-align: center">
        <span style="color: #969799; font-size: small">
          继续表示您同意
          <a href="#">《用户注册协议》</a>
        </span>
      </div>
    </div>

    <div style="width: 100%; text-align: center; position: absolute; bottom: 0;">
      <img width="80px" height="30px" style="margin-bottom: 20px;" src="../../assets/youkong_logo.png" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserModule } from '@/store/modules/user';
import { getLoginCode } from '@/api/user';
import { NavBar, Button, CellGroup, Field, Notify, Cell } from 'vant';
import { getToUrl } from '../../utils/url';
Vue.use(NavBar).use(Button).use(CellGroup).use(Field).use(Notify).use(Cell);

@Component({
  components: {}
})
export default class Login extends Vue {
  public phone: string = "";
  public code: string = "";
  public phoneErrMsg: string = "";
  public codeErrMsg: string = "";
  public isValid: boolean = false;
  public disabled: boolean = false;
  public second: number = 60;

  get isWeixin(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') !== -1) {
      return true;
    } else {
      return false;
    }
  }

  @Watch("phone")
  private onPhoneChanged(newVal: boolean, oldVal: boolean) {
    this.onPhoneFocusOut();
    this.validate();
  }

  @Watch("code")
  private onCodeChanged(newVal: boolean, oldVal: boolean) {
    this.onCodeFocusOut();
    this.validate();
  }

  private onClickLeft() {
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
      if (history.length > 0) {
        window.history.go(-1);
      } else {
        window.location.href = "/";
      }
    } else {
      if (navigator.userAgent.indexOf('Firefox') >= 0 ||
        navigator.userAgent.indexOf('Opera') >= 0 ||
        navigator.userAgent.indexOf('Safari') >= 0 ||
        navigator.userAgent.indexOf('Chrome') >= 0 ||
        navigator.userAgent.indexOf('WebKit') >= 0) {
        if (window.history.length > 1) {
          window.history.go(-1);
        } else {
          window.location.href = "/";
        }
      } else {
        window.history.go(-1);
      }
    }
  }

  private onPhoneFocusOut() {
    if (!this.phone) {
      this.phoneErrMsg = "请输入手机号";
      return false;
    } else {
      if (this.phone.length !== 11) {
        this.phoneErrMsg = "手机号格式错误";
        return false;
      } else {
        this.phoneErrMsg = "";
        return true;
      }
    }
  }

  private onCodeFocusOut() {
    if (!this.code) {
      this.codeErrMsg = "请输入验证码";
      return false;
    } else {
      this.codeErrMsg = "";
      return true;
    }
  }

  private validate() {
    if (this.onPhoneFocusOut() && this.onCodeFocusOut) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  private getCode() {
    if (this.onPhoneFocusOut()) {
      this.disabled = true;
      getLoginCode({phone: this.phone});
      this.countDown();
    }
  }

  private countDown() {
    const vm: any = this;
    const tim = setInterval(() => {
      vm.second--;
      if (vm.second === 0) {
        clearInterval(tim);
        this.disabled = false;
      }
    }, 1000);
  }

  private login() {
    if (this.isValid && this.onPhoneFocusOut() && this.onCodeFocusOut()) {
      const vm: any = this;
      UserModule.Login({
        phone: this.phone,
        code: this.code,
        openId: localStorage.openId
      }).then((res: any) => {
        // Notify({
        //   message: '登陆成功',
        //   background: '#07c160'
        // });
        this.$router.push(getToUrl());
      }, (err: any) => {
        Notify({
          message: '验证码错误'
        });
      });
    } else {
      this.onPhoneFocusOut();
      this.onCodeFocusOut();
    }
  }
}
</script>

<style>
  .login-form {
    position: absolute;
    background-color: #F3F3F3;
  }
  .van-nav-bar .van-icon{
    color: #23B36E;
    vertical-align: middle;
  }
</style>
