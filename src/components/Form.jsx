// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import Spinner from "./Spinner";
import Message from "./Message";
import { useNavigate } from "react-router-dom";
import useURL from "../hooks/useURL";
import { useCities } from "../contexts/CitiesContexts";

const flagemojiToPNG = (flag) => {
  const countryCode = flag;
  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
      alt="flag"
    />
  );
};

function Form() {
  const { CreateCity, isLoading } = useCities();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [error, setError] = useState("");
  const [emoji, setEmoji] = useState("");
  const navigate = useNavigate();
  const { lat, lng } = useURL();

  useEffect(() => {
    if (!lat && !lng) return;
    async function fetchCity() {
      try {
        setIsGeoLoading(true);
        setError("");
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();
        setCityName(data.locality);
        setCountry(data.countryName);
        setEmoji(data.countryCode);
        console.log(data);
        if (!data.city) {
          throw new Error("Please Choose another place 😉");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsGeoLoading(false);
      }
    }
    fetchCity();
  }, [lat, lng]);
  if (!lat && !lng) return <Message message="Please Choose Your Position" />;
  if (error) return <Message message={error} />;
  if (isGeoLoading) return <Spinner />;
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newItem = {
      cityName,
      country,
      date,
      emoji,
      notes,
      position: { lat, lng },
    };
    await CreateCity(newItem);
    navigate("/layout/cities");
  }
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          {flagemojiToPNG(emoji.toLowerCase())}
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <Button
          type={"back"}
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
