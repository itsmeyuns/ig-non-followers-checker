async function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = reject;
    reader.readAsText(file);
  });
}

document.getElementById("checkBtn").addEventListener("click", async () => {
  const followersFile = document.getElementById("followersFile").files[0];

  const followingFile = document.getElementById("followingFile").files[0];

  if (!followersFile || !followingFile) {
    alert("Please select both files.");
    return;
  }

  try {
    const followers = await readJsonFile(followersFile);
    const following = await readJsonFile(followingFile);
    console.log("followers:", followers);
    console.log("following:", following);

    const followersSet = new Set(
      followers
        .map((item) => item.string_list_data?.[0]?.value)
        .filter(Boolean),
    );

    const notFollowingBack = following.relationships_following
      .map((item) => item.title)
      .filter(Boolean)
      .filter((username) => !followersSet.has(username));

    document.getElementById("count").textContent =
      `Not following back: ${notFollowingBack.length}`;

    const list = document.getElementById("not-following-back");
    list.innerHTML = "";

    notFollowingBack.forEach((username) => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = `https://instagram.com/${username}`;
      link.target = "_blank";
      link.textContent = username;

      li.appendChild(link);
      list.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    alert("Failed to read JSON files.");
  }
});
