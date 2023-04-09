import { useNavigate } from "react-router-dom";
import FindLiquidHome from "@/components/product/findLiquidHome/findLiquidHome";
import TopCategories from "@/components/product/topCategories/topCategories";
import styles from "./home.module.scss";
import "react-toastify/dist/ReactToastify.css";
import HomeCarousel from "../homeCarousel/homeCarousel";
import Header from "../header/header";
import AboutUsHome from "../aboutUsHome.tsx/aboutUsHome";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <Header />
      <div className={styles.home__body}>
        <HomeCarousel />
        <TopCategories />
        <FindLiquidHome />
        <AboutUsHome />
      </div>
    </div>
  );
}

export default HomePage;
