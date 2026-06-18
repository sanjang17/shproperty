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
      views: [
        {
          namespace: "kpr",

          afterEnter() {
            initKPR();
          },
        },
      ],
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

            // console.log("Barba Page Loaded");
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

// kalkulator kpr

let dataAmortisasi = [];
let cicilanGlobal = 0;

// ========================================
// FORMATTER UTILITY
// ========================================

function bersihkanAngka(stringFormat) {
  return parseFloat((stringFormat || "").replace(/\./g, "")) || 0;
}

function formatRupiahOutput(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function formatInputRupiah(input) {
  if (!input) return;
  let value = input.value.replace(/[^0-9]/g, "");

  if (value !== "") {
    input.value = new Intl.NumberFormat("id-ID").format(value);
  } else {
    input.value = "";
  }
}

// ========================================
// LOGIKA PERHITUNGAN KPR
// ========================================

function hitungDPRupiah() {
  const hargaElemen = document.getElementById("harga");
  const dpPersenElemen = document.getElementById("dpPersen");
  const dpRupiahElemen = document.getElementById("dpRupiah");

  if (!hargaElemen || !dpPersenElemen || !dpRupiahElemen) return;

  const harga = bersihkanAngka(hargaElemen.value);
  let dpPersen = parseFloat(dpPersenElemen.value) || 0;

  if (dpPersen > 100) {
    dpPersen = 100;
    dpPersenElemen.value = 100;
  }

  const dpRupiah = (harga * dpPersen) / 100;
  dpRupiahElemen.value = new Intl.NumberFormat("id-ID").format(dpRupiah);
}

function hitungKPR() {
  const harga = bersihkanAngka(document.getElementById("harga").value);
  const dp = bersihkanAngka(document.getElementById("dpRupiah").value);
  const bungaTahunan = parseFloat(document.getElementById("bunga").value);
  const tenorRaw = parseFloat(document.getElementById("tenor").value);

  const errorMsg = document.getElementById("error-msg");
  const hasilContainer = document.getElementById("hasil-container");

  if (harga === 0 || dp === 0 || isNaN(bungaTahunan) || isNaN(tenorRaw)) {
    errorMsg.style.display = "block";
    errorMsg.textContent = "Mohon isi semua kolom dengan benar.";
    hasilContainer.style.display = "none";
    return;
  }

  const pokokPinjaman = harga - dp;

  if (pokokPinjaman <= 0) {
    errorMsg.style.display = "block";
    errorMsg.textContent = "DP tidak boleh lebih besar dari harga properti.";
    hasilContainer.style.display = "none";
    return;
  }

  errorMsg.style.display = "none";

  // LOGIKA: Deteksi Tenor Bulan (< 1) atau Tahun (>= 1)
  let n = 0;
  if (tenorRaw < 1) {
    n = Math.round(tenorRaw * 10);
  } else {
    n = Math.round(tenorRaw * 12);
  }

  const r = bungaTahunan / 100 / 12;
  let cicilanPerBulan;

  if (r === 0) {
    cicilanPerBulan = pokokPinjaman / n;
  } else {
    const faktor = Math.pow(1 + r, n);
    cicilanPerBulan = pokokPinjaman * ((r * faktor) / (faktor - 1));
  }

  cicilanGlobal = cicilanPerBulan;

  document.getElementById("out-pokok").textContent =
    formatRupiahOutput(pokokPinjaman);
  document.getElementById("out-cicilan").textContent =
    formatRupiahOutput(cicilanPerBulan) + " / bulan";

  hasilContainer.style.display = "block";
  document.getElementById("downloadPdf").style.display = "inline-block";

  buatTabelAmortisasi(pokokPinjaman, bungaTahunan, n, cicilanPerBulan);
}

function buatTabelAmortisasi(
  pokokPinjaman,
  bungaTahunan,
  totalBulan,
  cicilanPerBulan,
) {
  dataAmortisasi = [];
  let saldo = pokokPinjaman;
  let bungaBulanan = bungaTahunan / 100 / 12;

  const bulanIndonesia = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let tanggal = new Date();

  for (let i = 1; i <= totalBulan; i++) {
    let bunga = saldo * bungaBulanan;
    let pokok = cicilanPerBulan - bunga;

    saldo -= pokok;
    if (saldo < 0) saldo = 0;

    let namaBulan =
      bulanIndonesia[tanggal.getMonth()] + " " + tanggal.getFullYear();

    dataAmortisasi.push([
      namaBulan,
      formatRupiahOutput(cicilanPerBulan),
      formatRupiahOutput(pokok),
      formatRupiahOutput(bunga),
      formatRupiahOutput(saldo),
    ]);

    tanggal.setMonth(tanggal.getMonth() + 1);
  }
}

// ========================================
// EXPORT PDF
// ========================================

function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("l", "mm", "a4");

  const harga = bersihkanAngka(document.getElementById("harga").value);
  const dpRupiah = bersihkanAngka(document.getElementById("dpRupiah").value);
  const dpPersen = document.getElementById("dpPersen").value;
  const bunga = document.getElementById("bunga").value;
  const tenorRaw = parseFloat(document.getElementById("tenor").value);

  let totalBulan = 0;
  let labelTenor = "";

  if (tenorRaw < 1) {
    totalBulan = Math.round(tenorRaw * 10);
    labelTenor = totalBulan + " Bulan";
  } else {
    totalBulan = Math.round(tenorRaw * 12);
    labelTenor = tenorRaw + " Tahun";
  }

  const pinjaman = harga - dpRupiah;
  const totalBayar = cicilanGlobal * totalBulan;
  const totalBunga = totalBayar - pinjaman;

  doc.setFontSize(18);
  doc.text("SIMULASI KPR SH PROPERTY", 14, 15);
  doc.setFontSize(9);
  doc.text("Tanggal Cetak : " + new Date().toLocaleDateString("id-ID"), 14, 22);

  doc.setFontSize(12);
  doc.text("DETAIL PROPERTI", 14, 35);
  doc.setFontSize(10);
  doc.text("Harga Properti : " + formatRupiahOutput(harga), 14, 45);
  doc.text(
    "DP : " + formatRupiahOutput(dpRupiah) + " (" + dpPersen + "%)",
    14,
    52,
  );
  doc.text("Pinjaman : " + formatRupiahOutput(pinjaman), 14, 59);
  doc.text("Bunga : " + bunga + "%", 14, 66);
  doc.text("Tenor : " + labelTenor, 14, 73);

  doc.setFontSize(12);
  doc.text("RINGKASAN PEMBIAYAAN", 180, 35);
  doc.setFontSize(10);
  doc.text("Cicilan / Bulan : " + formatRupiahOutput(cicilanGlobal), 180, 45);
  doc.text("Total Pembayaran : " + formatRupiahOutput(totalBayar), 180, 52);
  doc.text("Total Bunga : " + formatRupiahOutput(totalBunga), 180, 59);
  doc.text("Lama Kredit : " + totalBulan + " Bulan", 180, 66);

  doc.line(14, 80, 280, 80);

  doc.autoTable({
    startY: 85,
    head: [["Bulan", "Cicilan", "Pokok", "Bunga", "Sisa Pinjaman"]],
    body: dataAmortisasi,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [13, 110, 253], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.text("Generated by SH Property", 14, pageHeight - 5);

  doc.save("Simulasi-KPR-SH-Property.pdf");
}

// ========================================
// INITIALIZATION & BARBA JS INTEGRATION
// ========================================

function initKPR() {
  const harga = document.getElementById("harga");
  const dpRupiah = document.getElementById("dpRupiah");
  const dpPersen = document.getElementById("dpPersen");
  const downloadPdf = document.getElementById("downloadPdf");
  const btnHitung = document.getElementById("btnHitung");

  // 1. Logika untuk form Harga & DP
  if (harga) {
    if (harga.value) formatInputRupiah(harga);

    harga.oninput = function () {
      formatInputRupiah(this);
      hitungDPRupiah();
    };

    if (dpPersen && !dpRupiah.value) {
      hitungDPRupiah();
    }
  }

  if (dpRupiah) {
    if (dpRupiah.value) formatInputRupiah(dpRupiah);
    dpRupiah.oninput = function () {
      formatInputRupiah(this);
    };
  }

  if (dpPersen) {
    dpPersen.oninput = function () {
      hitungDPRupiah();
    };
  }

  // 2. Logika untuk Tombol Hitung
  if (btnHitung) {
    btnHitung.onclick = function (e) {
      e.preventDefault();
      hitungKPR();
    };
  }

  // 3. Logika untuk Tombol Download PDF
  if (downloadPdf) {
    downloadPdf.onclick = function (e) {
      e.preventDefault();
      generatePDF(); // Pastikan fungsi generatePDF() juga tidak error
    };
  }

  // Hitung DP awal jika harga & persen sudah ada default-nya
  if (dpPersen && !dpRupiah.value) {
    hitungDPRupiah();
  }
}

// SCENARIO 1: Jalankan jika user mendarat/refresh langsung di halaman KPR
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initKPR);
} else {
  initKPR();
}

// SCENARIO 2: Jalankan via Barba.js saat transisi halaman selesai
if (typeof barba !== "undefined") {
  // Gunakan hook 'after' + setTimeout tipis untuk menjamin DOM sudah ter-render sempurna
  barba.hooks.after((data) => {
    if (data.next.namespace === "kpr" || document.getElementById("harga")) {
      setTimeout(() => {
        initKPR();
      }, 50);
    }
  });
}
