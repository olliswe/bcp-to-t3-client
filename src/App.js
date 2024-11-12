import "./App.css";
import { useState } from "react";
import axios from "axios";
import CsvDownload from "react-json-to-csv";

const API_URL = "https://bcp-to-t3-api.onrender.com";

const App = () => {
  const [eventIds, setEventIds] = useState("");
  const [eventData, setEventData] = useState({ data: null, filename: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setEventData({ data: null, filename: "" });
    setError("");

    const eventIdArr = eventIds.replaceAll(' ', '').split(',')
    let combinedEventData = []

    try {
      const eventPromises = eventIdArr.map(async (id, index) => {
        const isLast = index === eventIdArr.length - 1

        const { data } = await axios.get(`${API_URL}/v2/bcp-event?eventId=${id}`)
        if ( data?.success ) {
          if (isLast) {
            setEventIds("")
          }
          return {
            data: data.data,
            name: data.data?.[0].tournament_name
          }
        } else {
          throw new Error("Unable to get event data")
        }
      })

      combinedEventData = await Promise.all(eventPromises)

      const eventData = {
        data: combinedEventData.map(event => event.data).flat(),
        filename: `${combinedEventData.map(event => event.name).join(", ") || "unknown"}.csv`
      }
      setEventData(eventData)
    } catch (error) {
      setError(error.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
      <h1>BCP TO GERMAN RANKINGS EXPORT TOOL</h1>
      <div>
        <input
          value={eventIds}
          onChange={(event) => setEventIds(event.target.value)}
          placeholder={"Enter BCP event ID (e.g. zYnDUrjild)"}
          style={{ width: "800px", marginRight: "5px" }}
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
      {eventData.data && !loading && (
        <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
          <div style={{ width: "808px", marginRight: "5px" }}>
            <span>Success to download: </span>
            <span style={{ fontWeight: "bold", color: "green" }}>{eventData.filename}</span>
          </div>
          <CsvDownload
            data={eventData.data}
            filename={eventData.filename}
          />
        </div>
      )}
    </div>
  );
}

export default App;
