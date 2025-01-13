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

    initHeaderScroll();
    initShowBasket(basket);
    initNumberPicker(numberPicker);
    initCollapse(collapse);
    togglePersonSwitch(personSwitch);
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
