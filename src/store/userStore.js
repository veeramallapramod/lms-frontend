import { create } from 'zustand';
import API from '../api/axiosInstance';

const useUserStore = create((set) => ({
  users: [],
  pendingUsers: [],
  loading: false,

  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const res = await API.get('/auth/users');
      set({ users: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchPendingUsers: async () => {
    set({ loading: true });
    try {
      const res = await API.get('/auth/users/pending');
      set({ pendingUsers: res.data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  approveUser: async (id) => {
    await API.put(`/auth/users/${id}/approve`);
    set((state) => ({
      pendingUsers: state.pendingUsers.filter((u) => u.id !== id),
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: 'APPROVED' } : u
      ),
    }));
  },

  rejectUser: async (id) => {
    await API.put(`/auth/users/${id}/reject`);
    set((state) => ({
      pendingUsers: state.pendingUsers.filter((u) => u.id !== id),
      users: state.users.map((u) =>
        u.id === id ? { ...u, status: 'REJECTED' } : u
      ),
    }));
  },
}));

export default useUserStore;
