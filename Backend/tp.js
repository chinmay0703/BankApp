app.put('/updatedata/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const updatedData = req.body;
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contactId format' });
        }
        const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });
        if (updatedContact) {
            res.json({ message: 'Contact updated successfully', updatedContact });

        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});