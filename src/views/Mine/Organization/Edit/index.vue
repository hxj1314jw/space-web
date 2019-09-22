<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-cell-group>
        <van-cell style="padding: 0px; margin: 0; position: relative;">
          <div style="position: absolute; top: 50%; transform: translate(16px, -50%);">机构Logo</div>
          <van-uploader style="float: right; margin-top: 10px; margin-right: 10px; margin-bottom: 0;" :before-read="beforeRead" :after-read="logoAfterRead" :preview-image="true">
            <van-image round width="3rem" height="3rem" :src="ossImageUrl(orgForm.institutionLogo)" fit="cover"/>
          </van-uploader>
        </van-cell>
        <van-field label="机构名称" v-model="orgForm.name" placeholder="请输入机构名称" input-align="right" required/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="负责人姓名" v-model="orgForm.principal" placeholder="请输入负责人姓名" input-align="right" required/>
        <van-field label="负责人电话" v-model="orgForm.companyPhone" placeholder="请输入负责人电话" input-align="right" required/>
        <!-- <van-field label="联系人姓名" v-model="orgForm.name" placeholder="请输入联系人姓名" input-align="right"/>
        <van-field label="联系人电话" v-model="orgForm.name" placeholder="请输入联系人电话" input-align="right"/> -->
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="省份" v-model="orgForm.provinces" placeholder="请输入省份" input-align="right" required/>
        <van-field label="详细地址" v-model="orgForm.address" placeholder="请输入详细地址" input-align="right" required/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
         <van-cell @click="showType = true" title="机构性质" :value="orgForm.institutionType" is-link/>
        <van-field label="服务领域" v-model="orgForm.serviceTerritory" placeholder="请输入服务领域" input-align="right"/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="官方网站" v-model="orgForm.institutionWeb" placeholder="请输入官方网站" input-align="right"/>
        <!-- <van-field label="官方微信" v-model="orgForm.institutionsWechat" placeholder="请输入官方微信" input-align="right"/> -->
        <!-- <van-field label="机构简介" v-model="orgForm.name" placeholder="请输入机构简介" input-align="right" type="textarea" rows="2" autosize/> -->
        <!-- <van-field label="支付宝二维码" v-model="orgForm.name" placeholder="请上传支付宝收款二维码" input-align="right"/> -->
        <van-cell style="padding: 0px; margin: 0; position: relative;">
          <div style="position: absolute; top: 50%; transform: translate(16px, -50%);">微信二维码</div>
          <van-uploader style="float: right; margin-top: 10px; margin-right: 10px; margin-bottom: 0;" :before-read="beforeRead" :after-read="wxAfterRead" :preview-image="true">
            <van-image width="3rem" height="3rem" :src="ossImageUrl(orgForm.institutionsWechat)" fit="cover"/>
          </van-uploader>
        </van-cell>
      </van-cell-group>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="saveOrgInfo()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">保存</span>
      </van-button>
    </div>

    <van-popup v-model="showType" position="bottom">
      <van-picker show-toolbar :columns="instiutionList" @confirm="onConfirm" @cancel="showType = false;"/>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import OrgCard from '@/components/OrgCard.vue';
import NoData from '@/components/NoData.vue';
import { getOrgInfo, uploadPicture, editOrgInfo, addOrg } from '@/api/organization';
import { Button, Icon, Field, CellGroup, Cell, Image, Uploader, Toast, Picker, Popup, Notify } from 'vant';
Vue.use(Button).use(Field).use(CellGroup).use(Cell).use(Image).use(Uploader).use(Toast).use(Picker).use(Popup).use(Notify);

@Component({
  components: {}
})

export default class EditOrg extends Vue {
  public orgForm: any = {
    institutionLogo: '',
    institutionsWechat: '',
    institutionType: '请选择服务领域'
  };
  public instiutionList: any = ['党政机关', '群团组织', '社会组织/社团', '基金会', '高校', '企业'];
  public orgId: any;
  public showType: boolean = false;

  public created() {
    this.orgId = this.$route.query.orgId;
    if (this.orgId) {
      this.fetchOrg();
    }
  }

  private async fetchOrg() {
    const vm: any = this;
    vm.$toast.loading({
      mask: true,
      forbidClick: true,
      message: '加载中...'
    });
    const res = await getOrgInfo({id: this.orgId});
    this.orgForm = res.data.data.org;
    vm.$toast.clear();
  }

  private onConfirm(value: any) {
    this.orgForm.institutionType = value;
    this.showType = false;
  }

  private beforeRead(file: any) {
    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      return true;
    } else {
      return false;
    }
  }

  private async logoAfterRead(file: any) {
    const data = new FormData();
    data.append('file', file.file);
    const res = await uploadPicture(data);
    this.orgForm.institutionLogo = res.data.data.url;
  }

  private async wxAfterRead(file: any) {
    const data = new FormData();
    data.append('file', file.file);
    const res = await uploadPicture(data);
    this.orgForm.institutionsWechat = res.data.data.url;
  }

  private saveOrgInfo() {
    if (this.orgForm.institutionLogo && this.orgForm.name && this.orgForm.institutionType !== '请选择服务领域' && this.orgForm.address && this.orgForm.principal && this.orgForm.companyPhone) {
      this.orgForm.contactsName = this.orgForm.principal;
      this.orgForm.contactsPhone = this.orgForm.companyPhone;
      if (this.orgId) {
        editOrgInfo(this.orgForm).then(() => {
          this.fetchOrg().then(() => {
            Toast({
              message: '修改成功',
              icon: 'success',
              duration: 1000
            });
          });
        }).catch((err: any) => {
          Notify({ type: 'danger', message: err.response.data.message });
        });
      } else {
        addOrg(this.orgForm).then((res: any) => {
          if (res.data.code === 500) {
            Notify({ type: 'danger', message: res.data.message });
          } else {
            this.$router.push('/mine/organization/success');
          }
        }).catch((err: any) => {
          Notify({ type: 'danger', message: err.response.data.message });
        });
      }
    } else {
      Notify({ type: 'danger', message: '请完善组织信息' });
    }
  }
}
</script>
