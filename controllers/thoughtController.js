const { Thought, User } = require("../models");

const handleError = (res, error) => {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  };
  
  module.exports = {
    async getThoughts(req, res) {
      try {
        const thoughts = await Thought.find().populate('username');
        res.json(thoughts);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async getSingleThought(req, res) {
      try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v')
          .populate('username');
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
  
        res.json(thought);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async createThought(req, res) {
      try {
        const thought = await Thought.create(req.body);
        res.json(thought);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async updateThought(req, res) {
      try {
        const thought = await Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
          { $set: req.body },
          { new: true }
        );
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
  
        res.json(thought);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async deleteThought(req, res) {
      try {
        const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
  
        if (!thought) {
          return res.status(404).json({ message: 'No such thought exists' });
        }
  
        res.json({ message: 'Thought successfully deleted' });
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async addUserToThought(req, res) {
      const { thoughtId, userId } = req.params;
  
      try {
        const thought = await Thought.findByIdAndUpdate(
          thoughtId,
          { $addToSet: { users: userId } },
          { new: true }
        ).populate('username');
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with that ID' });
        }
  
        res.json(thought);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async removeUserFromThought(req, res) {
      const { thoughtId, userId } = req.params;
  
      try {
        const thought = await Thought.findByIdAndUpdate(
          thoughtId,
          { $pull: { users: userId } },
          { new: true }
        ).populate('username');
  
        if (!thought) {
          return res.status(404).json({ message: 'No thought found with that ID' });
        }
  
        res.json(thought);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async createReaction(req, res) {
      const { thoughtId } = req.params;
      const { reactionBody, username } = req.body;
  
      try {
        const updatedThought = await Thought.findByIdAndUpdate(
          thoughtId,
          { $push: { reactions: { reactionBody, username } } },
          { new: true }
        ).populate('username');
  
        if (!updatedThought) {
          return res.status(404).json({ message: 'No thought found with that ID' });
        }
  
        res.json(updatedThought);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async deleteReaction(req, res) {
      const { thoughtId, reactionId } = req.params;
  
      try {
        const updatedThought = await Thought.findByIdAndUpdate(
          thoughtId,
          { $pull: { reactions: { _id: reactionId } } },
          { new: true }
        ).populate('username');
  
        if (!updatedThought) {
          return res.status(404).json({ message: 'No thought found with that ID' });
        }
  
        res.json(updatedThought);
      } catch (err) {
        handleError(res, err);
      }
    },
  };
  