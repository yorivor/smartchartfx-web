<template>
  <!-- Div Wrapper to Avoid error in Compiling -->
  <div>
    <div v-if="selectable=true">
      <!--
        datesRender to monitor the first active date of the view
        select will be used to trigger creation of the event
        eventClick will be used to view the selected event
      -->

      <FullCalendar
        id="calendar"
        @select="select"
        @eventClick="eventClick"
        @datesRender="handleDateClick"
        :defaultView="defaultView"
        :plugins="calendarPlugins"
        :allDaySlot="dayslot"
        :minTime="startslot"
        :maxTime="endslot"
        :events="events"
        :selectable="selectable"
        :height="'auto'"
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
      calendarPlugins: [timeGridPlugin, interactionPlugin],
      events: [],
      startslot: "10:00:00",
      endslot: "24:00:00",
      dayslot: false,
      defaultView: "",
      apipath: "",
      Siteid: "",
      selectable: true,
      curSelectedDate: "",
      curView: "week"
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
    setSite(data) {
      this.Siteid = data;
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
      if (this.apipath !== "") {
        if (strDate !== "") {
          if (this.apipath.includes("?")) {
            path += "&";
          }else{
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
      info.Siteid = this.Siteid;
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