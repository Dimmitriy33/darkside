import { useNavigate } from "react-router-dom";
import styles from "./home.module.scss";
import "react-toastify/dist/ReactToastify.css";
import HomeCarousel from "../homeCarousel/homeCarousel";
import Header from "../header/header";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.home}>
      <Header />
      <HomeCarousel />
    </div>
  );
}

export default HomePage;
