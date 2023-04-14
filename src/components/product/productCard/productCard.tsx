/* eslint-disable jsx-a11y/no-static-element-interactions */
import { FormattedMessage, useIntl } from "react-intl";
import { FiBriefcase, FiX, FiRepeat } from "react-icons/fi";
import { IconType } from "react-icons";
import { Tooltip } from "react-tooltip";
import { UserRoles } from "@/components/account/accountTypes";
import useTypedSelector from "@/redux/typedSelector";
import { apiDeleteProd } from "@/api/apiProduct";
import { IProduct } from "../productTypes";
import styles from "./productCard.module.scss";
import "react-tooltip/dist/react-tooltip.css";

export default function ProductCard({ product }: IProductCard) {
  const intl = useIntl();
  const user = useTypedSelector((state) => state.currentUser);

  const btns: IProductCardAction[] = [
    {
      icon: FiBriefcase,
      onClick: () => {
        console.log("Add to cart");
      },
      tooltip: intl.formatMessage({ id: "AddToCart" }),
      tooltipId: "AddToCart",
      isAdmin: false,
    },
    {
      icon: FiRepeat,
      tooltip: intl.formatMessage({ id: "Update" }),
      tooltipId: "Upd",
      onClick: () => {
        console.log("Update");
      },
      isAdmin: true,
    },
    {
      icon: FiX,
      tooltip: intl.formatMessage({ id: "Remove" }),
      tooltipId: "Rm",
      onClick: (id) => {
        apiDeleteProd(id);
      },
      isAdmin: true,
    },
  ];
  return (
    <div className={styles.productCard} key={product.name}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className={styles.productCard__top} id="card" onClick={() => console.log("got to prod page")}>
        <img src={product.imageUrl} alt={product?.name} />
        {product.salePerc && <span className={styles.productCard__top__salePerc}>-{product.salePerc}%</span>}

        <div className={styles.productCard__top__btn_icons}>
          {btns.map((btn) => (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {!btn.isAdmin || (btn.isAdmin && user?.role === UserRoles.admin) ? (
                <>
                  <Tooltip id={btn.tooltipId} />
                  <button
                    type="button"
                    key={btn.tooltipId + product.name}
                    data-tooltip-id={btn.tooltipId}
                    data-tooltip-content={btn.tooltip}
                    onClick={(e) => {
                      btn.onClick(product.id);
                      e.stopPropagation();
                    }}
                  >
                    <btn.icon />
                  </button>
                </>
              ) : null}
            </>
          ))}
        </div>
      </div>
      <div className={styles.productCard__bottom}>
        <div className={styles.productCard__bottom__creator}>
          <FormattedMessage id="By" />
          <span>{product.creatorFull.name}</span>
        </div>
        <span className={styles.productCard__bottom__name}>{product.name}</span>
        <div className={styles.productCard__bottom__price}>
          {product.salePerc && (
            <span className={styles.productCard__bottom__price__prev}>
              ${(product.price * product.salePerc).toFixed(2)}
            </span>
          )}
          <span
            className={[
              styles.productCard__bottom__price__current,
              product.salePerc ? styles.productCard__bottom__price__current_sale : "",
            ].join(" ")}
          >
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
}

export interface IProductCard {
  product: IProduct;
}

export interface IProductCardAction {
  icon: IconType;
  tooltip: string;
  tooltipId: string;
  onClick: (id: string) => void;
  isAdmin: boolean;
}
