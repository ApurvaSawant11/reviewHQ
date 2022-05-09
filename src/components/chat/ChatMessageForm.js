import { AttachmentIcon } from "assets";
import React from "react";
import { toast } from "react-toastify";

const ChatMessageForm = ({ handleSubmit, text, setText, setImage }) => {
  return (
    <form
      className="message-form flex items-center absolute"
      onSubmit={handleSubmit}
    >
      <label htmlFor="img">
        <AttachmentIcon />
      </label>
      <input
        onChange={(e) => {
          setImage(e.target.files[0]);
          toast.success("Image selected...", { position: "top-right" });
        }}
        type="file"
        id="img"
        className=""
        accept="image/*"
        style={{ display: "none" }}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          className="outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btn py-2 px-4 rounded border-2 border-indigo-700 hover:bg-primary hover:text-white">
          Send
        </button>
      </div>
    </form>
  );
};

export { ChatMessageForm };
