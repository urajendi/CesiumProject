jQuery(document).ready(function () {
  jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up"><img id="arrow-up" src="icons/arrow.png" width="12" height="8" style="transform: rotate(180deg);"></div><div class="quantity-button quantity-down"><img id="arrow-down" src="icons/arrow.png" width="12" height="8"></div></div>').insertAfter('.volume input');
  jQuery('.volume').each(function() {
    var spinner = jQuery(this),
    input = spinner.find('input[type="number"]'),
    btnUp = spinner.find('.quantity-up'),
    btnDown = spinner.find('.quantity-down'),
    min = input.attr('min');

    btnUp.click(function() {
      var oldValue = parseFloat(input.val());
      var newVal = oldValue + 1;
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });

    btnDown.click(function() {
      var oldValue = parseFloat(input.val());
      if (oldValue <= min) {
      var newVal = oldValue;
      } else {
      var newVal = oldValue - 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });
  });
});