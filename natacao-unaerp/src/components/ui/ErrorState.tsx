type Props = {
  title?: string
  message?: string
}

/**
 * Estado de erro reutilizável (antes duplicado nas páginas).
 */
export default function ErrorState({
  title = 'Erro ao carregar dados',
  message,
}: Props) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{title}</h3>
      {message && <p className="error-message">{message}</p>}
    </div>
  )
}
