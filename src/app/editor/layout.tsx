// app/editor/layout.tsx
import React from "react";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Topbar from "~/app/_components/mainTopbar";

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1">
        <Topbar user={session.user} />
        <main className="flex-1 p-4 bg-gray-100 min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}