define(['module'], function(module) {

    var VimeoRequestModel = Backbone.Model.extends({
      dataLoadedEvent : "dataLoaded",
      dataNotLoadedEvent : "dataNotLoaded",



   });

   return VimeoRequestModel;
});	