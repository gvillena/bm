import type { MomentsClient } from "./momentsClient.js";
import type { AgreementsClient } from "./agreementsClient.js";
import type { ProfilesClient } from "./profilesClient.js";
import type { InvitationsClient } from "./invitationsClient.js";
import type { PoliciesClient } from "./policiesClient.js";
import type { ConsentClient } from "./consentClient.js";
import type { PaymentsClient } from "./paymentsClient.js";
import type { NotificationsClient } from "./notificationsClient.js";

export interface SdkClients {
  moments: MomentsClient;
  agreements: AgreementsClient;
  profiles: ProfilesClient;
  invitations: InvitationsClient;
  policies: PoliciesClient;
  consent: ConsentClient;
  payments: PaymentsClient;
  notifications: NotificationsClient;
}

let registry: SdkClients | null = null;

export function configureClients(clients: SdkClients): void {
  registry = clients;
}

export function requireClients(): SdkClients {
  if (!registry) {
    throw new Error("SDK clients have not been configured. Call configureClients first.");
  }
  return registry;
}
