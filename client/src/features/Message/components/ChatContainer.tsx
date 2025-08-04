import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  type UIEvent,
} from "react";
import assets from "../../../assets/assets";
import { formatMessageTime } from "../../../utility";
import { ChatContext } from "../../../context/ChatContext";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext)!;
  const { authUser, onlineUser } = useContext(AuthContext)!;

  const [input, setInput] = useState("");
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const prevMessagesLength = useRef<number>(0);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    const newMessageDelta = messages.length - prevMessagesLength.current;

    if (!isScrolledUp) {
      scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
      setNewMessagesCount(0);
    } else if (newMessageDelta > 0) {
      setNewMessagesCount((prev) => prev + newMessageDelta);
    }

    prevMessagesLength.current = messages.length;
  }, [messages]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const threshold = 120;
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight <
      threshold;

    setIsScrolledUp(!isAtBottom);

    if (isAtBottom) {
      setNewMessagesCount(0);
    }
  };

  const scrollToBottom = () => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    setNewMessagesCount(0);
    setIsScrolledUp(false);
  };

  const handleSendMessage = async (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLImageElement>
  ) => {
    e.preventDefault();
    if ("key" in e && e.key !== "Enter") return;
    if (input.trim() === "") return;

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result as string });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const formatMessageLabel = () => {
    if (newMessagesCount === 1) return "↓ 1 message";
    if (newMessagesCount >= 2 && newMessagesCount <= 4)
      return `↓ +${newMessagesCount - 1} message`;
    if (newMessagesCount > 4) return "↓ +4 messages";
    return "";
  };

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUser.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="user"
          className="md:hidden max-w-7"
        />
        <img
          src={assets.help_icon}
          alt="help"
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* Chat Area */}
      <div
        className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6"
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser?._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="msg"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 bg-violet-500/30 text-white ${
                  msg.senderId === authUser?._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser?._id
                    ? authUser.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt="profile image"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Scroll-to-bottom Indicator */}
      {newMessagesCount > 0 && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-[80px] left-1/2 transform -translate-x-1/2 bg-violet-600 text-white px-3 py-1 text-sm rounded-full shadow-md animate-bounce truncate max-w-[200px]"
        >
          {formatMessageLabel()}
        </button>
      )}

      {/* Bottom Input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="image"
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="button"
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="logo" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
