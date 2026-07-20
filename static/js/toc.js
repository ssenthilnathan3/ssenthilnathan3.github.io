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

    var headings = contentEl.querySelectorAll("h1, h2, h3");
    if (headings.length === 0) {
      tocContainer.style.display = "none";
      return;
    }

    tocList.innerHTML = "";

    headings.forEach(function (heading) {
      var id = heading.id;
      if (!id) {
        id = slugify(heading.textContent);
        heading.id = id;
      }

      var level = heading.tagName.charAt(1);
      var li = document.createElement("li");
      li.className =
        level === "1"
          ? "font-semibold text-gray-900 dark:text-gray-100 mb-1"
          : level === "2"
            ? "ml-4 mb-1"
            : "ml-8 mb-1";

      var link = document.createElement("a");
      link.href = "#" + id;
      link.textContent = heading.textContent;
      link.className =
        "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors";
      link.addEventListener("click", function (e) {
        e.preventDefault();
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, null, "#" + id);
      });

      li.appendChild(link);
      tocList.appendChild(li);
    });

    var tocLinks = document.querySelectorAll("#table-of-contents a");
    if (tocLinks.length === 0) return;

    var activeClass = "font-semibold text-gray-800 dark:text-gray-200";

    function setActive(link) {
      tocLinks.forEach(function (l) {
        l.classList.remove(
          "font-semibold",
          "text-gray-800",
          "dark:text-gray-200",
        );
      });
      if (link)
        link.classList.add.apply(link.classList, activeClass.split(" "));
    }

    var observer = new IntersectionObserver(
      function (entries) {
        var visible = [];
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.push(entry.target);
          }
        });
        if (visible.length > 0) {
          var first = visible[0];
          var link = document.querySelector(
            '#table-of-contents a[href="#' + first.id + '"]',
          );
          setActive(link);
        } else {
          var active = null;
          for (var i = headings.length - 1; i >= 0; i--) {
            var rect = headings[i].getBoundingClientRect();
            if (rect.top + window.scrollY <= window.scrollY + 120) {
              active = headings[i];
              break;
            }
          }
          if (active) {
            var link = document.querySelector(
              '#table-of-contents a[href="#' + active.id + '"]',
            );
            setActive(link);
          } else {
            setActive(tocLinks[0]);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    headings.forEach(function (h) {
      observer.observe(h);
    });

    function showHide() {
      if (window.innerWidth >= 1024) {
        tocContainer.style.display = "";
        var rect = contentEl.getBoundingClientRect();
        tocContainer.style.top = rect.top + window.scrollY + "px";
      } else {
        tocContainer.style.display = "none";
      }
    }

    showHide();
    window.addEventListener("resize", showHide);
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  }
})();
