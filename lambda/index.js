const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Hello Avelina Hernández Hernández, welcome. I can help you convert units. What would you like to convert?',
            HELP_MESSAGE: 'Hello Avelina Hernández Hernández, welcome. I can help you convert centimeters to meters or kilometers, and inches to yards or feet. How would you like to proceed?',
            GOODBYE_MESSAGE: 'Goodbye, Avelina Hernández Hernández!',
            REFLECTOR_MESSAGE: 'You have activated %s',
            FALLBACK_MESSAGE: 'Im sorry, I do not understand. Please try again.',
            ERROR_MESSAGE: 'My apologies, an error has occurred. Please try again.',
            CONVERT_MESSAGE: 'The conversion product is %s.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Hola Avelina Hernández Hernández, bienvenida. Puedo ayudarte a convertir unidades. ¿Qué te gustaría convertir?',
            HELP_MESSAGE: 'Hola Avelina Hernández Hernández, bienvenida. Puedo ayudarte a convertir centímetros a metros o kilómetros, y pulgadas a yardas o pies. ¿Cómo te gustaría proceder?',
            GOODBYE_MESSAGE: '¡Adiós, Avelina Hernández Hernández!',
            REFLECTOR_MESSAGE: 'Has activado %s.',
            FALLBACK_MESSAGE: 'Lo siento, no comprendo. Por favor, intenta nuevamente.',
            ERROR_MESSAGE: 'Mis disculpas, se ha producido un error. Por favor, inténtalo de nuevo.',
            CONVERT_MESSAGE: 'El producto de la conversión es %s.'
        }
    }
};

const conversionFactors = {
    en: {
        "inches": {
            "feet": 0.0833333,
            "yards": 0.0277778
        },
        "feet": {
            "inches": 12,
            "yards": 0.333333
        },
        "yards": {
            "inches": 36,
            "feet": 3
        }
    },
    es: {
        "centimetros": {
            "metros": 0.01,
            "kilometros": 0.00001
        },
        "metros": {
            "centimetros": 100,
            "kilometros": 0.001
        },
        "kilometros": {
            "centimetros": 100000,
            "metros": 1000
        }
    }
};

function convertUnits(value, fromUnit, toUnit, locale) {
    console.log(`Locale: ${locale}, fromUnit: ${fromUnit}, toUnit: ${toUnit}, value: ${value}`);

    if (conversionFactors[locale] && conversionFactors[locale][fromUnit] && conversionFactors[locale][fromUnit][toUnit]) {
        const conversionResult = (value * conversionFactors[locale][fromUnit][toUnit]).toFixed(2);
        console.log(`Conversion result: ${conversionResult}`);
        return conversionResult;
    } else {
        console.log('Conversion factors not found.');
        return `Unknow`;
    }
}



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ConvertIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const locale = handlerInput.requestEnvelope.request.locale.split('-')[0];
        const slots = handlerInput.requestEnvelope.request.intent.slots;

        const fromUnit = slots.fromUnit.value;
        const toUnit = slots.toUnit.value;
        const value = parseFloat(slots.value.value);

        const convertedValue = convertUnits(20, 'metros', 'centimetros', 'es');
        console.log('Converted value:', convertedValue);

        const conversionResult = convertUnits(value, fromUnit, toUnit, locale);

        const speakOutput = requestAttributes.t('CONVERT_MESSAGE', conversionResult);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = requestAttributes.t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        }
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor)
    .lambda();
