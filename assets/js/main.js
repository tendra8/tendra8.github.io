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

  // Interactive Star Rating (Static HTML already injected in pages)
  var widget = document.getElementById("star-rating-widget");
  if (widget) {
    var hasRated = false;
    var stars = widget.querySelectorAll('.star');
    var countSpan = widget.querySelector('.review-count-text');
    stars.forEach(function(star) {
      star.addEventListener('click', function() {
        if(hasRated) return;
        var value = this.getAttribute('data-value');
        alert('Terima kasih! Anda telah memberikan rating ' + value + ' bintang.');
        if(countSpan) countSpan.innerText = parseInt(countSpan.innerText) + 1;
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
