import { Component, type ReactNode, type ErrorInfo } from 'react'
import ErrorState from './ui/ErrorState'

type Props = { children: ReactNode }
type State = { erro: Error | null }

/**
 * Captura erros de renderização em qualquer lugar da árvore abaixo
 * dele e mostra uma tela de erro amigável em vez de uma página em branco.
 * Error boundaries precisam ser componentes de classe.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { erro: null }

  static getDerivedStateFromError(erro: Error): State {
    return { erro }
  }

  componentDidCatch(erro: Error, info: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', erro, info)
  }

  render() {
    if (this.state.erro) {
      return (
        <ErrorState
          title="Algo deu errado"
          message={this.state.erro.message}
        />
      )
    }

    return this.props.children
  }
}
