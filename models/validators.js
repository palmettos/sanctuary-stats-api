const {checkSchema} = require('express-validator/check');
const logger = require('winston');


let validCharacterClasses = [
    'Amazon',
    'Barbarian',
    'Necromancer',
    'Paladin',
    'Sorceress',
    'Assassin',
    'Druid'
];

characterIdValidatorProps = {
    channel: {
        exists: {
            errorMessage: 'channelName must exist'
        },
        isString: {
            errorMessage: 'channelName must be a string'
        },
        isLength: {
            options: {min: 4, max: 25},
            errorMessage: 'channelName must be between 4 and 25 characters'
        }
    },
    characterName: {
        exists: {
            errorMessage: 'characterName must exist'
        },
        isString: {
            errorMessage: 'characterName must be a string'
        },
        isLength: {
            // Because we might end up appending UIDs to character
            // names in the future to prevent duplicates
            errorMessage: 'characterName must be between 2 and 32 characters',
            options: {min: 2, max: 32}
        }
    },
    characterClass: {
        exists: {
            errorMessage: 'characterClass must exist'
        },
        isString: {
            errorMessage: 'characterClass must be a string'
        },
        isIn: {
            options: [validCharacterClasses],
            errorMessage: 'characterClass must be a valid character class'
        }
    }
};

characterLevelValidatorProps = {
    characterLevel: {
        exists: {
            errorMessage: 'characterLevel must exist'
        },
        isInt: {
            errorMessage: 'characterLevel must be an integer between 1 and 99',
            options: {min: 1, max: 99}
        }
    }
};

exports.characterIdValidator = checkSchema(
    {
        ...characterIdValidatorProps
    }
);

exports.equippedItemsValidator = checkSchema(
    {
        ...characterIdValidatorProps,
        ...characterLevelValidatorProps,
        payload: {
            exists: {
                errorMessage: 'payload must exist'
            },
            isArray: {
                errorMessage: 'payload must be an array'
            }
        },
        'payload.*.uniqueName': {
            isString: {
                errorMessage: 'uniqueName must be a string'
            }
        },
        'payload.*.baseName': {
            isString: {
                errorMessage: 'baseName must be a string'
            }
        },
        'payload.*.quality': {
            isString: {
                errorMessage: 'quality must be a string'
            }
        },
        'payload.*.location': {
            isString: {
                errorMessage: 'location must be a string'
            }
        },
        'payload.*.properties': {
            isArray: {
                errorMessage: 'properties must be an array'
            }
        },
        'payload.*.properties.*': {
            isString: {
                errorMessage: 'property must be a string'
            }
        }
    }
);

exports.skillLevelsValidator = checkSchema(
    {
        ...characterIdValidatorProps,
        ...characterLevelValidatorProps,
        payload: {
            exists: {
                errorMessage: 'payload must exist'
            },
            isArray: {
                errorMessage: 'payload must be an array'
            }
        },
        'payload.*': {
            custom: {
                errorMessage: 'payload must contain Objects',
                options: (value) => {
                    return value instanceof Object && !Array.isArray(value);
                }
            }
        },
        'payload.*.*': {
            isInt: {
                errorMessage: 'skill levels must be integers between 1 and 100',
                options: {min: 1, max: 100}
            }
        }
    }
);

exports.goldStateValidator = checkSchema(
    {
        ...characterIdValidatorProps,
        ...characterLevelValidatorProps,
        payload: {
            exists: {
                errorMessage: 'payload must exist'
            }
        },
        'payload.currentGold': {
            exists: {
                errorMessage: 'payload.currentGold must exist',
            },
            isInt: {
                errorMessage: 'payload.currentGold must be an integer'
            }
        },
        'payload.delta': {
            exists: {
                errorMessage: 'payload.delta must exist',
            },
            isInt: {
                errorMessage: 'payload.delta must be an integer'
            }
        }
    }
)

exports.attributeStateValidator = checkSchema(
    {
        ...characterIdValidatorProps,
        ...characterLevelValidatorProps,
        payload: {
            exists: {
                errorMessage: 'payload must exist'
            },
            isEmpty: {
                errorMessage: 'payload must contain data'
            }
        },
        'payload.*': {
            isInt: {
                errorMessage: 'payload data must be integers between 1 and 1000',
                options: {min: 0, max: 1000}
            }
        }
    }
)
