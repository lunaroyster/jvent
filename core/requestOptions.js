module.exports = {
    customValidators: {
        isVisibility: function(value) {
            if(value=="public"||value=="unlisted"||value=="private") {
                return(true);
            }
            else {
                return(false);
            }
        },
        isIngress: function(value) {
            if(value=="everyone"||value=="link"||value=="invite") {
                return(true);
            }
            else {
                return(false);
            }
        }
    }
};