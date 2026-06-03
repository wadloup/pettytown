import { DoorOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../game/store";
import { getZone } from "../../game/zones";

function ZoneTransition() {
  const currentZoneId = useGameStore((state) => state.currentZoneId);
  const exitToPreviousZone = useGameStore((state) => state.exitToPreviousZone);
  const [visible, setVisible] = useState(false);
  const previousZoneRef = useRef(currentZoneId);
  const zone = getZone(currentZoneId);

  useEffect(() => {
    if (previousZoneRef.current === currentZoneId) return;

    previousZoneRef.current = currentZoneId;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 950);
    return () => window.clearTimeout(timeout);
  }, [currentZoneId]);

  return (
    <>
      {currentZoneId !== "town_center" ? (
        <button type="button" className="zone-exit-button" onClick={exitToPreviousZone}>
          <DoorOpen size={16} aria-hidden="true" />
          Sortir
        </button>
      ) : null}

      {visible ? (
        <div className="zone-transition" aria-live="polite">
          <strong>{zone.name}</strong>
          <span>{zone.subtitle}</span>
        </div>
      ) : null}
    </>
  );
}

export default ZoneTransition;
