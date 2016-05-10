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

controller.hears(['hi', 'hello', 'yo'], 'message_received', function (bot, message) {
    bot.reply(message, 'Hello!')
    bot.reply(message, 'What are you in the mood for today?')
    bot.reply(message, {
        attachment: {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': [
                    {
                        'title': 'Appetisers',
                        'image_url': 'http://www.libbytreasuremountain.com/wp-content/uploads/2014/03/appetizer.jpg',
                        'subtitle': 'The best Appetisers in town.',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Appetisers',
                                'payload': 'appetisers'
                            }
                        ]
                    },
                    {
                        'title': 'Salads',
                        'image_url': 'http://1.bp.blogspot.com/-wygAvzlH4oc/UdBCAdBs4FI/AAAAAAAAByA/oWa40mzFrJo/s400/ramen+angle.jpg',
                        'subtitle': 'The best salads in town.',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Salads',
                                'payload': 'salads'
                            }
                        ]
                    },
                    {
                        'title': 'Main Course',
                        'image_url': 'http://www.cakeslash.com/wp-content/uploads/2014/08/tenderloin-main-course-food-picture.jpg',
                        'subtitle': 'The best food in town.',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Main Course',
                                'payload': 'mainCourse'
                            }
                        ]
                    },
                    {
                        'title': 'Desserts',
                        'image_url': 'http://www.amthewinersclub.com/Resources/dessert.jpg',
                        'subtitle': 'The best desserts in town.',
                        'buttons': [
                            {
                                'type': 'postback',
                                'title': 'Desserts',
                                'payload': 'desserts'
                            }
                        ]
                    }
                ]
        }
    }
    })
})

controller.on('facebook_postback', function (bot, message) {
    switch (message.payload) {
        case 'appetisers':
            bot.reply(message, 'Yay! Appetisers')
            break
        case 'salads':
            bot.reply(message, 'Yay! Salads')
            break
        case 'mainCourse':
            bot.reply(message, 'Yay! Actual Food!')
            break
        case 'desserts':
            bot.reply(message, 'OMG! Dessert!')
            break
    }
})
