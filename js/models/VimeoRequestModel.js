define(['module'], function(module) {

    var VimeoRequestModel = Backbone.Model.extend({
       dataLoadedEvent    : "dataLoaded",
       dataNotLoadedEvent : "dataNotLoaded",
     
       urlRoot : _.template("http://vimeo.com/api/v2/<%= userName %>/videos.json"),
     
       initialize : function () {
          this.config = module.config();
       },

       getUrl : function () {
       	  return this.urlRoot(this.config);
       },

       fetchData : function () {
            this.save({}, {
                url     : this.getUrl(),
                success : this.successCallback,
                error   : this.errorCallback
            });
        },

        parse : function (response) {
            return {};
        },

        successCallback : function (model, response) {
            model.trigger(model.dataLoadedEvent, response);
        },

        errorCallback : function (model, response) {
            model.trigger(model.dataNotSavedEvent);
        },
   });

   return VimeoRequestModel;
});	