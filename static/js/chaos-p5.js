(function () {
  var p5Instance = null;

  var sketch = function (p) {
    var points = [];
    var mult = 0.005;

    p.setup = function () {
      var canvas = p.createCanvas(272, 120);
      canvas.parent("p5-container");
      p.background(17, 17, 17);
      p.angleMode(p.DEGREES);
      p.noiseDetail(1);

      // Initialize points
      var density = 30;
      var space = p.width / density;
      for (var x = 0; x < p.width; x += space) {
        for (var y = 0; y < p.height; y += space) {
          var pVec = p.createVector(x + p.random(-5, 5), y + p.random(-5, 5));
          points.push(pVec);
        }
      }
    };

    p.draw = function () {
      p.noStroke();
      p.fill(17, 17, 17, 8); // trail effect
      p.rect(0, 0, p.width, p.height);

      p.stroke(255, 120);
      p.strokeWeight(1);

      // Check if mouse is over container to attract particles
      var mouseIn =
        p.mouseX >= 0 &&
        p.mouseX <= p.width &&
        p.mouseY >= 0 &&
        p.mouseY <= p.height;

      for (var i = 0; i < points.length; i++) {
        var angle = p.map(
          p.noise(points[i].x * mult, points[i].y * mult),
          0,
          1,
          0,
          720,
        );
        var dir = p.createVector(p.cos(angle), p.sin(angle));

        if (mouseIn) {
          var mouseVec = p.createVector(p.mouseX, p.mouseY);
          var force = p5.Vector.sub(mouseVec, points[i]);
          var dist = force.mag();
          if (dist < 80) {
            force.normalize();
            force.mult(0.5);
            dir.add(force);
          }
        }

        points[i].add(dir);

        // Wrap around edges
        if (
          points[i].x < 0 ||
          points[i].x > p.width ||
          points[i].y < 0 ||
          points[i].y > p.height
        ) {
          points[i].x = p.random(p.width);
          points[i].y = p.random(p.height);
        }

        p.point(points[i].x, points[i].y);
      }
    };
  };

  window.startChaosP5 = function () {
    var container = document.getElementById("p5-container");
    if (!container) return;

    if (!p5Instance) {
      p5Instance = new p5(sketch);
    } else {
      p5Instance.loop();
    }
  };

  window.stopChaosP5 = function () {
    if (p5Instance) {
      p5Instance.noLoop();
    }
  };
})();
