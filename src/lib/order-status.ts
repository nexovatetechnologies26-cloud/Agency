// Allowed order status transitions. Pure module.
import type { OrderStatus } from "./constants";

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["awaiting_requirements", "confirmed", "on_hold", "cancelled"],
  awaiting_requirements: ["confirmed", "on_hold", "cancelled"],
  confirmed: ["in_progress", "on_hold", "cancelled"],
  in_progress: ["under_review", "on_hold", "cancelled"],
  under_review: ["revision_requested", "completed", "in_progress"],
  revision_requested: ["in_progress", "under_review"],
  completed: ["refunded", "revision_requested"],
  on_hold: ["pending", "confirmed", "in_progress", "cancelled"],
  cancelled: ["refunded"],
  refunded: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus) {
  return from === to || TRANSITIONS[from].includes(to);
}

export function nextStatuses(from: OrderStatus): OrderStatus[] {
  return TRANSITIONS[from];
}
