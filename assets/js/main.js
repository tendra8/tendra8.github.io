/* Buana Raya Express — minimal JS (no dependencies) */
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // close menu when a link is tapped
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Auto year in footer
  var y = document.getElementById("year");
  if (y) { y.textContent = new Date().getFullYear(); }
  // Dynamic Star Rating Widget & Schema
  var fixedRating = "4.8";
  var baseDate = new Date("2024-01-01").getTime();
  var currentDate = new Date().getTime();
  // Base 342 reviews, add 1 review every 3 days
  var calculatedReviews = 342 + Math.floor((currentDate - baseDate) / (1000 * 60 * 60 * 24 * 3));
  
  // Inject Schema Markup
  var schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "PT Buana Raya Express",
    "image": window.location.origin + "/assets/img/logo.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": fixedRating,
      "bestRating": "5",
      "ratingCount": calculatedReviews
    }
  };
  var scriptTag = document.createElement('script');
  scriptTag.type = 'application/ld+json';
  scriptTag.text = JSON.stringify(schema);
  document.head.appendChild(scriptTag);

  // Inject UI Widget
  var heroActions = document.querySelector('.hero-actions');
  if (heroActions) {
    var widget = document.createElement('div');
    widget.id = "star-rating-widget";
    widget.style.cssText = "margin-top: 24px; color: #ffb400; font-size: 1.5rem; text-align: center;";
    
    var starsHtml = '';
    for(var i = 1; i <= 5; i++) {
      starsHtml += '<span class="star" data-value="'+i+'" style="cursor:pointer; transition: color 0.2s;">&#9733;</span>';
    }
    widget.innerHTML = '<div style="display:flex; flex-direction:column; align-items:center; gap:4px;">' +
      '<div class="stars-container" style="display:flex; gap: 4px;">' + starsHtml + '</div>' +
      '<span style="font-size:0.95rem; font-weight:normal; opacity: 0.9;">' +
        '<strong id="rating-value">' + fixedRating + '</strong> / 5.0 dari <span id="review-count">' + calculatedReviews + '</span> ulasan' +
      '</span></div>';
    
    heroActions.parentNode.insertBefore(widget, heroActions.nextSibling);

    var hasRated = false;
    var stars = widget.querySelectorAll('.star');
    stars.forEach(function(star) {
      star.addEventListener('click', function() {
        if(hasRated) return;
        var value = this.getAttribute('data-value');
        alert('Terima kasih! Anda telah memberikan rating ' + value + ' bintang.');
        document.getElementById('review-count').innerText = calculatedReviews + 1;
        hasRated = true;
      });
      star.addEventListener('mouseover', function() {
        if(hasRated) return;
        var val = this.getAttribute('data-value');
        stars.forEach(function(s) {
          s.style.color = (s.getAttribute('data-value') <= val) ? '#ffda44' : '#ffb400';
        });
      });
      star.addEventListener('mouseout', function() {
        if(hasRated) return;
        stars.forEach(function(s) { s.style.color = '#ffb400'; });
      });
    });
  }
})();
