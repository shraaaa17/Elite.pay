#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <SPI.h>
#include <MFRC522.h>

// ----------------- RFID PINS -----------------
#define SS_PIN  21   // SDA pin of RC522
#define RST_PIN 22   // RST pin of RC522

MFRC522 mfrc522(SS_PIN, RST_PIN);

// ----------------- WEB SERVER ----------------
WebServer server(80);

// ----------------- WIFI CREDENTIALS (HOME WIFI) ---------------
const char* WIFI_SSID = "Aditya";       // your router Wi-Fi
const char* WIFI_PASS = "Anuj@0373";    // your router password

// ----------------- APP STATE -----------------
float balance = 0.0;
unsigned long lastTapTime = 0;

// ------------- HTML PAGE -------------
String htmlPage() {
  String page = "<!DOCTYPE html><html><head>";
  page += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  page += "<style>body{font-family:Arial;background:#111;color:white;text-align:center;}";
  page += ".box{margin-top:100px;font-size:48px;}</style></head><body>";
  page += "<h1>Balance Display (ESP32)</h1>";
  page += "<div class='box'>Balance: ";
  page += String(balance, 2);
  page += "</div>";
  page += "<p>Tap your RFID card to increase balance by 0.10</p>";
  page += "<script>setInterval(()=>{location.reload();},1000);</script>";
  page += "</body></html>";
  return page;
}

// ------------- HTTP HANDLERS -------------

// Root HTML page (for testing directly in browser)
void handleRoot() {
  server.send(200, "text/html", htmlPage());
}

// JSON API for React: GET /balance -> { "balance": 1.23 }
void handleBalance() {
  String json = "{ \"balance\": " + String(balance, 2) + " }";

  // CORS header so browser from http://localhost:3000 can access it
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}

// Optional: 404 handler
void handleNotFound() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(404, "text/plain", "Not found");
}

// ----------------- SETUP -----------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  // Init SPI and RFID
  SPI.begin();              // default ESP32 SPI pins: SCK=18, MISO=19, MOSI=23
  mfrc522.PCD_Init();
  Serial.println("RC522 initialized");

  // ---------- CONNECT TO HOME WIFI (STATION MODE) ----------
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("ESP32 IP address: http://");
  Serial.println(WiFi.localIP());   // <-- USE THIS IP IN REACT

  // HTTP routes
  server.on("/", handleRoot);
  server.on("/balance", handleBalance);
  server.onNotFound(handleNotFound);

  // Start server
  server.begin();
  Serial.println("HTTP server started");
}

// ----------------- MAIN LOOP -----------------
void loop() {
  // Handle HTTP requests
  server.handleClient();

  // Check for new RFID card
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  // Anti double-tap: only count if > 1s since last tap
  if (millis() - lastTapTime > 1000) {
    balance += 0.10;
    Serial.print("Card tapped -> New Balance: ");
    Serial.println(balance, 2);
  }
  lastTapTime = millis();

  // Halt the card and stop encryption
  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}
