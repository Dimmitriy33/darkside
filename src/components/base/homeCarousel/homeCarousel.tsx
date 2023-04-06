import Slider from "react-slick";
import imgBg1 from "images/homeBg1.jpg";
import imgBg2 from "images/homeBg2.jpg";
import { FormattedMessage } from "react-intl";
import styles from "./homeCarousel.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomeCarousel() {
  const images = [
    {
      img: imgBg1,
      alt: "imgBg1",
    },
    {
      img: imgBg2,
      alt: "imgBg2",
    },
  ];

  const sliderSettings = {
    // removes default buttons
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3400,
  };

  return (
    <Slider {...sliderSettings}>
      {images.map((el) => (
        <div key={el.alt} className={styles.carouselItem}>
          <h2 className={styles.carouselItem_text__main}>Dark side</h2>
          <p className={styles.carouselItem_text__additional}>
            <FormattedMessage id="HomeText2" />
          </p>
          <img src={el.img} alt={el.alt} />
        </div>
      ))}
    </Slider>
  );
}

export default HomeCarousel;
