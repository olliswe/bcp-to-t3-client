import "./App.css";
import { useState } from "react";
import axios from "axios";
import CsvDownload from "react-json-to-csv";

const API_URL = "https://bcp-to-t3-api.onrender.com";

function App() {
  const [eventId, setEventId] = useState("");
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setEventData(null);
    setError("");
    try {
      const res = await axios.get(`${API_URL}/v2/bcp-event?eventId=${eventId}`);
      if (res?.data?.success) {
        setEventId("");
        setEventData(res.data.data);
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
          value={eventId}
          onChange={(event) => setEventId(event.target.value)}
          placeholder={"Enter BCP event ID (e.g. zYnDUrjild)"}
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
