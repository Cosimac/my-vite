<!--
 * @Date: 2022-05-29 01:42:59
 * @LastEditors: Cosima
 * @LastEditTime: 2022-05-29 23:12:07
 * @FilePath: /my-vite/kvite/src/App.vue
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
