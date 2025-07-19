import { Chats, User } from "@/context/AppContext";
import {
  CornerDownRight,
  CornerUpLeft,
  LogOut,
  MessageCircle,
  Plus,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  users: User[] | null;
  loggedInUser: User | null;
  chats: Chats[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleLogout: () => void;
}

const ChatSidebar = ({
  chats,
  loggedInUser,
  selectedUser,
  showAllUsers,
  sidebarOpen,
  users,
  setShowAllUsers,
  setSidebarOpen,
  handleLogout,
  setSelectedUser,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
    >
      {/* header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex justify-end sm:hidden mb-0">
          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 justify-between">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>

            <h2 className="text-xl font-bold text-white">
              {showAllUsers ? "New Chat" : "Messages"}
            </h2>
          </div>

          <button
            className={`p-2.5 rounded-lg transition-colors ${
              showAllUsers
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            onClick={() => setShowAllUsers((prev) => !prev)}
          >
            {showAllUsers ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* content */}
      <div className="flex-1 overflow-hidden px-4 py-2">
        {showAllUsers ? (
          <div className="space-y-4 h-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400"
              />
            </div>

            {/* users list */}
            <div className="space-y-2 overflow-y-auto h-full pb-4">
              {users
                ?.filter(
                  (user) =>
                    user._id !== loggedInUser?._id &&
                    user.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user) => (
                  <button
                    key={user._id}
                    className="w-full text-left p-4 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserCircle className="w-6 h-6 text-gray-300" />
                      </div>

                      {/* online symbol */}
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-white">
                          {user.name}
                        </span>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {/* show online offline text*/}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ) : chats && chats?.length > 0 ? (
          <div className="space-y-2 overflow-auto pb-4 h-full">
            {chats?.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const isSelected = selectedUser === chat.chat._id;
              const isSentByMe = latestMessage.sender === loggedInUser?._id;
              const unseenCount = chat.chat.unseenCount || 0;

              return (
                <button
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-blue-600 border border-blue-500"
                      : "border border-gray-700 hover:border-gray-600"
                  }`}
                  key={chat.chat._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);

                    setSidebarOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserCircle className="w-7 h-7 text-gray-300" />

                        {/* online user work */}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-semibold truncate ${
                            isSelected ? "text-white" : "text-gray-200"
                          }`}
                        >
                          {chat.user.name}
                        </span>
                        {unseenCount > 0 && (
                          <div
                            className="bg-red-600 text-white text-xs font-bold rounded-full min-w-[22px] h-5.5 flex items-center justify-center px-2"
                            aria-label={`${unseenCount} unseen messages`}
                            role="status"
                          >
                            {unseenCount > 99 ? "99+" : unseenCount}
                          </div>
                        )}
                      </div>
                      {latestMessage && (
                        <div className="flex items-center gap-3">
                          {isSentByMe ? (
                            <CornerUpLeft
                              size={14}
                              className="text-blue-400 shrink-0"
                            />
                          ) : (
                            <CornerDownRight
                              size={14}
                              className="text-green-400 shrink-0"
                            />
                          )}

                          <span className="text-xs text-gray-400 truncate flex-1">
                            {latestMessage.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="p-4 bg-gray-800 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </p>
            <p className="text-gray-400 font-medium">No conversation yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Start a new conversation to begin messaging
            </p>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="p-4 space-y-2 border-t border-gray-700">
        <Link
          href={"/profile"}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <div className="p-1.5 bg-gray-700 rounded-lg">
            <UserCircle className="w-4 h-4 text-gray-300" />
          </div>
          <span className="font-medium text-gray-300">Profile</span>
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 text-red-500 hover:text-white transition-colors"
          onClick={handleLogout}
        >
          <div className="p-1.5 bg-red-600 rounded-lg">
            <LogOut className="w-4 h-4 text-gray-300" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
