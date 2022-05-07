import React, { useState, useEffect } from "react";
import { db } from "config/firebase-config";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { goldMedalImg, silverMedalImg, BronzeMedalImg } from "assets";
import { getNumberOrdinal } from "utils/getNumberOrdinal";

const Leaderboard = () => {
  const [boardList, setBoardList] = useState([]);
  const medalImagesList = [goldMedalImg, silverMedalImg, BronzeMedalImg];
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("starsCount", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), userId: doc.id });
      });
      setBoardList(list);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <main>
      <h1 className="uppercase font-bold text-3xl text-center my-5">
        Leaderboard
      </h1>
      <section className="leaderboard-wrapper flex flex-col justify-center m-auto">
        {boardList?.map(
          ({ firstName, lastName, userName, starsCount }, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 my-1 bg-indigo-100 rounded-md"
            >
              <div className="flex items-center">
                {[0, 1, 2].includes(index) ? (
                  <img
                    className="h-16 w-16 mr-4"
                    src={medalImagesList[index]}
                  />
                ) : (
                  <div className="h-16 w-16 text-center leading-64 font-bold text-2xl mr-4">
                    {index + 1}
                    <sup>{getNumberOrdinal(index + 1)}</sup>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-bold">
                    {firstName} {lastName}
                  </span>
                  <span className="text-xs">@{userName}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-lg">{starsCount}</span>
                <span className="text-gray-500 text-sm">Stars</span>
              </div>
            </div>
          )
        )}
      </section>
    </main>
  );
};

export { Leaderboard };
