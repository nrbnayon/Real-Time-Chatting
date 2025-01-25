import AddTodo from "@/components/AddTodo";
import { SignupFormDemo } from "@/components/Auth/SignupFormDemo";
import FilterBar from "@/components/FilterBar";
import TodoList from "@/components/TodoList";
import { CheckSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckSquare className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Task Master</h1>
          <p className="text-muted-foreground">
            Organize your tasks efficiently and boost your productivity
          </p>
        </div>
        <SignupFormDemo />
        <AddTodo />
        <FilterBar />
        <TodoList />
      </div>
    </div>
  );
}
