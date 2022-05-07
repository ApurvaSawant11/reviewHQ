import React from "react";
import { useAuth, useData } from "context";
import { convertTimestampToDate } from "utils/convertDate";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";
import {
  BookmarkOutlineIcon,
  CommentIcon,
  DeleteIcon,
  LikeOutlineIcon,
} from "assets";
import { useNavigate } from "react-router-dom";

const PostCard = () => {
  const { posts } = useData();
  const navigate = useNavigate();
  const { currentUserDetails } = useAuth();

  return (
    <article className="text-left flex flex-col items-center">
      {posts.map(
        (
          { _id, content, createdAt, likesCount, commentsCount, userName },
          index
        ) => (
          <div
            className="card-wrapper post-card rounded-md my-5 border-2 border-gray-300 p-4 pb-3 cursor-pointer"
            key={index}
            onClick={() => navigate(`/post/${_id}`)}
          >
            <header className="flex justify-between">
              <h4 className="font-bold ">@{userName}</h4>
              {currentUserDetails?.userName === userName && (
                <DeleteIcon
                  className="delete-post-icon cursor-pointer text-red-600 invisible"
                  size={20}
                />
              )}
            </header>
            <p className="text-xs mt-1 pl-px">
              {convertTimestampToDate(createdAt)}
            </p>
            <div className="whitespace-pre-wrap mt-4">
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <SecureLink
                    className="text-indigo-700 "
                    href={decoratedHref}
                    key={key}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {decoratedText}
                  </SecureLink>
                )}
              >
                {content}
              </Linkify>
            </div>

            <div className="flex items-center justify-between mt-4 pt-2 border-t-2 border-gray-200">
              <div className="flex items-center">
                <LikeOutlineIcon className="cursor-pointer" size={20} />
                <span className="text-md ml-4">{likesCount}</span>
              </div>
              <div
                className="flex items-center"
                onClick={() => navigate(`/post/${_id}`)}
              >
                <CommentIcon className="cursor-pointer" size={18} />{" "}
                <span className="text-md ml-4">{commentsCount}</span>
              </div>
              <BookmarkOutlineIcon size={17} />
            </div>
          </div>
        )
      )}
    </article>
  );
};

export { PostCard };
