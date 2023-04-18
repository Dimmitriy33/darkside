/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Header from "@/components/base/header/header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { urlProducts } from "@/mainRouterPathes";
import { FormattedMessage, useIntl } from "react-intl";
import { apiGetProduct } from "@/api/apiProduct";
import BaseButton from "@/elements/buttonBase/buttonBase";
import imgBg1 from "images/prodIntro.jpg";
import { toast } from "react-toastify";
import imgBg2 from "images/characteristics.jpg";
import useTypedSelector from "@/redux/typedSelector";
import Store, { Types } from "@/redux";
import InputNumber from "@/elements/inputNumber/inputNumber";
import styles from "./product.module.scss";
import { IProduct } from "../productTypes";

export default function Product(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const navigate = useNavigate();
  const intl = useIntl();
  const cartNum = useTypedSelector((state) => state.cart.find((v) => v.productId === product?.id)?.count || 0);

  const getProduct = useCallback(async (id: string) => {
    const res = await apiGetProduct(id);
    if (res) {
      setProduct(res);
    } else {
      navigate(urlProducts);
    }

    return res;
  }, []);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id == null) {
      navigate(urlProducts);
    }

    getProduct(id as string).then((v) => {
      setSelectedImage(v.imageUrl);
    });
  }, []);

  return (
    <>
      <Header />
      <div className={styles.product}>
        {product ? (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            <div className={styles.product__main}>
              <div className={styles.product__main__photo}>
                <div className={styles.product__main__photo__primary}>
                  <img src={selectedImage} alt="main prod img" />
                </div>
                <div className={styles.product__main__photo__secondary}>
                  <div
                    className={styles.product__main__photo__secondary__item}
                    onClick={() => setSelectedImage(product.imageUrl)}
                  >
                    <img src={product.imageUrl} alt={`${product.name}_image_0`} />
                  </div>
                  {product.images.map((v, i) => (
                    <div
                      className={styles.product__main__photo__secondary__item}
                      key={v.imageUrl}
                      onClick={() => setSelectedImage(v.imageUrl)}
                    >
                      <img src={v.imageUrl} alt={`${product.name}_image_${i}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.product__main__info}>
                <h2>{product.name}</h2>
                <div className={styles.product__main__info__price}>
                  {product.salePerc && (
                    <span className={styles.product__main__info__price__prev}>
                      ${(product.price * ((100 - product.salePerc) / 100)).toFixed(2)}
                    </span>
                  )}
                  <span
                    className={[
                      styles.product__main__info__price__current,
                      product.salePerc ? styles.product__main__info__price__current_sale : "",
                    ].join(" ")}
                  >
                    ${product.price}
                  </span>
                </div>
                <div className={styles.product__main__info__amount}>
                  <div>
                    <FormattedMessage id="Amount" />:
                  </div>
                  <div className={styles.product__main__info__amount__val}>{product.amount}</div>
                </div>
                <div className={styles.product__main__info__creator}>
                  <div>
                    <FormattedMessage id="SoldBy" />
                  </div>
                  <div className={styles.product__main__info__creator__name}>{product.creatorFull.name}</div>
                </div>
                {product.creatorFull.phone || product.creatorFull.address != null ? (
                  <div className={styles.product__main__info__creator__info}>
                    <div hidden={!product.creatorFull.phone}>
                      <FormattedMessage id="Phone" />: {product.creatorFull.phone}
                    </div>
                    <div hidden={!product.creatorFull.address?.country}>
                      <FormattedMessage id="Country" />: {product.creatorFull.address.country}
                    </div>
                    <div hidden={!product.creatorFull.address?.city}>
                      <FormattedMessage id="City" />: {product.creatorFull.address.city}
                    </div>
                    <div hidden={!product.creatorFull.address?.street}>
                      <FormattedMessage id="Street" />: {product.creatorFull.address.street}
                    </div>
                    <div hidden={!product.creatorFull.address?.postcode}>
                      <FormattedMessage id="Postcode" />: {product.creatorFull.address.postcode}
                    </div>
                  </div>
                ) : null}

                <div className={styles.product__main__info__actions}>
                  <BaseButton
                    intlText="AddToCart"
                    onClick={() => {
                      Store.dispatch({
                        type: Types.ADD_TO_CART,
                        data: product,
                      });

                      toast(intl.formatMessage({ id: "SuccessfullyAddetToCart" }), {
                        type: "success",
                      });
                    }}
                  />

                  {cartNum ? (
                    <>
                      <div className={styles.product__main__info__actions__amount}>
                        <InputNumber
                          maxV={product.amount}
                          minV={0}
                          disabled
                          initValue={cartNum}
                          value={cartNum}
                          triggerUpdate={(value) => {
                            if (cartNum > value) {
                              Store.dispatch({
                                type: Types.REMOVE_FROM_CART,
                                data: product.id,
                              });
                            } else {
                              Store.dispatch({
                                type: Types.ADD_TO_CART,
                                data: product,
                              });
                            }
                          }}
                        />
                      </div>
                      <BaseButton
                        className={styles.product__main__info__actions__rm}
                        intlText="RemoveFromCart"
                        onClick={() => {
                          Store.dispatch({
                            type: Types.REMOVE_FROM_CART,
                            data: product.id,
                          });

                          toast(intl.formatMessage({ id: "SuccessfullyRemoveFromCart" }), {
                            type: "warning",
                          });
                        }}
                      />
                    </>
                  ) : null}
                </div>
                <div className={styles.product__main__info__category}>
                  <FormattedMessage id="Category" />:<span>{product.category}</span>
                </div>
              </div>
            </div>
            <div className={styles.product__desc}>
              <h3>
                <FormattedMessage id="Description" />
              </h3>
              <div className={styles.product__desc__intro}>
                <img src={imgBg1} alt="prod intro" />
                <p>
                  <FormattedMessage id="ProdIntro" />
                </p>
              </div>
              <div className={styles.product__desc__characteristics}>
                <div className={styles.product__desc__characteristics__items}>
                  <h4>
                    <FormattedMessage id="Product" /> <FormattedMessage id="Description" />
                  </h4>
                  <p>{product.description}</p>
                </div>
                <div className={styles.product__desc__characteristics__img}>
                  <img src={product.images[0].imageUrl} alt="prod chars" />
                </div>
              </div>
              <div className={styles.product__desc__characteristics}>
                <div className={styles.product__desc__characteristics__img}>
                  <img src={imgBg2} alt="prod chars" />
                </div>
                <div className={styles.product__desc__characteristics__items}>
                  <h4>
                    <FormattedMessage id="Characteristics" />
                  </h4>
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <FormattedMessage id="Name" />
                        </th>
                        <th>
                          <FormattedMessage id="Value" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr hidden={!product.length}>
                        <td>
                          <FormattedMessage id="Length" />
                          (mm)
                        </td>
                        <td>{product.length}</td>
                      </tr>
                      <tr hidden={!product.width}>
                        <td>
                          <FormattedMessage id="Width" />
                          (mm)
                        </td>
                        <td>{product.width}</td>
                      </tr>
                      <tr hidden={!product.height}>
                        <td>
                          <FormattedMessage id="Height" />
                          (mm)
                        </td>
                        <td>{product.height}</td>
                      </tr>
                      <tr hidden={!product.weight}>
                        <td>
                          <FormattedMessage id="Weight" />
                          (grams)
                        </td>
                        <td>{product.weight}</td>
                      </tr>
                      <tr hidden={!product.strength}>
                        <td>
                          <FormattedMessage id="Strength" />
                        </td>
                        <td>{product.strength}</td>
                      </tr>
                      <tr hidden={!product.capacity}>
                        <td>
                          <FormattedMessage id="Capacity" />
                        </td>
                        <td>{product.capacity}</td>
                      </tr>
                      <tr hidden={!product.tastes || product.tastes.length < 1}>
                        <td>
                          <FormattedMessage id="Tastes" />
                        </td>
                        <td>{product.tastes?.map((v) => v.taste.name).join(", ")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className={styles.product__desc__warn}>
                <h4>
                  <FormattedMessage id="Warning" />
                </h4>
                <p>
                  <FormattedMessage id="ProdWarn" />
                </p>
              </div>
            </div>
          </>
        ) : (
          <wup-spin />
        )}
      </div>
    </>
  );
}
