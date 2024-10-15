"use client";

import { useUser } from "@/context/user";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AuthForm() {
  const user = useUser();

  const [emailOrUserName, setEmailOrUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [isLogin, setIsLogin] = useState(true);

  const login = () => {
    user.actions.login(
      emailOrUserName,
      password,
      () => {},
      () => {}
    );
    console.log({
      emailOrUserName,
      password,
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      login();
    }
    //TODO add register
  };

  if (user.token) {
    return <Button onClick={user.actions.logout}>Logout</Button>;
  }
  return (
    <form onSubmit={onSubmit}>
      <Input
        placeholder="Email"
        type="email"
        value={emailOrUserName}
        onChange={(e) => setEmailOrUserName(e.target.value as string)}
      />
      <Input
        placeholder="********"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value as string)}
      />
      {/* TODO add name handling */}
      <Button variant="default">{!isLogin ? "Register" : "Login"}</Button>
      <span> or </span>
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Register" : "Login"}
      </Button>
    </form>
  );
}
