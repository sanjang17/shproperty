(function () {
  "use strict";

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim(),
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /* ==========================================
     ACTIVE MENU
  ========================================== */

  function updateActiveMenu() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navmenu a").forEach((link) => {
      link.classList.remove("active-link");
    });

    if (href === currentPage) {
      link.classList.add("active-link");
    }
  }

  /* ==========================================
     HEADER SCROLL
  ========================================== */

  function toggleScrolled() {
    const body = document.body;
    const header = document.querySelector("#header");

    if (!header) return;

    if (window.scrollY > 100) {
      body.classList.add("scrolled");
    } else {
      body.classList.remove("scrolled");
    }
  }

  /* ==========================================
     MOBILE MENU
  ========================================== */

  function initMobileMenu() {
    const btn = document.querySelector(".mobile-nav-toggle");

    if (!btn) return;

    btn.onclick = function () {
      document.body.classList.toggle("mobile-nav-active");

      btn.classList.toggle("bi-list");
      btn.classList.toggle("bi-x");
    };

    document.querySelectorAll("#navmenu a").forEach((link) => {
      link.onclick = () => {
        if (document.body.classList.contains("mobile-nav-active")) {
          document.body.classList.remove("mobile-nav-active");

          btn.classList.remove("bi-x");
          btn.classList.add("bi-list");
        }
      };
    });
  }

  /* ==========================================
     SCROLL TOP
  ========================================== */

  function initScrollTop() {
    const scrollTop = document.querySelector(".scroll-top");

    if (!scrollTop) return;

    function toggleScrollTop() {
      if (window.scrollY > 100) {
        scrollTop.classList.add("active");
      } else {
        scrollTop.classList.remove("active");
      }
    }

    scrollTop.onclick = function (e) {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    toggleScrollTop();

    window.addEventListener("scroll", toggleScrollTop);
  }

  /* ==========================================
     AOS
  ========================================== */

  function initAOS() {
    if (typeof AOS === "undefined") return;

    AOS.init({
      duration: 700,
      easing: "ease-in-out",
      once: true,
    });
  }

  /* ==========================================
     SWIPER
  ========================================== */

  function initSwiper() {
    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
      const configEl = swiperElement.querySelector(".swiper-config");

      if (!configEl) return;

      const config = JSON.parse(configEl.innerHTML.trim());

      new Swiper(swiperElement, config);
    });
  }

  /* ==========================================
     GLIGHTBOX
  ========================================== */

  function initLightbox() {
    if (typeof GLightbox === "undefined") return;

    GLightbox({
      selector: ".glightbox",
    });
  }

  /* ==========================================
     FAQ
  ========================================== */

  function initFaq() {
    document
      .querySelectorAll(
        ".faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header",
      )
      .forEach((faq) => {
        faq.onclick = () => {
          faq.parentNode.classList.toggle("faq-active");
        };
      });
  }

  /* ==========================================
     PRELOADER
  ========================================== */

  function removePreloader() {
    const preloader = document.querySelector("#preloader");

    if (!preloader) return;

    gsap.to(preloader, {
      opacity: 0,
      duration: 0.3,
      onComplete() {
        preloader.remove();
      },
    });
  }

  /* ==========================================
     REINIT
  ========================================== */

  function reInitAll() {
    updateActiveMenu();

    initMobileMenu();

    initScrollTop();

    initAOS();

    initSwiper();

    initLightbox();

    initFaq();

    toggleScrolled();

    removePreloader();
  }

  /* ==========================================
     BARBA DEBUG
  ========================================== */

  if (typeof barba !== "undefined") {
    barba.hooks.before(() => {
      document.documentElement.classList.add("is-transitioning");
    });

    barba.hooks.after(() => {
      document.documentElement.classList.remove("is-transitioning");
    });

    barba.init({
      preventRunning: true,
      prevent: ({ el }) => {
        return el.classList && el.classList.contains("glightbox");
      },
      transitions: [
        {
          name: "liquid-glass",

          async leave(data) {
            await gsap.to(data.current.container, {
              opacity: 0,
              y: -30,
              filter: "blur(10px)",
              duration: 0.35,
              ease: "power2.out",
            });
          },

          async enter(data) {
            window.scrollTo(0, 0);

            await gsap.from(data.next.container, {
              opacity: 0,
              y: 30,
              filter: "blur(10px)",
              duration: 0.35,
              ease: "power2.out",
            });
          },

          async once(data) {
            gsap.from(data.next.container, {
              opacity: 0,
              duration: 0.4,
            });
          },

          after() {
            reInitAll();

            setTimeout(() => {
              moveNavIndicator();
            }, 50);

            if (typeof AOS !== "undefined") {
              AOS.refreshHard();
            }

            console.log("Barba Page Loaded");
          },
        },
      ],
    });
  }

  function moveNavIndicator() {
    const activeLink = document.querySelector(".navmenu a.active");

    const indicator = document.querySelector(".nav-indicator");

    const nav = document.querySelector(".navmenu");

    if (!activeLink || !indicator || !nav) return;

    const linkRect = activeLink.getBoundingClientRect();

    const navRect = nav.getBoundingClientRect();

    indicator.classList.remove("animate");

    void indicator.offsetWidth;

    indicator.classList.add("animate");

    gsap.to(indicator, {
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.55,
      ease: "power3.out",
    });
  }

  function updateActiveMenu() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navmenu a").forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });

    moveNavIndicator();
  }

  window.addEventListener("resize", moveNavIndicator);

  /* ==========================================
     INITIAL LOAD
  ========================================== */

  window.addEventListener("load", () => {
    reInitAll();
  });

  document.addEventListener("scroll", toggleScrolled);
})();
