import { useState } from 'react'
import './App.css'
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./app/store";
import {
  decrement,
  increment,
  incrementByAmount,
  reset,
} from "./features/counterSlice";
import { useQuery } from "react-query";

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

function App() {
  // const [count, setCount] = useState(0)
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch<AppDispatch>();


      const { isLoading, isError, data } = useQuery<User[]>(
        "users",
        fetchUsers
      );

      if (isLoading || !data) {
        return <div>Loading users...</div>;
      }

      if (isError) {
        return <div>Error fetching users</div>;
      }
  return (
    <div className="App">
      <div>{count}</div>
      <button onClick={() => dispatch(increment())}>Artır</button>
      <button onClick={() => dispatch(decrement())}>Azalt</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
      <button onClick={() => dispatch(incrementByAmount(10))}>
        Increment by 10
      </button>
      <div>
        <h1>User List</h1>
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              <div>Name: {user.name}</div>
              <div>Email: {user.email}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App
