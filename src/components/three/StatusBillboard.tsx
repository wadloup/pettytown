import { Billboard, Text } from "@react-three/drei";
import type { StatusIcon } from "../../game/types";

const iconLabel: Record<StatusIcon, { label: string; color: string }> = {
  rumor: { label: "R", color: "#ef4444" },
  stress: { label: "!", color: "#f97316" },
  jealousy: { label: "J", color: "#84cc16" },
  aura: { label: "*", color: "#facc15" },
  secret: { label: "?", color: "#7c3aed" },
  phone: { label: "@", color: "#06b6d4" },
  idea: { label: "?", color: "#f59e0b" },
  money: { label: "$", color: "#22c55e" },
  party: { label: "P", color: "#ec4899" },
  power: { label: "X", color: "#475569" },
  weird: { label: "#", color: "#14b8a6" },
  conflict: { label: "!!", color: "#dc2626" },
  opportunity: { label: "+", color: "#eab308" },
};

function StatusBillboard({ icons }: { icons: StatusIcon[] }) {
  if (icons.length === 0) return null;

  return (
    <Billboard position={[0, 1.72, 0]}>
      <group>
        {icons.slice(0, 2).map((icon, index) => {
          const data = iconLabel[icon];
          return (
            <group key={`${icon}_${index}`} position={[(index - (icons.length - 1) / 2) * 0.34, 0, 0]}>
              <mesh>
                <circleGeometry args={[0.17, 18]} />
                <meshBasicMaterial color="#0B0F1A" transparent opacity={0.92} />
              </mesh>
              <mesh position={[0, 0, 0.006]}>
                <ringGeometry args={[0.14, 0.17, 18]} />
                <meshBasicMaterial color={data.color} transparent opacity={0.9} />
              </mesh>
              <Text position={[0, 0, 0.012]} fontSize={0.14} color="#F5F7FF" anchorX="center" anchorY="middle">
                {data.label}
              </Text>
            </group>
          );
        })}
      </group>
    </Billboard>
  );
}

export default StatusBillboard;
