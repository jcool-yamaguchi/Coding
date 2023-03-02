'use strict';

// Sass Import
import '../Sass/style.scss';

class sampleClass {
  constructor(n: string) {
    console.log(n);
  }
}

const test = new sampleClass('about');
