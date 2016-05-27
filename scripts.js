//Functional Simon Game

var freq = [440, 400, 320, 280];
var context = new(window.AudioContext || window.webkitAudioContext)();

function startOsc(item) {
  var osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = item;
  osc.connect(context.destination);
  osc.start(context.currentTime);
  osc.stop(context.currentTime + 0.5);
}

var answer = [],
  turnMatch = 0,
  moveOn = false,
  strictMode = false;

function nextLevel() { //creates a new random answer
  var seq = Math.floor(Math.random() * 4);
  answer.push(seq);
};

function lights(speed, on, off) { //reads answer pattern back
  var x = 0;

  function toggle() {
    setTimeout(function() {
      $('#' + answer[x]).addClass("light");
    }, on);
    setTimeout(function() {
      $('#' + answer[x]).removeClass("light");
    }, off);
  }

  var lightup = setInterval(function() {
    console.log('other Light');
    startOsc(freq[answer[x]]);
    toggle();
    if (x >= answer.length - 1) {
      clearInterval(lightup);
    } else {
      setTimeout(function() {
        x++;
      }, off);
    }
  }, speed);
}

nextLevel();
lights(1000, 300, 800);

function reset() {
  answer = [],
    turnMatch = 0,
    moveOn = false;
  $('#lvl span').text(0);
  nextLevel();
  lights(1000, 300, 800);
};

$(document).ready(function() {
  $('.cell').click(function() { //Pad Click

    var btn = $(this).attr('id');
    startOsc(freq[btn]);

    $('#' + btn).addClass('light');
    setTimeout(function() {
      $('#' + btn).removeClass('light');
    }, 300);

    if (turnMatch < answer.length) {
      if (answer[turnMatch] === +$(this).attr('id')) {
        turnMatch++;
      } else if (strictMode) {
        alert('Incorrect');
        reset();
      } else {
        alert('Incorrect');
        turnMatch = 0;
        lights(1000, 300, 800);
        moveOn = false;
      }
    }

    if (turnMatch >= answer.length) {
      moveOn = true;
    }

    if (moveOn && answer.length < 5) {
      console.log('this')
      turnMatch = 0;
      nextLevel();
      lights(1000, 300, 800);
      $('#lvl span').text(answer.length - 1);
      moveOn = false;
    }

    if (moveOn && answer.length >= 5 &&
      answer.length < 10) {
      turnMatch = 0;
      nextLevel();
      lights(800, 200, 600);
      $('#lvl span').text(answer.length - 1);
      moveOn = false;
    }

    if (moveOn && answer.length >= 10) {
      turnMatch = 0;
      nextLevel();
      lights(600, 100, 500);
      $('#lvl span').text(answer.length - 1);
      moveOn = false;
    }

    if (answer.length - 1 === 20) {
      alert('Congrats! You Win!');
    }
  });

  $('#reset').click(function() {
    reset();
  });

  $('#strict').click(function() {
    $('#strict').toggleClass('strictGreen');
    if (strictMode) {
      strictMode = false;
    } else {
      strictMode = true;
    }
  });
});