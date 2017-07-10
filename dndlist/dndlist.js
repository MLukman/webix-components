/*
 * Webix Component "dndlist"
 * Version 1.1 
 * By Muhammad Lukman Nasaruddin (https://github.com/MLukman/webix-components) 
 *
 * Requires Webix >= 3.1.1 
 */  
webix.protoUI({
	name: "dndlist",
	defaults: {
		label: "",
		labelWidth: 80,
		height: 200,
		choicesHeader: "Choices",
		valueHeader: "Selected",
		choices: [],
		value: [],
		swap: false
	},
	$formElement: true,
	$init: function (cfg) {
		var dnd = this;
		this.config = webix.extend(this.defaults, cfg, true);
		var dtCommon = {view: "datatable", scrollX: false, drag: true};
		var value = [];
		for (var i = 0; i < this.config.value.length; i++) {
			value.push({value: this.config.value[i]});
		}
		var choicesDt = webix.extend(webix.copy(dtCommon), {
			id: 'choices',
			columns: [
				{
					id: "display",
					header: {
						text: this.config.choicesHeader,
						colspan: 2
					},
					fillspace: true
				},
				{
					id: "_actions",
					header: "&nbsp;",
					width: 35,
					template: function (row) {
						return "<span  style=' cursor:pointer;' class='webix_icon fa-plus-square'></span>";
					}
				}
			],
			onClick: {
				'fa-plus-square': function (e, i) {
					var row = this.getItem(i.row);
					dnd.addValue(row.value);
				}
			},
			on: {
				onItemDblClick: function (id) {
					dnd.addValue(this.getItem(id).value);
				}
			}
		}, true);
		var valueDt = webix.extend(webix.copy(dtCommon), {
			id: 'value',
			columns: [
				{
					id: "display",
					header: {
						text: this.config.valueHeader,
						colspan: 2
					},
					fillspace: true
				},
				{
					id: "_actions",
					header: "&nbsp;",
					width: 35,
					template: function (row) {
						return "<span  style=' cursor:pointer;' class='webix_icon fa-minus-square'></span>";
					}
				}
			],
			onClick: {
				'fa-minus-square': function (e, i) {
					var row = this.getItem(i.row);
					dnd.removeValue(row.value);
				}
			},
			on: {
				onItemDblClick: function (id) {
					dnd.removeValue(this.getItem(id).value);
				}
			}
		}, true);

		var spacer = {view: 'resizer', borderless: true};
		var cols = {cols: (this.config.swap ? [valueDt, spacer, choicesDt] : [choicesDt, spacer, valueDt])};
		var top = (this.config.labelPosition == 'top');
		var label = (this.config.label != "" ?
				//{id: 'label', view: 'label', label: config.label, width: config.labelWidth, align: config.labelAlign} :
				{
					id: 'label',
					view: 'template',
					type: 'clean',
					width: this.config.labelWidth,
					css: { 'text-align' : this.config.labelAlign },
					template: '<label style="display: inline-block; float: ' + this.config.labelAlign 
					+ '" class="webix_inp_' + (top ? "top_":"") + 'label '
					+ (this.config.required ? "webix_required":"")
					+ '">' + this.config.label + '</label>'
				}:
				{width: 1, height: 1});
		if (top) {
			config.rows = [
				label,
				cols
			];
		} else {
			//label.css = { 'padding-right': '7.5px' };
			this.config.cols = [
				{
					rows: [label]
				},
				cols
			];
		}

		this.$ready.push(function () {
			this.setValue(this.config.value);
			this.setChoices(this.config.choices);
			$$(this.$view).$$('label').getNode().children[0].style.padding = 0;
			//webix.html.addCss($$(this.$view).$$('label').getNode(), 'webix_inp_label');
			//webix.html.removeCss($$(this.$view).$$('label').getNode(), 'webix_el_label');
		});
	},
	setChoices: function (choices) {
		var choicesDt = $$(this.$view).$$('choices');
		choicesDt.clearAll();
		var values = this.getValue();
		if (Array.isArray(choices)) {
			for (var i = 0; i < choices.length; i++) {
				if (values.indexOf(choices[i]) === -1) {
					choicesDt.add({value: choices[i], display: choices[i]});
				}
			}
		}
		else {
			for (var value in choices) {
				if (values.indexOf(value) === -1) {
					choicesDt.add({value: value, display: choices[value]});
				}
			}
		}
		this.config.choices = choices;
	},
	setValue: function (values) {
		var existVal = this.getValue();
		for (var i = 0; i < existVal.length; i++) {
			if (values.indexOf(existVal[i]) === -1) {
				this.removeValue(existVal[i]);
			}
		}
		for (var j = 0; j < values.length; j++) {
			this.addValue(values[j]);
		}
	},
	getValue: function () {
		var value = [];
		var valueDt = $$(this.$view).$$('value');
		valueDt.eachRow(function (row) {
			value.push(valueDt.getItem(row).value);
		}, true);
		return value;
	},
	addValue: function (value) {
		var valueDt = this.$$('value');
		var choicesDt = this.$$('choices');
		var choices = this.config.choices;
		var rowFinder = (function (row) {
			return row.value === value;
		});
		if (valueDt.find(rowFinder, true) == false) {
			if (Array.isArray(choices)) {
				valueDt.add({value: value, display: value});
			}
			else {
				valueDt.add({value: value, display: choices[value]});
			}
		}
		var choices = choicesDt.find(rowFinder);
		for (var i = 0; i < choices.length; i++) {
			choicesDt.remove(choices[i].id);
		}
	},
	removeValue: function (val) {
		var valueDt = this.$$('value');
		var choicesDt = this.$$('choices');
		var choices = this.config.choices;
		var rowFinder = (function (row) {
			return row.value === val;
		});
		var value = valueDt.find(rowFinder);
		for (var i = 0; i < value.length; i++) {
			valueDt.remove(value[i].id);
		}
		if (choicesDt.find(rowFinder, true) == false) {
			if (Array.isArray(choices)) {
				choicesDt.add({value: val, display: val});
				}
			else if (choices.hasOwnProperty(val)) {
				choicesDt.add({value: val, display: choices[val]});
			}
		}
	}
}, webix.IdSpace, webix.ui.layout);
