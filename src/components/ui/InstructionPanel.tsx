import { CircleOff, MousePointer2 } from "lucide-react";
import { useGameStore } from "../../game/store";

function InstructionPanel() {
  const interaction = useGameStore((state) => state.interaction);
  const cancelIntervention = useGameStore((state) => state.cancelIntervention);
  const selectedInterventionId = interaction.selectedInterventionId;

  return (
    <div className={interaction.mode === "idle" ? "instruction-panel" : "instruction-panel is-active"}>
      <MousePointer2 size={16} aria-hidden="true" />
      <span>{interaction.instructionText}</span>
      {selectedInterventionId ? (
        <button type="button" className="ghost-action" onClick={cancelIntervention}>
          <CircleOff size={14} aria-hidden="true" />
          Annuler
        </button>
      ) : null}
    </div>
  );
}

export default InstructionPanel;
