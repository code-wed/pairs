/**
 * A jQuery plugin to create a game of pairs that overlays an image.
 * As pairs are removed, the image is revealed. The cards are matched
 * by the symbols that appear on them; these are lowercase letters of
 * the Greek alphabet by default.
 * 
 * @requires jQuery.
**/
(function ($) {
    var baseTemplate = '<div class="base"></div>',
        cardTemplate = '<div class="card"><span class="symbol"></span></div>';
    
    $.fn.pairs = function (options) {
        var $base,
            width = this.width(),
            height = this.height(),
            symbols = [];
        
        options = $.extend(true, {
            rows: 4,
            columns: 4,
            startingChar: 945
        }, options);
        
        for (var i = 0, j = options.rows * options.columns / 2; i < j; i++) {
            var char = String.fromCharCode(options.startingChar + i);
            
            symbols.push(char);
            
            symbols.push(char);
        }
        
        $base = this.wrap($(baseTemplate)).parent();
        
        $base
            .width(width)
            .height(height);
        
         for (var row = 0; row < options.rows; row++) {
            for (var col = 0; col < options.columns; col++) {
                // Calculate the card position.
                var posX = width / options.columns * col,
                    posY = height / options.rows * row,
                    $card = $(cardTemplate).appendTo($base),
                    symbolIndex = Math.floor(Math.random() * symbols.length); // Select a symbol at random.
                
                $card.children('span.symbol').text(symbols[symbolIndex]);
                
                symbols.splice(symbolIndex, 1);
                
                $card.css('position', 'absolute')
                    .css('left', posX + 'px')
                    .css('top', posY + 'px')
                
                $card.width(width / options.columns);
                
                $card
                    .height(height / options.rows)
                    // Position the symbol in the middle of the card.
                    .css('line-height', $card.height() + 'px')
                    .css('font-size', $card.height() / 2 + 'px');
            }
        }
        
        $base.on('click', '.card', function () {
            var $card1, $card2;
            
            if ($base.children('.selected').length === 2) {
                // We're waiting for the cards to be removed in the timeout
                // below, so do nothing here.
                return;
            }
            
            if ($(this).hasClass('selected')) {
                // The same card has been selected, so un-select it.
                $(this).removeClass('selected');
                
                return;
            }
            
            $card1 = $base.children('.selected');
            
            $(this).addClass('selected');
            
            if ($base.children('.selected').length < 2) {
                // Only one card has been selected at this point.
                return;
            }
            
            $card2 = $(this);
            
            setTimeout(function () {
                $card1.removeClass('selected');
                
                $card2.removeClass('selected');
                
                if ($card1.children('.symbol').text() === $card2.children('.symbol').text()) {
                    // The symbols match, so remove the cards.
                    $card1.addClass('removed');
                    
                    $card2.addClass('removed');
                }
            }, 500);
        });
    };
}(jQuery));
