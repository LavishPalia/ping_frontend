"use client";
import Loading from "@/components/Loading";
import { useAppData } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChatPage = () => {
  const { isAuth, loading } = useAppData();

  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) router.push("/login");
  }, [isAuth, loading, router]);

  if (loading) return <Loading />;

  return <div>ChatPage</div>;
};

export default ChatPage;
