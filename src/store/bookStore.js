import { create } from 'zustand';
import API from '../api/axiosInstance';

const useBookStore = create((set, get) => ({
  books: [],
  loading: false,
  searchQuery: '',
  selectedCategory: '',
  lastUpdated: null,  // tracks when books changed — Dashboard watches this

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedCategory: (c) => set({ selectedCategory: c }),

  fetchBooks: async () => {
    set({ loading: true });
    try {
      const res = await API.get('/books');
      set({ books: res.data, loading: false, lastUpdated: Date.now() });
    } catch {
      set({ loading: false });
    }
  },

  addBook: async (data) => {
    const res = await API.post('/books', data);
    set((s) => ({ books: [...s.books, res.data], lastUpdated: Date.now() }));
    return res.data;
  },

  updateBook: async (id, data) => {
    const res = await API.put(`/books/${id}`, data);
    // Update in store immediately so Dashboard reflects change
    set((s) => ({
      books: s.books.map((b) => (b.id === id ? res.data : b)),
      lastUpdated: Date.now(),
    }));
    return res.data;
  },

  deleteBook: async (id) => {
    await API.delete(`/books/${id}`);
    set((s) => ({
      books: s.books.filter((b) => b.id !== id),
      lastUpdated: Date.now(),
    }));
  },
}));

export default useBookStore;
