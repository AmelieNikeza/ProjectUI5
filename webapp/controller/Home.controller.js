sap.ui.define([
    "training/controller/BaseController.controller"
],
    function (BaseController) {
        "use strict";

        return BaseController.extend("training.controller.Home", {
            onInit: function () {

            },

            onSearchProject: function (oEvent) {
                var oFilter;
                // Get searched value
                var sValue = oEvent.getParameter("query");
                if (sValue) {
                    // Convert searched value to upper case
                    sValue = sValue.toUpperCase();
                    // Create filter on project code 
                    oFilter = new sap.ui.model.Filter({
                        path: "ProjectCode",
                        operator: sap.ui.model.FilterOperator.Contains,
                        value1: sValue
                    });
                }
                
                // Get and apply filter applied with quick filter dialog
                var oQuickFilter;
                var oFilterList = this.byId("idQuickFilterList");
                if (oFilterList) {
                    oQuickFilter = this.getFilterFromQuickFilterList(oFilterList.getSelectedItem());
                }
                if (oQuickFilter) {
                    if (oFilter) {
                        oFilter = new sap.ui.model.Filter({
                            filters: [oQuickFilter, oFilter],
                            and: true /* true means AND, false means OR */
                        });
                    } else {
                        oFilter = oQuickFilter;
                    }
                }

                // Filter items of the table with ProjectCode filter if value passed, or with no filter
                this.byId("idTableProject").getBinding("items").filter(oFilter);
            },

            onPressFilter: function () {
                // Get filter dialog
                var oDialog = this.byId("idFilterDialog");
                if (!oDialog) {
                    // Create dialog via fragment if first loading
                    oDialog = sap.ui.xmlfragment(this.getView().getId(), "training.fragment.Filter", this);
                    this.getView().addDependent(oDialog);
                }
                // Open dialog
                oDialog.open();
            },

            onItemPressFilter: function (oEvent) {
                var oFilterChosen = oEvent.getParameter("listItem");
                var oFilter = this.getFilterFromQuickFilterList(oFilterChosen);

                // Filter items of the table with ProjectCode filter if value passed, or with no filter
                this.byId("idTableProject").getBinding("items").filter(oFilter);

                // Clear search field
                this.byId("idSearchField").setValue("");

                // Close filter pop-up
                this.byId("idFilterDialog").close();
            },

            getFilterFromQuickFilterList: function (oListItem) {
                var sTitle = oListItem.getTitle();
                var oI18n = this.getView().getModel("i18n").getResourceBundle();
                var oFilter;
                switch (sTitle) {
                    case oI18n.getText("filterAll"):
                        break;
                    case oI18n.getText("filterBig"):
                        oFilter = new sap.ui.model.Filter({
                            path: "ProjectDuration",
                            operator: sap.ui.model.FilterOperator.GE,
                            value1: 300
                        });
                        break;
                    case oI18n.getText("filterShort"):
                        oFilter = new sap.ui.model.Filter({
                            path: "ProjectDuration",
                            operator: sap.ui.model.FilterOperator.LE,
                            value1: 100
                        });
                        break;
                }
                return oFilter;
            },

            onPressCancel: function () {
                this.byId("idFilterDialog").close();
            },

            onPressProject: function (oEvent) {
                // Get clicked project path
                var sPath = oEvent.getSource().getBindingContext("data").getPath();
                // Build parameter for navigation
                var sProject = sPath.replaceAll("/", "_");

                // Trigger navigation using router
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteProject", {"project": sProject});
            },

            onPressCreate: function () {
                // Get filter dialog
                var oDialog = this.byId("idCreateDialog");
                if (!oDialog) {
                    // Create dialog via fragment if first loading
                    oDialog = sap.ui.xmlfragment(this.getView().getId(), "training.fragment.Create", this);
                    this.getView().addDependent(oDialog);
                }
                // Open dialog
                oDialog.open();
            },

            onPressCancelCreate: function () {
                this.byId("idCreateDialog").close();
            },

            onPressSave: function () {
                var sCode = this.byId("idCreateProjectCode").getValue();
                if (!sCode) {
                    this.byId("idCreateProjectCode").setValueState("Error");
                    sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("errorMessage"));
                    return;
                }

                // Build new id number for project
                var oModel = this.getView().getModel("data");
                var aProject = oModel.getProperty("/ETProjectSet");
                var iProjectID = aProject.length + 1;


                var sDescription = this.byId("idCreateProjectDesc").getValue();
                var sLeader = this.byId("idCreateProjectLead").getValue();
                var iDuration = this.byId("idCreateProjectDuration").getValue();
                var dDateValue = this.byId("idCreateProjectEndDate").getDateValue();

                // Format in JSON new entry to add in model
                var oNewProject = {
                    "ProjectID": iProjectID.toString(),
                    "ProjectCode": sCode,
                    "ProjectDescription": sDescription,
                    "ProjectLeader": sLeader,
                    "TechnicalResponsible" : "",
                    "CurrentRelease" : "NEW",
                    "ProjectDuration" : iDuration,
                    "EndDate" : dDateValue ? dDateValue.toLocaleString() : "None",
                    "SAPSystem" : "",
                    "Hyperlink" : "",
                    "NTeamMembers" : []
                };

                // Add new entry in JSON model
                aProject.push(oNewProject);
                oModel.setProperty("/ETProjectSet", aProject);

                // Close create dialog
                this.byId("idCreateDialog").close();
            },

            onChangeCreateCode: function () {
                this.byId("idCreateProjectCode").setValueState("None");
                this.byId("idCreateProjectCode").setValue(this.byId("idCreateProjectCode").getValue().toUpperCase());
            }
        });
    });
