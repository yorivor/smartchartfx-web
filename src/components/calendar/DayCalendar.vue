<template>
  <!-- Div Wrapper to Avoid error in Compiling -->
  <div>
    <div>
      <FullCalendar
        id="calendar"
        @eventClick="eventClick"
        @datesRender="handleDateClick"
        :defaultView="defaultView"
        :plugins="calendarPlugins"
        :events="events"
        :selectable="selectable"
      />
    </div>
    <CalendarAdd ref="newevents"/>
    <CalendarView ref="viewevent"/>
  </div>
</template>
<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarAdd from "./CalendarAdd.vue";
import CalendarView from "./CalendarView.vue";
export default {
  components: {
    FullCalendar,
    CalendarAdd,
    CalendarView
  },
  data: function() {
    return {
      calendarPlugins: [dayGridPlugin, interactionPlugin],
      events: [],
      startslot: "10:00:00",
      endslot: "24:00:00",
      dayslot: false,
      defaultView: "",
      apipath: "",
      selectable: false,
      curSelectedDate: new Date()
        .toJSON()
        .slice(0, 10)
        .replace(/-/g, "-"),
      curView: "month"
    };
  },
  methods: {
    setStartSlot(data) {
      this.startslot = data;
    },
    setEndSlot(data) {
      this.endslot = data;
    },
    setDaySlot(data) {
      this.dayslot = data;
    },
    setView(data) {
      this.defaultView = data;
    },
    setApiPath(data) {
      this.apipath = data;
    },
    setSelectable(data) {
      this.selectable = data;
    },
    setPlugin(data) {
      if (data === "day") {
        this.calendarPlugins = [dayGridPlugin, interactionPlugin];
      } else {
        this.calendarPlugins = [
          timeGridPlugin,
          dayGridPlugin,
          interactionPlugin
        ];
      }
    },
    convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    },
    fetchCalendar() {
      let path = this.apipath;
      let strDate = this.convert(this.curSelectedDate);
      if (path !== "") {
        if (strDate !== "") {
          if (this.apipath.includes("?")) {
            path += "&";
          } else {
            path += "?";
          }
          path = path + "reserved_date=" + strDate;
        }
        path = path + "&mode=" + this.curView;
        this.$http
          .get(path)
          .then(response => {
            this.events = response.data.response.data;
          })
          .catch(() => {});
      }
    },
    select: function(info) {
      this.$refs.newevents.open(info);
    },
    eventClick: function(info) {
      this.$refs.viewevent.open(info);
    },
    handleDateClick(arg) {
      this.curSelectedDate = arg.view.currentStart;
      this.fetchCalendar();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
</style>