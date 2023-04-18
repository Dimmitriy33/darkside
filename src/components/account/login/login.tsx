import { FormattedMessage } from "react-intl";
import { useCallback, useState } from "react";
import { apiLogin, apiRegister } from "@/api/apiAccount";
import { useNavigate } from "react-router-dom";
import { urlHome } from "@/mainRouterPathes";
import TextControl from "@/elements/TextControl";
import PasswordControl from "@/elements/PwdControl";
import FormEl from "@/elements/FormControl";
import Header from "@/components/base/header/header";
import { initLoginState, initRegisterState } from "../accountInitStates";
import styles from "./login.module.scss";
import { IUserLogin, IUserRegister } from "../accountTypes";

function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const login = useCallback(async (model: IUserLogin) => {
    const res = await apiLogin(model);
    if (res != null) {
      navigate(urlHome);
    }
  }, []);

  const register = useCallback(async (model: IUserRegister) => {
    const res = await apiRegister(model);

    if (res != null) {
      navigate(urlHome);
    }
  }, []);

  return (
    <>
      <Header />
      <div className={styles.login}>
        <div className={styles.loginBody}>
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
            <FormEl
              init={(el) => {
                el.$initModel = initRegisterState;
                el.$onSubmit = (e) => {
                  setIsPending(true);
                  register(e.$model as IUserRegister)
                    .then(() => {
                      setIsPending(false);
                    })
                    .catch(() => {
                      setIsPending(false);
                    });
                };
              }}
            >
              <TextControl
                intlLabel="FirstName"
                init={(el) => {
                  el.$options.name = "firstName";
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 2,
                  };
                }}
              />

              <TextControl
                intlLabel="LastName"
                init={(el) => {
                  el.$options.name = "lastName";
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 2,
                  };
                }}
              />

              <TextControl
                intlLabel="Username"
                init={(el) => {
                  el.$options.name = "username";
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 4,
                  };
                }}
              />

              <TextControl
                intlLabel="Email"
                init={(el) => {
                  el.$options.name = "email";
                  el.$options.validations = {
                    required: true,
                    email: true,
                  };
                }}
              />

              <TextControl
                intlLabel="Phone"
                init={(el) => {
                  el.$options.name = "phone";
                  el.$options.validations = {
                    required: true,
                  };
                  el.$options.mask = "+375(00) 000-00-00";
                }}
              />

              <PasswordControl
                intlLabel="Password"
                init={(el) => {
                  el.$options.name = "password";
                  el.$options.validationShowAll = true;
                  el.$options.validations = {
                    required: true,
                    min: 6,
                    max: 18,
                    minNumber: 1,
                    minUpper: 1,
                    minLower: 1,
                    special: { min: 1, chars: "#!-_?,.@:;'" },
                  };
                }}
              />
              <button type="submit" disabled={isPending}>
                Submit
              </button>
            </FormEl>
          </div>
          <div hidden={isRegister} className={styles.formAcc}>
            <FormEl
              init={(el) => {
                el.$initModel = initLoginState;
                el.$onSubmit = (e) => {
                  setIsPending(true);
                  login(e.$model as IUserLogin)
                    .then(() => {
                      setIsPending(false);
                    })
                    .catch(() => {
                      setIsPending(false);
                    });
                };
              }}
            >
              <TextControl
                intlLabel="Username"
                init={(el) => {
                  el.$options.name = "username";
                  el.$options.validations = {
                    required: true,
                    max: 24,
                    min: 4,
                  };
                }}
              />
              <PasswordControl
                intlLabel="Password"
                init={(el) => {
                  el.$options.name = "password";
                  el.$options.validationShowAll = true;
                  el.$options.validations = {
                    required: true,
                    min: 6,
                    max: 18,
                    // minNumber: 1,
                    // minUpper: 1,
                    // minLower: 1,
                    // special: { min: 1, chars: "#!-_?,.@:;'" },
                  };
                }}
              />
              <button type="submit" disabled={isPending}>
                Submit
              </button>
            </FormEl>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
