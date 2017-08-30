module.exports = {
    customValidators: {
        isVisibility: (value)=> {
            return (value=="public"||value=="unlisted"||value=="private");
        },
        isIngress: (value)=> {
            return (value=="everyone"||value=="link"||value=="invite");
        },
        isComment: (value)=> {
            return (value=="anyone"||value=="attendee"||value=="nobody");
        },
        isVoteDirection: (value)=> {
            return (value==-1||value==0||value==1);
        },
        isLink: (value)=> {
            var linkRegex = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
            return linkRegex.test(value);
        },
        exists: (value)=> {
            return value !== undefined;
        }
    }
};
