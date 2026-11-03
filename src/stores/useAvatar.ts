import { create } from "zustand";

export const useAvatar = create((set) => ({
  customizations: {
    eyes: { id: 0, name: "eyes", active: 0, items: null },
    hair: { id: 1, name: "hair", active: 0, items: null },
    body: { id: 2, name: "body", items: null },
  },
  activeCategory: null,

  setActiveCategory: (category) =>
    set((state) => ({ activeCategory: category })),
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
}));
