import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
    ids: number[];
    toggle: (id: number) => void;
    isFavorite: (id: number) => boolean;
    clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            ids: [],

            toggle: (id) => {
                const ids = get().ids;
                set({
                    ids: ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
                });
            },

            isFavorite: (id) => get().ids.includes(id),

            clear: () => set({ ids: [] }),
        }),
        {
            name: 'flower-shop-favorites',
        }
    )
);
