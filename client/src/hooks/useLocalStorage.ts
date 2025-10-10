import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) setValue(JSON.parse(item));
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Examples

// Example 1: Store a string value in localStorage
// const [name, setName] = useLocalStorage<string>("username", "Guest");
// setName("Alice"); // Updates both state and localStorage

// Example 2: Store a number value in localStorage
// const [count, setCount] = useLocalStorage<number>("counter", 0);
// setCount(count + 1); // Increments the counter and saves to localStorage

// Example 3: Store an object in localStorage
// type User = { id: number; email: string };
// const [user, setUser] = useLocalStorage<User>("user", { id: 0, email: "" });
// setUser({ id: 1, email: "test@example.com" }); // Updates user in state and localStorage

// Example 4: Store an array in localStorage
// const [todos, setTodos] = useLocalStorage<string[]>("todos", []);
// setTodos([...todos, "Buy milk"]); // Adds a new todo and saves to localStorage
