import { Component } from 'react'
import type { ReactNode } from 'react'

interface SceneBoundaryProps {
  onError: () => void
  children: ReactNode
}

/** Swallows 3D failures (chunk load, shader compile, WebGL loss) so the poster and copy remain. */
export class SceneBoundary extends Component<SceneBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true }
  }

  componentDidCatch(): void {
    this.props.onError()
  }

  render(): ReactNode {
    return this.state.failed ? null : this.props.children
  }
}
