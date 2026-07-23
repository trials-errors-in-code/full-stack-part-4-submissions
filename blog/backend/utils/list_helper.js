import data from "./data.js";

const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => (sum += blog.likes), 0);
};
const favoriteBlogs = (blogs) => {
  let favorite;
  blogs.reduce((acc, curr) => {
    if (curr.likes > acc) {
      acc = curr.likes;
      favorite = { ...curr };
    }
    return acc;
  }, 0);
  return favorite;
};

const mostBlogs = (blogs) => {
  let obj = blogs.reduce((acc, curr, index) => {
    if (!(curr.author in acc)) {
      acc[curr.author] = 1;
    } else {
      acc[curr.author] += 1;
    }
    return acc;
  }, {});
  return getHighest(obj, "blogs");
};
const mostLikes = (blogs) => {
  let obj = blogs.reduce((acc, curr) => {
    if (!(curr.author in acc)) {
      acc[curr.author] = curr.likes;
    } else {
      acc[curr.author] += curr.likes;
    }
    return acc;
  }, {});
  return getHighest(obj, "total likes");
};

export default {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlogs,
  mostLikes,
};

function getHighest(obj, property) {
  let returnObj;
  let max = 0;
  for (let key in obj) {
    if (obj[key] > max) {
      max = obj[key];
      returnObj = {
        author: key,
        [property]: obj[key],
      };
    }
  }
  return returnObj;
}
