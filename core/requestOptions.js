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
        },
        isLink: function(value) {
            var linkRegex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
            return value.match(linkRegex);
        }
    }
};
