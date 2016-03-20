module.exports = {
    
    toastMessage: function(flash) {
        var thereAreFlash = (typeof flash !== 'undefined');
        var thereAreFlashWithError =  thereAreFlash && (!!flash.err);
        var thereAreFlashWithSuccess =  thereAreFlash && (!!flash.success);
        var flashField = "";
        
        if(thereAreFlash && (thereAreFlashWithError  || thereAreFlashWithSuccess)) {
            
            if(thereAreFlashWithError){
                flashField = "err";
                var toastMessages = "";
                Object.keys(flash[flashField]).forEach(function(key) { 
                    var messages = flash[flashField][key].message;
                    Object.keys(messages).forEach(function(field) {
                        var messageField = JSON.stringify(messages[field][0].message);
                        toastMessages = toastMessages +  'Materialize.toast(' + messageField + ', 4000);';
                    });
                });	
            }
            else if(thereAreFlashWithSuccess){
                flashField = "success";
                var toastMessages = "";
                Object.keys(flash[flashField]).forEach(function(key) {
                        var messages = flash[flashField][key].message;
                        var messageField = JSON.stringify(messages);
                        toastMessages = toastMessages +  'Materialize.toast(' + messageField + ', 4000);';
                });
            }
            
            return toastMessages;
        }
    },
    
    getValueAfterReloadByField: function(flash,field) {
        var thereAreFlashWithParams = (typeof flash !== 'undefined') && (!!flash.params);
        if(thereAreFlashWithParams){
            return flash.params[field];
        }
        return "";
    },
    
    validate: function(flash,field) {
        var myResult = {
                isValid: true,
                message: "",
            };
            
        var thereAreFlashWithError = (typeof flash !== 'undefined') && (!!flash.err);

        if(thereAreFlashWithError){
            var thereAreTheFieldInFlashError = (typeof JSON.stringify(flash.err[0].message[field]) !== 'undefined');
            var thereAreErrorInTheField = thereAreTheFieldInFlashError && (typeof JSON.stringify(flash.err[0].message[field][0].message) !== 'undefined');
            
            myResult.isValid = !thereAreTheFieldInFlashError && !thereAreErrorInTheField,
            myResult.message = (thereAreErrorInTheField || "") && JSON.stringify(flash.err[0].message[field][0].message)
            
            return myResult
        }
		return myResult;
    }
};