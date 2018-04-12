const {
  pool,
  queryFormat,
  P
} = require('./utils');
const KnownErrors = require('./error');

// 返回挚享fm列表
let getFMList = async function (options) {
  let wherestr = '';
  if (options.startDate && options.startDate) {
    wherestr += queryFormat(' and ((start_time > ? and start_time  < ?) or (end_time > ? and end_time < ?))', [options.startDate, options.endDate, options.startDate, options.endDate]);
  }
  let sql = queryFormat('select uuid, start_time,end_time,title,second_type,address,city,visit_count,join_count,picture_path,created_time from  tb_article  where first_type = ? and user_type = ?' + wherestr + ' order by created_time desc', ['FM', 'MANAGER']);
  let result = await P(pool, 'query', sql);
  return result;
};


// 获取资讯详情  //获取活动详情
let getFMDetail = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('select t1.title,t1.content,t1.picture_path,t2.nickname,t1.upvote_count,t1.start_time,t1.end_time,t1.address,t1.city,t1.join_count,t1.second_type from (select uuid,user_id,title,content,picture_path,upvote_count,start_time,end_time,address,city,join_count,second_type from tb_article  where uuid = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid', [options.article_id]);
  let result = await P(pool, 'query', sql);
  let upvote_status = 'N';
  let upvote_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'UPVOTE']);
  let upvote_result = await P(pool, 'query', upvote_sql);
  if (upvote_result.length > 0) upvote_status = 'Y';

  let join_status = 'N';
  let join_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'JOIN']);
  let join_result = await P(pool, 'query', join_sql);
  if (join_result.length > 0) join_status = 'Y';

  let activity_is_end = 'N';
  if (Number(result[0].end_time) < Number(time)) activity_is_end = 'Y';

  // 修改浏览数量
  let visit_sql = queryFormat('update tb_article set visit_count = visit_count + 1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', visit_sql);

  return {
    article: result[0],
    upvote_status: upvote_status,
    join_status: join_status,
    activity_is_end: activity_is_end
  };
};

// 获取评论列表
let fmCommentList = async function (options) {
  let commentList = [];
  let sql = queryFormat('select t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.upvote_count from (select uuid, created_time,user_id,content,picture_path,upvote_count from tb_article_comment  where article_id = ? and user_type = ? and comment_level = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid limit ?,? ', [options.article_id, 'MEMBER', 'FIRST', parseInt(options.offset), parseInt(options.count)]);
  let result = await P(pool, 'query', sql);
  for (let i = 0; i < result.length; i++) {
    let comment = result[i];
    let sql_member_comment = queryFormat('select t2.avatar,t2.nickname,t1.uuid,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from (select uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ?) t1 left join tb_member t2 on t1.user_id = t2.uuid', [options.article_id, comment.uuid, 'MEMBER', 'SECOND']);
    let sql_member_comment_result = await P(pool, 'query', sql_member_comment);

    let sql_manager_comment = queryFormat('select t2.role,t1.uuid,t2.account as nickname,t1.created_time,t1.user_id,t1.content,t1.picture_path,t1.user_type from (select uuid,created_time,user_id,content,picture_path,user_type from tb_article_comment where article_id = ? and to_comment_id = ? and user_type = ? and comment_level = ?) t1 left join tb_admin t2 on t1.user_id = t2.id', [options.article_id, comment.uuid, 'MANAGER', 'SECOND']);
    let sql_manager_comment_result = await P(pool, 'query', sql_manager_comment);
    let sql_comment_result = sql_manager_comment_result.concat(sql_member_comment_result);
    comment.commentList = sql_comment_result;

    let sql_comment_status = queryFormat('select * from tb_comment_upvote where comment_id = ? and member_id = ?', [comment.uuid, options.member_id]);
    let sql_comment_status_result = await P(pool, 'query', sql_comment_status);
    if (sql_comment_status_result.length > 0) {
      comment.upvote_status = 'Y';
    } else {
      comment.upvote_status = 'N';
    }

    commentList.push(comment);
  }
  let query = queryFormat('select count(1) as count from tb_article_comment  where article_id = ? and user_type = ? and comment_level = ?', [options.article_id, 'MEMBER', 'FIRST']);
  let queryResult = await P(pool, 'query', query);
  return {
    rows: commentList,
    count: queryResult[0].count
  };
};

