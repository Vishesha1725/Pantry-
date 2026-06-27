"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { StoreShelf } from "./store-shelf";
import { CartPanel } from "./cart-panel";
import type { GrocerySections } from "@/types";

export function ThreeDStore({ sections }: { sections: GrocerySections }) {
  const sameDay = Object.values(sections.sameDayByDate).flat();
  const cartCount = sections.weeklyFresh.length + sections.monthlyStaples.length + sections.quarterlyBulk.length + sameDay.length;
  return (
    <div className="h-[460px] overflow-hidden rounded-2xl border bg-[#f9eed8] shadow-cozy">
      <Canvas shadows camera={{ position: [0, 3.6, 6.2], fov: 42 }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 6, 4]} intensity={1.5} castShadow />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]} receiveShadow>
          <planeGeometry args={[8, 6]} />
          <meshStandardMaterial color="#f3dfbb" />
        </mesh>
        <Text position={[0, 2.1, -1.1]} fontSize={0.28} color="#6e5140" anchorX="center">Cozy Grocery Store</Text>
        <StoreShelf title="Fresh Counter" items={sameDay} position={[-2.4, 0, -0.7]} color="#f2c572" />
        <StoreShelf title="Weekly Garden Aisle" items={sections.weeklyFresh} position={[0, 0, -0.7]} color="#a8bf8e" />
        <StoreShelf title="Pantry Staples Shelf" items={sections.monthlyStaples} position={[2.4, 0, -0.7]} color="#d8b392" />
        <StoreShelf title="Bulk Storage Corner" items={sections.quarterlyBulk} position={[-1.25, 0, 1.15]} color="#b7a7d8" />
        <StoreShelf title="Recipe Basket Station" items={sections.checkPantry} position={[1.25, 0, 1.15]} color="#f2d9d1" />
        <CartPanel count={cartCount} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
