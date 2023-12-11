sap.ui.define([
    "training/controller/BaseController.controller"
],
    function (BaseController) {
        "use strict";

        return BaseController.extend("training.controller.Skills", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteSkills").attachPatternMatched(this._onPatternMatched, this);
            },

            _onPatternMatched: function (oEvent) {
                var sUser = oEvent.getParameter("arguments").user;
                var sPath = "/ETUserSet/" + sUser;
                this.getView().bindElement({ path: sPath, model: "data" });

                var sProject = oEvent.getParameter("arguments").project;
                if (sProject) {
                    this.getView().getModel("data").setProperty("/Project", sProject);
                } else {
                    this.getView().getModel("data").setProperty("/Project", "");
                }
            },

            onChangeRanking: function () {
                // This is an exception of Two way binding. Data change in model is not reflected
                // in chart display. Rebind chart to get data update
                this.byId("idVizFrame").getDataset().bindData({
                    path: "data>NRanking"
                });
            },

            onPressEmail: function (oEvent) {
                var sMail = oEvent.getSource().getText();
                sap.m.URLHelper.triggerEmail(sMail);
            },

            onPressProject: function (oEvent) {
                var sProjectCode = oEvent.getSource().getText();
                var aProject = this.getView().getModel("data").getProperty("/ETProjectSet");
                var sProject = "";
                for (var i = 0; i < aProject.length; i++) {
                    if (aProject[i].ProjectCode === sProjectCode) {
                        sProject = "_ETProjectSet_" + i;
                    }
                }
                // Trigger navigation using router
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteProject", {"project": sProject});
            }
        });
    });
