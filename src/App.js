import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ESP_IP = "http://192.168.1.106"; // ESP32 IP (hotspot mode)

    const fetchBalance = async () => {
      try {
        const res = await fetch(`${ESP_IP}/balance`);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setBalance(data.balance);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Cannot reach ESP32");
      }
    };

    fetchBalance(); // first call
    const interval = setInterval(fetchBalance, 1000); // every 1s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <h1>ESP32 RFID Balance</h1>

      {error && <p className="error">{error}</p>}

      {balance !== null ? (
        <div className="balance-box">
          Balance: {Number(balance).toFixed(2)}
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}

      <p className="info">
        Connect your laptop Wi-Fi to <b>Aditya</b> and tap your RFID card.
      </p>
    </div>
  );
}

export default App;
