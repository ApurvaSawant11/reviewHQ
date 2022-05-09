import React from "react";
import { convertTimestampToDate } from "utils/convertDate";
import {
  BookmarkOutlineIcon,
  CommentIcon,
  DeleteIcon,
  LikeOutlineIcon,
  BookmarkFillIcon,
  LikeFillIcon,
} from "assets";
import {
  addPostToBookmarks,
  removePostToBookmarks,
  updateArrayOfPost,
  deletePost,
} from "services/firebase-services";
import { useParams } from "react-router-dom";
import { useAuth, useData } from "context";
import { Comments, LinkifyContent } from "components";

const SinglePost = () => {
  const { postId } = useParams();
  const { currentUserDetails } = useAuth();
  const { posts } = useData();

  const post = posts?.find((item) => item._id === postId);

  return (
    <article className="text-left flex flex-col items-center">
      {post && (
        <>
          <section className="single-post-card rounded-md mt-5 border-2 border-gray-300 p-4 pb-3">
            <header className="flex justify-between">
              <h4 className="font-bold ">@{post.userName}</h4>
              {currentUserDetails?.userName === post.userName && (
                <DeleteIcon
                  className="delete-post-icon cursor-pointer text-red-600 invisible"
                  size={20}
                  onClick={(e) => {
                    deletePost(post._id, post.asset);
                  }}
                />
              )}
            </header>
            <p className="text-xs mt-1 pl-px">
              {convertTimestampToDate(post.createdAt)}
            </p>
            <div className="whitespace-pre-wrap mt-4">
              <LinkifyContent
                content={post.content}
                linkClass={"text-indigo-700"}
              />
              {post.asset && (
                <div>
                  {post.asset.assetType === "video" ? (
                    <video
                      className="video m-auto rounded-md"
                      src={post.asset.assetUrl}
                      controls
                    />
                  ) : (
                    <a
                      href={post.asset.assetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img className="rounded-md" src={post.asset.assetUrl} />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 mb-2 pt-2 border-t-2 border-gray-200">
              <div className="flex items-center">
                {post.likedByUsers.includes(currentUserDetails.userName) ? (
                  <LikeFillIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() =>
                      updateArrayOfPost(
                        postId,
                        currentUserDetails.userName,
                        "likedByUsers",
                        "remove"
                      )
                    }
                  />
                ) : (
                  <LikeOutlineIcon
                    className="cursor-pointer"
                    size={20}
                    onClick={() =>
                      updateArrayOfPost(
                        postId,
                        currentUserDetails.userName,
                        "likedByUsers",
                        "add"
                      )
                    }
                  />
                )}
                <span className="text-md ml-4">{post.likedByUsers.length}</span>
              </div>
              <div className="flex items-center">
                <CommentIcon className="cursor-pointer" size={18} />{" "}
                <span className="text-md ml-4">{post.commentsCount}</span>
              </div>
              {post.bookmarkedByUsers.includes(currentUserDetails.userName) ? (
                <BookmarkFillIcon
                  size={17}
                  onClick={() =>
                    removePostToBookmarks(currentUserDetails, post._id)
                  }
                />
              ) : (
                <BookmarkOutlineIcon
                  size={17}
                  onClick={() =>
                    addPostToBookmarks(currentUserDetails, post._id)
                  }
                />
              )}
            </div>
            <Comments post={post} currentUserDetails={currentUserDetails} />
          </section>
        </>
      )}
    </article>
  );
};

export { SinglePost };
