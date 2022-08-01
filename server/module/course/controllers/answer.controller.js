const Joi = require('joi');
const _ = require('lodash');
const validateSchema = Joi.object().keys({
  questionId: Joi.string().required(),
  type: Joi.string().allow(['single', 'multi', 'matching']).required(),
  content: Joi.string().required(),
  label: Joi.string().allow(['', null]).optional(),
  isCorrect: Joi.boolean().when('type', {
    is: 'matching',
    then: Joi.boolean().allow([null, '']),

    otherwise: Joi.required()
  }),
  isColumnA: Joi.boolean().when('type', {
    is: 'matching',
    then: Joi.required(),
    otherwise: Joi.optional().allow([null, ''])
  }),
  matchingAnswerId: Joi.string().optional().allow([null, '']),
  matchingLabel: Joi.string().optional().allow([null, ''])
  // matchingAnswerId: Joi.string().when('type', {
  //   is: 'matching',
  //   then: Joi.required(),
  //   otherwise: Joi.optional().allow([null, ''])
  // })
});

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.answerId || req.body.answerId;
    if (!id) {
      return next(PopulateResponse.validationError());
    }
    const query = Helper.App.isMongoId(id) ? { _id: id } : { alias: id };
    let answer = await DB.Answer.findOne(query);
    if (!answer) {
      return res.status(404).send(PopulateResponse.notFound());
    }
    req.answer = answer;
    res.locals.answer = answer;
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
    if (validate.value.type === 'single' && validate.value.isCorrect === true) {
      await DB.Answer.updateMany(
        { questionId: validate.value.questionId },
        {
          isCorrect: false
        }
      );
    }

    if (validate.value.type === 'matching') {
      let labels = [];
      const answers = await DB.Answer.find({ questionId: validate.value.questionId });
      if (answers.length) answers.map(item => labels.push(item.label));
      if (labels.includes(validate.value.label)) {
        return next(PopulateResponse.error({ message: 'Duplicated label!' }));
      }
    }
    const answer = new DB.Answer(validate.value);
    await answer.save();
    res.locals.create = answer;
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
    if (validate.value.type === 'single' && validate.value.isCorrect === true) {
      await DB.Answer.updateMany(
        { questionId: validate.value.questionId },
        {
          isCorrect: false
        }
      );
    }
    Object.assign(req.answer, validate.value);
    await req.answer.save();
    res.locals.update = req.answer;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    // TODO - check if req.user is course creater or admin
    await req.answer.remove();
    res.locals.remove = {
      message: 'answer is deleted'
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
      equal: ['questionId']
    });
    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.Answer.count(query);

    let items = await DB.Answer.find(query)
      .populate('matchingAnswer')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.list = { count, items };
    next();
  } catch (e) {
    next(e);
  }
};

exports.checkCorrect = async (req, res, next) => {
  try {
    res.locals.isCorrect = { isCorrect: req.answer.isCorrect };
    return next();
  } catch (e) {
    next(e);
  }
};
