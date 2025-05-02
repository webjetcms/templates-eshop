import $ from 'jquery';
window.jQuery = $;
window.$ = $;
require("jquery.cookie");

import Ninja from './global-functions';
import { Splide } from '@splidejs/splide';
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
    initSectionNavigationItems();
    initVerticalSidenavs();
    initCarouselFunc();
    initNavSidenav();
    initProductDetailGallery();
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

function initSectionNavigationItems() {
    const navContainer = document.querySelector('.md-section-navigator ul');
    if (!navContainer) return;

    navContainer.innerHTML = '';

    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const id = section.id;
        const heading = section.querySelector('h2');

        if (heading) {
            const li = document.createElement('li');
            li.classList.add('pb-editable');

            const a = document.createElement('a');
            a.classList.add('pb-editable');
            a.href = `#${id}`;
            a.textContent = heading.textContent.trim();

            li.appendChild(a);
            navContainer.appendChild(li);
        }
    });
}

const initVerticalSidenavs = () => {
    const sidenavs = document.querySelectorAll('.md-vertical-sidenav');

    sidenavs.forEach(sidenav => {
        sidenav.querySelectorAll('[data-toggle="sidenav-toggle"]').forEach(trigger => {
            trigger.addEventListener('click', e => {
                e.preventDefault();
                const parent = trigger.closest('.nav-item');
                parent.classList.toggle('open');
            });
        });
    });
};

const initCarouselFunc = () => {
    document.querySelectorAll('.carousel').forEach((carouselEl) => {
        const carousel = new bootstrap.Carousel(carouselEl, {
            interval: 3000,
            wrap: true,
            pause: false,
            ride: 'carousel',
        });

        const pauseBtn = carouselEl.closest('.md-carousel')?.querySelector('.carousel-pause-btn');
        let isPaused = false;

        pauseBtn?.addEventListener('click', () => {
            if (isPaused) {
                carousel.cycle();
                pauseBtn.innerHTML = '<i class="bi bi-pause"></i>';
            } else {
                carousel.pause();
                pauseBtn.innerHTML = '<i class="bi bi-play"></i>';
            }
            isPaused = !isPaused;
        });
    });
};

function initNavSidenav() {
    const navSidenav = document.querySelector('.md-navigation');
    const navBtnOpen = document.querySelectorAll('.btn-hamburger');
    const navBtnClose = document.querySelectorAll('.close-nav');
    const bodyEl = document.body;

    // Open nav sidebar
    navBtnOpen.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            navSidenav.classList.add('navigation-opened');
            bodyEl.style.overflow = 'hidden';
        });
    });

    // Close nav sidebar
    navBtnClose.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeNav();
        });
    });

    // Prevent inside clicks from closing nav
    navSidenav.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Close on outside click
    document.addEventListener('click', function () {
        closeNav();
    });

    function closeNav() {
        navSidenav.classList.remove('navigation-opened');
        bodyEl.style.overflow = '';
    }
}

function initProductDetailGallery() {
    const main = new Splide( '#main-slider', {
        type       : 'fade',
        heightRatio: 1,
        pagination : false,
        arrows     : true,
        cover      : false,
        rewind          : true,
    } );

    const thumbnails = new Splide( '#thumbnail-slider', {
        rewind          : true,
        fixedWidth      : 85,
        fixedHeight     : 97,
        isNavigation    : true,
        gap             : 10,
        focus           : 'center',
        pagination      : false,
        cover           : false,
        arrows     : false,
        dragMinThreshold: {
            mouse: 4,
            touch: 10,
        },
        breakpoints : {
            991: {
                fixedWidth  : 75,
                fixedHeight : 97,
            },
        },
    } );

    thumbnails.on('mounted', function () {
        const track = thumbnails.Components.Elements.track;
        const list = thumbnails.Components.Elements.list;

        if (list.scrollWidth <= track.clientWidth) {
            thumbnails.options = {
                drag: false,
                arrows: false,
                focus: false,
                pagination: false,
                isNavigation: true,
            };
            list.style.justifyContent = 'flex-start';
        }
    });

    main.sync( thumbnails );
    main.mount();
    thumbnails.mount();
}


