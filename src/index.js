/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space quote"
 *  Alexa: "Here's your space quote: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

var CATEGORY_TO_QUOTE = {
    "focus": ["Worry about yourself","Stay Focus! Stay Focus now!","Kid, no excuses!", "You gotta Focus!!!" ],
    "success": ["I have 24 hours in a day. I don't sleep when i need to.", "What is wrong with my code! This is bullshit", "Keep Calm and Make Today Productive", "I am on a mission, be productive"],
    "dirty": ["I am so dirty. I need to wash my hair, brush my teeth, clean my dishes", "I don't use my pinky to hold my laptop.", "Do you have coke?", "How much is the coke?"]
};

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * BurtonQuote is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var BurtonQuote = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
BurtonQuote.prototype = Object.create(AlexaSkill.prototype);
BurtonQuote.prototype.constructor = BurtonQuote;

BurtonQuote.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("BurtonQuote onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
        session.attributes.count = 0;
};

BurtonQuote.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("BurtonQuote onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = {
        speech: "What do you want me to focus on?",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
        speech: "Please tell me what quote do you want?",
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.ask(speechOutput, repromptOutput);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
BurtonQuote.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("BurtonQuote onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

BurtonQuote.prototype.intentHandlers = {
    "GetNewQuoteIntent": function (intent, session, response) {
        handleNewFactRequest(intent,session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Burton Quote tell me a quote, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.YesIntent": function (intent, session, response) {
        response.ask("What do you want me to focus on?");
    },

    "AMAZON.NoIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new quote from the list and returns to the user.
 */


 function handleNewFactRequest(intent, seesion, response) {
    // Get a random space quote from the space quotes list
    var quotes = CATEGORY_TO_QUOTE[intent.slots.Category.value];
    var quoteIndex = Math.floor(Math.random() * quotes.length);
    var quote = quotes[quoteIndex];
    session.attributes.count ++;

    // Create speech output
    var speechOutput = {
        type: AlexaSkill.speechOutputType.SSML,
        speech: "<speak>Here is" + session.attributes.count + "Burton Quote: <break time='2s'/>" + quote + " <break time='2s'/>  do you want another quote?</speak>"
    }

    response.ask(speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the BurtonQuote skill.
    var burtonQuote = new BurtonQuote();
    burtonQuote.execute(event, context);
};
