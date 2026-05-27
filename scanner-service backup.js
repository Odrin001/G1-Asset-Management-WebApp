const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const port = new SerialPort({
  path: "COM5",
  baudRate: 9600,
});

const parser = port.pipe(
  new ReadlineParser({
    delimiter: "\r\n",
  })
);

port.on("open", () => {
  console.log("✅ RFID Scanner Connected on COM5");
});

port.on("error", (err) => {
  console.error("❌ Serial error:", err.message);
});

process.on("SIGINT", () => {
  console.log("🔄 Closing serial port...");
  port.close((err) => {
    if (err) {
      console.error("❌ Error closing port:", err.message);
    } else {
      console.log("✅ Serial port closed");
    }
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("🔄 Closing serial port...");
  port.close((err) => {
    if (err) {
      console.error("❌ Error closing port:", err.message);
    } else {
      console.log("✅ Serial port closed");
    }
    process.exit(0);
  });
});

parser.on("data", async (uid) => {
  uid = uid.replace(/[^0-9]/g, "").trim();

  if (!uid) return;

  console.log("📡 Scan detected:", uid);

  try {
    const response = await fetch(
      "http://localhost:3000/api/scanner",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          room: "Room1",
        }),
      }
    );

    const data = await response.json();

    console.log("✅ Scan recorded:", data);
  } catch (err) {
    console.error("❌ API Error:", err.message);
  }
});