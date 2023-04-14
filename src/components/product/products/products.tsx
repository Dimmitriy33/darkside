import { useNavigate } from "react-router-dom";
import Header from "@/components/base/header/header";
import { useCallback, useEffect, useState } from "react";
import { apiGetCategories, apiGetCreators, apiGetProducts } from "@/api/apiProduct";
import { FormattedMessage } from "react-intl";
import Slider from "rc-slider";
import TextControl from "@/elements/TextControl";
import { IProduct, ISearchModel } from "../productTypes";
import styles from "./products.module.scss";
import ProductCard from "../productCard/productCard";
import "rc-slider/assets/index.css";

export default function Products(): JSX.Element {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [creators, setCreators] = useState<string[]>([]);
  const [searchModel, setSearchModel] = useState<ISearchModel>({});
  const [rangeMinMax, setRangeMinMax] = useState([0, 1000]);
  const [rangeVpMinMax, setRangeVpMinMax] = useState([0, 100]);
  let timeoutPrice: NodeJS.Timeout | null = null;
  let timeoutVp: NodeJS.Timeout | null = null;

  const getProducts = useCallback(async (model: ISearchModel) => {
    const res = await apiGetProducts(model);

    if (res) {
      setTimeout(() => {
        setProducts(res);
      }, 300);
    }
  }, []);

  const getCategories = useCallback(async () => {
    const res = await apiGetCategories();

    if (res) {
      setCategories(res);
    }
  }, []);

  const getCreators = useCallback(async () => {
    const res = await apiGetCreators();

    if (res) {
      setCreators(res);
    }
  }, []);

  const updateSearchModel = useCallback(async (model: ISearchModel) => {
    setSearchModel(model);
    await getProducts(model);
  }, []);

  const updateTerm = (term?: string) => {
    if (searchModel.term !== term) {
      setProducts(null);
      updateSearchModel({
        ...searchModel,
        term,
      });
    }
  };

  const updateCategory = (category?: string) => {
    if (searchModel.category !== category) {
      setProducts(null);
      updateSearchModel({
        ...searchModel,
        category,
      });
    }
  };

  const updateCreator = (creator?: string) => {
    if (searchModel.creator !== creator) {
      setProducts(null);
      updateSearchModel({
        ...searchModel,
        creator,
      });
    }
  };

  const updatePrice = (priceMin: number, priceMax: number) => {
    if (searchModel.priceMin !== priceMin || searchModel.priceMax !== priceMax) {
      setProducts(null);
      updateSearchModel({
        ...searchModel,
        priceMin,
        priceMax,
      });
    }
  };

  const updateVp = (vpMin: number, vpMax: number) => {
    if (searchModel.priceMin !== vpMin || searchModel.priceMax !== vpMax) {
      setProducts(null);
      updateSearchModel({
        ...searchModel,
        vpMin,
        vpMax,
      });
    }
  };

  function debouncePrice(func: () => void, wait: number): void {
    timeoutPrice && clearTimeout(timeoutPrice);
    timeoutPrice = setTimeout(func, wait);
  }

  function debounceVp(func: () => void, wait: number): void {
    timeoutVp && clearTimeout(timeoutVp);
    timeoutVp = setTimeout(func, wait);
  }

  useEffect(() => {
    getProducts({});
    getCategories();
    getCreators();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.products}>
        <div className={styles.products__filters}>
          <div className={styles.products__filters__category}>
            <div>
              <FormattedMessage id="Categories" />
            </div>
            <button
              key="all_category"
              className={!searchModel.category ? styles.products__filters__category_selected : ""}
              type="button"
              onClick={() => {
                updateCategory(undefined);
              }}
            >
              <FormattedMessage id="All" />
            </button>
            {categories.map((v) => (
              <button
                key={v}
                className={searchModel.category === v ? styles.products__filters__category_selected : ""}
                type="button"
                onClick={() => {
                  updateCategory(v);
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <div className={styles.products__filters__category}>
            <div>
              <FormattedMessage id="Brands" />
            </div>
            <button
              key="all_creator"
              className={!searchModel.creator ? styles.products__filters__category_selected : ""}
              type="button"
              onClick={() => {
                updateCreator(undefined);
              }}
            >
              <FormattedMessage id="All" />
            </button>
            {creators.map((v) => (
              <button
                key={v}
                className={searchModel.creator === v ? styles.products__filters__category_selected : ""}
                type="button"
                onClick={() => {
                  updateCreator(v);
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <div className={styles.products__filters__range}>
            <div>
              <FormattedMessage id="Price" />
            </div>
            <div>
              <Slider
                marks={{
                  0: rangeMinMax[0],
                  1000: rangeMinMax[1],
                }}
                range
                min={0}
                max={1000}
                defaultValue={[0, 1000]}
                onAfterChange={(v) => {
                  const priceMin = (v as number[])[0];
                  const priceMax = (v as number[])[1];
                  debouncePrice(() => updatePrice(priceMin, priceMax), 100);
                }}
                onChange={(v) => {
                  const priceMin = (v as number[])[0];
                  const priceMax = (v as number[])[1];
                  setRangeMinMax([priceMin, priceMax]);
                }}
              />
            </div>
          </div>
          <div className={styles.products__filters__range}>
            <div>
              <FormattedMessage id="Vp" />
            </div>
            <div>
              <Slider
                marks={{
                  0: rangeVpMinMax[0],
                  100: rangeVpMinMax[1],
                }}
                range
                min={0}
                max={100}
                defaultValue={[0, 100]}
                onAfterChange={(v) => {
                  const vpMin = (v as number[])[0];
                  const vpMax = (v as number[])[1];
                  debounceVp(() => updateVp(vpMin, vpMax), 100);
                }}
                onChange={(v) => {
                  const vpMin = (v as number[])[0];
                  const vpMax = (v as number[])[1];
                  setRangeVpMinMax([vpMin, vpMax]);
                }}
              />
            </div>
          </div>
          <div className={styles.products__filters__price} />
        </div>
        <div className={styles.products__main}>
          <TextControl
            intlLabel="Search"
            init={(el) => {
              el.$options.validations = {
                required: false,
                max: 24,
                min: 2,
              };
            }}
          />
          {products ? (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {products.length > 0 ? (
                <>
                  <h3>
                    <FormattedMessage id="Products" /> ({products.length})
                  </h3>
                  <div className={styles.products__main__items}>
                    {products.map((product) => (
                      <ProductCard product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div>Empty result</div>
              )}
            </>
          ) : (
            <wup-spin />
          )}
        </div>
      </div>
    </>
  );
}
