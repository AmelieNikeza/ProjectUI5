sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "training/utils/Formatter"
  ],
  function (Controller, Formatter) {
    "use strict";

    return Controller.extend("training.controller.BaseController", {
      formatter: Formatter,

      onPressHome: function (oEvent) {
        // Trigger navigation using router
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      }
    });
  }
);
