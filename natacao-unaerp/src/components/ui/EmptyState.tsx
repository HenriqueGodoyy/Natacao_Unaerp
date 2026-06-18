type Props = {
  icon?: string
  title: string
  message: string
}

export default function EmptyState({
  icon = '🏊',
  title,
  message,
}: Props) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
    </div>
  )
}
