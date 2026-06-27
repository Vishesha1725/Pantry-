"use client";

import { Text } from "@react-three/drei";
import { useState } from "react";
import type { GroceryItem } from "@/types";

export function StoreShelf({ title, items, position, color }: { title: string; items: GroceryItem[]; position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[2.4, 0.14, 1]} />
        <meshStandardMaterial color="#8b634a" />
      </mesh>
      <mesh position={[0, 0.65, -0.42]}>
        <boxGeometry args={[2.5, 1.2, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 1.42, -0.5]} fontSize={0.14} color="#4f372c" anchorX="center">{title}</Text>
      {items.slice(0, 6).map((item, index) => <StoreItem key={`${title}-${item.name}-${index}`} item={item} index={index} />)}
    </group>
  );
}

function StoreItem({ item, index }: { item: GroceryItem; index: number }) {
  const [selected, setSelected] = useState(false);
  const x = -0.9 + (index % 3) * 0.9;
  const y = 0.22 + Math.floor(index / 3) * 0.42;
  const urgent = item.buyingMode === "same_day_fresh";
  return (
    <group position={[x, y, 0]} onClick={(event) => { event.stopPropagation(); setSelected((value) => !value); }}>
      <mesh castShadow scale={selected ? 1.18 : 1}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color={selected ? "#d97f6d" : urgent ? "#f0bf52" : "#8dac7b"} emissive={urgent ? "#f0bf52" : "#000"} emissiveIntensity={urgent ? 0.25 : 0} transparent opacity={item.status === "have" ? 0.35 : 1} />
      </mesh>
      <Text position={[0, -0.26, 0]} fontSize={0.08} color="#4f372c" anchorX="center" maxWidth={0.75}>{item.name}</Text>
    </group>
  );
}
