type Props = {
  message?: string
}

export default function LoadingSpinner({
  message = 'Carregando dados...',
}: Props) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-text">{message}</p>
    </div>
  )
}
