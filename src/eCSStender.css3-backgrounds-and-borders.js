/*------------------------------------------------------------------------------
Function:       eCSStender.borders-and-backgrounds.js
Author:         Aaron Gustafson (aaron at easy-designs dot net)
Creation Date:  2010-04-24
Version:        0.1
Homepage:       http://github.com/easy-designs/eCSStender.borders-and-backgrounds.js
License:        MIT License 
Note:           If you change or improve on this script, please let us know by
                emailing the author (above) with a link to your demo page.
------------------------------------------------------------------------------*/
(function(){
  
  if ( typeof eCSStender == 'undefined' ){ return; }
  
  var
  e = eCSStender,
  
  UNDEFINED,
  PROPERTY = 'property',
  BR       = 'border-radius',
  MOZ      = '-moz-',
  WEBKIT   = '-webkit-',
  KHTML    = '-khtml-',
  TL       = '-topleft',
  BTLR     = 'border-top-left-radius',
  BTRR     = 'border-top-right-radius',
  BBRR     = 'border-bottom-right-radius',
  BBLR     = 'border-bottom-left-radius',
  SPACE    = ' ',
  COLON    = ': ',
  SEMICOL  = '; ',
  THREEPX  = COLON + '3px';
  
  e.register(
    { 'fragment': 'radius',
      'test':     function()
      {
        return ( ! e.isSupported( PROPERTY, BTLR + THREEPX ) &&
                 ( e.isSupported( PROPERTY, MOZ + BR + TL + THREEPX ) ||
                   e.isSupported( PROPERTY, WEBKIT + BTLR + THREEPX ) ||
                   e.isSupported( PROPERTY, KHTML + BTLR + THREEPX ) ) );
      },
      'fingerprint': 'net.easy-designs.' + BR
    },
    false,
    function( selector, properties, medium )
    {

      var
      style_block = selector + ' { ',
      corners;

      // shorthand
      if ( properties[BR] != UNDEFINED )
      {
        
        corners = findCorners( properties[BR] );
        
        if ( corners.length > 1 )
        {
          style_block += assignIndividualCorners( corners );
        }
        else
        {
          style_block += MOZ + BR + COLON + properties[BR] + SEMICOL +
                         WEBKIT + BR + COLON + properties[BR] + SEMICOL +
                         KHTML + BR + COLON + properties[BR] + SEMICOL;
        }
        
        properties[BR] = null;
        
      }

      for ( var prop in properties )
      {
        if ( e.isInheritedProperty( properties, prop ) ) { continue; };
        style_block += assignProperty( properties, prop );
      }

      style_block += '} ';

      e.embedCSS( style_block, medium );

    }
  );
  
  function findCorners( value )
  {
    var
    radii = value.split('/'),
    corners = [];
    if ( radii.length > 1 )
    {
      var horiz = e.trim( radii[0] ).split(SPACE);
      var vert  = e.trim( radii[1] ).split(SPACE);
      // handle mirroring
      horiz = handleMirroring( horiz );
      vert  = handleMirroring( vert )
      for ( var i=0; i<4; i++ )
      {
        corners[i] = horiz[i] + SPACE + vert[i];
      }
    }
    else
    {
      corners = handleMirroring( e.trim( radii[0] ).split(SPACE) );
    }
    return corners;
  }
  
  function handleMirroring( radii )
  {
    if ( radii.length < 4 )
    {
      if ( radii[1] == UNDEFINED ){ radii[1] = radii[0]; }
      if ( radii[2] == UNDEFINED ){ radii[2] = radii[0]; }
      if ( radii[3] == UNDEFINED ){ radii[3] = radii[1]; }
    }
    return radii;
  }
  
  function assignIndividualCorners( corners )
  {
    // webkit/konquerer is a little funky with multiple-assignment
    if ( e.isSupported( PROPERTY, WEBKIT + BTLR + THREEPX ) ||
         e.isSupported( PROPERTY, KHTML + BTLR + THREEPX ) )
    {
      assignIndividualCorners = function( corners )
      {
        return WEBKIT + BTLR + COLON + corners[0] + SEMICOL +
               WEBKIT + BTRR + COLON + corners[1] + SEMICOL +
               WEBKIT + BBRR + COLON + corners[2] + SEMICOL +
               WEBKIT + BBLR + COLON + corners[3] + SEMICOL +
               KHTML + BTLR + COLON + corners[0] + SEMICOL +
               KHTML + BTRR + COLON + corners[1] + SEMICOL +
               KHTML + BBRR + COLON + corners[2] + SEMICOL +
               KHTML + BBLR + COLON + corners[3] + SEMICOL;
      };
    }
    else
    {
      assignIndividualCorners = function( corners )
      {
        return MOZ + BR + TL + COLON + corners[0] + SEMICOL +
               MOZ + BR + '-topright: ' + corners[1] + SEMICOL +
               MOZ + BR + '-bottomright: ' + corners[2] + SEMICOL +
               MOZ + BR + '-bottomleft: ' + corners[3] + SEMICOL;
      };       
    }
    return assignIndividualCorners( corners );
  }
  
  function assignProperty( properties, prop )
  {
    if ( e.isSupported( PROPERTY, MOZ + BR + TL + THREEPX ) )
    {
      assignProperty = function( properties, prop )
      {
        return prop.replace( /border-(top|bottom)-(left|right)-radius/, MOZ + BR + '-$1$2' ) +
               COLON + properties[prop] + SEMICOL;
      };
    }
    else
    {
      assignProperty = function( properties, prop )
      {
        return prop + COLON + properties[prop] + SEMICOL;
      };
    }
    return assignProperty( properties, prop );
  }
  
})();