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

function createUserLink(username, text = username) {
  const li = document.createElement("li");

  const a = document.createElement("a");
  a.href = `https://instagram.com/${username}`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = text;

  li.appendChild(a);

  return li;
}

function getLabelValue(item, label) {
  return item.label_values.find((v) => v.label === label)?.value;
}

// ------------------------------
// Tabs
// ------------------------------

const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    cards.forEach((c) => c.classList.remove("active"));

    tab.classList.add("active");

    document.getElementById(tab.dataset.target).classList.add("active");
  });
});

// ------------------------------
// Non Followers Checker
// ------------------------------

document.getElementById("checkBtn").addEventListener("click", async () => {
  const followersFile = document.getElementById("followersFile").files[0];

  const followingFile = document.getElementById("followingFile").files[0];

  if (!followersFile || !followingFile) {
    alert("Please upload both Followers and Following JSON files.");
    return;
  }

  try {
    const followers = await readJsonFile(followersFile);
    const following = await readJsonFile(followingFile);

    const followersSet = new Set(
      followers
        .map((item) => item.string_list_data?.[0]?.value)
        .filter(Boolean),
    );

    const notFollowingBack = following.relationships_following
      .map((item) => item.title)
      .filter(Boolean)
      .filter((username) => !followersSet.has(username));

    document.getElementById("not-following-back-count").textContent =
      `Users not following you back: ${notFollowingBack.length}`;

    const list = document.getElementById("not-following-back");

    list.innerHTML = "";

    notFollowingBack.forEach((username) => {
      list.appendChild(createUserLink(username));
    });
  } catch (err) {
    console.error(err);
    alert("Invalid JSON file.");
  }
});

// ------------------------------
// Requests Sent
// ------------------------------

document.getElementById("requestsBtn").addEventListener("click", async () => {
  const requestsFile = document.getElementById("requestsFile").files[0];

  if (!requestsFile) {
    alert("Please upload the Requests JSON file.");
    return;
  }

  try {
    const requests = await readJsonFile(requestsFile);

    document.getElementById("requests-count").textContent =
      `Pending Requests: ${requests.length}`;

    const list = document.getElementById("pending-requests");

    list.innerHTML = "";

    requests
      .sort((a, b) => {
        const ua = getLabelValue(a, "Username") || "";
        const ub = getLabelValue(b, "Username") || "";
        return ua.localeCompare(ub);
      })
      .forEach((item) => {
        const username = getLabelValue(item, "Username");

        if (!username) return;

        list.appendChild(createUserLink(username));
      });
  } catch (err) {
    console.error(err);
    alert("Invalid JSON file.");
  }
});
