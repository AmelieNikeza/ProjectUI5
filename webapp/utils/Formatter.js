sap.ui.define([], function () {
    "use strict";

    return {
        getDateForTable: function (sDate) {
            if (!sDate) {
                return "";
            }
            var dDate = new Date(sDate);
            if (isNaN(dDate.getDate())) {
                return sDate;
            }
            var sLanguage = "default";
            // Force english
            sLanguage = "en";
            return dDate.getDate() + " " + dDate.toLocaleString(sLanguage, { month: "long" }) + " " + dDate.getFullYear();
        }
    }
});