#define USE_ARDUINO_INTERRUPTS false
#include <PulseSensorPlayground.h>

const int PULSE_INPUT = A0;
const int THRESHOLD = 800;   // 공회전 시 소음이 발생하지 않도록 이 숫자를 조정하십시오.

byte samplesUntilReport;
const byte SAMPLES_PER_SERIAL_SAMPLE = 10;

PulseSensorPlayground pulseSensor;

void setup() {
  Serial.begin(115200);
  pulseSensor.analogInput(PULSE_INPUT);
  pulseSensor.setSerial(Serial);
  pulseSensor.setThreshold(THRESHOLD);

  samplesUntilReport = SAMPLES_PER_SERIAL_SAMPLE;

  if (!pulseSensor.begin()) {
  }
}

void loop() {
  int myBPM = pulseSensor.getBeatsPerMinute();
  
  if (pulseSensor.sawNewSample()) {
    if (--samplesUntilReport == (byte) 0) {
      samplesUntilReport = SAMPLES_PER_SERIAL_SAMPLE;
      
      if (pulseSensor.sawStartOfBeat()) {
        Serial.print("BPM: ");                      
        Serial.println(myBPM/3);  
      }   
    }
  }
}
