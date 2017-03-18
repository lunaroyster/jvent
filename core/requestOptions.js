module.exports = {
    customValidators: {
        isVisibility: function(value) {
            return (value=="public"||value=="unlisted"||value=="private");
        },
        isIngress: function(value) {
            return (value=="everyone"||value=="link"||value=="invite");
        },
        isComment: function(value) {
            return (value=="anyone"||value=="attendee"||value=="nobody");
        },
        isVoteDirection: function(value) {
            return (value==-1||value==0||value==1);
        }
    }
};