import useTypedSelector from "@/redux/typedSelector";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormEl from "@/elements/FormControl";
import TextControl from "@/elements/TextControl";
import Header from "@/components/base/header/header";
import { apiResetPassword, apiTopUpBalance, apiUpdateUser } from "@/api/apiAccount";
import { toast } from "react-toastify";
import { FormattedMessage, useIntl } from "react-intl";
import { WUPHelpers } from "web-ui-pack";
import PasswordControl from "@/elements/PwdControl";
import NumberControl from "@/elements/NumberControl";
import styles from "./userPage.module.scss";
import { IUpdateUser, IUserResetPassword } from "../accountTypes";

export default function UserPage() {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isPending, setIsPending] = useState(false);
  const [isPendingResetP, setIsPendingResetP] = useState(false);
  const [sum, setSum] = useState(0);
  const [cardNumber, setCardNumber] = useState(0);
  const [cardCVC, setCardCVC] = useState(0);
  const initUser = useTypedSelector((u) => u.currentUser);

  const updateUser = useCallback(async (model: IUpdateUser) => {
    const res = await apiUpdateUser(model);

    if (res != null) {
      toast(intl.formatMessage({ id: "UpdatedSuccesfully" }), {
        type: "success",
      });
    }
  }, []);

  const resetPassword = useCallback(async (model: IUserResetPassword) => {
    const res = await apiResetPassword(model);

    if (res) {
      toast(intl.formatMessage({ id: "UpdatePassNorm" }), {
        type: "success",
      });
    } else {
      toast(intl.formatMessage({ id: "UpdatePassNeNorm" }), {
        type: "error",
      });
    }
  }, []);

  const getInitModel = () => {
    const m = {
      firstName: initUser?.firstName,
      lastName: initUser?.lastName,
      phone: initUser?.phone,
      email: initUser?.email,
    };

    return m;
  };

  return (
    <>
      <Header />
      <div className={styles.userPage}>
        <h3>
          <FormattedMessage id="UserPage" />
        </h3>
        {initUser ? (
          <>
            <div className={styles.userPage__elem}>
              <div className={styles.userPage__elem__form}>
                <h4>
                  <FormattedMessage id="UpdateUserInfo" />
                </h4>
                <FormEl
                  init={(el) => {
                    el.$initModel = getInitModel();
                    el.$onSubmit = (e) => {
                      const model = e.$model as IUpdateUser;

                      if (!WUPHelpers.isEqual(model, getInitModel())) {
                        setIsPending(true);
                        updateUser(model)
                          .then(() => {
                            setIsPending(false);
                          })
                          .catch(() => {
                            setIsPending(false);
                          });
                      } else {
                        toast(intl.formatMessage({ id: "NothingChanged" }), {
                          type: "error",
                        });
                      }
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

                  <button type="submit" disabled={isPending}>
                    Submit
                  </button>
                </FormEl>
              </div>
              <div className={styles.userPage__elem__form}>
                <h4>
                  <FormattedMessage id="ResetPassword" />
                </h4>
                <FormEl
                  init={(el) => {
                    el.$onSubmit = (e) => {
                      const model = e.$model as IUserResetPassword;

                      setIsPendingResetP(true);
                      resetPassword(model)
                        .then(() => {
                          setIsPendingResetP(false);
                        })
                        .catch(() => {
                          setIsPendingResetP(false);
                        });
                    };
                  }}
                >
                  <PasswordControl
                    intlLabel="Password"
                    init={(el) => {
                      el.$options.name = "oldPassword";
                      el.$options.autoComplete = false;
                      el.$options.validationShowAll = true;
                      el.$options.validations = {
                        required: true,
                        min: 6,
                        max: 18,
                      };
                    }}
                  />

                  <PasswordControl
                    intlLabel="ResetPassword"
                    init={(el) => {
                      el.$options.name = "newPassword";
                      el.$options.autoComplete = false;
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

                  <button type="submit" disabled={isPendingResetP}>
                    Submit
                  </button>
                </FormEl>
              </div>

              <div className={styles.userPage__elem__form}>
                <h4>
                  <FormattedMessage id="Balance" />
                </h4>

                <FormEl
                  init={(el) => {
                    el.$onSubmit = (e) => {
                      if (cardNumber.toString().length < 12) {
                        toast(intl.formatMessage({ id: "InvalidCardNumber" }), {
                          type: "error",
                        });
                        return;
                      }

                      if (cardCVC.toString().length < 3) {
                        toast(intl.formatMessage({ id: "InvalidCardCVC" }), {
                          type: "error",
                        });
                        return;
                      }

                      apiTopUpBalance(initUser.username, sum).then(() => {
                        setCardCVC(0);
                        setCardNumber(0);
                        setSum(0);
                      });
                    };
                  }}
                >
                  <NumberControl
                    intlLabel="Balance"
                    init={(el) => {
                      el.$options.name = "balance";
                      el.$options.disabled = true;
                      el.$initValue = initUser.balance;
                      el.$options.clearButton = false;
                      el.$options.validations = {
                        required: true,
                      };
                      el.$options.postfix = " USD";
                    }}
                  />

                  <NumberControl
                    intlLabel="TopUpBalance"
                    init={(el) => {
                      el.$options.name = "topUpBalance";
                      el.$options.validations = {
                        required: false,
                        min: 0,
                        max: 10000,
                      };
                      el.addEventListener("$change", (ev) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const v = ev.currentTarget?.$value;
                        setSum(v);
                      });
                      el.$options.postfix = " USD";
                    }}
                  />
                  <TextControl
                    intlLabel="CardNumber"
                    init={(el) => {
                      el.addEventListener("$change", (ev) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const v = ev.currentTarget?.$value;
                        setCardNumber(v);
                      });
                      el.$options.mask = "0000-0000-0000-0000";
                      el.$options.validations = {
                        required: false,
                      };
                    }}
                  />
                  <TextControl
                    intlLabel="CardCVC"
                    init={(el) => {
                      el.addEventListener("$change", (ev) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const v = ev.currentTarget?.$value;
                        setCardCVC(v);
                      });
                      el.$options.mask = "000";
                      el.$options.validations = {
                        required: false,
                      };
                    }}
                  />

                  <button type="submit" disabled={sum < 0}>
                    <FormattedMessage id="TopUpBalance" />
                  </button>
                </FormEl>
              </div>
            </div>
            <div />
          </>
        ) : (
          <wup-spin />
        )}
      </div>
    </>
  );
}
