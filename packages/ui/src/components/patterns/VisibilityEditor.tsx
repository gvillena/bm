import { useMemo } from "react";
import { Switch } from "../base/Switch.js";
import { sanitizeRichText } from "../../utils/sanitize.js";
import { Card, CardContent, CardHeader, CardTitle } from "../base/Card.js";

export interface VisibilityLayers {
  readonly publicLayer: boolean;
  readonly invitationLayer: boolean;
  readonly approvalLayer: boolean;
}

export interface VisibilityEditorProps {
  readonly value: VisibilityLayers;
  readonly onChange: (value: VisibilityLayers) => void;
  readonly labels?: {
    public?: string;
    invitation?: string;
    approval?: string;
    previewPublic?: string;
    previewInvited?: string;
  };
}

export function VisibilityEditor({ value, onChange, labels }: VisibilityEditorProps) {
  const preview = useMemo(() => {
    const publicView = value.publicLayer ? "Full" : value.invitationLayer ? "Invite required" : "Hidden";
    const invitedView = value.approvalLayer ? "Needs approval" : value.invitationLayer ? "Visible" : publicView;
    return { publicView, invitedView };
  }, [value]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <ToggleRow
          id="public"
          checked={value.publicLayer}
          label={labels?.public ?? "Public audience"}
          description="Visible to everyone"
          onCheckedChange={(checked) => onChange({ ...value, publicLayer: checked })}
        />
        <ToggleRow
          id="invitation"
          checked={value.invitationLayer}
          label={labels?.invitation ?? "By invitation"}
          description="Requires a shared link"
          onCheckedChange={(checked) => onChange({ ...value, invitationLayer: checked })}
        />
        <ToggleRow
          id="approval"
          checked={value.approvalLayer}
          label={labels?.approval ?? "Approval required"}
          description="Participants must be approved"
          onCheckedChange={(checked) => onChange({ ...value, approvalLayer: checked })}
        />
      </div>
      <Card aria-live="polite">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-foreground/70">
          <p>
            <strong>{sanitizeRichText(labels?.previewPublic ?? "Public")}:</strong> {sanitizeRichText(preview.publicView)}
          </p>
          <p>
            <strong>{sanitizeRichText(labels?.previewInvited ?? "Invited")}:</strong> {sanitizeRichText(preview.invitedView)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface ToggleRowProps {
  readonly id: string;
  readonly checked: boolean;
  readonly label: string;
  readonly description: string;
  readonly onCheckedChange: (checked: boolean) => void;
}

function ToggleRow({ id, checked, label, description, onCheckedChange }: ToggleRowProps) {
  return (
    <label htmlFor={id} className="flex items-start justify-between gap-3 rounded-md border border-foreground/10 p-4">
      <span>
        <span className="text-sm font-medium text-foreground">{sanitizeRichText(label)}</span>
        <p className="text-xs text-foreground/60">{sanitizeRichText(description)}</p>
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={sanitizeRichText(label)} />
    </label>
  );
}
