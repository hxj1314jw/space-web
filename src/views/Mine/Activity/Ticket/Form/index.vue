<template>
  <div>
    <div style="width: 100%; position: absolute; top: 0; bottom: 0; overflow-y: auto; -webkit-overflow-scrolling: touch">
      <van-cell-group>
        <van-cell title="姓名"/>
        <van-cell title="手机"/>
        <van-cell title="邮箱"/>
        
        <template v-for="(field, index) in fieldList">
          <van-cell :key="index" v-if="field.isCheck">
            <template slot="title">
              {{ field.name }}
              <span v-if="field.requireStatus" style="color: #999999">（必填）</span>
            </template>
            <template slot="right-icon">
              <van-switch size="20px" v-model="field.requireStatus" active-color="#00B261" />
            </template>
          </van-cell>
        </template>
      </van-cell-group>

      <div @click="showType = true" style="text-align: center; margin: 10px 0;">
        <span style="color: #00B261">+新增字段 </span>
        <span style="color: #999999; font-size: x-small">报名表单</span>
      </div>
    </div>

    <div style="position: fixed; bottom: 0; height: 50px;">
      <van-button @click="saveActivity()" type="primary" style="width: 100vw; margin: 0; padding: 0; height: 100%;">
        <span class="center van-icon">保存并发布</span>
      </van-button>
    </div>

    <van-popup v-model="showType" position="bottom" style="max-height: 70%">
      <template v-for="(field, index) in fieldList">
        <van-cell :key="index" :title="field.name" clickable>
          <van-checkbox slot="right-icon" :name="field.fieldName" v-model="field.isCheck" checked-color="#00B261"/>
        </van-cell>
      </template>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { addActivityField } from '@/api/activity';

import { Toast, CellGroup, Cell, Field, Button, Switch, Popup, Checkbox } from 'vant';
Vue.use(Toast).use(CellGroup).use(Cell).use(Field).use(Button).use(Switch).use(Popup).use(Checkbox);

@Component({
  components: {}
})
export default class EditActivityForm extends Vue {
  public fieldList: any = [
    { name: '性别', fieldName: 'sex', type: '1', requireStatus: false, isCheck: false },
    { name: '身份证号', fieldName: 'idCard', type: '1', requireStatus: false, isCheck: false },
    { name: '生日', fieldName: 'birthday', type: '3', requireStatus: false, isCheck: false },
    { name: 'qq号', fieldName: 'qqInfo', type: '1', requireStatus: false, isCheck: false },
    { name: '微信号', fieldName: 'wxInfo', type: '1', requireStatus: false, isCheck: false},
    { name: '公司名称', fieldName: 'company', type: '1', requireStatus: false, isCheck: false },
    { name: '职位', fieldName: 'position', type: '1', requireStatus: false, isCheck: false },
    { name: '部门', fieldName: 'dept', type: '1', requireStatus: false, isCheck: false },
    { name: '年龄', fieldName: 'age', type: '2', requireStatus: false, isCheck: false },
    { name: '月收入', fieldName: 'month_income', type: '2', requireStatus: false, isCheck: false },
    { name: '所在城市', fieldName: 'city', type: '1', requireStatus: false, isCheck: false },
    { name: '毕业学校', fieldName: 'school', type: '1', requireStatus: false, isCheck: false }
  ];
  public showType: boolean = false;

  private saveActivity() {
    const activityField: any = {
      activityId: '',
      form: []
    };
    activityField.activityId = this.$route.params.id;
    for (const item of this.fieldList) {
      if (item.isCheck) {
        activityField.form.push(item);
      }
    }
    addActivityField(activityField).then(() => {
      this.$router.push('/mine/activity/success');
    });
  }
}
</script>