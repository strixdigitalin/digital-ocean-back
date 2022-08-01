/* eslint prefer-arrow-callback: 0 */
const Schema = require('mongoose').Schema;

const schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId
    },
    content: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['single', 'multi', 'trueOrFalse', 'matching'],
      default: 'single'
    },
    isTrue: {
      type: Boolean // for True or False question
    },
    ordering: {
      type: Number,
      default: 0
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

module.exports = schema;
