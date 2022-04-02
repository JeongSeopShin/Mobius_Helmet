#include <Arduino_LSM6DS3.h>

#include "DHT.h"
#define DHTPIN A6     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

// MQ-4 , MQ-7 + 근접센서
int Mq_4 = A2;   // MQ-4 가스센서 입력을 위한 아날로그 핀
int Mq_7 = A3;   // MQ-7 가스센서 입력을 위한 아날로그 핀

//위험 수치
#define mq4_d 30
#define mq7_d 30
#define t_d 45
#define h_d 60

//mq4 ppm
float RS_gas = 0;
float ratio = 0;
float sensorValue = 0;
float sensor_volt = 0;
float R0 = 7200.0;

//mq7 ppm
float RS_gas1 = 0;
float ratio1 = 0;
float sensorValue1 = 0;
float sensor_volt1 = 0;
float R01 = 7200.0;

unsigned long fallStartTime; // 처음 쓰러진 시간
unsigned long nowTime; // 현재 시간 
boolean fallFirstState = true; // 처음 쓰러짐 상태인지 유무
boolean gyro = false; 

int speaker = 2;  //스피커 

//beacon
#include <ArduinoBLE.h>

void setup() {
  Serial.begin(115200);
  while (!Serial);
  
  pinMode(Mq_4 ,INPUT);   // 아날로그 핀 A2를 입력모드로 설정
  pinMode(Mq_7 ,INPUT);   // 아날로그 핀 A3를 입력모드로 설정
  pinMode(7, INPUT);     // 근접센서1
  pinMode(8, INPUT);     // 근접센서2
  pinMode(2, OUTPUT);     //스피커

  dht.begin(); 
  if (!IMU.begin()) { //LSM6DS3센서 시작
    Serial.println("LSM6DS3센서 오류!");
    while (1);
  }

  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (1);
  }
  Serial.println("BLE Central scan");

  BLE.scan();
}

String bleName = "";
char ble[100] = "None";

void Search_BLE() {
    BLEDevice peripheral = BLE.available();    

    if (peripheral) {
      //인식된 비콘 값 중 정해진 구역 값만 가져옴 
      if (peripheral.localName() == "En" || peripheral.localName() == "A1" || peripheral.localName() == "A2" || peripheral.localName() == "A3" || peripheral.localName() == "A4") {
        Serial.println("Discovered a peripheral");
        Serial.println("-----------------------");

        // print address
        Serial.print("localName: ");
        bleName = peripheral.localName();
        Serial.println(bleName);

        if(bleName == "En")
          bleName = "En";
        
        int bleLen = bleName.length();
        bleName.toCharArray(ble, bleLen+1);
        Serial.print("ble");
        Serial.println(ble);

    }
  }
}

float acc_x, acc_y, acc_z;
float acc_pit, acc_roll;
unsigned long rolltime = 0;

void danger_speaker(){
  int i=0;
  for( int i=0; i<=4; i++)
  {
    tone(2,900);
    delay(500);
    tone(2,800);
    delay(500);
  }
  noTone(2);
}

void loop() {
  // 현재 시간
  nowTime = millis();

  //beacon  
  Search_BLE();

  float t = dht.readTemperature();
  int h = dht.readHumidity();
  int danger = 0;

   //mq4 ppm 계산
   sensorValue = analogRead(A2);
   sensor_volt = sensorValue/1024*5.0;
   RS_gas = (5.0-sensor_volt)/sensor_volt;
   ratio = RS_gas/R0; //Replace R0 with the value found using the sketch above
   float x = 1538.46 * ratio;
   int Mq4 = (float)pow(x,-1.709);

   //mq7 ppm 계산 
   sensorValue1 = analogRead(A3);
   sensor_volt1 = sensorValue1/1024*5.0;
   RS_gas1 = (5.0 - sensor_volt1)/sensor_volt1;
   ratio1 = RS_gas1 / R01; //Replace R0 with the value found using the sketch above
   float x1 = 1538.46 * ratio1;
   int Mq7 = (float)pow(x1,-1.709);

  //가속도센서
  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(acc_x, acc_y, acc_z);
    
  //각도 계산
    acc_pit = RAD_TO_DEG * atan(acc_x / sqrt(acc_y*acc_y + acc_z*acc_z)); //라디안을 각도로
    acc_roll = RAD_TO_DEG * atan(acc_y / sqrt(acc_x*acc_x + acc_z*acc_z));//180/PI = 57.27755
  }

  String matter_str = "";  
  char matter[500]; 
  
  Search_BLE();

  //근접
  if(digitalRead(7)==0 && digitalRead(8)==0) {
    Serial.println("착용");  
   
   //자이로 측정 값
    Serial.print("자이로 측정 값:");
    Serial.println(acc_roll);

    // 자이로 위험 값인 경우
    if(acc_roll < 10) {
      if(fallFirstState) {
        fallStartTime = millis();
        fallFirstState = false;
      }

      if((nowTime - fallStartTime)/1000 > 5) {
        fallFirstState = true;
        
        gyro = true;
      }
    }
    else {
      fallFirstState = true;
    }

    if( Mq4 > mq4_d || Mq7 > mq7_d || t > t_d || h > h_d || gyro) {
     Serial.println("위험상황");
     //danger = -1;

     if( Mq4 > mq4_d ) {
        matter_str += "MQ4*";
     }
     if(Mq7 > mq7_d) {
      matter_str += "MQ7*";
     }
     if(t > t_d) {
      matter_str += "temp*";
     }
     if(h > h_d) {
      matter_str += "humi*";
     }
     if(gyro) {
      matter_str += "fall*";
      gyro = false;
     }
     
     int len = matter_str.length();
     matter_str.toCharArray(matter, len+1);

     Serial.print("temperature: ");
     Serial.println(t);
     Serial.print("humidity: ");
     Serial.println(h);
     Serial.print("Mq4: ");
     Serial.println(Mq4);
     Serial.print("Mq7: ");
     Serial.println(Mq7);
     Serial.print("workSection: ");
     Serial.println(ble);
     Serial.print("danger: ");
     Serial.println(matter);
     Serial.println();
     danger_speaker();
    }
    else {
      danger = 0;
      Serial.print("temperature: ");
     Serial.println(t);
     Serial.print("humidity: ");
     Serial.println(h);
     Serial.print("Mq4: ");
     Serial.println(Mq4);
     Serial.print("Mq7: ");
     Serial.println(Mq7);
     Serial.print("workSection: ");
     Serial.println(ble);
     Serial.print("danger: ");    
     Serial.println(danger);     
     Serial.println();  
     delay(1000);
     } 
  }

  //미착용
  else {
    Serial.println("미착용");
    String WearOrNot = "NoWear";
    char WON[50];
    int Wlen = WearOrNot.length();
    WearOrNot.toCharArray(WON, Wlen+1);
    Serial.print("WearOrNot: ");
    Serial.println(WON);
    Serial.println();
    }  
}
