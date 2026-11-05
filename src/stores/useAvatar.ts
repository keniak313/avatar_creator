import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Items {
  name: string;
  id: number;
  index: number;
}

interface MorphsItems {
  name: string;
  id: number;
  value: number;
}
interface Customizations {
  id: number;
  name: string;
  active: number;
  items?: Items[];
}

interface AvatarState {
  customizations: {
    eyes: Customizations;
    hair: Customizations;
    body: {
      id: number;
      name: string;
      items?: MorphsItems[];
    };
  };
  activeCategory?: string;
  updateItems: (category: string, newItems: Items[]) => void;
  setActiveCategory: (category: string) => void;
  updateItemValue: (category: string, itemId: number, newValue: number) => void;
  setActiveItem: (category: string, index: number) => void;
}

//persist - saves to local storage

export const useAvatar = create<AvatarState>()(
  persist(
    (set) => ({
      customizations: {
        eyes: { id: 0, name: "eyes", active: 0, items: null },
        hair: { id: 1, name: "hair", active: 0, items: null },
        body: { id: 2, name: "body", items: null },
      },
      activeCategory: null,

      setActiveCategory: (category) =>
        set(() => ({ activeCategory: category })),
      setActiveItem: (category, index) =>
        set((state) => ({
          customizations: {
            ...state.customizations,
            [category]: { ...state.customizations[category], active: index },
          },
        })),
      updateItemValue: (category, itemId, newValue) =>
        set((state) => {
          const currentCategory = state.customizations[category];
          if (!currentCategory || !currentCategory.items) return state;
          return {
            customizations: {
              ...state.customizations,
              [category]: {
                ...currentCategory,
                items: currentCategory.items.map((item) =>
                  item.id === itemId ? { ...item, value: newValue } : item,
                ),
              },
            },
          };
        }),
      updateItems: (category, newItems) =>
        set((state) => ({
          customizations: {
            ...state.customizations,
            [category]: { ...state.customizations[category], items: newItems },
          },
        })),
    }),
    { name: "avatar-storage" },
  ),
);
