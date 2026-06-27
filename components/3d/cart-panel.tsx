"use client";

import { Text } from "@react-three/drei";

export function CartPanel({ count }: { count: number }) {
  return (
    <group position={[0, -0.55, 1.55]}>
      <mesh>
        <boxGeometry args={[1.4, 0.55, 0.75]} />
        <meshStandardMaterial color="#d97f6d" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.46, 0.035, 12, 48, Math.PI]} />
        <meshStandardMaterial color="#6e5140" />
      </mesh>
      <Text position={[0, 0.03, 0.42]} fontSize={0.13} color="#fff7e8" anchorX="center">Cart {count}</Text>
    </group>
  );
}
