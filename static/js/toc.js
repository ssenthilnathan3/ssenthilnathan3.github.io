(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTOC);
  } else {
    initTOC();
  }

  function initTOC() {
    var tocList = document.querySelector("#table-of-contents ul");
    if (!tocList) return;

    var tocContainer = document.getElementById("toc-container");
    if (!tocContainer) return;

    var contentEl = document.querySelector(".article-content");
    if (!contentEl) {
      tocContainer.style.display = "none";
      return;
    }

    var headings = contentEl.querySelectorAll("h2, h3");
    if (headings.length === 0) {
      tocContainer.style.display = "none";
      return;
    }

    tocList.innerHTML = "";

    // Build TOC items
    headings.forEach(function (heading) {
      var id = heading.id;
      if (!id) {
        id = slugify(heading.textContent);
        heading.id = id;
      }

      var level = parseInt(heading.tagName.charAt(1), 10); // 2 or 3
      var li = document.createElement("li");
      li.className = "toc-item toc-level-" + level;

      var link = document.createElement("a");
      link.href = "#" + id;
      link.textContent = heading.textContent;
      link.className = "toc-link";
      link.dataset.tocTarget = id;

      link.addEventListener("click", function (e) {
        e.preventDefault();
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, null, "#" + id);
      });

      li.appendChild(link);
      tocList.appendChild(li);
    });

    // Activate first item by default
    var allLinks = tocList.querySelectorAll(".toc-link");
    if (allLinks.length > 0) setActive(allLinks[0]);

    // IntersectionObserver for active tracking
    var observer = new IntersectionObserver(
      function (entries) {
        var visible = [];
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visible.push(entry.target);
        });

        if (visible.length > 0) {
          var link = tocList.querySelector(
            '.toc-link[data-toc-target="' + visible[0].id + '"]'
          );
          setActive(link);
        } else {
          // Fall back to last heading above viewport
          var active = null;
          for (var i = headings.length - 1; i >= 0; i--) {
            var rect = headings[i].getBoundingClientRect();
            if (rect.top <= 120) {
              active = headings[i];
              break;
            }
          }
          if (active) {
            var link = tocList.querySelector(
              '.toc-link[data-toc-target="' + active.id + '"]'
            );
            setActive(link);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach(function (h) {
      observer.observe(h);
    });
  }

  function setActive(link) {
    document.querySelectorAll(".toc-link").forEach(function (l) {
      l.removeAttribute("data-active");
    });
    if (link) link.setAttribute("data-active", "true");
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
})();
