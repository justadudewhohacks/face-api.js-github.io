import * as React from 'react';

import { shallowEquals } from '../commons/shallowEquals';

export interface IsBusy  {
  isBusy: boolean
}

export interface WithAsyncRenderingProps<T extends IsBusy> {
  children: (injectedProps: T) => React.Component | JSX.Element | React.Component[] | JSX.Element[]
}

export interface WithAsyncRenderingState<InjectedProps> extends IsBusy {
  injectedProps: InjectedProps | null
}

export const withAsyncRendering = <Props, InjectedProps> (
  asyncAction: (props: Props) => Promise<InjectedProps | null>,
  renderLoader?: () => React.Component | JSX.Element,
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

      if (isBusy && renderLoader) {
        return renderLoader()
      }

      return injectedProps
        ? this.props.children(Object.assign({}, injectedProps, { isBusy }))
        // case: async action did not resolve state
        : null
    }
  }
}
