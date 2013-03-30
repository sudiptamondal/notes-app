/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);

/* ============================================================
 * bootstrap-dropdown.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown-menu', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
<!DOCTYPE html>
<!--

Hello future GitHubber! I bet you're here to remove those nasty inline styles,
DRY up these templates and make 'em nice and re-usable, right?

Please, don't. https://github.com/styleguide/templates/2.0

-->
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>Page not found &middot; GitHub</title>
    <style type="text/css" media="screen">
      body {
        background: #f1f1f1;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        text-rendering: optimizeLegibility;
        margin: 0; }

      .container { margin: 30px auto 40px auto; width: 800px; text-align: center; }

      a { color: #4183c4; text-decoration: none; font-weight: bold; }

      h3 { color: #666; }
      ul { list-style: none; padding: 25px 0; }
      li {
        display: inline;
        margin: 10px 50px 10px 0px;
      }
      input[type=text], input[type=password] {
        font-size: 13px;
        min-height: 32px;
        padding: 7px 8px;
        outline: none;
        color: #333;
        background-color: #fff;
        background-repeat: no-repeat;
        background-position: right center;
        border: 1px solid #ccc;
        border-radius: 3px;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.075);
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        transition: all 0.15s ease-in;
        -webkit-transition: all 0.15s ease-in 0;
        vertical-align: middle;
      }
      .button {
        font-family: Helvetica, sans-serif;
        position: relative;
        display: inline-block;
        padding: 7px 15px;
        font-size: 13px;
        font-weight: bold;
        color: #333;
        text-shadow: 0 1px 0 rgba(255,255,255,0.9);
        white-space: nowrap;
        background-color: #eaeaea;
        background-image: -moz-linear-gradient(#fafafa, #eaeaea);
        background-image: -webkit-linear-gradient(#fafafa, #eaeaea);
        background-image: linear-gradient(#fafafa, #eaeaea);
        background-repeat: repeat-x;
        border-radius: 3px;
        border: 1px solid #ddd;
        border-bottom-color: #c5c5c5;
        box-shadow: 0 1px 3px rgba(0,0,0,0.075);
        vertical-align: middle;
        cursor: pointer;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-appearance: none;
      }
      #auth {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 50;
        background-color: rgba(53,95,120,.4);
        padding: 0 10px 5px 10px;
        -webkit-border-bottom-right-radius: 10px;
        -webkit-border-bottom-left-radius: 10px;
        -moz-border-radius-bottomright: 10px;
        -moz-border-radius-bottomleft: 10px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        box-shadow: 0 3px 0 rgba(0, 0, 0, 0.28);
        transition:height .5s;
        display: none;
      }
      #auth h1, #auth p, #auth label {
        display: none;
      }
      .auth-form-body {
        display: inline;
      }
      #auth input[type=text], input[type=password] {
        float: left;
        width: 175px;
        margin-top: 7px;
        margin-right: 9px;
      }
      #auth .button {
        clear: none;
        margin-top: 7px;
        margin-left: 0;
        border: 1px solid #427696;
        border-bottom-color: #386580;
      }
      label[for=search] {
        display: block;
        text-align: left;
      }
      #search label {
        font-weight: 200;
        padding: 5px;
      }
      #search input[type=text] {
        font-size: 18px;
        width: 705px;
        padding: 8px;
      }
      #search .button {
        padding: 10px;
        width: 90px;
      }
      #logo {
        margin-top: 35px;
      }
      #suggestions {
        margin-top: 35px;
        color: #ccc;
      }
      #suggestions a {
        color: #666666;
        font-weight: 200;
        font-size: 14px;
        margin: 0 10px;
      }

      #parallax_wrapper {
        position: relative;
        z-index: 0;
      }
      #parallax_field {
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
        height: 370px;
        width: 100%;
      }
      #parallax_field #parallax_bg {
        position: absolute;
        top: -20px;
        left: -20px;
        width: 110%;
        height: 425px;
        z-index: 1;
      }
      #parallax_illustration {
        display: block;
        margin: 0 auto;
        width: 940px;
        height: 370px;
        position: relative;
        overflow: hidden;
        clear: both;
      }
      #parallax_illustration img {
        position: absolute;
      }
      #parallax_illustration #parallax_error_text {
        top: 72px;
        left: 72px;
        z-index: 10;
      }
      #parallax_illustration #parallax_octocat {
        top: 94px;
        left: 356px;
        z-index: 9;
      }
      #parallax_illustration #parallax_speeder {
        top: 150px;
        left: 432px;
        z-index: 8;
      }
      #parallax_illustration #parallax_octocatshadow {
        top: 297px;
        left: 371px;
        z-index: 7;
      }
      #parallax_illustration #parallax_speedershadow {
        top: 263px;
        left: 442px;
        z-index: 6;
      }
      #parallax_illustration #parallax_building_1 {
        top: 73px;
        left: 467px;
        z-index: 5;
      }
      #parallax_illustration #parallax_building_2 {
        top: 113px;
        left: 762px;
        z-index: 4;
      }
    </style>
  </head>
  <body>

    <div id="parallax_wrapper">
      <div id="parallax_field">
        <img alt="building" class="js-plaxify" data-invert="true" data-xrange="0" data-yrange="20" height="415" id="parallax_bg" width="940"
        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAUAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgBnwOsAwERAAIRAQMRAf/EALYAAAMBAQEBAQAAAAAAAAAAAAECAwAEBQYIAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAcQAAEDAwMCAwUGBAEGCwgCAwEAESExAhJBUWFxgZGhA/CxwSIT0eHxMgQFQgYHF1Ji0iPTFBVygpLCM2ODkyQlNaKyU6OzNEVVc0RUpBYRAQEAAQEDCgQEBQUBAQAAAAARAQIDUwQhMZHRkqLSBRYXQVLiBqFCQwfhghRkFVESYhMzcYH/2gAMAwEAAhEDEQA/APmt+KL6fHyMwDu9SqlUFtBRAzIlMBsHdVDC1UOB24QpgNFYh8UFBafaiJTACpPZVDtA0QyYWlEphbMqhxaUQ4tPdUpxbPdIlM3ZWJcnFs0QMLFSnFvkgYW0ViCLVUpxYoUwsCqGAHZA2JQNgiUwtCsKZuEhRxKIOBVDCyUDYbpEo4qpTYiEBx4SBsUIIsKsBwQEWoUcVYg4qRRx4VTOBx4SA4orYcIg4INigOKFHBFo4HZEzlsOEwZbDhCjhwpVHDolPi2ARG+mFaNgFAcAlGwCUbEbBAcRshytig2PCihiqYbBKcrYINgooYBEY2K4M5DBQbBFDE9UI2J2RQx4UgGIVgGCgGCKB9NDnD6aI30yplcBgdlFpcFUDBRWPpqLkv00ShgpFpcOEUuKZMBjuEgXEKZXBcOEANvCi0pt4VCm19VFpTYUKTA6JmGMgbDs6i8xTYZ9yhghs3DIuS/TUKQ2IuQNgUCH06qLUzYUAxmkJlcFNqkCY7Qi45SGyunuRYQg666qBTb32SKQ2tp4IAbdCopDbuHKGMlxPCikNleEqlxDcqI42qy6OeVANtSimbx2RDMTotIoA3Q6oGA8ETJha60igtUKfElidVUOA5gMiU2JQqmI8EDM/KsTOTi07eCqU4tZWFNirhFANVIUwtViUwCoYWqpVBaoUwtVQ2PDDdAwt3QMLAOUQzcK4wGAKsQwsQOLOEDYJhMmxQhhYqRsFUNggYW8KLjI4hVILJDmNiqDihRxRKOHCFMLDsgOHKIOCKOCIOCGRwUUcFU5BxUK2KpYOCQrYHZAcOEKOHCnMcuRwOysK2BQ5WwRGwUabBVGwQHBBsFFbBVGwKithwgGHCDYcJlcZD6Z2Qo/TQ/3BghW+mVKB9MoVvppRsCgGPCitjwg2IQDEIBgEUMAhzhgilwKGAx7KQoY8IBjwgGCAYFZWwMCi0uBRCmxCgbFFLgPxQL9MbKKGHCBcOG6KRQNqQ5iGxFLgmTBTapFIbUUps4QLhwmcLjJDaRopApseaItL9NQIbDqopDYO6BfphTK4IbOPBRU8Whu6BcZhRS4t2UUpteEqxM2mr90CG2CikNp2d1CFNqgXE7IOECBHRdHOmAbpoqhgPFUUA46Ih2lXAcW7U3RDga04VQ4GyBxa/xROc4DKofGVQ4tn7ERQWjZWIcW/einFp1VSmFtFUUFpSLTCz8VWTi1QOLUDCx1UMLQFYhxbsEDC1A4sVSmFgQp8UOUcVUNgdkhTiwoURYdlUMLCnMc5sPwQN9NEo4BCmwCcoItGyAi3hA2OyFg4pCjgiZyYWHZIUcFQcEQcAiwRaESNiEUcRsgLcJBmViZHEpjBnLYlFbEpjBkcSpCtiVQcDsoD9MoN9Mqlb6Z3UoP0zulG+md0yYyP0yhW+nwoVsOFShh7Moo4FEDFIVsUitikGZSGMgyozcKAY8INiihggGChQw5VK30woofTG6I30+qLQw4UAxbR0ANo2TlVsUSFNiLygbEC4IpTaithw6hC4pADZx3UUuBVC/TKlUMDuoFNnZFLgEqFNg2UUpsUUhtbQdUilNoKgQ2IpDYoFI3qilwfqgQ2nZRSm2JUi0hsU5zmIfTKVSG38FFIbPFRUzYPvQJdb4lRSY6MgBt6lRpNjRCFI11UMEIdo7IuE8fBB5rT11XbDgoBxAqUFAPPRA4t4VFANobVVKcBEOLUQ4tVIcWyhzKCxqjhXnTmUFo0CsQ4tdBQWtyrEzkwt/FUOLUiZyoLRsyJTi3hDGTCy46KpTizdA4t2VSnHplA49OjzwqhhYPvQOLOFUPhuEQwsGyFPi2iY5VzyGFvCsQwt4Qo4ohsUBxQhsUijgiGw4VhnJsNWUDYBEEWhUHHhIDjwmMGRxKQo4FARYqQcEQfpopsApRsAqg4DZAcOEMDhwgOPCFbFAcXQbE7IDiUORsUg2PsyDYoNiUK2JQHE7IVsTsfBCtgdlFHAolDC5Fo/TKI2Ci5bBUrY8IgYjZRRx/yUg2PCRQxGyTIGAQbBIYDAJAMBsmTAYcKRa30+EKH0yi5D6dyDYJznMGA1UUMAiUD6YUqh9PhAuHCKGKgBtRS48IkKbQpyqBs7pVKbOCgU2HZAuHHdFDArK0p9NAhsRSmysKBT6Y2Uq5wQ+nwopDZwgXHcKKQ2IENqKU2hRUzZwUCGw7IENmrLK4IbEqpmwqLSm1SLSGzx2UyqWCAG0KFTNo20RambWRQYfeoR5YAHDLtK5UwC1GVBa3xQpwFWaoLTsgpbY+iFUFh0FVTJxYUSqCzdVFBY7Sqig9MCtUTOTiwKooLAhVBaNu6FPbZwrlMKCxQpxaOqsQ4tOyqGFiB8eFYHFhVQw9NEOLAgYW8KwPggbAImTC1A2PDIo4KocWd0KYWIhsAgIsGyqGFvCLyGwKII9MoU3090oP0wlDCwbIDiNlcJkceyA4oDinMfERYgOCA4BAcAhWwSg4cIg4cIDiqNhwoo4lBsUQcEGwRRwSplsFFbFWFo4lAMSoDiqYbFBsVIVseFRsTsoo4nZBsOEAxVGwClGwCUbAJSN9MIN9MIN9PZSrAw4ReUMEQuCDYKNShgqgG07KK2HCAYIB9NQD6fKi0MEAwQDAbIuMlwGyigbBsgXAKIGCKU2qRS4qZXBcEoU2cJVLgdkMFNh2QKbFFIfTG6KXBQxkhsCgU2DZFpD6YUUhtGoUikNjoJmxQIbUXBDY6cy86RtQIbPxWWoQ291DCZsGiNchDbx3UEzZ3QIbDsopDZ96ilwQryRbxC74cKqLQJ1QPjtCqZUFpZEzlUWpBQW66qpk4t4VgcWkq4TKos3RFBa9KKocWalUUFvEIKCzuiKC3hIhxarEOLCqHFquMGTi0lEOLCqHFiJTiw6BVDD0ygf6aUpxZwoUwsKqUw9NDGVB6SUMLAqhhaNFFMLdFYyOBSFNgqDiEDNsEBYpCjiVUEWEoXJsEBwKQo4cJgybAoDgUqDglBwSg4JQcEBw4QHBAcUBxSFbBIDikKws4SGcjhwkK2HAQHA7AIDgUWtgd0Sjhyg2CUbBBseFOdeYcTshytidkGx6IgYIrYoNhwithwVEbA7FUb6ZUqxvp9EA+nypVb6aUD6aUbBCtgnOczY8IBjwhAxUqxsUAwQDBCl+nwyNcjfTKIXAqKGBRcZDAKAfT5UA+mqFPpjZRaXBAMOEhS4qKU2qKU2IENqkUptKBTagQ2KmCGw0WctENh2SHMU+mdkCmw7KZXCZsUi4IfT5QpTZupnDWMpmxSCZ9PhKqZs4UCG3hFIbOyKniQ7qZXCZtdQTusKKmbdGUVM2KKXE7IPJYeK7YcOQ4tcqiwtooGFvDBawyqLeyCltp7bKphW21+dkFBatYwzlQWFCqCzRkS4OLFUqosQUFiuDKgsTCZyoLOFUOLOEKcWDZXBk4t4VjJxYgcWgaIU4tGyIYWuhnBxZwqhxYgYW8OgYWnZA2B2VT4nHp7pUHBCmwQMLCqUR6aJTD0wgYWDZUwOI2UgZikBxKsBwKIbBFHBQMLeFYlbDhMGcmwOyfE+A4FCjghyjglBwQjYIDhwhBx4VBw4CDYqKOJQbBEwOKK2BQo4FCtgdkKOB2QrYKFHBCh9NUo/TUK30ylAwQHDhBsChAxKhGxT4rORsTsg2J2QbE7INidlBseEUMUGxSLQwUGwCFbC1ChgEyYDDgKDYoFxOyK2JQDHhADahC4BADYiwuHCmcmMBgdkaDA7ImAw4UilPppClwSLS/TQKfTUC/TGyQD6Y2UyuCH0xsikNhChgptUUhs4RSG1AhtRSGzhQIfTKKQ2Hbuoqd1iipmwqZyENiLjKZ9MKKmbNlFTNvCKmbOFAhCmcKndafwUVI2oSlb3U0UivGFq71wqgtVRYW8JgycWuzaqotbaPvVRQWpgyoLVWcrC1kDi3uiKC1WIoLVYZypbbREqotNKq8hynFpVQ4sKqHFhKqKj01KHFiBxYgcemESmFoEMqhxZwqHFiBxZwkS/AwtViHFqYwoi1WIbBAwsCpnBsRsoQcSdFcpgwsKZMZN9MoG+nygOClDYKoOAQNgNkyco48IZwOKEHEoo47JUg4oo48Oqg4cKA4oDjwgOKJytirSDiosbFSLRxCqQcRshnDY8IQceEwRsUi8zYoQWQjY8Ikw2PBRcxsTsosHHhBsTslSDigGCA4hFbEKDYhEjNwgzcIc7Nwis3CAMg2KDYhQDHsiwMUGwQgfTOyAYHZRaGB7oNgqBhypFbAKIGA2RQwGyQuWw4RSmxRcFNqIDKqDbqUgYhCAbOEUhsOyZMFw7KKBsKBfp8sopT6fsEoU2KKQ2cKBTYNkMZhDZwovOQ2MikNqiwhsUEzayqkNqixM2cIENnCy0mbOFBM+mSipmzdRUzZ+KhUjYi85DYCpVSutCKmbRRlBPEPRZi14wC7uCotMQtMqC0nRUq1tqFVFlFcJlS2yiqK22dglRUWDXwRFbbBsmTGVBYBo/C0igs4VRUWJEUFqsDi1EyoLFU5Ti3ZIHFiooLG0SIcWHQKwOPTKYMnw6KpkwsRKcWIGHpq0OPTCIfEDRSgtwqQwtRDCxRTCxKQwtVQcUyYMLeEIItegVDYHZReQRYqlNgiURYEKOI5Sg4jZAcRshBxQgi1Fg4pgzhsUBxCIItHVFHDhEoiw7JRsOAlBwKVRw5RK2A3Sg4DlQo4jZVK2I2UyuGYbKozDZRWbhAW4QZgi8rMiMyK2IVRmCitj1QHHhBsFItb6Z4VhWw6IVj6aFbBIUMAorYBVGw4CAYnZRWYhEZlMYXIMhGYJBseEWtg+nioB9PhDGQPp+OiKH0yotKbNygGCDYhQgYDZADYNkAwQKbNlGiYoAyAYhQLhwqFwOyjRTZwopTYdUQuCKU+msqmfTVoU27qKQ2BQqZs4UyuMkNqikNvCGMpG1FIbXSCZsKipG3hRUzapFTNhFFFSNnHZQTuseVOZedI26IuEzZCLhPFSLXji3Rd3nVFvZWCgt2VxhMq22qxFrbUFRYyrOcq22cIK22LTKgsVFR6aCgsVRUWURKcWBEUFnCqKizhA4tCEOLSVUOLAgcWrUQ2CmDKg9PhVLg4sQNhwimxKVDD0zqhnJh6Y3RD4BCmFg6olHEbOnKpseEQwsVIbBAcUBxQgi1DODY8FCDgdlQcEBwUwZMLFStgFKDgFUoi0dUKOA2UoOHAQpsVUbHlRRxQjYqo2IUWDiFSNiEgzDZRRx4VQceEI2J2SKOJSDYpBseUBxCQy2ISGBxGymeQ52x4SDMhjDMixmCJBZAMQgOI2RWw4UGwVGw5Uo2G5SgYHdBsEo2HDqVQxGyDYBRWwGgCqBgooYIBiixsShGY7IQMeEGw4UAwShfplRQPpoYyH0whS4BT/4v/wBDAbKKGI2QDAIlKbEUptUUuKBTailNgRCGxFxSmwqFIbOEUhsUCn09lF5EzZ3RSGxRUz6amVwmbFAhsCLypmxFSNoUCGwKLhE2t0UaTNmqCJtZRUza6iom1FJiorxrbN16HnWFj6QrhFRa2iCttnCIuLWpVXCZUts1VRYWqooLVUVFvCooLDslRUWHZEqgsKCgsVTKgsVFBY6IcWAK1FBZwgcenwlIoLFUzk2KJDi1KQwsQMLEDi3hEMLeEXPIYWHZVDYHdAw9NM5MGw5RDCwIDiFQRYgOIQNihRxRKOKGBx7oc5sUGx5VIOO6g2IQMLeFQcTskGxOykXAiwqg4EpAfpndAcOURvphFHAIDgEpGFoTBkceEI2PCDYhBmCLDMhGY7KUHE7IlbEpVwOJSnM2CUrMEpAwGyUg4DZKNgNkpBx4QwGKitiN0I2IQbHlCNig2JTI2B0CHI2JUGxRWxRAxCixsByg2AQbBTIGPCZMAQgDIoYyh8AwQDFRYGJ6qozFQA2ouC4gqLnEA2IYA+miUp9MqZaxkMCiExUy1gMQgU2AqBTYikxQKbe6BTaikNnCZMENhUjRDbupBM2JAl1hCipm3hTOFTu9NFwmbFFTPpqCRsRcZTNiLUrrFFSutGqmVSus2UXCJtUypMZUHjCwru4KixtVamVrbN0FhaeyuEytbYNlUVttfogtbbwtMqC1UVFqIqLURQWqmVBZwiRS2w7KoqLG0RDiwlUqlvpqlUFiJaYWohxYopxYFUNiNgiGAVhTC07IU4sQMLeEQ2PCAsiwcVUhsVQws4hQHDhXmTnNgf8ACgYWHgIDgd0QcEUcAkBFo0dWA4cIGFnCAi1EjC3eUUcRCEHHhAWQbE7KVRxOyrI4lSq2KUHFKNh4pSjiNlKDiNko2A2TBkceAgOJ6INioNiqNjyg2KA4lMmGxKlVsSlBxPARK2B4SjY8qVWx7pRsE5TkHDhUrYgaKLzhiNkLBYbK1Ax5QbGEoGJRWxKXBysxSkDHhKRsUK2CFY27KLWxQbEoA1VFDDgJChjoyLGYeChnDY8IkBhshAI7qLANvCoU2FFwBsOykKXEpFDFIRseFIFNiBT6fCBD6amWsBgqlKbFlSmxCkNnCjVKbGRKU2hDlIbEVM2bKKQ27oqd1igkbW5TK4TNqgkbSFlpM2uiom1Sqldb4JlcYSutQwjdayipXWKLUsSo1XkC3YOuzzq22HZVF7bCeiGFrbGVSqizlXCZWtsGiuEyrbYrUVFg2RFrbBsiKi3ZXGDKgtVRUWomTgKwUtsVTKgtRDC1CHFqGTi3h0Q4tJ0VwZwYWHZA49M9OFRQWfeiGwCQo4qoYWSgYWDZ0WmFiqCLeFA+JVQceUIOKiwWVgOJ2KEHA7K5yYwbBAcQpSDjKtQcJqs2LaOCtStgAd1CmxGyUHGKJRsd4UUcTuiUcQqMw6oCyILcIQAOFGs4HE7ICLSqjYosHHlEjC0aqLGxCEHEIRmGyEZggLIMyEZoSHMzJBmQgshGaHUWNiUyRsUSNig2J0RYzHZCMbTsgzHZCBjworAJgyzIkZkiiyZwMyTIzTRAMUAxSrGxMpggYnZBseFUbBItbBC4KbPBRaGHKcxztidlUDFlFbFQbEdOUyYDFApsUXBTb3RSkIAyiwrImcQpt4UUhtRSm07IENqkUptUOYhsQJiVGiG3hUIbOFKqZsIQIbeygkbFGsZSNihUjZwplUrrVFTut4UVE2sipXWqKgbW6KVYTCapSPFttXVxXFqotbarE51hburhnKttrrURa2zulIrbZwqi1thRFhYegVwigsVwZVFiRMqD01UUFgCCgtVRQWcIHFo2VjJxaUgcWURTixEh8VUFuEimFh2VQwsQOLD9yFMLD96FNhylQ2AQwLBAceFQRYouTC0BKkMAdEpGZKCylWCycyc4i3hUHEqFHFKgi3RAcfJFg48qo2O5QbEKLBxCEZhsgLDZAUMAgyKIBRGxOyRaOJVRsSoDiUGxQHFKNh7BCtgpRsEW5EWoNiBLonKOMIYbFFbGAh8WbdBhakKzFBmP3KNMxVRsSGRWZEZlMrhmPRAcYKqNiNggGARWwdQo4bK1ANh2UVmbRWpGZRWYKQBkGIDoYw2IVAx5UUGKqM3CEBkUMe6UA2+Ci4LjyhAxO3dAGKitiiBh9zqLnJTb2ShTYi/7i4qLQxCIXAKKQ2KBTYikNqEKbVBM2pViZtRcENqgmbNkawkbWUi1M2qCN1qKkbVFRutUhUrrVFRutRUbrVFqWMqNPIttouzguLRsrhF7bdWWsYZysLeEFrbYRMrW2q4Ra21VFRarhMqi07KkUFnCCws3CvIycWnogpb6ZQzlQWJhMnFrqnMoLEooLBsiHxGyHKIt4VSHFrophb2RDi3hVBFqYyZwYWhCGbhAcTsqGwQoi1CiLSaqUNjRKDgiUcVKDiEBxGgQFkBZUxhmQjNwiwUSMhBxOqK2JQHEoXA4ojYpQcfJAcQhhmUoOPDoDjwg2J2QHEoRhadkMtidkGxKijgVYNiUMYbE7oRsDHmg2BKc5zDgUGwJQHA8INh0QHB0o2J6pRseEowt4TBlsfJCMxfVSrG6hVIzBRQYbIMAEMswQZvFFDEoVmKDMUVmQjNCEbEbKUgYeCDYdGQDEpRmQZlCs3dAMRslGwj3IBilIDbqkDHZQwGPCLyFxEooG1lAFYgECiypTagU2+xRaQhFKRwpFKbUiENvZRambWRaQhQJdb2Ui1M28KiZCgmbeEVE2qNYTIUEbrUVK61SKhdaoJXBRULrUVNpQryrbV0c17bFaL22urzMrCwIlXtsdUysLdlcM5WttpEqorbaqRW21BUWsiKC11UypbYhlQW8KphQWHZEUtsP3qocWIGFpKBx6Y3QPgNVUp8AhgRYNnQMwVQW7KKLKoYA6Ig4lSrjBgO6Ug4lARahkWRDY0KEHFCNiqo4qFbHhDAi1KZHFARYEwZyLAGiIKUjMgItJQHFCDhuqNiosbEJARahkWQZpZAWKHIzIDigzdYQrAIZFkGbTbVCMyAshAb8EUUSM33IrN96IyK3sUGkFQjN4IRmRW80ILIkZtEqi3HZKjAJTIY6qLWwEoVsBuUGwCFyws2TBmhidkRm0oi5w2iEZggDIMQmTAMW9yi8jM2iK3ZVAbVRQNvKAYnskKCIyQZu6kUGCUgY7KhTsyAN9yFBpaqKTHlArMpFCEQDaNFAhtRaQjyRaVlCFNqCd1qipkKKQgFDmSutUVMhFTut/FDCN1sqLjKZCKhdaoqVwUELgpGkbrVFwjih8HnW28Loxle207Ksr22FKi9thVFhZolRa2xWpla2wKorbYNlUqwtA0VTn51BamEysLQAiHAVFLbVUyoLeOigZlQ4t/BUhxb9wRDYomMHFuyKYWqoOO6BhbsiGFiUEWiYZSrkcUBYOgItKqQ2I1KEEAbdFFjIGbhVBFpQy2KKLIkFkBwOyA4FAcAhzCLRshzDj96iiyqMyUFuEGZBmRYLVSIzd0GYKjMkG8tlFbhAVRpQZCMyDMpgyzbShBZKRm8EVmaqVOdm8EGbVTmW0WGqtRm/BRWbhKCx2VRmUI3dFZCChGRIzIrMpBuio3VQZAKaKKyoKIEaqKzBVANvLKKBBQBj9qqMgCi5ZkKDVQBUZRQZ9EAbZCA1XQBIAykGIHZAG1CtQpG6BSKsi4yBt7IENrfcpFoIFNqgQivGiLSEfgi0jKLkhtQTNqhUyFIqd1qCRFYUaSIQRutUXGUiFFRutTK4QuCyqFwSKm0rK8rgtHC6Yw55WtCqZXtCuEXtthDOF7bYWmXTZ6Hq3B7fTuuB/iALLOdppxz5w1jZ6s82Mun0/wBH+pvfD9P6t7VAsJ+CzniNnp59WOnDWNhtNXNpz0ZdNn7d+uuLW/o/XuJoB6dz+5Yzxmxxi/79PThccJts5n+zV0ZdNv7T+5a/t36n/ur/ALFj/IcNvNHax1t/0PEbvV2c9TpH7H+8Q37R+sO3+g9T/NWf8rwm+0drT1tf4zi91r7Oep0Wfy9++3h7P2X9fcN7f03qn/mrGfOeB08+32eP59PW1jyjjdXLjYbTsaup0Wfy1+/kgf7j/Xh9T+n9QDxNqmfPOAx+vs+3p61x5Nx+eT/o2nY1dS4/lb+YtP2T9b1+jf8AYs/5/wAv3+z7WGseRcfuNfZyvZ/KP8yXBx+y/qu/pl/Bc8/cXl2P19HS6Y+3/MM/o6+hf0/5O/mW8sP2b9QCzzaLX8SFnV9zeW4/X09K6ftzzHP6OpUfyX/M/wD+n9aObf8AOWfVHlm+0/j1NemfMtzq/DrX/wD+F/mqv+6L+/qel/nrHq3yvfY6NXU3j7V8y3OenT1q2fyF/Nl/5f2g/wDG9b0R4P6gWdX3h5Vp/W7uvwtaftPzPP6Pe09a39v/AObf/wBT1/0/6f8A1iz6y8p33d1+FfSPmm572jxK/wBu/wCbGH/l1k6fW9L/ADlz9a+VbzPZ1dTp6O8z3eO1p6z2/wBOv5pN2J/Q+nbvcfW9Nh4XEqZ+9vK8Y5Npns6uox9m+Z5/Jjtaetb+2/8ANAj/AGb0B/21qx638sz+bV2cunozzL5dPawpZ/TX+Z73f0/01h0B9YH3ArOr758sx8dWf5WtP2V5jn4acfzHH9Mv5nYHH9Kx/wCtp/7Kz688t/59n+K+iPMP+PT/AAXH9Lv5ih/V/RAmtp9W5x4WFYz9/wDl2PhtOzjxN+huPz8dHTnqNb/S/wDmEkf6b9CJbI+rf8PTdTP7geXY/LtOjHiXH2Lx+fjs+nPhUH9LP5gf/wC8/bwJn6nqtH/ZLn7heX/JtejT43T0Hx3z7Pp1eFS3+lf74Tdn+u/QWgNS71bnf/swpq/cPgfhs9p0afFldP2Fxvx17Pp1eFT+1X7yB/6h+iPQ+p/mLPuHwe72nd62s/YPGbzR3uow/pX+7v8AN+4/o7RoR9Qv/wCwFM/uJwnw2Wvu9a4+weL+O00d7qV/tT+5mn7n+mivy3+9mWPcTht1r6cNe3/E73R0ZEf0p/ciQ/7p+mAJqLbyZUz+4nDbrX04XH2BxG909GVh/Sj9XT/fHo/91d/nLHuLsdzq7WOpv2/22+09Geth/Sn9Wf8A8t6L7fSu+1PcXY7nV046j2+22+09Geta3+lHrn/81YNx9Ax/8xc/cbRuM9r6XT2+17/HZ+pj/Sn1nA/31YQYf6Br/wB4nuNo3Ge19J7fa9/js/UsP6TXMH/fQCaj/ZoH/wA0LGf3HxeTh+/9DeP29zOXiO59Tf2mJLf7+1n/AMLp/wB8p7j/ANv3/oPb3+47n1ns/pPY5+p+/XNo36YW+/1Ss6v3Hz8OH7/0taf29x8dv3PqP/aj0XP/AJ3fVv8AoB/rFn3G17jHaz4Wvb7Rv89n6hH9J/Rdj+9+pGv+zj/WJ7ja9xjtfSvt9o3+ez9TD+k/oBif3u8iMh9ADzzKZ/cbafDYY7Weo9vtnv8APZ/ip/aj9G//AKt61P8A4Vv2rHuLttzp6c9Tft/sd9q6MdYj+lH6N2P7v64f/q7ftT3G22509Oeo9v8AY77V0Y6wP9Kv0QLH949cR/8ACtf3p7jbbc6enPUe3+x32rox1rf2q/bP/wBn+qdtrPcy5+4vE7rR05b9AcPvdXRhj/Sr9rH/AOT/AFVWfGz7FPcTid1o6cr6A4be6+jDf2p/a2/9U/UvwLNOye4nE7rR+PWegOH3urowpb/Sz9mxe79w/W3Xat9MeWBWM/uHxl5Nns+91t4+weEnLtNfd6h/tZ+yn/8Av/rXff092/wKe4fGbvZ97xL6C4Tea+71B/az9llv3D9aSKT6f+Yr7h8Zu9n3vEnoLhN5r7vUJ/pZ+ymn7h+teIf09f8AiJ7h8Zu9n3vEegeE3mvu9Qf2t/ZiW/2/9a+k+n3/AIE9w+N3ez73WegeE3mvu9Qn+lv7LbX9w/WePp9/4FPcPjd3s+94j0Dwm8193qE/0s/ZRP8AvD9aQefT1/4ie4fGbvZ97xL6B4Tea+71B/a/9lkH9f8ArQ38T+m3BmxX3D43d7PveJPQPCbzX3epX+137BAP6z9eCQ7/AFPS930viuef3C4/5Nn0avG36C4H59p06fC39r/5fdj+s/cAYLfU9L/Uqe4XmHybLo1eNfQXA/PtOnT4W/tf/LzT+s/cGP8A1npcf9SnuDx/ybLo1eM9BcD8+06dPhEf0t/YCx/2v9wD0+f0v9UnuFx/ybLo1eM9BcD8+06dPhb+1/8AL7Fv1f7if+09L/VJ7hcf8my6NXjPQXA/PtOnT4S/2u/YWP8A4z9f0Pqel/qk9weP+TZ9GrxnoPgfn2nTp8Jv7X/y+xP+1/uMf9Z6X+qT3B4/5Nl0avGvoPgfn2nTp8Lf2v8A5f8A/wDL/cHnH/Selp/2Se4PH/JsujV4z0HwPz7Tp0+El39Lv2Nhj+u/XWlpe/0i9Kf6MLWn9wuO+Oz2fRq8TOr7C4L4a9p06fCH9rP2b/8AYfreC/p+7BX3D4zd7PveJn0Fwm8193qA/wBLv2bT9f8ArCWkP6df+Qr7h8Zu9n3vEeguE3mvu9Tf2u/Zm/8Av/1zyCx9P/MT3C4zd7PveI9BcJvNfd6m/td+zMT/ALf+tOon0/8AM1T3D4zd7PveI9BcJvNfd6m/td+ys/8At/63kP6f+ZKe4fGbvZ97xJ6C4Tea+71N/a79lj/x/wCt8fTo3/AT3D4zd7PveJfQXCbzX3eoP7Xfs8f+P/Wks7g+m3nYnuFxm72fe6z0Fwm8193qKf6WftbuP3P9WLZYY2E+5bx+4nFfHZaPx62M/YPDfDa6/wAOov8Aa39rr/vT9SxDgG30x8FfcTid1o6cp6B4be6ujAD+ln7aW/8ANP1Lk/4bNn2T3E4ndaOnJ6B4fe6ujAXf0r/QP8v7t+oAOh9Own3hbx+4u3nLsdPTlnP2BsLybbV0YJ/av9EI/wB7+u//APFa3vV9xdtudPTnqT0Bsd9q6MdYj+lX6KP/ADb1wTp9O2I6p7i7bc6enPUegNjvtXRjrJf/AEp/Tv8AJ+8+raG/i9G0z/ywtaf3F2k5dhjtZ6mNX7f7O8m2z2cdaY/pV6JD/wC+7+f9AC3/AMxX3F17jHaz4U9v9G/z2fqN/aj0CP8A1y/p9Af6xPcXXuMdr6T2/wBG/wA9n6k7v6U2FhZ++EA6n9OC/T/SBax+42r48P3/AKcs5/b7Hw2/c+op/pQQP/Xf/wDV+z1lr3H/ALfv/Qz7ff3Hc+sp/pUZb9+n+EH9Ka7f9Krj9xv7fv8A0Ht9/cdz6if2q9aP/OrOf9Af9Yt+4ujcZ7X0se3+vf47P1E/tX6pp+9enR/+hLf++r7i6NxntfSnt/r3+Oz9SX9q/wBZP/m/ouP+ru+1b9xNjudXTjqY9AbXfaejPW39qv1pdv3f0ILH/R3af8ZPcTY7nV046j0Btt9p6M9aJ/pb+5v/AOpfpuuN/wBi6e4fDbrX+DHoHiN7p/EP7XfuLOf3P9MOcb/eye4XDbrX04PQPE73R0ZS/td+8EOP1/6PHSfU/wAxb9wuD3e07vWx6C4veaO91B/a395dh+v/AEQ0r6n+YnuFwe72nd6z0Hxe80d7qSu/ph+/B2/WfoCB/l+qD/8AS5W8fuDwHx0bTo0+Jzz9icbjm17Pp1eED/S/9/FpP+0/t5Oto9T1X/8ApK4/cHy/P5Np0afEmfsTjvn2fTq8KX9sf5hL/wCl/RQf/i3/AOrXT195d/ptOjHiZ9Dcf/ro6c9SV/8ATX+Y7aH9JeBU2+qY8bQtafvzy7Pz4/l/ixq+yPMMfJn/APf4FP8ATf8AmQQ36arf9Lv/AMVX115b/wA+z/FPRXmH/Dp/ggf6efzMH/8AD+jczuR6tq6et/Lfm1dnLGfszzH5dPawW7+nf8zin6X0rz/hHrWfEhax97+WZ/Pns5Zz9m+ZY/JjtYSP9Pv5pgH9BZx/pvT/AM5b9a+V7zPZ1dTPo/zPd47WnrSu/kH+agWH7aL4qPX9Bp63hax95eVZx/6z+XX4Wc/aPmeM/wDl3tPiSu/kL+awD/5SYq3regfL6i1j7w8qzyf93d1+FM/afmeOX/q72jxIn+SP5pH/AOIvH/ael/nrfqzyvfY6NXUx6W8y3OenT1o3fyb/ADMCRd+0eq9uxsPmLlrH3R5Znl/7tP49TGftrzHGf/HV+HWlf/KH8yWs/wCz+uXowB9xW9P3N5bq/X0/j1M5+3PMdP6Or8Otzn+VP5jf/wBH/Vf8ha9R+Xb/AEdKen/MNzq6ET/LP8wiv7L+s/7m/wCxb/z3l+/0drDH+D4/ca+zlG/+XP3604n9k/XE7D9P6h91q1jzvgM/r7Pt6etnPk3HY/Q2nZ1dTnv/AGD98tD3fs3660bn9P6o/wCatY844LPJjb7Pt6etnPlPG459jtOxq6nOf2b93Yk/tX6wAVP0PU/zVr/KcJnm22jtaetn/G8Vj9LX2c9Tmu/av3Gf/L/1P/dX/Yt/1/DbzT2sdbP9DxG71dnPU5j+h/WAn/wnrBoI+ndHkt44vY55tenpwxnhdt8dGroy57/0vr2lr/Q9S07G0j4LWNvs845NWOnDOdjtMZ5dOehy+p6V9jZ2XWvuGW9OrGrmzhM6c458Oe4IiFwRUbgsrhFpSK/SPp/tH7Vbc9v7Z+lt0j0fTH/NXwPV5jxWccu115/mz1vuWny/htPNs9HZx1O30v2z9vtuBt/Q/p7TMj07A3ksZ47iM4mdpq6c9beOD2GM3GjT0Ydtn6H9IGP+yei4m35A76aLnnitrn8+rpy3jhtlj8uOjDut/T+jH+isfX5RHkuf/br/ANc9LeNlp/0x0Ou21mB2grm6Omy0gB42UHRbbpXbQqKrbadSWfyQVttPytXQH7kqui214Zvb7VBYW6CA+ygsLTDGKMgYSSB2ZWBxaQQ0g+9KKgMRX7FA4tJfhw7oHtFO6mQzOHEg1KKYWsQGg16ohsXINxIZ/PkIKMBAknT2CgAtYf4hAYQw1VocAgM07jnwUUWNwI3iVBmIgHx07KkGSCRrx56ICAbtGGgMopmcA8QSgGFzCkSOqAuxd6jWPaqAsQNRQczqgOJO7Q4MfegbFqBxx4oARpIB1ozfggYW8kmeiDOTIpqZFaUQbgCBTzQY3UALyB4pEEk6s4lhv8EUCQHYsdHogIoA8x28UADg8bxO6DPdsedNe/vQGjvoICAA3kBhWpkoMBQ1cxttVA0nEQfDkIMQZevfRKMbINDOp328UoAADh9A+mn2JQRazAkPoY3pVKNjMWhtendKA35dXNQ/togaJLkBnGygNA80l+UAAtf8oJBgdEG0m12MaoMQILVYEbahAbbQBAjU0QbEP3mUoXEC1z8zePeqUaHi0Bi7oMwAyL2isQe6oN1ujPPIUowZ3iTXmnKDYgNuddtdEAYw4l5I0VGa38p3gPyg2JgOZp4apRmmpB1J2HglCsXEyKE7MdOyAkB8X5Z0GwJ145SjMxilS0sgwclwxEjJuiAmRIBfRAIN0V1YoMCADL8nVAoJDB3PjFVUa3EUe2rindA5Lcb91FATIGMwgW4APJcAttsqjANIgOfl61eqijiDJtrz9qBTaGDgwXMA7nRAJ1qLXJQC4OTEatJQagGw0O7oNiBIDk6oExhrav8Al9/uVGa4EDF4kjR/wUAZ2Jky+yAAXUJjLSea8IjAEh209oQhQcrS4x/wzPiUQXFwJA2cuyKUi6Q+7OiAbaWkYkCNQeFQpdizEMVFTxmrTrv1VQOCKVCKTGPlBEflZKiZBZhOw0fqqExLky0gWoJ3DYcyVQpfsNS2kFIJ3WBwDM1UCXWk00h0HNjW7WW9gtCVwcGDu6COHVvtRIh6loc7tIfdMIhdbUU28FRy+pZZda1wF1p0uDhaxnOM3CZxjPO5L/03oXZA+jZc/wCYYgv5Lpjba8c2rPSxnZaM8+MdDjv/AEP6Mv8A+F9FjX/R208FvHFbbH59XTlz/ptln8mnow5P92ftzt/sH6fr9Kxvcun9dxG81drPWx/RbDd6ezjqVstee1F5c5ep1WW613Uo67Rw7e9QXtBgv3Sq6bLa66KVXRYKU4FVEXtmIce3xRVhbE0eUqr2W1JgNVSiotegaD9ilF7QSQxjQ+9SigBNIksFQ4kMJJpt1SigteCGIkqUNawtcSGjsqKW6zN1AdnUoZhaATSHI4UFMWc0qSZjzSqbWKgOiGxBcEy8NVKCA5h25Hm7KUOwLEiSlUJImLSW0+KAgN0FRbHVWqNo02060SjYAC4fwu5tShmHynkl9j5JUNUGBSX4bhKoWviARj1iEBxl3c6h2ShjaCMSZoSfaUoLl6SNQ2qDEU1tKUYmhILExbqgwLfK8Bg4GvVABJD/AJnLdISguzyAR+Y7OgwyeaHTtwlB0MMRUHyUozaAUZwfsVoIH5pYXFx5KUCkMeWlKM1ptmXLt0ShrRaRu4iJlM5BLyB4k91KAMiBURVWjPIDA7jT3KAvkdRi1DugzSDA6VSgMTjq1W2SjCRbLA156pQHALSDbDzsqNaC1XcNIShqGbmfnyUoQCLixLn82ytBLYv+LoCAxcggtDUCUYkChd5JPsEGccAw4d9WSjQD8oZpuaOyUYQA5gMBuxQYNpERv26JQTDh6a0/FQYUAEPV69koWpDaByRXwroqDL46s8CFKN8rgsxAgfYqM+ogbmlfvQC55ALi4bVqYKAvqDWQTpuUBElxBox08FKM+uTQQ6ASJE8EiuyoIkEDSAezuoA+pt6A79SqM1Q8vHs6UKBbaADt5pRrgDLuBr1TGRiNQzDXoEo0gbmAJh9VaAwektN2qUbKt1LeYFUBtJOMPAc+KBHDs5BuZ2p49kQwoHLPMdQlUHYgAyXOO5fdAQ5ca6HTghKNUNqP4Z/FKAwc5SeRHu5SjG01tNS5Jn3JQJ0c++fsQAE0IPU6DRApYl688JQMaMSADI56pQsux3n3pRmFMvy1l6pRhvLajUcMogHkO+n4pQDDh59veUoFJYnbl1aFOJhmLoEuZpNDBQIbSH2ShCxyFr7E+ZVqEbcM/wCY/ilErrQ53eo8VaEIDgksZcO/ZKJs/wApFPblMhSBIIZ6dOylEbrXmRqzVVojeHdnfeioheCXDdExkRLPdxp+CI57rZIZpVo5vUAEsz6FXGUc9/sVaOe8aHsERz4F+1VaOex4KK67Aw82Kg6bNnrTdB0WmmxqorosBgVI1UHTaTu70AUVa0U0ajTQqmF7ciWnZ1FdFuTbuoLWvT26qCgkvU6D26KikwB3HVQPaDAmJ28UFANKW2wyBgGDUPnKgpbV2cE+cophubWIL2vxuiKyR8v2dUUXYOTAE7+SgYZPBdBhbucqwfBAQQbQCWDSH26oM0s1NHoGQEEW3QIb83EKwO5NfAxPVRWJJ3J0cKjEQ4hxBLAdUQw/MJ+aUUSSSwJGhcbIA5dyYkAe8eSIx/iuckioPDoC5MhiN+RsisLi7Cm3TRIDboxJDCPbopkAC5q0/M+iAuDqaS1JkIH3aTx1UANACWGp9oAQY6yx3b7NVQXk5UDMXUGdxdNabIFBJAAIeZYeKoZwZy2kbfioBkXxBLvt4lIMKkiMQ2SAgloLvr9iAFy/zAG6oIdigLkknR3fp+CAA2g7PvWEGyuIAaoI4SAlgWZzJZkGkNoGJxrKEYm4iC+gLfYg3FpFp1j4IQACzEB2Da06oQH1BrLiv2qwa00LO4fWuiBiXi5QZyGDjRwKoAMgWgszdPuQNxt2HbxQKb2IBJEVaO1UgxJJjUV0QZ3I0JLkINkQ4DckoCXNZhwW8YQYXEmrsHhIN+V2rqgxLOxq2qAZQQflBjp2QY3H+EZZflEU7pAXNDz3D0QZySMg5I2QAEhxHTb3IC+ReQf8TfagFxJa0Frmf3JgYGkmWDkbdeqDXFiCbqAEDp4Kgu1C32qDElhLA1Jj7EAuy/htkMARoqGq8cNwVAuumRFNYVCkMDcCYeIjVCMZOgNLSPFAJAi4sZB6qg69II+CAFyHf/gzrp5oQDeRDl9+UgFQwDAwdC6JDFrt9noig4LAMWmZQAB/4g9WGqELdkMgQwoSOURnIg1ltiilalTNAW+zVEbR7aCCCVBi5fUmgNEAY8uRL08kANQCJPHtuoFi4Sa0J52VIRyAWPSde0qoS4Egs769+iKQw0tTb4DhEBwQQa0O6KmQRDz7oq6qJ3ONXPCCVRMEe2qoUiKnkugkQWpN2yggcgTLg6KiFxL7AVQQud9ix9qLSZS9QPWD7bJgc1+1DVEct4Jnw6LQhc/2BEc/8XxbyVHN6emr6qjrsH2rNHSKAVlm1UV020fQU04RXTYJah0PmpR0WOGed303UFrYq4BZM5VawTqTKDotA1hqaUWVWtDGvVEVenSDKBgC2xfqlVQCgthpLmfilRXEGlWYtzVSqe0N7vwQUtcNDUgTCBgx7U55QEAkn5uQ9VAbXc3M+gZBU8QdB8FBvzaEgluyo3yhiNfBiqofnmoaI8pTmGrp+apMa6IKEGCAHMMdeiBndqFt2ooMT2Z3uZAKEmpFG0j7koLatQ6JQoOVXmhNOiob5idH12PClwCGYRo4NYNfJKMwNrkPPu1OyUOTTR9CoA8FrXfT7eroAzkS9rwCPsVozlsgPlqdyoDL7zThACXJdmZiNUBo0uCacIB8pFpuYjf23QBid33H2QrQzggEOW08/coMKFtKfcgAJIqSSRNOUBbIu0DWPBKByBJ0aoJ8EoNWf5hBZAAZxdrWZuqAw1p376IFa4swLGhEM6oYPDuIkS8qAhzIalUGxaMfCPxSjC2AxZvYJRgCCAA3PRBiKPDGmhKBmcOxb+DRAMQWBOXB+xKMRaQwdneiDG0OwBoGP3hBiLQIMhgH99EAuBctRnch6VQA2s4mTo3TqlGa4V1hvvQEg7FpLadkAkEOGYQxHdBsfzABy09dnSjH5nkwZHxhAOCDHVKC9uggUIFEAuIBDgktGtHQEmSPEGnPvQA4ki54q+ytBjJjXaWZQYsHf3+b1QCRaACMjAuPjqlBq7GGg1fpKDCTALPzVtXQEnj5TU+9AA/ykGlSWjhAIqSSLqkUCAsAJPyiCK9EoP8A70sD1QAkiNNSfgyAEvBGsbvVAGDMbQCzEhnr8VaMbRoNmq+/syUJUQYGk91aGOgqSXr3UAdyAXltlRouMOAX0jugNNKCilABJBYEAeMKjM7w5EzA1dQJcGd36VDdOUAmkGwCdUoxh3NBDaDx3QKDRydAwOtUQD8xL9RUcIA0QYP5Y2+9ApEQAGp9miDXBtCzGRVAjPoREUZlRIgfmMEOlCOdfPQRVBO6h0I0KokS4PEOyIWazBgFBK7+ICoNd0Erg0V96K577flIh1qohcWZg2k/YmBG6szylRzXAEw5ZUc94F3LHTlUc90DdqhERYZNqqjlsDfFB12gPSdCoq9tWLyfYIOq3rH3qZV02wHo6mR0WwQ4qouFrAH5feqDottLDV9NgoL21O+0qKoBDUI9tVUPaBk2nuUVQOxkzA68KiweXkmFkOJl3YzwgcEB7rZGyCgD9D7bIHgEu4eUGDMS72iBvogaMnILUOohQG2jOABokUwMgbnwZAtoJIkyI5HZUU0khzDb+3RAXrod7fFQbUGZGmsfcqCXDMztUqBQHMgPL86UVGJcCoLwgYWOJAiG2frwpRhbDj5S0BolA7a1BUAFxLaBpf21QAO7sSDLO8+3CBgweGAFUUDW6f8AhFkRsQzQYHL/AHIMXDSQKUf7UDSAA7e0IpIIpSBRj7wqg7gyK/YoMTJxECkxuEBoSD/F7MijiYmpd43RDYwZoaBFDEdDv08kQwE0IbeX2RQcQQH47FEBjAAZgIDfegYuWFvV9DqgDal321YoCa0+Vn7lBnkbEsdkVrKCY7SdUyhSQQ4qQwarqg0eGA0ZQEEyJB8WQABxPzS87oMJDgkho5PigJ1JctIAQKwgHXSnl3QNi8/mLu2j8QgDhxIh3D6lBhVzPhxRBocMC5AoGeio1pYMXpOvCgIth63fwvo2iAQJLx+Y1CAwYAYCG5QAuTIoe+6A2tzMgdaoEYwzDGs7dFQSQS0ZM9PeoCLQDoG+KKUCGIxJYNKqMQ5AN2MSA0MoDiRJlpL6dEAFpBkyHcNy8FACaauWA3b8EBigEeCKRwSQWyGldWVQTkadYLlQbU1q2yA1rNpjYorOTIGviiAWqLgzgluyAsIIjYjXqgGU4MDSOdhTZAflhx72bp3QBzDwSwf4yEGAyEwZBIjVAuNNIb2ZWgOPzEkRy3ZUZwXat3SfeoBIHXcuFQeCCxl6oASRp0avDiEGNo0GsjSZlQTJYgVLUdjKoxr/AJTS/sHQY1LGuoUQpdgLXhjcKIMQKkA9dECEV/w6g/cqFuAlnAuKBCNolqa7oJ3HXxLIEIJehcVfRUTuDEnU6+3RBHUuenKBQDLl2TKYSYVE90VC4TOvwVRzGCwoXcDwVESNi0PCIjfR68K4HLcHBjofYq4HNdUhvFBJjk3mjLk9PFnA5DarWR12e+izlV7dxXQorrtHGyg6LSJu3+CmRa1hyNKfBFdFgh3AO+ig6AGB1YexRV7awYUDhpA7omDi0wwqavulVcAGGpT4KUMHe40GsoLWgXON6jogaT8rhxXwQM9Tw7MUDM8mem6UPSgDYsQYpuoG63AOJ2dFYHWHP8PCDDQVOgoPuQUh3l7aj7HQAOQAQ2xgwqCXOrA/l4Oig1ammvJ0IQAObi8XA0G7CVQwAGUtj+YKUOzPc00A6qVQ1JuDbbyiMKsGcB2afFAoOpDlncasfigf80GWqNEAFGDEEdkVopN4PxRGIgMBDG0bIMbS4LdtAlGYF99BXxFEoNhuu0YDSqZDAER0HPVAuJLxIEPuKHVAwAAEEk18PBBiQXFDbPt2QEgkCARUgz1ZnQF2Ichh7UQBg7iprd06pRhi1tQ8OYMboGaGnX3opXGINDi+6I1rULPby+pCZCuwh4OnxBVDgsw/CaKAQWMbgAPPvQakEBh+ZtgNOiA6uQeAemiKX8xIfSWRDEPSCAGQByCz5C6QHHRAHDPSZujXdkBqB7E90CtBtNz8+8qhpnUjTR+ygIZncAeUINkzirksXQKN9ndudYQZquGyYBxpRkBEMf4jXR26INEOWNCaOg38MkAET33QAw4H5WILN3QYlySN8Rzx5oD/AJOpd7ttigxMkuwDDhBmMtA014QDU/wnetX5QNBho8kUrsXxtyIjfuiGFXBfYaMgAcmRy0oMQCXZo2/BBsXkH4opWufcEsQ4hEKbTLmQGfhKC4Ji75RM/egzOxl4f4yOiDcFtvZ0UALaPsAdR9iI0vc4BIimiBmFaEvKKUkWsHPM7wiMAxyDMZJ3SgORDEkOANa1hAxxeWM7oJkEDUQ90K0Coa3+GIfgcqjQHYEN4AqAkvrIgdwgxIobnrwgBtBuLu/j96BADaQN9Pjugwc3F9OrFBpBjSs9UCzLiTQyoicWuxLWj8u3VaG6FiRQoEuabSW2HHggQuYdte6CVwAM0JogQg0JPmrRMiCasgjo2oMgFVMkuDhzWjlRULiGubUP9quEc9wYFo1AKCBDOSXaSqIXBoZtvBEc14DyQTwtDlvFvmdFRJi7+bKMuOw9CrnCumy6BqVIOqwjYy0+aK6LC8iPPRSDqsu1aCFmC1pBPcPqFYro9My0O9OikF7btAK1CmcKvZcK0DMkDO5iHoPYIKWkEkVYedEHQDiCanQKQNaTV4adfZ1IKi5stBQH3pA9pLGjs79eiQYyGxIep+xUUEPFa6Dus5Gc1knW0H4SrA2WptbKoPCRRehI7DcoHBttABbYBIGyFBJP2JApuyYYtpt2hINkHcmsWnrskBNziQZhhykBB1LhtAG+Gqgd2LggAbqKUXUa1m/MA3h4qxByAcsW2fnqykVn1IA2c0VRsmNxm5qJBsgHto5jfwSASa1MbHdBsqAWgEHz1SA5Ro7QXiSkGyB2YT8UimlhkSKexKRDAtLGfthSDG4O5tIectfcrBnucmS4YSg2TD5jJgDk7KQDID5WbQgzGzqwHNsizBngxqfNIBk1rCjSa+3ikB53kndBjcZNtuQO32pAchbS2dBrypFC4hw4BeATGvKuEC64mgo/y1NExgA3CtdZaOUgd5MAtQ691FK8uzvroQ1fNVGBJuJxgD2hAciATozgEpAMyDEghwY8UgwZzB3tnQoNmMQKEVmQkByYgsJhzHZikGeeedgUVheSBcYBl/blIACA/UFhCINtzn8rOKPDdEgxugl4MBp+1IGMijFRSky5EGC6Ixu4L6nRWDZCfmkiNQkGBgDEZEDybqkGNxFAza7e5IC4cHwL1Uigbg9GYxMUorEDLUQQKc90gd3YHvyopXeAG6e9EYXR+VgHfXsrAcgCHDloevtKkVjcWdg+lvwSIAukHRmDUqrBiSaTbqDq/KAwDSbtIZxKig4ufGG7F1UA0LQ1C/eiQKchDeE7cIFBGNoLXC08F/FAQaSxtj4IMSwh3ckDkx8UBfRg++2zqRQyIeDdrb76qwHL+KgAn2ZIFBDXR2BJRAclvlcDUP8AFIGeCGZ7iwFUBF+pEN8s18VIpCCGLcMaNqqhcgDq8lzR2CsBzNo0FeiQC69jsAapAQSR4ueaIFdySCCQwrKQJkA8Npd4DZIAbsiwraXSAW3OLiIdpJ+5TOEY3AswYkv5JAj6WgETQtRagW4yzFm1NVIEuIAHytowSCZul3gwCkCXEsHHUdVcCNxuIIg7EQrBN8niC0KCd9zAG7VmKsErrg70cJjA5yTD1aVRzXGWbjaPBWIjddXc0DpEc110tWrqwctxMnX4KwQmnd+VUcdkiRGlw+CI6rXbfd1Kros3Z6HZkquqw6aCGUo6LZAZrtIUHTa3yk7pWl7DAeN67aKC9sVnUn4KUXD/ADtVSghjcHB3f3K0WtpIlqdVKKiAxZgYPTlSioIAFHNAgIZgBI1G7q0VqwIDv8qlDProTTdA7sHaOfHlQMDPaTzsigBi8PNPN1aCxeS+pqPilFaBnIlShXJnFwDO6oImBc7yfJKMaNaWgy+yUC4GB3BnR9ExkOdAAwZmFXUo2RBORjTf3oDbJNNvCvvUoAcEB6VAaOXhWhqADs6isHe6K0PsyULSloBkl57q1B+YtMN3UozvNvVt6MqN8sG3t8WShrRLXB6kOpVNuwerAFh0CUCagggRa32lWoLNq4IZm0GiVQGI+YyGcFkqC/Zy/wBxUUQ7k0c/dKUAPUOZo+6UEPBoGp8AlABJAOhFXnogIAIa1gKgijpRgauG0bx1QZhUAT8UoUHZ3PBffVVGBhx+YhA1oLEXTvt5qZypSXucbflJbXZVBaG/KJmg8EoBD3B5LOB1Sgt/EBJLufBSjPbLyJcvsgwg1NzOXjTwVqjlGTAv7BQLa2zBmII06q1GD94y8Eo2jEE3SACz8TRKMSAYDBw+jaOgIEFqbBmPailBBdyY0KKTQgGZPsVahizAEuTQxKgAuORJoNacjRUEcTTVi6g0s9ZesJRtiTiDLK0As5BAYtRKMAKyxkkJQwOhgtThRQBD3giT+b8VUY3AHnbqoBAgwKDrV9laC7gEgTQ0dRQLNAdgId44VqMTqYZ5E0QEwWJcHQ6/BBpb5o3I81KC8gjZjxsigQ7iAlCAh22Jcu0+KBdgAfl7N0VqG7Et7V7qKAaX/KeyVGId7iC4p20VoIbsKMN1KpS4NGD4g90RnpqNOsz5KhnJIgiHdRQfUy7P0QAAGYJE+TVVqEGRL+fG0OrQQzgTEh5ShQYuB1j7uyB60e3inKilDsQ4jQTXRVEwaM1JhASWBhqygQOGLPEnkyVM5RmeSQXodeyUIdS7irHlWhbmLAyQZPZKFLdC8mvZ0olcAQW1Na+KUTuFIke1VcZE7ibiRvp96CUww7IEPBHBSiFxdmdgS4VwOe8h3BmaKohcXIimqojcSTBYio4RHNdBow1KUcl9DC1RJ5rG76ojjt1mqqOq2exhRXTY0Grsyiumw6Me6g6LXaQ5aCmR0WzzKjS9mpmC7+Sgvbpc2rPRMi9tSASXOvKge2WL13p2QVtedf8AEEFQQ2x0P3KBwSRNrA1lBS2LcTMR+CCo3kCg196DOB/EwB6oKOCx0mNpqsjWs4NsbRvKq4B3FGMEPMPXdUMHA3LU2+CB5YgU0MuoCRk0s0n8CgwpBe0/mh5QEUrxkR2ZBsgGeuw0PsUimBoCamC/2qAl2Z23Blh1QaaFmuAGOj1KAvFpAjc6BBjc2rHmiQBgCB3M+CBQ5LCLCxDBEYBqxEcIHJhtRXSqKV5IyYtA0RBEEUEmUU4kWuTNbgd0QXbXJ3IbYooGkF7aElEFyDbkdPxQa6AYIeSaoo99Y+CBWDmHgOKdSiDaQIGmhO5RQDy4dpB1k0QZnYlydRXZEY1t2BcHzlAZoQQ5rsigxLEVg1imqINI8/vRSs4tdiBQDy8EQTbI/wAWpZAQwc9wNepPKKDuQWckM9sxr5ojNrUGBEAIrGKzOj+LIgxR8W/KH19iit8zagiGJnrygzh2AJZp0qgAYgir66n2qiMazSeBR0GnEkCojp2RWA+aTBp70BJcZAtFBqgBNooSC7tUojESW02AroEBDucQwENCKAkwCAeGY+wRGclsXo4gIppGnB16IAGNWNpmJfvwiAA71BoxneqDC7oQPzDd+EgIHzQwADAIoSLon/Jdy3L8oGMD8ooxeA3mgABtZy4cNDMiFcM4l6mQOdEDGdBawh9OiKBgtWYI328ERmIYPQSNB4oC+hd9xCKxMNTT4IIngviHI9t0Q0h2L2iD0RWYAhywOjs2yDOIAkD2jsgLiTUGuqAamMWEalAQWABk/egECsRJhEZnFu7ObTygwq4tYmt3R4RQIIAmgmpRCQaBjPloFQpYPDwHD7aMyoYTWd6UZQHSJeCSJ+CKBa20gHrNH3REyKSdRkPNAflZ3dy/XRAvzCIbiiIBMcCR0lAheAAHNQ234qhbg0tLV+9BO6A1XLkdEC3YlhvLBQRNGrrvRUIQ1Rlz38VRETs5od0CElwfLzQQuIZ2nurhEbyH2JPxRXNdvzELSI38AGKKYRzXs8zs/mqOX1BWrw7KiGuPl8VUcfpmntJTKOq00ALNVRXRaWHaOyVXXbqA3DbrI6bZaHISi1ruQ1Gb7Uqui2eG0UqugF6g/epkVDggklzolFQSxY6QVBQEOG4YCk6pRUGvB7h0FAJLV0Cge0uBb47exSigLmjw4ShiCMpLmUoayDWA5dTOQxeLd4bblKGJMPHdGgYAbkyT96tQRcKTMA7ToyBmoGDO59xYJQwZn/i1r7lKoOBiwYbqo1WY6wRvqlGt+W5nYElgmchxcAMhIGg9pWVMXMAt8EoVyCII0Ar47KozU0bT3bbKUbQMOdCA1KJVEOBEhtISjB9wSGFfbdKFpazjLQsQCPYq1Bcu7UPl71FYxG4qA9G2ShnMGS9SPBKMLnxcO1XrwlDZPP5WDgFAdnqanVKNQAAsfYpQMoNQ0c+0oMGGuRDEqoMk0gROqlVuTXUapQRzJJpVkoW65raaaSyqMaTB6OW1UUfyi6XILj70ozi16TQ7tugznQ6M9UG1LeDJRiRBaYr1+9KA4IBOoyJ8zylQGYC1mapNCrQQRWQxE7+KiieWIMHdKA5tBeWmRSOFQQQHD4tPRQAEh7ZJ3+9ASIIfYUHuSgFnkEb7dUo35QR+YAszPXRKMznmpHTv0SgioNQBB3fqlBZmcvSvglAau5Md4dKAHA+Zneo9/mrQQ8AjcnhSjUDiO1T5pRodzEta2qUEVpIgFKAAem46pQCwrcfmBlKMCcm0P5njuFQcplwXZlACCXINQwIKUEVZ/wDhBKNwQxIlAAzC7FgHbulQX3iZPGiKUnEOBI5j7EoXWTQiKpQdiXAdAGIA4EsPclBkxBZ6zwlCsQboGLTNd/crUE4gfNIAYk6gKVSn8xuya3UfFlahiSSw6j2bhRRIDiu4CUYbmlQUoXIiSGA3hUKxcu9zUSjAGAKDn20ShQw/yd2+PirUM2MBgKkqVQFwe4vFFQLiHfmVKJkwbmJ4BKqDMF2h7koX8txiKm56AqVAuIBbFuEwFmCHJIrwrQpIPQ+EpRO6Tszz70oS4muo9mQSJDgbv8wnzCoiToPbxShXBgCdQgjc06gQ4VoncWNOjJjI5biQ5FGrVURuJftTWVajnvDF9NvxSo5r2LsRqFRzXnjhWiL/ADM/tVKjhsNA79FR1WFh4qDpti6hPtyorqtJ3bRQdFpAmZ3QdFpFBzKirWNoeoKmVdNmhc9T7lMi1h0YhpPPgoKaM1FQ9rsADIFUFrCbgDXcJkOGa3FneNUFQRFSeeFkMC7Cj0I3CooCCHqABTdQM50JJofeimcEZuwURoteal3KKIfToake9UE5MCJimqKd7uhqx+5AQwBbQhj7FBgRoIJem5QYEjVwD7hKAvQs7weOEGtg1kgFMgPaWNA8katx2SIpR3l6AU8lFByCZcOSRqgzN+YOHqUBdyxgs8H3KAAkC6pYwTqXVBMl3AHXxogDQQCKFw7Ud/MoA9Cx0Zq9KohjSDpDMorBjLM1UAAa4kQ5o6obIkBy5qbT7cIMCTyDRBhdWIp22QOLrXggadh+Kg0FnIkBh8FQJ+ZyBsdkG+UuCKnmS26DNBe0R+XaEBipI6kKDFjBqacPrKoHLfLcX4QF6/K2ooFANCGAJ09zqgi4OXOxHfhSAG6TXjTTdUH+HRw2LoMGoDUT8GQBoLEBjXw1QaHDmszHtVAfmDbDfRAIuILmDSmqDSSAZLSWQYXWuWEhmfwSAtJIAJFa8IAxLzLSAIpTZAS7OSxGvTiUBIJY0q5hx71AtsCJGg253VGMSzA7V5EINBMdepr8EGBunIEtIAZAdXq5fSIqgFRczToKnugxJk21Z3aD0QZzLCKkblkCk6RPyx7FEOKHQ3b+2iig4IeNiQ/uQAXwAC5aRuqNlVwAH8UCm64AkeI51hAXnln691AopBDav4P0VGJkSHGj+KDbwK1G/QoA5cVj8zeVEB/4rgU435QEuQGNWJP2KAC1tzjIfToqM5I0IMcIDHNaNOygVw5DgB4bgKhQWdgS0t14VG/i3u4KAXAgEhwAPzatqiG4aA0nhFAFw8ULHbugDAOAcXnKiIVySRQEsZk8eSARtUOX7orNIeRsiBJ1lm1ooFyAcFqO4norAtXkh0QLiAwcDaECEiCwaiBHYOJf2KCReXkifF1oTuu7mjn7kEbmoeHOiDGmj1ZQc5gUymiolcDxx8VRz3GrS/vVHPdcJBoKOiI33OC8AVZVHLfQidh7FUc190ttVIIsc3iqtRwWXAblyqOqy4EuzyoR023NJpRRXTZf7exRXTZfD8QoR0W3CnkoL23hxqQVFX9O8Oz6KCwuAkOYgIKi7tVm3Qh83Y7mm4QWtvJ0+U9FFh7S48sfwVpD23M4pvH4qZFQRWbhRQh82Lu/FPehFMrfGvhqgEO2L7IQwIuIban3qcxDZOWbWPNBnypG5aHnQq1RyHIPRkGF4YRBbYQ33IRTN2+bE7cn3oMbiCYnp4IMbqQzAECD2CAOGYFjQgVhCNvptoZbzQhnbICuhQjZkwzBoIFFIDkLhUh9NYlCGe2SZ69VCM4qA1DCEA32u5Yc/BUF6PaW2jzUGcngnVCMSAxekv0qhAdgDi21ux+9UjM0hz5JSC4lxyTFVCMTQgF3nw8kIBapJGpPbRUjAg5Pb+bwLhCDkxerVpDfaoBmQIMES9CqQxvAEhgDTdlAMiSajUt08FSDmLWf+I7oQwvEj5mhoUWBnboCxk8uiRsxpUy34KkY3gk1BFWgygY3D5hbqKHwooQcg58kWFytnXXLqiQcrWd2EsSWQgA23M+8FCCLnE2kBtd0AoQwkRa4jyVIxuYF3IME7uoNkJe2akDhUYgAUadD5hSkZ7Rabdaxo6pANwaHcboQ2Vtsy7UjT8VFjZWnsQ/tKJC5T0cA1r3lUjZ2AsHBPvQgZnUQZJY+EVQEepbL2u5g1cBQDIEYm01BYtDyqRswdC5p7VUIxvtBNrByI8+ioN18Aij+9QhcwavEbchCFe0uzHQH4KkEXPuHJZ0BBJaOhPwUILw5ltojxRYR7SRD6Y92VQzhy/BFuqhABADFiHpSB96pBcQcd2ajKBXcUIc1HTVUgkgRBDwDoyEC675XB6jQR0Qa0/KSATB08qoQ7h5Mj2oosIDaxO4D6+eyqRs3JZ+tKJApIlixMyemyoBJYfxHUcaoQwumQRRggUEgTNadZQhiavR5UIRxaa8sA/dWkY3AhnIxiqEKbnZgQXkgfagDvNsA1CUAXGIfihUQMm+YTHzShALGWJerKkC68WuS8SgmSD80yJaAhE3rcQ4EjRUhMnOrAxVAuYEUArsgibw1HbTmsOhEyQGn2KqRO4gaOzbOhEiX+aQ+nkhELrwC5glm9yohddoCRzqqIm4T1REL7gHL1og5byJ6y3itEcpugzKqIv8AM+r1blB59umj1VR1WR41UV1WXMA7qDotu1BpJUV0WkRNNd0HVafx5UVUEkB4fyUF7bpA32eEVcFzWDpRlBa0yKHbuoKhhI1KAu7ih2QVtLSIfX2KCoZjU6EIGBpMaHZA9vys5qXlRThwxYRLBA4IJEi3UPtsgM2zUVPRA7ijDrxopAQdOIBKgIBEGhNK6K0Yy0ToVVGrmf8AJ+3zUBF1CXIuLqhgXJYMRTSDRQABgwDu86eSoLMxrzvsgYCej+agUwXJ0Ymk8qgACA4JMGdp+KBssSNH8t1IGyLQH60SDChoxp00DICTowMT8FAAKzq8RXog0QRqdPYIMAD8wcZPBG9UB2LPsDugLGLqHUIMGA+URuKboF/Mzh3h990BtB5Y9imRiAWB/hn7EAJalIfqN2QEkEggiH1QAmTUkUd+3FUBnQVPQd0A1BJDk09mQGdiTSfegABIo13s+nwQYOzsa0130QYORc/zA0OjICwJ+ZwQ7z8UGL6FoqgBud+KDy5QAHIhjAeW16qh5tGzmBTsoMSwDjkBApu/MSTDEtp0KA/M5aAK8e9AA7sXHPU8boCCdQSaA6x9qAECT/CYbRAHB+UyYZ9e6o1vzOD8suBrKBi4LGXoGqygBctMgtaXZz2QEksCNNYQbJxFAWYhIMBNpLkjX3oAasZP8Q08UBIDyeQCHhBuMXtO0oBN0AgjxQF67SzFkG5kP9roAZbfSNW5EICSAa11hAAHj5WeNw2/RBtw4/ym2lAXucEMAIPXyQapIYhxIqgF2xq2zpgYEEyBIhtlRhcDT/ja9lIFFw0Alzl3furBmMPJq7IM/Dvp0NEAeh/NsX1VG5brb0QDn+E19mQG4OQ12LFMDE0AJPM12dQKXuh2HmqFAdhOOr790AItrUdkGBJFrOdz+KmUrEvaXDlnIQKS3zCZEoAA5BedBsFQjiJFdD7kALuGoHcoJm6QAWGvLIEJihAGnsVRMuLiHrTdEKSBHiTsdHRUSQ9QQIA6IhSW6DbhBI3czugiSGMxLaKiF1zmAY3VErjo5eRoiZc9xZ20lUc9xBMU4VwOe403VRzXkS3cboiLz5qjgtOnRBey4kbEVGio67LmjusjotILEDpsouHRbdXnyQdNtwiXGiiuiw9Nn2UFQ3jBSqvaQwO2/vUFgQ0CnhCC1hatApVO4/hlyA9UQzj8paKOgsLnG3tsopw06lq6cK0PkzNMcqBhUlhNT8EofNi7vQcqBxdQOztKDBrqyTUKh8mYCmrqDAiS8vACBy9AIOte6lC7sxFR15VoYXUbzEAaorbkTDIAHBLOAJ9grQ4uAEuJ+bZ1AXB/irIND5oNjDlnma9EoaSJcRXYoMSAdBugEAxJqT+J1SjOxJuLhoB4QAQ2lAwQb/JctEjcVZA70YAAaqAPbVhBY7hUZyHALvDtVAwYuA8u51hQFyG68j7kAECHcvG0IMbrp1aS2z/cnICwEUl6JQpBcc0EjqlBaTAcwD7cJQddJG+/uQCks+MjfmUoYuDVqv0QD/J0L4ilPNBh/khnl4TOQANCPy0SjfKA1YDb8IM/zOxcCj86INQMSIgPwlDO7fLMA61QLV2i4Q4/BKDSAw03hKAXajzA47pRt7WYuXPHggDEAziSfHRKGcQ1QW8UGMsdz8PNKAxktk+h4Sgh+DHy9W0QaZLtsN9n6oBNSWLgM7INRwT35CDEEyBNCD1dKDjaH0IDk8eSUaQGMAsPHolG5obqv7kAAIJEEHsyUFgzM5YkxD0SgA2nr11QE0BEdeUoANpbj8ohkDEnRp1qEAi126jZxCUAk1cWtRBoBJJ1lnQDIO/jogUkzkKGCH3qyoLgmXgwgx3dpd/wSgGCHa4Ma8V0QaoYEF5380GFTrFdX3SgO7hoeVQYmpqBPKgPUhxTolCG7cAvQ/BADc5k0LR0QKXrAA3PgVaM4qLhrPvjspRnYAgHE1ZKjABiASC7P1UoV8S4D6eSoBLFycQgWATRz+X8FQLrgYIcB/mqgmSDFtAYQKZq23hslCEm41HcUVQDWrk1KVUriKUqyUSykh2brPREK7SPw+KCd12oAoWCCdxZ9ZGSYVC64Se7qoidz+CtELriTBB3LojnuuE7Es6ohfdBIh5VHMSQ/lsqy57yJ02TAg/z/BUcNh4QXtNPJB02EwenZQdNhgPHfVQdNpAPWqir2HbSohTKui0sXNG9iguC7RFXUFRcXd2H8I5SKtaW7SVBedNJoiqAg67OVBTKHZuapgEXWkS816+wViK5As8ifJRTvDl28wgclg/LhBnYhxNGFOB5qIrlvw5UU766GppCAi6m4gbFUEkia/BATBNG9nUDC4EVJ/whICCSS4BGyDDQu4BnryoCKlux3GvvVWi5c+KDCWJAHPdAPmYsfmFDCB8mlhSu+yA5W3DsenZAWaP4Wk/Ygwc1YNBG+6BWMAt9jbKghv4gwFCW8FBqtQcEVVBcy1JDqDO4JB/5MlBqsYPtzsgwNaOwBCAuYcToDKAGgdy7x2QHMuAd/l37skGdyYYj+J/i7oC4drY0cqAgyRLM59ggwLi4sw0PxQHQPazSihZwYDUkdkyg6HEhz4P96BTaCHfkNHSSgJcCAKdHZAdQ5rQIAzuDShLoMZfia88ICSWYaQR+KAM2nzXVQGCKV1E0/BBmioI25q6AAzwK8NPxQYxWBd0qKIGJLginigSLWMV6tvKc40kMLWDGWmiAhi5BYmh0ICAA7watIdAzQQwmpaEAtta0jLWXHwTIxFzk1eDOiAF9DsO9JQM5DA6+3KBXBcbQG37INkCCR0fvyyQGCGagQKSwdvm1uH2qwLmCzEguGHwSA5FtXrMT7BIAROQLj7WQaQXGsHsgYkiGfkxRApALyXaG6oC8Eg5TH2IMBUnQu40QEiWMx0QBjLAQ7asgDSS7hm31QA3h3Fr7nnZAQTo8jXRAlHEAmSd0BcSNRtOiBXBMl2luqDSzg8nuiDIdug8tlAlpA/yQGg/eg1zmdqGkqgVZ33YoFl3baWVAy+UkPq+mpQKbiJu1o0lQLk413QTdiS+R2/FUK8TdAiOyoU3EDikwgmSaab0QJk+sVJVgQzSYUoW+6vRMYErjEliaqjnuuYVZoICIhdcDr3VxgJdczyx1CIhcW44VHNddroKhUQuIejIiF9w67lVHLfSQqOdy+XkqOGy7nWQqOq09hqsi9lzBnGqDptLN1ooOq0vrPCiremSdZ+1FXtuIDbwoL23O/wAUFxd96iqAmRQsJQWtu7cxpEqCwMAE10KCttzan/g/coKQaAkEymFF8WDx2V50OLgXbeg51hRTi4QKDUGeUFDcd2EUTAYOOpllARoCWek7IHzDZaa86ICLtTpTiuiB7TMgvvv2UBFDMmoM/YqCQQPzNsXZAcj0ippKkBYUYc9HQFjcB8VAQWmm6AOxfQ7096oIL6sGYN70WtqCzNLinO6AmASKmsFAQTONwJZ2QYXXUPEcdkBJNJf/ABBARdTnWnigwFdrvE+KAmWmN6U8EGmpoJG6BcmIJDMKhWBgxf5Z6VdQZ2Zq+27IA/YwCO2iAQZIm6gd/DRA0s38JEEa1QaXjWjzSqDF2JqW3p3QF2uEs/mUAFwdn/KYFa0QYPpe4aorXogzu5obY6IA5tJYO+nXlA2RYvtDlICDA/ijyUCuQ7AuAdKkqggtQNaPyoNnQs7aUZIGyYCIAbhlIBkXJYEavVWBYgEBiaCA6A6HU06dEGygQCGkT7kgGQkU3J25lICDq8W/m29mQB63A0BHtCBgbntfaB9qDZGtWgJAlxOhZzr4pgFyHq/+IINqLiAxqemqDAF9CdfZ0G/LOjyNuUGJo7R+ZAGMOAYo6DFhOm8ICQMpMtDoMSADO7nUcoDo0hhEIAAYP5uD7FAAImnMOgJLMWa7RzXugV/zEtAmKsgJuDFwRHaECEmhck1ID86qjEs9zna4iNIUGJoLQ5GsIMIfkMbvxQLUEAIggsdRsis4rVqs9QogktJLCSgmbh3Z3VgGR4Dltm2Vg0ZEEmjv8HQK7HrDjeqAEuPloWIMoASCZ1qgQ3RBx3+MoFJFS5Ya9UCk3Pta1FQpuGgcvTT2lAhu/wAp7h7UQTuI+wcDRETeTuSCD1p5qgEtDNlp7BQIbpIJ+5BI3ANMqiV1zxq0oI3XSdeFRElpEaP9qIjddJJPboqOe66QHfb4KiFxhn7fFBK65hp9iI5b7h74VRzX3HuahURnbyVR59t7NzRI06bLxGnVSDotuGrd1EdFl/CK6bLmbXdTJF7b9d4P2KRV7b5SC9t4D9a7qRV7bmf5oOsBBYXuJBo4UFLb7RDzskVWy5g21PemcEXtuBEud3lQhhfQ09tkgqLgwdjo+6hDO8g9OqpDAl3Ad6O6kByAh32mXQPbcHcflPsIQVzBIccuYogJuxpTVIGBAl2LUUhD5M8EhvJRWzq0nY6KwG28AvbtI5RD/U1aD2lIrWsRBLmpLVZEhnDSHANSgIuLgMQ3RSKwvG1NjMcJBhcDqzy9EiGBd/mnz3UWBk9B2b8KqjR8xqx/LQezIGyBkSwE6R1QYlyXjf3IoltWcCT9yEbKHALkJBjc51tpISDC+cZpBPs6DG9nOm41kKkNmHYCQIHtRQgi4ESOI6INkALmD9tX2SDChfn5RwhGMEyeAHhCNGoJLF0IPygDxHCEY6jQUHnCED5XAY8ARyhGdq0pT3oC4cDWnavdIBENUCDqhBBDs0NRCCC80fVCFFwf8xLQwSAAmflYGAqGoNyNT03UIAud4+V2hIjAuNbnAn7kVhc4ly+ujeaQEmBE+JQbJtDokGcOxPLdSgxkHV6gBCMCzljMkalBnli5b+JAHckaVY8oRhNrh2IjVvN0IJajG48oRjcGpFSyQCQXD6hzX2dCNlABM78gKwHUSWM+7ooRtuB0QjC4Fn1MDzlIBkAxduIQgZSQAS8EaOyEb6jmJFEgGRIuYMX1/FAM+X2SDPoWIEY7JAuTOSzEQPuSBwbQBqbY5QKb3FC/tuyRGFxiCJcqAZS0gbaN3QbIUDlmYinkkAzAmrnqKwkCm8G4NUvLOrEYXGhHAqEgV2H5Q+sdlRs7JGrUSDG+ZaRpuopcixhhWFUhcwSGpo0aIFyG7Ws/ZFhcsWkxUUSIV6gTEj2KpGybncosTNwALU2O6JCZaswJfQIFJJd4YwgU3B3Ylj+bZUTN476+NVAl1xAqQ8kmVYJ33EAtJ1O/ZCI3XhpqzEhWCZuES5r1QSJFrsHOvt3TnRG6+WfpburEQuvmndIIX3kRxX7lRC64STroiOe+8SGfVlcYEL75bhiqOa64OTrwqiP1A9fbqkV5wu1Wh0WXGNlB02l9ZUyL2Hsg6Bc7CnKiui256+/yQXsNQzgyoLW3Gru8htUVe26XJnQdFBYXkUkioQWFzgOK6cKB3AYaiQiq231aSD7kirW3vr82kKCoNNCDRQMCTpTQQCgplMQBLe9QPkYL1ZuVUM566GFCjO7inKKIuMB22ZUOC1QwoFBRx0c6oMbjyWYR5pAwMvMmVBstTt14QPkBx5dUBBY8En26IGyMw1PM7IDlE1EPKBoPJoUAAMfws1D5IGm2hjWEABLiGAMIGyrDEDnVSDFmcSaBAaMIHDIM/LOw6+9FZv4dH2SjVuLiHmfglGcB3cQSwPc+9UM4dhEO52CisxIEkaoBpcwoxAVRtKEDQdeiDEkEgXSzse6A51AMceKQEEkBrpbiiKUGIaDXkohjcZDs0ugxIFs1qgZ3JDHvIRQu0IjQlpCIOQY86fFRS/LD6u6qGLMxID69UAcMJYaFBnA5iEGyx2IP5qoA4BM0JnZBgbdbgWfI09qoGe0AaAaj4qKDgUkEgv3VGcCskl/GiIzWkB9NduiUAF4JqGeJZAcrY2erNKDXEAcGAPuQLk+jy2qDEksYtGp19nQbNg5LAFgPhqgxNzSXLV2+5FaRJOTkDbtCIFxltRr3QYD/ABGnt5oGYQ/YaBRStRtD5aKgXADgGo0RBcXM55kT0UG9iDRKA+rIVuAe5qgBZnYfNqIoURhAcl3rKDOBqYNaIA4IOqoXK4sKxLO/gkDBiHBijoFJEvABFeUCvbTQRX23QA3nbGQ2tKpACZLnhh5IFyYEi2jtPigAJaHHXpogVw+pd3OyBctXFpqOSrBriQxqaOUCPt8uqonkxAFRTXhAMiYq1TshQdmDtx+KIE0gkMAgmbmhpanARSEh9zLoEytNCXJdBI3FoiVRM36gnU/ckREkihd6KhDeN+6QRJaIGwVRC66SMp2QQJFXHLKiRJBYn2CI577ndq0KDnvuMjfdVELrt3O4Co57ywaGdMCOerndUedbfpDaKo6QW+Kiumy6k+wUyrosugAaKIsLqDyQdFt3kiui24001UF7bn9veoKi/uUVYXmN9HhQXF/n+KiqW3OwBYRDaIigJqO3wCVVLbiGO9RoEyKW+pTmh67KKrnE0QPbcdz7eKgpbeXYjrrKB8jBlm9tVKGBES54VqQzxs87IMLjActTaiBxcep3G0qKbIlmLv7QrQRe8QHkeKgYEMSHtag2KAuXAFDI+5A+Wm0FQEXl4MfxeCA5EAwQalvggNpoA9tZ0QEXEfxOedUBN8vi5Ghqg2Rt8YbmVQRXYuXea0UoYEl2DABtkGybtQ7+wQYEgkiQTIQHJhMaugNpB37saqA5CR4kR7URRc1cFzHKAOwiSIAp2lBiXdixO2roDqGZz0olAJd5d+NkpRBl7paQSlGJYkm13En4USgk7n7Iq5ZKBlIhiX+5CjAIfR2SgFhqZYMFaoBiXEm4yaQlQwuDOKeXdRWJbbLQdVRgdtaH3lkBd8gILUKgWj0PEDxZWo1WActr4QiszByPmYT7OlRiXL6N+aiDGK6b76JQXOhrpy/VFZ5gvEAIAZEN0OgHdEYwbaTAAQGOpGilVnDBi/T7kQCRMzq9aJRiSHOr6fGqUAtUtwXborQS+kkGaa8lSjOzDEjbfxSjF++9H+1KACTr2bfdKCSWqHA1+xKMXJZnfV0oGVS4cH8UQpOjGPt4VGyaWZhHRAci8kP7UUUoNavpCqMbiHYSfgg0WuwYsKJQNPzZe1O6ULkDo0wxZUbMuxECH1hQYksJd9UC5NAZ2lj4ooZXP10KIU3mZir8DZUKbwKv4mEGJeAQAa90ANwtkzPUygU3EMwc0ShM7gaSduqoBuJI21MhQJcZp8CqgSHlhoNNUCuzGmzsGSkKb5/5yKQ3kPtJLoEJJ1qgQ3GN/NUTN/zAUQSN5Ys71KombxqXendEqd1zzoK8IIm6mpGqqIG4sS5BnoqJXXmdjvCGco3XO50CIhdfuKKjnuvZ2M0VETdq8oiF91Zog577mHwVVzZl1UcNt1PeqjosuLB4UF7Lmg90V02391FdFt9C7cqRF7bmZvFBW2/QIrosv1Md1M4Fxc1TGg1UFRcxPvRVBds1Z7IL23uPe8LIqLtjOpf3oKi4GlRuHRTg3NvuFFUF5YacOkFBc1SeqCgvejka+9A4vp3b7FAwvIoxGyQOLoLD7UDgxo9SyiQRdkN5f2dAXJBqR/CVQz/KwHUcKKYXiKDp7kByblwYQNk9DwSgIuc3B3F3tsgMDoKDZAzzR32UBdxV9bXQEXCSZeTtRARfWg+5AXAB5YR8aoGtuNRqabdXRRFxq/G6Agu3iCEGBaWLbD2CIOVtXqYZBoJO3mgwIIYNHKAs5Id/bhAXcmh2CkVg9styeyIO8TQ3IpQflNz1d2+9WIZ2ABruSpFZw4J0cMkABA4AaJ17IGcAuavCAAjzejH4IDkJYuAHZ596DOJJYtJQb5Q4dn35QYEVgywKg0EE/wAOrVVRiC5gEAflFUUwbjnrRQLqC7AVJ8VQXnWKjfzUGx27iqABxW2ZoqM7nY0OiBXDEO1KndEMLgzu7OT3lIrMMefeUANwtJklqpEGHqG8T7kUruxduAYRBcaS1B8EAyNdNQdkgwMzazlwNeqRWfWjVOzBkAF0Yt3ZEAE3Nx2qKqjAM0voW2HRASBXYx2RQcFi/IO4RABAMPu1EC5FzdV9NPjogLk1YXFn9yAEuJrps6AZB3fTYvCBcgNNoHCDZXBoeafggGQAIOjBAj2mGZjvvoqDkaAMalSDEl5nYKhCedK8HlACREQUCm9+jvHHVAuQLhmCBXNNQZKAVoRNURiRALMNCgU3NrUSPwQhDeJBDaTCRSXXuSJcKwIbh8xiNECm+R8zcIJm8ikA1/FBI3EhquqEycgPoURM3ASOjcqid13LkoiRuDtTjzVETeewQRNz18RyqiRvh9BoEETerBz33ly32JgQuO7cqolfcR96DmvuaWVwrmuuBJoqhMkSvMtvb4KjpsuoPFQdAucNqlF7b2ijKK6bb+/RRV7b36iqiLW3M0pRYXe3KKtbfQbKC1vqD7W+9BYXCJp+YKKoLqcGQyUVtvpyJ+KC4udgeqzVUF7kzT8UDi53cNPigplL+W6VTj1HPtRQP9QPa/YGsoHF8hy7nr5oKG+Az8tKA5kNUnb2CCgunpyoHyoNpUoIu0h+NuVaQzvFOqDWx93xRDZF9izsotEXs1PdPRUEXOHkTQ6qUHKAXBG9FaDkLWeY8+EocXB93NW1ClGegd+ffCBsyBPn+CDZVggoMbg9oiGhA2bsMnNQ6gxLg5DHXslDO2s+2qVRDMdCaslAcSx0EaylQ4uD1BmT1SqF1xE7OwNUQzkS3sUqg4HQCLhwlQ2Q3c6Hr0RQfafwSoI4oN57JVAXWgEwwqyqDDkwWrp59FKrC05Eg7+KVGbEAVHilGkfMxJb5bde6Kzi1311EVTnBeXcAUBPHVBiagFruCgBdgHcmnxSoMtB4aiVRd9Sgzk1IHd0CgmvDjSOUQSSS9WEjUJRgfeKlFBmks9UqMYl6UFEqi8UYtrM9EAiBtLMlQdnPwSgEiguYvR39mSjEiBDUKVQBiCeW9ilRnBDCXqyUAk/4X4PXdKDlMxu1JSqDl30FD1SgZyHdAHDOTRy/KVAJHyiIiUqgCKNXRKjOTbSu+qVQN7C0P3fREDIXFw5aiKGY6MqgF3G1uh12QBzuzz8KFADcKAdiFaBkG0nXRKBddo7UbVSgC5gBL7JQuREnSs7pQt1JltD9quMjO0mI9pUKXggdVakbKu+6VYTKmwepUoU+prR6EKiZLyI4JQKbmBPEP5q0Ib2FTw6UTNwJMj7igmb3LAPOvkqFuJkulCXXgMw7IhDfI/DyQSN7ZHwKojdewarbKold6g3+xBM3Rv5oI3XM4Bd5CtRzm7o6tEjfI02QRuvd211RELrhQFtm4Vohdd3VVz33DfslRC64B5nZWolnz7Og84EKovZeISK6bTTyWRe24EQaoq1twfdQXtvcxpCRV7b94OqguLq0PKIsLnIUVS2/kNuguLxBBHI0UgsLoo/UoKC6hZ9lFUtvoxdggsLxEztXRRVAdjOh0QUF7NEbBBQHwCgLyGr7e9FUFwA21I4QOLgDz8KoKfUoQHOpCkDA03ZkDggiYQEXA8bHokD5NUu9Ad1BQXblzoygwugVejmoVDOwklgKoC4M0Iq+iILh58N0WtwS5ZwgzwBQGSUDEvUxsfNA4voAWhwFFEXFqto9aKozvd49UURcDLtxuiMGcMXbQcIGe5o13UUQTVi7R7QgxuFBroffCQaCK5ceSIPMA7OimdyZnVtYUAfUBVBdjOsvqFFFxX8zxvEoNlqWGz6eSAuJ2KBXHzGm569VQQ4YO5IjhAXEfM0nVQZ3cC4M71VDEmQ46eagWKtFSXVBBpM08FBpoS77oNJYv0JLIBOTO7aKg8SNj5KDaSWgh/egGRaC++kDdVBd2IuIGiijlO7eKAGWYuAOEAg6iBLboNkKguIbSUAd7iduXQHK0BmYeXdAou3G/i6DZ1faQ2qqNbdRqCQTUplRFwLb8e2qgQXtrTWOisRi0AGpnfZFbIS9NUgAIuBaJnWU5gAajrHgkAe6rxLN96oBIgRaZd0QMpI2FWQMbtPBlFI7V6Ame6qFJBapb4dEAJDyHNtEGclhTcBAjhoZzt7BAQe4iUKWAQPGK6IgEgww6fdCAEh+u3j5osBwARI20QIbpc3TodECm4EEs43okC5B23oVQl14diWqgBuDIIm/aN9a9FYFJBcmW3QI9D4klEKbwJJZ0hUzeC3NFYIm7XfTp4IiZuIG5KonddLAsYJRU7i4L+3iiJXXAQINRvsqiJv0PbZII3XipLbBUSNwL7IIG4gEP3V50SuLcsioXXb9FRz3XB2HsERG64NWlVRz3XUYzurhEckHm23k60WmV7biWe7RRV7bzvRIrot9Q7tupB0W3neAoK23kaoL2+oYmtCKKRpa31DXLSgUFhfuURcXdSVFUzP3oK2+oQWeKBBYeoZnuFBUXnUxogoLzvEsotVFxiS5qUFB6hIIBnR9eykU31DLFyzwiK53dZkoqn1CaHhSB86dUDC7Is8EIGzJivaPNFpheXckSfdwge31C7gxSNtFBQepc7kuKMUDC44mWIQE3khn+KBxdcB+ZpUB+oaAjmHSBhcNTOoQHK5vzA7goQwIIlh23SkM9WuqdN0B+Z+EAycNyzQgwvLTDiZ0QHIvV0BzuZnbogP1KtAQHMt+YF6nRA2ZAkyJMIALmdoZygY3NAJfQoMLi5uccoMC1CH1HxQEXFqlpLkoCLjNr9R70ByuLtBNSFFDK4O5cH4oNlcAzDV0QRfcwDzsitk5mKP0QNlDEtFVAMiJLknTRVC5kEBteNEgbOTEakwkUAWMFnDx7kByrIfaI2Ugz1kF36qg5E9FBsneQW8fBAuRLE1NFRjcz13NKINlrVvggIvJL8VSAC81Hc6cpAc7gWhmhIFF2LkCTqiBmXY66MPPxVgIvuIqQdWHXqpBhdcwZwHdigDmJI4Z9FRnIjIOKOg2RqJmGZRQyJdpDCPgqhcySSaVH3INncHLkPNH7IBmRJvHKKGRdzDs6IXMw4g1DaaIML7gILgGjIA9zBzWoLeaDAlm2qyDZEjadPwQAlxWkM6DfUgYl0C5l5IcCRCBc2Z7hugXO4vID18EAN5g5bwkC5EPKBDeZaHOoVCi81yjRkyE+pcSS8GhQTNzlgXdUA3k1JbnVApJH8TDZKhD6jNvq26QqZ9S5g5bZmdWBTfcAPbwQTPqefmiJn1CJy3Vgmb7mm7vRBM+oXI9yFSN50LblVE7rz03+9BG71bvaisErry4kxqgldfqNIQRuv8VURu9QjWEVE33KohdfV0EbrzR4VRz3XnfyVELryXD9FRHIv8dUR59ty1lF7bt67KKvbf24UFrbj1RV7b+WhQdFt/lopBa2/Yu+ikVa26jd0Frb534UVYXyBXWqQWF+5fhQVyhwQOUFLb4r30QUtvYzFOiCtt53DPBUFh6lJ0dlIHFw1ZtUWqAkSKIGF+h9nRVcwdZ0dQOL6seUD5Unuge31JclgpBQE8e5QMLgXGo0VBfo2oRTZFo9vFA4vJ1aVIGz53Y8oCLyw23QO7iZ2ZARcTUhzHdIDk8abaJA4uY9VATeQ8MBsimF+LCUQcrqjXyQHIGof4IMLgHdyftQMQDMB4dBgHcvHgg2g0ZhugaXh6qKXLSrCaEqoJIo4ZobzQFzQEG7dAHd/lrt7bINlq2roHzcP3qorZmRoBThUFy4nqiNMHx0KAi94AgeSg2RdneXNfbRVQNx1IaqIOWniNUAG7DhKGF00oaqKBurruOiqMSWgCPYIC+4oXQK5G25QF6FjB1QZ/yiAUAButHxHvQF+5NAUUDexFN26og5NDdkUCTDOQ/sUQM3JlyPJFDIjffr4IgOWY0CDZGDQiHqgDnQQ2nkgzkyPfCAOWaST2QEw5csdlAHDw44pwqBUMIf7GZAfyuW2p1RQyOzNQIgZVj7ZQDJgC3RpQA3mNW9qKKXIlnAYvJlVAN0cawgQ3R8xfqqAbrnBFPZ0gV2IamroFN7u1N0AzrudTr7kCZVjsKIFyNRuwPVUI5lvlq7ogG7l6QKoUmcc1lIFuvAGgGzpAhuMsfFUIboApWiBLrmER04QSuv0VQmTjcIJm+pBdEpDfNegQSuvAeqoldcX25+CCV16ondcxDmUEieyCN18wa7KwRuv+1BI3M502VRG68pEc917l1oQvv8lRG66r+KIjdcyCOU1lVHCC9DKtVUXtXdEdFt/4KKvbe/ZQVtu1B7IL23wfMKKtbdMIL237dlkWF6iqW3KiwvLg8qKuLxuygpbe48KIKZCATXRA9t9PBBUXmJEQSoKi+al2hBQXnbzUFcx32RTC6YrUoHyL8UZ0Di+stOzMop8g8xow2ogYepNWejhEUFzM8j4qKf6mrkhqpA/1BUwaBARdGoNIQNlV9aNFNEoLkayBKKYXXUqDVAx9QBuKbypAc31L7jZA4v1p1QNnt1aiA5vUO3vQEXAw4fUH2CA5xXuNFA2YFYBpogIvodUBzYE7Ul0BF7gEeNaoGy3Pf8FFbNydkQR6gkx4hUAlpM+dEByDwEBBFXbsoMDk4neY9mVGe0EOWfdBnDSYKAns4KgM0oSae9BnLs51CowOx4IUGfTTRAAS0nnsqGc7vqe6ig5aoLOgORk02BhEDKPtH2qjZHQnpqoM8tl2HiyAFyK1q6o2RpRy9ZGiAvMzIUGLy0ooOCdy6IxL7dEArQgDaqoJNoc8zCgBIlj2Z0o2Qq8VlVWyFsmC6iBbcIoH0TIGZr4KjH1GMmqgUXVkH8KxuqpTeHgjlyiNk3V3dAM7mu9zV3QKbyCJbg68oBnq4A38lQDdzAQDKhpEqBchGWgqFQn1DUxLT5IBdcBqw4p0QLkYYdRxoqA9xl24U5ApuYkmay+yqUuZrR6bRygX6ndygX6jO6BDcakoEy2LkVVCZPwzONECG+h1ogS664irKoQ3aHs23ZAh9SfeURM+oW5VEjeAKwPwQTuvLxu5LoJG+u5VCG6ZPmgmb/NBG6/bsNFRG71D2nugkb0ETc3DhVEbrw/IVRG655Mkaq8wjf6nkmBC66JVRG69kgjdeqJZoOK25EWFwKiqW3FUWtuCgvbfypBa24aFBW29vcoq9t4+5Ba29meikFrbtB3UVUXCJdCqi6NkVW2+kzsoKi/Sr6aIKi+mu6gcXMILIKC7qx2QUF7wCgoLwQON1BQeoNIoSkDi9wzOygpkH6/BFNbc+rEmUDZkPXcsgceoQz9winF4NWflQPlSfsCAi6rVOn3FA4vAGg26KQPlViYCBxcDp+KgOQHQGSgL1Y61VqmN/Nd1CiLoZ+u6BhdXyCA5liGqgYX8t0QNnIrwSigLhL1FSEQ2TwY2lAchR2N0FARe7Tq6gOYoQJ0KQFyQzQZqimF79tUgGe1ddUgJ9Rm2SDZgzrPTukQRedex9nRRyAL6DpyoCbyRNCzQgw9RueIqg2T6SDRVBzIcuGMeCigLwXL9w9FUH6jksYCK2etEGy3rp+CIJvFY4UUBfAdnpsqjZM+rBBjcWYnuoNmKQPhyqoG9oo77+KI31KAGtaIoi4/NJIOigGWmpmNUC5B4pUuqC9p43DqBc5dwW3oqNmd+ERjfqO5bZIoZcEvUMiBlEkRL1SAPJLhyWPVADcHkyOFQLi5fbRMDZAPNHl0UDfQ7KBfqfNEDUKoB9SheqKXMVB096IBviuvdAjxNWY91RjcwEPSQgBu4rCgXNme5viqhTc9Ke/hAv1GhzyUgQ36CvG/dIFN2gL9S6oXIAoEN8NSY6KwIbxpXhAh9R/lp18EiUhut1OqFKb2l35QJd6lZkHoiJ3XhhLvAVxgTu9RtezoJm4CQWVCZa71LIJm4O7uQyCd14Vgkb6zzKCV1/bR3QSuuqdd1RI3BETu9QTqRokELr6tqqiN16ojdc7z0QRN2/ZVEbr+7qwRuvEpBC65UI44TlRxW3BUWtIUFhcGQOC3IQXtuG6iq23aoLW3DrwoKi7wRVrb1Be24Rwoqovb3uiKi+AHUgrbdFUVQXs2hSKoLm8FBUXu24QVF1PIKCgu0egr0QO57IGF7auge2/dmr7FMiovBgyNlA+fMGiQOPUkiVA4u5cU8EU2UuNoKFM51A9tEU+RjU7oGF40LMaBA2TauRpRA4uEB2ah+xQML5JeNvBAwvL8DX3qQMbhV5QML9a6pA2RZQEXwK88oGyFXpVAH1rNSfbZVaJu3JZ/ghTi7WpUAF24beXVgbJ9e6gObOO+yBsg5Lvx0RRFzBhBaWRAygh2eJ1CBhczDwfRFE3hoIfxIRGFwgxygOoYMwZvvQDJ206IGe06t4hQAkFhWZZUE3aExMKAu01I1KoAukS+8oM+r9dnQYEAkg8M6KwgEOW1RGdy4LAc1QYFnAMjlBif8rSbnAQYkbtLHlBgQ8E+xRQdq3ayiM4AaGaiDPEB+soA8HQBy46IBkGoxoEBztrDS/LoAboDkBtkUMgKO5UQHakHY0VAyEmp0CDG7YsZQTN1KnzVByllAM9AaUNdFYUMjSv3IA7ULV/FEAlzv9miAG7VjGigXLVhq7TVUDPUd+6BTedQPgkC5GtTuUCm/lmgTurAmQLAnRApv8pCoU3tSen3IFN8gIEc11bVEKS1NWhApuAeWJ1QIfUL/ABREzcKEto6sCG4Eb8oJm9jwdVRM3OOqBTcZ0mOiBMx3CCZvMh+jqwSuvl9kwJm+uvKQSNwI3V5ghu+8IlSuuhiUEbvU+5WIjdfXzVgjde78IJG51SpXXSiI3XOghdfKsEiSa0VRO66uqCb/ADIrhB5VRUXcoLW3U96gtbcoqgO0qiguRFrbwoq1t/ioKi4HWlUFbb29zKLVbb0FRd5ILW3w1VBYX0HmopxcPBBQXS+pRVLb5rRQUF+lSB7kFReDL0UD56+CBxc+wdKKZH70DC7V2ZQPbfTVUPmN/bsoHF4dhEdUD57kcEKBxfV44RTZCJogYEVoaIUz0cTygYX9jsopheANxv8AiqCLw4Y0dA+YkcQFICLrqk16oGF43GjIGyepf/CoDmw7oGyB6/agOes1+1Aw9QTqdQpBsgzEPqUDZPL9OqAgwHNUABNSRyEBcTQdKpVbJn1hUog0lwEAF2wLmoQpgXr2JUGzBnQUdATczac+aDZFifAfg6A5MBABKAZaTRggYXggMYbXZIBnz0BQEX0makfFBhe4YgEbIBmCZLvQMyA5g6sDogU3MQxjZvigIvihHCQbJoBZAuZFDrqXVGNzsCRyPxUGylvBBsncjug2XLNsgGXgKsgAuO7lkKGTawNSFSs4hqEqDZQJ7BELkIPmqAS4OjFo2UGPqNwEgxuLN7SgQ3kjY6KgZh9xoUCm5n2KBTfUvUCFQMoIfglApvEkHwQKSB4wgXPsQqBmTXp2UCv+CqENwcuS40QpTcJNSUCm+rVRC5aP0KBDfXrKoTMUJdBP6jvzUqhTdXVBPKo0p4oEN5DZHugU3sHeuqCZvYTTUoJm/wC5USN7jZBM3Pr1KoQ31colTuvG/RBG71HoqiRvVgldeBTsgjkS6BDcByiI3XOqI3XqiF13dVEyWQTuueiCN1xZ0VN9XVRxi5/tRFAUVUXKKsL4QVF50UFRc/CBxcR0RFbbqaoqwvKgrbfo7qCoukNCCgvLToirW3qB7b9EFhfDarKqW38oKC9BQXS7qKcXvXRBQXvrATmFMwJKCgv13UgcXt96BxdDu2qBhdVA4uNOyBh6nNKlQOL+WmUD5pA2T0L7uophe0v0QOLq6bnXZAwveD0ZAXAMSgYFyOJQo5EEBxPiiiLyDWEDm/V+FAfqQ79GVBzqBrHRQMLzDmXkhINmT2qBukD5HQvOygObfagOZpM0YoAb36BUPmLQS9BXooNk9D1KBsywkg6GqDfU2kjR0gOb3CWGiDZ6aNRAc3+IKDH1GqWmqQbLvKQNkDXwUgwIaZ1ZIAbiHYqjfU3LJCsbngdEGytI9wdBnkbBpQHINAPQqQDIt7grAMndmFDyyQA3tQuduEgbL3uoBm7iK6KwA+oxDpAPqNDhjqgGfNdUAzFCxBpVBvqEVKBcyXPYFAMjMvcgzjwpWEAyIFYAZAubaz1VgGQPxSBTe8wYd9kgBvakE6oFzI44QDLzqqFN2phlACeYVQMg9eGQoG8DXzQIfUoN+yBDe+uqBTcaaIhTewLTurAhv/BApvPdFTyM1mIVQhI1KBchPzQ9ECm/SiCZvcmqQIfUZ/egmbup1VCG8s57oJm7sFRM3+KJUjfyqJm9666IJ3Xz0SCV1+misRK65UTNyIldfygkbueFRE38pBI3EmqoS65kErrkEbr1RG650QjyqOIXeK0KW30UyLW3pkVF1FlVBcVRQXwoqttyCou8VEiguQUF1PIoVUXfeiq23+epUFRe4HKkFBfxKCguoyLVLb9VMqpb6m+mqQUF+tFBQXnpNEgoL9SzoHy5bZRTi5m8UFBefBA49SdkDi8791BQX8dEBFw02olDC59eyB8jLS2igIvZthqVQ4vMVhRT/U7bIgj1Nan7UgcX1UgbI6mlEU2Z9t0BF5nUGqBs2D6lAchImEDZQ/KgOQ+KFEXFhQgqqwJfuoDmfJUNm3bhQbOm4D9EDD1G6hAc9kBPqeSQbNj3bVIDmB3080gAvfbnlIGzPQJAXgCdqqDG4kHTsrBhfseyg2Uma6fag2f+UOUgOTbxQ/akAyuq8ahBvqamldEhWzbVgKQkBF0BkAzq0b8INnMk/Y6sGNxLSRukAzhyTKQA3MY2o6A5PqVAuerUoOqsGF7aUglIBmQweldEAPqDdtHSAfUOzjVAM/DQAIBkdCzIFF1NBV1RsjrqoUhuapNvO6qVsmBINd3QrG4MdFAp9SO0qhTfQ6oFN5ADEg+KIU3B0UuYoNKqwL9TVIFN4EVHX70QmfLcfagU3wZgvRULdcZ5TAXKJPcIFzAoXRSm9n9qohTeJ96Kmb3REzfu/BqqEN0l/FAmb8oEN+yIkb37KiZ9SKsgnddXfdUIbuSgmbvLRVKmb6gIJXX+CRErr9lRI3+SombtaIiZuQSN3EoJm9VUjegkbifsVRM3BBK69ETzmqo5AVRUXIHF1PeoKi8JBYXKQOCiqW3IKC77lBYXqKoLtXRFBdygcXIK237aqZVS2/70FRf+Kgpbed/FBQXjwRacXa+aBxf06KKoPVivVIKW3xVlBQX+XvSBxfvRQOLtaIHyoQYJRTfUP2pBT6jtNVAReOQ1UFBdzUSimF6IYXg9tEDi5qHpsoo5btyqgi5mksCgYXw71UDC9zuQgb6lfIoG+pzOiRRzcdNkgYXAto0hEMLiorC96RzQqob6laB9H1UUc36IDnQ/BAcw1Q2qAi8MHkoDluZ0QbIMz9kKwLOH6IUciRVrkBBYMCGQHI7wotE3yeKoBkYadEByIAMcngINlLQgwvu4CDZnXxQbMuAD1lAMrqvzCoORp5qAZND1QF4+CAZVDV2hBsgYq1AqBlcX7Qd0ShkdT1QrZ6dki1stT4olbJQoZCYd6iFQMxv1QA3hnE6oB9Rojp9qAZuw8AQg31GMmSgXMBtTqgQ+rWWCsRvqaeSQKb2LkDqigfUEbV6IFzk68IhMzwNmQDOunRULk/fRRSuxOiqAbxv3UC56eaqlN+tAiEN25HOqBTeKbopDezz5qoQ36pAmTPPUoFN3fmEEzeDGuqqFN/LtRSCRvfnzVCG/lBM38qwIb9URM3tqqlTN9UE7r5rTRMYErr9aKid1/KCZv7KwTN34oiZubVBM37VVVM3pBE3OqhCVBM3KokbpQSNyoTJUcwLohnQVFyiqC5BQXqCttyCguBUVQXMgoL0VQXIKC9QUF2yiQ4uVooLlKp7b2AbTRBS2/fwQUF1N1BQXs2qUUtvdn1UVQX8vuED5nZFOL+XUDi/zQUFw35KBxfO/CgcX7w+qBxfALdQgYXE6simFzIGzYbclA4vrKBhfQKBhdPWnZA9t8QwGuzKKbPempKIOTopspd+yVByAFXZFNkZNEqALw0E9O6obJi7zqophe0xwgJv69UQTfHvSqb6gG8BQH6hPXVOQN9QbRugOYavJQDKXLHl5QEXjQk6bogm8hgJhFHIPVygw9SjeOqBs4r0UC5VMDchUEepSS40dAc3l/bupQR6h4YoALywb2ZKDmdISjZlya7IMbyAPigGcTU0lBs67jlAM6sQSqNmYHLBAD6mhLmpPRBsz20Cg2ZVAN4DOZ0HCAZgkz1lAueSIOaKXN9eycgGaBR6gI381QPqN8UQBfFZRSm/USCgXIQ26qAbieqlAJDMS6tGNwOp56KUKbxFQ2qoGZOrTKilN4KIX6mjsqpDeAPgiEN408VQpvL1pooFyJ1V5AhuBk12QA3gMiEN5nVAhvndAhv4VEz6joJm/togQ3nRUIb90SkN6tRM3oJm8boJm9UTN78oEN3KCZu28UqENypEzfyipG5UTN6CZLoiZuRE7r1RI3coJm77gqJm5UI/Kg5wVUUFygZA+UJFUF1FA4u/FUVtuUzgVFyiqAoGFxCCgvBUVQXcoKC4b9lBQXcpA4uoiHF33oHFyiqC+kud0Di+sugoLqSoKC8tVA4vetUU4v581CnFze90U4u+8IG+pRIKD1KbCrpA2YCgoL2FUDC+RrypA2T0qEDC7lkU2XvhA2fKAi6vmgcXs/KimF6IOcmaIGF4qPBkDD1BR6QUimzUGzp5lVBFwp4Iovs8ICDz4INlsQdkDC4tuyg2bbxoiNnAnx4RRyNXZ6jlAcueiDZRWiA5w7g8FARe+qAZy2T7h0Bzn3ygw9TR2O3CA/UJbVIjZ7l3oisb/AMAg2ZFUBy5YIFzfUazsg31K68IDnz5oB9R4eQgxvO7IEzViDmVIrG47sgGfikAz7uYViBlR/JRWyZgGA0KAZWjWNFQDcTqeQg2dW7FAM66bpAuew6JAue/vQKb9awg2Y3ZAhuHHKqFPqAcdEgU36SWCQLn2QDPlkKQ3D7VShmygTPdVCm9izoFzr5ugnmOh3VCm/ugQ3+VEEzd7tVUKbncOhSG9pQTN/wBqIQ3oJm8VVCG/aEEyeVQhu5QIbiiJkosIb9kgmbpq6omb0EyXZVCZAIJm9ESN0KiZPZUIboUEyXVwEJRMly47oOcOqHBKZDgnlQUdAwKKcE8oKAnYqClpKCgJmCyCgJ2KinHgUDgnZFPaTsgqCdAoHBOxUFASdEDgnYqIcEzBCoZzsop3u2PKCgN2xQODcNDygoDdsfgoHBuGjhA4uNGoopgTVigZzs6BgTEFFUBu2fZAwuu/wlA2R2QODdDA8qBgbtigYG4aE7oHBu0HVQEkxCKYE7VQF7pgoCCeaoC91GKBwb5a3uii9wqCdnQFzEFEF+PJA73agqKz3ag8IjEl5DnR1Q73MYUUAb5g90Q2V2x6IrPdsUQSSzEP7dUVnumJ7ojPxCAudB02RWc62lBnZ6xxwgznQRqOEQXLMxRWc7FQB3o46bKozn70UX2B6hQBzt+CqA5aiDORpVBgbtujIASa3AtsUVnuFAeEGyuMAFtUAJueiAE3bEnRAHucBkAe7YoA921yBXuYwiA5Gh8FRsrqsZUikN10QfB1QCTsW1qiFOT0lADlFUCvc8glAHOgKBSbho6IV7tBHCoBN2yBCbnoe6Bcrpg+CBCbnoVQhN2oIKBCbmoUCudvJEKSdkCG4iGJ7KhCTsiFJOxRU3uahbogQm/YqokSdpTAVzsqEJOxKIUk6COFBNzsqpCTMFBMk7FUTJOgKqEJOqKQlEISZgoJEnZVEyTsUCEnbuipknY9VUIXQITwiEJPLoFnlUf/2Q==" />
      </div>
      <div id="parallax_illustration">
        <div id="auth"></div>

        <img alt="404 | &ldquo;This is not the web page you are looking for&rdquo;" class="js-plaxify" data-xrange="20" data-yrange="10" height="249" id="parallax_error_text" width="271"
        src="data:image/png;base64,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" />

        <img alt="Octobi Wan Catnobi" class="js-plaxify" data-xrange="10" data-yrange="10" height="230" id="parallax_octocat" width="188"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAADmCAMAAABYgh8IAAAAA3NCSVQICAjb4U/gAAABgFBMVEX///9SOCxSOjH/wp8AAAD+wJ4ICAhWPjL/7tDMQjj////66834vZuZmZmVcl+bdmN7KCIxIRr39/dUQjpRS0nFQjhKMihptaVQRUEzJyAyIx46KSF8LSdAKyJSOCxUQjqcincQEBBSOjFSOjHzp4tSOCz/xqZSOjFkTEBUQjpSOjG7qJP/+PQpHhpSOjFSOjH87+jz4cRqUURDMSlTSURQRUFUQjr/1r//0bAaEg9UQjqHZFL/59nOTENTSURSOCyNfGojGhddV0wpKSnGl3yWlJKUh3d4YlM5OTkQEBDez7fLvKWdj4hzW0xIQj/05+bbp4nWZlZTSURTSURSOjFSOjHo17yMgn5+bFwZLSlWPjL358v/4sL5w6XWxKyJcmF3VkYhFxIzMzP86MynnIi1jHRXmYwhISEYGBhSOCwICAj50rvehn+SblqRMClWPjIICAgAAACLZWJAa2I2XVRRS0kQEBBUQjpLOC/xt5blqqWvhnBNh3spRD4ICAhWPjKmNNozAAAAgHRSTlMA////////////////////////RBH///8i///////uZv//d4j/3f+q/1WZ////Zrv/////IjN3////M////zPM//8RM/////8RiP////8R////EUTM7v////+7/////////yL/////RGa73f////+q7u7///8id5mq//////+q7kFCNkwAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzQGstOgAAAgAElEQVR4nMVdh0PUyBo32U2C7gLC0vvCozcBQREbFlTUs/feFfXOe/q84on/+pv2lZkkm6x3nCNuSzL5zTe/r8zMl2TXrsTSNrny2/z8+PBgZX/yDv9e6Tp6rXKongMGPV0i+TI+eXWngGWUrsmpGxrGt2u5DxrxfIPel3++d2ywbQcxJpa2ym8DHit5hV9B6JGvP/q+P145saNgrdJWmcKeV/LzvBs5xXfds4togUDvfRv5l/hf+c3Xvc763/NWch3b5bFjtOhNB3jjR3cY965dhzTN7aJ0L5fo57CxrPHw4Vh+zfke5ILnvoNZ/+BH3mSeGqboCHV8RE2R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" />

        <img alt="land speeder" class="js-plaxify" data-xrange="10" data-yrange="10" height="156" id="parallax_speeder" width="440"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbgAAACcCAMAAAA6Xk4VAAAAA3NCSVQICAjb4U/gAAADAFBMVEX///9NmcCTfmuUe2OQd2KMdWGGcFqEbVqEa1JNmcCbhGucf2ibhGucf2iUe2NHhaiQd2KfinFJm8ajhWubhGucf2iDeW2Qd2KBdmuMclqKbllzYExJm8ajhWubhGucf2iMclqKbllJnctEnMubhGucf2icfWKQd2JChaxJnctEnMujhWubhGuegWWcf2iQd2KjhWubhGuegWWcf2iUe2OMclqKbllIodGjhWubhGuegWWUe2OMclpEpNdBoNOnimujhWuegWWUe2M8iriMclpsWkhDp92ljXOnimujhWulhGSegWWcfWKUe2M4i76VeF2Uc1mMclqOb1NCq+FDp92tjXCnimujhWulhGQyi8WMclpPrdxLrN1Cq+FAquM9quM/qOOvkG87peCtjXCtjGunimuqh2o2n9ujhWurhGSlhGQ2ltKcfWIvktAvjs0yi8Uqi8sticWUc1mTcVRpUkJkUUFardVTrdhPqNSvkG+yj3CtjGutiWenimuqh2qrhGSegWWcfWIyi8UxiL+Uc1m9poq9pIa1nYJgrdNirNBardVqqsezmn2wmX5aqtCVnZWtlXq0k3NapMxTps+sk3a0kW6yj3CvkG+zjmymkXZTositjGuljXNSncOtiWdQm7+nimuqh2qfinFNmcCrhGSchnOjhWtQlrx5jpGlhGSbhGuUhHWegWWmfmGcf2iMgniVgW2ifF2cfWKTfmtIjrVCjLSceluUe2ODfnhAiLeVeF2PemR6enqQd2I7h7qZdFlChayUc1mMdWE6hbZ0eXw6g6+TcVSMclqOb1M6gKaGcFpqdX2KblmMa1OEbVphc4GEa1JecX+EaE4yeaKDZk98aFSDZEwxdJ5RbYF5ZFJ7YkswcJZ1YU9DaoN5XklzYEwubJN0XEkpapM5ZYFzWUNsWkhrV0MzYX8tX35pUkJoUj5kUUEpXH1jTzxgTj9hTDpbSjpRQjZSQjNMPzNLPDFHOS1CODBENyxANCs9NC86MCo3LSgwKSktJycvJyUrJCR/7i4wAAABAHRSTlMAEREREREREREiIiIzMzMzM0REREREREREREREVVVVVVVVZmZmZmZmZnd3d3d3d3eIiIiIiIiImZmZmZmZqqqqqqqqqqqqu7u7u7u7u7u7u7u7u8zMzMzMzMzM3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d7u7u7u7u7u7u7u7u7u7u////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////WBVVlgAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAACAASURBVHic7Z0LYFtl2ce7DS8MxsdgE0VwoOxTUWFsMHCICKKuXJSbOoG0xSGKjG0OAbmo3NwYKDbYnKWkBjsGmtoOEyXIGNRUvrVOOktpCy2jI5hmTbuypDljY03p97z39z3nJM2lJIPmaZqce855f+f/XN5zkpSUHBB20OzZcxacsuCURaWlpYtgYPbsaYXepaKlsumfWHBO6Q9+5LKyH5R+fkah969oZptx0jnf/YUlMcl+fsHcQu9n0bhNnbOg9Ae14zEjtsFz57kfKPQOFw10tmB8mQmr9SC788wiuoLa1LnnZAANDGPzBNpfWHV4ofd98tqMLy7JCBrj9kI0FtP1gYWF3v9JaVPnlv48U2rUTwZjcV2P6/Ho8YU+iMlns865PXNqLpcbc9P1WDyO4A1/vNDHMcns89ZF2viGuLWD2PS9+/fpMdBcoY9kUtmcLFykAOcHXvrIWCIxsgcGvlbog5lEdkrW2LDgQroO3MbGRscSe8BZFvpoJo/NzZ4binB+SEv2AbWxxNjY28CwKLk82fTMqjbFUErZAwEOmCFLjAG43YU+oMlipdlzQ56yfliPv4X8JLb9QK6YWObFDsuBGwLXoseGEwkc4ZC7LPrKfNlXcuCGQtx2Pb4HgCVGsbsc3avrNxX6kCaH3ZEjuKGYvo85SnjZH48VS7l82Cdy4IZzk1h8+O3RUUINnOXIcFz/cKEPajLYolzAbYBiIK7H9icgn0wkcIwbgRq8mJ3kwc7PBRy6mhOP6YgbqQbAYvF4MTvJg2XbR8nAtUH5jZJKym5sbE8xrcyLZd9LScC1AzhwkaOjOMSNjo3u0eM/LfRBTQbLodsEg+vS43Ge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" />

        <img alt="Octobi Wan Catnobi's shadow" class="js-plaxify" data-xrange="10" data-yrange="10" height="49" id="parallax_octocatshadow" width="166"
        src="data:image/png;base64,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" />

        <img alt="land speeder's shadow" class="js-plaxify" data-xrange="10" data-yrange="10" height="75" id="parallax_speedershadow" width="430"
        src="data:image/png;base64,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" />

        <img alt="building" class="js-plaxify" data-invert="true" data-xrange="50" data-yrange="20" height="123" id="parallax_building_1" width="304"
        src="data:image/png;base64,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" />

        <img alt="building" class="js-plaxify" data-invert="true" data-xrange="75" data-yrange="30" height="50" id="parallax_building_2" width="116"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAAyCAMAAAC6RQ9kAAAAA3NCSVQICAjb4U/gAAABgFBMVEX////kyZm1pIDexpr73qqnmnallnGnmnn33aqjlXn12anszpi7p4PUvZPu1aXPuo6tm3zr0aLfxZbNt4xxbWOUim6yn3l7c2NsaF2+rIStm3yom4C2o3v22KSznW+rnIGejGuqlm3ZxJZxbWN0bFvUvZPv0JvnzZ2MfmPArYq7p4PXvo7Qu5LFsoq+rIRsaWDx057ErYKznXCsmnKFe2qom4CPgWSMhG3Qu5Kck3OllnGjlXl7c2NzcGeJf217c2OJf23FsoqUim6+rISck3PArYp/eWl/eGWfknrGsIzArYrGsIyck3PNt4zXvo67p4Pr0aLQu5K7p4Omk2zfxZbZxJbErYL12anu1aWwm2753KfmzaHny5aMg3N/eWmfknqajnmUiXSMhG2Mg3OrnIGjlXmUim6UiXSMhG2EeGN/eGW1pICajHOFe2rGsIy7p4OVhme+rIStm3ynmnmejGuUim6VhmfUvZPQu5LNt4zexprPuo7GsIy7p4Oyn3mmk2w+/MV0AAAAgHRSTlMA////////////////////RP///yJ3/yIR7v9E////RHe7/xEiu///RHfu/////xH/////IjNEVaqqzMwRESIzVXeIu8zdIiIzZmZ3d4iZqru7u7vM3d3u7u7///8RESIiIiIiMzMzMzMzM0RERFVVVWZmZmZmZnd3d4iIiIiIiOmar1cAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzQGstOgAAAFzUlEQVRYheWXh3saRxDFvSzHHQsczUEKCFVkiINKFEW25RZFcVwjJFvNTu+99+p/PfNmCwfcxYosf8n3ZcB3gjvv797sm9nl1KlHxNyjbngCMf7U/wU6929Al/5L6X3nq43f5ud/uf3ZpScARXp/GB/68q1fD4IHYXP5TC73em731psnDYXS9dMDX729nVZBmkIpVc4hXr188tCLA9CfAiIqftM/1WwTda90otC5IeilbahkoYAG9Ocyiz1J6JDSNw41Kg0wvRTOTVC3HgvzwcbG7ZJrfoNKLx8qTms6IBxT+cPyY1JvHqgmxrhlPpPSq54rm21WyFyXZDzGGVC/OSby8jYP1KRBdq9Y6Dnvgrn8cwACZRc+4rklU8FXIZv4xvGg20qLeEDUPS576kjnfAN9D5cUpxZYfeJsa6m7x2J+CSIkBCFV/ZaFWqVbSrtI6dwq7SjODc9q7liFc2Dmyzw6EtxP71IjDKkdNFUzRDT5tkDBUUobOLd3VND46urqjQZi6mYYlsvl18oIQbE3T1ERUkiEwEngjIOsdrvdgrQx+yzHt6c5xuil3wlbgBJGEGY0Gk84hP4k+idh+PxnPnWkGIuH2tG0AIvQWAsXRqFRiy+OxkyE2oGlyd+wPP1IfeE6wSeh9B/nmKB5sZjJZjNeDGuh6lPUk6BTFiVdIqWFWqR0avsZZ2g1m6FXDLRYoQuZzEQSVESsaU/mi7JyEepTwE0+VRBaaYFGzmYnYqCyhku11PUE9zrvGJ3WREKG6HFK2TVFVyadU1QrZwGVkENDx0AXAa0nKG1EjCP7J6GhKtrfbc8LSKnQ0BryW4+DVmm2s36yewct5GZXitB2HTR2dEDu8RGoWMTQMU4qigIm1fu7khGuTI179JGgQdgut8t4604VmPQyVEp2UiYOWskiUq8kuFdGKlVEfCpIaaAqvud7nufjQEdu9TCSTm8BRopxUlGIOl3K1BJLpl9+ItJ96HOZUlohlIei8/lsoNLMqcwgRieVoHlUUz1Jqe0xwprWaQ9p/maZCJUsNTBGkk9zekUd/vVjoLKKx/ET5nTAvJFlRDA0XdEwpBYH3hxFoIsYetRJRYnM05Vk90a7jssul0w6PWs1cnY9Lhq4l6GCe1J21EmktMKN49MEaH9FkW4N0U8CaMVmVx8HoHQXehLa3YhS1DDFF/Fz6tqsNGDhHMVQdq5v0F6gTMmY9FbYSSM9qYglAdAXE+bUrcvWSq4Xc3p1Xi03MEp5TnFXHe1hxL7kXrmAJLyUlN74zoD0kqxZrdTTZcolo1Jdo1Swk2JWNygt4HFeToQKl1jhVlL8UQ44vWwi0yK4H0bcK6qZOCeRUvQkkjr8M9Ok15VLZLXWSTbu1Rq1XOx3AzunuJF70oiTihisjiXoagK0vzFxD6C1a/faKuUU87LjoLg51kmYU3EWUmOdVLIrdv9g9i5Up0rXqe/Anu1ITinpyY42wiJG7QEa66TSYOeLFKwQ5XSkI+l5xZIe9N1Lt+f1GjYYVYxyHnMa66RGZF9m59WuqrTKaCMZmb5Lr1OKHouxR5XSZh3GjnXSFEtsi3a7uLCwsNi1WnkRV1hlTHK1YGxbVBTKq/WIk4qcrIvwWJyTplgdpqrKeYn2f1ZqSlRn1+efiYBeM0YSet835KQip60HaJyTuGQkVkkNjW7RsHOoGBsZrdit8Mbsmq5TGe+kIruil9STSvwf006pbUnOSEaibQ7YKFml2m55bB6GnFTkx95BocY5SdcpulvV2s71ClunFurbOe0KuW96r+mx2WEoHmcWNZOdmZ5e61xvRaFLq+/Sr8TzFH/82bt7t/cMx+87O/Qzcffw8HBPNyTdgP2+e/eNUikK3O5qE4iaifxziOrziJWVyZVJxPrMw+mvO5+0YjtjUlz56MOPX6B4//NSo/HdnTvf9zY3N3u9/fX19Xv37k9i6JXJ+zMcF6Y5fux01tY6a51WqzXWcrS/AGShj5noGrZMAAAAAElFTkSuQmCC" />
      </div>

    </div>

    <div class="container">
      <form accept-charset="UTF-8" id="search" action="/search" method="get">
        <label for="search">Find code, projects, and people on GitHub:</label>
        <input type="text" name="q">

        <input class="button" type="submit" value="Search">
      </form>

      <div id="suggestions">
        <a href="https://github.com/contact">Contact Support</a> &mdash;
        <a href="https://status.github.com">GitHub Status</a> &mdash;
        <a href="https://twitter.com/githubstatus">@githubstatus</a>
      </div>

      <div id="logo">
      <a href="/"><img width="100" height="44" title="" alt="" src="data:image/png;base64,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" /></a>
      </div>
    </div>

    <script type="text/javascript">
      /*! jQuery v1.8.3 jquery.com | jquery.org/license */
      (function(e,t){function _(e){var t=M[e]={};return v.each(e.split(y),function(e,n){t[n]=!0}),t}function H(e,n,r){if(r===t&&e.nodeType===1){var i="data-"+n.replace(P,"-$1").toLowerCase();r=e.getAttribute(i);if(typeof r=="string"){try{r=r==="true"?!0:r==="false"?!1:r==="null"?null:+r+""===r?+r:D.test(r)?v.parseJSON(r):r}catch(s){}v.data(e,n,r)}else r=t}return r}function B(e){var t;for(t in e){if(t==="data"&&v.isEmptyObject(e[t]))continue;if(t!=="toJSON")return!1}return!0}function et(){return!1}function tt(){return!0}function ut(e){return!e||!e.parentNode||e.parentNode.nodeType===11}function at(e,t){do e=e[t];while(e&&e.nodeType!==1);return e}function ft(e,t,n){t=t||0;if(v.isFunction(t))return v.grep(e,function(e,r){var i=!!t.call(e,r,e);return i===n});if(t.nodeType)return v.grep(e,function(e,r){return e===t===n});if(typeof t=="string"){var r=v.grep(e,function(e){return e.nodeType===1});if(it.test(t))return v.filter(t,r,!n);t=v.filter(t,r)}return v.grep(e,function(e,r){return v.inArray(e,t)>=0===n})}function lt(e){var t=ct.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}function Lt(e,t){return e.getElementsByTagName(t)[0]||e.appendChild(e.ownerDocument.createElement(t))}function At(e,t){if(t.nodeType!==1||!v.hasData(e))return;var n,r,i,s=v._data(e),o=v._data(t,s),u=s.events;if(u){delete o.handle,o.events={};for(n in u)for(r=0,i=u[n].length;r<i;r++)v.event.add(t,n,u[n][r])}o.data&&(o.data=v.extend({},o.data))}function Ot(e,t){var n;if(t.nodeType!==1)return;t.clearAttributes&&t.clearAttributes(),t.mergeAttributes&&t.mergeAttributes(e),n=t.nodeName.toLowerCase(),n==="object"?(t.parentNode&&(t.outerHTML=e.outerHTML),v.support.html5Clone&&e.innerHTML&&!v.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):n==="input"&&Et.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):n==="option"?t.selected=e.defaultSelected:n==="input"||n==="textarea"?t.defaultValue=e.defaultValue:n==="script"&&t.text!==e.text&&(t.text=e.text),t.removeAttribute(v.expando)}function Mt(e){return typeof e.getElementsByTagName!="undefined"?e.getElementsByTagName("*"):typeof e.querySelectorAll!="undefined"?e.querySelectorAll("*"):[]}function _t(e){Et.test(e.type)&&(e.defaultChecked=e.checked)}function Qt(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=Jt.length;while(i--){t=Jt[i]+n;if(t in e)return t}return r}function Gt(e,t){return e=t||e,v.css(e,"display")==="none"||!v.contains(e.ownerDocument,e)}function Yt(e,t){var n,r,i=[],s=0,o=e.length;for(;s<o;s++){n=e[s];if(!n.style)continue;i[s]=v._data(n,"olddisplay"),t?(!i[s]&&n.style.display==="none"&&(n.style.display=""),n.style.display===""&&Gt(n)&&(i[s]=v._data(n,"olddisplay",nn(n.nodeName)))):(r=Dt(n,"display"),!i[s]&&r!=="none"&&v._data(n,"olddisplay",r))}for(s=0;s<o;s++){n=e[s];if(!n.style)continue;if(!t||n.style.display==="none"||n.style.display==="")n.style.display=t?i[s]||"":"none"}return e}function Zt(e,t,n){var r=Rt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function en(e,t,n,r){var i=n===(r?"border":"content")?4:t==="width"?1:0,s=0;for(;i<4;i+=2)n==="margin"&&(s+=v.css(e,n+$t[i],!0)),r?(n==="content"&&(s-=parseFloat(Dt(e,"padding"+$t[i]))||0),n!=="margin"&&(s-=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0)):(s+=parseFloat(Dt(e,"padding"+$t[i]))||0,n!=="padding"&&(s+=parseFloat(Dt(e,"border"+$t[i]+"Width"))||0));return s}function tn(e,t,n){var r=t==="width"?e.offsetWidth:e.offsetHeight,i=!0,s=v.support.boxSizing&&v.css(e,"boxSizing")==="border-box";if(r<=0||r==null){r=Dt(e,t);if(r<0||r==null)r=e.style[t];if(Ut.test(r))return r;i=s&&(v.support.boxSizingReliable||r===e.style[t]),r=parseFloat(r)||0}return r+en(e,t,n||(s?"border":"content"),i)+"px"}function nn(e){if(Wt[e])return Wt[e];var t=v("<"+e+">").appendTo(i.body),n=t.css("display");t.remove();if(n==="none"||n===""){Pt=i.body.appendChild(Pt||v.extend(i.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!Ht||!Pt.createElement)Ht=(Pt.contentWindow||Pt.contentDocument).document,Ht.write("<!doctype html><html><body>"),Ht.close();t=Ht.body.appendChild(Ht.createElement(e)),n=Dt(t,"display"),i.body.removeChild(Pt)}return Wt[e]=n,n}function fn(e,t,n,r){var i;if(v.isArray(t))v.each(t,function(t,i){n||sn.test(e)?r(e,i):fn(e+"["+(typeof i=="object"?t:"")+"]",i,n,r)});else if(!n&&v.type(t)==="object")for(i in t)fn(e+"["+i+"]",t[i],n,r);else r(e,t)}function Cn(e){return function(t,n){typeof t!="string"&&(n=t,t="*");var r,i,s,o=t.toLowerCase().split(y),u=0,a=o.length;if(v.isFunction(n))for(;u<a;u++)r=o[u],s=/^\+/.test(r),s&&(r=r.substr(1)||"*"),i=e[r]=e[r]||[],i[s?"unshift":"push"](n)}}function kn(e,n,r,i,s,o){s=s||n.dataTypes[0],o=o||{},o[s]=!0;var u,a=e[s],f=0,l=a?a.length:0,c=e===Sn;for(;f<l&&(c||!u);f++)u=a[f](n,r,i),typeof u=="string"&&(!c||o[u]?u=t:(n.dataTypes.unshift(u),u=kn(e,n,r,i,u,o)));return(c||!u)&&!o["*"]&&(u=kn(e,n,r,i,"*",o)),u}function Ln(e,n){var r,i,s=v.ajaxSettings.flatOptions||{};for(r in n)n[r]!==t&&((s[r]?e:i||(i={}))[r]=n[r]);i&&v.extend(!0,e,i)}function An(e,n,r){var i,s,o,u,a=e.contents,f=e.dataTypes,l=e.responseFields;for(s in l)s in r&&(n[l[s]]=r[s]);while(f[0]==="*")f.shift(),i===t&&(i=e.mimeType||n.getResponseHeader("content-type"));if(i)for(s in a)if(a[s]&&a[s].test(i)){f.unshift(s);break}if(f[0]in r)o=f[0];else{for(s in r){if(!f[0]||e.converters[s+" "+f[0]]){o=s;break}u||(u=s)}o=o||u}if(o)return o!==f[0]&&f.unshift(o),r[o]}function On(e,t){var n,r,i,s,o=e.dataTypes.slice(),u=o[0],a={},f=0;e.dataFilter&&(t=e.dataFilter(t,e.dataType));if(o[1])for(n in e.converters)a[n.toLowerCase()]=e.converters[n];for(;i=o[++f];)if(i!=="*"){if(u!=="*"&&u!==i){n=a[u+" "+i]||a["* "+i];if(!n)for(r in a){s=r.split(" ");if(s[1]===i){n=a[u+" "+s[0]]||a["* "+s[0]];if(n){n===!0?n=a[r]:a[r]!==!0&&(i=s[0],o.splice(f--,0,i));break}}}if(n!==!0)if(n&&e["throws"])t=n(t);else try{t=n(t)}catch(l){return{state:"parsererror",error:n?l:"No conversion from "+u+" to "+i}}}u=i}return{state:"success",data:t}}function Fn(){try{return new e.XMLHttpRequest}catch(t){}}function In(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}function $n(){return setTimeout(function(){qn=t},0),qn=v.now()}function Jn(e,t){v.each(t,function(t,n){var r=(Vn[t]||[]).concat(Vn["*"]),i=0,s=r.length;for(;i<s;i++)if(r[i].call(e,t,n))return})}function Kn(e,t,n){var r,i=0,s=0,o=Xn.length,u=v.Deferred().always(function(){delete a.elem}),a=function(){var t=qn||$n(),n=Math.max(0,f.startTime+f.duration-t),r=n/f.duration||0,i=1-r,s=0,o=f.tweens.length;for(;s<o;s++)f.tweens[s].run(i);return u.notifyWith(e,[f,i,n]),i<1&&o?n:(u.resolveWith(e,[f]),!1)},f=u.promise({elem:e,props:v.extend({},t),opts:v.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:qn||$n(),duration:n.duration,tweens:[],createTween:function(t,n,r){var i=v.Tween(e,f.opts,t,n,f.opts.specialEasing[t]||f.opts.easing);return f.tweens.push(i),i},stop:function(t){var n=0,r=t?f.tweens.length:0;for(;n<r;n++)f.tweens[n].run(1);return t?u.resolveWith(e,[f,t]):u.rejectWith(e,[f,t]),this}}),l=f.props;Qn(l,f.opts.specialEasing);for(;i<o;i++){r=Xn[i].call(f,e,l,f.opts);if(r)return r}return Jn(f,l),v.isFunction(f.opts.start)&&f.opts.start.call(e,f),v.fx.timer(v.extend(a,{anim:f,queue:f.opts.queue,elem:e})),f.progress(f.opts.progress).done(f.opts.done,f.opts.complete).fail(f.opts.fail).always(f.opts.always)}function Qn(e,t){var n,r,i,s,o;for(n in e){r=v.camelCase(n),i=t[r],s=e[n],v.isArray(s)&&(i=s[1],s=e[n]=s[0]),n!==r&&(e[r]=s,delete e[n]),o=v.cssHooks[r];if(o&&"expand"in o){s=o.expand(s),delete e[r];for(n in s)n in e||(e[n]=s[n],t[n]=i)}else t[r]=i}}function Gn(e,t,n){var r,i,s,o,u,a,f,l,c,h=this,p=e.style,d={},m=[],g=e.nodeType&&Gt(e);n.queue||(l=v._queueHooks(e,"fx"),l.unqueued==null&&(l.unqueued=0,c=l.empty.fire,l.empty.fire=function(){l.unqueued||c()}),l.unqueued++,h.always(function(){h.always(function(){l.unqueued--,v.queue(e,"fx").length||l.empty.fire()})})),e.nodeType===1&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],v.css(e,"display")==="inline"&&v.css(e,"float")==="none"&&(!v.support.inlineBlockNeedsLayout||nn(e.nodeName)==="inline"?p.display="inline-block":p.zoom=1)),n.overflow&&(p.overflow="hidden",v.support.shrinkWrapBlocks||h.done(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t){s=t[r];if(Un.exec(s)){delete t[r],a=a||s==="toggle";if(s===(g?"hide":"show"))continue;m.push(r)}}o=m.length;if(o){u=v._data(e,"fxshow")||v._data(e,"fxshow",{}),"hidden"in u&&(g=u.hidden),a&&(u.hidden=!g),g?v(e).show():h.done(function(){v(e).hide()}),h.done(function(){var t;v.removeData(e,"fxshow",!0);for(t in d)v.style(e,t,d[t])});for(r=0;r<o;r++)i=m[r],f=h.createTween(i,g?u[i]:0),d[i]=u[i]||v.style(e,i),i in u||(u[i]=f.start,g&&(f.end=f.start,f.start=i==="width"||i==="height"?1:0))}}function Yn(e,t,n,r,i){return new Yn.prototype.init(e,t,n,r,i)}function Zn(e,t){var n,r={height:e},i=0;t=t?1:0;for(;i<4;i+=2-t)n=$t[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}function tr(e){return v.isWindow(e)?e:e.nodeType===9?e.defaultView||e.parentWindow:!1}var n,r,i=e.document,s=e.location,o=e.navigator,u=e.jQuery,a=e.$,f=Array.prototype.push,l=Array.prototype.slice,c=Array.prototype.indexOf,h=Object.prototype.toString,p=Object.prototype.hasOwnProperty,d=String.prototype.trim,v=function(e,t){return new v.fn.init(e,t,n)},m=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,g=/\S/,y=/\s+/,b=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,w=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,E=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,S=/^[\],:{}\s]*$/,x=/(?:^|:|,)(?:\s*\[)+/g,T=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,N=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,C=/^-ms-/,k=/-([\da-z])/gi,L=function(e,t){return(t+"").toUpperCase()},A=function(){i.addEventListener?(i.removeEventListener("DOMContentLoaded",A,!1),v.ready()):i.readyState==="complete"&&(i.detachEvent("onreadystatechange",A),v.ready())},O={};v.fn=v.prototype={constructor:v,init:function(e,n,r){var s,o,u,a;if(!e)return this;if(e.nodeType)return this.context=this[0]=e,this.length=1,this;if(typeof e=="string"){e.charAt(0)==="<"&&e.charAt(e.length-1)===">"&&e.length>=3?s=[null,e,null]:s=w.exec(e);if(s&&(s[1]||!n)){if(s[1])return n=n instanceof v?n[0]:n,a=n&&n.nodeType?n.ownerDocument||n:i,e=v.parseHTML(s[1],a,!0),E.test(s[1])&&v.isPlainObject(n)&&this.attr.call(e,n,!0),v.merge(this,e);o=i.getElementById(s[2]);if(o&&o.parentNode){if(o.id!==s[2])return r.find(e);this.length=1,this[0]=o}return this.context=i,this.selector=e,this}return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e)}return v.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),v.makeArray(e,this))},selector:"",jquery:"1.8.3",length:0,size:function(){return this.length},toArray:function(){return l.call(this)},get:function(e){return e==null?this.toArray():e<0?this[this.length+e]:this[e]},pushStack:function(e,t,n){var r=v.merge(this.constructor(),e);return r.prevObject=this,r.context=this.context,t==="find"?r.selector=this.selector+(this.selector?" ":"")+n:t&&(r.selector=this.selector+"."+t+"("+n+")"),r},each:function(e,t){return v.each(this,e,t)},ready:function(e){return v.ready.promise().done(e),this},eq:function(e){return e=+e,e===-1?this.slice(e):this.slice(e,e+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(l.apply(this,arguments),"slice",l.call(arguments).join(","))},map:function(e){return this.pushStack(v.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:[].sort,splice:[].splice},v.fn.init.prototype=v.fn,v.extend=v.fn.extend=function(){var e,n,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!v.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(n in e){r=u[n],i=e[n];if(u===i)continue;l&&i&&(v.isPlainObject(i)||(s=v.isArray(i)))?(s?(s=!1,o=r&&v.isArray(r)?r:[]):o=r&&v.isPlainObject(r)?r:{},u[n]=v.extend(l,o,i)):i!==t&&(u[n]=i)}return u},v.extend({noConflict:function(t){return e.$===v&&(e.$=a),t&&e.jQuery===v&&(e.jQuery=u),v},isReady:!1,readyWait:1,holdReady:function(e){e?v.readyWait++:v.ready(!0)},ready:function(e){if(e===!0?--v.readyWait:v.isReady)return;if(!i.body)return setTimeout(v.ready,1);v.isReady=!0;if(e!==!0&&--v.readyWait>0)return;r.resolveWith(i,[v]),v.fn.trigger&&v(i).trigger("ready").off("ready")},isFunction:function(e){return v.type(e)==="function"},isArray:Array.isArray||function(e){return v.type(e)==="array"},isWindow:function(e){return e!=null&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return e==null?String(e):O[h.call(e)]||"object"},isPlainObject:function(e){if(!e||v.type(e)!=="object"||e.nodeType||v.isWindow(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(n){return!1}var r;for(r in e);return r===t||p.call(e,r)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw new Error(e)},parseHTML:function(e,t,n){var r;return!e||typeof e!="string"?null:(typeof t=="boolean"&&(n=t,t=0),t=t||i,(r=E.exec(e))?[t.createElement(r[1])]:(r=v.buildFragment([e],t,n?null:[]),v.merge([],(r.cacheable?v.clone(r.fragment):r.fragment).childNodes)))},parseJSON:function(t){if(!t||typeof t!="string")return null;t=v.trim(t);if(e.JSON&&e.JSON.parse)return e.JSON.parse(t);if(S.test(t.replace(T,"@").replace(N,"]").replace(x,"")))return(new Function("return "+t))();v.error("Invalid JSON: "+t)},parseXML:function(n){var r,i;if(!n||typeof n!="string")return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(s){r=t}return(!r||!r.documentElement||r.getElementsByTagName("parsererror").length)&&v.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&g.test(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(C,"ms-").replace(k,L)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,n,r){var i,s=0,o=e.length,u=o===t||v.isFunction(e);if(r){if(u){for(i in e)if(n.apply(e[i],r)===!1)break}else for(;s<o;)if(n.apply(e[s++],r)===!1)break}else if(u){for(i in e)if(n.call(e[i],i,e[i])===!1)break}else for(;s<o;)if(n.call(e[s],s,e[s++])===!1)break;return e},trim:d&&!d.call("\ufeff\u00a0")?function(e){return e==null?"":d.call(e)}:function(e){return e==null?"":(e+"").replace(b,"")},makeArray:function(e,t){var n,r=t||[];return e!=null&&(n=v.type(e),e.length==null||n==="string"||n==="function"||n==="regexp"||v.isWindow(e)?f.call(r,e):v.merge(r,e)),r},inArray:function(e,t,n){var r;if(t){if(c)return c.call(t,e,n);r=t.length,n=n?n<0?Math.max(0,r+n):n:0;for(;n<r;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,s=0;if(typeof r=="number")for(;s<r;s++)e[i++]=n[s];else while(n[s]!==t)e[i++]=n[s++];return e.length=i,e},grep:function(e,t,n){var r,i=[],s=0,o=e.length;n=!!n;for(;s<o;s++)r=!!t(e[s],s),n!==r&&i.push(e[s]);return i},map:function(e,n,r){var i,s,o=[],u=0,a=e.length,f=e instanceof v||a!==t&&typeof a=="number"&&(a>0&&e[0]&&e[a-1]||a===0||v.isArray(e));if(f)for(;u<a;u++)i=n(e[u],u,r),i!=null&&(o[o.length]=i);else for(s in e)i=n(e[s],s,r),i!=null&&(o[o.length]=i);return o.concat.apply([],o)},guid:1,proxy:function(e,n){var r,i,s;return typeof n=="string"&&(r=e[n],n=e,e=r),v.isFunction(e)?(i=l.call(arguments,2),s=function(){return e.apply(n,i.concat(l.call(arguments)))},s.guid=e.guid=e.guid||v.guid++,s):t},access:function(e,n,r,i,s,o,u){var a,f=r==null,l=0,c=e.length;if(r&&typeof r=="object"){for(l in r)v.access(e,n,l,r[l],1,o,i);s=1}else if(i!==t){a=u===t&&v.isFunction(i),f&&(a?(a=n,n=function(e,t,n){return a.call(v(e),n)}):(n.call(e,i),n=null));if(n)for(;l<c;l++)n(e[l],r,a?i.call(e[l],l,n(e[l],r)):i,u);s=1}return s?e:f?n.call(e):c?n(e[0],r):o},now:function(){return(new Date).getTime()}}),v.ready.promise=function(t){if(!r){r=v.Deferred();if(i.readyState==="complete")setTimeout(v.ready,1);else if(i.addEventListener)i.addEventListener("DOMContentLoaded",A,!1),e.addEventListener("load",v.ready,!1);else{i.attachEvent("onreadystatechange",A),e.attachEvent("onload",v.ready);var n=!1;try{n=e.frameElement==null&&i.documentElement}catch(s){}n&&n.doScroll&&function o(){if(!v.isReady){try{n.doScroll("left")}catch(e){return setTimeout(o,50)}v.ready()}}()}}return r.promise(t)},v.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(e,t){O["[object "+t+"]"]=t.toLowerCase()}),n=v(i);var M={};v.Callbacks=function(e){e=typeof e=="string"?M[e]||_(e):v.extend({},e);var n,r,i,s,o,u,a=[],f=!e.once&&[],l=function(t){n=e.memory&&t,r=!0,u=s||0,s=0,o=a.length,i=!0;for(;a&&u<o;u++)if(a[u].apply(t[0],t[1])===!1&&e.stopOnFalse){n=!1;break}i=!1,a&&(f?f.length&&l(f.shift()):n?a=[]:c.disable())},c={add:function(){if(a){var t=a.length;(function r(t){v.each(t,function(t,n){var i=v.type(n);i==="function"?(!e.unique||!c.has(n))&&a.push(n):n&&n.length&&i!=="string"&&r(n)})})(arguments),i?o=a.length:n&&(s=t,l(n))}return this},remove:function(){return a&&v.each(arguments,function(e,t){var n;while((n=v.inArray(t,a,n))>-1)a.splice(n,1),i&&(n<=o&&o--,n<=u&&u--)}),this},has:function(e){return v.inArray(e,a)>-1},empty:function(){return a=[],this},disable:function(){return a=f=n=t,this},disabled:function(){return!a},lock:function(){return f=t,n||c.disable(),this},locked:function(){return!f},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],a&&(!r||f)&&(i?f.push(t):l(t)),this},fire:function(){return c.fireWith(this,arguments),this},fired:function(){return!!r}};return c},v.extend({Deferred:function(e){var t=[["resolve","done",v.Callbacks("once memory"),"resolved"],["reject","fail",v.Callbacks("once memory"),"rejected"],["notify","progress",v.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return v.Deferred(function(n){v.each(t,function(t,r){var s=r[0],o=e[t];i[r[1]](v.isFunction(o)?function(){var e=o.apply(this,arguments);e&&v.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===i?n:this,[e])}:n[s])}),e=null}).promise()},promise:function(e){return e!=null?v.extend(e,r):r}},i={};return r.pipe=r.then,v.each(t,function(e,s){var o=s[2],u=s[3];r[s[1]]=o.add,u&&o.add(function(){n=u},t[e^1][2].disable,t[2][2].lock),i[s[0]]=o.fire,i[s[0]+"With"]=o.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=l.call(arguments),r=n.length,i=r!==1||e&&v.isFunction(e.promise)?r:0,s=i===1?e:v.Deferred(),o=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?l.call(arguments):r,n===u?s.notifyWith(t,n):--i||s.resolveWith(t,n)}},u,a,f;if(r>1){u=new Array(r),a=new Array(r),f=new Array(r);for(;t<r;t++)n[t]&&v.isFunction(n[t].promise)?n[t].promise().done(o(t,f,n)).fail(s.reject).progress(o(t,a,u)):--i}return i||s.resolveWith(f,n),s.promise()}}),v.support=function(){var t,n,r,s,o,u,a,f,l,c,h,p=i.createElement("div");p.setAttribute("className","t"),p.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=p.getElementsByTagName("*"),r=p.getElementsByTagName("a")[0];if(!n||!r||!n.length)return{};s=i.createElement("select"),o=s.appendChild(i.createElement("option")),u=p.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(r.getAttribute("style")),hrefNormalized:r.getAttribute("href")==="/a",opacity:/^0.5/.test(r.style.opacity),cssFloat:!!r.style.cssFloat,checkOn:u.value==="on",optSelected:o.selected,getSetAttribute:p.className!=="t",enctype:!!i.createElement("form").enctype,html5Clone:i.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",boxModel:i.compatMode==="CSS1Compat",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,boxSizingReliable:!0,pixelPosition:!1},u.checked=!0,t.noCloneChecked=u.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!o.disabled;try{delete p.test}catch(d){t.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",h=function(){t.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick"),p.detachEvent("onclick",h)),u=i.createElement("input"),u.value="t",u.setAttribute("type","radio"),t.radioValue=u.value==="t",u.setAttribute("checked","checked"),u.setAttribute("name","t"),p.appendChild(u),a=i.createDocumentFragment(),a.appendChild(p.lastChild),t.checkClone=a.cloneNode(!0).cloneNode(!0).lastChild.checked,t.appendChecked=u.checked,a.removeChild(u),a.appendChild(p);if(p.attachEvent)for(l in{submit:!0,change:!0,focusin:!0})f="on"+l,c=f in p,c||(p.setAttribute(f,"return;"),c=typeof p[f]=="function"),t[l+"Bubbles"]=c;return v(function(){var n,r,s,o,u="padding:0;margin:0;border:0;display:block;overflow:hidden;",a=i.getElementsByTagName("body")[0];if(!a)return;n=i.createElement("div"),n.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px",a.insertBefore(n,a.firstChild),r=i.createElement("div"),n.appendChild(r),r.innerHTML="<table><tr><td></td><td>t</td></tr></table>",s=r.getElementsByTagName("td"),s[0].style.cssText="padding:0;margin:0;border:0;display:none",c=s[0].offsetHeight===0,s[0].style.display="",s[1].style.display="none",t.reliableHiddenOffsets=c&&s[0].offsetHeight===0,r.innerHTML="",r.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",t.boxSizing=r.offsetWidth===4,t.doesNotIncludeMarginInBodyOffset=a.offsetTop!==1,e.getComputedStyle&&(t.pixelPosition=(e.getComputedStyle(r,null)||{}).top!=="1%",t.boxSizingReliable=(e.getComputedStyle(r,null)||{width:"4px"}).width==="4px",o=i.createElement("div"),o.style.cssText=r.style.cssText=u,o.style.marginRight=o.style.width="0",r.style.width="1px",r.appendChild(o),t.reliableMarginRight=!parseFloat((e.getComputedStyle(o,null)||{}).marginRight)),typeof r.style.zoom!="undefined"&&(r.innerHTML="",r.style.cssText=u+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=r.offsetWidth===3,r.style.display="block",r.style.overflow="visible",r.innerHTML="<div></div>",r.firstChild.style.width="5px",t.shrinkWrapBlocks=r.offsetWidth!==3,n.style.zoom=1),a.removeChild(n),n=r=s=o=null}),a.removeChild(p),n=r=s=o=u=a=p=null,t}();var D=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;v.extend({cache:{},deletedIds:[],uuid:0,expando:"jQuery"+(v.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(e){return e=e.nodeType?v.cache[e[v.expando]]:e[v.expando],!!e&&!B(e)},data:function(e,n,r,i){if(!v.acceptData(e))return;var s,o,u=v.expando,a=typeof n=="string",f=e.nodeType,l=f?v.cache:e,c=f?e[u]:e[u]&&u;if((!c||!l[c]||!i&&!l[c].data)&&a&&r===t)return;c||(f?e[u]=c=v.deletedIds.pop()||v.guid++:c=u),l[c]||(l[c]={},f||(l[c].toJSON=v.noop));if(typeof n=="object"||typeof n=="function")i?l[c]=v.extend(l[c],n):l[c].data=v.extend(l[c].data,n);return s=l[c],i||(s.data||(s.data={}),s=s.data),r!==t&&(s[v.camelCase(n)]=r),a?(o=s[n],o==null&&(o=s[v.camelCase(n)])):o=s,o},removeData:function(e,t,n){if(!v.acceptData(e))return;var r,i,s,o=e.nodeType,u=o?v.cache:e,a=o?e[v.expando]:v.expando;if(!u[a])return;if(t){r=n?u[a]:u[a].data;if(r){v.isArray(t)||(t in r?t=[t]:(t=v.camelCase(t),t in r?t=[t]:t=t.split(" ")));for(i=0,s=t.length;i<s;i++)delete r[t[i]];if(!(n?B:v.isEmptyObject)(r))return}}if(!n){delete u[a].data;if(!B(u[a]))return}o?v.cleanData([e],!0):v.support.deleteExpando||u!=u.window?delete u[a]:u[a]=null},_data:function(e,t,n){return v.data(e,t,n,!0)},acceptData:function(e){var t=e.nodeName&&v.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),v.fn.extend({data:function(e,n){var r,i,s,o,u,a=this[0],f=0,l=null;if(e===t){if(this.length){l=v.data(a);if(a.nodeType===1&&!v._data(a,"parsedAttrs")){s=a.attributes;for(u=s.length;f<u;f++)o=s[f].name,o.indexOf("data-")||(o=v.camelCase(o.substring(5)),H(a,o,l[o]));v._data(a,"parsedAttrs",!0)}}return l}return typeof e=="object"?this.each(function(){v.data(this,e)}):(r=e.split(".",2),r[1]=r[1]?"."+r[1]:"",i=r[1]+"!",v.access(this,function(n){if(n===t)return l=this.triggerHandler("getData"+i,[r[0]]),l===t&&a&&(l=v.data(a,e),l=H(a,e,l)),l===t&&r[1]?this.data(r[0]):l;r[1]=n,this.each(function(){var t=v(this);t.triggerHandler("setData"+i,r),v.data(this,e,n),t.triggerHandler("changeData"+i,r)})},null,n,arguments.length>1,null,!1))},removeData:function(e){return this.each(function(){v.removeData(this,e)})}}),v.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=v._data(e,t),n&&(!r||v.isArray(n)?r=v._data(e,t,v.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=v.queue(e,t),r=n.length,i=n.shift(),s=v._queueHooks(e,t),o=function(){v.dequeue(e,t)};i==="inprogress"&&(i=n.shift(),r--),i&&(t==="fx"&&n.unshift("inprogress"),delete s.stop,i.call(e,o,s)),!r&&s&&s.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return v._data(e,n)||v._data(e,n,{empty:v.Callbacks("once memory").add(function(){v.removeData(e,t+"queue",!0),v.removeData(e,n,!0)})})}}),v.fn.extend({queue:function(e,n){var r=2;return typeof e!="string"&&(n=e,e="fx",r--),arguments.length<r?v.queue(this[0],e):n===t?this:this.each(function(){var t=v.queue(this,e,n);v._queueHooks(this,e),e==="fx"&&t[0]!=="inprogress"&&v.dequeue(this,e)})},dequeue:function(e){return this.each(function(){v.dequeue(this,e)})},delay:function(e,t){return e=v.fx?v.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,s=v.Deferred(),o=this,u=this.length,a=function(){--i||s.resolveWith(o,[o])};typeof e!="string"&&(n=e,e=t),e=e||"fx";while(u--)r=v._data(o[u],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(a));return a(),s.promise(n)}});var j,F,I,q=/[\t\r\n]/g,R=/\r/g,U=/^(?:button|input)$/i,z=/^(?:button|input|object|select|textarea)$/i,W=/^a(?:rea|)$/i,X=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,V=v.support.getSetAttribute;v.fn.extend({attr:function(e,t){return v.access(this,v.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){v.removeAttr(this,e)})},prop:function(e,t){return v.access(this,v.prop,e,t,arguments.length>1)},removeProp:function(e){return e=v.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,s,o,u;if(v.isFunction(e))return this.each(function(t){v(this).addClass(e.call(this,t,this.className))});if(e&&typeof e=="string"){t=e.split(y);for(n=0,r=this.length;n<r;n++){i=this[n];if(i.nodeType===1)if(!i.className&&t.length===1)i.className=e;else{s=" "+i.className+" ";for(o=0,u=t.length;o<u;o++)s.indexOf(" "+t[o]+" ")<0&&(s+=t[o]+" ");i.className=v.trim(s)}}}return this},removeClass:function(e){var n,r,i,s,o,u,a;if(v.isFunction(e))return this.each(function(t){v(this).removeClass(e.call(this,t,this.className))});if(e&&typeof e=="string"||e===t){n=(e||"").split(y);for(u=0,a=this.length;u<a;u++){i=this[u];if(i.nodeType===1&&i.className){r=(" "+i.className+" ").replace(q," ");for(s=0,o=n.length;s<o;s++)while(r.indexOf(" "+n[s]+" ")>=0)r=r.replace(" "+n[s]+" "," ");i.className=e?v.trim(r):""}}}return this},toggleClass:function(e,t){var n=typeof e,r=typeof t=="boolean";return v.isFunction(e)?this.each(function(n){v(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if(n==="string"){var i,s=0,o=v(this),u=t,a=e.split(y);while(i=a[s++])u=r?u:!o.hasClass(i),o[u?"addClass":"removeClass"](i)}else if(n==="undefined"||n==="boolean")this.className&&v._data(this,"__className__",this.className),this.className=this.className||e===!1?"":v._data(this,"__className__")||""})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;n<r;n++)if(this[n].nodeType===1&&(" "+this[n].className+" ").replace(q," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,s=this[0];if(!arguments.length){if(s)return n=v.valHooks[s.type]||v.valHooks[s.nodeName.toLowerCase()],n&&"get"in n&&(r=n.get(s,"value"))!==t?r:(r=s.value,typeof r=="string"?r.replace(R,""):r==null?"":r);return}return i=v.isFunction(e),this.each(function(r){var s,o=v(this);if(this.nodeType!==1)return;i?s=e.call(this,r,o.val()):s=e,s==null?s="":typeof s=="number"?s+="":v.isArray(s)&&(s=v.map(s,function(e){return e==null?"":e+""})),n=v.valHooks[this.type]||v.valHooks[this.nodeName.toLowerCase()];if(!n||!("set"in n)||n.set(this,s,"value")===t)this.value=s})}}),v.extend({valHooks:{option:{get:function(e){var t=e.attributes.value;return!t||t.specified?e.value:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,s=e.type==="select-one"||i<0,o=s?null:[],u=s?i+1:r.length,a=i<0?u:s?i:0;for(;a<u;a++){n=r[a];if((n.selected||a===i)&&(v.support.optDisabled?!n.disabled:n.getAttribute("disabled")===null)&&(!n.parentNode.disabled||!v.nodeName(n.parentNode,"optgroup"))){t=v(n).val();if(s)return t;o.push(t)}}return o},set:function(e,t){var n=v.makeArray(t);return v(e).find("option").each(function(){this.selected=v.inArray(v(this).val(),n)>=0}),n.length||(e.selectedIndex=-1),n}}},attrFn:{},attr:function(e,n,r,i){var s,o,u,a=e.nodeType;if(!e||a===3||a===8||a===2)return;if(i&&v.isFunction(v.fn[n]))return v(e)[n](r);if(typeof e.getAttribute=="undefined")return v.prop(e,n,r);u=a!==1||!v.isXMLDoc(e),u&&(n=n.toLowerCase(),o=v.attrHooks[n]||(X.test(n)?F:j));if(r!==t){if(r===null){v.removeAttr(e,n);return}return o&&"set"in o&&u&&(s=o.set(e,r,n))!==t?s:(e.setAttribute(n,r+""),r)}return o&&"get"in o&&u&&(s=o.get(e,n))!==null?s:(s=e.getAttribute(n),s===null?t:s)},removeAttr:function(e,t){var n,r,i,s,o=0;if(t&&e.nodeType===1){r=t.split(y);for(;o<r.length;o++)i=r[o],i&&(n=v.propFix[i]||i,s=X.test(i),s||v.attr(e,i,""),e.removeAttribute(V?i:n),s&&n in e&&(e[n]=!1))}},attrHooks:{type:{set:function(e,t){if(U.test(e.nodeName)&&e.parentNode)v.error("type property can't be changed");else if(!v.support.radioValue&&t==="radio"&&v.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}},value:{get:function(e,t){return j&&v.nodeName(e,"button")?j.get(e,t):t in e?e.value:null},set:function(e,t,n){if(j&&v.nodeName(e,"button"))return j.set(e,t,n);e.value=t}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(e,n,r){var i,s,o,u=e.nodeType;if(!e||u===3||u===8||u===2)return;return o=u!==1||!v.isXMLDoc(e),o&&(n=v.propFix[n]||n,s=v.propHooks[n]),r!==t?s&&"set"in s&&(i=s.set(e,r,n))!==t?i:e[n]=r:s&&"get"in s&&(i=s.get(e,n))!==null?i:e[n]},propHooks:{tabIndex:{get:function(e){var n=e.getAttributeNode("tabindex");return n&&n.specified?parseInt(n.value,10):z.test(e.nodeName)||W.test(e.nodeName)&&e.href?0:t}}}}),F={get:function(e,n){var r,i=v.prop(e,n);return i===!0||typeof i!="boolean"&&(r=e.getAttributeNode(n))&&r.nodeValue!==!1?n.toLowerCase():t},set:function(e,t,n){var r;return t===!1?v.removeAttr(e,n):(r=v.propFix[n]||n,r in e&&(e[r]=!0),e.setAttribute(n,n.toLowerCase())),n}},V||(I={name:!0,id:!0,coords:!0},j=v.valHooks.button={get:function(e,n){var r;return r=e.getAttributeNode(n),r&&(I[n]?r.value!=="":r.specified)?r.value:t},set:function(e,t,n){var r=e.getAttributeNode(n);return r||(r=i.createAttribute(n),e.setAttributeNode(r)),r.value=t+""}},v.each(["width","height"],function(e,t){v.attrHooks[t]=v.extend(v.attrHooks[t],{set:function(e,n){if(n==="")return e.setAttribute(t,"auto"),n}})}),v.attrHooks.contenteditable={get:j.get,set:function(e,t,n){t===""&&(t="false"),j.set(e,t,n)}}),v.support.hrefNormalized||v.each(["href","src","width","height"],function(e,n){v.attrHooks[n]=v.extend(v.attrHooks[n],{get:function(e){var r=e.getAttribute(n,2);return r===null?t:r}})}),v.support.style||(v.attrHooks.style={get:function(e){return e.style.cssText.toLowerCase()||t},set:function(e,t){return e.style.cssText=t+""}}),v.support.optSelected||(v.propHooks.selected=v.extend(v.propHooks.selected,{get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}})),v.support.enctype||(v.propFix.enctype="encoding"),v.support.checkOn||v.each(["radio","checkbox"],function(){v.valHooks[this]={get:function(e){return e.getAttribute("value")===null?"on":e.value}}}),v.each(["radio","checkbox"],function(){v.valHooks[this]=v.extend(v.valHooks[this],{set:function(e,t){if(v.isArray(t))return e.checked=v.inArray(v(e).val(),t)>=0}})});var $=/^(?:textarea|input|select)$/i,J=/^([^\.]*|)(?:\.(.+)|)$/,K=/(?:^|\s)hover(\.\S+|)\b/,Q=/^key/,G=/^(?:mouse|contextmenu)|click/,Y=/^(?:focusinfocus|focusoutblur)$/,Z=function(e){return v.event.special.hover?e:e.replace(K,"mouseenter$1 mouseleave$1")};v.event={add:function(e,n,r,i,s){var o,u,a,f,l,c,h,p,d,m,g;if(e.nodeType===3||e.nodeType===8||!n||!r||!(o=v._data(e)))return;r.handler&&(d=r,r=d.handler,s=d.selector),r.guid||(r.guid=v.guid++),a=o.events,a||(o.events=a={}),u=o.handle,u||(o.handle=u=function(e){return typeof v=="undefined"||!!e&&v.event.triggered===e.type?t:v.event.dispatch.apply(u.elem,arguments)},u.elem=e),n=v.trim(Z(n)).split(" ");for(f=0;f<n.length;f++){l=J.exec(n[f])||[],c=l[1],h=(l[2]||"").split(".").sort(),g=v.event.special[c]||{},c=(s?g.delegateType:g.bindType)||c,g=v.event.special[c]||{},p=v.extend({type:c,origType:l[1],data:i,handler:r,guid:r.guid,selector:s,needsContext:s&&v.expr.match.needsContext.test(s),namespace:h.join(".")},d),m=a[c];if(!m){m=a[c]=[],m.delegateCount=0;if(!g.setup||g.setup.call(e,i,h,u)===!1)e.addEventListener?e.addEventListener(c,u,!1):e.attachEvent&&e.attachEvent("on"+c,u)}g.add&&(g.add.call(e,p),p.handler.guid||(p.handler.guid=r.guid)),s?m.splice(m.delegateCount++,0,p):m.push(p),v.event.global[c]=!0}e=null},global:{},remove:function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d,m,g=v.hasData(e)&&v._data(e);if(!g||!(h=g.events))return;t=v.trim(Z(t||"")).split(" ");for(s=0;s<t.length;s++){o=J.exec(t[s])||[],u=a=o[1],f=o[2];if(!u){for(u in h)v.event.remove(e,u+t[s],n,r,!0);continue}p=v.event.special[u]||{},u=(r?p.delegateType:p.bindType)||u,d=h[u]||[],l=d.length,f=f?new RegExp("(^|\\.)"+f.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(c=0;c<d.length;c++)m=d[c],(i||a===m.origType)&&(!n||n.guid===m.guid)&&(!f||f.test(m.namespace))&&(!r||r===m.selector||r==="**"&&m.selector)&&(d.splice(c--,1),m.selector&&d.delegateCount--,p.remove&&p.remove.call(e,m));d.length===0&&l!==d.length&&((!p.teardown||p.teardown.call(e,f,g.handle)===!1)&&v.removeEvent(e,u,g.handle),delete h[u])}v.isEmptyObject(h)&&(delete g.handle,v.removeData(e,"events",!0))},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(n,r,s,o){if(!s||s.nodeType!==3&&s.nodeType!==8){var u,a,f,l,c,h,p,d,m,g,y=n.type||n,b=[];if(Y.test(y+v.event.triggered))return;y.indexOf("!")>=0&&(y=y.slice(0,-1),a=!0),y.indexOf(".")>=0&&(b=y.split("."),y=b.shift(),b.sort());if((!s||v.event.customEvent[y])&&!v.event.global[y])return;n=typeof n=="object"?n[v.expando]?n:new v.Event(y,n):new v.Event(y),n.type=y,n.isTrigger=!0,n.exclusive=a,n.namespace=b.join("."),n.namespace_re=n.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,h=y.indexOf(":")<0?"on"+y:"";if(!s){u=v.cache;for(f in u)u[f].events&&u[f].events[y]&&v.event.trigger(n,r,u[f].handle.elem,!0);return}n.result=t,n.target||(n.target=s),r=r!=null?v.makeArray(r):[],r.unshift(n),p=v.event.special[y]||{};if(p.trigger&&p.trigger.apply(s,r)===!1)return;m=[[s,p.bindType||y]];if(!o&&!p.noBubble&&!v.isWindow(s)){g=p.delegateType||y,l=Y.test(g+y)?s:s.parentNode;for(c=s;l;l=l.parentNode)m.push([l,g]),c=l;c===(s.ownerDocument||i)&&m.push([c.defaultView||c.parentWindow||e,g])}for(f=0;f<m.length&&!n.isPropagationStopped();f++)l=m[f][0],n.type=m[f][1],d=(v._data(l,"events")||{})[n.type]&&v._data(l,"handle"),d&&d.apply(l,r),d=h&&l[h],d&&v.acceptData(l)&&d.apply&&d.apply(l,r)===!1&&n.preventDefault();return n.type=y,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(s.ownerDocument,r)===!1)&&(y!=="click"||!v.nodeName(s,"a"))&&v.acceptData(s)&&h&&s[y]&&(y!=="focus"&&y!=="blur"||n.target.offsetWidth!==0)&&!v.isWindow(s)&&(c=s[h],c&&(s[h]=null),v.event.triggered=y,s[y](),v.event.triggered=t,c&&(s[h]=c)),n.result}return},dispatch:function(n){n=v.event.fix(n||e.event);var r,i,s,o,u,a,f,c,h,p,d=(v._data(this,"events")||{})[n.type]||[],m=d.delegateCount,g=l.call(arguments),y=!n.exclusive&&!n.namespace,b=v.event.special[n.type]||{},w=[];g[0]=n,n.delegateTarget=this;if(b.preDispatch&&b.preDispatch.call(this,n)===!1)return;if(m&&(!n.button||n.type!=="click"))for(s=n.target;s!=this;s=s.parentNode||this)if(s.disabled!==!0||n.type!=="click"){u={},f=[];for(r=0;r<m;r++)c=d[r],h=c.selector,u[h]===t&&(u[h]=c.needsContext?v(h,this).index(s)>=0:v.find(h,this,null,[s]).length),u[h]&&f.push(c);f.length&&w.push({elem:s,matches:f})}d.length>m&&w.push({elem:this,matches:d.slice(m)});for(r=0;r<w.length&&!n.isPropagationStopped();r++){a=w[r],n.currentTarget=a.elem;for(i=0;i<a.matches.length&&!n.isImmediatePropagationStopped();i++){c=a.matches[i];if(y||!n.namespace&&!c.namespace||n.namespace_re&&n.namespace_re.test(c.namespace))n.data=c.data,n.handleObj=c,o=((v.event.special[c.origType]||{}).handle||c.handler).apply(a.elem,g),o!==t&&(n.result=o,o===!1&&(n.preventDefault(),n.stopPropagation()))}}return b.postDispatch&&b.postDispatch.call(this,n),n.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return e.which==null&&(e.which=t.charCode!=null?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,s,o,u=n.button,a=n.fromElement;return e.pageX==null&&n.clientX!=null&&(r=e.target.ownerDocument||i,s=r.documentElement,o=r.body,e.pageX=n.clientX+(s&&s.scrollLeft||o&&o.scrollLeft||0)-(s&&s.clientLeft||o&&o.clientLeft||0),e.pageY=n.clientY+(s&&s.scrollTop||o&&o.scrollTop||0)-(s&&s.clientTop||o&&o.clientTop||0)),!e.relatedTarget&&a&&(e.relatedTarget=a===e.target?n.toElement:a),!e.which&&u!==t&&(e.which=u&1?1:u&2?3:u&4?2:0),e}},fix:function(e){if(e[v.expando])return e;var t,n,r=e,s=v.event.fixHooks[e.type]||{},o=s.props?this.props.concat(s.props):this.props;e=v.Event(r);for(t=o.length;t;)n=o[--t],e[n]=r[n];return e.target||(e.target=r.srcElement||i),e.target.nodeType===3&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,r):e},special:{load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(e,t,n){v.isWindow(this)&&(this.onbeforeunload=n)},teardown:function(e,t){this.onbeforeunload===t&&(this.onbeforeunload=null)}}},simulate:function(e,t,n,r){var i=v.extend(new v.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?v.event.trigger(i,null,t):v.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},v.event.handle=v.event.dispatch,v.removeEvent=i.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]=="undefined"&&(e[r]=null),e.detachEvent(r,n))},v.Event=function(e,t){if(!(this instanceof v.Event))return new v.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?tt:et):this.type=e,t&&v.extend(this,t),this.timeStamp=e&&e.timeStamp||v.now(),this[v.expando]=!0},v.Event.prototype={preventDefault:function(){this.isDefaultPrevented=tt;var e=this.originalEvent;if(!e)return;e.preventDefault?e.preventDefault():e.returnValue=!1},stopPropagation:function(){this.isPropagationStopped=tt;var e=this.originalEvent;if(!e)return;e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=tt,this.stopPropagation()},isDefaultPrevented:et,isPropagationStopped:et,isImmediatePropagationStopped:et},v.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){v.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,s=e.handleObj,o=s.selector;if(!i||i!==r&&!v.contains(r,i))e.type=s.origType,n=s.handler.apply(this,arguments),e.type=t;return n}}}),v.support.submitBubbles||(v.event.special.submit={setup:function(){if(v.nodeName(this,"form"))return!1;v.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=v.nodeName(n,"input")||v.nodeName(n,"button")?n.form:t;r&&!v._data(r,"_submit_attached")&&(v.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),v._data(r,"_submit_attached",!0))})},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&v.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){if(v.nodeName(this,"form"))return!1;v.event.remove(this,"._submit")}}),v.support.changeBubbles||(v.event.special.change={setup:function(){if($.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")v.event.add(this,"propertychange._change",function(e){e.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),v.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),v.event.simulate("change",this,e,!0)});return!1}v.event.add(this,"beforeactivate._change",function(e){var t=e.target;$.test(t.nodeName)&&!v._data(t,"_change_attached")&&(v.event.add(t,"change._change",function(e){this.parentNode&&!e.isSimulated&&!e.isTrigger&&v.event.simulate("change",this.parentNode,e,!0)}),v._data(t,"_change_attached",!0))})},handle:function(e){var t=e.target;if(this!==t||e.isSimulated||e.isTrigger||t.type!=="radio"&&t.type!=="checkbox")return e.handleObj.handler.apply(this,arguments)},teardown:function(){return v.event.remove(this,"._change"),!$.test(this.nodeName)}}),v.support.focusinBubbles||v.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){v.event.simulate(t,e.target,v.event.fix(e),!0)};v.event.special[t]={setup:function(){n++===0&&i.addEventListener(e,r,!0)},teardown:function(){--n===0&&i.removeEventListener(e,r,!0)}}}),v.fn.extend({on:function(e,n,r,i,s){var o,u;if(typeof e=="object"){typeof n!="string"&&(r=r||n,n=t);for(u in e)this.on(u,n,r,e[u],s);return this}r==null&&i==null?(i=n,r=n=t):i==null&&(typeof n=="string"?(i=r,r=t):(i=r,r=n,n=t));if(i===!1)i=et;else if(!i)return this;return s===1&&(o=i,i=function(e){return v().off(e),o.apply(this,arguments)},i.guid=o.guid||(o.guid=v.guid++)),this.each(function(){v.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,s;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,v(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if(typeof e=="object"){for(s in e)this.off(s,n,e[s]);return this}if(n===!1||typeof n=="function")r=n,n=t;return r===!1&&(r=et),this.each(function(){v.event.remove(this,e,r,n)})},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},live:function(e,t,n){return v(this.context).on(e,this.selector,t,n),this},die:function(e,t){return v(this.context).off(e,this.selector||"**",t),this},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return arguments.length===1?this.off(e,"**"):this.off(t,e||"**",n)},trigger:function(e,t){return this.each(function(){v.event.trigger(e,t,this)})},triggerHandler:function(e,t){if(this[0])return v.event.trigger(e,t,this[0],!0)},toggle:function(e){var t=arguments,n=e.guid||v.guid++,r=0,i=function(n){var i=(v._data(this,"lastToggle"+e.guid)||0)%r;return v._data(this,"lastToggle"+e.guid,i+1),n.preventDefault(),t[i].apply(this,arguments)||!1};i.guid=n;while(r<t.length)t[r++].guid=n;return this.click(i)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){v.fn[t]=function(e,n){return n==null&&(n=e,e=null),arguments.length>0?this.on(t,null,e,n):this.trigger(t)},Q.test(t)&&(v.event.fixHooks[t]=v.event.keyHooks),G.test(t)&&(v.event.fixHooks[t]=v.event.mouseHooks)}),function(e,t){function nt(e,t,n,r){n=n||[],t=t||g;var i,s,a,f,l=t.nodeType;if(!e||typeof e!="string")return n;if(l!==1&&l!==9)return[];a=o(t);if(!a&&!r)if(i=R.exec(e))if(f=i[1]){if(l===9){s=t.getElementById(f);if(!s||!s.parentNode)return n;if(s.id===f)return n.push(s),n}else if(t.ownerDocument&&(s=t.ownerDocument.getElementById(f))&&u(t,s)&&s.id===f)return n.push(s),n}else{if(i[2])return S.apply(n,x.call(t.getElementsByTagName(e),0)),n;if((f=i[3])&&Z&&t.getElementsByClassName)return S.apply(n,x.call(t.getElementsByClassName(f),0)),n}return vt(e.replace(j,"$1"),t,n,r,a)}function rt(e){return function(t){var n=t.nodeName.toLowerCase();return n==="input"&&t.type===e}}function it(e){return function(t){var n=t.nodeName.toLowerCase();return(n==="input"||n==="button")&&t.type===e}}function st(e){return N(function(t){return t=+t,N(function(n,r){var i,s=e([],n.length,t),o=s.length;while(o--)n[i=s[o]]&&(n[i]=!(r[i]=n[i]))})})}function ot(e,t,n){if(e===t)return n;var r=e.nextSibling;while(r){if(r===t)return-1;r=r.nextSibling}return 1}function ut(e,t){var n,r,s,o,u,a,f,l=L[d][e+" "];if(l)return t?0:l.slice(0);u=e,a=[],f=i.preFilter;while(u){if(!n||(r=F.exec(u)))r&&(u=u.slice(r[0].length)||u),a.push(s=[]);n=!1;if(r=I.exec(u))s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=r[0].replace(j," ");for(o in i.filter)(r=J[o].exec(u))&&(!f[o]||(r=f[o](r)))&&(s.push(n=new m(r.shift())),u=u.slice(n.length),n.type=o,n.matches=r);if(!n)break}return t?u.length:u?nt.error(e):L(e,a).slice(0)}function at(e,t,r){var i=t.dir,s=r&&t.dir==="parentNode",o=w++;return t.first?function(t,n,r){while(t=t[i])if(s||t.nodeType===1)return e(t,n,r)}:function(t,r,u){if(!u){var a,f=b+" "+o+" ",l=f+n;while(t=t[i])if(s||t.nodeType===1){if((a=t[d])===l)return t.sizset;if(typeof a=="string"&&a.indexOf(f)===0){if(t.sizset)return t}else{t[d]=l;if(e(t,r,u))return t.sizset=!0,t;t.sizset=!1}}}else while(t=t[i])if(s||t.nodeType===1)if(e(t,r,u))return t}}function ft(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function lt(e,t,n,r,i){var s,o=[],u=0,a=e.length,f=t!=null;for(;u<a;u++)if(s=e[u])if(!n||n(s,r,i))o.push(s),f&&t.push(u);return o}function ct(e,t,n,r,i,s){return r&&!r[d]&&(r=ct(r)),i&&!i[d]&&(i=ct(i,s)),N(function(s,o,u,a){var f,l,c,h=[],p=[],d=o.length,v=s||dt(t||"*",u.nodeType?[u]:u,[]),m=e&&(s||!t)?lt(v,h,e,u,a):v,g=n?i||(s?e:d||r)?[]:o:m;n&&n(m,g,u,a);if(r){f=lt(g,p),r(f,[],u,a),l=f.length;while(l--)if(c=f[l])g[p[l]]=!(m[p[l]]=c)}if(s){if(i||e){if(i){f=[],l=g.length;while(l--)(c=g[l])&&f.push(m[l]=c);i(null,g=[],f,a)}l=g.length;while(l--)(c=g[l])&&(f=i?T.call(s,c):h[l])>-1&&(s[f]=!(o[f]=c))}}else g=lt(g===o?g.splice(d,g.length):g),i?i(null,o,g,a):S.apply(o,g)})}function ht(e){var t,n,r,s=e.length,o=i.relative[e[0].type],u=o||i.relative[" "],a=o?1:0,f=at(function(e){return e===t},u,!0),l=at(function(e){return T.call(t,e)>-1},u,!0),h=[function(e,n,r){return!o&&(r||n!==c)||((t=n).nodeType?f(e,n,r):l(e,n,r))}];for(;a<s;a++)if(n=i.relative[e[a].type])h=[at(ft(h),n)];else{n=i.filter[e[a].type].apply(null,e[a].matches);if(n[d]){r=++a;for(;r<s;r++)if(i.relative[e[r].type])break;return ct(a>1&&ft(h),a>1&&e.slice(0,a-1).join("").replace(j,"$1"),n,a<r&&ht(e.slice(a,r)),r<s&&ht(e=e.slice(r)),r<s&&e.join(""))}h.push(n)}return ft(h)}function pt(e,t){var r=t.length>0,s=e.length>0,o=function(u,a,f,l,h){var p,d,v,m=[],y=0,w="0",x=u&&[],T=h!=null,N=c,C=u||s&&i.find.TAG("*",h&&a.parentNode||a),k=b+=N==null?1:Math.E;T&&(c=a!==g&&a,n=o.el);for(;(p=C[w])!=null;w++){if(s&&p){for(d=0;v=e[d];d++)if(v(p,a,f)){l.push(p);break}T&&(b=k,n=++o.el)}r&&((p=!v&&p)&&y--,u&&x.push(p))}y+=w;if(r&&w!==y){for(d=0;v=t[d];d++)v(x,m,a,f);if(u){if(y>0)while(w--)!x[w]&&!m[w]&&(m[w]=E.call(l));m=lt(m)}S.apply(l,m),T&&!u&&m.length>0&&y+t.length>1&&nt.uniqueSort(l)}return T&&(b=k,c=N),x};return o.el=0,r?N(o):o}function dt(e,t,n){var r=0,i=t.length;for(;r<i;r++)nt(e,t[r],n);return n}function vt(e,t,n,r,s){var o,u,f,l,c,h=ut(e),p=h.length;if(!r&&h.length===1){u=h[0]=h[0].slice(0);if(u.length>2&&(f=u[0]).type==="ID"&&t.nodeType===9&&!s&&i.relative[u[1].type]){t=i.find.ID(f.matches[0].replace($,""),t,s)[0];if(!t)return n;e=e.slice(u.shift().length)}for(o=J.POS.test(e)?-1:u.length-1;o>=0;o--){f=u[o];if(i.relative[l=f.type])break;if(c=i.find[l])if(r=c(f.matches[0].replace($,""),z.test(u[0].type)&&t.parentNode||t,s)){u.splice(o,1),e=r.length&&u.join("");if(!e)return S.apply(n,x.call(r,0)),n;break}}}return a(e,h)(r,t,s,n,z.test(e)),n}function mt(){}var n,r,i,s,o,u,a,f,l,c,h=!0,p="undefined",d=("sizcache"+Math.random()).replace(".",""),m=String,g=e.document,y=g.documentElement,b=0,w=0,E=[].pop,S=[].push,x=[].slice,T=[].indexOf||function(e){var t=0,n=this.length;for(;t<n;t++)if(this[t]===e)return t;return-1},N=function(e,t){return e[d]=t==null||t,e},C=function(){var e={},t=[];return N(function(n,r){return t.push(n)>i.cacheLength&&delete e[t.shift()],e[n+" "]=r},e)},k=C(),L=C(),A=C(),O="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",_=M.replace("w","w#"),D="([*^$|!~]?=)",P="\\["+O+"*("+M+")"+O+"*(?:"+D+O+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+_+")|)|)"+O+"*\\]",H=":("+M+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+P+")|[^:]|\\\\.)*|.*))\\)|)",B=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+O+"*((?:-\\d)?\\d*)"+O+"*\\)|)(?=[^-]|$)",j=new RegExp("^"+O+"+|((?:^|[^\\\\])(?:\\\\.)*)"+O+"+$","g"),F=new RegExp("^"+O+"*,"+O+"*"),I=new RegExp("^"+O+"*([\\x20\\t\\r\\n\\f>+~])"+O+"*"),q=new RegExp(H),R=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,U=/^:not/,z=/[\x20\t\r\n\f]*[+~]/,W=/:not\($/,X=/h\d/i,V=/input|select|textarea|button/i,$=/\\(?!\\)/g,J={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),NAME:new RegExp("^\\[name=['\"]?("+M+")['\"]?\\]"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+H),POS:new RegExp(B,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+O+"*(even|odd|(([+-]|)(\\d*)n|)"+O+"*(?:([+-]|)"+O+"*(\\d+)|))"+O+"*\\)|)","i"),needsContext:new RegExp("^"+O+"*[>+~]|"+B,"i")},K=function(e){var t=g.createElement("div");try{return e(t)}catch(n){return!1}finally{t=null}},Q=K(function(e){return e.appendChild(g.createComment("")),!e.getElementsByTagName("*").length}),G=K(function(e){return e.innerHTML="<a href='#'></a>",e.firstChild&&typeof e.firstChild.getAttribute!==p&&e.firstChild.getAttribute("href")==="#"}),Y=K(function(e){e.innerHTML="<select></select>";var t=typeof e.lastChild.getAttribute("multiple");return t!=="boolean"&&t!=="string"}),Z=K(function(e){return e.innerHTML="<div class='hidden e'></div><div class='hidden'></div>",!e.getElementsByClassName||!e.getElementsByClassName("e").length?!1:(e.lastChild.className="e",e.getElementsByClassName("e").length===2)}),et=K(function(e){e.id=d+0,e.innerHTML="<a name='"+d+"'></a><div name='"+d+"'></div>",y.insertBefore(e,y.firstChild);var t=g.getElementsByName&&g.getElementsByName(d).length===2+g.getElementsByName(d+0).length;return r=!g.getElementById(d),y.removeChild(e),t});try{x.call(y.childNodes,0)[0].nodeType}catch(tt){x=function(e){var t,n=[];for(;t=this[e];e++)n.push(t);return n}}nt.matches=function(e,t){return nt(e,null,null,t)},nt.matchesSelector=function(e,t){return nt(t,null,null,[e]).length>0},s=nt.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(i===1||i===9||i===11){if(typeof e.textContent=="string")return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=s(e)}else if(i===3||i===4)return e.nodeValue}else for(;t=e[r];r++)n+=s(t);return n},o=nt.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?t.nodeName!=="HTML":!1},u=nt.contains=y.contains?function(e,t){var n=e.nodeType===9?e.documentElement:e,r=t&&t.parentNode;return e===r||!!(r&&r.nodeType===1&&n.contains&&n.contains(r))}:y.compareDocumentPosition?function(e,t){return t&&!!(e.compareDocumentPosition(t)&16)}:function(e,t){while(t=t.parentNode)if(t===e)return!0;return!1},nt.attr=function(e,t){var n,r=o(e);return r||(t=t.toLowerCase()),(n=i.attrHandle[t])?n(e):r||Y?e.getAttribute(t):(n=e.getAttributeNode(t),n?typeof e[t]=="boolean"?e[t]?t:null:n.specified?n.value:null:null)},i=nt.selectors={cacheLength:50,createPseudo:N,match:J,attrHandle:G?{}:{href:function(e){return e.getAttribute("href",2)},type:function(e){return e.getAttribute("type")}},find:{ID:r?function(e,t,n){if(typeof t.getElementById!==p&&!n){var r=t.getElementById(e);return r&&r.parentNode?[r]:[]}}:function(e,n,r){if(typeof n.getElementById!==p&&!r){var i=n.getElementById(e);return i?i.id===e||typeof i.getAttributeNode!==p&&i.getAttributeNode("id").value===e?[i]:t:[]}},TAG:Q?function(e,t){if(typeof t.getElementsByTagName!==p)return t.getElementsByTagName(e)}:function(e,t){var n=t.getElementsByTagName(e);if(e==="*"){var r,i=[],s=0;for(;r=n[s];s++)r.nodeType===1&&i.push(r);return i}return n},NAME:et&&function(e,t){if(typeof t.getElementsByName!==p)return t.getElementsByName(name)},CLASS:Z&&function(e,t,n){if(typeof t.getElementsByClassName!==p&&!n)return t.getElementsByClassName(e)}},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace($,""),e[3]=(e[4]||e[5]||"").replace($,""),e[2]==="~="&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),e[1]==="nth"?(e[2]||nt.error(e[0]),e[3]=+(e[3]?e[4]+(e[5]||1):2*(e[2]==="even"||e[2]==="odd")),e[4]=+(e[6]+e[7]||e[2]==="odd")):e[2]&&nt.error(e[0]),e},PSEUDO:function(e){var t,n;if(J.CHILD.test(e[0]))return null;if(e[3])e[2]=e[3];else if(t=e[4])q.test(t)&&(n=ut(t,!0))&&(n=t.indexOf(")",t.length-n)-t.length)&&(t=t.slice(0,n),e[0]=e[0].slice(0,n)),e[2]=t;return e.slice(0,3)}},filter:{ID:r?function(e){return e=e.replace($,""),function(t){return t.getAttribute("id")===e}}:function(e){return e=e.replace($,""),function(t){var n=typeof t.getAttributeNode!==p&&t.getAttributeNode("id");return n&&n.value===e}},TAG:function(e){return e==="*"?function(){return!0}:(e=e.replace($,"").toLowerCase(),function(t){return t.nodeName&&t.nodeName.toLowerCase()===e})},CLASS:function(e){var t=k[d][e+" "];return t||(t=new RegExp("(^|"+O+")"+e+"("+O+"|$)"))&&k(e,function(e){return t.test(e.className||typeof e.getAttribute!==p&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r,i){var s=nt.attr(r,e);return s==null?t==="!=":t?(s+="",t==="="?s===n:t==="!="?s!==n:t==="^="?n&&s.indexOf(n)===0:t==="*="?n&&s.indexOf(n)>-1:t==="$="?n&&s.substr(s.length-n.length)===n:t==="~="?(" "+s+" ").indexOf(n)>-1:t==="|="?s===n||s.substr(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r){return e==="nth"?function(e){var t,i,s=e.parentNode;if(n===1&&r===0)return!0;if(s){i=0;for(t=s.firstChild;t;t=t.nextSibling)if(t.nodeType===1){i++;if(e===t)break}}return i-=r,i===n||i%n===0&&i/n>=0}:function(t){var n=t;switch(e){case"only":case"first":while(n=n.previousSibling)if(n.nodeType===1)return!1;if(e==="first")return!0;n=t;case"last":while(n=n.nextSibling)if(n.nodeType===1)return!1;return!0}}},PSEUDO:function(e,t){var n,r=i.pseudos[e]||i.setFilters[e.toLowerCase()]||nt.error("unsupported pseudo: "+e);return r[d]?r(t):r.length>1?(n=[e,e,"",t],i.setFilters.hasOwnProperty(e.toLowerCase())?N(function(e,n){var i,s=r(e,t),o=s.length;while(o--)i=T.call(e,s[o]),e[i]=!(n[i]=s[o])}):function(e){return r(e,0,n)}):r}},pseudos:{not:N(function(e){var t=[],n=[],r=a(e.replace(j,"$1"));return r[d]?N(function(e,t,n,i){var s,o=r(e,null,i,[]),u=e.length;while(u--)if(s=o[u])e[u]=!(t[u]=s)}):function(e,i,s){return t[0]=e,r(t,null,s,n),!n.pop()}}),has:N(function(e){return function(t){return nt(e,t).length>0}}),contains:N(function(e){return function(t){return(t.textContent||t.innerText||s(t)).indexOf(e)>-1}}),enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&!!e.checked||t==="option"&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},parent:function(e){return!i.pseudos.empty(e)},empty:function(e){var t;e=e.firstChild;while(e){if(e.nodeName>"@"||(t=e.nodeType)===3||t===4)return!1;e=e.nextSibling}return!0},header:function(e){return X.test(e.nodeName)},text:function(e){var t,n;return e.nodeName.toLowerCase()==="input"&&(t=e.type)==="text"&&((n=e.getAttribute("type"))==null||n.toLowerCase()===t)},radio:rt("radio"),checkbox:rt("checkbox"),file:rt("file"),password:rt("password"),image:rt("image"),submit:it("submit"),reset:it("reset"),button:function(e){var t=e.nodeName.toLowerCase();return t==="input"&&e.type==="button"||t==="button"},input:function(e){return V.test(e.nodeName)},focus:function(e){var t=e.ownerDocument;return e===t.activeElement&&(!t.hasFocus||t.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},active:function(e){return e===e.ownerDocument.activeElement},first:st(function(){return[0]}),last:st(function(e,t){return[t-1]}),eq:st(function(e,t,n){return[n<0?n+t:n]}),even:st(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:st(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:st(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:st(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}},f=y.compareDocumentPosition?function(e,t){return e===t?(l=!0,0):(!e.compareDocumentPosition||!t.compareDocumentPosition?e.compareDocumentPosition:e.compareDocumentPosition(t)&4)?-1:1}:function(e,t){if(e===t)return l=!0,0;if(e.sourceIndex&&t.sourceIndex)return e.sourceIndex-t.sourceIndex;var n,r,i=[],s=[],o=e.parentNode,u=t.parentNode,a=o;if(o===u)return ot(e,t);if(!o)return-1;if(!u)return 1;while(a)i.unshift(a),a=a.parentNode;a=u;while(a)s.unshift(a),a=a.parentNode;n=i.length,r=s.length;for(var f=0;f<n&&f<r;f++)if(i[f]!==s[f])return ot(i[f],s[f]);return f===n?ot(e,s[f],-1):ot(i[f],t,1)},[0,0].sort(f),h=!l,nt.uniqueSort=function(e){var t,n=[],r=1,i=0;l=h,e.sort(f);if(l){for(;t=e[r];r++)t===e[r-1]&&(i=n.push(r));while(i--)e.splice(n[i],1)}return e},nt.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},a=nt.compile=function(e,t){var n,r=[],i=[],s=A[d][e+" "];if(!s){t||(t=ut(e)),n=t.length;while(n--)s=ht(t[n]),s[d]?r.push(s):i.push(s);s=A(e,pt(i,r))}return s},g.querySelectorAll&&function(){var e,t=vt,n=/'|\\/g,r=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,i=[":focus"],s=[":active"],u=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector||y.oMatchesSelector||y.msMatchesSelector;K(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||i.push("\\["+O+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)"),e.querySelectorAll(":checked").length||i.push(":checked")}),K(function(e){e.innerHTML="<p test=''></p>",e.querySelectorAll("[test^='']").length&&i.push("[*^$]="+O+"*(?:\"\"|'')"),e.innerHTML="<input type='hidden'/>",e.querySelectorAll(":enabled").length||i.push(":enabled",":disabled")}),i=new RegExp(i.join("|")),vt=function(e,r,s,o,u){if(!o&&!u&&!i.test(e)){var a,f,l=!0,c=d,h=r,p=r.nodeType===9&&e;if(r.nodeType===1&&r.nodeName.toLowerCase()!=="object"){a=ut(e),(l=r.getAttribute("id"))?c=l.replace(n,"\\$&"):r.setAttribute("id",c),c="[id='"+c+"'] ",f=a.length;while(f--)a[f]=c+a[f].join("");h=z.test(e)&&r.parentNode||r,p=a.join(",")}if(p)try{return S.apply(s,x.call(h.querySelectorAll(p),0)),s}catch(v){}finally{l||r.removeAttribute("id")}}return t(e,r,s,o,u)},u&&(K(function(t){e=u.call(t,"div");try{u.call(t,"[test!='']:sizzle"),s.push("!=",H)}catch(n){}}),s=new RegExp(s.join("|")),nt.matchesSelector=function(t,n){n=n.replace(r,"='$1']");if(!o(t)&&!s.test(n)&&!i.test(n))try{var a=u.call(t,n);if(a||e||t.document&&t.document.nodeType!==11)return a}catch(f){}return nt(n,null,null,[t]).length>0})}(),i.pseudos.nth=i.pseudos.eq,i.filters=mt.prototype=i.pseudos,i.setFilters=new mt,nt.attr=v.attr,v.find=nt,v.expr=nt.selectors,v.expr[":"]=v.expr.pseudos,v.unique=nt.uniqueSort,v.text=nt.getText,v.isXMLDoc=nt.isXML,v.contains=nt.contains}(e);var nt=/Until$/,rt=/^(?:parents|prev(?:Until|All))/,it=/^.[^:#\[\.,]*$/,st=v.expr.match.needsContext,ot={children:!0,contents:!0,next:!0,prev:!0};v.fn.extend({find:function(e){var t,n,r,i,s,o,u=this;if(typeof e!="string")return v(e).filter(function(){for(t=0,n=u.length;t<n;t++)if(v.contains(u[t],this))return!0});o=this.pushStack("","find",e);for(t=0,n=this.length;t<n;t++){r=o.length,v.find(e,this[t],o);if(t>0)for(i=r;i<o.length;i++)for(s=0;s<r;s++)if(o[s]===o[i]){o.splice(i--,1);break}}return o},has:function(e){var t,n=v(e,this),r=n.length;return this.filter(function(){for(t=0;t<r;t++)if(v.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e,!1),"not",e)},filter:function(e){return this.pushStack(ft(this,e,!0),"filter",e)},is:function(e){return!!e&&(typeof e=="string"?st.test(e)?v(e,this.context).index(this[0])>=0:v.filter(e,this).length>0:this.filter(e).length>0)},closest:function(e,t){var n,r=0,i=this.length,s=[],o=st.test(e)||typeof e!="string"?v(e,t||this.context):0;for(;r<i;r++){n=this[r];while(n&&n.ownerDocument&&n!==t&&n.nodeType!==11){if(o?o.index(n)>-1:v.find.matchesSelector(n,e)){s.push(n);break}n=n.parentNode}}return s=s.length>1?v.unique(s):s,this.pushStack(s,"closest",e)},index:function(e){return e?typeof e=="string"?v.inArray(this[0],v(e)):v.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.prevAll().length:-1},add:function(e,t){var n=typeof e=="string"?v(e,t):v.makeArray(e&&e.nodeType?[e]:e),r=v.merge(this.get(),n);return this.pushStack(ut(n[0])||ut(r[0])?r:v.unique(r))},addBack:function(e){return this.add(e==null?this.prevObject:this.prevObject.filter(e))}}),v.fn.andSelf=v.fn.addBack,v.each({parent:function(e){var t=e.parentNode;return t&&t.nodeType!==11?t:null},parents:function(e){return v.dir(e,"parentNode")},parentsUntil:function(e,t,n){return v.dir(e,"parentNode",n)},next:function(e){return at(e,"nextSibling")},prev:function(e){return at(e,"previousSibling")},nextAll:function(e){return v.dir(e,"nextSibling")},prevAll:function(e){return v.dir(e,"previousSibling")},nextUntil:function(e,t,n){return v.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return v.dir(e,"previousSibling",n)},siblings:function(e){return v.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return v.sibling(e.firstChild)},contents:function(e){return v.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:v.merge([],e.childNodes)}},function(e,t){v.fn[e]=function(n,r){var i=v.map(this,t,n);return nt.test(e)||(r=n),r&&typeof r=="string"&&(i=v.filter(r,i)),i=this.length>1&&!ot[e]?v.unique(i):i,this.length>1&&rt.test(e)&&(i=i.reverse()),this.pushStack(i,e,l.call(arguments).join(","))}}),v.extend({filter:function(e,t,n){return n&&(e=":not("+e+")"),t.length===1?v.find.matchesSelector(t[0],e)?[t[0]]:[]:v.find.matches(e,t)},dir:function(e,n,r){var i=[],s=e[n];while(s&&s.nodeType!==9&&(r===t||s.nodeType!==1||!v(s).is(r)))s.nodeType===1&&i.push(s),s=s[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)e.nodeType===1&&e!==t&&n.push(e);return n}});var ct="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ht=/ jQuery\d+="(?:null|\d+)"/g,pt=/^\s+/,dt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,vt=/<([\w:]+)/,mt=/<tbody/i,gt=/<|&#?\w+;/,yt=/<(?:script|style|link)/i,bt=/<(?:script|object|embed|option|style)/i,wt=new RegExp("<(?:"+ct+")[\\s/>]","i"),Et=/^(?:checkbox|radio)$/,St=/checked\s*(?:[^=]|=\s*.checked.)/i,xt=/\/(java|ecma)script/i,Tt=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,Nt={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},Ct=lt(i),kt=Ct.appendChild(i.createElement("div"));Nt.optgroup=Nt.option,Nt.tbody=Nt.tfoot=Nt.colgroup=Nt.caption=Nt.thead,Nt.th=Nt.td,v.support.htmlSerialize||(Nt._default=[1,"X<div>","</div>"]),v.fn.extend({text:function(e){return v.access(this,function(e){return e===t?v.text(this):this.empty().append((this[0]&&this[0].ownerDocument||i).createTextNode(e))},null,e,arguments.length)},wrapAll:function(e){if(v.isFunction(e))return this.each(function(t){v(this).wrapAll(e.call(this,t))});if(this[0]){var t=v(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&e.firstChild.nodeType===1)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return v.isFunction(e)?this.each(function(t){v(this).wrapInner(e.call(this,t))}):this.each(function(){var t=v(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=v.isFunction(e);return this.each(function(n){v(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){v.nodeName(this,"body")||v(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.appendChild(e)})},prepend:function(){return this.domManip(arguments,!0,function(e){(this.nodeType===1||this.nodeType===11)&&this.insertBefore(e,this.firstChild)})},before:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(e,this),"before",this.selector)}},after:function(){if(!ut(this[0]))return this.domManip(arguments,!1,function(e){this.parentNode.insertBefore(e,this.nextSibling)});if(arguments.length){var e=v.clean(arguments);return this.pushStack(v.merge(this,e),"after",this.selector)}},remove:function(e,t){var n,r=0;for(;(n=this[r])!=null;r++)if(!e||v.filter(e,[n]).length)!t&&n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),v.cleanData([n])),n.parentNode&&n.parentNode.removeChild(n);return this},empty:function(){var e,t=0;for(;(e=this[t])!=null;t++){e.nodeType===1&&v.cleanData(e.getElementsByTagName("*"));while(e.firstChild)e.removeChild(e.firstChild)}return this},clone:function(e,t){return e=e==null?!1:e,t=t==null?e:t,this.map(function(){return v.clone(this,e,t)})},html:function(e){return v.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return n.nodeType===1?n.innerHTML.replace(ht,""):t;if(typeof e=="string"&&!yt.test(e)&&(v.support.htmlSerialize||!wt.test(e))&&(v.support.leadingWhitespace||!pt.test(e))&&!Nt[(vt.exec(e)||["",""])[1].toLowerCase()]){e=e.replace(dt,"<$1></$2>");try{for(;r<i;r++)n=this[r]||{},n.nodeType===1&&(v.cleanData(n.getElementsByTagName("*")),n.innerHTML=e);n=0}catch(s){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(e){return ut(this[0])?this.length?this.pushStack(v(v.isFunction(e)?e():e),"replaceWith",e):this:v.isFunction(e)?this.each(function(t){var n=v(this),r=n.html();n.replaceWith(e.call(this,t,r))}):(typeof e!="string"&&(e=v(e).detach()),this.each(function(){var t=this.nextSibling,n=this.parentNode;v(this).remove(),t?v(t).before(e):v(n).append(e)}))},detach:function(e){return this.remove(e,!0)},domManip:function(e,n,r){e=[].concat.apply([],e);var i,s,o,u,a=0,f=e[0],l=[],c=this.length;if(!v.support.checkClone&&c>1&&typeof f=="string"&&St.test(f))return this.each(function(){v(this).domManip(e,n,r)});if(v.isFunction(f))return this.each(function(i){var s=v(this);e[0]=f.call(this,i,n?s.html():t),s.domManip(e,n,r)});if(this[0]){i=v.buildFragment(e,this,l),o=i.fragment,s=o.firstChild,o.childNodes.length===1&&(o=s);if(s){n=n&&v.nodeName(s,"tr");for(u=i.cacheable||c-1;a<c;a++)r.call(n&&v.nodeName(this[a],"table")?Lt(this[a],"tbody"):this[a],a===u?o:v.clone(o,!0,!0))}o=s=null,l.length&&v.each(l,function(e,t){t.src?v.ajax?v.ajax({url:t.src,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0}):v.error("no ajax"):v.globalEval((t.text||t.textContent||t.innerHTML||"").replace(Tt,"")),t.parentNode&&t.parentNode.removeChild(t)})}return this}}),v.buildFragment=function(e,n,r){var s,o,u,a=e[0];return n=n||i,n=!n.nodeType&&n[0]||n,n=n.ownerDocument||n,e.length===1&&typeof a=="string"&&a.length<512&&n===i&&a.charAt(0)==="<"&&!bt.test(a)&&(v.support.checkClone||!St.test(a))&&(v.support.html5Clone||!wt.test(a))&&(o=!0,s=v.fragments[a],u=s!==t),s||(s=n.createDocumentFragment(),v.clean(e,n,s,r),o&&(v.fragments[a]=u&&s)),{fragment:s,cacheable:o}},v.fragments={},v.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){v.fn[e]=function(n){var r,i=0,s=[],o=v(n),u=o.length,a=this.length===1&&this[0].parentNode;if((a==null||a&&a.nodeType===11&&a.childNodes.length===1)&&u===1)return o[t](this[0]),this;for(;i<u;i++)r=(i>0?this.clone(!0):this).get(),v(o[i])[t](r),s=s.concat(r);return this.pushStack(s,e,o.selector)}}),v.extend({clone:function(e,t,n){var r,i,s,o;v.support.html5Clone||v.isXMLDoc(e)||!wt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(kt.innerHTML=e.outerHTML,kt.removeChild(o=kt.firstChild));if((!v.support.noCloneEvent||!v.support.noCloneChecked)&&(e.nodeType===1||e.nodeType===11)&&!v.isXMLDoc(e)){Ot(e,o),r=Mt(e),i=Mt(o);for(s=0;r[s];++s)i[s]&&Ot(r[s],i[s])}if(t){At(e,o);if(n){r=Mt(e),i=Mt(o);for(s=0;r[s];++s)At(r[s],i[s])}}return r=i=null,o},clean:function(e,t,n,r){var s,o,u,a,f,l,c,h,p,d,m,g,y=t===i&&Ct,b=[];if(!t||typeof t.createDocumentFragment=="undefined")t=i;for(s=0;(u=e[s])!=null;s++){typeof u=="number"&&(u+="");if(!u)continue;if(typeof u=="string")if(!gt.test(u))u=t.createTextNode(u);else{y=y||lt(t),c=t.createElement("div"),y.appendChild(c),u=u.replace(dt,"<$1></$2>"),a=(vt.exec(u)||["",""])[1].toLowerCase(),f=Nt[a]||Nt._default,l=f[0],c.innerHTML=f[1]+u+f[2];while(l--)c=c.lastChild;if(!v.support.tbody){h=mt.test(u),p=a==="table"&&!h?c.firstChild&&c.firstChild.childNodes:f[1]==="<table>"&&!h?c.childNodes:[];for(o=p.length-1;o>=0;--o)v.nodeName(p[o],"tbody")&&!p[o].childNodes.length&&p[o].parentNode.removeChild(p[o])}!v.support.leadingWhitespace&&pt.test(u)&&c.insertBefore(t.createTextNode(pt.exec(u)[0]),c.firstChild),u=c.childNodes,c.parentNode.removeChild(c)}u.nodeType?b.push(u):v.merge(b,u)}c&&(u=c=y=null);if(!v.support.appendChecked)for(s=0;(u=b[s])!=null;s++)v.nodeName(u,"input")?_t(u):typeof u.getElementsByTagName!="undefined"&&v.grep(u.getElementsByTagName("input"),_t);if(n){m=function(e){if(!e.type||xt.test(e.type))return r?r.push(e.parentNode?e.parentNode.removeChild(e):e):n.appendChild(e)};for(s=0;(u=b[s])!=null;s++)if(!v.nodeName(u,"script")||!m(u))n.appendChild(u),typeof u.getElementsByTagName!="undefined"&&(g=v.grep(v.merge([],u.getElementsByTagName("script")),m),b.splice.apply(b,[s+1,0].concat(g)),s+=g.length)}return b},cleanData:function(e,t){var n,r,i,s,o=0,u=v.expando,a=v.cache,f=v.support.deleteExpando,l=v.event.special;for(;(i=e[o])!=null;o++)if(t||v.acceptData(i)){r=i[u],n=r&&a[r];if(n){if(n.events)for(s in n.events)l[s]?v.event.remove(i,s):v.removeEvent(i,s,n.handle);a[r]&&(delete a[r],f?delete i[u]:i.removeAttribute?i.removeAttribute(u):i[u]=null,v.deletedIds.push(r))}}}}),function(){var e,t;v.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e=v.uaMatch(o.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),v.browser=t,v.sub=function(){function e(t,n){return new e.fn.init(t,n)}v.extend(!0,e,this),e.superclass=this,e.fn=e.prototype=this(),e.fn.constructor=e,e.sub=this.sub,e.fn.init=function(r,i){return i&&i instanceof v&&!(i instanceof e)&&(i=e(i)),v.fn.init.call(this,r,i,t)},e.fn.init.prototype=e.fn;var t=e(i);return e}}();var Dt,Pt,Ht,Bt=/alpha\([^)]*\)/i,jt=/opacity=([^)]*)/,Ft=/^(top|right|bottom|left)$/,It=/^(none|table(?!-c[ea]).+)/,qt=/^margin/,Rt=new RegExp("^("+m+")(.*)$","i"),Ut=new RegExp("^("+m+")(?!px)[a-z%]+$","i"),zt=new RegExp("^([-+])=("+m+")","i"),Wt={BODY:"block"},Xt={position:"absolute",visibility:"hidden",display:"block"},Vt={letterSpacing:0,fontWeight:400},$t=["Top","Right","Bottom","Left"],Jt=["Webkit","O","Moz","ms"],Kt=v.fn.toggle;v.fn.extend({css:function(e,n){return v.access(this,function(e,n,r){return r!==t?v.style(e,n,r):v.css(e,n)},e,n,arguments.length>1)},show:function(){return Yt(this,!0)},hide:function(){return Yt(this)},toggle:function(e,t){var n=typeof e=="boolean";return v.isFunction(e)&&v.isFunction(t)?Kt.apply(this,arguments):this.each(function(){(n?e:Gt(this))?v(this).show():v(this).hide()})}}),v.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Dt(e,"opacity");return n===""?"1":n}}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":v.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(!e||e.nodeType===3||e.nodeType===8||!e.style)return;var s,o,u,a=v.camelCase(n),f=e.style;n=v.cssProps[a]||(v.cssProps[a]=Qt(f,a)),u=v.cssHooks[n]||v.cssHooks[a];if(r===t)return u&&"get"in u&&(s=u.get(e,!1,i))!==t?s:f[n];o=typeof r,o==="string"&&(s=zt.exec(r))&&(r=(s[1]+1)*s[2]+parseFloat(v.css(e,n)),o="number");if(r==null||o==="number"&&isNaN(r))return;o==="number"&&!v.cssNumber[a]&&(r+="px");if(!u||!("set"in u)||(r=u.set(e,r,i))!==t)try{f[n]=r}catch(l){}},css:function(e,n,r,i){var s,o,u,a=v.camelCase(n);return n=v.cssProps[a]||(v.cssProps[a]=Qt(e.style,a)),u=v.cssHooks[n]||v.cssHooks[a],u&&"get"in u&&(s=u.get(e,!0,i)),s===t&&(s=Dt(e,n)),s==="normal"&&n in Vt&&(s=Vt[n]),r||i!==t?(o=parseFloat(s),r||v.isNumeric(o)?o||0:s):s},swap:function(e,t,n){var r,i,s={};for(i in t)s[i]=e.style[i],e.style[i]=t[i];r=n.call(e);for(i in t)e.style[i]=s[i];return r}}),e.getComputedStyle?Dt=function(t,n){var r,i,s,o,u=e.getComputedStyle(t,null),a=t.style;return u&&(r=u.getPropertyValue(n)||u[n],r===""&&!v.contains(t.ownerDocument,t)&&(r=v.style(t,n)),Ut.test(r)&&qt.test(n)&&(i=a.width,s=a.minWidth,o=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=u.width,a.width=i,a.minWidth=s,a.maxWidth=o)),r}:i.documentElement.currentStyle&&(Dt=function(e,t){var n,r,i=e.currentStyle&&e.currentStyle[t],s=e.style;return i==null&&s&&s[t]&&(i=s[t]),Ut.test(i)&&!Ft.test(t)&&(n=s.left,r=e.runtimeStyle&&e.runtimeStyle.left,r&&(e.runtimeStyle.left=e.currentStyle.left),s.left=t==="fontSize"?"1em":i,i=s.pixelLeft+"px",s.left=n,r&&(e.runtimeStyle.left=r)),i===""?"auto":i}),v.each(["height","width"],function(e,t){v.cssHooks[t]={get:function(e,n,r){if(n)return e.offsetWidth===0&&It.test(Dt(e,"display"))?v.swap(e,Xt,function(){return tn(e,t,r)}):tn(e,t,r)},set:function(e,n,r){return Zt(e,n,r?en(e,t,r,v.support.boxSizing&&v.css(e,"boxSizing")==="border-box"):0)}}}),v.support.opacity||(v.cssHooks.opacity={get:function(e,t){return jt.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=v.isNumeric(t)?"alpha(opacity="+t*100+")":"",s=r&&r.filter||n.filter||"";n.zoom=1;if(t>=1&&v.trim(s.replace(Bt,""))===""&&n.removeAttribute){n.removeAttribute("filter");if(r&&!r.filter)return}n.filter=Bt.test(s)?s.replace(Bt,i):s+" "+i}}),v(function(){v.support.reliableMarginRight||(v.cssHooks.marginRight={get:function(e,t){return v.swap(e,{display:"inline-block"},function(){if(t)return Dt(e,"marginRight")})}}),!v.support.pixelPosition&&v.fn.position&&v.each(["top","left"],function(e,t){v.cssHooks[t]={get:function(e,n){if(n){var r=Dt(e,t);return Ut.test(r)?v(e).position()[t]+"px":r}}}})}),v.expr&&v.expr.filters&&(v.expr.filters.hidden=function(e){return e.offsetWidth===0&&e.offsetHeight===0||!v.support.reliableHiddenOffsets&&(e.style&&e.style.display||Dt(e,"display"))==="none"},v.expr.filters.visible=function(e){return!v.expr.filters.hidden(e)}),v.each({margin:"",padding:"",border:"Width"},function(e,t){v.cssHooks[e+t]={expand:function(n){var r,i=typeof n=="string"?n.split(" "):[n],s={};for(r=0;r<4;r++)s[e+$t[r]+t]=i[r]||i[r-2]||i[0];return s}},qt.test(e)||(v.cssHooks[e+t].set=Zt)});var rn=/%20/g,sn=/\[\]$/,on=/\r?\n/g,un=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,an=/^(?:select|textarea)/i;v.fn.extend({serialize:function(){return v.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?v.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||an.test(this.nodeName)||un.test(this.type))}).map(function(e,t){var n=v(this).val();return n==null?null:v.isArray(n)?v.map(n,function(e,n){return{name:t.name,value:e.replace(on,"\r\n")}}):{name:t.name,value:n.replace(on,"\r\n")}}).get()}}),v.param=function(e,n){var r,i=[],s=function(e,t){t=v.isFunction(t)?t():t==null?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};n===t&&(n=v.ajaxSettings&&v.ajaxSettings.traditional);if(v.isArray(e)||e.jquery&&!v.isPlainObject(e))v.each(e,function(){s(this.name,this.value)});else for(r in e)fn(r,e[r],n,s);return i.join("&").replace(rn,"+")};var ln,cn,hn=/#.*$/,pn=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,dn=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,vn=/^(?:GET|HEAD)$/,mn=/^\/\//,gn=/\?/,yn=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bn=/([?&])_=[^&]*/,wn=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,En=v.fn.load,Sn={},xn={},Tn=["*/"]+["*"];try{cn=s.href}catch(Nn){cn=i.createElement("a"),cn.href="",cn=cn.href}ln=wn.exec(cn.toLowerCase())||[],v.fn.load=function(e,n,r){if(typeof e!="string"&&En)return En.apply(this,arguments);if(!this.length)return this;var i,s,o,u=this,a=e.indexOf(" ");return a>=0&&(i=e.slice(a,e.length),e=e.slice(0,a)),v.isFunction(n)?(r=n,n=t):n&&typeof n=="object"&&(s="POST"),v.ajax({url:e,type:s,dataType:"html",data:n,complete:function(e,t){r&&u.each(r,o||[e.responseText,t,e])}}).done(function(e){o=arguments,u.html(i?v("<div>").append(e.replace(yn,"")).find(i):e)}),this},v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(e,t){v.fn[t]=function(e){return this.on(t,e)}}),v.each(["get","post"],function(e,n){v[n]=function(e,r,i,s){return v.isFunction(r)&&(s=s||i,i=r,r=t),v.ajax({type:n,url:e,data:r,success:i,dataType:s})}}),v.extend({getScript:function(e,n){return v.get(e,t,n,"script")},getJSON:function(e,t,n){return v.get(e,t,n,"json")},ajaxSetup:function(e,t){return t?Ln(e,v.ajaxSettings):(t=e,e=v.ajaxSettings),Ln(e,t),e},ajaxSettings:{url:cn,isLocal:dn.test(ln[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":Tn},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":e.String,"text html":!0,"text json":v.parseJSON,"text xml":v.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:Cn(Sn),ajaxTransport:Cn(xn),ajax:function(e,n){function T(e,n,s,a){var l,y,b,w,S,T=n;if(E===2)return;E=2,u&&clearTimeout(u),o=t,i=a||"",x.readyState=e>0?4:0,s&&(w=An(c,x,s));if(e>=200&&e<300||e===304)c.ifModified&&(S=x.getResponseHeader("Last-Modified"),S&&(v.lastModified[r]=S),S=x.getResponseHeader("Etag"),S&&(v.etag[r]=S)),e===304?(T="notmodified",l=!0):(l=On(c,w),T=l.state,y=l.data,b=l.error,l=!b);else{b=T;if(!T||e)T="error",e<0&&(e=0)}x.status=e,x.statusText=(n||T)+"",l?d.resolveWith(h,[y,T,x]):d.rejectWith(h,[x,T,b]),x.statusCode(g),g=t,f&&p.trigger("ajax"+(l?"Success":"Error"),[x,c,l?y:b]),m.fireWith(h,[x,T]),f&&(p.trigger("ajaxComplete",[x,c]),--v.active||v.event.trigger("ajaxStop"))}typeof e=="object"&&(n=e,e=t),n=n||{};var r,i,s,o,u,a,f,l,c=v.ajaxSetup({},n),h=c.context||c,p=h!==c&&(h.nodeType||h instanceof v)?v(h):v.event,d=v.Deferred(),m=v.Callbacks("once memory"),g=c.statusCode||{},b={},w={},E=0,S="canceled",x={readyState:0,setRequestHeader:function(e,t){if(!E){var n=e.toLowerCase();e=w[n]=w[n]||e,b[e]=t}return this},getAllResponseHeaders:function(){return E===2?i:null},getResponseHeader:function(e){var n;if(E===2){if(!s){s={};while(n=pn.exec(i))s[n[1].toLowerCase()]=n[2]}n=s[e.toLowerCase()]}return n===t?null:n},overrideMimeType:function(e){return E||(c.mimeType=e),this},abort:function(e){return e=e||S,o&&o.abort(e),T(0,e),this}};d.promise(x),x.success=x.done,x.error=x.fail,x.complete=m.add,x.statusCode=function(e){if(e){var t;if(E<2)for(t in e)g[t]=[g[t],e[t]];else t=e[x.status],x.always(t)}return this},c.url=((e||c.url)+"").replace(hn,"").replace(mn,ln[1]+"//"),c.dataTypes=v.trim(c.dataType||"*").toLowerCase().split(y),c.crossDomain==null&&(a=wn.exec(c.url.toLowerCase()),c.crossDomain=!(!a||a[1]===ln[1]&&a[2]===ln[2]&&(a[3]||(a[1]==="http:"?80:443))==(ln[3]||(ln[1]==="http:"?80:443)))),c.data&&c.processData&&typeof c.data!="string"&&(c.data=v.param(c.data,c.traditional)),kn(Sn,c,n,x);if(E===2)return x;f=c.global,c.type=c.type.toUpperCase(),c.hasContent=!vn.test(c.type),f&&v.active++===0&&v.event.trigger("ajaxStart");if(!c.hasContent){c.data&&(c.url+=(gn.test(c.url)?"&":"?")+c.data,delete c.data),r=c.url;if(c.cache===!1){var N=v.now(),C=c.url.replace(bn,"$1_="+N);c.url=C+(C===c.url?(gn.test(c.url)?"&":"?")+"_="+N:"")}}(c.data&&c.hasContent&&c.contentType!==!1||n.contentType)&&x.setRequestHeader("Content-Type",c.contentType),c.ifModified&&(r=r||c.url,v.lastModified[r]&&x.setRequestHeader("If-Modified-Since",v.lastModified[r]),v.etag[r]&&x.setRequestHeader("If-None-Match",v.etag[r])),x.setRequestHeader("Accept",c.dataTypes[0]&&c.accepts[c.dataTypes[0]]?c.accepts[c.dataTypes[0]]+(c.dataTypes[0]!=="*"?", "+Tn+"; q=0.01":""):c.accepts["*"]);for(l in c.headers)x.setRequestHeader(l,c.headers[l]);if(!c.beforeSend||c.beforeSend.call(h,x,c)!==!1&&E!==2){S="abort";for(l in{success:1,error:1,complete:1})x[l](c[l]);o=kn(xn,c,n,x);if(!o)T(-1,"No Transport");else{x.readyState=1,f&&p.trigger("ajaxSend",[x,c]),c.async&&c.timeout>0&&(u=setTimeout(function(){x.abort("timeout")},c.timeout));try{E=1,o.send(b,T)}catch(k){if(!(E<2))throw k;T(-1,k)}}return x}return x.abort()},active:0,lastModified:{},etag:{}});var Mn=[],_n=/\?/,Dn=/(=)\?(?=&|$)|\?\?/,Pn=v.now();v.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Mn.pop()||v.expando+"_"+Pn++;return this[e]=!0,e}}),v.ajaxPrefilter("json jsonp",function(n,r,i){var s,o,u,a=n.data,f=n.url,l=n.jsonp!==!1,c=l&&Dn.test(f),h=l&&!c&&typeof a=="string"&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Dn.test(a);if(n.dataTypes[0]==="jsonp"||c||h)return s=n.jsonpCallback=v.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,o=e[s],c?n.url=f.replace(Dn,"$1"+s):h?n.data=a.replace(Dn,"$1"+s):l&&(n.url+=(_n.test(f)?"&":"?")+n.jsonp+"="+s),n.converters["script json"]=function(){return u||v.error(s+" was not called"),u[0]},n.dataTypes[0]="json",e[s]=function(){u=arguments},i.always(function(){e[s]=o,n[s]&&(n.jsonpCallback=r.jsonpCallback,Mn.push(s)),u&&v.isFunction(o)&&o(u[0]),u=o=t}),"script"}),v.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(e){return v.globalEval(e),e}}}),v.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),v.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=i.head||i.getElementsByTagName("head")[0]||i.documentElement;return{send:function(s,o){n=i.createElement("script"),n.async="async",e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,i){if(i||!n.readyState||/loaded|complete/.test(n.readyState))n.onload=n.onreadystatechange=null,r&&n.parentNode&&r.removeChild(n),n=t,i||o(200,"success")},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(0,1)}}}});var Hn,Bn=e.ActiveXObject?function(){for(var e in Hn)Hn[e](0,1)}:!1,jn=0;v.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&Fn()||In()}:Fn,function(e){v.extend(v.support,{ajax:!!e,cors:!!e&&"withCredentials"in e})}(v.ajaxSettings.xhr()),v.support.ajax&&v.ajaxTransport(function(n){if(!n.crossDomain||v.support.cors){var r;return{send:function(i,s){var o,u,a=n.xhr();n.username?a.open(n.type,n.url,n.async,n.username,n.password):a.open(n.type,n.url,n.async);if(n.xhrFields)for(u in n.xhrFields)a[u]=n.xhrFields[u];n.mimeType&&a.overrideMimeType&&a.overrideMimeType(n.mimeType),!n.crossDomain&&!i["X-Requested-With"]&&(i["X-Requested-With"]="XMLHttpRequest");try{for(u in i)a.setRequestHeader(u,i[u])}catch(f){}a.send(n.hasContent&&n.data||null),r=function(e,i){var u,f,l,c,h;try{if(r&&(i||a.readyState===4)){r=t,o&&(a.onreadystatechange=v.noop,Bn&&delete Hn[o]);if(i)a.readyState!==4&&a.abort();else{u=a.status,l=a.getAllResponseHeaders(),c={},h=a.responseXML,h&&h.documentElement&&(c.xml=h);try{c.text=a.responseText}catch(p){}try{f=a.statusText}catch(p){f=""}!u&&n.isLocal&&!n.crossDomain?u=c.text?200:404:u===1223&&(u=204)}}}catch(d){i||s(-1,d)}c&&s(u,f,c,l)},n.async?a.readyState===4?setTimeout(r,0):(o=++jn,Bn&&(Hn||(Hn={},v(e).unload(Bn)),Hn[o]=r),a.onreadystatechange=r):r()},abort:function(){r&&r(0,1)}}}});var qn,Rn,Un=/^(?:toggle|show|hide)$/,zn=new RegExp("^(?:([-+])=|)("+m+")([a-z%]*)$","i"),Wn=/queueHooks$/,Xn=[Gn],Vn={"*":[function(e,t){var n,r,i=this.createTween(e,t),s=zn.exec(t),o=i.cur(),u=+o||0,a=1,f=20;if(s){n=+s[2],r=s[3]||(v.cssNumber[e]?"":"px");if(r!=="px"&&u){u=v.css(i.elem,e,!0)||n||1;do a=a||".5",u/=a,v.style(i.elem,e,u+r);while(a!==(a=i.cur()/o)&&a!==1&&--f)}i.unit=r,i.start=u,i.end=s[1]?u+(s[1]+1)*n:n}return i}]};v.Animation=v.extend(Kn,{tweener:function(e,t){v.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;r<i;r++)n=e[r],Vn[n]=Vn[n]||[],Vn[n].unshift(t)},prefilter:function(e,t){t?Xn.unshift(e):Xn.push(e)}}),v.Tween=Yn,Yn.prototype={constructor:Yn,init:function(e,t,n,r,i,s){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=s||(v.cssNumber[n]?"":"px")},cur:function(){var e=Yn.propHooks[this.prop];return e&&e.get?e.get(this):Yn.propHooks._default.get(this)},run:function(e){var t,n=Yn.propHooks[this.prop];return this.options.duration?this.pos=t=v.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Yn.propHooks._default.set(this),this}},Yn.prototype.init.prototype=Yn.prototype,Yn.propHooks={_default:{get:function(e){var t;return e.elem[e.prop]==null||!!e.elem.style&&e.elem.style[e.prop]!=null?(t=v.css(e.elem,e.prop,!1,""),!t||t==="auto"?0:t):e.elem[e.prop]},set:function(e){v.fx.step[e.prop]?v.fx.step[e.prop](e):e.elem.style&&(e.elem.style[v.cssProps[e.prop]]!=null||v.cssHooks[e.prop])?v.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},Yn.propHooks.scrollTop=Yn.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},v.each(["toggle","show","hide"],function(e,t){var n=v.fn[t];v.fn[t]=function(r,i,s){return r==null||typeof r=="boolean"||!e&&v.isFunction(r)&&v.isFunction(i)?n.apply(this,arguments):this.animate(Zn(t,!0),r,i,s)}}),v.fn.extend({fadeTo:function(e,t,n,r){return this.filter(Gt).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=v.isEmptyObject(e),s=v.speed(t,n,r),o=function(){var t=Kn(this,v.extend({},e),s);i&&t.stop(!0)};return i||s.queue===!1?this.each(o):this.queue(s.queue,o)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return typeof e!="string"&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=e!=null&&e+"queueHooks",s=v.timers,o=v._data(this);if(n)o[n]&&o[n].stop&&i(o[n]);else for(n in o)o[n]&&o[n].stop&&Wn.test(n)&&i(o[n]);for(n=s.length;n--;)s[n].elem===this&&(e==null||s[n].queue===e)&&(s[n].anim.stop(r),t=!1,s.splice(n,1));(t||!r)&&v.dequeue(this,e)})}}),v.each({slideDown:Zn("show"),slideUp:Zn("hide"),slideToggle:Zn("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){v.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),v.speed=function(e,t,n){var r=e&&typeof e=="object"?v.extend({},e):{complete:n||!n&&t||v.isFunction(e)&&e,duration:e,easing:n&&t||t&&!v.isFunction(t)&&t};r.duration=v.fx.off?0:typeof r.duration=="number"?r.duration:r.duration in v.fx.speeds?v.fx.speeds[r.duration]:v.fx.speeds._default;if(r.queue==null||r.queue===!0)r.queue="fx";return r.old=r.complete,r.complete=function(){v.isFunction(r.old)&&r.old.call(this),r.queue&&v.dequeue(this,r.queue)},r},v.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},v.timers=[],v.fx=Yn.prototype.init,v.fx.tick=function(){var e,n=v.timers,r=0;qn=v.now();for(;r<n.length;r++)e=n[r],!e()&&n[r]===e&&n.splice(r--,1);n.length||v.fx.stop(),qn=t},v.fx.timer=function(e){e()&&v.timers.push(e)&&!Rn&&(Rn=setInterval(v.fx.tick,v.fx.interval))},v.fx.interval=13,v.fx.stop=function(){clearInterval(Rn),Rn=null},v.fx.speeds={slow:600,fast:200,_default:400},v.fx.step={},v.expr&&v.expr.filters&&(v.expr.filters.animated=function(e){return v.grep(v.timers,function(t){return e===t.elem}).length});var er=/^(?:body|html)$/i;v.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){v.offset.setOffset(this,e,t)});var n,r,i,s,o,u,a,f={top:0,left:0},l=this[0],c=l&&l.ownerDocument;if(!c)return;return(r=c.body)===l?v.offset.bodyOffset(l):(n=c.documentElement,v.contains(n,l)?(typeof l.getBoundingClientRect!="undefined"&&(f=l.getBoundingClientRect()),i=tr(c),s=n.clientTop||r.clientTop||0,o=n.clientLeft||r.clientLeft||0,u=i.pageYOffset||n.scrollTop,a=i.pageXOffset||n.scrollLeft,{top:f.top+u-s,left:f.left+a-o}):f)},v.offset={bodyOffset:function(e){var t=e.offsetTop,n=e.offsetLeft;return v.support.doesNotIncludeMarginInBodyOffset&&(t+=parseFloat(v.css(e,"marginTop"))||0,n+=parseFloat(v.css(e,"marginLeft"))||0),{top:t,left:n}},setOffset:function(e,t,n){var r=v.css(e,"position");r==="static"&&(e.style.position="relative");var i=v(e),s=i.offset(),o=v.css(e,"top"),u=v.css(e,"left"),a=(r==="absolute"||r==="fixed")&&v.inArray("auto",[o,u])>-1,f={},l={},c,h;a?(l=i.position(),c=l.top,h=l.left):(c=parseFloat(o)||0,h=parseFloat(u)||0),v.isFunction(t)&&(t=t.call(e,n,s)),t.top!=null&&(f.top=t.top-s.top+c),t.left!=null&&(f.left=t.left-s.left+h),"using"in t?t.using.call(e,f):i.css(f)}},v.fn.extend({position:function(){if(!this[0])return;var e=this[0],t=this.offsetParent(),n=this.offset(),r=er.test(t[0].nodeName)?{top:0,left:0}:t.offset();return n.top-=parseFloat(v.css(e,"marginTop"))||0,n.left-=parseFloat(v.css(e,"marginLeft"))||0,r.top+=parseFloat(v.css(t[0],"borderTopWidth"))||0,r.left+=parseFloat(v.css(t[0],"borderLeftWidth"))||0,{top:n.top-r.top,left:n.left-r.left}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||i.body;while(e&&!er.test(e.nodeName)&&v.css(e,"position")==="static")e=e.offsetParent;return e||i.body})}}),v.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);v.fn[e]=function(i){return v.access(this,function(e,i,s){var o=tr(e);if(s===t)return o?n in o?o[n]:o.document.documentElement[i]:e[i];o?o.scrollTo(r?v(o).scrollLeft():s,r?s:v(o).scrollTop()):e[i]=s},e,i,arguments.length,null)}}),v.each({Height:"height",Width:"width"},function(e,n){v.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){v.fn[i]=function(i,s){var o=arguments.length&&(r||typeof i!="boolean"),u=r||(i===!0||s===!0?"margin":"border");return v.access(this,function(n,r,i){var s;return v.isWindow(n)?n.document.documentElement["client"+e]:n.nodeType===9?(s=n.documentElement,Math.max(n.body["scroll"+e],s["scroll"+e],n.body["offset"+e],s["offset"+e],s["client"+e])):i===t?v.css(n,r,i,u):v.style(n,r,i,u)},n,o?i:t,o,null)}})}),e.jQuery=e.$=v,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return v})})(window);
    </script>

    <script type="text/javascript">
    (function(e){function l(){return f==true?false:window.DeviceOrientationEvent!=undefined}function c(e){x=e.gamma;y=e.beta;if(Math.abs(window.orientation)===90){var t=x;x=y;y=t}if(window.orientation<0){x=-x;y=-y}u=u==null?x:u;a=a==null?y:a;return{x:x-u,y:y-a}}function h(e){if((new Date).getTime()<r+n)return;r=(new Date).getTime();var t=s.offset()!=null?s.offset().left:0,u=s.offset()!=null?s.offset().top:0,a=e.pageX-t,h=e.pageY-u;if(a<0||a>s.width()||h<0||h>s.height())return;if(l()){if(e.gamma==undefined){f=true;return}values=c(e);a=values.x/30;h=values.y/30}var p=a/(l()==true?o:s.width()),d=h/(l()==true?o:s.height()),v,m;for(m=i.length;m--;){v=i[m];newX=v.startX+v.inversionFactor*v.xRange*p;newY=v.startY+v.inversionFactor*v.yRange*d;if(v.background){v.obj.css("background-position",newX+"px "+newY+"px")}else{v.obj.css("left",newX).css("top",newY)}}}var t=25,n=1/t*1e3,r=(new Date).getTime(),i=[],s=e(window),o=1,u=null,a=null,f=false;e.fn.plaxify=function(t){return this.each(function(){var n=-1;var r={xRange:e(this).data("xrange")||0,yRange:e(this).data("yrange")||0,invert:e(this).data("invert")||false,background:e(this).data("background")||false};for(var s=0;s<i.length;s++){if(this===i[s].obj.get(0)){n=s}}for(var o in t){if(r[o]==0){r[o]=t[o]}}r.inversionFactor=r.invert?-1:1;r.obj=e(this);if(r.background){pos=(r.obj.css("background-position")||"0px 0px").split(/ /);if(pos.length!=2){return}x=pos[0].match(/^((-?\d+)\s*px|0+\s*%|left)$/);y=pos[1].match(/^((-?\d+)\s*px|0+\s*%|top)$/);if(!x||!y){return}r.startX=x[2]||0;r.startY=y[2]||0}else{var u=r.obj.position();r.obj.css({top:u.top,left:u.left,right:"",bottom:""});r.startX=this.offsetLeft;r.startY=this.offsetTop}r.startX-=r.inversionFactor*Math.floor(r.xRange/2);r.startY-=r.inversionFactor*Math.floor(r.yRange/2);if(n>=0){i.splice(n,1,r)}else{i.push(r)}})};e.plax={enable:function(t){e(document).bind("mousemove.plax",function(n){if(t){s=t.activityTarget||e(window)}h(n)});if(l()){window.ondeviceorientation=function(e){h(e)}}},disable:function(t){e(document).unbind("mousemove.plax");window.ondeviceorientation=undefined;if(t&&typeof t.clearLayers==="boolean"&&t.clearLayers)i=[]}};if(typeof ender!=="undefined"){e.ender(e.fn,true)}})(function(){return typeof jQuery!=="undefined"?jQuery:ender}())
    </script>

    <script type="text/javascript">
      // Plaxify all `js-plaxify` element layers
      var layers = $('.js-plaxify')

      $.each(layers, function(index, layer){
        $(layer).plaxify({
          xRange: $(layer).data('xrange') || 0,
          yRange: $(layer).data('yrange') || 0,
          invert: $(layer).data('invert') || false
        })
      })

      $.plax.enable()

      $.ajax({
        url: '/sessions/login_404?return_to='+window.location.pathname,
        success: function(data) {
          if (data != ' ') {
            $('#auth').html(data).slideDown(100)
            $('#login_field').attr("placeholder", "Username or Email")
            $('#password').attr("placeholder", "Password")
          }
        }
      });

    </script>
  </body>
</html>

/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
