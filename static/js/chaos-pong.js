(function () {
  var canvas = null;
  var ctx = null;
  var animFrameId = null;

  var ball = { x: 0, y: 0, vx: 2, vy: 1.5, radius: 4 };
  var paddleWidth = 6;
  var paddleHeight = 30;

  var leftPaddle = { x: 10, y: 0, score: 0 };
  var rightPaddle = { x: 0, y: 0, score: 0 };

  var isMouseOver = false;
  var mouseY = 0;
  var isInitialized = false;

  function init() {
    canvas = document.getElementById("pong-canvas");
    if (!canvas) return false;
    ctx = canvas.getContext("2d");

    leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
    rightPaddle.x = canvas.width - 10 - paddleWidth;
    rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
    mouseY = canvas.height / 2;

    if (!isInitialized) {
      canvas.addEventListener("mousemove", function (e) {
        var rect = canvas.getBoundingClientRect();
        mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        isMouseOver = true;
      });

      canvas.addEventListener("mouseleave", function () {
        isMouseOver = false;
      });
      isInitialized = true;
    }
    return true;
  }

  function resetBall() {
    if (!canvas) return;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = (Math.random() > 0.5 ? 2.2 : -2.2) * (1 + Math.random() * 0.4);
    ball.vy = (Math.random() > 0.5 ? 1.6 : -1.6) * (1 + Math.random() * 0.4);
  }

  function loop() {
    if (!canvas || !ctx) return;

    // 1. Update AI (Left Paddle)
    var targetY = ball.y - paddleHeight / 2;
    leftPaddle.y += (targetY - leftPaddle.y) * 0.085;
    leftPaddle.y = Math.max(
      0,
      Math.min(canvas.height - paddleHeight, leftPaddle.y),
    );

    // 2. Update Right Paddle (Player / Auto-play AI)
    if (isMouseOver) {
      rightPaddle.y += (mouseY - paddleHeight / 2 - rightPaddle.y) * 0.25;
    } else {
      rightPaddle.y += (ball.y - paddleHeight / 2 - rightPaddle.y) * 0.07;
    }
    rightPaddle.y = Math.max(
      0,
      Math.min(canvas.height - paddleHeight, rightPaddle.y),
    );

    // 3. Move Ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 4. Wall collisions (Top/Bottom)
    if (ball.y - ball.radius <= 0) {
      ball.y = ball.radius;
      ball.vy = -ball.vy;
    } else if (ball.y + ball.radius >= canvas.height) {
      ball.y = canvas.height - ball.radius;
      ball.vy = -ball.vy;
    }

    // 5. Paddle collisions (Left)
    if (ball.vx < 0 && ball.x - ball.radius <= leftPaddle.x + paddleWidth) {
      if (ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + paddleHeight) {
        ball.vx = -ball.vx * 1.05;
        var hit =
          (ball.y - (leftPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy = hit * 2.5;
        ball.x = leftPaddle.x + paddleWidth + ball.radius;
      }
    }

    // 6. Paddle collisions (Right)
    if (ball.vx > 0 && ball.x + ball.radius >= rightPaddle.x) {
      if (ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + paddleHeight) {
        ball.vx = -ball.vx * 1.05;
        var hit =
          (ball.y - (rightPaddle.y + paddleHeight / 2)) / (paddleHeight / 2);
        ball.vy = hit * 2.5;
        ball.x = rightPaddle.x - ball.radius;
      }
    }

    // 7. Score checking
    if (ball.x < 0) {
      rightPaddle.score++;
      resetBall();
    } else if (ball.x > canvas.width) {
      leftPaddle.score++;
      resetBall();
    }

    // 8. Draw
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Net
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Scores
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.font = "12px var(--font-mono), monospace";
    ctx.fillText(leftPaddle.score, canvas.width / 2 - 30, 20);
    ctx.fillText(rightPaddle.score, canvas.width / 2 + 20, 20);

    animFrameId = requestAnimationFrame(loop);
  }

  window.startChaosPong = function () {
    if (init()) {
      if (!animFrameId) {
        resetBall();
        loop();
      }
    } else {
      console.warn("Could not find #pong-canvas for Table Tennis widget.");
    }
  };

  window.stopChaosPong = function () {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  };

  // Attempt to initialize on load if canvas is already present
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      init();
    });
  } else {
    init();
  }
})();
