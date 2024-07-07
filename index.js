const cheerio = require("cheerio");
const axios = require("axios");

async function performScraping() {
  let year = "2013";

  // downloading the target web page
  // by performing an HTTP GET request in Axios
  const axiosResponse = await axios.request({
    method: "GET",
    url: "https://www.aeoncinema.com/company/press/" + year + ".html",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  });

  // parsing the HTML source of the target web page with Cheerio
  const $ = cheerio.load(axiosResponse.data);

  const _date = [];
  const _url = [];

  $(".contentArea .update").each((index, element) => {
    let date = $(element).text().trim();
    if (date) {
      _date.push(year + "/" + date);
    }
  });

  // $('.contentArea a[href$=".pdf"]').each((index, element) => {
  //   let url = $(element).attr("href");

  //   console.log(url);
  //   if (url) {
  //     _url.push(url);
  //   }
  // });

  $('.contentArea td a[href$=".pdf"]').each((index, element) => {
    let url = $(element).attr("href");
    if (url) {
      _url.push({ url: url, text: $(element).html() });
    }
  });

  const arr = [];
  _date.forEach((date, index) => {
    let odd = index === 0 ? 1 : 2 * index + 1;
    const obj = { date: date, url: _url[2 * index].url, text: _url[odd].text };
    //console.log(_url[index]);
    arr.push(obj);
  });

  // trasforming the scraped data into a general object
  const scrapedData = {
    2024: arr,
  };

  // converting the scraped data object to JSON
  const scrapedDataJSON = JSON.stringify(scrapedData);

  console.log(arr);

  // storing scrapedDataJSON in a database via an API call...
}

performScraping();

//console.log("Hello, World!");
