<template>
    <div class="container">
        <form id="formData" name="formData" @submit.prevent="submitForm">
            <div v-for="row in rows" :key="row.id" class="row" >
                <div class="col-sm" v-for="column in row" :key="column.id">
                    <div class="form-group">
                        <div v-if="column.type == 'submit'">
                            <input
                                :type="column.type"
                                :id="column.name"
                                :name="column.name"
                                :class="column.class"
                                :value="column.label"
                            >
                        </div>
                        <div v-else-if="column.type !== 'select'">
                            <label :for="column.name">{{ column.label }}</label>
                            <input
                                :type="column.type"
                                :id="column.name"
                                :name="column.name"
                                :class="column.class"
                                :placeholder="column.placeholder"
                                :value="column.value"
                            >
                        </div>
                        <div v-else>
                            <label :for="column.name">{{ column.label }}</label>
                            <select
                                :id="column.name"
                                :name="column.name"
                                :class="column.class"
                            >
                                <option
                                  v-for="option in column.options"
                                  :value="option.value"
                                  :key="option.id"
                                  :selected="column.value == option.value"
                                >
                                    {{ option.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<script>
export default {
  props: {
    path: {
      type: String,
      required: true,
      default: ""
    },
  },
  data: function(){
      return {
      }
  },
  methods: {
    submitForm: function() {
        var form = document.getElementById('formData');
        var data = new FormData(form);
        this.$http({
            method: this.method,
            url: this.url,
            data: data
        });
    }
  },
  name: 'Forms',
}
</script>