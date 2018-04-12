const Joi = require('joi');

let validate = function (input, schema) {
  let result = Joi.validate(input, schema);
  if (result.error) {
    throw result.error;
  }
};

let getPicture = Joi.object().keys({
  type: Joi.string().required()
});

let memberSignin = Joi.object().keys({
  tel: Joi.string().required().regex(/^(13|15|17|18|14)[0-9]{9}$/)
});

let memberRegister = Joi.object().keys({
  uuid: Joi.string().required(),
  tel: Joi.string().required().regex(/^(13|15|17|18|14)[0-9]{9}$/),
  gender: Joi.string().required(),
  nickname: Joi.string().required(),
  interest: Joi.string().required(),
  present: Joi.string().required(),
  firstname: Joi.string().required(),
  surname: Joi.string().required(),
  referral: Joi.string().allow('')
});

let managerSignin = Joi.object().keys({
  account: Joi.string().required(),
  password: Joi.string().required()
});

let showList = Joi.object().keys({
  type: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let showDetail = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});


let showArticleUpvote = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  visit_url: Joi.string().required()
});

let showCommentUpvote = Joi.object().keys({
  member_id: Joi.string().required(),
  comment_id: Joi.string().required()
});
let showCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});
let showCommentAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let showReplyComment = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  to_comment_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let showShareAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  member_id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let driverDetail = Joi.object().keys({
  article_id: Joi.string().required()
});

let driverCommentUpvote = Joi.object().keys({
  member_id: Joi.string().required(),
  comment_id: Joi.string().required()
});

let driverReplyComment = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  to_comment_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let driverCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  offset: Joi.number().integer().required().allow(0),
  count: Joi.number().positive().integer().required()
});

let driverCommentAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let driverApply = Joi.object().keys({
  uuid: Joi.string().required(),
  member_id: Joi.string().required()
});

let fmDetail = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});
let fmArticleUpvote = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  visit_url: Joi.string().required()
});

let fmCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  offset: Joi.number().integer().required().allow(0),
  count: Joi.number().positive().integer().allow(0)
});

let fmCommentAdd = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});

let fmCommentReply = Joi.object().keys({
  uuid: Joi.string().required(),
  article_id: Joi.string().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required(),
  to_comment_id: Joi.string().required(),
  picture_path: Joi.string().allow(''),
  type: Joi.string().required()
});
let fmCommentUpvote = Joi.object().keys({
  member_id: Joi.string().required(),
  comment_id: Joi.string().required()
});

