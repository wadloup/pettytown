import { NotebookText, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameStore } from "../../game/store";
import EventLog from "./EventLog";
import NPCPanel from "./NPCPanel";

type RightTab = "journal" | "npc";

function RightPanel() {
  const [activeTab, setActiveTab] = useState<RightTab>("journal");
  const selectedNpcId = useGameStore((state) => state.selectedNpcId);

  useEffect(() => {
    if (selectedNpcId) {
      setActiveTab("npc");
      return;
    }

    setActiveTab("journal");
  }, [selectedNpcId]);

  return (
    <section className="right-panel panel-surface" aria-label="Journal et fiche PNJ">
      <div className="right-tabs" role="tablist" aria-label="Panneau droit">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "journal"}
          className={activeTab === "journal" ? "right-tab is-active" : "right-tab"}
          onClick={() => setActiveTab("journal")}
        >
          <ScrollText size={15} aria-hidden="true" />
          Journal
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "npc"}
          className={activeTab === "npc" ? "right-tab is-active" : "right-tab"}
          disabled={!selectedNpcId}
          onClick={() => setActiveTab("npc")}
        >
          <NotebookText size={15} aria-hidden="true" />
          PNJ
        </button>
      </div>

      <div className="right-panel-body">
        {activeTab === "npc" && selectedNpcId ? <NPCPanel embedded /> : <EventLog embedded />}
      </div>
    </section>
  );
}

export default RightPanel;
