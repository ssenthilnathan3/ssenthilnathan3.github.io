(function () {
  var activeImage = null;
  var hoverTexts = document.querySelectorAll(".hover-text");

  var img = document.createElement("img");
  img.classList.add("hover-image");
  img.style.display = "none";
  document.body.appendChild(img);

  function position(e) {
    img.style.left = (e.clientX + 20) + "px";
    img.style.top = (e.clientY - 20) + "px";
  }

  hoverTexts.forEach(function (el) {
    el.addEventListener("mouseenter", function (e) {
      var src = el.getAttribute("data-image");
      if (!src) return;
      img.src = src;
      img.style.display = "block";
      position(e);
      requestAnimationFrame(function () {
        img.classList.add("visible");
      });
      document.addEventListener("mousemove", position);
    });

    el.addEventListener("mouseleave", function () {
      img.classList.remove("visible");
      document.removeEventListener("mousemove", position);
      setTimeout(function () {
        if (!img.classList.contains("visible")) {
          img.style.display = "none";
        }
      }, 250);
    });
  });
})();
