const STATUS_MAP = {
  pending:    { label: "Pending",    cls: "badge-warning" },
  paid:       { label: "Paid",       cls: "badge-primary" },
  processing: { label: "Processing", cls: "badge-warning" },
  shipped:    { label: "Shipped",    cls: "badge-primary" },
  delivered:  { label: "Delivered",  cls: "badge-success" },
  cancelled:  { label: "Cancelled",  cls: "badge-danger"  },
  failed:     { label: "Failed",     cls: "badge-danger"  },
};

const OrderBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { label: status, cls: "badge-warning" };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

export default OrderBadge;
