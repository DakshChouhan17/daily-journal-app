import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
  content: {
    type: String,
    required: true
},
  mood: {
    type: String
},
  date: {
    type: Date,
    default: Date.now
}
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
