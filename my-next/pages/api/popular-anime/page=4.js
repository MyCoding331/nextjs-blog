const puppeteer = require("puppeteer")
const cheerio = require("cheerio")
const chrome = require("chrome-aws-lambda")
const axios = require("axios")


const getOptions = async () => {
  let options
  if (process.env.NODE_ENV === "production") {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    }
  } else {
    options = {
      args: [],

      headless: true,
    }
  }
  return options
}

const getAnimebee = async (req, res) => {
   
 
  const properties = req.body.properties

  try {
    const options = await getOptions()
    const browser = await puppeteer.launch({headless:'chrome'})
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    page.on("request", (request) => {
      if (request.resourceType() === "document") {
        request.continue()
      } else {
        request.abort()
      }
    })

    await page.goto("https://animebee.to/most-popular-anime?page=4", { timeout: 0 }).then(async (response) => {})
    const html = await page.evaluate(() => {
      return document.querySelector("body").innerHTML
    })
    const $ = cheerio.load(html)

    // create empty result set, assume selectors will return same number of results
    let result = []
    

    // fill result set by parsing the html for each property selector
    $(".flw-item ").each(function ()  {
       const title =  $(this).find(".film-poster-img").attr("alt");
        const img = $(this).find(".film-poster-img").attr("data-src");
        const episodes = $(this).find(".tick-eps").text();
        const language = $(this).find(".tick-dub").text();
        const duration = $(this).find(".fdi-duration").text();
        const year = $(this).find(".fdi-year").text();

        result.push({   title,img ,episodes,duration,year,language})
      })
      
     
    await browser.close()
    res.status(200).json({  result })
  } catch(error) {
    return res.status(500).send(error.message)
  }
}

export default getAnimebee

export const config = {
  api: {
    externalResolver: true,
  },
}