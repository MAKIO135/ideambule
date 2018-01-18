#include <Adafruit_NeoPixel.h>
#define LEDPIN 6
#define NUMPIXELS 47
#define encoderPinA 8
#define encoderPinB 7

Adafruit_NeoPixel strip = Adafruit_NeoPixel( NUMPIXELS, LEDPIN, NEO_GRB + NEO_KHZ800 );

struct RGB {
  byte r;
  byte g;
  byte b;
};

RGB c1 = { 249, 186, 162 };
RGB c2 = { 3, 163, 180 };

int index = 0;
int encoderPos = 0;
int encoderPinALast = LOW;
long lastInteractionTS = 0;

boolean printSent = false;

float lerp( int a, int b, float t ) {
  return a + t * ( b - a );
}

void setup() {
  pinMode( encoderPinA, INPUT );
  pinMode( encoderPinB, INPUT );

  Serial.begin( 9600 );

  strip.begin();
  for (int i = 0; i < NUMPIXELS; i++ ) {
    float ratio = float( i ) / float( NUMPIXELS );
    int r = lerp( c1.r, c2.r, ratio );
    Serial.println( String( ratio ) + " " + String( r ) );
    int g = lerp( c1.g, c2.g, ratio );
    int b = lerp( c1.b, c2.b, ratio );
    strip.setPixelColor( i, strip.Color( r, g, b ) );
  }
  strip.show();
}

void loop() {
  if ( millis() - lastInteractionTS > 1000 ) {
    encoderPos = 0;
    if ( ! printSent ) {
      printSent = true;
      int cat;
      if ( index < 5 ) cat = 0;
      else if ( index < 15 ) cat = 1;
      else cat = 2;

      Serial.println( "{ cat: " + String( cat ) + "}" );
    }
  }

  int n = digitalRead( encoderPinA );
  if ( ( encoderPinALast == LOW ) && ( n == HIGH ) ) {
    if ( digitalRead( encoderPinB ) == LOW ) {
      encoderPos--;
    } else {
      encoderPos++;
    }

    encoderPos = constrain( encoderPos, 0, 18 );
    index = map( encoderPos, 0, 18, 0, 47 );
    //Serial.println( "index: " + String( index ) );
    lastInteractionTS = millis();
    printSent = false;
  }
  encoderPinALast = n;


  int c = 90 + sin( millis() / 2000. ) * 70;
  //Serial.println( "c:" + String(c) );
  for (int i = 1; i <= NUMPIXELS; i++ ) {
    if ( i <= index ) {
      float ratio = float( i ) / float( NUMPIXELS );
      int r = lerp( c1.r, c2.r, ratio );
      //Serial.println( String( ratio ) + " " + String( r ) );
      int g = lerp( c1.g, c2.g, ratio );
      int b = lerp( c1.b, c2.b, ratio );
      strip.setPixelColor( i, strip.Color( r, g, b ) );
    }
    else {
      strip.setPixelColor( i, strip.Color( c, c, c ) );
    }
  }
  strip.show();
  delay( 10 );
}


