import * as React from 'react';

import { shallowEquals } from '../commons/shallowEquals';

export interface WithAsyncRenderingState  {
  isBusy: boolean
}

export interface WithAsyncRenderingProps<T extends WithAsyncRenderingState> {
  children: (injectedProps: T) => React.Component | JSX.Element | React.Component[] | JSX.Element[]
}

export const withAsyncRendering = <P, S> (
  asyncAction: (props: P) => Promise<S>,
  renderLoader?: () => React.Component | JSX.Element,
  initialState?: S
) =>

  class extends React.Component<
    P & WithAsyncRenderingProps<WithAsyncRenderingState & S>,
    WithAsyncRenderingState & S
  > {
    constructor(props: P & WithAsyncRenderingProps<WithAsyncRenderingState & S>) {
      super(props)

      this.dispatchAsyncAction = this.dispatchAsyncAction.bind(this)
    }

    state: WithAsyncRenderingState & S = Object.assign(
      {},
      initialState,
      { isBusy: true }
    )

    async dispatchAsyncAction(props: P) {
      this.setState({ isBusy: true })

      const resultState = await asyncAction(props)
      this.setState(Object.assign({}, resultState, { isBusy: false }))
    }

    componentWillReceiveProps(nextProps: WithAsyncRenderingProps<WithAsyncRenderingState & S>) {
      if (!shallowEquals(this.props, nextProps, ['children'])) {
        this.dispatchAsyncAction(nextProps as any as P)
      }
    }

    componentDidMount() {
      this.dispatchAsyncAction(this.props as any as P)
    }

    render() {
      if (this.state.isBusy && renderLoader) {
        return renderLoader()
      }

      return this.props.children(this.state)
    }
  }
