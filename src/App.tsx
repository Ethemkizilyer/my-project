import { useEffect, useState } from 'react'
import './App.css'
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "./app/store";
 import axios, { AxiosRequestConfig } from "axios";
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

 

  const translateText = async () => {
    const requestData = {
      text: "Merhaba Dünya!",
      source_language: "tr",
      target_language: "en",
    };
    const headers = {
      "x-rapidapi-key": "00d41e70a2mshe65f808187f1a2cp117c6cjsn6b27cfecc6c3",
      "x-rapidapi-host": "text-translator2.p.rapidapi.com",
      "Content-Type": "application/json",
    };

    const config: AxiosRequestConfig = {
      url: "https://text-translator2.p.rapidapi.com/translate",
      method: "POST",
      headers: headers,
      data: requestData,
    };

    try {
      const response = await axios(config);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    translateText()
  },[])


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
