// JQUERY: VodkaBears (https://github.com/VodkaBears/Vide)

!(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(root.jQuery);
  }
})(this, function($) {
  'use strict';
  const PLUGIN_NAME = 'vide';
  const DEFAULTS = {
    volume: 1,
    playbackRate: 1,
    muted: true,
    loop: true,
    autoplay: true,
    position: '50% 50%',
    posterType: 'detect',
    resizing: true,
    bgColor: 'transparent',
    className: ''
  };

  const NOT_IMPLEMENTED_MSG = 'Not implemented';

  function parseOptions(str) {
    const obj = {};
    let delimiterIndex;
    let option;
    let prop;
    let val;
    let arr;
    let len;
    let i;
    arr = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',').split(',');
    for (i = 0, len = arr.length; i < len; i++) {
      option = arr[i];
      if (
        option.search(/^(http|https|ftp):\/\//) !== -1 ||
        option.search(':') === -1
      ) {
        break;
      }
      delimiterIndex = option.indexOf(':');
      prop = option.substring(0, delimiterIndex);
      val = option.substring(delimiterIndex + 1);
      if (!val) {
        val = undefined;
      }
      if (typeof val === 'string') {
        val = val === 'true' || (val === 'false' ? false : val);
      }
      if (typeof val === 'string') {
        val = !isNaN(val) ? +val : val;
      }
      obj[prop] = val;
    }
    if (prop == null && val == null) {
      return str;
    }
    return obj;
  }
  
  function parsePosition(str) {
    str = '' + str;
    const args = str.split(/\s+/);
    let x = '50%';
    let y = '50%';
    let len;
    let arg;
    let i;

    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];
      if (arg === 'left') {
        x = '0%';
      } else if (arg === 'right') {
        x = '100%';
      } else if (arg === 'top') {
        y = '0%';
      } else if (arg === 'bottom') {
        y = '100%';
      } else if (arg === 'center') {
        if (i === 0) {
          x = '50%';
        } else {
          y = '50%';
        }
      } else {
        if (i === 0) {
          x = arg;
        } else {
          y = arg;
        }
      }
    }
    return { x: x, y: y };
  }
  
  function findPoster(path, callback) {
    const onLoad = function () {
      callback(this.src);
    };
    $('<img src="' + path + '.gif" alt="">').on('load', onLoad);
    $('<img src="' + path + '.jpg" alt="">').on('load', onLoad);
    $('<img src="' + path + '.jpeg" alt="">').on('load', onLoad);
    $('<img src="' + path + '.png" alt="">').on('load', onLoad);
  }

  function Vide(element, path, options) {
    this.$element = $(element);
    if (typeof path === 'string') {
      path = parseOptions(path);
    }
    if (!options) {
      options = {};
    } else if (typeof options === 'string') {
      options = parseOptions(options);
    }
    if (typeof path === 'string') {
      path = path.replace(/\.\w*$/, '');
    } else if (typeof path === 'object') {
      for (const i in path) {
        if (path.hasOwnProperty(i)) {
          path[i] = path[i].replace(/\.\w*$/, '');
        }
      }
    }
    this.settings = $.extend({}, DEFAULTS, options);
    this.path = path;
    try {
      this.init();
    } catch (e) {
      if (e.message !== NOT_IMPLEMENTED_MSG) {
        throw e;
      }
    }
  }

  Vide.prototype.init = function() {
    const vide = this;
    const path = vide.path;
    let poster = path;
    let sources = '';
    const $element = vide.$element;
    const settings = vide.settings;
    const position = parsePosition(settings.position);
    const posterType = settings.posterType;
    let $video;
    let $wrapper;

    $wrapper = vide.$wrapper = $('<div>')
      .addClass(settings.className)
      .css({
        position: 'absolute',
        'z-index': -1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflow: 'hidden',
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': 'cover',
        'background-color': settings.bgColor,
        'background-repeat': 'no-repeat',
        'background-position': position.x + ' ' + position.y
      });
    if (typeof path === 'object') {
      if (path.poster) {
        poster = path.poster;
      } else {
        if (path.mp4) {
          poster = path.mp4;
        } else if (path.webm) {
          poster = path.webm;
        } else if (path.ogv) {
          poster = path.ogv;
        }
      }
    }
    if (posterType === 'detect') {
      findPoster(poster, function(url) {
        $wrapper.css('background-image', 'url(' + url + ')');
      });
    } else if (posterType !== 'none') {
      $wrapper.css('background-image', 'url(' + poster + '.' + posterType + ')');
    }
    if ($element.css('position') === 'static') {
      $element.css('position', 'relative');
    }
    $element.prepend($wrapper);
    if (typeof path === 'object') {
      if (path.mp4) {
        sources += '<source src="' + path.mp4 + '.mp4" type="video/mp4">';
      }
      if (path.webm) {
        sources += '<source src="' + path.webm + '.webm" type="video/webm">';
      }
      if (path.ogv) {
        sources += '<source src="' + path.ogv + '.ogv" type="video/ogg">';
      }
      $video = vide.$video = $('<video>' + sources + '</video>');
    } else {
      $video = vide.$video = $('<video>' +
        '<source src="' + path + '.mp4" type="video/mp4">' +
        '<source src="' + path + '.webm" type="video/webm">' +
        '<source src="' + path + '.ogv" type="video/ogg">' +
        '</video>');
    }
    try {
      $video
        .prop({
          autoplay: settings.autoplay,
          loop: settings.loop,
          volume: settings.volume,
          muted: settings.muted,
          defaultMuted: settings.muted,
          playbackRate: settings.playbackRate,
          defaultPlaybackRate: settings.playbackRate
        });
    } catch (e) {
      throw new Error(NOT_IMPLEMENTED_MSG);
    }
    $video.css({
      margin: 'auto',
      position: 'absolute',
      'z-index': -1,
      top: position.y,
      left: position.x,
      '-webkit-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      '-ms-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      '-moz-transform': 'translate(-' + position.x + ', -' + position.y + ')',
      transform: 'translate(-' + position.x + ', -' + position.y + ')',
      visibility: 'hidden',
      opacity: 0
    })
    .one('canplaythrough.' + PLUGIN_NAME, function() {
      vide.resize();
    })
    .one('playing.' + PLUGIN_NAME, function() {
      $video.css({
        visibility: 'visible',
        opacity: 1
      });
      $wrapper.css('background-image', 'none');
    });
    $element.on('resize.' + PLUGIN_NAME, function() {
      if (settings.resizing) {
        vide.resize();
      }
    });
    $wrapper.append($video);
  };

  Vide.prototype.getVideoObject = function() {
    return this.$video[0];
  };

  Vide.prototype.resize = function() {
    if (!this.$video) {
      return;
    }
    const $wrapper = this.$wrapper;
    const $video = this.$video;
    const video = $video[0];
    const videoHeight = video.videoHeight;
    const videoWidth = video.videoWidth;
    const wrapperHeight = $wrapper.height();
    const wrapperWidth = $wrapper.width();
    if (wrapperWidth / videoWidth > wrapperHeight / videoHeight) {
      $video.css({
        width: wrapperWidth + 2,
        height: 'auto'
      });
    } else {
      $video.css({
        width: 'auto',
        height: wrapperHeight + 2
      });
    }
  };

  Vide.prototype.destroy = function() {
    delete $[PLUGIN_NAME].lookup[this.index];
    this.$video && this.$video.off(PLUGIN_NAME);
    this.$element.off(PLUGIN_NAME).removeData(PLUGIN_NAME);
    this.$wrapper.remove();
  };

  $[PLUGIN_NAME] = {
    lookup: []
  };

  $.fn[PLUGIN_NAME] = function(path, options) {
    let instance;
    this.each(function() {
      instance = $.data(this, PLUGIN_NAME);
      instance && instance.destroy();
      instance = new Vide(this, path, options);
      instance.index = $[PLUGIN_NAME].lookup.push(instance) - 1;
      $.data(this, PLUGIN_NAME, instance);
    });
    return this;
  };

  $(document).ready(function() {
    const $window = $(window);
    $window.on('resize.' + PLUGIN_NAME, function() {
      let len = $[PLUGIN_NAME].lookup.length, i = 0, instance;
      for (; i < len; i++) {
        instance = $[PLUGIN_NAME].lookup[i];
        if (instance && instance.settings.resizing) {
          instance.resize();
        }
      }
    });
    $window.on('unload.' + PLUGIN_NAME, function() {
      return false;
    });
    $(document).find('[data-' + PLUGIN_NAME + '-bg]').each(function(i, element) {
      const $element = $(element);
      const options = $element.data(PLUGIN_NAME + '-options');
      const path = $element.data(PLUGIN_NAME + '-bg');
      $element[PLUGIN_NAME](path, options);
    });
  });
});
