/* eslint-disable react/jsx-no-useless-fragment */
import { createSearchParams, useNavigate } from "react-router-dom";
import FormEl from "@/elements/FormControl";
import { useCallback, useEffect, useState } from "react";
import { apiCreateProd, apiGetCategories, apiGetTastes } from "@/api/apiProduct";
import TextControl from "@/elements/TextControl";
import NumberControl from "@/elements/NumberControl";
import SelectControl from "@/elements/SelectControl";
import CheckControl from "@/elements/CheckControl";
import { FormattedMessage, useIntl } from "react-intl";
import FileUploadControl from "@/elements/fileUploadControl";
import { toast } from "react-toastify";
import { urlProduct } from "@/mainRouterPathes";
import Header from "@/components/base/header/header";
import { ICreateProduct, ITaste } from "../productTypes";
import styles from "./addProduct.module.scss";

export default function AddProduct(): JSX.Element {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isPending, setIsPending] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tastes, setTastes] = useState<ITaste[]>([]);
  const [mainPic, setMainPic] = useState<File | null>(null);
  const [secPics, setSecPics] = useState<File[] | null>(null);
  const [showMainPicSelector, setShowMainPicSelector] = useState(false);
  const [showAddPicSelector, setShowAddPicSelector] = useState(false);

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

  useEffect(() => {
    getCategories();
    getTastes();
  }, []);

  if (!categories || !tastes) {
    return <wup-spin />;
  }

  return (
    <>
      <Header />
      <div className={styles.addProd}>
        <h3>
          <FormattedMessage id="CreateProduct" />
        </h3>
        <FormEl
          init={(el) => {
            el.$onSubmit = (e) => {
              if (!mainPic) {
                toast(intl.formatMessage({ id: "SelectMainImage" }));
                return;
              }
              if (!mainPic || !secPics || secPics.length < 1) {
                toast(intl.formatMessage({ id: "SelectSecImage" }));
                return;
              }

              setIsPending(true);
              apiCreateProd({
                ...(e.$model as ICreateProduct),
                imageUrl: mainPic,
                images: secPics as File[],
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
            intlLabel="CreatorName"
            init={(el) => {
              el.$options.name = "creatorName";
              el.$options.validations = {
                required: true,
                max: 24,
                min: 4,
              };
            }}
          />
          <TextControl
            intlLabel="CreatorCountry"
            init={(el) => {
              el.$options.name = "creatorCountry";
              el.$options.validations = {
                required: true,
                max: 24,
                min: 3,
              };
            }}
          />
          <TextControl
            intlLabel="CreatorPhone"
            init={(el) => {
              el.$options.name = "creatorPhone";
              el.$options.validations = {
                required: true,
              };
              el.$options.mask = "+375(00) 000-00-00";
            }}
          />
          <TextControl
            intlLabel="CreatorCity"
            init={(el) => {
              el.$options.name = "creatorCity";
              el.$options.validations = {
                required: true,
                max: 24,
                min: 2,
              };
            }}
          />
          <TextControl
            intlLabel="CreatorStreet"
            init={(el) => {
              el.$options.name = "creatorStreet";
              el.$options.validations = {
                required: true,
                max: 24,
                min: 4,
              };
            }}
          />

          <NumberControl
            intlLabel="CreatorPostcode"
            init={(el) => {
              el.$options.name = "creatorPostcode";
              el.$options.validations = {
                required: true,
                max: 999999,
                min: 6,
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
          <div className={styles.addProd__main}>
            <span>
              <FormattedMessage id="MainImage" />
              <button type="button" disabled={mainPic != null} onClick={() => setShowMainPicSelector(true)}>
                <FormattedMessage id="Add" />
              </button>
            </span>
            {mainPic != null && (
              <div className={styles.addProd__main__img}>
                <img src={URL.createObjectURL(mainPic as File)} alt="mainimg" />
                <button type="button" onClick={() => setMainPic(null)}>
                  <FormattedMessage id="Remove" />
                </button>
              </div>
            )}
          </div>
          <div className={styles.addProd__sec}>
            <span>
              <FormattedMessage id="OtherImages" />
              <button type="button" onClick={() => setShowAddPicSelector(true)}>
                <FormattedMessage id="Add" />
              </button>
            </span>
            <div hidden={secPics == null || secPics.length < 1} className={styles.addProd__sec__imgs}>
              {secPics?.map((v, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i}>
                  <img src={URL.createObjectURL(v)} alt={`secimg${i}`} />
                  <button
                    type="button"
                    onClick={() => {
                      // eslint-disable-next-line eqeqeq
                      const newArr = secPics.filter((f) => f != v);
                      setSecPics(newArr);
                    }}
                  >
                    <FormattedMessage id="Remove" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {showMainPicSelector ? (
            <FileUploadControl updatePic={(v) => setMainPic(v)} onClosed={() => setShowMainPicSelector(false)} />
          ) : (
            <></>
          )}
          {showAddPicSelector ? (
            <FileUploadControl
              updatePic={(v) => setSecPics(secPics ? [...secPics, v] : [v])}
              onClosed={() => setShowAddPicSelector(false)}
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
