import moment from "moment";

export const ConvertDateToDaysAgo = (date) => {
  const givenDate = new Date(date);
  const currentDate = new Date();
  
  const givenDateMoment = moment(givenDate);
  const currentDateMoment = moment(currentDate);

  // get like x seconds ago, x minutes ago, x hours ago, x days ago, x months ago, x years ago
  const timeAgo = givenDateMoment.from(currentDateMoment);

  return timeAgo;
};