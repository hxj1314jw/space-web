<template>
  <van-cell class="space-card-shadow" @click="toSpaceDetail(spaceForm.id)" style="margin-top: 20px; padding: 0; width: 90vw; margin-left: 5vw; border-radius: 5px;">
    <van-image fit="cover" width="100%" height="12rem" :src="ossImageUrl(spaceForm.bannerImage)"/>
    <div style="padding: 10px; padding-top: 5px;">
      <div class="product-name">
        <van-tag v-if="spaceForm.hotStatus" color="#fff7e8" text-color="#ffb11a">优选</van-tag>
        {{ spaceForm.productName }} |
        <span v-if="spaceForm.type === '1'">办公室</span>
        <span v-if="spaceForm.type === '2'">会议室</span>
        <span v-if="spaceForm.type === '3'">固定工位</span>
        <span v-if="spaceForm.type === '4'">自由工位</span>
        <span v-if="spaceForm.type === '5'">活动空间</span>
      </div>
      <div style="margin-top: 5px; line-height: 1.5em;">
        <span class="space-card-desc">
          <span v-if="spaceForm.remark">{{ spaceForm.remark }}<br></span>
          {{ spaceForm.address }}
          <template v-if="tagList.length !== 0">
            |
          </template>
          <template v-for="(tag, index) in tagList">
            <van-tag :key="index" color="rgba(193,255,182,.31)" text-color="#07c160" size="medium" style="margin: 0 3px;">{{ tag }}</van-tag>
<!--            <span v-else :key="index">无</span>-->
          </template><br>
          容纳{{ spaceForm.numberOfPeople}}人 {{ spaceForm.dimensions }}㎡
        </span>
        <div style="float: right; text-align: right; margin-bottom: 10px;">
          <template v-if="spaceForm.showPrice === '0'">
              <span style="color: #f76c6c; font-size: larger;">
              ￥有偿
            </span>
          </template>
          <template v-else>
            <span v-if="spaceForm.priceStates === '1'">
              <s style="color: #999999">
                ￥{{ spaceForm.price }} / <span>{{charge}}</span>
              </s><br>
              <span style="color: #F76C6C; font-size: larger;">
                ￥{{ spaceForm.activityPrice }} /<span>{{charge}}</span>
              </span>
            </span>
            <span v-else style="color: #00B261; font-size: larger;">
              ￥{{ spaceForm.price }} /<span>{{charge}}</span>
            </span>
          </template>
        </div>
      </div>
    </div>
  </van-cell>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Button, Tag, Image, Cell} from 'vant';
import { initChargeMethod } from '../utils/zone';
Vue.use(Cell).use(Button).use(Tag).use(Image);

@Component
export default class SpaceCard extends Vue {
  public tagList: any = [];
  public charge: string = '';
  @Prop() public spaceForm!: any;

  public created() {
    this.tagList = this.spaceForm.tags.split(',');
    this.getCharge();
  }

  private getCharge() {
    const chargeMethod = this.spaceForm.chargeMethod;
    this.charge = initChargeMethod(chargeMethod);
  }

  private toSpaceDetail(id: any) {
    // this.$router.push(`/space/detail/${id}`);
    window.location.href = `/space/detail/${id}`;
  }
}
</script>

<style scoped>
  .space-card-shadow {
    -moz-box-shadow: 0px 0px 2px #333333;
    -webkit-box-shadow: 0px 0px 2px #333333;
    box-shadow: 0px 0px 2px #333333;
  }
  .space-card-desc {
    font-size: 0.8em;
    color: #969799;
  }
  .product-name {
    font-size: 1.2em;
    width: 100%;
    color: black;
  }
</style>
