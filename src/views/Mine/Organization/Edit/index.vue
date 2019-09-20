<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-cell-group>
        <van-field label="机构名称" v-model="orgForm.name" placeholder="请输入机构名称" input-align="right"/>
        <van-field label="机构Logo" v-model="orgForm.name" placeholder="请上传机构Logo" input-align="right"/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="负责人姓名" v-model="orgForm.name" placeholder="请输入负责人姓名" input-align="right"/>
        <van-field label="负责人电话" v-model="orgForm.name" placeholder="请输入负责人电话" input-align="right"/>
        <van-field label="联系人姓名" v-model="orgForm.name" placeholder="请输入联系人姓名" input-align="right"/>
        <van-field label="联系人电话" v-model="orgForm.name" placeholder="请输入联系人电话" input-align="right"/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="省份" v-model="orgForm.name" placeholder="请输入省份" input-align="right"/>
        <van-field label="详细地址" v-model="orgForm.name" placeholder="请输入详细地址" input-align="right"/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="机构性质" v-model="orgForm.name" placeholder="请选择机构性质" input-align="right"/>
        <van-field label="服务领域" v-model="orgForm.name" placeholder="请输入服务领域" input-align="right"/>
        <van-field label="官方网站" v-model="orgForm.name" placeholder="请输入官方网站" input-align="right"/>
        <van-field label="官方微信" v-model="orgForm.name" placeholder="请输入官方微信" input-align="right"/>
        <van-field label="成立时间" v-model="orgForm.name" placeholder="请选择成立时间" input-align="right"/>
      </van-cell-group>

      <van-cell-group style="margin-top: 10px;">
        <van-field label="微信二维码" v-model="orgForm.name" placeholder="请上传微信收款二维码" input-align="right"/>
        <van-field label="支付宝二维码" v-model="orgForm.name" placeholder="请上传支付宝收款二维码" input-align="right"/>
        <van-field label="机构简介" v-model="orgForm.name" placeholder="请输入机构简介" input-align="right"/>
      </van-cell-group>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="toJoinOrg()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">保存</span>
      </van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import OrgCard from '@/components/OrgCard.vue';
import NoData from '@/components/NoData.vue';
import { getMyOrgList } from '@/api/organization';
import { Button, Icon, Field, CellGroup } from 'vant';
Vue.use(Button).use(Field).use(CellGroup);

@Component({
  components: {}
})

export default class EditOrg extends Vue {
  public orgForm: any = {};
}
</script>
