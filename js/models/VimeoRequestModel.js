define(['module'], function(module) {

    Backbone.emulateHTTP = true;
    var VimeoRequestModel = Backbone.Model.extend({
       dataLoadedEvent    : "dataLoaded",
       dataNotLoadedEvent : "dataNotLoaded",
     
       urlRoot : 'http://vimeo.com/api/v2/',
     
       initialize : function () {
          this.config = module.config();
       },

       getUrl : function () {
       	  return this.urlRoot + this.config.userName + '/videos.json';
       },

       fetchData : function () {
            this.fetch({
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

        trimBySettings : function(response) {
           return _.shuffle(response).splice(0,this.config.maxVideoCount); 
        }
   });

   return VimeoRequestModel;
});	