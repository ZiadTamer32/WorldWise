import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContexts";
function CityList() {
  const { isLoading, cities } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message={"Please,Add your country."} />;
  return (
    <ul className={styles.cityList}>
      {cities.map((ele) => (
        <CityItem ele={ele} key={ele.id} />
      ))}
    </ul>
  );
}

export default CityList;
