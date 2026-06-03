import { Check, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { isTutorialDone, markTutorialDone, tutorialSteps } from "../../game/tutorial";

function TutorialOverlay() {
  const [visible, setVisible] = useState(() => !isTutorialDone());
  const [stepIndex, setStepIndex] = useState(0);
  const [neverAgain, setNeverAgain] = useState(true);
  const step = tutorialSteps[stepIndex];

  useEffect(() => {
    if (!visible) {
      delete document.body.dataset.tutorialFocus;
      return;
    }

    document.body.dataset.tutorialFocus = step.focus;
    return () => {
      delete document.body.dataset.tutorialFocus;
    };
  }, [step.focus, visible]);

  if (!visible) return null;

  const close = () => {
    if (neverAgain) markTutorialDone();
    setVisible(false);
  };

  const next = () => {
    if (stepIndex >= tutorialSteps.length - 1) {
      close();
      return;
    }
    setStepIndex((current) => current + 1);
  };

  return (
    <div className="tutorial-layer" data-focus={step.focus}>
      <section className="tutorial-card panel-surface" role="dialog" aria-modal="false" aria-labelledby="tutorial-title">
        <div className="tutorial-progress">
          {tutorialSteps.map((item, index) => (
            <i key={item.id} className={index <= stepIndex ? "is-done" : ""} />
          ))}
        </div>
        <span className="tutorial-kicker">Guide rapide</span>
        <h2 id="tutorial-title">{step.title}</h2>
        <p>{step.body}</p>

        <label className="tutorial-check">
          <input type="checkbox" checked={neverAgain} onChange={(event) => setNeverAgain(event.currentTarget.checked)} />
          Ne plus afficher
        </label>

        <div className="tutorial-actions">
          <button type="button" className="ghost-action" onClick={close}>
            <X size={15} aria-hidden="true" />
            Passer
          </button>
          <button type="button" className="copy-button tutorial-next" onClick={next}>
            {stepIndex >= tutorialSteps.length - 1 ? <Check size={15} aria-hidden="true" /> : <ChevronRight size={15} aria-hidden="true" />}
            {stepIndex >= tutorialSteps.length - 1 ? "Terminer" : "Suivant"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default TutorialOverlay;
