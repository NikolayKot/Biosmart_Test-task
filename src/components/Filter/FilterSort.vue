<template>
  <div class="filter-container">
      <div class="filters">
          <div class="filters__title">Filters</div>
          <div class="filters__controls">
              <input type="text" v-model="searchQuery" placeholder="Search by movie title" @input="applySearch" class="filters__search">
              <select v-model="selectedSort" class="filters__select">
                  <option value="imdb_id">IMDB ID</option>
                  <option value="budget">Budget</option>
                  <option value="original_language">Original Language</option>
                  <option value="popularity">Popularity</option>
                  <option value="release_date">Release Date</option>
                  <option value="revenue">Revenue</option>
                  <option value="runtime">Runtime</option>
                  <option value="status">Status</option>
                  <option value="vote_average">Vote Average</option>
                  <option value="vote_count">Vote Count</option>
              </select>
              <select v-model="selectedOrder" class="filters__select">
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
              </select>
              <input type="text" v-model="selectedGenresInput" placeholder="Filter by genre" class="filters__genre">
              <button @click="applyFilters" class="filters__button">Show</button>
          </div>
      </div>
      <div class="shaw-all">
        <button @click="toggleShowAllList" :class="{ 'active': showAllList }" class="shaw-all__button">
            <span v-if="showAllList">Hide All List</span>
            <span v-else>Show All List</span>
            <span class="shaw-all__circle-indicator"></span>
        </button>
      </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      showAllList: false,
      isLoading: false,
      selectedSort: 'imdb_id',
      selectedOrder: 'desc',
      selectedGenresInput: '',
      searchQuery: '',
    };
  },
  methods: {
    applyFilters() {
      const genres = this.parseGenres(this.selectedGenresInput);
      const filters = {
        sort_field: this.selectedSort,
        sort_order: this.selectedOrder,
        genres: genres.length > 0 ? genres : null,
      };
      this.$emit('filter-sort', filters);
    },
    applySearch() {
      this.$emit('search', this.searchQuery);
    },
    parseGenres(input: string): string[] {
      const genres = input.trim().split(/[,\s]+/);
      return genres.filter(genre => genre.trim() !== '').map(genre => genre.trim());
    },
    toggleShowAllList() {
      this.showAllList = !this.showAllList;
      this.isLoading = true;
      this.$emit('show-all-list', this.showAllList);
    },
  },
});
</script>

<style src="@/assets/filterSort.scss"></style>
