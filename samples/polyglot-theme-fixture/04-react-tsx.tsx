type Props = { label: string; disabled?: boolean };

export const ActionButton = ({ label, disabled = false }: Props) => (
  <button type="button" aria-label={label} disabled={disabled}>
    <span>{label}</span>
  </button>
);
