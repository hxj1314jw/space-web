<template>
  <van-cell-group style="margin-top: 10px;">
    <van-cell>
        <van-image round width="3rem" height="3rem" :src="ossImageUrl(userForm.avatar)" fit="cover"/>
        <span class="org-name">
          <van-tag v-if="userForm.admin === 1" color="rgba(193,255,182,.31)" text-color="#07c160" >管理员</van-tag>
          {{userForm.name}}<br>
          <van-icon slot="icon" name="phone-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
          <span style="color: #999999; font-size: small;">{{ userForm.phone }}</span>
        </span>
    </van-cell>
  </van-cell-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Search, Tab, Tabs, Image, Cell, CellGroup, Icon, Tag } from 'vant';
Vue.use(Search).use(Tab).use(Tabs).use(Image).use(Cell).use(CellGroup).use(Icon).use(Tag);

@Component
export default class UserCard extends Vue {
  @Prop() public userForm!: any;
}
</script>

<style>
.org-name {
  position: absolute;
  top: 50%;
  transform: translate(15px, -50%);
}
</style>