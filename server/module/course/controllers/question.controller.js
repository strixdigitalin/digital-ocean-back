const Joi = require('joi');
const _ = require('lodash');
const validateSchema = Joi.object().keys({
  courseId: Joi.string().required(),
  type: Joi.string().allow(['single', 'multi', 'trueOrFalse', 'matching']).required(),
  content: Joi.string().required(),
  ordering: Joi.number().allow([null, '']).optional(),
  isTrue: Joi.boolean().when('type', {
    is: 'trueOrFalse',
    then: Joi.required(),
    otherwise: Joi.optional().allow([null, ''])
  })
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.questionId || req.body.questionId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const query = Helper.App.isMongoId(id) ? { _id: id } : { alias: id };
    let question = await DB.Question.findOne(query);
    if (!question) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.question = question;
    res.locals.question = question;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    // TODO - check if req.user is course creater or admin

    const question = new DB.Question(validate.value);

    await question.save();
    if (question.type === 'trueOrFalse') {
      const trueAnswer = new DB.Answer({
        questionId: question._id,
        content: 'True',
        isCorrect: question.isTrue,
        type: 'trueOrFalse'
      });
      await trueAnswer.save();
      const falseAnswer = new DB.Answer({
        questionId: question._id,
        content: 'False',
        isCorrect: !question.isTrue,
        type: 'trueOrFalse'
      });
      await falseAnswer.save();
    }
    res.locals.create = question;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const validate = Joi.validate(req.body, validateSchema);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    // TODO - check if req.user is course creater or admin
    Object.assign(req.question, validate.value);
    await req.question.save();
    if (req.question.type === 'trueOrFalse') {
      await DB.Answer.update(
        { questionId: req.question._id, content: 'True' },
        {
          isCorrect: req.question.isTrue
        }
      );
      await DB.Answer.update(
        { questionId: req.question._id, content: 'False' },
        {
          isCorrect: !req.question.isTrue
        }
      );
    }
    res.locals.update = req.question;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    // TODO - check if req.user is course creater or admin
    await DB.Answer.deleteMany({ questionId: req.question._id });
    await req.question.remove();
    res.locals.remove = {
      message: 'question is deleted'
    };
    next();
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['courseId']
    });
    if (!query.courseId) {
      return next(PopulateResponse.error({ message: 'Missing params - courseId' }));
    }

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Question.count(query);

    let items = await DB.Question.find(query)
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    items = await Promise.all(
      items.map(async item => {
        const data = item.toObject();
        const answers = await DB.Answer.find({ questionId: item._id }).populate('matchingAnswer');
        data.answers = answers;
        if (item.type === 'matching' && answers.length) {
          data.columnAAnswers = answers.filter(a => a.isColumnA);
          data.columnBAnswers = answers.filter(a => !a.isColumnA);
        }
        return data;
      })
    );

    res.locals.list = { count, items };
    next();
  } catch (e) {
    next(e);
  }
};
