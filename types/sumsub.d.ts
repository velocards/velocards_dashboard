declare module '@sumsub/websdk' {
  export interface SumsubConfig {
    lang?: string;
    email?: string;
    phone?: string;
    theme?: {
      primaryColor?: string;
      successColor?: string;
      errorColor?: string;
      primaryTextColor?: string;
      secondaryTextColor?: string;
      primaryBackgroundColor?: string;
      secondaryBackgroundColor?: string;
      modalBackgroundColor?: string;
      borderRadius?: string;
    };
  }

  export interface SumsubOptions {
    addViewportTag?: boolean;
    adaptIframeHeight?: boolean;
  }

  export interface SumsubHandlers {
    onReady?: () => void;
    onTokenExpired?: () => void;
    onMessage?: (type: string, payload: any) => void;
    onError?: (error: any) => void;
    onActionSubmitted?: () => void;
  }

  export interface SumsubSDKInstance {
    launch: (element: HTMLElement | string) => void;
    on: (event: string, callback: (payload: any) => void) => void;
    cleanup: () => void;
  }

  const SumsubWebSdk: {
    init: (
      accessToken: string,
      tokenExpirationHandler: () => string | Promise<string>,
      config?: SumsubConfig,
      options?: SumsubOptions,
      handlers?: SumsubHandlers
    ) => SumsubSDKInstance;
  };

  export default SumsubWebSdk;
}