import { STATUS_COLORS } from '../constants';

export default function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`badge ${colorClass}`}>
      {status}
    </span>
  );
}

