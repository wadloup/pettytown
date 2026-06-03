import { useGameStore } from "../../game/store";
import Ground from "./Ground";
import LocationMesh from "./LocationMesh";
import NPCMesh from "./NPCMesh";
import ObjectMesh from "./ObjectMesh";

function TownScene() {
  const npcs = useGameStore((state) => state.npcs);
  const locations = useGameStore((state) => state.locations);
  const objects = useGameStore((state) => state.objects);
  const selectedNpcId = useGameStore((state) => state.selectedNpcId);
  const selectedLocationId = useGameStore((state) => state.selectedLocationId);
  const selectNpc = useGameStore((state) => state.selectNpc);
  const selectLocation = useGameStore((state) => state.selectLocation);

  return (
    <group>
      <Ground />

      {locations.map((location) => (
        <LocationMesh
          key={location.id}
          location={location}
          selected={location.id === selectedLocationId}
          onSelect={selectLocation}
        />
      ))}

      {objects.map((object) => (
        <ObjectMesh key={object.id} object={object} />
      ))}

      {npcs.map((npc) => (
        <NPCMesh key={npc.id} npc={npc} selected={npc.id === selectedNpcId} onSelect={selectNpc} />
      ))}
    </group>
  );
}

export default TownScene;
