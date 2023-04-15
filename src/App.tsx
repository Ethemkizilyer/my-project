import { useEffect, useState } from "react";
import "./App.css";
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
import languages from "./data/languages.json";
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
  const [usage, setUsage] = useState("?");
  const [text, setText] = useState("");
  const [cevir, setCevir] = useState("");
  const [dil, setDil] = useState({ ilk: "tr", son: "en" });

  const apiKey = import.meta.env.VITE_API_KEY;

  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  const translateText = async () => {
    const url = "https://text-translator2.p.rapidapi.com/translate";

    const headers = {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": "text-translator2.p.rapidapi.com",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const params = new URLSearchParams();
    params.append("source_language", `${dil.ilk}`);
    params.append("target_language", `${dil.son}`);
    params.append("text", `${text}`);

    try {
      const response = await axios.post(url, params, { headers });
      setUsage(response.headers["x-ratelimit-characters-remaining"]);
      setCevir(response.data.data.translatedText);
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const { isLoading, isError, data } = useQuery<User[]>("users", fetchUsers);

  if (isLoading || !data) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Error fetching users</div>;
  }

  const cevirt = () => {
    translateText();
  };

  return (
    <div className="App">
      <p>Kalan kullanım: {usage} karakter</p>
      <div style={{ marginBottom: "5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <select
              name=""
              id=""
              value={dil.ilk}
              onChange={(e) => setDil({ ...dil, ilk: e.target.value })}
            >
              {languages
                .filter((item) => item.code != dil.son)
                .map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {" "}
                    {lang.name}
                  </option>
                ))}
            </select>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
          <div style={{ fontSize: "2rem" }}>⇒</div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <select
              name=""
              id=""
              onChange={(e) => setDil({ ...dil, son: e.target.value })}
              value={dil.son}
            >
              {languages
                .filter((item) => item.code != dil.ilk)
                .map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {" "}
                    {lang.name}
                  </option>
                ))}
            </select>
            <textarea
              defaultValue={cevir}
              // onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>
        </div>
        <button onClick={cevirt}>Çevir</button>
      </div>
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

export default App;
