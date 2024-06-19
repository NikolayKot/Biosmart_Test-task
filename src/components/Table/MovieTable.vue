<template>
  <div class="movie-table">
    <table class="movie-table__table">
      <thead class="movie-table__header">
        <tr>
          <th class="movie-table__th movie-table__th--name">Name</th>
          <th class="movie-table__th movie-table__th--sort">{{ getSelectedSortLabel() }}</th>
        </tr>
      </thead>
      <tbody class="movie-table__body">
        <tr v-if="isLoading" class="movie-table__row movie-table__row--loading">
          <td colspan="2" class="movie-table__cell movie-table__cell--loading">
            <span class="movie-table__loading-dots">...</span>
          </td>
        </tr>
        <template v-else>
          <template v-for="movie in filteredMovies" :key="movie.id">
            <tr class="movie-table__row" @click="toggleMovieDetails(movie)">
              <td class="movie-table__cell">{{ movie.title }}</td>
              <td class="movie-table__cell">{{ getSelectedSortValue(movie) }}</td>
            </tr>
            <tr v-if="selectedMovieId === movie.id" class="movie-table__row movie-table__row--details">
              <td colspan="2" class="movie-table__cell movie-table__cell--details">
                <div class="movie-details">
                  <h3 class="movie-details__title">{{ movie.title }}</h3>
                  <div class="movie-details__item">Adult: {{ movie.adult ? 'Yes' : 'No' }}</div>
                  <div v-if="movie.belongs_to_collection" class="movie-details__item">
                    Collection: {{ movie.belongs_to_collection.name }}
                  </div>
                  <div v-if="movie.genres" class="movie-details__item">
                    Genres: {{ movie.genres.map(genre => genre.name).join(', ') }}
                  </div>
                  <div class="movie-details__item">Overview: {{ movie.overview }}</div>
                  <div class="movie-details__item">Popularity: {{ movie.popularity }}</div>
                  <div v-if="movie.production_companies" class="movie-details__item">
                    Production Companies: {{ movie.production_companies.map(company => company.name).join(', ') }}
                  </div>
                  <div v-if="movie.production_countries" class="movie-details__item">
                    Production Countries: {{ movie.production_countries.map(country => country.name).join(', ') }}
                  </div>
                  <div class="movie-details__item">Release Date: {{ movie.release_date }}</div>
                  <div class="movie-details__item">Runtime: {{ movie.runtime }}</div>
                  <div v-if="movie.spoken_languages" class="movie-details__item">
                    Spoken Languages: {{ movie.spoken_languages.map(lang => lang.name).join(', ') }}
                  </div>
                  <div class="movie-details__item">Status: {{ movie.status }}</div>
                  <div class="movie-details__item">Vote Average: {{ movie.vote_average }}</div>
                  <div class="movie-details__item">Vote Count: {{ movie.vote_count }}</div>
                </div>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
    <div class="movie-table__pagination" v-if="!showAllList">
      <button class="movie-table__pagination-button" :disabled="currentPage === 0" @click="changePage(currentPage - 1)">Prev Page</button>
      <button class="movie-table__pagination-button" @click="changePage(currentPage + 1)">Next Page</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import movieService from '@/server/services/movieService.ts';

export default defineComponent({
  props: {
    filters: {
      type: Object,
      default: () => ({
        sort_field: 'imdb_id',
        sort_order: 'asc',
        genres: null,
      }),
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    searchQuery: {
      type: String,
      default: '',
    },
    showAllList: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      movies: [],
      currentPage: 0,
      pageSize: 13,
      selectedMovieId: null,
      sortLabels: {
        imdb_id: 'IMDB ID',
        budget: 'Budget',
        original_language: 'Original Language',
        popularity: 'Popularity',
        release_date: 'Release Date',
        revenue: 'Revenue',
        runtime: 'Runtime',
        status: 'Status',
        vote_average: 'Vote Average',
        vote_count: 'Vote Count',
      },
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    async fetchMovies() {
      try {
        const params = {
          page: this.currentPage,
          sort_field: this.filters.sort_field,
          sort_order: this.filters.sort_order,
          genres: this.filters.genres,
          search: this.searchQuery,
        };

        if (!this.showAllList) {
          params.page_size = this.pageSize;
        }
        const response = await movieService.getMovies(params);
        this.movies = response.data;
        this.$emit('loading-complete');
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    changePage(page: number) {
      this.currentPage = page;
      this.fetchMovies();
    },
    toggleMovieDetails(movie) {
      if (this.selectedMovieId === movie.id) {
        this.selectedMovieId = null;
      } else {
        this.selectedMovieId = movie.id;
      }
    },
    getSelectedSortLabel() {
      return this.sortLabels[this.filters.sort_field] || '';
    },
    getSelectedSortValue(movie) {
      return movie[this.filters.sort_field];
    },
  },
  computed: {
    filteredMovies() {
      if (this.searchQuery.trim() === '') {
        return this.movies;
      }
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.movies.filter(movie =>
        movie.title.toLowerCase().includes(lowerCaseQuery)
      );
    },
  },
  watch: {
    filters: {
      handler() {
        this.currentPage = 0;
        this.fetchMovies();
      },
      deep: true,
    },
    isLoading(newValue) {
      if (!newValue) {
        this.$emit('loading-complete');
      }
    },
  },
});
</script>

<style src="@/assets/movieTable.scss"></style>
