/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sync4c1/br2_mm_0002/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
