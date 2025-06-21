import JournalEntry from '../models/JournalEntry.js';

// Add
export const createEntry = async (req, res) => {
  const { content, mood } = req.body;
  try {
    const entry = new JournalEntry({
      userId: req.userId,
      content,
      mood
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create entry' });
  }
};

// Get
export const getEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
};

// Update
export const updateEntry = async (req, res) => {
  const { id } = req.params;
  const { content, mood } = req.body;
  try {
    const entry = await JournalEntry.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { content, mood },
      { new: true }
    );
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update entry' });
  }
};

// Delete
export const deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    await JournalEntry.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete entry' });
  }
};

