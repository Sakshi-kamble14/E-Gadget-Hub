import { useState } from "react";
import Modal from "./Modal";
import SelectInput from "../forms/SelectInput";
import StatusBadge from "../badges/StatusBadge";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "PENDING" },
  { value: "ASSIGNED", label: "ASSIGNED" },
  { value: "COLLECTED", label: "COLLECTED" },
  { value: "COMPLETED", label: "COMPLETED" },
  { value: "CANCELLED", label: "CANCELLED" },
];

export default function StatusUpdateModal({ open, onClose, request, onConfirm, loading }) {
  const [status, setStatus] = useState(request?.status || "");

  if (!request) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Update Status — Request #${request.requestID}`}
      size="sm"
      footer={
        <>
          <button className="btn-eco-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-eco-primary"
            disabled={loading || !status || status === request.status}
            onClick={() => onConfirm(status)}
          >
            {loading ? "Updating…" : "Update Status"}
          </button>
        </>
      }
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="text-muted-eco small">Current status:</span>
        <StatusBadge status={request.status} />
      </div>
      <SelectInput
        label="New Status"
        id="statusUpdate"
        value={status || request.status}
        onChange={(e) => setStatus(e.target.value)}
        options={STATUS_OPTIONS}
        placeholder="Select status"
      />
      <p className="text-muted-eco small mb-0">
        Changing the status will notify the customer and update their request timeline.
      </p>
    </Modal>
  );
}
