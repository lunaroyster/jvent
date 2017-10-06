const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var eventMembershipSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    time: Date,
    overriddenPrivileges: [{
        name: String,
        value: Boolean
    }],
    roles: [String],
    // statusEffects: Array,
    statusEffects: [{
        name: String,
        data: Schema.Types.Mixed
    }],
    options: [String]
});

eventMembershipSchema.pre('save', function(next) {
    this.time = Date.now();
    next();
});

eventMembershipSchema.methods.setUser = function(user) {
    this.user = user._id;
};
eventMembershipSchema.methods.setEvent = function(event) {
    this.event = event._id;
};

eventMembershipSchema.methods.hasRole = function(role) {
    return(this.roles.indexOf(role)!=-1);
};
eventMembershipSchema.methods.addRole = function(...roles) {
    let addedRoles = [];
    for(let role of roles) {
        if(this.hasRole(role)) continue;
        this.roles.push(role);
        addedRoles.push(role);
    }
    return addedRoles;
};
eventMembershipSchema.methods.removeRole = function(...roles) {
    let removedRoles = [];
    for(let role of roles) {
        let index = this.roles.indexOf(role);
        if(index==-1) continue; //Or throw error?
        removedRoles.push(this.roles.splice(index, 1)[0]);
    }
    return removedRoles;
};
eventMembershipSchema.methods.removeAllRoles = function() {
    this.roles = [];
};

eventMembershipSchema.methods.hasPrivilege = function(privilegeName) {
    let overriddenPrivilege = this.overriddenPrivileges.find((privilege)=> {
        return privilege.name == privilegeName;
    });
    return overriddenPrivilege ? true:false;
};
eventMembershipSchema.methods.setPrivilege = function(...privileges) {
    for(let privilege of privileges) {
        //Validate privilege
        let oPIndex = this.overriddenPrivileges.findIndex(overriddenPrivilege=> {return overriddenPrivilege.name == privilege.name});
        //TODO: Validate privilege
        if(oPIndex==-1) {
            this.overriddenPrivileges.push(privilege);
        }
        else {
            this.overriddenPrivileges[oPIndex] = privilege;
        }
    }
};
eventMembershipSchema.methods.resetPrivilege = function(privilegeName) {
    let oPIndex = this.overriddenPrivileges.findIndex((overriddenPrivilege)=> {
        return overriddenPrivilege.name == privilegeName;
    });
    if(oPIndex!=-1) {
        this.overriddenPrivileges.splice(oPIndex, 1);
    }
};
eventMembershipSchema.methods.resetAllPrivileges = function() {
    if(this.overriddenPrivileges.length<1) return false;
    this.overriddenPrivileges = [];
    return true;
};

eventMembershipSchema.methods.hasOption = function(option) {
    return(this.options.indexOf(option)!=-1);
};
eventMembershipSchema.methods.addOption = function(...options) {
    let addedOptions = [];
    for(let option of options) {
        if(this.hasOption(option)) continue;
        this.options.push(option);
        addedOptions.push(option);
    }
    return addedOptions;
};
eventMembershipSchema.methods.removeOption = function(...options) {
    let removedOptions = [];
    for(let option of options) {
        let index = this.options.indexOf(option);
        if(index==-1) continue; //Again, throw error?
        removedOptions.push(this.options.splice(index, 1)[0]);
    }
    return removedOptions;
};
eventMembershipSchema.methods.removeAllOptions = function() {
    this.options = [];
};

eventMembershipSchema.methods.hasEffect = function(effectName) {
    let statusEffect = this.statusEffects.find((effect)=> {
        return effect.name == effectName;
    });
    return statusEffect ? true:false;
};
eventMembershipSchema.methods.setEffect = function(...effects) {
    for(let effect of effects) {
        let effectIndex = this.statusEffects.findIndex(eff=> {return eff.name == effect.name});
        //TODO: Validate effect
        if(effectIndex==-1) {
            this.statusEffects.push(effect);
        }
        else {
            this.statusEffects[effectIndex] = effect;
        }
    }
    if(effects.length>0) this.markModified('statusEffects');
};
eventMembershipSchema.methods.removeEffect = function(...effectNames) {
    let removedEffects = [];
    for(let effectName of effectNames) {
        let index = this.statusEffects.findIndex((statusEffect)=> {return statusEffect.name == effectName});
        if(index!=-1) {
            removedEffects.push(this.statusEffects.splice(index, 1));
        }
    }
    return removedEffects;
};
eventMembershipSchema.methods.removeAllEffects = function() {
    this.statusEffects = [];
};

mongoose.model('EventMembership', eventMembershipSchema);
