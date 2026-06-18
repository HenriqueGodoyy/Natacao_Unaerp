type Props = {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function ChartCard({
  title,
  subtitle,
  children,
  className = '',
}: Props) {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
        {subtitle && (
          <p className="chart-card-subtitle">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}
