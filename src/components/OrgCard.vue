<template>
  <van-cell-group style="margin-top: 10px;">
    <van-cell>
      <template>
        <van-image round width="3rem" height="3rem" :src="ossImageUrl(orgForm.institutionLogo)" fit="cover"/>
        <span class="org-name">
          {{orgForm.name}}
          <span style="color: #999999; font-size: small;">（{{ orgForm.institutionType }}）</span><br>
          <van-icon slot="icon" name="location-o" style="line-height: inherit; margin-right: 3px;" color="#00B261"/>
          <span style="color: #999999; font-size: small;">{{ orgForm.address }}</span>
        </span>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Search, Tab, Tabs, Image, Cell, CellGroup, Icon } from 'vant';
Vue.use(Search).use(Tab).use(Tabs).use(Image).use(Cell).use(CellGroup).use(Icon);

@Component
export default class OrgCard extends Vue {
  @Prop() public orgForm!: any;
}
</script>

<style>
.org-name {
  position: absolute;
  top: 50%;
  transform: translate(15px, -50%);
}
</style>