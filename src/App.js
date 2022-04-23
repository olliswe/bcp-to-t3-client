import "./App.css";
import { useState } from "react";
import axios from "axios";
import CsvDownload from "react-json-to-csv";

const API_URL = "https://bcp-to-t3-api.onrender.com";

function App() {
  const [eventUrl, setEventUrl] = useState("");
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setEventData(null);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/event?link=${eventUrl}`);
      if (res?.data?.success) {
        setEventUrl("");
        setEventData(res.data.names);
        setLoading(false);
        return;
      }
      setError("Unable to get event data");
      setLoading(false);
    } catch (error) {
      setError(error.toString());
      setLoading(false);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
      <h1>BCP TO T3</h1>
      <div>
        <input
          value={eventUrl}
          onChange={(event) => setEventUrl(event.target.value)}
          placeholder={
            "Enter BCP URL (e.g. https://web.bestcoastpairings.com/event-placings.php?eventId=HXHZ2dTv8m)"
          }
          style={{ width: "800px" }}
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
      {error && (
        <div>
          <span style={{ color: "red" }}>{error}</span>
        </div>
      )}
      {eventData && (
        <div style={{ marginTop: "20px" }}>
          <span>Success! </span>
          <CsvDownload data={eventData} />
        </div>
      )}
    </div>
  );
}

export default App;
