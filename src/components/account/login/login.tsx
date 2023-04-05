import { FormattedMessage, useIntl } from "react-intl";
import { useCallback, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { apiLogin, apiRegister } from "@/api/apiAccount";
import { useNavigate } from "react-router-dom";
import { urlHome } from "@/mainRouterPathes";
import { ToastContainer, toast } from "react-toastify";
import { initRegisterState } from "../accountInitStates";
import styles from "./login.module.scss";
import { IUserLogin, IUserRegister } from "../accountTypes";
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const login = useCallback(async (model: IUserLogin) => {
    const res = await apiLogin(model).catch((err) => {
      toast(err.message || "Failed to Login!");
    });

    if (typeof res === "string") {
      toast(res);
    } else {
      navigate(urlHome);
    }
  }, []);

  const register = useCallback(async (model: IUserRegister) => {
    const res = await apiRegister(model).catch((err) => {
      toast(err.message || "Failed to Register!");
    });

    if (typeof res === "string") {
      toast(res);
    } else {
      navigate(urlHome);
    }
  }, []);

  return (
    <div className={styles.login}>
      <div className={styles.loginBody}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <div className={styles.loginSwitch}>
          <button type="button" onClick={() => setIsRegister(true)}>
            <span className={styles.loginSwitchBox}>
              <FormattedMessage id="Register" />
            </span>
          </button>
          <button type="button" onClick={() => setIsRegister(false)}>
            <span className={styles.loginSwitchBox}>
              <FormattedMessage id="Login" />
            </span>
          </button>
        </div>

        <div hidden={!isRegister} className={styles.formAcc}>
          <wup-form
            ref={(el) => {
              if (el) {
                el.$initModel = initRegisterState;
                el.$onSubmit = (e) => {
                  setIsPending(true);
                  register(e.$model as IUserRegister);
                };
              }
            }}
          >
            <wup-text
              name="firstName"
              label={intl.formatMessage({ id: "FirstName" })}
              ref={(el) => {
                if (el) {
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 2,
                  };
                }
              }}
            />
            <wup-text
              name="lastName"
              label={intl.formatMessage({ id: "LastName" })}
              ref={(el) => {
                if (el) {
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 2,
                  };
                }
              }}
            />
            <wup-text
              name="username"
              label={intl.formatMessage({ id: "Username" })}
              ref={(el) => {
                if (el) {
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 4,
                  };
                }
              }}
            />
            <wup-text
              name="email"
              label={intl.formatMessage({ id: "Email" })}
              ref={(el) => {
                if (el) {
                  el.$options.validations = {
                    required: true,
                    email: true,
                  };
                }
              }}
            />
            <wup-text
              name="phone"
              label={intl.formatMessage({ id: "Phone" })}
              ref={(el) => {
                if (el) {
                  el.$options.validations = {
                    required: true,
                  };
                  el.$options.mask = "+375(00) 000-00-00";
                }
              }}
            />
            {/* label={intl.formatMessage({ id: "Password" })} */}
            <wup-pwd
              name="password"
              label="PWD"
              ref={(el) => {
                if (el) {
                  el.$options.validations = {
                    required: true,
                    min: 6,
                    max: 18,
                    minNumber: 1,
                    minUpper: 1,
                    minLower: 1,
                    special: { min: 1, chars: "#!-_?,.@:;'" },
                  };
                }
              }}
            />
            <button type="submit" disabled={isPending}>
              Submit
            </button>
          </wup-form>
        </div>
        {/* <div hidden={isRegister} className={styles.formAcc}>
          <wup-form
            ref={(el) => {
              if (el) {
                el.$initModel = initLoginState;
                el.$onSubmit = (e) => {
                  setIsPending(true);
                  login(e.$model as IUserLogin);
                };
              }
            }}
          >
            <wup-text
              name="username"
              label={intl.formatMessage({ id: "Username" })}
              ref={(el) => {
                if (el) {
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 4,
                  };
                }
              }}
            />
            <wup-pwd
              name="password"
              label={intl.formatMessage({ id: "Password" })}
              autocomplete="off"
              ref={(el) => {
                if (el && el.$options) {
                  el.$options.validations = {
                    required: true,
                    min: 6,
                    max: 18,
                    minNumber: 1,
                    minUpper: 1,
                    minLower: 1,
                    special: { min: 1, chars: "#!-_?,.@:;'" },
                  };
                }
              }}
            />
            <button type="submit" disabled={isPending}>
              Submit
            </button>
          </wup-form>
        </div> */}
      </div>
    </div>
  );
}

export default LoginPage;
