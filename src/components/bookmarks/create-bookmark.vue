<template>
  <v-prompt
    :message="$t('name_bookmark')"
    v-model="bookmarkTitle"
    @cancel="cancelBookmark"
    @confirm="saveBookmark"
  >
    <div class="create-options" v-if="isUserAdmin">
      <div class="create-label">{{ $t("bookmark_select_visibility") }}</div>
      <v-select
        :options="bookmarkOptions"
        :value="bookmarkType"
        default="personal"
        :disabled="optionsDisabled"
        @input="changeOption"
      />
    </div>
  </v-prompt>
</template>
<script>
import api from "../../api";

export default {
  data() {
    return {
      bookmarkOptions: {
        personal: this.$t("bookmark_personal"),
        global: this.$t("bookmark_global")
      },
      bookmarkTitle: "",
      bookmarkType: "personal",
      optionsDisabled: true
    };
  },
  props: {
    preferences: {
      type: Object,
      default: null
    }
  },
  computed: {
    isUserAdmin() {
      return this.$store.state.currentUser.admin;
    },
    collection() {
      return this.$route.params.collection;
    }
  },
  created() {
    if (this.isUserAdmin) {
      const id = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", { id });
      api
        .getRoles()
        .then(res => res.data)
        .then(roles => {
          this.$store.dispatch("loadingFinished", id);
          roles.map(role => {
            this.bookmarkOptions[role.id] = this.$t("bookmark_role", { role: role.name });
          });
          this.optionsDisabled = false;
        })
        .catch(error => {
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    }
  },
  methods: {
    changeOption(value) {
      this.bookmarkType = value;
    },
    cancelBookmark() {
      this.$emit("close");
    },
    saveBookmark() {
      const preferences = this.buildPreferences();

      const id = this.$helpers.shortid.generate();
      this.$store.dispatch("loadingStart", { id });
      this.$store
        .dispatch("saveBookmark", preferences)
        .then(() => {
          this.$store.dispatch("loadingFinished", id);
          this.$emit("close");
        })
        .catch(error => {
          this.$store.dispatch("loadingFinished", id);
          this.$events.emit("error", {
            notify: this.$t("something_went_wrong_body"),
            error
          });
        });
    },
    buildPreferences() {
      const preferences = { ...this.preferences };

      delete preferences.id;
      delete preferences.role;
      if (!preferences.collection) {
        preferences.collection = this.collection;
      }
      preferences.title = this.bookmarkTitle;

      if (this.bookmarkType === "personal" || !this.isUserAdmin) {
        preferences.user = this.$store.state.currentUser.id;
      } else if (this.bookmarkType === "global") {
        delete preferences.user;
      } else {
        delete preferences.user;
        preferences.role = this.bookmarkType;
      }
      return preferences;
    }
  }
};
</script>
<style lang="scss" scoped>
.create-options {
  margin-top: 2rem;
}
.create-label {
  font-size: 14px;
  margin-bottom: 1rem;
}
</style>
