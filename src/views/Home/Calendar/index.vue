<template>
  <div>
    <vue-event-calendar class="calendar-list" :events="events" @day-changed="dayChanged" @month-changed="monthChanged"/>
    <div v-if="currentEvents.length > 0">
      <template v-for="(event, index) in currentEvents">
        <ActivityCard :key="index" :activityForm="event.desc"/>
      </template>
    </div>
    <div v-else style="text-align: center; margin-top: 15px;">
      <span style="color: #999999">暂无活动</span>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { getActivityList } from '@/api/activity';
  import ActivityCard from '@/components/ActivityCard';

  import moment from 'moment';
  import 'vue-event-calendar/dist/style.css';
  import vueEventCalendar from 'vue-event-calendar';
  import { Toast } from 'vant';
  Vue.use(vueEventCalendar, {locale: 'zh', color: '#07c160'}).use(Toast);

  export default {
    data() {
      return {
        events: [],
        currentEvents: [],
        year: '',
        month: ''
      };
    },

    components: {
      ActivityCard
    },

    methods : {
      async fetch() {
        Toast.loading({
            mask: true,
            forbidClick: true,
            message: '加载中...'
        });
        const res = await getActivityList({
          page: 1,
          size: 10,
          year: this.year,
          month: this.month
        });
        for (const activity of res.data.data.rows) {
          const duration = (moment(activity.endTime).valueOf() - moment(activity.beginTime).valueOf()) / (24 * 60 * 60 * 1000);
          for (let i = 0; i < duration; i++) {
            this.events.push({
              date: moment(moment(activity.beginTime).valueOf() + i * (24 * 60 * 60 * 1000)).format('YYYY/MM/DD'),
              title: activity.id,
              desc: {
                id: activity.id,
                activityName: activity.activityName,
                name: activity.name,
                publisherName: activity.publisherName,
                beginTime: activity.beginTime,
                endTime: activity.endTime,
                tags: activity.tags,
                price: activity.price,
                image: activity.image,
                hotStatus: activity.hotStatus,
                status: activity.status
              }
            });
          }
        }
        this.setTodayEvents();
        Toast.clear();
      },

      setTodayEvents() {
        const date = Date.parse(new Date());
        const today = moment(date).format('YYYY/MM/DD');
        for (const item of this.events) {
          if (item.date === today) {
            this.currentEvents.push(item);
          }
        }
      },

      dayChanged(day) {
        this.currentEvents = day.events;
      },

      monthChanged(month) {
        this.events = [];
        this.currentEvents = [];
        const currentMonth = month.replace(/[^0-9]/ig, '');
        const date = moment(currentMonth + '01');
        this.year = date.format('YYYY');
        this.month = date.format('M');
        this.fetch();
      },

      toActivityDetail(is) {
        this.$router.push(`/activity/detail/${id}`);
      },

      getCurrentMonth() {
        const date = Date.parse(new Date());
        this.year = moment(date).format('YYYY');
        this.month = moment(date).format('M');
      }
    },
    created() {
      const today = new Date();
      this.$EventCalendar.toDate(moment(today).format('YYYY/MM/DD'));
      this.getCurrentMonth();
      this.fetch();
    }
  };
</script>

<style>
  .events-wrapper {
    display: none;
  }
  .calendar-list {
    margin: 0;
    padding: 0;
    background-color: #fff;
  }
  .cal-body {
    background-color: #fff;
  }
  .arrow-left {
    transform: translate(75px, 0);
  }
  .arrow-right {
    transform: translate(-75px, 0);
  }
</style>