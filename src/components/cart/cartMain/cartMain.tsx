/* eslint-disable max-classes-per-file */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarImage from "@/components/base/avatarImage/avatarImage";
import { IUser } from "@/components/account/accountTypes";
import Header from "@/components/base/header/header";
import { FormattedMessage, useIntl } from "react-intl";
import useTypedSelector from "@/redux/typedSelector";
import Store, { Types } from "@/redux";
import TextControl from "@/elements/TextControl";
import BaseButton from "@/elements/buttonBase/buttonBase";
import { toast } from "react-toastify";
import { apiCreatePurchase } from "@/api/apiPurchases";
import InputNumber from "@/elements/inputNumber/inputNumber";
import DataTable, { DataTableConfig } from "../../../elements/dataTable/dataTable";
import styles from "./cart.module.scss";
import { ICartElemBaseExt } from "../cartTypes";

export default function Cart(): React.ReactElement {
  const navigate = useNavigate();
  const intl = useIntl();
  const [showSpinner, setShowSpinner] = useState(false);
  const items = useTypedSelector((v) => v.cart);
  const user = useTypedSelector((v) => v.currentUser);
  const [cardNumber, setCardNumber] = useState(0);
  const [cardCVC, setCardCVC] = useState(0);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const dtConfig: DataTableConfig<ICartElemBaseExt> = {
    headerKeys: [
      {
        propName: "product",
        text: intl.formatMessage({ id: "Product" }),
        render: (_v, item) => (
          <AvatarImage
            user={
              {
                firstName: item.product.name,
                lastName: "",
              } as IUser
            }
            image={item.product.imageUrl}
          />
        ),
      },
      {
        propName: "count",
        text: intl.formatMessage({ id: "Count" }),
        render: (_v, item) => (
          <InputNumber
            maxV={item.product.amount}
            minV={0}
            initValue={item.count}
            triggerUpdate={(value) => {
              if (item.count > value) {
                Store.dispatch({
                  type: Types.REMOVE_FROM_CART,
                  data: item.product.id,
                });
              } else {
                Store.dispatch({
                  type: Types.ADD_TO_CART,
                  data: item.product,
                });
              }
            }}
          />
        ),
      },
      {
        propName: "productId",
        text: intl.formatMessage({ id: "TotalPrice" }),
        render: (_v, item) => {
          const price = item.product.salePerc
            ? (item.product.price * ((100 - item.product.salePerc) / 100)).toFixed(2)
            : item.product.price;

          return `${Number(price) * item.count}$`;
        },
      },
    ],
  };

  const getFullPrice = () =>
    items.reduce((accumulator, item) => {
      const price =
        Number(
          item.product.salePerc
            ? (item.product.price * ((100 - item.product.salePerc) / 100)).toFixed(2)
            : item.product.price
        ) * item.count;

      return price + accumulator;
    }, 0);

  const handleSubmit = () => {
    if (Number(user?.balance) < getFullPrice()) {
      toast(intl.formatMessage({ id: "NotEnoughMoney" }), {
        type: "error",
      });
      return;
    }

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

    setDisableSubmit(true);
    apiCreatePurchase(items)
      .then((v) => {
        if (v) {
          toast(intl.formatMessage({ id: "SuccessFullPurchase" }), {
            type: "success",
          });
          setDisableSubmit(false);
          setCardNumber(0);
          setCardCVC(0);
        }
      })
      .catch(() => {
        setDisableSubmit(false);
      });
  };

  return (
    <>
      <Header />
      <div className={styles.cart}>
        <h3>
          <FormattedMessage id="Cart" />
        </h3>
        <div className={styles.cart__body}>
          <div className={styles.cart__body__table}>
            <DataTable
              //
              items={items}
              config={dtConfig}
              getRowKey={(item) => item.productId}
              isShowSpinner={showSpinner}
            />
          </div>
          <div className={styles.cart__body__checkout}>
            <div className={styles.cart__body__checkout__header}>
              <FormattedMessage id="Summary" />
            </div>
            <div className={styles.cart__body__checkout__element}>
              <div>
                <FormattedMessage id="TotalPrice" />
              </div>
              <div>{getFullPrice()}$</div>
            </div>
            <div className={styles.cart__body__checkout__element}>
              <div>
                <FormattedMessage id="CardNumber" />
              </div>
              <div>
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
              </div>
            </div>
            <div className={styles.cart__body__checkout__element}>
              <div>
                <FormattedMessage id="CardCVC" />
              </div>
              <div>
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
              </div>
            </div>
            <BaseButton
              className={styles.cart__body__checkout__btnSbmt}
              intlText="Submit"
              disabled={disableSubmit || items.length < 1}
              onClick={() => {
                handleSubmit();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
