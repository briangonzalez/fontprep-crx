// Copyright (c) 2012 - Brian Gonnzalez. 
// briangonzalez.org | fontprep.com

// All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


(function($){
  
  $(document).ready(function(){

    // Grab our objects.
    var $apply        = $('.button.apply');
    var $fontID       = $('.font-id');
    var $selector     = $('.selector');
    var $overlay      = $('.overlay');
    var $overlayText  = $('.overlay-text');
    var $applied      = $('ul.applied-list');
    var $appliedLi    = $('ul.applied-list li');
    var $error        = $('h2.error');

    // Ping FontPrep to see if she is alive.
    $.ajax({
      url: 'http://localhost:7500/ping', 
      error: function(d){
        $overlayText.add($overlay).show()
      }
    });

    // Inject fQuery into the parent page.
    $.get( chrome.extension.getURL('js/jquery-fontprep.js'), function(d){
      chrome.tabs.executeScript(null, { code: d });
    })

    // Apply styles when user clicks apply.
    $apply.on('click', function(){
      var id  = $fontID.val();
      var sel = $selector.val();

      if ( sel.length < 1 || id.length < 1 ){
        $error.text( "You must provide both a font id and a CSS selector." ).addClass('shown');
        return;
      } else {
        $error.text('').removeClass('shown')
      }

      $fontID.add( $selector ).val('');

      $.get("http://localhost:7500/font/css?raw=1&id=" + id, function(d){
        chrome.tabs.insertCSS({code: d }, function(){});

        var log   = 'console.log("[FONTPREP EXTENSION] Applied font family ' + id + ' to ' + sel + '")'
        var code  = "window.fQuery('"+ sel +"').css({fontFamily:'"+ id +"'});" + log;
        chrome.tabs.executeScript(null,{code: code});

        $applied.addClass('shown')
        var $newLi = $( $appliedLi[0].outerHTML );
        $newLi.find('.left').text(sel)
        $newLi.find('.right').text(id)
        $applied.append( $newLi )

      })
    });

    // 

  })

})(window.fQuery)  
