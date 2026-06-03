import { useGameStore } from "../../game/store";
import { canTargetLocation, canTargetNpc, isNpcInDrama } from "../../game/targeting";
import EffectMesh from "./EffectMesh";
import Ground from "./Ground";
import LocationMesh from "./LocationMesh";
import NPCMesh from "./NPCMesh";
import ObjectMesh from "./ObjectMesh";

function TownScene() {
  const npcs = useGameStore((state) => state.npcs);
  const locations = useGameStore((state) => state.locations);
  const objects = useGameStore((state) => state.objects);
  const effects = useGameStore((state) => state.effects);
  const selectedNpcId = useGameStore((state) => state.selectedNpcId);
  const selectedLocationId = useGameStore((state) => state.selectedLocationId);
  const selectNpc = useGameStore((state) => state.selectNpc);
  const selectLocation = useGameStore((state) => state.selectLocation);
  const setHoveredTarget = useGameStore((state) => state.setHoveredTarget);
  const interaction = useGameStore((state) => state.interaction);

  return (
    <group>
      <Ground />

      {locations.map((location) => {
        const targetable = canTargetLocation(useGameStore.getState(), location.id);

        return (
          <LocationMesh
            key={location.id}
            location={location}
            selected={location.id === selectedLocationId}
            targetable={targetable}
            interactionActive={interaction.mode !== "idle"}
            onSelect={selectLocation}
            onHover={(hovered) => setHoveredTarget(hovered ? `location:${location.id}` : undefined)}
          />
        );
      })}

      {objects.map((object) => (
        <ObjectMesh key={object.id} object={object} />
      ))}

      {effects.map((effect) => {
        const target =
          effect.targetType === "npc"
            ? npcs.find((npc) => npc.id === effect.targetId)
            : locations.find((location) => location.id === effect.targetId);
        return target ? <EffectMesh key={effect.id} effect={effect} position={target.position} /> : null;
      })}

      {npcs.map((npc) => {
        const targetable = canTargetNpc(useGameStore.getState(), npc.id);
        const clickable = interaction.mode === "idle" || targetable;

        return (
          <NPCMesh
            key={npc.id}
            npc={npc}
            selected={npc.id === selectedNpcId || interaction.firstSelectedNpcId === npc.id}
            targetable={targetable}
            clickable={clickable}
            involvedInDrama={isNpcInDrama(useGameStore.getState(), npc.id)}
            onSelect={selectNpc}
            onHover={(hovered) => setHoveredTarget(hovered ? `npc:${npc.id}` : undefined)}
          />
        );
      })}
    </group>
  );
}

export default TownScene;
