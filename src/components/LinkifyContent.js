import React from "react";

import Linkify from "react-linkify";
import { SecureLink } from "react-secure-link";

const LinkifyContent = ({ content }) => {
  return (
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
  );
};

export { LinkifyContent };
