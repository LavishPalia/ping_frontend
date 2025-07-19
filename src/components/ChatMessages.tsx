import { Message } from "@/app/chat/page";
import { User } from "@/context/AppContext";
import React, { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInUser: User | null;
}

const ChatMessages = ({
  selectedUser,
  messages,
  loggedInUser,
}: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // TODO: seen feature
  const uniqueMessages = useMemo(() => {
    if (!messages) return [];

    const seen = new Set();

    return messages.filter((message) => {
      if (seen.has(message._id)) return false;

      seen.add(message._id);
      return true;
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, uniqueMessages]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full max-h-[calc(100vh-215px)] overflow-y-auto p-2 space-y-2 custom-scroll">
        {!selectedUser ? (
          <p className="text-gray-400 mt-20 text-center">
            Select a user to start chatting 📩
          </p>
        ) : (
          <>
            {uniqueMessages.map((message, i) => {
              const isSentByMe = message.sender === loggedInUser?._id;
              const uniqueKey = `${message._id}-${i}`;

              return (
                <div
                  className={`flex flex-col gap-2 mt-2 ${
                    isSentByMe ? "items-end" : "items-start"
                  }`}
                  key={uniqueKey}
                >
                  <div
                    className={`rounded-lg p-3 max-w-sm ${
                      isSentByMe
                        ? "bg-blue-600 text-white"
                        : " bg-gray-700 text-white"
                    }`}
                  >
                    {message.messageType === "image" && message.image && (
                      <div className="relative group">
                        <img
                          src={message.image.url}
                          alt="shared image"
                          className="max-w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    {message.text && <p className="mt-1">{message.text}</p>}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs text-gray-400 ${
                      isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"
                    }`}
                  >
                    <span>
                      {moment(message.createdAt).format("hh:mm A . MMM DD")}
                    </span>

                    {isSentByMe && (
                      <div className="flex items-center ml-1">
                        {message.seen ? (
                          <div className="flex items-center gap-1 text-blue-400">
                            <CheckCheck className="w-3 h-3" />
                            {message.seenAt && (
                              <span>
                                {moment(message.seenAt).format("hh:mm A")}
                              </span>
                            )}
                          </div>
                        ) : (
                          <Check className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;