// 对活动感兴趣
let fmArticleUpvote = async function (options) {
  let upvote_sql = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'UPVOTE']);
  let upvote_result = await P(pool, 'query', upvote_sql);
  if (upvote_result.length === 0) {
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_member_action set article_id = ?,member_id = ?,action = ?,created_time = ?,visit_url = ?', [options.article_id, options.member_id, 'UPVOTE', time, options.visit_url]);
    await P(pool, 'query', sql);
    //更新文章中点赞数
    let article_sql = queryFormat('update tb_article set upvote_count = upvote_count +1 where uuid = ? ', [options.article_id]);
    await P(pool, 'query', article_sql);
    let upvote_count_sql = queryFormat('select upvote_count from tb_article  where uuid = ? ', [options.article_id]);
    let upvote_count_result = await P(pool, 'query', upvote_count_sql);
    return {
      upvote_count: upvote_count_result[0].upvote_count,
      upvote_status: 'Y'
    };
  } else {
    let sql = queryFormat('delete from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'UPVOTE']);
    await P(pool, 'query', sql);
    let article_sql = queryFormat('update tb_article set upvote_count = upvote_count-1 where uuid = ? ', [options.article_id]);
    await P(pool, 'query', article_sql);
    let upvote_count_sql = queryFormat('select upvote_count from tb_article  where uuid = ? ', [options.article_id]);
    let upvote_count_result = await P(pool, 'query', upvote_count_sql);
    return {
      upvote_count: upvote_count_result[0].upvote_count,
      upvote_status: 'N'
    };
  }

};

// 添加评论接口
let fmCommentAdd = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,created_time = ?,picture_path = ?,type = ?,user_type = ?,comment_level = ?,upvote_count = ?', [options.uuid, options.article_id, options.member_id, options.content, time, options.picture_path, options.type, 'MEMBER', 'FIRST', 0]);
  await P(pool, 'query', sql);
};
//回复评论的评论接口

let fmCommentReply = async function (options) {
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_article_comment set uuid = ?, article_id = ?,user_id = ?,content = ?,to_comment_id = ?,created_time = ?,picture_path = ?,type = ?,user_type =?,comment_level = ?', [options.uuid, options.article_id, options.member_id, options.content, options.to_comment_id, time, options.picture_path, options.type, 'MEMBER', 'SECOND']);
  await P(pool, 'query', sql);
};

// 评论点赞
let fmCommentUpvote = async function (options) {
  let upvote_sql = queryFormat('select * from tb_comment_upvote where comment_id = ? and member_id = ?', [options.comment_id, options.member_id]);
  let result = await P(pool, 'query', upvote_sql);
  if (result.length === 0) {
    let time = new Date().getTime();
    let sql = queryFormat('insert into tb_comment_upvote set comment_id = ?,member_id = ?,created_time = ?', [options.comment_id, options.member_id, time]);
    await P(pool, 'query', sql);
    let upvote_count_sql = queryFormat('update tb_article_comment set upvote_count = upvote_count +1 where uuid = ?', [options.comment_id]);
    await P(pool, 'query', upvote_count_sql);
  } else {
    let sql = queryFormat('delete from tb_comment_upvote where comment_id = ? and member_id = ?', [options.comment_id, options.member_id]);
    await P(pool, 'query', sql);
    let upvote_count_sql = queryFormat('update tb_article_comment set upvote_count = upvote_count -1 where uuid = ?', [options.comment_id]);
    await P(pool, 'query', upvote_count_sql);
  }

};

//  申请参与
let apply = async function (options) {
  let query = queryFormat('select * from tb_member_action where article_id = ? and member_id = ? and action = ?', [options.article_id, options.member_id, 'JOIN']);
  let result = await P(pool, 'query', query);
  if (result.length > 0) throw new KnownErrors.ErrorAlreadyExist();
  let time = new Date().getTime();
  let sql = queryFormat('insert into tb_member_action set article_id = ?,member_id = ?,action = ?,created_time =?', [options.article_id, options.member_id, 'JOIN', time]);
  await P(pool, 'query', sql);
  let join_count_sql = queryFormat('update tb_article set join_count = join_count +1 where uuid = ?', [options.article_id]);
  await P(pool, 'query', join_count_sql);

  let article_join_count_sql = queryFormat('select join_count from tb_article  where uuid = ? ', [options.article_id]);
  let article_join_count_result = await P(pool, 'query', article_join_count_sql);
  return {
    join_count: article_join_count_result[0].join_count
  };
};

module.exports = {
  getFMList: getFMList,
  getFMDetail: getFMDetail,
  fmCommentList: fmCommentList,
  fmArticleUpvote: fmArticleUpvote,
  fmCommentAdd: fmCommentAdd,
  fmCommentReply: fmCommentReply,
  fmCommentUpvote: fmCommentUpvote,
  apply: apply
};
