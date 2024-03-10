// CLASSES
class Jobs {
  constructor(offers = []) {
    this.offers = offers;
  }

  getSpecificOffersIDS(ids) {
    let result = this.offers
      .filter((offer) => ids.every((arg) => offer.keys.includes(arg)))
      .map((element) => element.id);
    return result;
  }
}

class Job {
  constructor(
    id,
    company,
    logo,
    isNew,
    isFeatured,
    position,
    role,
    level,
    postedAt,
    contract,
    location,
    languages,
    tools
  ) {
    this.id = id;
    this.company = company;
    this.logo = logo;
    this.isNew = isNew;
    this.isFeatured = isFeatured;
    this.position = position;
    this.role = role;
    this.level = level;
    this.postedAt = postedAt;
    this.contract = contract;
    this.location = location;
    this.languages = languages;
    this.tools = tools;
    this.keys = [position, role, level, ...languages, ...tools];
  }
}

// FUNCTIONS
const createJob = (data) => {
  return new Job(
    data["id"],
    data["company"],
    data["logo"],
    data["new"],
    data["featured"],
    data["position"],
    data["role"],
    data["level"],
    data["postedAt"],
    data["contract"],
    data["location"],
    data["languages"],
    data["tools"]
  );
};

const showFilteredOffers = (ids) => {
  const jobs = document.querySelector(".jobs");
  [...jobs.children].forEach((child) => {
    if (ids.includes(parseInt(child.id))) {
      child.classList.remove("hide");
    } else {
      child.classList.add("hide");
    }
  });
};

const buildSearchKey = (content) => {
  let div = document.querySelectorAll("template")[0].content.cloneNode(true)
    .children[0];
  div.querySelector("strong").textContent = content;
  removeEventListeners(div, content);
  return div;
};

const removeEventListeners = (element, content) => {
  let button = element.querySelector(".remove");
  button.addEventListener("click", () => {
    let index = filter.findIndex((e) => e === content);
    filter.splice(index, 1);
    const search = document.querySelector(".search");
    if (filter.length === 0) {
      search.classList.remove("show");
      let timer = setTimeout(() => {
        element.remove();
        clearTimeout(timer);
      }, 500);
    } else {
      element.remove();
    }
    let ids = jobs.getSpecificOffersIDS(filter);
    showFilteredOffers(ids);
  });
};

const buildJob = (job) => {
  let section = document.querySelectorAll("template")[1].content.cloneNode(true)
    .children[0];
  section.id = job.id;
  if (job.isNew) {
    section.classList.add("new-job");
  }
  if (job.isFeatured) {
    section.classList.add("featured-job");
  }
  section.querySelector(".company > img").setAttribute("src", job.logo);
  section
    .querySelector(".company > img")
    .setAttribute("alt", job.company + " logo");

  section.querySelector(".details .company-name").textContent = job.company;
  section.querySelector(".details .position").textContent = job.position;
  section.querySelector(".details .posted-at").textContent = job.postedAt;
  section.querySelector(".details .contract").textContent = job.contract;
  section.querySelector(".details .location").textContent = job.location;
  let last = section.querySelector(".key-words");
  job.keys.forEach((key, index) => {
    if (index !== 0) {
      let strong = document.createElement("strong");
      strong.className = "key";
      strong.innerHTML = key;
      last.appendChild(strong);
    }
  });
  attachJobEventListeners(section);
  return section;
};

const attachJobEventListeners = (element) => {
  let keys = element.querySelectorAll(".key");
  keys.forEach((key) => {
    key.addEventListener("click", () => {
      if (!filter.includes(key.textContent)) {
        const search = document.querySelector(".search");
        if (filter.length === 0) {
          search.classList.add("show");
        }
        filter.push(key.textContent);
        search
          .querySelector(".words")
          .appendChild(buildSearchKey(key.textContent));
        let ids = jobs.getSpecificOffersIDS(filter);
        showFilteredOffers(ids);
      }
    });
  });
};

const fetchData = async () => {
  try {
    let data = await (await fetch("data.json")).json();
    let offers = [];
    data.forEach((item) => {
      offers.push(createJob(item));
    });
    return offers;
  } catch (error) {
    console.log("Error retrieving data ", error);
  }
};

// LOGIC
// INITIAL STATE
let jobs;
let filter = [];
(async () => {
  const result = await fetchData();
  jobs = new Jobs(result);
  const jobsContainer = document.querySelector(".jobs");
  jobs.offers.forEach((job) => {
    jobsContainer.appendChild(buildJob(job));
  });
})();

//CLEAR FILTER
const clear = document.querySelector(".clear-btn");
clear.addEventListener("click", () => {
  const search = document.querySelector(".search");
  search.classList.remove("show");
  filter = [];
  let timer = setTimeout(() => {
    search
      .querySelector(".words")
      .replaceChildren(search.querySelector("template"));
    clearTimeout(timer);
  }, 500);
  let ids = jobs.getSpecificOffersIDS(filter);
  showFilteredOffers(ids);
});
