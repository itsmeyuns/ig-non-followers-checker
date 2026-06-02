const followers = [
  {
    title: "",
    media_list_data: [],
    string_list_data: [
      {
        href: "https://www.instagram.com/mpauu.rs",
        value: "mpauu.rs",
        timestamp: 1767676231,
      },
    ],
  },
];
const following = [
  {
    title: "yeshua.p__",
    string_list_data: [
      {
        href: "https://www.instagram.com/_u/yeshua.p__",
        timestamp: 1767727207,
      },
    ],
  },
];

// Extract usernames from followers and following lists
const followersList = followers.map((item) => item.string_list_data[0].value);
const followingList = following.map((item) => item.title);
// const followingList = following.map((item) => item.string_list_data[0].value);

// Find users who are not following back
const notFollowingBack = followingList.filter(
  (user) => !followersList.includes(user),
);

// Display the users not following back
const listElement = document.getElementById("not-following-back");
const title = document.createElement("h3");
title.textContent = `N: ${notFollowingBack.length}`;
listElement.before(title);

notFollowingBack.forEach((user) => {
  const listItem = document.createElement("li");
  console.log("USER:", user);
  listItem.textContent = user;
  listElement.appendChild(listItem);
});
