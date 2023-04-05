/* eslint-disable @typescript-eslint/ban-ts-comment */
import "./styles/main.scss";
import { Component, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { WUPFormElement, WUPTextControl } from "web-ui-pack";
// eslint-disable-next-line import/no-extraneous-dependencies
import smoothscroll from "smoothscroll-polyfill";
import { Provider } from "react-redux";
import { IntlProvider } from "react-intl";
import Store from "./redux";
import localeEn from "./locales/en.json";
import localeRu from "./locales/ru.json";
import MainRouter from "./mainRouter";

!(WUPFormElement && WUPTextControl) && console.warn("err");

interface AppProps {
  nothing: boolean;
}

interface AppState {
  isLogged: boolean;
  lang: string;
  locales: unknown;
}

// kick off the polyfill!
smoothscroll.polyfill(); // it fixes unsupporting scrollToOptions for Edge, IE, Safari: https://github.com/iamdustan/smoothscroll

class AppContainer extends Component<AppProps, AppState> {
  // ["constructor"]: typeof AppContainer;

  constructor(props: AppProps) {
    super(props);
    this.state = {
      isLogged: AppContainer.isLogged,
      lang: AppContainer.lang,
      locales: AppContainer.locales,
    };
    // test class-dead-code
    const goExlcude = true;
    if (!goExlcude) {
      console.warn("class-dead-code doesn't work", props.nothing);
    }
  }

  componentDidMount() {
    Store.subscribe(() => {
      const { lang } = AppContainer;
      if (this.state.lang !== lang) {
        this.setState({ lang });
      }
    });
  }

  static get isLogged() {
    return Store.getState().isLoggedIn;
  }

  static get locales() {
    return {
      en: localeEn,
      ru: localeRu,
    };
  }

  static get lang() {
    return Store.getState().lang;
  }

  render() {
    return (
      <StrictMode>
        {/** @ts-ignore */}
        <IntlProvider locale={this.state.lang} defaultLocale="en" messages={this.state.locales[this.state.lang]}>
          <Provider store={Store}>
            <MainRouter isLogged={this.state.isLogged} />
            {/* <FormattedMessage id="testText" />
            <button
              type="button"
              onClick={() => {
                Store.dispatch({
                  type: Types.SWITCHLANG,
                  data: {
                    lang: "ru",
                  },
                });
              }}
            >
              s
            </button> */}
          </Provider>
        </IntlProvider>
        {/* <div className="test-block">
          <h2 className={style.mainTitle}>{this.state.title}</h2>
        </div>
        <div className={["test-block", style.background].join(" ")}>
          <h2>Test-block for assets-module (previous url-loader)</h2>
          <img src={imgSmall} alt="smallImage" />
        </div>
        <div className={["test-block", style.svgBackground].join(" ")}>
          <h2>Test-block for assets-module (svg-url-loader)</h2>
          <img src={imgCamera} alt="small_SVG_Image" />
        </div>

        <wup-form class={style.form}>
          <wup-text name="TextControl" />
          <button type="submit">Submit</button>
        </wup-form> */}
      </StrictMode>
    );
  }
}

ReactDOM.createRoot(document.getElementById("app")!).render(<AppContainer nothing={false} />);
