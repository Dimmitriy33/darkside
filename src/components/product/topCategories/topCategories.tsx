import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { apiGetCategories } from "@/api/apiProduct";
import imgBg1 from "images/dim1.png";
import imgBg2 from "images/dim2.png";
import imgBg3 from "images/dim3.png";
import styles from "./topCategories.module.scss";

export default function TopCategories(): JSX.Element {
  const intl = useIntl();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<string[]>([]);

  const images = [imgBg1, imgBg2, imgBg3];
  const getCategories = useCallback(async () => {
    const res = await apiGetCategories();

    if (res) {
      setCategories(res);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className={styles.categories}>
      {categories.length > 0 ? (
        <>
          <h3>
            <FormattedMessage id="TopCategories" />
          </h3>
          <div className={styles.categories__item__wrapper}>
            {categories.map((v, idx) => (
              <div className={styles.categories__item}>
                <div className={styles.categories__item_img}>
                  <img src={images[idx % 3]} alt={v} />
                </div>
                <p className={styles.categories__item_text}>{v}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <wup-spin />
      )}
    </div>
  );
}
