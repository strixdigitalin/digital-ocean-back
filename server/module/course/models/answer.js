/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId
    },
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['single', 'multi', 'matching', 'trueOrFalse'],
      default: 'single'
    },
    label: {
      type: String,
      defaul: ''
    },
    isCorrect: {
      // Is correct answer
      type: Boolean
    },
    isColumnA: {
      // For Maching question
      type: Boolean
    },
    matchingLabel: {
      type: String,
      default: ''
    },
    matchingAnswerId: {
      // For Maching question
      type: Schema.Types.ObjectId
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
);
schema.virtual('matchingAnswer', {
  ref: 'Answer',
  localField: 'matchingAnswerId',
  foreignField: '_id',
  justOne: true
});
module.exports = schema;
