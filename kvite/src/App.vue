<!--
 * @Date: 2021-09-05 01:42:59
 * @LastEditors: Cosima
 * @LastEditTime: 2021-09-05 03:34:21
 * @FilePath: /my-vite/kvite/src/app.vue
-->
<template>
  <div>
    {{ title }}
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";

export default {
  setup() {
    const state = reactive({
      title: "vue3",
    });
    return {
      ...toRefs(state),
    };
  },
};
</script>
