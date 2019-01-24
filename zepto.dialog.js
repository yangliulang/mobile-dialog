/**
 *杨永
 *移动端web对话框组件
 *2018-03-01
 *增加按钮倒计时激活功能
 *qq 377746756 call 18911082352
 **/
(function($) {
  var Dialog = function(config) {
    var _this_ = this;

    //设置默认配置参数
    this.config = {
      //对话框的宽度
      width: 'auto',
      //对话框的高度
      height: 'auto',
      //多话提示类型，如果type="ios" 则启动ios对话皮肤效果，配合上caption
      type: false,
      //如果不用图标用文字作为提示
      caption: 'IOS系统对话框',
      //对话框提示信息
      message: false,
      //对话框按钮组
      buttons: false,
      //对话框遮罩层透明度
      maskOpacity: false,
      //弹框弹出多久就关闭
      delay: false,
      //是否开启动画
      effect: false,
      //如果定制了延迟关闭回调函数
      delayCallback: false,
      //点击遮罩层要不要关闭
      maskClose: false
    };

    //扩展默认参数,如果对象是由new Object 或者对象字面量生成的，则返回true
    if (config && $.isPlainObject(config)) {
      $.extend(this.config, config);
    } else {
      //如果什么都没传
      this.isConfig = true;
    }

    //创建基本DOM，注意分离创建，因为每一结果都要去控制内容或操作
    this.body = $('body');
    //创建遮罩层
    this.mask = $("<div class='g-dialog-contianer'>");
    //创建弹出框
    this.win = $("<div class='dialog-window'>");
    //创建弹出框头部
    this.winHeader = $("<div class='dialog-header'>");
    //创建弹出框内容
    this.winContent = $("<div class='dialog-content'>");
    //创建弹出框头部
    this.winFooter = $("<div class='dialog-footer'>");
    //根据配置参数构建弹出框
    this.create();

    //点击遮罩层是否关闭
    if (this.config.maskClose) {
      this.mask.tap(function() {
        _this_.close();
      });
      //防止在弹框上点击也关闭
      this.win.tap(function(e) {
        e.stopPropagation();
      });
    }
  };

  Dialog.prototype = {
    //执行电话弹出
    animate: function() {
      var _this_ = this;
      this.win.css('-webkit-transform', 'scale(0,0)');
      window.setTimeout(function() {
        _this_.win.css('-webkit-transform', 'scale(1,1)');
      }, 100);
    },
    //创建弹出框 3
    create: function() {
      var _this_ = this,
        config = this.config,
        mask = this.mask,
        win = this.win,
        header = this.winHeader,
        content = this.winContent,
        footer = this.winFooter,
        body = this.body;

      //是否开启了动画
      config.effect && _this_.animate();

      //如果没有传递任何配置参数,默认就给一个加载动画的弹框
      if (this.isConfig) {
        win.append(header.addClass('waiting'));
        mask.append(win);
        body.append(mask);
      } else {
        //如果有配置参数
        //设置对话图标
        if (config.type) {
          if (config.type != 'ios') {
            header.addClass(config.type);
          } else {
            this.win.addClass('ios-skin');
            header.html(config.caption);
          }
          win.append(header);
        }

        //如果制定了提示信息
        if (config.message) {
          win.append(content.html(config.message));
        }
        //如果制定了按钮组
        if (config.buttons) {
          //需要根据按钮组创建按钮
          this.createButtons(footer, config.buttons);
          win.append(footer);
        }
        //插入页面
        mask.append(win);
        body.append(mask);

        //最后设置下多久自动关闭
        if (config.delay && config.delay != 0) {
          window.setTimeout(function() {
            _this_.close();
            //如果配置了延时回调
            config.delayCallback && config.delayCallback();
          }, config.delay);
        }
        //设置下遮罩层透明度
        if (config.maskOpacity != null) {
          mask.css('backgroundColor', 'rgba(0,0,0,' + config.maskOpacity + ')');
        }
        //设置下对话框宽高
        if (config.width != 'auto') {
          win.width(config.width);
        }

        if (config.height != 'auto') {
          win.height(config.height);
        }
      }
    },
    //创建按钮组 4
    createButtons: function(footer, buttons) {
      var _this_ = this;
      $(buttons).each(function(i) {
        //获取按钮样式和回调函数
        var type = this.type ? ' class=' + this.type + '' : '';
        var callback = this.callback ? this.callback : null;
        var btnText = this.text ? this.text : '按钮' + ++i;
        //增加按钮倒计时激活功能
        var btn, span;
        if (this.delayDisable) {
          span = $('<span/>');
          btn = $(
            '<button' + type + " data-delay='yes'>" + btnText + '</button>'
          );
          btn.prepend(span);
          _this_.createDelay(btn, span, this.delayDisable);
        } else {
          btn = $('<button' + type + '>' + btnText + '</button>');
        }
        btn.click(function() {
          if ($(this).attr('data-delay') == 'yes') {
            return false;
          }
          var isClose = callback && callback();
          //如果返回值不等于false,就关闭弹框
          if (isClose != false) {
            _this_.close();
          }
        });
        footer.append(btn);
      });
    },
    createDelay: function(btn, span, delay) {
      span.text('(' + delay + ')');
      btn.timer = window.setInterval(function() {
        delay--;
        span.text('(' + delay + ')');
        if (delay <= 0) {
          window.clearInterval(btn.timer);
          span.remove();
          btn.removeAttr('data-delay');
        }
      }, 1000);
    },
    //关闭
    close: function() {
      this.mask.remove();
    }
  };
  //注册到全局对象
  window.Dialog = Dialog;
  //扩展为$调用
  $.dialog = function(config) {
    return new Dialog(config);
  };
})(Zepto);
