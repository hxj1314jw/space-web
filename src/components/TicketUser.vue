<template>
  <van-cell-group style="margin-top: 10px;">
    <van-cell>
      <van-tag v-if="userForm.audit === 1" color="#fff7e8" text-color="#ffb11a" >待审核</van-tag>
      <van-tag v-if="userForm.audit === 2" color="rgba(193,255,182,.31)" text-color="#07c160" >通过</van-tag>
      <van-tag v-if="userForm.audit === 3" color="rgba(255,182,193,.31)" text-color="#f08080" >拒绝</van-tag>
      {{ userForm.name }}
      <span style="color: #999999; font-size: smaller;">
        （{{ userForm.phone }}）
      </span><br>
      <span v-if="!teller" style="color: #999999; font-size: smaller;">
        <van-icon slot="icon" name="clock-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
        报名时间：{{ userForm.createDate | dateFmt('YYYY-MM-DD') }}
      </span>
    </van-cell>
  </van-cell-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Cell, CellGroup, Icon, Tag } from 'vant';
Vue.use(Cell).use(CellGroup).use(Icon).use(Tag);

@Component
export default class TicketUser extends Vue {
  @Prop() public userForm!: any;
  @Prop() public teller: any;
}
</script>
