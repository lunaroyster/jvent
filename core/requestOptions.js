module.exports = {
    customValidators: {
        isVisibility: function(value) {
            return (value=="public"||value=="unlisted"||value=="private");
        },
        isIngress: function(value) {
            return (value=="everyone"||value=="link"||value=="invite");
        },
        isCommentSetting: function(value) {
            return (value=="anyone"||value=="attendee"||value=="nobody");
        }
    }
};