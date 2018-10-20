import * as React from 'react';

import { shallowEquals } from '../shallowEquals';
import { ReactElement } from '../types';

export interface IsBusy  {
  isBusy: boolean
}

export interface WithAsyncRenderingProps<T extends IsBusy> {
  children: (injectedProps: T) => ReactElement
  renderBusyComponent?: () => ReactElement
}

export interface WithAsyncRenderingState<InjectedProps> extends IsBusy {
  injectedProps: InjectedProps | null
}

export const withAsyncRendering = <Props, InjectedProps> (
  asyncAction: (props: Props) => Promise<InjectedProps | null>,
  initialState?: InjectedProps
) => {

  type ExtendedComponentProps = Props & WithAsyncRenderingProps<InjectedProps & IsBusy>

  return class extends React.Component<
    Props & WithAsyncRenderingProps<InjectedProps & IsBusy>
  > {
    constructor(props: ExtendedComponentProps) {
      super(props)
      this.dispatchAsyncAction = this.dispatchAsyncAction.bind(this)
    }

    state: WithAsyncRenderingState<InjectedProps> = {
      injectedProps: initialState,
      isBusy: true
    }

    async dispatchAsyncAction(props: Props) {
      this.setState({ isBusy: true })
      this.setState({ isBusy: false, injectedProps: await asyncAction(props) })
    }

    componentWillReceiveProps(nextProps: ExtendedComponentProps) {
      if (!shallowEquals(this.props, nextProps, ['children'])) {
        this.dispatchAsyncAction(nextProps)
      }
    }

    componentDidMount() {
      this.dispatchAsyncAction(this.props as any as Props)
    }

    render() {
      const { injectedProps, isBusy } = this.state
      const { renderBusyComponent } = this.props

      if (isBusy) {
        return renderBusyComponent ? renderBusyComponent() : null
      }

      return injectedProps
        ? this.props.children(Object.assign({}, injectedProps, { isBusy }))
        // case: async action did not resolve state
        : null
    }
  }
}
