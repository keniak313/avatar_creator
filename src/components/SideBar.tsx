import gsap from "gsap";
import { useAvatar } from "../stores/useAvatar";
import { useShallow } from "zustand/shallow";

export default function SideBar() {
  const {
    customizations,
    activeCategory,
    setActiveCategory,
    setActiveItem,
    updateItemValue,
  } = useAvatar(
    useShallow((state) => ({
      customizations: state.customizations,
      activeCategory: state.activeCategory,
      setActiveCategory: state.setActiveCategory,
      setActiveItem: state.setActiveItem,
      updateItemValue: state.updateItemValue,
    })),
  );

  return (
    <div className="absolute top-0 left-0 h-full w-50 z-100 flex flex-col bg-white">
      {/* CATEGORIES */}
      <div className="flex gap-2">
        {Object.values(customizations).map((category) => (
          <button
            key={category.id}
            className={`${activeCategory === category.name && "bg-amber-300"} cursor-pointer`}
            onClick={() => {
              console.log("click", category.name);
              if (activeCategory !== category.name) {
                setActiveCategory(category.name);
                gsap.killTweensOf(`.item-${category.name}`);
                gsap.fromTo(
                  `.item-${category.name}`,
                  {
                    opacity: 0,
                  },
                  {
                    opacity: 1,
                    stagger: 0.05,
                  },
                );
              } else {
                setActiveCategory(null);
              }
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
      {/* Items */}
      <div className="flex flex-col gap-2">
        {Object.values(customizations).map((category) =>
          category?.items?.map((item) => {
            if (category.name !== "body") {
              return (
                <button
                  className={`item-${category.name} cursor-pointer ${activeCategory === category.name ? "" : "hidden"} ${customizations[category.name].active === item.index && "bg-amber-300"}`}
                  key={item.id}
                  onClick={() => {
                    console.log("CLICK");
                    setActiveItem(category.name, item.index);
                  }}
                >
                  {item.name}
                </button>
              );
            } else {
              return (
                <label
                  key={item.id}
                  className={`item-${category.name} ${activeCategory === category.name ? "" : "hidden"}`}
                >
                  {item.name}
                  <input
                    type="range"
                    min={item.name === "weight" ? -1 : 0}
                    step={0.01}
                    max={1}
                    value={item.value}
                    onChange={(e) => {
                      updateItemValue(category.name, item.id, e.target.value);
                    }}
                  />
                </label>
              );
            }
          }),
        )}
      </div>
    </div>
  );
}