let fmApply = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineDetail = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineApply = Joi.object().keys({
  article_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineCenter = Joi.object().keys({
  province_id: Joi.string().required()
});

let offlinePorscheAddr = Joi.object().keys({
  porsche_center_id: Joi.string().required()
});

let offlineDealer = Joi.object().keys({
  porsche_center_id: Joi.string().required(),
  member_id: Joi.string().required()
});

let offlineDrive = Joi.object().keys({
  porsche_center_id: Joi.string().required(),
  member_id: Joi.string().required(),
  trial_drive_time: Joi.string().required()
});


// 个人中心
let personalUserInfo = Joi.object().keys({
  member_id: Joi.string().required()
});

let personalCity = Joi.object().keys({
  province_id: Joi.string().required()
});

let personalBrowse = Joi.object().keys({
  member_id: Joi.string().required()
});
let personalBrowseDelete = Joi.object().keys({
  id: Joi.number().positive().integer().required()
});
let personalActivityList = Joi.object().keys({
  member_id: Joi.string().required()
});
let notificationList = Joi.object().keys({
  member_id: Joi.string().required()
});
let notificationRead = Joi.object().keys({
  notification_id: Joi.string().required(),
  member_id: Joi.string().required()
});
let notificationDelete = Joi.object().keys({
  notification_id: Joi.string().required()
});
let notificationReply = Joi.object().keys({
  member_id: Joi.string().required(),
  content: Joi.string().required()
});
let postList = Joi.object().keys({
  member_id: Joi.string().required()
});
let postDelete = Joi.object().keys({
  post_id: Joi.string().required()
});

//用户管理
let registerUserList = Joi.object().keys({
  nickname: Joi.string().allow(''),
  tel: Joi.string().allow(''),
  complete: Joi.string().allow(''),
  purchase_willing: Joi.string().allow(''),
  car_id: Joi.number().positive().integer().allow(''),
  willing_change_start_time: Joi.string().allow(''),
  willing_change_end_time: Joi.string().allow(''),
  interest_id: Joi.number().positive().integer().allow(''),
  offset: Joi.number().integer().required().allow(0),
  count: Joi.number().positive().integer().required()
});

let registerUserDetail = Joi.object().keys({
  member_id: Joi.string().required()
});

let userNotificationList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});
let userNotificationPush = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let invitedUserList = Joi.object().keys({
  tel: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let invitedUserAdd = Joi.object().keys({
  username: Joi.string().required(),
  tel: Joi.string().required(),
  referral: Joi.string().required().allow('')
});

let userUpdateList = Joi.object().keys({
  nickname: Joi.string().allow(''),
  tel: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let userUpdateDetail = Joi.object().keys({
  id: Joi.number().positive().integer().required()
});
let activityCreate = Joi.object().keys({
  uuid: Joi.string().required(),
  user_id: Joi.number().positive().integer().required(),
  first_type: Joi.string().required(),
  second_type: Joi.string().required(),
  title: Joi.string().required(),
  picture_path: Joi.string().required(),
  content: Joi.string().required(),
  address: Joi.string().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required(),
  city: Joi.string().required()
});

let activityList = Joi.object().keys({
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let activityUserList = Joi.object().keys({
  article_id: Joi.string().required(),
  nickname: Joi.string().allow(''),
  tel: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let activityCommentList = Joi.object().keys({
  article_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let activityEdit = Joi.object().keys({
  article_id: Joi.string().required(),
  user_id: Joi.number().positive().integer().required(),
  first_type: Joi.string().required(),
  second_type: Joi.string().required(),
  title: Joi.string().required(),
  picture_path: Joi.string().required(),
  content: Joi.string().required(),
  address: Joi.string().required(),
  start_time: Joi.string().required(),
  end_time: Joi.string().required()
});

let activityDelete = Joi.object().keys({
  article_id: Joi.string().required()
});

let reviewArticle = Joi.object().keys({
  article_id: Joi.string().required()
});

let dealerCenter = Joi.object().keys({
  province_id: Joi.number().positive().integer().required()
});

let dealerQueryUserList = Joi.object().keys({
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  porsche_center_id: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let dealerQueryUserDetail = Joi.object().keys({
  member_id: Joi.string().required()
});

let dealerQueryMsgList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let dealerQueryMsgPush = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let driveUserList = Joi.object().keys({
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  trial_drive_start_time: Joi.string().allow(''),
  trial_drive_end_time: Joi.string().allow(''),
  porsche_center_id: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let driveUserDetail = Joi.object().keys({
  member_id: Joi.string().required()
});

let driveMsgList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let driveMsgPush = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let notificationPush = Joi.object().keys({
  manager_id: Joi.number().positive().integer(),
  content: Joi.string().required()
});

let feedbackMsgList = Joi.object().keys({
  start_time: Joi.string().allow(''),
  end_time: Joi.string().allow(''),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let replyMsg = Joi.object().keys({
  uuid: Joi.string().required(),
  manager_id: Joi.number().positive().integer().required(),
  member_id: Joi.string().required(),
  content: Joi.string().required()
});

let pushMsgList = Joi.object().keys({
  member_id: Joi.string().required(),
  offset: Joi.number().positive().integer().required().allow(0),
  count: Joi.number().positive().integer().required().allow(0)
});

let userDetail = Joi.object().keys({
  member_id: Joi.string().required()
});



module.exports = {
  validate: validate,
  getPicture: getPicture,
  memberSignin: memberSignin,
  memberRegister: memberRegister,
  managerSignin: managerSignin,
  showList: showList,
  showDetail: showDetail,
  showArticleUpvote: showArticleUpvote,
  showCommentUpvote: showCommentUpvote,
  showCommentList: showCommentList,
  showCommentAdd: showCommentAdd,
  showReplyComment: showReplyComment,
  showShareAdd: showShareAdd,
  driverDetail: driverDetail,
  driverCommentUpvote: driverCommentUpvote,
  driverReplyComment: driverReplyComment,
  driverCommentList: driverCommentList,
  driverCommentAdd: driverCommentAdd,
  driverApply: driverApply,
  fmDetail: fmDetail,
  fmArticleUpvote: fmArticleUpvote,
  fmCommentList: fmCommentList,
  fmCommentAdd: fmCommentAdd,
  fmCommentReply: fmCommentReply,
  fmCommentUpvote: fmCommentUpvote,
  fmApply: fmApply,
  offlineDetail: offlineDetail,
  offlineApply: offlineApply,
  offlineCenter: offlineCenter,
  offlinePorscheAddr: offlinePorscheAddr,
  offlineDealer: offlineDealer,
  offlineDrive: offlineDrive,
  personalUserInfo: personalUserInfo,
  personalCity: personalCity,
  personalBrowse: personalBrowse,
  personalBrowseDelete: personalBrowseDelete,
  personalActivityList: personalActivityList,
  notificationList: notificationList,
  notificationRead: notificationRead,
  notificationDelete: notificationDelete,
  notificationReply: notificationReply,
  postList: postList,
  postDelete: postDelete,
  registerUserList: registerUserList,
  registerUserDetail: registerUserDetail,
  userNotificationList: userNotificationList,
  userNotificationPush: userNotificationPush,
  invitedUserList: invitedUserList,
  invitedUserAdd: invitedUserAdd,
  userUpdateList: userUpdateList,
  userUpdateDetail: userUpdateDetail,
  activityCreate: activityCreate,
  activityList: activityList,
  activityUserList: activityUserList,
  activityCommentList: activityCommentList,
  activityEdit: activityEdit,
  activityDelete: activityDelete,
  reviewArticle: reviewArticle,
  dealerCenter: dealerCenter,
  dealerQueryUserList: dealerQueryUserList,
  dealerQueryUserDetail: dealerQueryUserDetail,
  dealerQueryMsgList: dealerQueryMsgList,
  dealerQueryMsgPush: dealerQueryMsgPush,
  driveUserList: driveUserList,
  driveUserDetail: driveUserDetail,
  driveMsgList: driveMsgList,
  driveMsgPush: driveMsgPush,
  notificationPush: notificationPush,
  feedbackMsgList: feedbackMsgList,
  replyMsg: replyMsg,
  pushMsgList: pushMsgList,
  userDetail: userDetail
};
