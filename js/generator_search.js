(() => {
  const searchInput = _$("#reimu-search-input");
  const searchResult = _$("#reimu-hits");
  const pagination = _$("#reimu-pagination");
  const itemsPerPage = 10;
  let currentPage = 1;

  searchInput.insertAdjacentHTML(
    "beforeend",
    '<form id="search-form"><input type="text" id="search-text"></form>'
  );
  const baseUrl = window.REIMU_CONFIG?.relative;
  const searchUrl = baseUrl ? `${baseUrl}search.json`
    : "/search.json";
  let _searchData = null;
  let _searchLoading = false;
  // 性能优化：搜索数据懒加载——点开搜索时才拉 search.json（首屏省 26KB）
  function loadSearchData() {
  if (_searchData || _searchLoading) return;
  _searchLoading = true;
  fetch(searchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
        _searchData = data;
      _$("#search-form")
        .off("submit")
        .on("submit", (event) => {
          event.preventDefault();
          const inputText = _$("#search-text").value;
          searchResult.innerHTML = "";
          pagination.innerHTML = "";
          currentPage = 1;
          if (inputText) {
            const hits = data.filter((post) => {
              return (
                (post.title &&
                  post.title.toLowerCase().includes(inputText.toLowerCase())) ||
                (post.content &&
                  post.content.toLowerCase().includes(inputText.toLowerCase()))
              );
            });

            const totalPages = Math.ceil(hits.length / itemsPerPage);
            pagination.insertAdjacentHTML(
              "beforeend",
              '<ul class="ais-Pagination-list pagination">'
            );
            for (let i = 1; i <= totalPages; i++) {
              const pageItem = document.createElement("li");
              pageItem.className =
                "ais-Pagination-item pagination-item ais-Pagination-item--page";
              pageItem.innerHTML = `<a class="ais-Pagination-link page-number" aria-label="Page ${i}" href="#">${i}</a>`;
              if (i === currentPage) {
                pageItem.classList.add(
                  "ais-Pagination-item--selected",
                  "current"
                );
              }
              pagination.querySelector("ul").appendChild(pageItem);
            }

            _$$(".page-number").forEach((element) => {
              element.off("click").on("click", (event) => {
                event.preventDefault();
                currentPage = element.innerText;
                _$$(".ais-Pagination-item").forEach((element) => {
                  element.classList.remove(
                    "ais-Pagination-item--selected",
                    "current"
                  );
                });
                element.parentNode.classList.add(
                  "ais-Pagination-item--selected",
                  "current"
                );
                displayHits(hits, currentPage, itemsPerPage);
              });
            });

            displayHits(hits, currentPage, itemsPerPage);
          }
        });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
  }

  function displayHits(hits, page, itemsPerPage) {
    searchResult.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    hits.slice(start, end).forEach((hit) => {
      // 安全修复(S1，渗透报告 4.5.4)：DOM 构建 + textContent 转义，杜绝 insertAdjacentHTML 注入
      const link = document.createElement("a");
      link.className = "reimu-hit-item-link";
      const rawUrl = String(hit.url || "#");
      link.setAttribute("href", /^(https?:\/\/|\/)/i.test(rawUrl) ? rawUrl : "#");
      link.title = String(hit.title || "");
      link.textContent = String(hit.title || "");
      searchResult.appendChild(link);
    });
  }

  _$(".popup-trigger")
    .off("click")
    .on("click", (event) => {
      event.stopPropagation();
      const scrollWidth =
        window.innerWidth - document.documentElement.offsetWidth;
      _$("#container").style.marginRight = scrollWidth + "px";
      _$("#header-nav").style.marginRight = scrollWidth + "px";
      const popup = _$(".popup");
      popup.classList.add("show");
      loadSearchData();
      _$("#mask").classList.remove("hide");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        _$("#reimu-search-input input")?.focus();
      }, 100);
      const keydownHandler = (e) => {
        const focusables = popup.querySelectorAll("input, [href]");
        const firstFocusable = focusables[0];
        const lastFocusable = focusables[focusables.length - 1];
        if (e.key === "Escape") {
          closePopup();
        } else if (e.key === "Tab" && focusables.length) {
          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      };
      document.addEventListener("keydown", keydownHandler);
      function closePopup() {
        popup.classList.remove("show");
        _$("#mask").classList.add("hide");
        _$("#container").style.marginRight = "";
        _$("#header-nav").style.marginRight = "";
        document.body.style.overflow = "";
        document.removeEventListener("keydown", keydownHandler);
        _$("#nav-search-btn")?.focus();
      }
      popup.__closePopup = closePopup;
    });

  _$(".popup-btn-close")
    .off("click")
    .on("click", () => {
      _$(".popup").__closePopup?.();
    });
})();
