'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { setFilter } from '@/redux/features/todosSlice';

export default function FilterBar() {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state) => state.todos.filter);

  return (
    <div className="flex justify-center space-x-2 mb-6">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => dispatch(setFilter('all'))}
      >
        All
      </Button>
      <Button
        variant={currentFilter === 'completed' ? 'default' : 'outline'}
        onClick={() => dispatch(setFilter('completed'))}
      >
        Completed
      </Button>
      <Button
        variant={currentFilter === 'incomplete' ? 'default' : 'outline'}
        onClick={() => dispatch(setFilter('incomplete'))}
      >
        Incomplete
      </Button>
    </div>
  );
}