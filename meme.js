function initializeMeme() {
  var memeImage = document.getElementById('memeImage');
  var startBtn = document.getElementById('startBtn');
  var stopBtn = document.getElementById('stopBtn');
  var moverInterval = null;

  if (!memeImage || !startBtn || !stopBtn) return;

  function moveMemeRandomly() {
    var minLeft = 220;
    var maxLeft = Math.max(window.innerWidth - memeImage.offsetWidth - 20, minLeft);
    var maxTop = Math.max(window.innerHeight - memeImage.offsetHeight - 60, 10);
    var randX = Math.floor(Math.random() * (maxLeft - minLeft + 1)) + minLeft;
    var randY = Math.floor(Math.random() * (maxTop - 10 + 1)) + 10;
    memeImage.style.left = randX + 'px';
    memeImage.style.top = randY + 'px';
  }

  startBtn.addEventListener('click', function () {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    moveMemeRandomly();
    moverInterval = setInterval(moveMemeRandomly, 600);
  });

  stopBtn.addEventListener('click', function () {
    if (moverInterval !== null) {
      clearInterval(moverInterval);
      moverInterval = null;
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  memeImage.style.position = 'absolute';
  memeImage.style.left = '220px';
  memeImage.style.top = '120px';

  window.addEventListener('resize', function () {
    if (moverInterval === null) {
      var rectRight = memeImage.offsetLeft + memeImage.offsetWidth;
      if (rectRight > window.innerWidth - 20) {
        memeImage.style.left = Math.max(220, window.innerWidth - memeImage.offsetWidth - 20) + 'px';
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMeme);
} else {
  initializeMeme();
}
