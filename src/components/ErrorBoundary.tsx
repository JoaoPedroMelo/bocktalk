import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  error: Error | null;
}

/** Shows what broke instead of an empty page, and offers a clean restart. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[app] render error:', error, info.componentStack);
  }

  restart = () => {
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-lg flex-col justify-center gap-4 px-4">
        <h1 className="text-xl font-extrabold">Algo deu errado nesta tela</h1>
        <p className="text-muted">A partida atual foi perdida. Recomece pelo início; se voltar a acontecer, envie a mensagem abaixo.</p>
        <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-lg bg-surface p-3 text-sm text-stop">
          {error.message}
          {'\n'}
          {error.stack?.split('\n').slice(1, 6).join('\n')}
        </pre>
        <p className="text-sm text-muted">{navigator.userAgent}</p>
        <button type="button" className="btn-primary self-start" onClick={this.restart}>
          Recomeçar
        </button>
      </main>
    );
  }
}
