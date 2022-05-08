import React from "react";
import { convertTimestampToDate } from "utils/convertDate";
import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";
import {
  BookmarkFillIcon,
  BookmarkOutlineIcon,
  CommentIcon,
  DeleteIcon,
  LikeFillIcon,
  LikeOutlineIcon,
} from "assets";
import { useNavigate } from "react-router-dom";
import {
  addPostToBookmarks,
  removePostToBookmarks,
  updateArrayOfPost,
  deletePost,
} from "services/firebase-services";

const PostCard = ({ post, currentUserDetails }) => {
  const navigate = useNavigate();

  const {
    _id,
    content,
    createdAt,
    likedByUsers,
    bookmarkedByUsers,
    commentsCount,
    userName,
    asset,
  } = post;

  return (
    <div
      className="card-wrapper post-card rounded-md my-5 border-2 border-gray-300 p-4 pb-3 cursor-pointer"
      onClick={() => navigate(`/post/${_id}`)}
    >
      <header className="flex justify-between">
        <h4 className="font-bold ">@{userName}</h4>
        {currentUserDetails?.userName === userName && (
          <DeleteIcon
            className="delete-post-icon cursor-pointer text-red-600 invisible"
            size={20}
            onClick={(e) => {
              e.stopPropagation();
              deletePost(_id, asset);
            }}
          />
        )}
      </header>
      <p className="text-xs mt-1 pl-px">{convertTimestampToDate(createdAt)}</p>
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
        {asset && (
          <div onClick={(e) => e.stopPropagation()}>
            {asset.assetType === "video" ? (
              <video
                className="video m-auto rounded-md"
                src={asset.assetUrl}
                controls
              />
            ) : (
              <a
                href={asset.assetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img className="rounded" src={asset.assetUrl} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-2 border-t-2 border-gray-200">
        <div className="flex items-center">
          {likedByUsers.includes(currentUserDetails.userName) ? (
            <LikeFillIcon
              className="cursor-pointer"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                updateArrayOfPost(
                  _id,
                  currentUserDetails.userName,
                  "likedByUsers",
                  "remove"
                );
              }}
            />
          ) : (
            <LikeOutlineIcon
              className="cursor-pointer"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                updateArrayOfPost(
                  _id,
                  currentUserDetails.userName,
                  "likedByUsers",
                  "add"
                );
              }}
            />
          )}
          <span className="text-md ml-4">{likedByUsers.length}</span>
        </div>
        <div
          className="flex items-center"
          onClick={() => navigate(`/post/${_id}`)}
        >
          <CommentIcon className="cursor-pointer" size={18} />{" "}
          <span className="text-md ml-4">{commentsCount}</span>
        </div>
        {bookmarkedByUsers.includes(currentUserDetails.userName) ? (
          <BookmarkFillIcon
            size={17}
            onClick={(e) => {
              e.stopPropagation();
              removePostToBookmarks(currentUserDetails, post._id);
            }}
          />
        ) : (
          <BookmarkOutlineIcon
            size={17}
            onClick={(e) => {
              e.stopPropagation();
              addPostToBookmarks(currentUserDetails, post._id);
            }}
          />
        )}
      </div>
    </div>
  );
};

export { PostCard };
