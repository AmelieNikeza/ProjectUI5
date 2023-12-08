sap.ui.define([
    "training/controller/BaseController.controller"
],
    function (BaseController) {
        "use strict";

        return BaseController.extend("training.controller.Project", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteProject").attachPatternMatched(this._onPatternMatched, this);
            },

            _onPatternMatched: function (oEvent) {
                var sProject = oEvent.getParameter("arguments").project;
                var sPath = sProject.replaceAll("_", "/");
                this.getView().bindElement({path: sPath, model: "data"});
            },

            onPressSkills: function (oEvent) {
                // Get clicked user path
                var oBindingContext = oEvent.getSource().getBindingContext("data");
                // Build parameter for navigation
                var sUser = oBindingContext.getProperty("UserID");
                var sProject = this.getView().getBindingContext("data").getProperty("ProjectCode");

                // Trigger navigation using router
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteSkills", {"user": sUser, "project": sProject});
            },

            onPressHyperlink: function (oEvent) {
                var sHyperlink = oEvent.getSource().getText();
                window.open(sHyperlink);
            }
        });
    });
