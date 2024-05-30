/*global QUnit*/

sap.ui.define([
	"sync4c1/br2_mm_0002/controller/PurorderView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PurorderView Controller");

	QUnit.test("I should test the PurorderView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
