import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setToken: (token, userData) => {
        try {
          const decoded = jwtDecode(token);
          set({
            token,
            user: {
              id:               userData?.id    || null,   // ✅ store user ID
              email:            decoded.sub,
              role:             decoded.role,
              name:             userData?.name  || decoded.sub.split('@')[0],
              subscriptionPlan: userData?.subscriptionPlan || 'FREE',
              maxBorrowLimit:   userData?.maxBorrowLimit   || 2,
            },
          });
        } catch {
          set({ token: null, user: null });
        }
      },

      // Update user fields after subscribe / profile change
      updateUser: (fields) => set((state) => ({
        user: { ...state.user, ...fields }
      })),

      logout: () => {
        localStorage.removeItem('lms-auth');
        set({ token: null, user: null });
      },

      isAuthenticated: () => !!get().token,
      getRole: () => get().user?.role || null,
    }),
    { name: 'lms-auth' }
  )
);

export default useAuthStore;
