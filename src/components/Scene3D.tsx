import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useGraph, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";
import { useAvatar } from "../stores/useAvatar";
import { useShallow } from "zustand/shallow";

export default function Scene() {
  const { camera } = useThree();
  const { scene } = useGLTF("/3d/avatar.glb");

  const {
    eyesActive,
    hairActive,
    eyeItems,
    hairItems,
    bodyItems,
    updateItems,
  } = useAvatar(
    useShallow((state) => ({
      eyesActive: state.customizations.eyes.active,
      hairActive: state.customizations.hair.active,
      eyeItems: state.customizations.eyes.items,
      hairItems: state.customizations.hair.items,
      bodyItems: state.customizations.body.items,
      updateItems: state.updateItems,
    })),
  );

  // Przepisac powyzsze na useShallow dla optymalizacji - jesli chcemy pobrac konretkne elementy objektu
  // np. const {eyesActive, hairActive} = useAvatar(useShallow((state) => ({eyesActive: state.customizations.eyes.active})))

  useEffect(() => {
    if (!camera) return;
    // camera.lookAt(0, 0.9, 0);
    camera.position.set(0, 0.7, 3);
    camera.fov = 40;
    camera.updateProjectionMatrix();
  }, [camera]);

  const { foundCustomizations, avatarBody } = useMemo(() => {
    let foundCustomizations = {
      eyes: [],
      hair: [],
      body: [],
    };

    let avatarBody;

    scene.traverse((node) => {
      if (node.name === "eyes") {
        foundCustomizations.eyes = node.children;
      }
      if (node.name === "hair") {
        foundCustomizations.hair = node.children;
      }

      if (node.name === "body") {
        Object.entries(node.morphTargetDictionary).map(([name, value]) => {
          foundCustomizations.body.push({
            name: name,
            id: value,
            value: node.morphTargetInfluences[value],
          });
        });

        avatarBody = node;
      }
    });

    return {
      foundCustomizations,
      avatarBody,
    };
  }, [scene]);

  // INIT CUSTOMIZATIONS
  useEffect(() => {
    if (foundCustomizations.eyes.length > 0 && !eyeItems) {
      const eyes = [];
      foundCustomizations.eyes.forEach((node, index) => {
        eyes.push({ name: node.name, id: node.uuid, index });
      });

      updateItems("eyes", eyes);
    }

    if (foundCustomizations.hair.length > 0 && !hairItems) {
      const hair = [];
      foundCustomizations.hair.forEach((node, index) => {
        hair.push({ name: node.name, id: node.uuid, index });
      });

      updateItems("hair", hair);
    }

    if (foundCustomizations.body.length > 0 && !bodyItems) {
      updateItems("body", foundCustomizations.body);
    }
  }, [foundCustomizations]);

  // UPDATE ITEMS VISIBILITY ON MESH
  useEffect(() => {
    if (!foundCustomizations) return;

    if (foundCustomizations.eyes) {
      foundCustomizations.eyes.forEach((item, index) => {
        item.visible = eyesActive === index;
      });
    }

    if (foundCustomizations.hair) {
      foundCustomizations.hair.forEach((item, index) => {
        item.visible = hairActive === index;
      });
    }
  }, [foundCustomizations, eyesActive, hairActive]);

  //UPDATE MORPHS
  useEffect(() => {
    if (!avatarBody || !bodyItems) return;
    console.log("MORPHS UPDATE");
    bodyItems.forEach((item) => {
      if (avatarBody.morphTargetInfluences[item.id] !== undefined) {
        avatarBody.morphTargetInfluences[item.id] = item.value;
      }
      avatarBody.morphTargetInfluences[item.id] = item.value;
    });
  }, [avatarBody, bodyItems]);

  return (
    <group>
      <OrbitControls target={[0, 0.9, 0]} />
      <primitive object={scene}></primitive>
    </group>
  );
}
