import { useEffect, useRef, useState } from "react";
import Canvas3D from "./components/Canvas3D";
import Scene from "./components/Scene3D";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useAvatar } from "./stores/useAvatar";
import SideBar from "./components/SideBar";

function App() {
  const [visibleOptions, setVisibleOptions] = useState(null);

  const [sideBarVisible, setSideBarVisible] = useState(false);

  const itemsHolderRef = useRef(null);

  // useGSAP(
  //   () => {
  //     let items = document.querySelectorAll(".item");
  //     if (items && items.length > 0) {
  //       gsap.set(".item", { opacity: 0 });
  //       gsap.to(".item", { opacity: 1, stagger: 0.1 });
  //     }
  //   },
  //   { dependencies: [visibleOptions, variations] },
  // );
  return (
    <section className="w-screen h-screen bg-amber-300 flex relative">
      <SideBar />

      {/* <div className="absolute top-0 left-0 h-full w-50 z-100 flex flex-col">
        <div className="z-2 pl-2">
          <button
            className="cursor-pointer "
            onClick={() => {
              setSideBarVisible(!sideBarVisible);
            }}
          >
            <h2>CUSTOMIZE</h2>
          </button>
        </div>
        <div
          className={`${sideBarVisible ? "translate-x-0" : "-translate-x-100"} bg-white transition-all duration-300 absolute top-0 left-0 w-full h-full pt-6 pl-2`}
        >
          <div className="flex gap-2">
            {Object.values(variations).map((variation) => (
              <div key={variation.name}>
                <button
                  className={`cursor-pointer ${visibleOptions === variation.name && "bg-amber-300 transition-all duration-300"}`}
                  onClick={() => {
                    if (visibleOptions === variation.name) {
                      setVisibleOptions(null);
                    } else {
                      setVisibleOptions(variation.name);
                      gsap.killTweensOf(`.item-${variation.name}`);
                      gsap.fromTo(
                        `.item-${variation.name}`,
                        {
                          opacity: 0,
                        },
                        {
                          opacity: 1,
                          stagger: 0.05,
                        },
                      );
                    }
                  }}
                >
                  <p className="capitalize">{variation.name}</p>
                </button>

                {itemsHolderRef.current && (
                  <>
                    {createPortal(
                      <div
                        className={`${visibleOptions === variation.name ? "" : "hidden"} flex flex-col gap-2`}
                      >
                        {variation.name !== "body" &&
                          variation.items?.map((item, index) => {
                            return (
                              <button
                                key={item.name}
                                className={`item-${variation.name} ${index === variation.active ? "bg-amber-300" : ""} cursor-pointer`}
                                onClick={() => {
                                  setVariations((prev) => ({
                                    ...prev,
                                    [variation.name]: {
                                      ...prev[variation.name],
                                      active: index,
                                    },
                                  }));
                                }}
                              >
                                {item.name}
                              </button>
                            );
                          })}
                        {variation.name === "body" &&
                          variation.morphs?.map((item) => {
                            return (
                              <label className={`item-${variation.name}`}>
                                {item.name}
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  value={item.val}
                                  onChange={() => {
                                    console.log("XX");
                                  }}
                                />
                              </label>
                            );
                          })}
                      </div>,
                      itemsHolderRef.current,
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div ref={itemsHolderRef}></div>
        </div>
      </div> */}
      <div className="flex-1">
        <Canvas3D>
          <Scene />
        </Canvas3D>
      </div>
    </section>
  );
}

export default App;
