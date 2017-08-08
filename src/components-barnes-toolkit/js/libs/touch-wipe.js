/**
 * Original Comment:
 *
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 *
 * @author Nishanth Sudharsanam
 * @version 1.2 Allowed tracking of amount of swipe which is passed to the callback.
 *
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * @version 1.1.1 (9th December 2010) - fix bug (older IE's had problems)
 * @version 1.1 (1st September 2010) - support wipe up and wipe down
 * @version 1.0 (15th July 2010)
 */

function ifDefined(obj, def) {
  return (typeof obj !== 'undefined') ? obj : def;
}

function touchwipe(domNode, settings) {
  settings = settings || {};

  var config = {
    min_move_x: ifDefined(settings.min_move_x, 20),
    min_move_y: ifDefined(settings.min_move_y, 20),
    wipeLeft: settings.wipeLeft || function() {},
    wipeRight: settings.wipeRight || function() {},
    wipeUp: settings.wipeUp || function() {},
    wipeDown: settings.wipeDown || function() {},
    preventDefaultEvents: ifDefined(settings.preventDefaultEvents, true)
  };

  var startX;
  var startY;
  var isMoving = false;

  function cancelTouch() {
    domNode.removeEventListener('touchmove', onTouchMove);
    startX = null;
    isMoving = false;
  }

  function onTouchMove(e) {
    if (config.preventDefaultEvents) {
      e.preventDefault();
    }
    if (isMoving) {
      var x = e.touches[0].pageX;
      var y = e.touches[0].pageY;
      var dx = startX - x;
      var dy = startY - y;
      if (Math.abs(dx) >= config.min_move_x) {
        cancelTouch();
        if (dx > 0) {
          config.wipeLeft(e);
        }
        else {
          config.wipeRight(e);
        }
      }
      else if (Math.abs(dy) >= config.min_move_y) {
        cancelTouch();
        if (dy > 0) {
          config.wipeDown(e);
        }
        else {
          config.wipeUp(e);
        }
      }
    }
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
      isMoving = true;
      domNode.addEventListener('touchmove', onTouchMove);
    }
  }

  domNode.addEventListener('touchstart', onTouchStart);

  return {
    unbind: function() {
      domNode.removeEventListener('touchstart', onTouchStart);
    }
  };
};
