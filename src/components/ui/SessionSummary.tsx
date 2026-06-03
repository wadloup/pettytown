import { Clipboard, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useGameStore } from "../../game/store";

const buildSummary = (
  npcs: ReturnType<typeof useGameStore.getState>["npcs"],
  events: ReturnType<typeof useGameStore.getState>["events"],
  chaos: number,
) => {
  const topEvents = events.slice(0, 5);
  const historic = events.find((event) => event.type === "historic") ?? events.find((event) => event.intensity > 70);
  const conflicts = events.filter((event) => event.type === "drama" || event.type === "relationship").length;
  const rumors = events.filter((event) => event.type === "rumor").length;
  const biggestNpc = [...npcs].sort((a, b) => b.stats.stress + b.stats.ego - (a.stats.stress + a.stats.ego))[0];

  return [
    "Aujourd'hui a PettyTown :",
    "",
    ...topEvents.slice(0, 3).map((event) => `- ${event.description}`),
    biggestNpc ? `- ${biggestNpc.name} termine avec ${Math.round(biggestNpc.stats.stress)} de stress et ${Math.round(biggestNpc.stats.ego)} d'ego.` : "",
    `- La ville a connu ${conflicts} tensions, ${rumors} rumeurs et ${events.filter((event) => event.type === "historic").length} evenement historique.`,
    "",
    "Evenement du jour :",
    `"${historic?.title ?? "Le calme suspect"}"`,
    "",
    `Niveau de chaos : ${Math.round(chaos)} %`,
  ]
    .filter(Boolean)
    .join("\n");
};

function SessionSummary() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "ready">("idle");
  const summaryOpen = useGameStore((state) => state.summaryOpen);
  const toggleSummary = useGameStore((state) => state.toggleSummary);
  const npcs = useGameStore((state) => state.npcs);
  const events = useGameStore((state) => state.events);
  const chaos = useGameStore((state) => state.townStats.chaos);

  const summary = useMemo(() => buildSummary(npcs, events, chaos), [npcs, events, chaos]);

  if (!summaryOpen) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyState("copied");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = summary;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopyState("ready");
    }
    window.setTimeout(() => setCopyState("idle"), 1600);
  };

  return (
    <div className="summary-backdrop" role="presentation">
      <section className="summary-modal panel-surface" role="dialog" aria-modal="true" aria-labelledby="summary-title">
        <div className="panel-heading">
          <div>
            <span>Session</span>
            <h2 id="summary-title">Resume de la journee</h2>
          </div>
          <button type="button" className="icon-button compact" onClick={toggleSummary} title="Fermer">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <pre>{summary}</pre>
        <button type="button" className="copy-button" onClick={copy}>
          <Clipboard size={17} aria-hidden="true" />
          {copyState === "copied" ? "Copie" : copyState === "ready" ? "Texte pret" : "Copier le texte"}
        </button>
      </section>
    </div>
  );
}

export default SessionSummary;
