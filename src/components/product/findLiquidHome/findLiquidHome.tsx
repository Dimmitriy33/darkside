import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import BaseButton from "@/elements/buttonBase/buttonBase";
import imgBg1 from "images/bg-get-taste-jpg.jpg";
import styles from "./findLiquidHome.module.scss";

export default function FindLiquidHome(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className={styles.findLiquid}>
      <img src={imgBg1} alt="img" />
      <h3>
        <FormattedMessage id="FindLiquid" />
      </h3>
      <BaseButton onClick={() => alert("ok")} intlText="ShopNow" type="button" />
    </div>
  );
}
