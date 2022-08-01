exports.model = {
  Course: require('./models/course'),
  Section: require('./models/section'),
  Lecture: require('./models/lecture'),
  MyCourse: require('./models/my-course'),
  LectureMedia: require('./models/lecture-media'),
  Question: require('./models/question'),
  Answer: require('./models/answer')
};

exports.services = {
  Course: require('./services/Course'),
  Section: require('./services/Section'),
  Lecture: require('./services/Lecture')
};

exports.router = router => {
  require('./routes/course.route')(router);
  require('./routes/section.route')(router);
  require('./routes/lecture.route')(router);
  require('./routes/my-course.route')(router);
  require('./routes/lecture-media.route')(router);
  require('./routes/question.route')(router);
  require('./routes/answer.route')(router);
};
