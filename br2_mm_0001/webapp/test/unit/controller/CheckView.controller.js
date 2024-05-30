/*global QUnit*/

sap.ui.define([
	"sync4c1/br2_mm_0001/controller/CheckView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CheckView Controller");

	QUnit.test("I should test the CheckView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
