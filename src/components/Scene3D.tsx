import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector3 } from "three";

export default function Scene({ variations, setVariations }) {
  const { camera } = useThree();
  const { scene } = useGLTF("/3d/avatar.glb");
  const camRef = useRef(null);
  useEffect(() => {
    if (!camera) return;
    // camera.lookAt(0, 0.9, 0);
    camera.position.set(0, 0.7, 3);
    camera.fov = 40;
    camera.updateProjectionMatrix();
  }, [camera]);

  const { clone, customizations } = useMemo(() => {
    const clone = scene.clone();

    let customizations = { eyes: [], hair: [] };

    clone.traverse((node) => {
      if (node.name === "eyes") {
        customizations.eyes = node.children;
      }
      if (node.name === "hair") {
        customizations.hair = node.children;
      }
    });

    return {
      clone,
      customizations,
    };
  }, [scene]);

  useEffect(() => {
    setVariations((prev) => {
      const updated = { ...prev };

      if (customizations.eyes.length > 0) {
        updated.eyes.items = customizations.eyes;
      }

      if (customizations.hair.length > 0) {
        updated.hair.items = customizations.hair;
      }

      return updated;
    });
  }, [customizations]);

  useEffect(() => {
    customizations.hair.forEach((hair, index) => {
      hair.visible = index === variations.hair.active;
    });

    customizations.eyes.forEach((eyes, index) => {
      eyes.visible = index === variations.eyes.active;
    });
  }, [variations]);

  return (
    <group>
      <OrbitControls target={[0, 0.9, 0]} />
      <primitive object={clone}></primitive>
    </group>
  );
}
