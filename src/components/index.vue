<template>
  <div class="movie-list">
    <h1 class="movie-list__title">Movie List</h1>
    <FilterSort @filter-sort="updateFilters" @search="updateSearchQuery" @show-all-list="toggleShowAllList" />
    <MovieTable :filters="filters" :isLoading="isLoading" @loading-complete="onLoadingComplete" :searchQuery="searchQuery" :showAllList="showAllList" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FilterSort from './Filter/FilterSort.vue';
import MovieTable from './Table/MovieTable.vue';

export default defineComponent({
  components: {
    FilterSort,
    MovieTable,
  },
  data() {
    return {
      filters: {
        sort_field: 'imdb_id',
        sort_order: 'desc',
        genres: null,
      },
      isLoading: false,
      searchQuery: '',
      showAllList: false,
    };
  },
  methods: {
    async updateFilters(newFilters: { sort_field: string; sort_order: string; genres: string[] | null }) {
      this.isLoading = true;
      await this.$nextTick();
      this.filters = newFilters;
    },
    updateSearchQuery(query: string) {
      this.searchQuery = query;
    },
    async toggleShowAllList(value: boolean) {
      this.showAllList = value;
      this.isLoading = true;
      this.filters.page = 0;

      if (value) {
        delete this.filters.page_size;
      } else {
        this.filters.page_size = 1;
      }
    },
    onLoadingComplete() {
      this.isLoading = false;
    },
  },
});
</script>

<style scoped lang="scss">
.movie-list {
  margin: 0 auto;
  padding: 20px;

  &__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>
