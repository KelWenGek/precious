define(function(require, exports, module) {
    require("./fastclick");
    FastClick.attach(document.body);

    function _showAnim(_box) {
        var $animateDom = $(_box);
        var $element = $animateDom.find('[data-animation]');
        $element.css({
            '-webkit-animation': 'none',
            'display': 'none'
        });
        $element.each(function(index, element){
            var $element    = $(element),
                $animation  = $element.attr('data-animation'),
                $duration   = $element.attr('data-duration') || 500,
                $timfunc    = $element.attr('data-timing-function') || 'ease',
                $delay      = $element.attr('data-delay') ?  $element.attr('data-delay') : 0,
                $iterate    = $element.attr('data-iterate') ? $element.attr('data-iterate') : 1;
            $element.css({
                'display': 'block',
                '-webkit-animation-name': $animation,
                '-webkit-animation-duration': $duration + 'ms',
                '-webkit-animation-timing-function': 'ease',
                '-webkit-animation-timing-function': $timfunc,
                '-webkit-animation-delay': $delay + 'ms',
                '-webkit-animation-iteration-count': $iterate,
                '-webkit-animation-fill-mode': 'both'
            })
        });
        return $animateDom;
    }

    window.showAnim =_showAnim;
});