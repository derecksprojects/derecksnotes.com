
const siteSection: string = (document.getElementById("siteSection") as HTMLInputElement).value;

// submit a post request to getEntries express server
const getEntries = async (section: string, pageSize: number): Promise<any> => {
    const response = await fetch('/getEntries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            section: section === 'index' ? 'blog' : section,
            pageSize: pageSize
        })
    });

    return await response.json();
}

const entriesDOM: HTMLElement = document.querySelector(".card-entries");

// get entries as promise await
(async () => {
    const res = await getEntries(siteSection, 10);

    if (!res.success) throw new Error(res);

    console.log(res.data.entries[0]);

    // loop through entries and create a card for each
    for (const entry of res.data.entries) {
        // create the a tag which links that goes around the card
        const card: HTMLElement = document.createElement("a");
        card.setAttribute("class", "card");
        card.setAttribute("href", "/blog/" + entry.fileName);

        // write the slogan for each card
        const slogan: HTMLElement = document.createElement("div");
        slogan.innerText = entry.slogan;
        slogan.setAttribute("class", "entry-data entry-slogan");
        card.appendChild(slogan);

        // sets the article name
        const title: HTMLElement = document.createElement("div");
        title.innerText = entry.articleTitle;
        title.setAttribute("class", "entry-data entry-name");
        card.appendChild(title);

        // set card cover image
        const image: HTMLElement = document.createElement("img");
        image.setAttribute("src", "/site-images/card-covers/" + entry.image);
        image.setAttribute("class", "entry-img");
        card.appendChild(image);

        // set the author
        const author: HTMLElement = document.createElement("div");
        author.innerText = entry.author;
        author.setAttribute("class", "entry-data entry-author");
        card.appendChild(author);

        // set article summary
        const summary: HTMLElement = document.createElement("div");
        summary.innerHTML = entry.summary.slice(0, 150).replace(/\.$|\,$/, "").trim() + "...";
        summary.setAttribute("class", "entry-data entry-summary");
        
        // create drop cap
        const drop: HTMLElement = document.createElement("span");
        drop.innerText = entry.summary[0];
        drop.setAttribute("class", "drop-cap");
        // remove the first letter from the summary
        summary.innerHTML = summary.innerHTML.slice(1);
        // add the drop cap to the summary
        summary.prepend(drop);

        // set the date
        const date: HTMLElement = document.createElement("span");
        // extract year month day from iso date; "2021-07-30T05:00:00.000Z"
        const year: string = entry.date.substring(0, 4);
        const month: string = entry.date.substring(5, 7);
        const day: string = entry.date.substring(8, 10);
        date.innerText = `${month}/${day}/${year}`;
        date.setAttribute("class", "entry-data entry-date");
        
        summary.appendChild(date);
        card.appendChild(summary);

        // finally append the card to the entriesDOM
        entriesDOM.appendChild(card);
    }
})();
