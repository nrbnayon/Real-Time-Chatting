"use client";

import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useDrop } from "react-dnd";
import { useGetTodosQuery } from "@/redux/services/todosApi";
import TodoItem, { ItemType } from "./TodoItem";
import update from "immutability-helper";

export default function TodoList() {
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const filter = useSelector((state) => state.todos.filter);
  const [todoList, setTodoList] = useState(todos);

  const [, drop] = useDrop({
    accept: ItemType.TODO,
  });

  const moveTodo = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedTodo = todoList[dragIndex];
      setTodoList(
        update(todoList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, draggedTodo],
          ],
        })
      );
    },
    [todoList]
  );

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center text-red-500 p-4'>
        Error loading todos: {error.message}
      </div>
    );
  }

  const filteredTodos = todoList.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true;
  });

  return (
    <div ref={drop} className='space-y-4'>
      {filteredTodos.map((todo, index) => (
        <TodoItem key={todo.id} todo={todo} index={index} moveTodo={moveTodo} />
      ))}
    </div>
  );
}
