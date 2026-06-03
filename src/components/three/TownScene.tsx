import { useGameStore } from "../../game/store";
import InteriorCafeScene from "./zones/InteriorCafeScene";
import TownCenterScene from "./zones/TownCenterScene";

function TownScene() {
  const currentZoneId = useGameStore((state) => state.currentZoneId);

  if (currentZoneId === "interior_cafe") return <InteriorCafeScene />;

  return <TownCenterScene />;
}

export default TownScene;
