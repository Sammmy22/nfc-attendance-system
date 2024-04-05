// Display Libraries
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
// nfc libraries
#include <Wire.h>
#include <SPI.h>
#include <PN532_HSU.h>
#include <PN532.h>
// WIFI and request clients
#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

// pin definition
#define PN532_TX 17
#define PN532_RX 16

String uidi = "";

// define display
#define SCREEN_WIDTH 128 
#define SCREEN_HEIGHT 64 
#define OLED_RESET     -1 
#define SCREEN_ADDRESS 0x3C 
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// wifi definition
const char* ssid = "realme X7 5G";
const char* password = "Sambhav22";
// const char* ssid = "S23";
// const char* password = "theresnopassword";

const String serverName = "http://192.168.160.10:3000/class/";

PN532_HSU pn532hsu(Serial2);
PN532 nfc(pn532hsu);

String student_uid;

void setup() {
  // serial initialization
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, PN532_RX, PN532_TX);
  
  // NFC INIT
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  while (!versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1);
  }
  nfc.SAMConfig();

  // Display initialization
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    delay(1000);
    for(;;); 
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE,BLACK);
  display.setCursor(0, 0);

  // WIFI initialization
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    display.clearDisplay();
    display.setCursor(0, 0);
    display.println("Connecting to WiFi..");
    Serial.println("Connecting to WiFi..");
    display.display();
  }
  resetndis("Connected to the WiFi network");
  HTTPClient http;
  delay(2000);
}

void loop() {
  resetndis("Waiting for student ID");

  boolean success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;
  
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    Serial.println("Student ID detected");
    resetndis("Student ID detected");
    uidi = "";
    Serial.print("UID Length: "); Serial.print(uidLength, DEC); Serial.println(" bytes");
    for (uint8_t i = 0; i < uidLength; i++) {
      if (uid[i] < 0x10) {
        uidi += '0';
      }
      uidi += String(uid[i], HEX);
    }
    uidi.toUpperCase();
    Serial.print("Final UID to SEND: "); Serial.println(uidi);
    
    if ((WiFi.status() == WL_CONNECTED)) {
      HTTPClient http;
      String request = serverName+uidi;
      http.begin(request);
      int httpCode = http.GET();
      if (httpCode > 0) {
        String payload = http.getString();
        Serial.println(httpCode);
        Serial.println(payload);
        resetdis();
        if (payload == "Attendance already marked!") {
          resetndis("Attendance already marked!");
          delay(2000);
        } else {
          resetndis(payload+"\n Attendance marked");
        }
        // display.display();
        delay(2000);
        resetdis();
      }
      else {
        Serial.println("Error on HTTP request");
        resetdis();
        display.println("Request error");
        display.display();
        delay(2000);
        resetdis();
      }
      http.end();
    } else {
      resetndis("WIFI ERROR");
      delay(2000);
      resetdis();
    }
  }
}

void resetdis(){
  display.clearDisplay();
  display.setCursor(0, 0);
  display.display();
  display.clearDisplay();
  display.setCursor(0, 0);
}

void resetndis(String text){
  display.clearDisplay();
  display.setCursor(0, 0);
  display.println(text);
  display.display();
}
