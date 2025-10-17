import { SceneRenderer } from "@bm/ui/components/runtime";
import { ExperienceBoundary, useExperience } from "@experience/runtime/hooks";
import { useAriaPresenceValue } from "@app/providers/AriaPresenceProvider";
import { OnboardingSteps } from "@scenes/Onboarding/Steps";

function OnboardingExperience() {
  const runtime = useExperience();
  const { bridge } = useAriaPresenceValue();

  return (
    <div className="space-y-6">
      <OnboardingSteps />
      <SceneRenderer
        engine={runtime.engine}
        ariaUi={runtime.ui ?? null}
        onAction={(actionRef) => {
          if (actionRef.name === "confirm-obligation") {
            void bridge.confirmObligation({ code: String(actionRef.params?.code ?? "unknown") });
          }
        }}
        onTransition={(result) => {
          if (!result.ok && result.error.code === "guard-denied") {
            console.warn("Guard denied", result.error.meta);
          }
        }}
      />
    </div>
  );
}

function OnboardingPage() {
  return (
    <ExperienceBoundary graphId="onboarding">
      <OnboardingExperience />
    </ExperienceBoundary>
  );
}

export default OnboardingPage;
