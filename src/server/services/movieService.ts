import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getMovies = async (params: any) => {
  try {
    const response = await axios.post(API_URL, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export default {
  getMovies,
};
