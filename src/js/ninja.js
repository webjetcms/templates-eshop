import $ from 'jquery';
window.jQuery = $;
window.$ = $;
require("jquery.cookie");

import Ninja from './global-functions';
window.Ninja = Ninja;

const bootstrap = (window.bootstrap = require('bootstrap'));

$(function () {
    let basket = $("#basket");
    let numberPicker = $(".md-number-picker");
    let collapse = $('.md-collapse');
    let personSwitch = $('[name="personSwitch"]');

    Ninja.init({
        debug:false
    });

    initBsTooltipGlobal();
    initHeaderScroll();
    initShowBasket(basket);
    initNumberPicker(numberPicker);
    initCollapse(collapse);
    togglePersonSwitch(personSwitch);
    initFilterCheckboxesGroup();
    initFilterSidenav();
    initAllRangeInputs();
    personSwitch.trigger('change');
});

function togglePersonSwitch(personSwitch) {
    personSwitch.on('change', function () {
        let val = personSwitch.filter(':checked').val();

        $('.js__person-switch').each(function () {
            if ($(this).data('type') === val) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
}

const initBsTooltipGlobal = () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
}

function initCollapse(el) {
    el.each(function () {
        let btn = $(this).find('.js__collapse');
        let content = $(this).find('.md-collapse__text');

        btn.on('click', function () {
            content.slideToggle();
            return false;
        });
    });
}

function initNumberPicker(numberPicker) {
    numberPicker.each(function () {
        let input = $(this).find('input');
        let plus = $(this).find('.plus');
        let minus = $(this).find('.minus');

        plus.on('click', function () {
            let value = parseInt(input.val());
            input.val(value + 1);
        });

        minus.on('click', function () {
            let value = parseInt(input.val());
            if (value > 1) {
                input.val(value - 1);
            }
        });
    });
}

function initShowBasket(basket) {
    $('.js__btn-basket').on('click', function () {
        basket.toggleClass('show');
        return false;
    });
}

function initHeaderScroll() {
    let lastScrollTop = 0; // posledná pozícia scrollu
    let headerHeight = $('.ly-header').outerHeight();
    $('body').css('padding-top', headerHeight + 'px');

    $(window).on('scroll', function () {
        let scrollTop = $(this).scrollTop(); // aktuálna pozícia scrollu

        if (scrollTop === 0) {
            // Ak je stránka na vrchu
            $('body').removeClass('scroll-up scroll-down').addClass('default');
        } else if (scrollTop > lastScrollTop) {
            // Scrolluje nadol
            $('body').removeClass('default scroll-up').addClass('scroll-down');
        } else if (scrollTop < lastScrollTop) {
            // Scrolluje nahor
            $('body').removeClass('default scroll-down').addClass('scroll-up');
        }

        lastScrollTop = scrollTop; // aktualizuj poslednú pozíciu
        headerHeight = $('.ly-header').outerHeight();
        $('body').css('padding-top', headerHeight + 'px');
    });
}

function initFilterCheckboxesGroup() {
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('toggle-items')) {
      e.preventDefault();
      const toggle = e.target;
      const container = toggle.closest('.filter-part');
      const visibleItems = parseInt(toggle.dataset.visible);
      const totalItems = parseInt(toggle.dataset.total);
      const isExpanded = toggle.dataset.expanded === 'true';

      if (!isExpanded) {
        // Show all items
        container.querySelectorAll('.more-item').forEach(item => {
          item.classList.remove('d-none');
        });
        toggle.innerHTML = 'Zobraziť menej';
        toggle.dataset.expanded = 'true';
      } else {
        // Collapse to initial visible items
        container.querySelectorAll('.more-item').forEach(item => {
          item.classList.add('d-none');
        });
        toggle.innerHTML = `Ďalších <span>${totalItems - visibleItems}</span>`;
        toggle.dataset.expanded = 'false';
      }
    }
  });
}

function initFilterSidenav() {
    const filterSidenav = document.querySelector('.md-product-list-filter');
    const filterBtnOpen = document.querySelectorAll('.open-filter');
    const filterBtnClose = document.querySelectorAll('.close-filter');
    const bodyEl = document.querySelector('body');

    // Open filter sidebar for all open buttons
    filterBtnOpen.forEach(btn => {
        btn.addEventListener('click', function() {
            filterSidenav.classList.add('filter-opened');
            bodyEl.classList.add('body-overlay');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close filter sidebar for all close buttons
    filterBtnClose.forEach(btn => {
        btn.addEventListener('click', function() {
            filterSidenav.classList.remove('filter-opened');
            bodyEl.classList.remove('body-overlay');
            document.body.style.overflow = '';
        });
    });

    // Close when clicking outside of the sidebar
    document.addEventListener('click', function(event) {
        if (!filterSidenav.contains(event.target) &&
            ![...filterBtnOpen].some(btn => btn.contains(event.target))) {
            filterSidenav.classList.remove('filter-opened');
            bodyEl.classList.remove('body-overlay');
            document.body.style.overflow = '';
        }
    });
}

function initAllRangeInputs() {
    document.querySelectorAll(".md-range-slider").forEach((sliderWrapper) => {
        const rangeInput = sliderWrapper.querySelectorAll(".range-input input"),
            priceInput = sliderWrapper.querySelectorAll(".price-input input"),
            range = sliderWrapper.querySelector(".slider .progress");
        let priceGap = 0;

        priceInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minPrice = parseInt(priceInput[0].value),
                    maxPrice = parseInt(priceInput[1].value);

                if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
                    if (e.target.classList.contains("input-min")) {
                        rangeInput[0].value = minPrice;
                        range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
                    } else {
                        rangeInput[1].value = maxPrice;
                        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                    }
                }
            });
        });

        rangeInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minVal = parseInt(rangeInput[0].value),
                    maxVal = parseInt(rangeInput[1].value);

                if (maxVal - minVal < priceGap) {
                    if (e.target.classList.contains("range-min")) {
                        rangeInput[0].value = maxVal - priceGap;
                    } else {
                        rangeInput[1].value = minVal + priceGap;
                    }
                } else {
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
                    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                }
            });
        });
    });
}
