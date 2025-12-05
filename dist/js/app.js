(function () {
  'use strict';

  /**
   * Animations
   *
   * Документация: https://github.com/michalsnik/aos
   */
  Aos.init({
    offset: 50,
    duration: 800,
    once: true,
    anchorPlacement: "top-bottom"
  });

  /**
   * Lazyload
   *
   * Документация: https://github.com/verlok/vanilla-lazyload
   */

  new LazyLoad({});

  /**
   * Sliders
   *
   * Документация: https://splidejs.com/
   */

  const splides = new Map();
  document.querySelectorAll(".splide:not(.routes__slider)").forEach(el => {
    const splide = new Splide(el, {
      autoWidth: true,
      perMove: 1,
      type: "loop",
      arrowPath: "M20.8333 2.5C20.8333 3.19716 21.1965 4.19172 21.8734 5.38249C22.5331 6.54313 23.4243 7.77869 24.3376 8.92415C26.6706 11.8501 29.4494 14.3966 32.6253 16.3363C33.8255 17.0693 35.1389 17.7776 36.4307 18.3008C37.7316 18.8277 38.9579 19.1455 40 19.1455V20.8545C38.9579 20.8545 37.7316 21.1723 36.4307 21.6992C35.1389 22.2224 33.8255 22.9307 32.6253 23.6637C29.4494 25.6035 26.6706 28.15 24.3376 31.0758C23.4243 32.2213 22.5331 33.4569 21.8734 34.6175C21.1965 35.8083 20.8333 36.8029 20.8333 37.5H19.1667C19.1667 36.3456 19.7202 35.0307 20.4232 33.7939C21.1432 32.5272 22.0954 31.2166 23.0355 30.0374C25.4753 26.9776 28.3957 24.2937 31.7562 22.2412C32.5536 21.7541 33.4125 21.2685 34.2952 20.8333H0V19.1667H34.2952C33.4125 18.7315 32.5536 18.2459 31.7562 17.7588C28.3957 15.7063 25.4754 13.0225 23.0355 9.96256C22.0954 8.78344 21.1432 7.47278 20.4232 6.20605C19.7202 4.96935 19.1667 3.65436 19.1667 2.5H20.8333Z"
    }).mount();
    splides.set(el, splide);
  });

  /**
   * Tabs
   *
   * Документация: https://github.com/cferdinandi/tabby
   */
  const tabsSelectors = document.querySelectorAll(".tabs__nav");
  for (const [i, tabsContainer] of [...tabsSelectors].entries()) {
    [...tabsContainer.querySelectorAll("a")].forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
      });
    });
    tabsContainer.setAttribute(`data-tabs-${i}`, "");
    const tabby = new tabbyMin(`[data-tabs-${i}]`, {
      idPrefix: "tabby-toggle_",
      default: ".tabs__nav-link--default",
      history: true
    });
    document.addEventListener("tabby", e => {
      const item = e.detail.tab;
      const targetId = e.detail.tab.getAttribute("href");
      const targetTab = document.querySelector(targetId);
      const aosElements = targetTab.querySelectorAll("[data-aos-tabs]");
      aosElements.forEach(el => {
        el.setAttribute("data-aos", el.getAttribute("data-aos-tabs"));
        el.classList.remove("aos-animate");
        el.style.opacity = 0;
      });
      setTimeout(() => {
        aosElements.forEach(el => {
          el.classList.add("aos-animate");
          el.style.opacity = 1;
        });
      }, 50);
      const scrollY = window.scrollY;
      window.scrollTo(0, scrollY);
      if (tabsContainer.classList.contains("tabs__nav--slider")) {
        if (window.matchMedia("(max-width: 768px)").matches) {
          let index = 0;
          let el = item.closest("li");
          while (el = el.previousElementSibling) {
            if (el.matches("li")) index++;
          }
          const sliderInstance = splides.get(tabsContainer.closest(".tabs").querySelector(".tabs__panels-slider"));
          sliderInstance.go(index);
        }
      }
      if (!item || !tabsContainer.contains(item)) return;
      const containerRect = tabsContainer.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const currentScroll = tabsContainer.scrollLeft;
      const itemCenter = itemRect.left - containerRect.left + currentScroll + itemRect.width / 2;
      const targetScroll = itemCenter - tabsContainer.clientWidth / 2;
      tabsContainer.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });
    });
    if (tabsContainer.classList.contains("tabs__nav--slider")) {
      window.addEventListener("resize", () => {
        const sliderInstance = splides.get(tabsContainer.closest(".tabs").querySelector(".tabs__panels-slider"));
        tabby.toggle(tabsContainer.querySelectorAll(".tabs__nav-link")[sliderInstance.index]);
        sliderInstance.on("move", function (newIndex) {
          tabby.toggle(tabsContainer.querySelectorAll(".tabs__nav-link")[newIndex]);
        });
      });
      const sliderInstance = splides.get(tabsContainer.closest(".tabs").querySelector(".tabs__panels-slider"));
      sliderInstance.on("move", function (newIndex) {
        tabby.toggle(tabsContainer.querySelectorAll(".tabs__nav-link")[newIndex]);
      });
    }
  }

  /**
   * Routes buttons
   */

  document.addEventListener("DOMContentLoaded", function () {
    const splideMap = new Map();
    document.querySelectorAll(".routes__slider").forEach((el, i) => {
      const splide = new Splide(el, {
        autoWidth: true,
        perMove: 1,
        type: "loop",
        arrowPath: "M20.8333 2.5C20.8333 3.19716 21.1965 4.19172 21.8734 5.38249C22.5331 6.54313 23.4243 7.77869 24.3376 8.92415C26.6706 11.8501 29.4494 14.3966 32.6253 16.3363C33.8255 17.0693 35.1389 17.7776 36.4307 18.3008C37.7316 18.8277 38.9579 19.1455 40 19.1455V20.8545C38.9579 20.8545 37.7316 21.1723 36.4307 21.6992C35.1389 22.2224 33.8255 22.9307 32.6253 23.6637C29.4494 25.6035 26.6706 28.15 24.3376 31.0758C23.4243 32.2213 22.5331 33.4569 21.8734 34.6175C21.1965 35.8083 20.8333 36.8029 20.8333 37.5H19.1667C19.1667 36.3456 19.7202 35.0307 20.4232 33.7939C21.1432 32.5272 22.0954 31.2166 23.0355 30.0374C25.4753 26.9776 28.3957 24.2937 31.7562 22.2412C32.5536 21.7541 33.4125 21.2685 34.2952 20.8333H0V19.1667H34.2952C33.4125 18.7315 32.5536 18.2459 31.7562 17.7588C28.3957 15.7063 25.4754 13.0225 23.0355 9.96256C22.0954 8.78344 21.1432 7.47278 20.4232 6.20605C19.7202 4.96935 19.1667 3.65436 19.1667 2.5H20.8333Z"
      }).mount();
      splideMap.set(el, splide);
      const buttons = el.querySelectorAll(".routes__slider-button");
      function updateButtons(index) {
        buttons.forEach(btn => btn.setAttribute("hidden", true));
        if (index === 0) {
          buttons[0].removeAttribute("hidden");
        } else if (index === 1) {
          buttons[1].removeAttribute("hidden");
          buttons[2].removeAttribute("hidden");
        } else if (index === 2) {
          buttons[3].removeAttribute("hidden");
        }
      }
      updateButtons(splide.index);
      splide.on("moved", updateButtons);
    });
    document.addEventListener("click", function (e) {
      if (e.target.matches(".routes__slider-button")) {
        const btn = e.target;
        const sliderEl = btn.closest(".splide");
        const splide = splideMap.get(sliderEl);
        const target = parseInt(btn.dataset.target, 10);
        if (splide) {
          splide.go(target - 1);
        }
      }
    });
  });

  /**
   * Audio
   */

  const audioElements = document.querySelectorAll(".audio");
  [...audioElements].forEach(audio => {
    const audioControl = audio.querySelector(".audio__audio");
    const playBtn = audio.querySelector(".audio__button");
    const progress = audio.querySelector(".audio__progress");
    const rect = progress.querySelector(".audio__progress-rect");
    const svg = progress.querySelector("svg");
    svg.getBoundingClientRect().width;
    playBtn.addEventListener("click", () => {
      if (audioControl.paused) {
        audioControl.play();
        playBtn.classList.add("audio__button--active");
      } else {
        audioControl.pause();
        playBtn.classList.remove("audio__button--active");
      }
    });
    audioControl.addEventListener("timeupdate", () => {
      const percent = audioControl.currentTime / audioControl.duration;
      rect.setAttribute("width", `${percent * 100}%`);
    });
    progress.addEventListener("click", e => {
      const rect = progress.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = clickX / rect.width;
      audioControl.currentTime = percent * audioControl.duration;
    });
    audioControl.addEventListener("ended", () => {
      playBtn.classList.remove("audio__button--active");
    });
  });

  /**
   * scrollbar
   */

  function getScrollbarWidth() {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return 0;
    const div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflowY = "scroll";
    div.style.position = "absolute";
    div.style.top = "-9999px";
    document.body.appendChild(div);
    const scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return scrollbarWidth;
  }
  function setScrollbarWidthVar() {
    const scrollbarWidth = getScrollbarWidth();
    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
  }
  setScrollbarWidthVar();
  window.addEventListener("resize", setScrollbarWidthVar);
  function lockBodyScroll() {
    document.body.classList.add("is-lock");
  }
  function unlockBodyScroll() {
    document.body.classList.remove("is-lock");
  }

  /**
   * Modals
   */

  class Modal {
    constructor() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      const defaults = {
        shouldLockBody: true
      };
      this.settings = {
        ...defaults,
        ...options
      };
      this.buttonSelector = "[data-modal-target]";
      this.buttonTargetAttribute = "data-modal-target";
      this.modalSelector = "[data-modal]";
      this.modalContentSelector = "[data-modal-content]";
      this.buttons = document.querySelectorAll(this.buttonSelector);
      this.modals = document.querySelectorAll(this.modalSelector);
      this.init();
    }
    init() {
      [...this.buttons].forEach(button => {
        button.addEventListener("click", e => {
          e.stopPropagation();
          e.preventDefault();
          const modalSelector = button.getAttribute(this.buttonTargetAttribute);
          this.openModal(modalSelector);
        });
      });
      [...this.modals].forEach(modal => {
        modal.addEventListener("click", e => {
          if (e.target === modal) {
            // кликнули по самому dialog, а не по детям
            this.closeModal(modal);
          }
        });
        modal.addEventListener("close", e => {
          if (document.activeElement) document.activeElement.blur();
          this.closeModal(modal);
        });
        modal.addEventListener("show", () => {
          setTimeout(() => {
            if (document.activeElement) document.activeElement.blur();
          }, 0);
        });
      });
    }
    openModal(modal) {
      if (modal instanceof Element) {
        if (this.settings.shouldLockBody) {
          lockBodyScroll();
        }
        modal.showModal();
      } else if (typeof modal === "string") {
        if (this.settings.shouldLockBody) {
          lockBodyScroll();
        }
        document.querySelector(modal)?.showModal();
      } else {
        console.error("openModal: Property `modal` must be HTMLElement or string!");
      }
    }
    closeModal(modal) {
      if (modal instanceof Element) {
        modal?.close();
      } else if (typeof modal === "string") {
        document.querySelector(modal)?.close();
      } else {
        console.error("closeModal: Property `modal` must be HTMLElement or string!");
      }
      if (this.settings.shouldLockBody) {
        requestAnimationFrame(() => {
          const stillOpen = document.querySelector("dialog[open]");
          if (!stillOpen) {
            unlockBodyScroll();
          }
        });
      }
    }
    closeActiveModal() {
      this.closeModal(document.querySelector("dialog[open]"));
    }
  }
  const modal = new Modal();
  globalThis.modal = modal;

  /**
   * Burger
   */
  const headerBurger = document.querySelector(".header__burger");
  const headerNav = document.querySelector(".nav");
  if (headerBurger && headerNav) {
    headerBurger.addEventListener("click", e => {
      e.stopPropagation();
      if (headerBurger.classList.contains("is-active")) {
        unlockBodyScroll();
      } else {
        window.scrollTo({
          top: 0
        });
        lockBodyScroll();
      }
      headerBurger.classList.toggle("is-active");
      headerNav.classList.toggle("is-active");
    });
    headerNav.addEventListener("click", e => {
      e.stopPropagation();
    });
    [...headerNav.querySelectorAll("a, button")]?.forEach(item => {
      item.addEventListener("click", e => {
        unlockBodyScroll();
        headerBurger.classList.remove("is-active");
        headerNav.classList.remove("is-active");
      });
    });
    document.body.addEventListener("click", e => {
      if (e.target != headerNav) {
        if (headerBurger.classList.contains("is-active")) {
          unlockBodyScroll();
          headerBurger.classList.remove("is-active");
          headerNav.classList.remove("is-active");
        }
      }
    });
    document.addEventListener("keydown", e => {
      if (e.key == "Esc" || e.key == "Escape") {
        unlockBodyScroll();
        headerBurger.classList.remove("is-active");
        headerNav.classList.remove("is-active");
      }
    });
  }

  /**
   * Calendar
   */

  const calendars = document.querySelectorAll(".calendar");
  [...calendars].forEach(calendar => {
    const calendarDates = calendar.querySelector(".calendar__dates");
    const monthYear = calendar.querySelector(".calendar__month");
    const prevBtn = calendar.querySelector(".calendar__arrow--prev");
    const nextBtn = calendar.querySelector(".calendar__arrow--next");
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    const basePrice = calendar.dataset.basePrice || "8000";
    const specialDays = JSON.parse(calendar.dataset.specialDays || "{}");
    function renderCalendar(month, year) {
      calendarDates.innerHTML = "";
      const firstDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();
      monthYear.textContent = new Intl.DateTimeFormat("ru-RU", {
        month: "long",
        year: "numeric"
      }).format(new Date(year, month));
      let startDay = firstDay === 0 ? 6 : firstDay - 1;
      for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement("div");
        calendarDates.appendChild(emptyDiv);
      }
      for (let day = 1; day <= lastDay; day++) {
        const dateDiv = document.createElement("div");
        dateDiv.classList.add("calendar__date-item");
        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dateObj = new Date(year, month, day);
        const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        if (isPast) {
          dateDiv.classList.add("disabled");
        }
        if (specialDays[fullDate]) {
          const special = specialDays[fullDate];
          if (special.type === "sold") {
            dateDiv.innerHTML = `${day}<span class="sold">продано</span>`;
          } else if (special.type === "discount") {
            const price = Intl.NumberFormat("ru-RU").format(special.price) || Intl.NumberFormat("ru-RU").format(basePrice);
            dateDiv.innerHTML = `${day}<span class="discount">${price} ₽</span>`;
          } else {
            dateDiv.innerHTML = `${day}<span>${Intl.NumberFormat("ru-RU").format(basePrice)} ₽</span>`;
          }
        } else {
          dateDiv.innerHTML = `${day}<span>${Intl.NumberFormat("ru-RU").format(basePrice)} ₽</span>`;
        }
        calendarDates.appendChild(dateDiv);
      }
      prevBtn.disabled = year < today.getFullYear() || year === today.getFullYear() && month <= today.getMonth();
    }
    prevBtn.addEventListener("click", () => {
      if (month > today.getMonth() || year > today.getFullYear()) {
        month--;
        if (month < 0) {
          month = 11;
          year--;
        }
        renderCalendar(month, year);
      }
    });
    nextBtn.addEventListener("click", () => {
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
      renderCalendar(month, year);
    });
    renderCalendar(month, year);
  });

  /**
   * Accordions
   */
  document.querySelectorAll(".accordion").forEach(accordion => {
    const btn = accordion.querySelector(".accordion__trigger");
    const content = accordion.querySelector(".accordion__body");
    const openAccordion = () => {
      content.hidden = false;
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    };
    const closeAccordion = () => {
      content.style.maxHeight = content.scrollHeight + "px";
      requestAnimationFrame(() => {
        content.style.maxHeight = 0;
        content.classList.remove("is-open");
      });
      btn.setAttribute("aria-expanded", "false");
      content.addEventListener("transitionend", () => {
        content.hidden = true;
      }, {
        once: true
      });
    };
    btn.addEventListener("click", () => {
      if (content.hidden) {
        openAccordion();
      } else {
        closeAccordion();
      }
    });
    if (!content.hidden) {
      openAccordion();
    }
  });

  /**
   * Selects
   *
   * Документация: https://github.com/Choices-js/Choices
   */

  const selects = document.querySelectorAll(".form__input--select");
  [...selects].forEach(select => {
    new Choices(select, {
      searchEnabled: false,
      shouldSort: false
    });
  });

  /**
   * Fslightbox
   *
   * Документация: https://fslightbox.com/javascript/documentation
   */

  Object.values(fsLightboxInstances).forEach(instance => {
    instance.props.sourceMargin = 0;
  });

})();
