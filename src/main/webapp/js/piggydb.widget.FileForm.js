(function(module) {
	
	var _ID = "file-form";
	
	var _open = function() {
		if (module.FormDialog.setFocusIfOpen(_ID)) return;
		
		jQuery("#" + _ID).remove();
		piggydb.util.blockPageDuringAjaxRequest();
		jQuery.get("partial/file-form.htm", function(html) {
			if (!module.FormDialog.checkOpenError(html)) {
				jQuery("body").append(html);
				var form = new _class(jQuery("#" + _ID));
				form.open();
			}
		});
	};
	
	var _initialHeight = 75;
	
	var _class = function(element) {
		module.FormDialog.call(this, element);
		this.id = _ID;
		this.indicator = this.element.find("span.indicator");
		this.fragment = null;		// target fragment widget to be updated
	};
	
	_class.openToAdd = function() {
		_open();
	};
	
	_class.prototype = jQuery.extend({
		
		open: function() {
			var outer = this;
			
			this.element.dialog({
				width: 600,
				height: _initialHeight,
				close: function(event, ui) {
					piggydb.widget.imageViewer.close();
				}
			});
		
			this.buttonsDiv().hide();
			
			this.element.find("input.file").change(function() {
				outer.setDialogHeight(_initialHeight + 15);
				outer.previewDiv().empty().putLoadingIcon("margin: 5px 10px;");
				outer.element.find("form.upload-file").submit();
			});
			this.element.find("div.onPreviewUpdate").click(function() {
				outer.onPreviewUpdate();
			});
			this.element.find("button.register").click(function() {
				outer.clearErrors();
				outer.block();
				var values = outer.element.find("form.save-file").serializeArray();
				jQuery.post("partial/save-file.htm", values, function(html) {
					if (outer.checkErrors(html)) {
						piggydb.widget.imageViewer.close();
						outer.unblock();
					}
					else {
						piggydb.widget.Fragment.onAjaxSaved(html, outer.fragment);
						outer.close();
					}
				});
			});
		},
		
		setDialogHeight: function(height) {
			this.element.dialog("option", "height", height);
		},
		
		buttonsDiv: function() {
			return this.element.find("div.buttons");
		},
		
		previewDiv: function() {
			return this.element.find("div.preview");
		},
		
		onPreviewUpdate: function() {
			this.buttonsDiv().show();
			this.setDialogHeight(
				_initialHeight + 
				this.previewDiv().height() +
				this.buttonsDiv().height() +
				5);
			piggydb.widget.imageViewer.close();
		}
		
	}, module.FormDialog.prototype);
	
	module.FileForm = _class;
	
})(piggydb.widget);	