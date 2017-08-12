var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    loc: {
        'type': {
            type: String,
            required: true,
            default: 'Point'
        },
        coordinates: [
            {
                type: [Number]
            }
        ]
    },
    time: {
        creation:  {
            type: Date
        },
        update: {
            type: Date
        }
    }
});

locationSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
    }
    next();
});

mongoose.model('Location', locationSchema);
