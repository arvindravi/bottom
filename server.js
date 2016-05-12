var Botkit = require('botkit')

var accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN
var verifyToken = process.env.FACEBOOK_VERIFY_TOKEN
var port = process.env.PORT

if (!accessToken) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN is required but missing')
if (!verifyToken) throw new Error('FACEBOOK_VERIFY_TOKEN is required but missing')
if (!port) throw new Error('PORT is required but missing')

var controller = Botkit.facebookbot({
  access_token: accessToken,
  verify_token: verifyToken
})

var bot = controller.spawn()

controller.setupWebserver(port, function (err, webserver) {
  if (err) return console.log(err)
  controller.createWebhookEndpoints(webserver, bot, function() {
    console.log('Ready.')
  })
})

// Appetisers Menu
var handleAppetisers = function(bot, message, convo) {
  bot.reply(message, {
    attachment: {
      'type': 'template',
      'payload': {
        'template_type': 'button',
        'text': 'Nice! What do you prefer?',
        'buttons': [
          {
            'type': 'postback',
            'title': 'Vegetarian',
            'payload': 'showVegetarianAppetisers'
          },
          {
            'type': 'postback',
            'title': 'Non Vegetarian',
            'payload': 'showNonVegetarianAppetisers'
          },
          {
            'type': 'postback',
            'title': 'Show me both',
            'payload': 'showAllAppetisers'
          }
        ]
      }
    }
  })
  convo.next()
}

// Data
// I - Appetisers
var vegetarianAppetisers = [
  {
    'title': 'Veg Appetiser #1',
    'image_url': 'http://media-cache-ec0.pinimg.com/736x/fe/ee/a9/feeea94d9466635bc04bb8d5fdbd93a2.jpg',
    'subtitle': 'Cooked to perfection.',
    'buttons': [
      {
        'type': 'postback',
        'title': 'Add',
        'payload': 'addItemOne'
      }
    ]
  },
  {
    'title': 'Veg Appetiser #2',
    'image_url': 'http://cdn2-b.examiner.com/sites/default/files/styles/image_content_width/hash/8e/e4/8ee4a0a8eeb6074ccc246502c988251e.jpg?itok=xAjYnr_M',
    'subtitle': 'Cooked to perfection.',
    'buttons': [
      {
        'type': 'postback',
        'title': 'Add',
        'payload': 'addItemTwo'
      }
    ]
  }
]
var nonVegetarianAppetisers = []
var Appetisers = []
// II - Salads
// III - Main Course
// IV - Desserts

// Show Appetisers
var showAppetisers = function (type, bot, message) {
  console.log(message)
  switch (type) {
    case 'vegetarian':
        bot.reply(message, {
          attachment: {
              'type': 'template',
              'payload': {
                'template_type': 'generic',
                'elements': vegetarianAppetisers
              }
          }
        })
    case 'nonvegetarian':
    case 'all':
    default:
     break
  }
}

// Salads Menu
var handleSalads = function(bot, message, convo) {
  bot.reply(message, {
    attachment: {
      'type': 'template',
      'payload': {
        'template_type': 'button',
        'text': 'Salads! Eating healthy itseems. What do you prefer?',
        'buttons': [
          {
            'type': 'postback',
            'title': 'Vegetarian',
            'payload': 'showVegetarianAppetisers'
          },
          {
            'type': 'postback',
            'title': 'Non Vegetarian',
            'payload': 'showNonVegetarianAppetisers'
          },
          {
            'type': 'postback',
            'title': 'Show me both',
            'payload': 'showAllAppetisers'
          }
        ]
      }
    }
  })
  convo.next()
}

controller.on('facebook_postback', function (bot, message) {
  switch (message.payload) {
    case 'showVegetarianAppetisers':
      showAppetisers('vegetarian', bot, message)
      break
    case 'showNonVegetarianAppetisers':
      bot.reply(message, 'Yay! Non Veg Appetisers')
      break
    case 'showAllAppetisers':
      bot.reply(message, 'Yay! Showing All Appetisers')
      break
    case 'desserts':
      bot.reply(message, 'OMG! Dessert!')
      break
    case 'addItemOne':
      bot.reply(message, 'Adding Item One')
      break
    case 'addItemTwo':
      bot.reply(message, 'Adding Item Two')
      break
  }
})

controller.hears(['hi', 'hello', 'yo', 'hey', 'sup', 'nigga'], 'message_received', function (bot, message) {
  var menu = "What do you feel like today? \n 1. Appetisers \n 2. Salads \n 3. Main Course \n 4. Desserts \n \nPlease enter the corresponding number and lets get you food!"
  bot.startConversation(message, function (err, convo) {
    convo.sayFirst('Hello!')
    convo.ask(menu, function (response, convo) {
      switch (response.text) {
        case '1':
          handleAppetisers(bot, message, convo)
          break
        case '2':
          handleSalads(bot, message, convo)
          convo.next()
          break
        case '3':
          convo.say('Main Course!')
          convo.next()
          break
        case '4':
          convo.say('Desserts!')
          convo.next()
          break
        default:
          convo.say('Please enter one of the 4 numbers.')
          break
      }
    })
  })
})

