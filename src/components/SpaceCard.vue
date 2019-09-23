<template>
  <van-cell class="space-card-shadow" @click="toSpaceDetail(spaceForm.id)" style="margin-top: 20px; padding: 0; width: 90vw; margin-left: 5vw; border-radius: 5px;">
    <van-image fit="cover" width="100%" height="12rem" :src="ossImageUrl(spaceForm.bannerImage)"/>
    <div style="padding: 10px; padding-top: 5px;">
      <div class="product-name">
        <van-tag v-if="spaceForm.hotStatus" color="#fff7e8" text-color="#ffb11a">优选</van-tag>
        {{ spaceForm.productName }}
      </div>
      <div style="margin-top: 5px; line-height: 1.5em;">
        <span class="space-card-desc">
          {{ spaceForm.remark }}<br>
          {{ spaceForm.address }} | 
          <template v-for="(tag, index) in tagList">
            <van-tag v-if="tag" :key="index" type="success" plain style="margin: 0 3px;">
              {{ tag }}
            </van-tag>
            <span v-else :key="index">无</span>
          </template><br>
          容纳{{ spaceForm.numberOfPeople}}人 {{ spaceForm.dimensions }}㎡
        </span>
        <div style="color: #00B261; font-size: larger; float: right">
          <span>
            ￥{{ spaceForm.price }} /
            <span v-if="spaceForm.chargeMethod === '1'">小时</span>
            <span v-if="spaceForm.chargeMethod === '2'">日</span>
            <span v-if="spaceForm.chargeMethod === '3'">月</span>
            <span v-if="spaceForm.chargeMethod === '4'">年</span>
          </span>
        </div>
      </div>
    </div>
  </van-cell>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Button, Tag, Image, Cell} from 'vant';
Vue.use(Cell).use(Button).use(Tag).use(Image);

@Component
export default class SpaceCard extends Vue {
  public tagList: any = [];
  @Prop() public spaceForm!: any;

  public created() {
    this.tagList = this.spaceForm.tags.split(',');
  }

  private toSpaceDetail(id: any) {
    this.$router.push(`/space/detail/${id}`);
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