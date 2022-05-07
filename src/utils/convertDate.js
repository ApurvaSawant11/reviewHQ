import { Timestamp } from "firebase/firestore";

const convertTimestampToDate = (timestamp) => {
  const date = new Date(
    new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
  ).toDateString();

  Array.prototype.myJoin = function (all, last) {
    let arr = this.slice();
    let lastItem = arr.splice(-1);
    arr = arr.length ? [arr.join(all)] : [];
    arr.push(lastItem);
    return arr.join(last);
  };

  return date.split(" ").slice(1).myJoin(" ", ", ");
};

export { convertTimestampToDate };
