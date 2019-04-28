<template>
  <span class="no-wrap" v-if="options.localized">{{ $n(value) }}</span>
  <span class="no-wrap" v-else>{{ value }}</span>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin]
};
</script>
