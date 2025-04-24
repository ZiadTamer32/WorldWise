import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContexts";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const flagemojiToPNG = (flag) => {
  const countryCode = flag;
  return (
    <img
      src={`https://flagcdn.com/24x18/${String(countryCode).toLowerCase()}.png`}
      alt="flag"
    />
  );
};

function CityItem({ ele }) {
  const { currentCity, DeleteCity } = useCities();
  function handleDelete(e) {
    e.preventDefault();
    DeleteCity(ele.id);
  }
  return (
    <Link
      className={`${styles.cityItem} ${
        ele.id === currentCity.id ? styles.cityItem_active : ""
      }`}
      to={`${ele.id}?lat=${ele.position.lat}&lng=${ele.position.lng}`}
    >
      <span className={styles.emoji}>{flagemojiToPNG(ele.emoji || "")}</span>
      <h3 className={styles.name}>{ele.cityName}</h3>
      <time className={styles.date}>({formatDate(ele.date)})</time>
      <button className={styles.deleteBtn} onClick={handleDelete}>
        &times;
      </button>
    </Link>
  );
}

export default CityItem;
