<template>
  <div v-if="show" :class="'alert ' + className">
    <span class="closebtn" @click="$emit('close')"> &times; </span>
    <span class="message" v-html="message"></span>
  </div>
</template>
<script>
export default {
  name: "alert",
  props: {
    message: {
      type: String,
      required: false,
      default: "Close",
    },
    className: {
      type: String,
      required: false,
      default: "success",
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.alert {
  padding: 20px;
  font-size: 14px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.success {
  background-color: #04aa6d;
  color: white;
}

.danger {
  background-color: #f44336;
  color: white;
}

.info {
  background-color: #2196f3;
  color: white;
}

.warning {
  background-color: #ff9800;
  color: white;
}

.closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.closebtn:hover {
  color: black;
}
</style>
