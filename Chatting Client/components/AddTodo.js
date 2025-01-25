"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useAddTodoMutation } from "@/redux/services/todosApi";
import toast from "react-hot-toast";

export default function AddTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addTodo, { isLoading, isError, error }] = useAddTodoMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      const result = await addTodo({
        title,
        description: description || undefined,
        completed: false,
      }).unwrap();

      // Clear form on successful submission
      setTitle("");
      setDescription("");

      toast.success("Todo added successfully");
    } catch (err) {
      console.error("Failed to add todo:", err);
      toast.error("Failed to add todo. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 mb-8'>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Add a new task...'
        className='w-full'
        disabled={isLoading}
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder='Add a description (optional)'
        className='w-full'
        disabled={isLoading}
      />
      <Button type='submit' className='w-full' disabled={isLoading}>
        {isLoading ? (
          "Adding..."
        ) : (
          <>
            <Plus className='h-4 w-4 mr-2' />
            Add Task
          </>
        )}
      </Button>

      {isError && (
        <div className='text-red-500 text-sm'>
          Error: {error?.message || "Something went wrong"}
        </div>
      )}
    </form>
  );
}
