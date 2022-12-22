import axios from 'axios'
import cheerio from 'cheerio'
import bubble from '../template/activity_bubble_template.js'

const activities = []

const fetch = async () => {
  const { data } = await axios.get('https://www.ntcslsports.com.tw/')
  const $ = cheerio.load(data)
  $('.ipost').each(function () {
    activities.push({
      name: $(this).find('.entry-title').text().replace(/\n/g, '').replace(/\s*/g, ''),
      img: 'https://www.ntcslsports.com.tw/' + $(this).find('.image_fade').attr('src'),
      description: $(this).find('.entry-content').text().replace(/\s*/, ''),
      releaseDate: $(this).find('#my-news').text().slice(0, 10)
    })
  })
}

const reply = (event) => {
  const bubbles = []
  for (const i in activities) {
    bubble.hero.url = activities[i].img
    bubble.body.contents[0].text = activities[i].name
    bubble.body.contents[1].contents[0].contents[0].text = `刊登日: ${activities[i].releaseDate}`
    bubble.body.contents[2].contents[0].contents[0].text = activities[i].description
    bubble.body.contents[3].action.text = `! ${activities[i].name}`
    bubbles.push(JSON.parse(JSON.stringify(bubble)))
  }
  event.reply(
    {
      type: 'flex',
      altText: '當前活動',
      contents: {
        type: 'carousel',
        contents: bubbles
      }

    }
  )
}

const replyMore = (event) => {
  const activityName = event.message.text.slice(2)
  const activity = []
  for (const i in activities) if (activities[i].name === activityName) activity.push(activities[i])
  event.reply(
    {
      type: 'image',
      originalContentUrl: activity[0].img.replace('-1', ''),
      previewImageUrl: activity[0].img.replace('-1', '')
    }
  )
}

export default {
  fetch,
  reply,
  replyMore
}