const { User, Thought } = require("../models");
  
module.exports = {
    async getUsers(req, res) {
      try {
        const users = await User.find().populate('thoughts').populate('friends');
        res.json(users);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async getSingleUser(req, res) {
      try {
        const user = await User.findOne({ _id: req.params.userId })
          .select('-__v')
          .populate('thoughts')
          .populate('friends');
  
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }
  
        res.json(user);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async createUser(req, res) {
      try {
        const user = await User.create(req.body);
        res.json(user);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async updateUser(req, res) {
      try {
        const user = await User.findOneAndUpdate(
          { _id: req.params.userId },
          { $set: req.body },
          { new: true }
        );
  
        if (!user) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
  
        res.json(user);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async deleteUser(req, res) {
      try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });
  
        if (!user) {
          return res.status(404).json({ message: 'No such user exists' });
        }
  
        const thoughtDeleteResult = await Thought.deleteMany({ users: req.params.userId });
  
        if (!thoughtDeleteResult || thoughtDeleteResult.deletedCount === 0) {
          return res.status(404).json({
            message: 'User deleted, but no thoughts were found to delete',
          });
        }
  
        res.json({ message: 'User successfully deleted' });
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async updateFriendList(req, res, action) {
      const { userId, friendId } = req.params;
  
      try {
        const user = await User.findOneAndUpdate(
          { _id: userId },
          action === 'add' ? { $addToSet: { friends: friendId } } : { $pull: { friends: friendId } },
          { runValidators: true, new: true }
        );
  
        if (!user) {
          return res.status(404).json({ message: 'No user found with that ID' });
        }
  
        res.json(user);
      } catch (err) {
        handleError(res, err);
      }
    },
  
    async addFriend(req, res) {
      this.updateFriendList(req, res, 'add');
    },
  
    async removeFriend(req, res) {
      this.updateFriendList(req, res, 'remove');
    },
};
  