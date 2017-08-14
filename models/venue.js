var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var venueSchema = new Schema({
    name: String,
    //Full address
    location: {
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
    //Map entities
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }, // Temporary. Venues are independant from events.
    time: {
        creation:  {
            type: Date
        },
        update: {
            type: Date
        }
    }
});

venueSchema.pre('save', function(next) {
    if(this.isNew) {
        this.time.creation = Date.now();
    }
    next();
});

mongoose.model('Venue', venueSchema);
