/* ============================================================
   RAY'S PORTFOLIO — GLOBAL SCRIPT
   nav highlighting / clock / visitor counter
   lazy-loading asset frames w/ fallback / lightbox gallery
   ============================================================ */
(function(){
  "use strict";

  /* ---------------- nav active state ---------------- */
  function initNav(){
    var path = location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".main-nav a");
    links.forEach(function(a){
      var href = a.getAttribute("href");
      if(href === path){ a.classList.add("active"); }
    });
  }

  /* ---------------- live clock ---------------- */
  function initClock(){
    var el = document.getElementById("sys-clock");
    if(!el) return;
    function tick(){
      var d = new Date();
      var hh = String(d.getHours()).padStart(2,"0");
      var mm = String(d.getMinutes()).padStart(2,"0");
      var ss = String(d.getSeconds()).padStart(2,"0");
      el.textContent = hh + ":" + mm + ":" + ss;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- visitor counter (shared web counter) ---------------- */
  function initVisitorCounter(){
    var el = document.getElementById("visitor-count");
    if(!el) return;

    var apiBase = "https://countapi.mileshilliard.com/api/v1";
    var counterKey = "hanabihenki-github-site-visitors-v1";
    var sessionKey = "rp_global_visitor_counted";
    var endpoint = sessionStorage.getItem(sessionKey)
      ? apiBase + "/get/" + counterKey
      : apiBase + "/hit/" + counterKey;

    fetch(endpoint, { cache:"no-store" })
      .then(function(res){
        if(!res.ok) throw new Error("counter request failed");
        return res.json();
      })
      .then(function(data){
        var count = parseInt(data.value, 10);
        if(!Number.isFinite(count)) throw new Error("invalid counter value");
        sessionStorage.setItem(sessionKey, "1");
        localStorage.setItem("rp_last_visitor_count", String(count));
        el.textContent = String(count).padStart(6, "0");
      })
      .catch(function(){
        var fallback = parseInt(localStorage.getItem("rp_last_visitor_count") || "0", 10);
        el.textContent = String(fallback).padStart(6, "0");
      });
  }

  /* ---------------- lazy-load asset frames ----------------
     Markup:
     <div class="art-frame loading" data-expect="assets/img/xyz.png">
       <img data-src="assets/img/xyz.png" alt="...">
       <span class="frame-caption">label</span>
     </div>
  ------------------------------------------------------------ */
  function wireArtFrame(frame){
    var img = frame.querySelector("img");
    if(!img || img.dataset.wired) return;
    img.dataset.wired = "1";
    var src = img.getAttribute("data-src");
    img.addEventListener("load", function(){
      frame.classList.remove("loading");
      frame.classList.remove("missing");
      img.classList.add("is-loaded");
    });
    img.addEventListener("error", function(){
      frame.classList.remove("loading");
      frame.classList.add("missing");
    });
    img.src = src;
  }

  function initLazyFrames(){
    var frames = document.querySelectorAll(".art-frame");
    if(!frames.length) return;

    if("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            wireArtFrame(entry.target);
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "200px 0px" });
      frames.forEach(function(f){ io.observe(f); });
    } else {
      frames.forEach(wireArtFrame);
    }
  }

  /* ---------------- lightbox gallery renderer ----------------
     RaySite.renderGallery(containerId, items)
     items: [{ file: "assets/img/x.png", alt: "..." }, ...]
  --------------------------------------------------------------- */
  var lightboxItems = [];
  var lightboxIndex = -1;

  function ensureLightbox(){
    if(document.getElementById("lightbox")) return;
    var lb = document.createElement("div");
    lb.id = "lightbox";
    lb.innerHTML =
      '<div class="lb-inner">' +
        '<div class="lb-bar">' +
          '<span id="lb-caption">—</span>' +
          '<button type="button" id="lb-close">✕ close</button>' +
        '</div>' +
        '<img id="lb-img" src="" alt="">' +
        '<div class="lb-nav">' +
          '<button type="button" id="lb-prev">← prev</button>' +
          '<button type="button" id="lb-next">next →</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(lb);

    document.getElementById("lb-close").addEventListener("click", closeLightbox);
    lb.addEventListener("click", function(e){ if(e.target === lb) closeLightbox(); });
    document.getElementById("lb-prev").addEventListener("click", function(){ stepLightbox(-1); });
    document.getElementById("lb-next").addEventListener("click", function(){ stepLightbox(1); });
    document.addEventListener("keydown", function(e){
      if(!lb.classList.contains("open")) return;
      if(e.key === "Escape") closeLightbox();
      if(e.key === "ArrowLeft") stepLightbox(-1);
      if(e.key === "ArrowRight") stepLightbox(1);
    });
  }

  function openLightbox(index){
    lightboxIndex = index;
    var item = lightboxItems[lightboxIndex];
    if(!item) return;
    var lb = document.getElementById("lightbox");
    document.getElementById("lb-img").src = item.file;
    document.getElementById("lb-img").alt = item.alt || "";
    document.getElementById("lb-caption").textContent =
      (item.alt || "untitled") + "  [" + (lightboxIndex+1) + "/" + lightboxItems.length + "]";
    lb.classList.add("open");
  }
  function closeLightbox(){
    document.getElementById("lightbox").classList.remove("open");
  }
  function stepLightbox(delta){
    if(!lightboxItems.length) return;
    var next = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
    openLightbox(next);
  }

  function renderGallery(containerId, items){
    var container = document.getElementById(containerId);
    if(!container) return;
    ensureLightbox();

    items.forEach(function(item){
      var globalIndex = lightboxItems.length;
      lightboxItems.push(item);

      var frame = document.createElement("div");
      frame.className = "art-frame loading";
      frame.setAttribute("data-expect", item.file);
      frame.setAttribute("tabindex", "0");
      frame.setAttribute("role", "button");
      frame.setAttribute("aria-label", "Enlarge: " + (item.alt || "artwork"));

      var img = document.createElement("img");
      img.setAttribute("data-src", item.file);
      img.setAttribute("alt", item.alt || "");
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      frame.appendChild(img);

      if(item.alt){
        var cap = document.createElement("span");
        cap.className = "frame-caption";
        cap.textContent = item.alt;
        frame.appendChild(cap);
      }

      frame.addEventListener("click", function(){ openLightbox(globalIndex); });
      frame.addEventListener("keydown", function(e){
        if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openLightbox(globalIndex); }
      });

      container.appendChild(frame);
    });

    initLazyFrames();
  }

  /* ---------------- init ---------------- */
  document.addEventListener("DOMContentLoaded", function(){
    initNav();
    initClock();
    initVisitorCounter();
    initLazyFrames();
  });

  window.RaySite = {
    renderGallery: renderGallery
  };

})();
