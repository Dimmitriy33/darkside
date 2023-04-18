/* eslint-disable react/jsx-no-useless-fragment */
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import FormEl from "@/elements/FormControl";
import { useCallback, useEffect, useState } from "react";
import { apiGetCategories, apiGetProduct, apiGetTastes, apiUpdateProd, apiUpdateProdMainImage } from "@/api/apiProduct";
import TextControl from "@/elements/TextControl";
import NumberControl from "@/elements/NumberControl";
import SelectControl from "@/elements/SelectControl";
import CheckControl from "@/elements/CheckControl";
import { FormattedMessage, useIntl } from "react-intl";
import FileUploadControl from "@/elements/fileUploadControl";
import { toast } from "react-toastify";
import { urlProduct, urlProducts } from "@/mainRouterPathes";
import Header from "@/components/base/header/header";
import { IProduct, ITaste } from "../productTypes";
import styles from "./updateProduct.module.scss";

export default function UpdateProduct(): JSX.Element {
  const navigate = useNavigate();
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tastes, setTastes] = useState<ITaste[]>([]);
  const [mainPic, setMainPic] = useState<string>("");
  const [showMainPicSelector, setShowMainPicSelector] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function removeEmptyProps(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
        delete obj[key];
      }
    });
    return obj;
  }

  const getCategories = useCallback(async () => {
    const res = await apiGetCategories();

    if (res) {
      setCategories(res);
    }
  }, []);

  const getTastes = useCallback(async () => {
    const res = await apiGetTastes();

    if (res) {
      setTastes(res);
    }
  }, []);

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
      setMainPic(v.imageUrl);
    });
    getCategories();
    getTastes();
  }, []);

  if (!product || !categories || !tastes || !categories.length || !tastes.length) {
    return <wup-spin />;
  }

  return (
    <>
      <Header />
      <div className={styles.updProd}>
        <h3>
          <FormattedMessage id="UpdateProduct" />
        </h3>
        <FormEl
          init={(el) => {
            const initM = {
              ...product,
              tastesIds: product?.tastes?.map((v) => v.taste.id) || [],
              category: product?.category,
            };
            el.$initModel = removeEmptyProps(initM);
            el.$onSubmit = (e) => {
              if (!mainPic) {
                toast(intl.formatMessage({ id: "SelectMainImage" }));
                return;
              }

              setIsPending(true);
              apiUpdateProd({
                id: product?.id as string,
                name: e.$model.name,
                description: e.$model.description,
                category: e.$model.category,
                price: e.$model.price,
                amount: e.$model.amount,
                salePerc: e.$model.salePerc,
                length: e.$model.length,
                width: e.$model.width,
                height: e.$model.height,
                weight: e.$model.weight,
                strength: e.$model.strength,
                capacity: e.$model.capacity,
                vp: e.$model.vp,
                isHidden: e.$model.isHidden,
                tastesIds: e.$model.tastesIds,
              })
                .then((v) => {
                  setIsPending(false);
                  navigate({
                    pathname: urlProduct,
                    search: createSearchParams({
                      id: v.id,
                    }).toString(),
                  });
                })
                .catch(() => {
                  setIsPending(false);
                });
            };
          }}
        >
          <TextControl
            intlLabel="Name"
            init={(el) => {
              el.$options.name = "name";
              el.$options.validations = {
                required: true,
                max: 24,
                min: 3,
              };
            }}
          />

          <TextControl
            intlLabel="Description"
            init={(el) => {
              el.$options.name = "description";
              el.$options.validations = {
                required: true,
                max: 2000,
                min: 100,
              };
            }}
          />
          <SelectControl
            intlLabel="Category"
            init={(el) => {
              el.$options.name = "category";
              el.$options.items = categories.map((v) => ({
                text: v,
                value: v,
              }));

              el.$options.validations = {
                required: true,
              };
            }}
          />
          <SelectControl
            intlLabel="Tastes"
            init={(el) => {
              el.$options.name = "tastesIds";
              el.$options.multiple = true;
              el.$options.items = tastes.map((v) => ({
                text: v.name,
                value: v.id,
              }));
            }}
          />

          <NumberControl
            intlLabel="Price"
            init={(el) => {
              el.$options.name = "price";
              el.$options.postfix = " USD";
              el.$options.prefix = "$ ";
              el.$options.format = { maxDecimal: 2 };
              el.$options.validations = {
                required: true,
                min: 1,
              };
            }}
          />

          <NumberControl
            intlLabel="Amount"
            init={(el) => {
              el.$options.name = "amount";
              el.$options.validations = {
                required: true,
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="SalePerc"
            init={(el) => {
              el.$options.name = "salePerc";
              el.$options.postfix = " %";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="Length"
            init={(el) => {
              el.$options.name = "length";
              el.$options.postfix = " mm";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="Width"
            init={(el) => {
              el.$options.name = "width";
              el.$options.postfix = " mm";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="Height"
            init={(el) => {
              el.$options.name = "height";
              el.$options.postfix = " mm";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="Weight"
            init={(el) => {
              el.$options.name = "weight";
              el.$options.postfix = " grams";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="Strength"
            init={(el) => {
              el.$options.name = "strength";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="Capacity"
            init={(el) => {
              el.$options.name = "capacity";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <NumberControl
            intlLabel="Vp"
            init={(el) => {
              el.$options.name = "vp";
              el.$options.validations = {
                min: 1,
              };
            }}
          />
          <CheckControl
            intlLabel="Hidden"
            init={(el) => {
              el.$options.name = "isHidden";
              el.$options.validations = {
                required: true,
              };
            }}
          />
          <div className={styles.updProd__main}>
            <span>
              <FormattedMessage id="MainImage" />
              <button type="button" onClick={() => setShowMainPicSelector(true)}>
                <FormattedMessage id="Add" />
              </button>
            </span>
            {mainPic != null && (
              <div className={styles.updProd__main__img}>
                <img src={mainPic} alt="mainimg" />
              </div>
            )}
          </div>

          {showMainPicSelector ? (
            <FileUploadControl
              updatePic={(v) => {
                apiUpdateProdMainImage(product?.id as string, v).then((u) => {
                  setMainPic(u.imageUrl);
                  setShowMainPicSelector(false);
                });
              }}
              onClosed={() => setShowMainPicSelector(false)}
            />
          ) : (
            <></>
          )}
          <button type="submit" disabled={isPending}>
            Submit
          </button>
        </FormEl>
      </div>
    </>
  );
}
