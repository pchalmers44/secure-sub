export type AuditAction =
  | "auth.register"
  | "auth.login"
  | "auth.login_failed"
  | "subscription.create"
  | "subscription.cancel"
  | "billing.view_subscription"
  | "billing.view_invoices";

export type AuditOutcome = "success" | "failure";

