import "./App.css";
import { useState } from "react";
import axios from "axios";
import CsvDownload from "react-json-to-csv";

const API_URL = "https://bcp-to-t3-api.onrender.com";

function App() {
  const [eventIds, setEventIds] = useState("");
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setEventData(null);
    setError("");

    const eventIdArr = eventIds.replaceAll(' ', '').split(',')
    const combinedEventData = []
    eventIdArr.forEach(async(id, index) => {
      const isLast = index === eventIdArr.length - 1
      try {
        const res = await axios.get(`${API_URL}/v2/bcp-event?eventId=${id}`);
        if (res?.data?.success) {
          combinedEventData.push(...res.data.data)
          if (isLast) {
            setEventIds("")
            setLoading(false);
          }
          return
        }
        setError("Unable to get event data");
        setLoading(false);
      } catch (error) {
        setError(error.toString());
        setLoading(false);
      }
    })

    setEventData(combinedEventData)
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
      <h1>BCP TO GERMAN RANKINGS EXPORT TOOL</h1>
      <div>
        <input
          value={eventIds}
          onChange={(event) => setEventIds(event.target.value)}
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
          <CsvDownload
            data={eventData}
            filename={`${eventData[0]?.tournament_name || "unknown"}.csv`}
          />
        </div>
      )}
    </div>
  );
}

export default App;
