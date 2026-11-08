const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

// GET all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();

    res.json(todos);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

// CREATE a todo
router.post("/", async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title
    });

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

// UPDATE a todo
router.put("/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        completed: req.body.completed
      },
      { new: true }
    );

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

// DELETE a todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      message: "Todo deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong"
    });
  }
});

module.exports = router;