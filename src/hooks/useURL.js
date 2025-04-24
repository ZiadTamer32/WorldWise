import { useSearchParams } from "react-router-dom";

function useURL() {
  const [search] = useSearchParams();
  const lat = search.get("lat");
  const lng = search.get("lng");
  return { lat, lng };
}

export default useURL;
