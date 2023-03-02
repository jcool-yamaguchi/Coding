'use strict';

// Import module
import './module/module-sample';
// Sass Import
import '../Sass/style.scss';

class sampleClass {
  constructor(n: string) {
    console.log(n);
  }
}

const test = new sampleClass('front');
